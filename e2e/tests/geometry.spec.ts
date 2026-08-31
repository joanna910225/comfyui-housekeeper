import { expect, test } from '@playwright/test'
import {
  alignmentButton,
  byTitle,
  expectRectsClose,
  installGraph,
  openComfyUI,
  openHousekeeper,
  previewRects,
  projectedNodeRects,
  RENDERER,
  snapshots
} from './helpers/comfyui'

test.describe('geometry and previews', () => {
  test.beforeEach(async ({ page }) => {
    await openComfyUI(page)
    await openHousekeeper(page)
  })

  test('left alignment uses live heights and a 30px rendered gap', async ({ page }) => {
    await installGraph(page, [
      { title: 'short', x: 420, y: 40, width: 150, height: 70 },
      { title: 'medium', x: 80, y: 260, width: 190, height: 130 },
      { title: 'tall', x: 700, y: 520, width: 220, height: 210 }
    ])

    await alignmentButton(page, 'Align left edges').click()
    const nodes = (await snapshots(page)).sort((a, b) => a.y - b.y)

    expect(new Set(nodes.map((node) => node.x)).size).toBe(1)
    expect(nodes[1].y - (nodes[0].y + nodes[0].height)).toBe(30)
    expect(nodes[2].y - (nodes[1].y + nodes[1].height)).toBe(30)
  })

  test('collapsed nodes use their title-pill height during alignment', async ({ page }) => {
    await installGraph(page, [
      { title: 'expanded-a', x: 360, y: 60, width: 180, height: 120 },
      { title: 'collapsed', x: 70, y: 300, width: 280, height: 260, collapsed: true },
      { title: 'expanded-b', x: 640, y: 520, width: 200, height: 150 }
    ])

    await alignmentButton(page, 'Align left edges').click()
    const nodes = (await snapshots(page)).sort((a, b) => a.y - b.y)
    const collapsed = byTitle(nodes, 'collapsed')

    expect(collapsed.collapsed).toBe(true)
    expect(collapsed.height).toBeLessThan(60)
    expect(nodes[1].y - (nodes[0].y + nodes[0].height)).toBe(30)
    expect(nodes[2].y - (nodes[1].y + nodes[1].height)).toBe(30)
  })

  test('preview overlays match nodes at 1x, 0.5x and 2x', async ({ page }) => {
    for (const scale of [1, 0.5, 2]) {
      await installGraph(page, [
        { title: 'a', x: 40, y: 20, width: 140, height: 90 },
        { title: 'b', x: 300, y: 140, width: 140, height: 90 }
      ])
      await page.evaluate((scale) => {
        const canvas = (window as any).app.canvas
        canvas.ds.scale = scale
        canvas.ds.offset[0] = scale === 2 ? 20 : 180
        canvas.ds.offset[1] = scale === 2 ? 30 : 150
        canvas.setDirty?.(true, true)
      }, scale)

      const button = alignmentButton(page, 'Align left edges')
      await button.hover()
      await page.waitForTimeout(250)
      const preview = await previewRects(page)
      expect(preview).toHaveLength(2)
      await button.click()
      expectRectsClose(preview, await projectedNodeRects(page))
      await page.mouse.move(10, 10)
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
      await page.waitForTimeout(100)
    }
  })

  test('Size-Min preview matches the applied node bounds', async ({ page }) => {
    await installGraph(page, [
      { title: 'a', x: 60, y: 80, width: 310, height: 190, minSize: [140, 70] },
      { title: 'b', x: 480, y: 300, width: 260, height: 160, minSize: [180, 90] }
    ])

    const button = alignmentButton(page, 'Match smallest size')
    await button.hover()
    await page.waitForTimeout(250)
    const preview = await previewRects(page)
    await button.click()
    await page.waitForTimeout(100)

    expectRectsClose(preview, await projectedNodeRects(page))
  })

  /**
   * The test above compares the preview with projectedNodeRects(), which reads node.width - so
   * both of its sides come from the model. That is the whole coverage on the legacy canvas,
   * where the model IS what gets painted, but it cannot see the failure this test is about:
   * Nodes 2.0 refuses to draw a node narrower than its own floor, and a width written below
   * that floor leaves the model and the screen saying different things. Worse, whether it does
   * is not even stable - the component writes the box it drew back onto node.size when the box
   * changes, so the model ends up at the floor sometimes and keeps the too-small number other
   * times. Either way the size the user saves is not the size they see (#68).
   *
   * So this one reads the drawn `.lg-node` boxes and the serialized workflow, and never
   * node.width.
   */
  test('Size-Min writes the width Nodes 2.0 will draw, and saves it', async ({ page }) => {
    test.skip(RENDERER !== 'vue', 'the legacy canvas has no width floor and no per-node element')

    await installGraph(page, [
      { title: 'a', x: 60, y: 80, width: 310, height: 190, minSize: [140, 70] },
      { title: 'b', x: 480, y: 300, width: 260, height: 160, minSize: [180, 90] }
    ])

    await alignmentButton(page, 'Match smallest size').click()
    await page.waitForTimeout(400)

    const measured = await page.evaluate(() => {
      const app = (window as any).app
      const scale = app.canvas.ds.scale
      const saved = new Map<string, number>(
        (app.graph.serialize().nodes as any[]).map((node) => [String(node.id), Number(node.size[0])])
      )
      return (app.graph._nodes as any[]).map((node) => {
        const element = document.querySelector(`.lg-node[data-node-id="${node.id}"]`)
        return {
          title: String(node.title),
          drawn: element ? Math.round(element.getBoundingClientRect().width / scale) : null,
          model: Math.round(Number(node.size[0])),
          saved: saved.has(String(node.id)) ? Math.round(saved.get(String(node.id))!) : null
        }
      })
    })

    // Guard: an empty or unmatched set would let the assertions below pass vacuously.
    expect(measured.map((node) => node.title).sort()).toEqual(['a', 'b'])

    for (const node of measured) {
      expect(node.drawn, `${node.title} was not drawn as its own element`).not.toBeNull()
      expect(
        node.model,
        `${node.title}: node.size[0] is ${node.model} but the renderer drew ${node.drawn}`
      ).toBe(node.drawn)
      expect(
        node.saved,
        `${node.title}: the saved workflow carries ${node.saved} for a node drawn at ${node.drawn}`
      ).toBe(node.drawn)
    }
  })
})
