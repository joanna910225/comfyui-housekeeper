import { expect, test } from '@playwright/test'
import { openComfyUI, openHousekeeper } from './helpers/comfyui'

const STORAGE_KEY = 'housekeeper-panel-position'
type Page = import('@playwright/test').Page

/**
 * Geometry of the header controls. The bug this covers: the "Reset position" button was in
 * the header row alongside the title, and at the panel's width the three controls did not
 * fit - the title ran into the button and its label clipped to "Reset pos...".
 */
async function headerLayout(page: Page) {
  return page.evaluate(() => {
    const q = (selector: string) => document.querySelector<HTMLElement>(selector)
    const title = q('.housekeeper-header-title')
    const titleSpan = q('.housekeeper-header-title span')
    const close = q('.housekeeper-close')
    const reset = q('.housekeeper-reset-position')
    const panel = q('.housekeeper-panel')

    const overlaps = (a: HTMLElement | null, b: HTMLElement | null) => {
      if (!a || !b) return false
      const ra = a.getBoundingClientRect()
      const rb = b.getBoundingClientRect()
      return ra.left < rb.right && rb.left < ra.right && ra.top < rb.bottom && rb.top < ra.bottom
    }
    // scrollWidth beyond clientWidth means the label is being cut off.
    const clipped = (el: HTMLElement | null) => (el ? el.scrollWidth > el.clientWidth + 1 : false)
    const visible = (el: HTMLElement | null) => {
      if (!el) return false
      const rect = el.getBoundingClientRect()
      const style = getComputedStyle(el)
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden'
    }

    return {
      resetVisible: visible(reset),
      resetClipped: clipped(reset),
      titleClipped: clipped(titleSpan),
      titleOverlapsReset: overlaps(title, reset),
      titleOverlapsClose: overlaps(title, close),
      resetOverlapsClose: overlaps(reset, close),
      resetWithinPanel:
        reset && panel
          ? reset.getBoundingClientRect().right <= panel.getBoundingClientRect().right + 1 &&
            reset.getBoundingClientRect().left >= panel.getBoundingClientRect().left - 1
          : null,
      panelWithinViewport: panel
        ? panel.getBoundingClientRect().left >= -1 &&
          panel.getBoundingClientRect().right <= window.innerWidth + 1
        : null
    }
  })
}

function expectNoCollisions(layout: Awaited<ReturnType<typeof headerLayout>>, context: string) {
  expect(layout.titleOverlapsReset, `${context}: title overlaps reset`).toBe(false)
  expect(layout.titleOverlapsClose, `${context}: title overlaps close`).toBe(false)
  expect(layout.resetOverlapsClose, `${context}: reset overlaps close`).toBe(false)
  expect(layout.titleClipped, `${context}: title clipped`).toBe(false)
  if (layout.resetVisible) {
    expect(layout.resetClipped, `${context}: reset label clipped`).toBe(false)
    expect(layout.resetWithinPanel, `${context}: reset outside the panel`).toBe(true)
  }
}

async function dragHeader(page: Page, dx: number, dy: number) {
  const box = (await page.locator('.housekeeper-header').boundingBox())!
  const x = box.x + box.width / 2
  const y = box.y + box.height / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + dx, y + dy, { steps: 10 })
  await page.mouse.up()
  await page.waitForTimeout(250)
}

const WIDTHS = [1600, 1280, 1024, 900, 768, 600, 420, 320]

test.describe('panel header layout', () => {
  for (const width of WIDTHS) {
    test(`header controls never collide at ${width}px, before and after dragging`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      await openComfyUI(page)
      await page.evaluate(key => window.localStorage.removeItem(key), STORAGE_KEY)
      await page.reload({ waitUntil: 'domcontentloaded' })
      await openComfyUI(page)
      await openHousekeeper(page)
      // ComfyUI reflows its own chrome asynchronously after a viewport change, and the panel
      // measures against it. Let both settle before asserting or dragging.
      await page.waitForTimeout(600)

      const initial = await headerLayout(page)
      expectNoCollisions(initial, `default @${width}`)
      expect(initial.resetVisible, `default @${width}: reset should be hidden until moved`).toBe(false)
      expect(initial.panelWithinViewport, `default @${width}: auto-placed panel off screen`).toBe(true)

      await dragHeader(page, -Math.min(150, width / 6), 120)
      const dragged = await headerLayout(page)
      expectNoCollisions(dragged, `after drag @${width}`)
      expect(dragged.resetVisible, `after drag @${width}: reset should appear`).toBe(true)

      await page.reload({ waitUntil: 'domcontentloaded' })
      await openComfyUI(page)
      await openHousekeeper(page)
      const restored = await headerLayout(page)
      expectNoCollisions(restored, `after reload @${width}`)
      expect(restored.resetVisible, `after reload @${width}: reset should persist`).toBe(true)
    })
  }

  test('the reset label reads in full rather than being truncated', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await openComfyUI(page)
    await page.evaluate(key => window.localStorage.removeItem(key), STORAGE_KEY)
    await page.reload({ waitUntil: 'domcontentloaded' })
    await openComfyUI(page)
    await openHousekeeper(page)
    await page.waitForTimeout(600)
    await dragHeader(page, -150, 120)

    const reset = page.locator('.housekeeper-reset-position')
    await expect(reset).toBeVisible()
    await expect(reset).toHaveText('Reset position')
    // Clicking it must actually work, not just be visible.
    await reset.click()
    await expect(reset).toBeHidden()
  })
})
