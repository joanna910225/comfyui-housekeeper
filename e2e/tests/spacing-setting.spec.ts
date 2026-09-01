import { expect, test } from '@playwright/test'
import {
  alignmentButton,
  installGraph,
  openComfyUI,
  openHousekeeper,
  snapshots
} from './helpers/comfyui'

const SETTING_ID = 'Housekeeper.NodeSpacing'
type Page = import('@playwright/test').Page

const setSpacing = (page: Page, value: number) =>
  page.evaluate(
    ([id, v]) => (window as any).app.extensionManager.setting.set(id as string, v),
    [SETTING_ID, value] as const
  )

const getSpacing = (page: Page) =>
  page.evaluate(id => (window as any).app.extensionManager.setting.get(id), SETTING_ID)

/** Vertical gaps between consecutive nodes once they are stacked in a column. */
async function verticalGaps(page: Page) {
  const nodes = (await snapshots(page)).sort((a, b) => a.y - b.y)
  const gaps: number[] = []
  for (let i = 1; i < nodes.length; i++) {
    gaps.push(nodes[i].y - (nodes[i - 1].y + nodes[i - 1].height))
  }
  return gaps
}

/** Horizontal gaps once nodes are laid out in a row. */
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

test.describe('configurable node spacing', () => {
  test.beforeEach(async ({ page }) => {
    // openComfyUI() restores the spacing baseline along with ComfyUI's own UI state.
    await openComfyUI(page)
    await openHousekeeper(page)
  })

  test('the setting is registered with the documented default', async ({ page }) => {
    expect(await getSpacing(page)).toBe(30)
  })

  test('the default reproduces the previous fixed 30px gap', async ({ page }) => {
    // Guards the whole change: with the setting untouched, layout must be byte-for-byte
    // what it was before spacing became configurable.
    await threeNodes(page)
    await alignmentButton(page, 'Align left edges').click()
    expect(await verticalGaps(page)).toEqual([30, 30])
  })

  test('a larger value widens the gap when aligning vertically', async ({ page }) => {
    // This is what #20 asked for: same alignment, more room between the nodes.
    await threeNodes(page)
    await setSpacing(page, 90)
    await alignmentButton(page, 'Align left edges').click()
    expect(await verticalGaps(page)).toEqual([90, 90])
  })

  test('a smaller value tightens the gap', async ({ page }) => {
    await threeNodes(page)
    await setSpacing(page, 5)
    await alignmentButton(page, 'Align left edges').click()
    expect(await verticalGaps(page)).toEqual([5, 5])
  })

  test('zero spacing is allowed and produces touching nodes', async ({ page }) => {
    await threeNodes(page)
    await setSpacing(page, 0)
    await alignmentButton(page, 'Align left edges').click()
    expect(await verticalGaps(page)).toEqual([0, 0])
  })

  test('the setting applies to horizontal alignment too', async ({ page }) => {
    await threeNodes(page)
    await setSpacing(page, 70)
    await alignmentButton(page, 'Align top edges').click()
    expect(await horizontalGaps(page)).toEqual([70, 70])
  })

  test('the setting applies to flow arrangement', async ({ page }) => {
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

    await setSpacing(page, 80)
    // The H-Flow control names the direction in which dependency stages advance.
    await alignmentButton(page, 'Arrange dependency stages left to right').click()

    // branch-a and branch-b share a column, so the configured gap separates them.
    const nodes = (await snapshots(page)).filter(n => n.title.startsWith('branch')).sort((a, b) => a.y - b.y)
    expect(nodes).toHaveLength(2)
    expect(nodes[1].y - (nodes[0].y + nodes[0].height)).toBe(80)
  })

  test('a change takes effect without reloading', async ({ page }) => {
    await threeNodes(page)
    await alignmentButton(page, 'Align left edges').click()
    expect(await verticalGaps(page)).toEqual([30, 30])

    await setSpacing(page, 60)
    await alignmentButton(page, 'Align left edges').click()
    expect(await verticalGaps(page)).toEqual([60, 60])
  })

  test('the value survives a reload', async ({ page }) => {
    await setSpacing(page, 45)

    // Deliberately NOT openComfyUI() here: that restores the baseline, which is exactly what
    // this test needs to survive. Reload and wait for the app directly instead.
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForFunction(() => {
      const app = (window as any).app
      return Boolean(app?.graph && app?.canvas && (window as any).LiteGraph)
    })
    await openHousekeeper(page)

    expect(await getSpacing(page)).toBe(45)
    await threeNodes(page)
    await alignmentButton(page, 'Align left edges').click()
    expect(await verticalGaps(page)).toEqual([45, 45])
  })

  test('an out-of-range value is clamped rather than producing a broken layout', async ({ page }) => {
    await threeNodes(page)
    await setSpacing(page, -500)
    await alignmentButton(page, 'Align left edges').click()

    const gaps = await verticalGaps(page)
    for (const gap of gaps) expect(gap).toBeGreaterThanOrEqual(0)
  })
})

test.describe('in-panel spacing control', () => {
  test.beforeEach(async ({ page }) => {
    await openComfyUI(page)
    await openHousekeeper(page)
  })

  test.afterEach(async ({ page }) => {
    await setSpacing(page, 30)
  })

  test('the control is visible in the panel', async ({ page }) => {
    // #23 asked for this "in the UI", and the panel is where the buttons it affects live -
    // ComfyUI's global settings dialog is a context switch away from the work.
    await expect(page.locator('.housekeeper-spacing-slider')).toBeVisible()
    await expect(page.locator('.housekeeper-spacing-value')).toBeVisible()
    await expect(page.locator('.housekeeper-spacing-value')).toHaveValue('30')
  })

  test('typing a value changes the spacing actually applied', async ({ page }) => {
    await page.locator('.housekeeper-spacing-value').fill('75')
    await page.locator('.housekeeper-spacing-value').press('Enter')
    await page.waitForTimeout(200)

    expect(await getSpacing(page)).toBe(75)

    await threeNodes(page)
    await alignmentButton(page, 'Align left edges').click()
    expect(await verticalGaps(page)).toEqual([75, 75])
  })

  test('the slider changes the spacing applied', async ({ page }) => {
    await page.locator('.housekeeper-spacing-slider').fill('120')
    await page.waitForTimeout(200)

    expect(await getSpacing(page)).toBe(120)
    await expect(page.locator('.housekeeper-spacing-value')).toHaveValue('120')

    await threeNodes(page)
    await alignmentButton(page, 'Align left edges').click()
    expect(await verticalGaps(page)).toEqual([120, 120])
  })

  test('the panel control and ComfyUI settings stay in sync', async ({ page }) => {
    // Changing it in ComfyUI's settings dialog must not leave the panel showing a stale value.
    await setSpacing(page, 65)
    await page.waitForTimeout(300)
    await expect(page.locator('.housekeeper-spacing-value')).toHaveValue('65')
    await expect(page.locator('.housekeeper-spacing-slider')).toHaveValue('65')
  })

  test('the control persists its value across a reload', async ({ page }) => {
    await page.locator('.housekeeper-spacing-value').fill('55')
    await page.locator('.housekeeper-spacing-value').press('Enter')
    await page.waitForTimeout(200)

    // Not openComfyUI(): that restores the baseline this test needs to survive.
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForFunction(() => {
      const app = (window as any).app
      return Boolean(app?.graph && app?.canvas && (window as any).LiteGraph)
    })
    await openHousekeeper(page)

    await expect(page.locator('.housekeeper-spacing-value')).toHaveValue('55')
  })

  test('a nonsense entry falls back rather than breaking layout', async ({ page }) => {
    await page.locator('.housekeeper-spacing-value').fill('-40')
    await page.locator('.housekeeper-spacing-value').press('Enter')
    await page.waitForTimeout(200)

    const shown = Number(await page.locator('.housekeeper-spacing-value').inputValue())
    expect(shown).toBeGreaterThanOrEqual(0)

    await threeNodes(page)
    await alignmentButton(page, 'Align left edges').click()
    for (const gap of await verticalGaps(page)) expect(gap).toBeGreaterThanOrEqual(0)
  })
})
