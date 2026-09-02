import { expect, test, type Page } from '@playwright/test'
import {
  addGroup,
  alignmentButton,
  byTitle,
  enterSubgraph,
  expectRectsClose,
  groupSnapshots,
  installGraph,
  openComfyUI,
  openHousekeeper,
  previewRects,
  projectedNodeRects,
  RENDERER,
  selectNodes,
  selectNodesAndGroup,
  setPinned,
  snapshots
} from './helpers/comfyui'

const MOD = process.platform === 'darwin' ? 'Meta' : 'Control'
const SNAP = 'Snap positions and sizes to grid'

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

async function drawnSizes(page: Page): Promise<Record<string, [number, number]>> {
  return page.evaluate(() => {
    const app = (window as any).app
    const graph = app.canvas?.graph ?? app.graph
    const titles = new Map<string, string>(
      graph.nodes.map((node: any) => [String(node.id), String(node.title)])
    )
    const sizes: Record<string, [number, number]> = {}
    for (const element of document.querySelectorAll('.lg-node')) {
      const title = titles.get(element.getAttribute('data-node-id') ?? '')
      if (!title) continue
      const rect = element.getBoundingClientRect()
      sizes[title] = [
        Math.round(rect.width / app.canvas.ds.scale),
        Math.round(rect.height / app.canvas.ds.scale)
      ]
    }
    return sizes
  })
}

test.describe('snap positions and sizes to ComfyUI grid', () => {
  test.beforeEach(async ({ page }) => {
    await openComfyUI(page)
    await openHousekeeper(page)
  })

  test('snaps one node on a 20px grid, leaves unselected nodes alone, and undoes once', async ({
    page
  }) => {
    await installGraph(
      page,
      [
        { title: 'selected', x: 31, y: -31, width: 263, height: 147 },
        { title: 'unselected', x: 333, y: 127, width: 191, height: 113 }
      ],
      [],
      ['selected']
    )
    const before = await snapshots(page)
    const drawnBefore = RENDERER === 'vue' ? await drawnPositions(page) : null

    const button = alignmentButton(page, SNAP)
    await expect(button).toBeEnabled()
    await button.hover()
    await page.waitForTimeout(200)
    const preview = await previewRects(page)
    await button.click()
    await page.waitForTimeout(100)

    const after = await snapshots(page)
    expect([byTitle(after, 'selected').x, byTitle(after, 'selected').y]).toEqual([40, -40])
    expect([byTitle(after, 'selected').bodyWidth, byTitle(after, 'selected').bodyHeight]).toEqual([
      260,
      140
    ])
    expect(byTitle(after, 'unselected')).toEqual(byTitle(before, 'unselected'))
    expectRectsClose(preview, (await projectedNodeRects(page)).slice(0, 1))

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

  test('reads an odd grid, handles negative coordinates, and ceils minimum size', async ({ page }) => {
    await openComfyUI(page, { 'Comfy.SnapToGrid.GridSize': 21 })
    await openHousekeeper(page)
    await installGraph(page, [
      { title: 'odd-grid', x: 31, y: -11, width: 190, height: 110, minSize: [201, 117] }
    ])

    await alignmentButton(page, SNAP).click()

    const node = byTitle(await snapshots(page), 'odd-grid')
    expect([node.x, node.y]).toEqual([21, -21])
    expect([node.bodyWidth, node.bodyHeight]).toEqual([RENDERER === 'vue' ? 231 : 210, 126])
  })

  test('keeps a real node grid-sized after serializing and loading the workflow', async ({ page }) => {
    await openComfyUI(page, { 'Comfy.SnapToGrid.GridSize': 21 })
    await openHousekeeper(page)
    await installGraph(page, [
      { title: 'reload-me', type: 'KSampler', x: 31, y: 31, width: 337, height: 263 }
    ])

    await alignmentButton(page, SNAP).click()
    await page.waitForTimeout(300)
    const snapped = byTitle(await snapshots(page), 'reload-me')
    expect(snapped.bodyWidth % 21).toBe(0)
    expect(snapped.bodyHeight % 21).toBe(0)
    const saved = await page.evaluate(() => {
      const node = ((window as any).app.graph.serialize().nodes as any[]).find(
        (candidate) => candidate.title === 'reload-me'
      )
      return [Number(node.size[0]), Number(node.size[1])]
    })
    expect(saved).toEqual([snapped.bodyWidth, snapped.bodyHeight])
    if (RENDERER === 'vue') {
      expect((await drawnSizes(page))['reload-me']).toEqual([
        snapped.bodyWidth,
        snapped.bodyHeight + 30
      ])
    }

    await page.evaluate(async () => {
      const app = (window as any).app
      await app.loadGraphData(app.graph.serialize())
    })
    await page.waitForTimeout(700)

    const loaded = byTitle(await snapshots(page), 'reload-me')
    expect([loaded.bodyWidth, loaded.bodyHeight]).toEqual([
      snapped.bodyWidth,
      snapped.bodyHeight
    ])
    if (RENDERER === 'vue') {
      expect((await drawnSizes(page))['reload-me']).toEqual([
        loaded.bodyWidth,
        loaded.bodyHeight + 30
      ])
    }
  })

  test('snaps explicitly selected groups as atomic frame-anchored components', async ({
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
    await page.evaluate(() => {
      const app = (window as any).app
      const graph = app.canvas?.graph ?? app.graph
      const group = graph.groups.find((candidate: any) => candidate.title === 'left-frame')
      app.canvas.select(group)
      app.canvas.setDirty?.(true, true)
    })
    await page.waitForTimeout(650)

    const beforeNodes = await snapshots(page)
    const beforeGroups = new Map((await groupSnapshots(page)).map(group => [group.title, group]))
    expect(beforeGroups.get('left-frame')?.selected).toBe(true)
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
        expect([
          byTitle(afterNodes, title).bodyWidth,
          byTitle(afterNodes, title).bodyHeight
        ]).toEqual([
          byTitle(beforeNodes, title).bodyWidth,
          byTitle(beforeNodes, title).bodyHeight
        ])
      }
    }

    // The selected group uses its frame origin: (1063, 31) -> (1060, 40).
    expect([afterGroups.get('selected-group')?.x, afterGroups.get('selected-group')?.y]).toEqual([
      1060,
      40
    ])
    assertTranslation(['solo-a', 'solo-b'], -3, 9)

    // The explicitly selected connected component anchors to the minimum frame x/y, even though
    // those minima come from different frames: (63, -52) -> (60, -60).
    for (const title of ['left-frame', 'top-frame']) {
      expect(afterGroups.get(title)!.x - beforeGroups.get(title)!.x).toBe(-3)
      expect(afterGroups.get(title)!.y - beforeGroups.get(title)!.y).toBe(-8)
      expect([afterGroups.get(title)!.width, afterGroups.get(title)!.height]).toEqual([
        beforeGroups.get(title)!.width,
        beforeGroups.get(title)!.height
      ])
      expect(afterGroups.get(title)!.members).toEqual(beforeGroups.get(title)!.members)
    }
    assertTranslation(['left', 'shared', 'right'], -3, -8)
    expect([
      afterGroups.get('selected-group')!.width,
      afterGroups.get('selected-group')!.height
    ]).toEqual([
      beforeGroups.get('selected-group')!.width,
      beforeGroups.get('selected-group')!.height
    ])
    expect(afterGroups.get('selected-group')?.members).toEqual(
      beforeGroups.get('selected-group')?.members
    )
  })

  test('snaps an independently selected member and refits its unselected group', async ({
    page
  }) => {
    await installGraph(page, [
      { title: 'member-a', x: 103, y: 103, width: 183, height: 107 },
      { title: 'member-b', x: 330, y: 150, width: 180, height: 100 }
    ])
    await addGroup(page, { title: 'members', x: 80, y: 70, width: 450, height: 210 })
    await selectNodes(page, ['member-a'])

    const beforeNodes = await snapshots(page)
    const beforeGroup = (await groupSnapshots(page))[0]
    await page.evaluate(() => {
      const graph = (window as any).app.canvas?.graph ?? (window as any).app.graph
      const group = graph.groups.find((candidate: any) => candidate.title === 'members')
      const resizeTo = group.resizeTo.bind(group)
      ;(window as any).__snapRefitCalls = []
      group.resizeTo = (nodes: any[], ...rest: any[]) => {
        const result = resizeTo(nodes, ...rest)
        ;(window as any).__snapRefitCalls.push({
          members: nodes.map((node) => String(node.title)).sort(),
          frame: [
            Number(group.pos[0]),
            Number(group.pos[1]),
            Number(group.size[0]),
            Number(group.size[1])
          ]
        })
        return result
      }
    })
    await alignmentButton(page, SNAP).click()
    await page.waitForTimeout(100)

    const afterNodes = await snapshots(page)
    const afterGroup = (await groupSnapshots(page))[0]
    const refitCalls = await page.evaluate(() => (window as any).__snapRefitCalls)
    expect([byTitle(afterNodes, 'member-a').x, byTitle(afterNodes, 'member-a').y]).toEqual([
      100,
      100
    ])
    expect([
      byTitle(afterNodes, 'member-a').bodyWidth,
      byTitle(afterNodes, 'member-a').bodyHeight
    ]).toEqual([RENDERER === 'vue' ? 240 : 180, 100])
    expect(byTitle(afterNodes, 'member-b')).toEqual(byTitle(beforeNodes, 'member-b'))
    expect(afterGroup.members).toEqual(beforeGroup.members)
    expect(afterGroup.selected).toBe(false)
    expect(refitCalls).toHaveLength(1)
    expect(refitCalls[0].members).toEqual(beforeGroup.members)
    expect([afterGroup.x, afterGroup.y, afterGroup.width, afterGroup.height]).toEqual(
      refitCalls[0].frame
    )
    expect(refitCalls[0].frame).not.toEqual([
      beforeGroup.x,
      beforeGroup.y,
      beforeGroup.width,
      beforeGroup.height
    ])
  })

  test('rolls back a member position, size, and group frame when refitting fails', async ({
    page
  }) => {
    await installGraph(page, [
      { title: 'member-a', x: 103, y: 103, width: 183, height: 107 },
      { title: 'member-b', x: 330, y: 150, width: 180, height: 100 }
    ])
    await addGroup(page, { title: 'members', x: 80, y: 70, width: 450, height: 210 })
    await selectNodes(page, ['member-a'])

    const beforeNodes = await snapshots(page)
    const beforeGroup = (await groupSnapshots(page))[0]
    await page.evaluate(() => {
      const graph = (window as any).app.canvas?.graph ?? (window as any).app.graph
      const group = graph.groups.find((candidate: any) => candidate.title === 'members')
      const resizeTo = group.resizeTo.bind(group)
      const recomputeInsideNodes = group.recomputeInsideNodes.bind(group)
      delete (window as any).__snapFailedRefitFrame
      ;(window as any).__snapMembershipRefreshFailed = false
      group.resizeTo = (...args: any[]) => {
        resizeTo(...args)
        ;(window as any).__snapFailedRefitFrame = [
          Number(group.pos[0]),
          Number(group.pos[1]),
          Number(group.size[0]),
          Number(group.size[1])
        ]
        group.resizeTo = resizeTo
        group.recomputeInsideNodes = () => {
          group.recomputeInsideNodes = recomputeInsideNodes
          ;(window as any).__snapMembershipRefreshFailed = true
          throw new Error('intentional snap membership refresh failure')
        }
      }
    })

    await alignmentButton(page, SNAP).click()
    await page.waitForTimeout(75)

    const failure = await page.evaluate(() => ({
      attemptedFrame: (window as any).__snapFailedRefitFrame,
      membershipRefreshFailed: (window as any).__snapMembershipRefreshFailed
    }))
    expect(failure.membershipRefreshFailed).toBe(true)
    expect(failure.attemptedFrame).toHaveLength(4)
    expect(failure.attemptedFrame).not.toEqual([
      beforeGroup.x,
      beforeGroup.y,
      beforeGroup.width,
      beforeGroup.height
    ])
    expect(await snapshots(page)).toEqual(beforeNodes)
    expect((await groupSnapshots(page))[0]).toEqual(beforeGroup)
  })

  test('skips a standalone pinned node while snapping the rest of the selection', async ({ page }) => {
    await installGraph(page, [
      { title: 'standalone-pinned', x: 31, y: 31, width: 173, height: 91 },
      { title: 'free', x: 53, y: 53, width: 183, height: 107 }
    ])
    await setPinned(page, 'standalone-pinned', true)
    await selectNodes(page, ['standalone-pinned', 'free'])
    const before = await snapshots(page)

    await alignmentButton(page, SNAP).click()
    await page.waitForTimeout(100)

    const after = await snapshots(page)
    expect(byTitle(after, 'standalone-pinned')).toEqual(byTitle(before, 'standalone-pinned'))
    expect([byTitle(after, 'free').x, byTitle(after, 'free').y]).toEqual([60, 60])
    expect([byTitle(after, 'free').bodyWidth, byTitle(after, 'free').bodyHeight]).toEqual([
      RENDERER === 'vue' ? 240 : 180,
      100
    ])
  })

  test('blocks an entire component for either a pinned group or pinned member', async ({ page }) => {
    await installGraph(page, [
      { title: 'grouped-a', x: 110, y: 90 },
      { title: 'grouped-b', x: 280, y: 90 }
    ])
    await addGroup(page, { title: 'blocked', x: 83, y: 51, width: 410, height: 180 })
    await setPinned(page, 'grouped-b', true)
    await selectNodesAndGroup(page, ['grouped-a'], 'blocked')
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
