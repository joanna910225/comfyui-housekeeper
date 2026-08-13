import { expect, test, type Page } from '@playwright/test'
import {
  alignmentButton,
  installGraph,
  openComfyUI,
  openHousekeeper,
  RENDERER,
  snapshots
} from './helpers/comfyui'

/**
 * Everything else in this suite measures app.graph._nodes, which is the right thing to measure
 * on the legacy canvas: litegraph paints from those arrays, so a node whose pos changed is a
 * node that moved on screen.
 *
 * Nodes 2.0 breaks that equivalence. Each node is a DOM element positioned from the frontend's
 * own layout store, and the store is not reading those arrays again after the fact. So the
 * suite passes on the Vue renderer - graph positions change exactly as expected - while nothing
 * the user can see moves at all. Coverage that cannot fail is worse than no coverage, because
 * it reports success.
 *
 * This is the one spec that looks at what is drawn rather than what is recorded, and it is the
 * one that has to go green before Nodes 2.0 can be called supported.
 */
test.describe('Nodes 2.0 rendering', () => {
  test.skip(
    RENDERER !== 'vue',
    'the legacy canvas draws into a single element; there is no per-node geometry in the DOM to read'
  )

  /** Where each node is actually drawn, keyed by title through litegraph's node ids. */
  async function drawnPositions(page: Page): Promise<Record<string, [number, number]>> {
    return page.evaluate(() => {
      const titles = new Map<string, string>(
        (window as any).app.graph._nodes.map((node: any) => [String(node.id), String(node.title)])
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

  test('every node in the graph is drawn as its own element', async ({ page }) => {
    await openComfyUI(page)
    await installGraph(page, [
      { title: 'first', x: 120, y: 120 },
      { title: 'second', x: 460, y: 300 },
      { title: 'third', x: 800, y: 480 }
    ])

    // Guards the rest of the spec: if Nodes 2.0 stops emitting one element per node, or the
    // class it uses is renamed, the assertions below would pass vacuously on an empty set.
    expect(Object.keys(await drawnPositions(page)).sort()).toEqual(['first', 'second', 'third'])
  })

  test('aligning moves the nodes on screen, not only in the graph', async ({ page }) => {
    await openComfyUI(page)
    await installGraph(page, [
      { title: 'first', x: 120, y: 120 },
      { title: 'second', x: 460, y: 300 },
      { title: 'third', x: 800, y: 480 }
    ])
    await openHousekeeper(page)

    const graphBefore = await snapshots(page)
    const drawnBefore = await drawnPositions(page)

    await alignmentButton(page, 'Align left edges').click()

    const graphAfter = await snapshots(page)
    const drawnAfter = await drawnPositions(page)

    // Fail for the right reason: if the alignment did nothing at all, that is a different bug
    // and this spec should not be the one reporting it.
    expect(
      graphAfter.map((node) => [node.x, node.y]),
      'the alignment did not change any graph position, so there is nothing to have drawn'
    ).not.toEqual(graphBefore.map((node) => [node.x, node.y]))

    // The point of the spec. Under #52 the graph moves and the DOM does not, so this is the
    // assertion that fails, and the one that turns green when the fix lands.
    expect(
      drawnAfter,
      'graph positions changed but every node was still drawn in the same place - the Vue ' +
        'layout store did not see the write (see issue #52)'
    ).not.toEqual(drawnBefore)
  })
})
