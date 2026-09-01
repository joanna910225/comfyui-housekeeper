import { expect, test } from '@playwright/test'
import {
  addGroup,
  alignmentButton,
  byTitle,
  groupSnapshots,
  installGraph,
  openComfyUI,
  openHousekeeper,
  previewRects,
  selectNodes,
  setPinned,
  snapshots
} from './helpers/comfyui'

// #65: the Spacing control used to be a promise about the NEXT alignment - you moved it, then
// went back and clicked the alignment again to find out what you had picked. It now repeats
// the alignment you last applied while you are still holding the slider.
//
// The half of that worth testing hardest is undo. Re-laying the graph out on every input event
// is easy; doing it without burying the user's history under one entry per event is the part
// that goes wrong, and the part a "the nodes moved" assertion would not notice at all. Hence
// undoDepth(): a drag across a dozen values has to leave exactly one entry behind.

type Page = import('@playwright/test').Page

// ComfyUI keys undo off the platform's primary modifier, like the rest of the suite.
const MOD = process.platform === 'darwin' ? 'Meta' : 'Control'
const SETTING_ID = 'Housekeeper.NodeSpacing'

const spacingSlider = (page: Page) => page.locator('.housekeeper-spacing-slider')
const spacingReadout = (page: Page) => page.locator('.housekeeper-spacing-value')

const spacingValue = async (page: Page) => Number(await spacingSlider(page).inputValue())

const getSpacing = (page: Page) =>
  page.evaluate(id => (window as any).app.extensionManager.setting.get(id), SETTING_ID)

const positions = async (page: Page) =>
  (await snapshots(page)).map(({ title, x, y }) => ({ title, x, y }))

/**
 * How many entries ComfyUI's undo history holds.
 *
 * Read from the live ChangeTracker rather than inferred from repeated Ctrl+Z, so the test can
 * state the actual claim - "this whole gesture recorded one entry" - instead of approximating
 * it. Throws rather than degrading if the path moves, so a frontend change shows up as a
 * failure here instead of as a test that quietly stops checking anything.
 */
async function undoDepth(page: Page): Promise<number> {
  return page.evaluate(() => {
    const tracker = (window as any).app?.extensionManager?.workflow?.activeWorkflow?.changeTracker
    if (!tracker || !Array.isArray(tracker.undoQueue)) {
      throw new Error('could not reach the ChangeTracker undo queue - has the frontend moved it?')
    }
    return tracker.undoQueue.length as number
  })
}

/** Count the slider's input events, to prove a drag really did pass through many values. */
async function countSliderInput(page: Page) {
  await page.evaluate(() => {
    const slider = document.querySelector('.housekeeper-spacing-slider')
    if (!slider) throw new Error('no spacing slider')
    ;(window as any).__hkSliderInputs = 0
    slider.addEventListener('input', () => {
      ;(window as any).__hkSliderInputs++
    })
  })
  return () => page.evaluate(() => (window as any).__hkSliderInputs as number)
}

/**
 * Press the pointer on the slider track and drag along it, WITHOUT releasing.
 *
 * A real pointer drag rather than fill(): the feature is about what happens between pressing
 * and releasing, and fill() jumps straight to a settled value with both events already fired.
 * Returns the value the slider is now showing - asserting against that rather than against a
 * hard-coded number keeps the test honest about the track's pixel-to-value mapping.
 */
async function dragSpacingSlider(page: Page, fractions: number[]) {
  const box = await spacingSlider(page).boundingBox()
  if (!box) throw new Error('the spacing slider is not visible')
  const at = (fraction: number) => box.x + box.width * fraction
  const midline = box.y + box.height / 2

  await page.mouse.move(at(fractions[0]), midline)
  await page.mouse.down()
  for (const fraction of fractions.slice(1)) {
    await page.mouse.move(at(fraction), midline)
    await page.waitForTimeout(25)
  }
  // Let the pending animation frame land before anything is measured.
  await page.waitForTimeout(150)
  return spacingValue(page)
}

async function releaseSpacingSlider(page: Page) {
  await page.mouse.up()
  await page.waitForTimeout(150)
}

/** Right-to-left across most of the track: enough separate values to matter to undo. */
const LONG_DRAG = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.75, 0.6, 0.45]

async function verticalGaps(page: Page) {
  const nodes = (await snapshots(page)).sort((a, b) => a.y - b.y)
  const gaps: number[] = []
  for (let i = 1; i < nodes.length; i++) {
    gaps.push(nodes[i].y - (nodes[i - 1].y + nodes[i - 1].height))
  }
  return gaps
}

async function horizontalGaps(page: Page) {
  const nodes = (await snapshots(page)).sort((a, b) => a.x - b.x)
  const gaps: number[] = []
  for (let i = 1; i < nodes.length; i++) {
    gaps.push(nodes[i].x - (nodes[i - 1].x + nodes[i - 1].width))
  }
  return gaps
}

const threeNodes = (page: Page) =>
  installGraph(page, [
    { title: 'short', x: 420, y: 40, width: 150, height: 70 },
    { title: 'medium', x: 80, y: 260, width: 190, height: 130 },
    { title: 'tall', x: 700, y: 520, width: 220, height: 210 }
  ])

test.describe('live spacing preview', () => {
  test.beforeEach(async ({ page }) => {
    // openComfyUI() restores the spacing baseline (30) along with ComfyUI's own UI state.
    await openComfyUI(page)
    await openHousekeeper(page)
  })

  test('the nodes follow the slider while it is still being dragged', async ({ page }) => {
    await threeNodes(page)
    await alignmentButton(page, 'Align left edges').click()
    expect(await verticalGaps(page)).toEqual([30, 30])

    // Still held down: this is the whole point of the issue, seeing the result before
    // committing to it.
    const held = await dragSpacingSlider(page, [0.2, 0.4, 0.6, 0.8])
    expect(held).toBeGreaterThan(30)
    expect(await verticalGaps(page)).toEqual([held, held])

    await releaseSpacingSlider(page)
    expect(await verticalGaps(page)).toEqual([held, held])
    expect(await getSpacing(page)).toBe(held)
  })

  test('a drag across a dozen values records exactly one undo entry', async ({ page }) => {
    await threeNodes(page)
    await alignmentButton(page, 'Align left edges').click()
    const aligned = await positions(page)

    const inputCount = await countSliderInput(page)
    const before = await undoDepth(page)

    const held = await dragSpacingSlider(page, LONG_DRAG)
    // Mid-gesture the graph has been rewritten many times over and NOTHING has been recorded:
    // an entry per frame would be the easy way to write this feature and the reason a user
    // would stop trusting Ctrl+Z.
    expect(await undoDepth(page)).toBe(before)

    await releaseSpacingSlider(page)

    expect(await inputCount()).toBeGreaterThanOrEqual(8)
    expect(await undoDepth(page)).toBe(before + 1)
    expect(await verticalGaps(page)).toEqual([held, held])
    expect(await positions(page)).not.toEqual(aligned)
  })

  test('one Ctrl+Z after a drag restores the layout the drag started from', async ({ page }) => {
    await threeNodes(page)
    const scattered = await positions(page)

    await alignmentButton(page, 'Align left edges').click()
    const aligned = await positions(page)
    expect(aligned).not.toEqual(scattered)

    // ComfyUI squashes a completed history state after 50ms. Playwright can jump from the
    // button to the slider in under 40ms, unlike a pointer, so let that previous transaction
    // settle before this test opens the next one.
    await page.evaluate(() => new Promise(resolve => window.setTimeout(resolve, 75)))

    await dragSpacingSlider(page, LONG_DRAG)
    await releaseSpacingSlider(page)
    expect(await positions(page)).not.toEqual(aligned)

    // No blur first: releasing a drag hands the keyboard back to the canvas precisely so that
    // this works. ComfyUI's ChangeTracker drops every keystroke while an <input> holds focus,
    // so a slider that kept focus would swallow the Ctrl+Z the user reaches for next.
    await page.keyboard.press(`${MOD}+z`)
    await page.waitForTimeout(500)
    expect(await positions(page)).toEqual(aligned)

    // And the entry underneath it is still the alignment itself - the drag left one entry in
    // the history, not a dozen.
    await page.keyboard.press(`${MOD}+z`)
    await page.waitForTimeout(500)
    expect(await positions(page)).toEqual(scattered)
  })

  test('group-member spacing refits live and undoes nodes and frame together', async ({ page }) => {
    await threeNodes(page)
    await addGroup(page, { title: 'members', x: 40, y: 10, width: 950, height: 800 })
    await alignmentButton(page, 'Align left edges').click()
    await page.waitForTimeout(75)

    const alignedNodes = await positions(page)
    const alignedGroup = (await groupSnapshots(page))[0]
    const before = await undoDepth(page)

    await dragSpacingSlider(page, LONG_DRAG)
    const duringGroup = (await groupSnapshots(page))[0]
    expect(duringGroup.members).toEqual(alignedGroup.members)
    expect(duringGroup).not.toEqual(alignedGroup)
    expect(await undoDepth(page)).toBe(before)

    await releaseSpacingSlider(page)
    expect(await undoDepth(page)).toBe(before + 1)

    await page.keyboard.press(`${MOD}+z`)
    await page.waitForTimeout(500)
    expect(await positions(page)).toEqual(alignedNodes)
    expect((await groupSnapshots(page))[0]).toEqual(alignedGroup)
  })

  test('unsafe group-member spacing rolls back and warns once the gesture ends', async ({
    page
  }) => {
    await installGraph(page, [
      { title: 'member-a', x: 100, y: 100, width: 180, height: 100 },
      { title: 'member-b', x: 330, y: 150, width: 180, height: 100 },
      { title: 'outsider', x: 100, y: 500, width: 180, height: 100 }
    ])
    await addGroup(page, { title: 'members', x: 80, y: 70, width: 450, height: 210 })
    await selectNodes(page, ['member-a', 'member-b'])
    await alignmentButton(page, 'Align left edges').click()
    await page.waitForTimeout(75)

    const alignedNodes = await positions(page)
    const alignedGroup = (await groupSnapshots(page))[0]
    await dragSpacingSlider(page, [0.2, 0.6, 1])
    await releaseSpacingSlider(page)

    expect(await positions(page)).toEqual(alignedNodes)
    expect((await groupSnapshots(page))[0]).toEqual(alignedGroup)
    await expect(
      page.getByText(
        'Cannot arrange without changing group membership. Move the nodes away from nearby groups and try again.',
        { exact: true }
      )
    ).toBeVisible()
  })

  test('the drag repeats the alignment that was last applied, not a fixed one', async ({ page }) => {
    await threeNodes(page)
    // Align top stacks along the other axis, so a live drag has to widen the horizontal gaps.
    await alignmentButton(page, 'Align top edges').click()
    expect(await horizontalGaps(page)).toEqual([30, 30])

    const held = await dragSpacingSlider(page, [0.2, 0.5, 0.8])
    expect(await horizontalGaps(page)).toEqual([held, held])

    const tops = new Set((await snapshots(page)).map(node => node.y))
    expect(tops.size).toBe(1)

    await releaseSpacingSlider(page)
  })

  test('flow arrangement is previewed too', async ({ page }) => {
    await installGraph(
      page,
      [
        { title: 'root', x: 60, y: 60, width: 160, height: 90 },
        { title: 'branch-a', x: 400, y: 40, width: 160, height: 90 },
        { title: 'branch-b', x: 400, y: 320, width: 160, height: 90 }
      ],
      [
        ['root', 'branch-a'],
        ['root', 'branch-b']
      ]
    )

    await alignmentButton(page, 'Arrange dependency stages left to right').click()
    const held = await dragSpacingSlider(page, [0.2, 0.4, 0.6])

    // branch-a and branch-b share a column, so the gap being dragged separates them.
    const branches = (await snapshots(page))
      .filter(node => node.title.startsWith('branch'))
      .sort((a, b) => a.y - b.y)
    expect(branches).toHaveLength(2)
    expect(branches[1].y - (branches[0].y + branches[0].height)).toBe(held)

    await releaseSpacingSlider(page)
  })

  test('a pinned node stays put while the rest re-space live', async ({ page }) => {
    await installGraph(page, [
      { title: 'free-a', x: 400, y: 60, width: 180, height: 120 },
      { title: 'anchored', x: 90, y: 300, width: 200, height: 140 },
      { title: 'free-b', x: 660, y: 540, width: 180, height: 120 }
    ])
    await setPinned(page, 'anchored', true)

    await alignmentButton(page, 'Align left edges').click()
    const pinnedBefore = byTitle(await snapshots(page), 'anchored')

    const held = await dragSpacingSlider(page, [0.2, 0.5, 0.85])
    const during = await snapshots(page)

    // The two free nodes are following the slider...
    const free = [byTitle(during, 'free-a'), byTitle(during, 'free-b')].sort((a, b) => a.y - b.y)
    expect(free[1].y - (free[0].y + free[0].height)).toBe(held)
    // ...and the pinned one has not moved a pixel, mid-gesture included.
    expect(byTitle(during, 'anchored').x).toBe(pinnedBefore.x)
    expect(byTitle(during, 'anchored').y).toBe(pinnedBefore.y)

    await releaseSpacingSlider(page)
    const after = await snapshots(page)
    expect(byTitle(after, 'anchored').x).toBe(pinnedBefore.x)
    expect(byTitle(after, 'anchored').y).toBe(pinnedBefore.y)
  })

  test('the hover preview does not draw over a live drag', async ({ page }) => {
    await threeNodes(page)
    await alignmentButton(page, 'Align left edges').click()
    await dragSpacingSlider(page, [0.2, 0.5, 0.8])

    // The hover preview draws dashed rectangles where nodes are ABOUT to go, computed from
    // where they are now - which during a drag stops being true on the next frame. Delivered
    // as a synthetic mouseenter because a real hover cannot happen while the pointer is
    // holding the slider, and focusing the button would move focus off it and end the drag.
    await page.evaluate(() => {
      const button = document.querySelector('.hk-button[data-alignment-type="left"]')
      if (!button) throw new Error('no align-left button')
      button.dispatchEvent(new MouseEvent('mouseenter'))
    })
    await page.waitForTimeout(100)
    expect(await previewRects(page)).toEqual([])

    await releaseSpacingSlider(page)
  })

  test('typing an exact value applies it to the last alignment as well', async ({ page }) => {
    await threeNodes(page)
    await alignmentButton(page, 'Align left edges').click()
    const before = await undoDepth(page)

    await spacingReadout(page).fill('90')
    await spacingReadout(page).press('Enter')
    await page.waitForTimeout(300)

    expect(await verticalGaps(page)).toEqual([90, 90])
    // One value, one entry - the same accounting as a drag.
    expect(await undoDepth(page)).toBe(before + 1)
  })

  // The two below are the boundaries of the feature: they pass against the old build too,
  // and exist so that a later change cannot widen "preview" into "rearrange the graph
  // whenever a number changes".

  test('with nothing selected the slider only changes the setting', async ({ page }) => {
    await threeNodes(page)
    await alignmentButton(page, 'Align left edges').click()
    await selectNodes(page, [])

    const before = await positions(page)
    const undoBefore = await undoDepth(page)
    const held = await dragSpacingSlider(page, LONG_DRAG)
    expect(await positions(page)).toEqual(before)

    await releaseSpacingSlider(page)
    expect(await positions(page)).toEqual(before)
    expect(await undoDepth(page)).toBe(undoBefore)
    expect(await getSpacing(page)).toBe(held)
  })

  test('with nothing aligned yet the slider only changes the setting', async ({ page }) => {
    // Nodes are selected, but the user has not chosen a layout - there is nothing to repeat,
    // and picking one for them would rearrange a graph they only wanted to set a number for.
    await threeNodes(page)

    const before = await positions(page)
    const undoBefore = await undoDepth(page)
    const held = await dragSpacingSlider(page, LONG_DRAG)
    await releaseSpacingSlider(page)

    expect(await positions(page)).toEqual(before)
    expect(await undoDepth(page)).toBe(undoBefore)
    expect(await getSpacing(page)).toBe(held)
  })
})
