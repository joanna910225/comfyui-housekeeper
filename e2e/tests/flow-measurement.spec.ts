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
  rectanglesOverlap,
  setCollapsed,
  setNodeSize,
  snapshots,
  type LinkSpec,
  type NodeSpec
} from './helpers/comfyui'

const nodes: NodeSpec[] = [
  { title: 'A', x: 40, y: 60, width: 180, height: 100 },
  { title: 'B', x: 340, y: 40, width: 200, height: 100 },
  { title: 'C', x: 340, y: 300, width: 180, height: 100 },
  { title: 'D', x: 680, y: 80, width: 180, height: 100 }
]
const links: LinkSpec[] = [
  ['A', 'B'],
  ['A', 'C'],
  ['B', 'D']
]

test.describe('per-run flow measurement', () => {
  test.beforeEach(async ({ page }) => {
    await openComfyUI(page)
    await openHousekeeper(page)
  })

  test('a resized node is measured again and cannot contain its neighbour', async ({ page }) => {
    await installGraph(page, nodes, links)
    const button = alignmentButton(page, 'Arrange dependency stages left to right')
    await button.click()
    const first = await snapshots(page)

    await page.mouse.move(10, 10)
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
    await setNodeSize(page, 'B', [500, 400])
    await button.hover()
    await page.waitForTimeout(250)
    const preview = await previewRects(page)
    await button.click()
    const second = await snapshots(page)

    expect(byTitle(second, 'C').y).toBeGreaterThan(byTitle(first, 'C').y)
    expect(byTitle(second, 'D').x).toBeGreaterThan(byTitle(first, 'D').x)
    expect(rectanglesOverlap(byTitle(second, 'B'), byTitle(second, 'C'))).toBe(false)
    expectRectsClose(preview, await projectedNodeRects(page))
  })

  test('collapsing a node tightens the next run and preview still matches apply', async ({ page }) => {
    await installGraph(page, nodes, links)
    const button = alignmentButton(page, 'Arrange dependency stages left to right')
    await button.click()
    const expanded = await snapshots(page)

    await page.mouse.move(10, 10)
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
    await setCollapsed(page, 'B', true)
    await button.hover()
    await page.waitForTimeout(250)
    const preview = await previewRects(page)
    await button.click()
    const collapsed = await snapshots(page)

    expect(byTitle(collapsed, 'C').y).toBeLessThan(byTitle(expanded, 'C').y)
    expect(byTitle(collapsed, 'D').x).toBeLessThanOrEqual(byTitle(expanded, 'D').x)
    expect(rectanglesOverlap(byTitle(collapsed, 'B'), byTitle(collapsed, 'C'))).toBe(false)
    expectRectsClose(preview, await projectedNodeRects(page))
  })
})
