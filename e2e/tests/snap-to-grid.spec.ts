import { expect, test, type Page } from '@playwright/test'
import {
  addGroup,
  alignmentButton,
  byTitle,
  enterSubgraph,
  groupSnapshots,
  installGraph,
  openComfyUI,
  openHousekeeper,
  RENDERER,
  selectNodes,
  selectNodesAndGroup,
  setPinned,
  snapshots
} from './helpers/comfyui'

const MOD = process.platform === 'darwin' ? 'Meta' : 'Control'
const SNAP = 'Snap positions to grid'

async function drawnPositions(page: Page): Promise<Record<string, [number, number]>> {
  return page.evaluate(() => {
    const graph = (window as any).app.canvas?.graph ?? (window as any).app.graph
    const titles = new Map<string, string>(
      graph.nodes.map((node: any) => [String(node.id), String(node.title)])
    )
    const positions: Record<string, [number, number]> = {}
    for (const element of document.querySelectorAll('.lg-node')) {
      const title = titles.get(element.getAttribute('data-node-id') ?? '')
      if (!title) continue
      const rect = element.getBoundingClientRect()
      positions[title] = [Math.round(rect.x), Math.round(rect.y)]
    }
    return positions
  })
}

test.describe('snap positions to ComfyUI grid', () => {
  test.beforeEach(async ({ page }) => {
    await openComfyUI(page)
    await openHousekeeper(page)
  })

  test('snaps one node on a 20px grid, moves no size or unselected node, and undoes once', async ({
    page
  }) => {
    await installGraph(
      page,
      [
        { title: 'selected', x: 31, y: -31, width: 183, height: 107 },
        { title: 'unselected', x: 333, y: 127, width: 191, height: 113 }
      ],
      [],
      ['selected']
    )
    const before = await snapshots(page)
    const drawnBefore = RENDERER === 'vue' ? await drawnPositions(page) : null

    await expect(alignmentButton(page, SNAP)).toBeEnabled()
    await alignmentButton(page, SNAP).click()
    await page.waitForTimeout(100)

    const after = await snapshots(page)
    expect([byTitle(after, 'selected').x, byTitle(after, 'selected').y]).toEqual([40, -40])
    expect(
      [byTitle(after, 'selected').bodyWidth, byTitle(after, 'selected').bodyHeight]
    ).toEqual([byTitle(before, 'selected').bodyWidth, byTitle(before, 'selected').bodyHeight])
    expect(byTitle(after, 'unselected')).toEqual(byTitle(before, 'unselected'))

    if (RENDERER === 'vue') {
      const drawnAfter = await drawnPositions(page)
      expect(Object.keys(drawnAfter).sort()).toEqual(['selected', 'unselected'])
      expect(drawnAfter.selected).not.toEqual(drawnBefore?.selected)
      expect(drawnAfter.unselected).toEqual(drawnBefore?.unselected)
    }

    await page.keyboard.press(`${MOD}+z`)
    await page.waitForTimeout(500)
    expect(await snapshots(page)).toEqual(before)
  })

  test('reads an odd ComfyUI grid size and handles negative coordinates', async ({ page }) => {
    await openComfyUI(page, { 'Comfy.SnapToGrid.GridSize': 21 })
    await openHousekeeper(page)
    await installGraph(page, [{ title: 'odd-grid', x: 31, y: -11 }])

    await alignmentButton(page, SNAP).click()

    const node = byTitle(await snapshots(page), 'odd-grid')
    expect([node.x, node.y]).toEqual([21, -21])
  })

  test('snaps selected groups and grouped members as atomic frame-anchored components', async ({
    page
  }) => {
    await installGraph(page, [
      { title: 'solo-a', x: 1090, y: 70 },
      { title: 'solo-b', x: 1300, y: 110 },
      { title: 'left', x: 103, y: 100 },
      { title: 'shared', x: 393, y: 70 },
      { title: 'right', x: 693, y: 20 }
    ])
    await addGroup(page, { title: 'selected-group', x: 1063, y: 31, width: 440, height: 210 })
    await addGroup(page, { title: 'left-frame', x: 63, y: 51, width: 550, height: 210 })
    await addGroup(page, { title: 'top-frame', x: 363, y: -52, width: 550, height: 240 })
    await selectNodesAndGroup(page, ['left'], 'selected-group')

    const beforeNodes = await snapshots(page)
    const beforeGroups = new Map((await groupSnapshots(page)).map(group => [group.title, group]))
    expect(beforeGroups.get('selected-group')?.members).toEqual(['solo-a', 'solo-b'])
    expect(beforeGroups.get('left-frame')?.members).toEqual(['left', 'shared'])
    expect(beforeGroups.get('top-frame')?.members).toEqual(['right', 'shared'])

    await alignmentButton(page, SNAP).click()
    await page.waitForTimeout(100)

    const afterNodes = await snapshots(page)
    const afterGroups = new Map((await groupSnapshots(page)).map(group => [group.title, group]))
    const assertTranslation = (titles: string[], dx: number, dy: number) => {
      for (const title of titles) {
        expect(byTitle(afterNodes, title).x - byTitle(beforeNodes, title).x).toBe(dx)
        expect(byTitle(afterNodes, title).y - byTitle(beforeNodes, title).y).toBe(dy)
      }
    }

    // The selected group uses its frame origin: (1063, 31) -> (1060, 40).
    expect([afterGroups.get('selected-group')?.x, afterGroups.get('selected-group')?.y]).toEqual([
      1060,
      40
    ])
    assertTranslation(['solo-a', 'solo-b'], -3, 9)

    // The member-selected connected component anchors to the minimum frame x/y, even though
    // those minima come from different frames: (63, -52) -> (60, -60).
    for (const title of ['left-frame', 'top-frame']) {
      expect(afterGroups.get(title)!.x - beforeGroups.get(title)!.x).toBe(-3)
      expect(afterGroups.get(title)!.y - beforeGroups.get(title)!.y).toBe(-8)
      expect(afterGroups.get(title)!.members).toEqual(beforeGroups.get(title)!.members)
    }
    assertTranslation(['left', 'shared', 'right'], -3, -8)
    expect(afterGroups.get('selected-group')?.members).toEqual(
      beforeGroups.get('selected-group')?.members
    )
  })

  test('skips a standalone pinned node while snapping the rest of the selection', async ({ page }) => {
    await installGraph(page, [
      { title: 'standalone-pinned', x: 31, y: 31 },
      { title: 'free', x: 53, y: 53 }
    ])
    await setPinned(page, 'standalone-pinned', true)
    await selectNodes(page, ['standalone-pinned', 'free'])
    const before = await snapshots(page)

    await alignmentButton(page, SNAP).click()
    await page.waitForTimeout(100)

    const after = await snapshots(page)
    expect(byTitle(after, 'standalone-pinned')).toEqual(byTitle(before, 'standalone-pinned'))
    expect([byTitle(after, 'free').x, byTitle(after, 'free').y]).toEqual([60, 60])
  })

  test('blocks an entire component for either a pinned group or pinned member', async ({ page }) => {
    await installGraph(page, [
      { title: 'grouped-a', x: 110, y: 90 },
      { title: 'grouped-b', x: 280, y: 90 }
    ])
    await addGroup(page, { title: 'blocked', x: 83, y: 51, width: 410, height: 180 })
    await setPinned(page, 'grouped-b', true)
    await selectNodes(page, ['grouped-a'])
    await expect(alignmentButton(page, SNAP)).toBeDisabled()

    await setPinned(page, 'grouped-b', false)
    await page.evaluate(() => {
      const graph = (window as any).app.canvas?.graph ?? (window as any).app.graph
      const group = graph.groups.find((candidate: any) => candidate.title === 'blocked')
      if (typeof group.pin === 'function') group.pin(true)
      else if ('pinned' in group) group.pinned = true
      else group.flags = { ...(group.flags ?? {}), pinned: true }
      if (!(group.pinned ?? group.flags?.pinned)) throw new Error('Could not pin group')
    })
    await selectNodes(page, ['grouped-a'])
    await expect(alignmentButton(page, SNAP)).toBeDisabled()
  })

  test('snaps the selection in the active subgraph', async ({ page }) => {
    await installGraph(page, [
      { title: 'inner', x: 451, y: -31 },
      { title: 'outer', x: 731, y: 91 }
    ])
    await enterSubgraph(page, ['inner'])
    await selectNodes(page, ['inner'])
    await alignmentButton(page, SNAP).click()
    const inner = byTitle(await snapshots(page), 'inner')
    expect([inner.x, inner.y]).toEqual([460, -40])
  })
})
