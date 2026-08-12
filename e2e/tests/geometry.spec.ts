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
})
