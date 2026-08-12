import { expect, test } from '@playwright/test'
import { openComfyUI, openHousekeeper, waitForPanelSettled } from './helpers/comfyui'

const STORAGE_KEY = 'housekeeper-panel-position'

type Point = { x: number; y: number }

async function wrapperPosition(page: import('@playwright/test').Page): Promise<Point> {
  return page.evaluate(() => {
    const rect = document.querySelector('.housekeeper-wrapper')!.getBoundingClientRect()
    return { x: Math.round(rect.x), y: Math.round(rect.y) }
  })
}

const storedPosition = (page: import('@playwright/test').Page) =>
  page.evaluate(key => window.localStorage.getItem(key), STORAGE_KEY)

async function dragBy(page: import('@playwright/test').Page, selector: string, dx: number, dy: number) {
  const box = (await page.locator(selector).boundingBox())!
  const startX = box.x + box.width / 2
  const startY = box.y + box.height / 2
  await page.mouse.move(startX, startY)
  await page.mouse.down()
  await page.mouse.move(startX + dx, startY + dy, { steps: 10 })
  await page.mouse.up()
  await page.waitForTimeout(250)
}

test.describe('draggable panel position', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test.beforeEach(async ({ page }) => {
    await openComfyUI(page)
    await page.evaluate(key => window.localStorage.removeItem(key), STORAGE_KEY)
    await page.reload({ waitUntil: 'domcontentloaded' })
    await openComfyUI(page)
  })

  test('the collapsed handle can be dragged, and the drag does not toggle the panel', async ({ page }) => {
    const before = await wrapperPosition(page)
    await dragBy(page, '.housekeeper-handle', -200, 150)

    const after = await wrapperPosition(page)
    expect(after.y).toBeGreaterThan(before.y)
    expect(after.x).toBeLessThan(before.x)
    await expect(page.locator('.housekeeper-wrapper')).toHaveClass(/collapsed/)
  })

  test('the panel header can be dragged while open, without closing it', async ({ page }) => {
    await openHousekeeper(page)
    // Expanding changes the wrapper's width, so its placement is recomputed again.
    await waitForPanelSettled(page)
    const before = await wrapperPosition(page)
    await dragBy(page, '.housekeeper-header', -250, 180)

    const after = await wrapperPosition(page)
    expect(after.y).toBeGreaterThan(before.y)
    await expect(page.locator('.housekeeper-wrapper')).toHaveClass(/expanded/)
  })

  test('a plain click still toggles the panel', async ({ page }) => {
    await page.locator('.housekeeper-handle').click()
    await expect(page.locator('.housekeeper-wrapper')).toHaveClass(/expanded/)
  })

  test('dragging from a control inside the header does not move the panel', async ({ page }) => {
    await openHousekeeper(page)
    const before = await wrapperPosition(page)
    await dragBy(page, '.housekeeper-close', -120, 90)
    expect(await wrapperPosition(page)).toEqual(before)
  })

  test('a dragged position survives a reload and can be reset', async ({ page }) => {
    await dragBy(page, '.housekeeper-handle', -200, 150)
    const stored = await storedPosition(page)
    expect(stored).not.toBeNull()

    await page.reload({ waitUntil: 'domcontentloaded' })
    await openComfyUI(page)
    expect(await storedPosition(page)).toBe(stored)
    const restored = await wrapperPosition(page)
    expect(restored.y).toBeGreaterThan(100)

    await openHousekeeper(page)
    await expect(page.locator('.housekeeper-reset-position')).toBeVisible()
    await page.locator('.housekeeper-reset-position').click()
    await page.waitForTimeout(250)

    expect(await storedPosition(page)).toBeNull()
    expect((await wrapperPosition(page)).y).toBeLessThan(restored.y)
  })

  test('the reset control is hidden until the panel has been moved', async ({ page }) => {
    await openHousekeeper(page)
    await expect(page.locator('.housekeeper-reset-position')).toBeHidden()
  })

  test('a stored position that is off-screen is clamped back into reach', async ({ page }) => {
    // Guards against a resized window or hand-edited storage leaving the panel somewhere
    // it can never be grabbed again.
    for (const position of [
      { top: 99_999, right: -99_999 },
      { top: -5_000, right: 99_999 }
    ]) {
      await page.evaluate(
        ([key, value]) => window.localStorage.setItem(key as string, JSON.stringify(value)),
        [STORAGE_KEY, position] as const
      )
      await page.reload({ waitUntil: 'domcontentloaded' })
      await openComfyUI(page)

      const reachable = await page.evaluate(() => {
        const rect = document.querySelector('.housekeeper-wrapper')!.getBoundingClientRect()
        return rect.right > 20 && rect.left < window.innerWidth && rect.top >= 0 && rect.top < window.innerHeight - 20
      })
      expect(reachable, `position ${JSON.stringify(position)} left the panel out of reach`).toBe(true)
    }
  })

  test('malformed stored data falls back to the default position', async ({ page }) => {
    await page.evaluate(key => window.localStorage.setItem(key, '{"top":"x","right":null}'), STORAGE_KEY)
    await page.reload({ waitUntil: 'domcontentloaded' })
    await openComfyUI(page)

    await openHousekeeper(page)
    await expect(page.locator('.housekeeper-reset-position')).toBeHidden()
  })
})
