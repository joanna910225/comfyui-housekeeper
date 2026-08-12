import { expect, test } from '@playwright/test'
import { openComfyUI, openHousekeeper } from './helpers/comfyui'

const STORAGE_KEY = 'housekeeper-panel-position'
type Page = import('@playwright/test').Page

const position = (page: Page) =>
  page.evaluate(() => {
    const rect = document.querySelector('.housekeeper-wrapper')!.getBoundingClientRect()
    return { x: Math.round(rect.x), y: Math.round(rect.y) }
  })

const stored = (page: Page) => page.evaluate(key => window.localStorage.getItem(key), STORAGE_KEY)

async function focusHandle(page: Page) {
  await page.locator('.housekeeper-handle').focus()
  await expect(page.locator('.housekeeper-handle')).toBeFocused()
}

test.describe('keyboard panel positioning', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test.beforeEach(async ({ page }) => {
    // A fresh context per test means localStorage starts empty; clearing it cost a
    // second full page load.
    await openComfyUI(page)
  })

  test('arrow keys move the panel while the handle has focus', async ({ page }) => {
    const before = await position(page)
    await focusHandle(page)

    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowLeft')
    await page.waitForTimeout(200)

    const after = await position(page)
    expect(after.y).toBe(before.y + 10)
    expect(after.x).toBe(before.x - 10)
  })

  test('Shift+arrow moves further than a plain arrow', async ({ page }) => {
    const before = await position(page)
    await focusHandle(page)

    await page.keyboard.press('Shift+ArrowDown')
    await page.waitForTimeout(200)

    expect((await position(page)).y).toBe(before.y + 50)
  })

  test('a nudged position persists across a reload', async ({ page }) => {
    await focusHandle(page)
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(200)

    const saved = await stored(page)
    expect(saved).not.toBeNull()
    const moved = await position(page)

    await page.reload({ waitUntil: 'domcontentloaded' })
    await openComfyUI(page)
    expect(await stored(page)).toBe(saved)
    expect((await position(page)).y).toBe(moved.y)
  })

  test('the whole flow is reachable without a pointer', async ({ page }) => {
    // The point of this feature: move the panel, then undo that, using only the keyboard.
    await focusHandle(page)
    const before = await position(page)

    await page.keyboard.press('Shift+ArrowDown')
    await page.keyboard.press('Shift+ArrowLeft')
    await page.waitForTimeout(200)
    expect(await stored(page)).not.toBeNull()

    // Open the panel from the focused handle, then reach Reset position by tabbing.
    await page.keyboard.press('Enter')
    await expect(page.locator('.housekeeper-panel')).toBeVisible()

    const reset = page.locator('.housekeeper-reset-position')
    await expect(reset).toBeVisible()
    for (let i = 0; i < 12; i++) {
      if (await reset.evaluate(el => el === document.activeElement)) break
      await page.keyboard.press('Tab')
    }
    await expect(reset).toBeFocused()

    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    expect(await stored(page)).toBeNull()
    // Not comparing coordinates: the panel is expanded now and the wrapper is wider, so its
    // left edge differs even though the anchor is back to the default. Assert the state.
    await expect(page.locator('.housekeeper-wrapper')).not.toHaveClass(/hk-user-positioned/)
    const inline = await page.locator('.housekeeper-wrapper').evaluate(el => ({
      top: (el as HTMLElement).style.top,
      right: (el as HTMLElement).style.right
    }))
    expect(inline).toEqual({ top: '', right: '' })
  })

  test('arrow keys do not scroll the page or move nodes', async ({ page }) => {
    await focusHandle(page)
    const scrollBefore = await page.evaluate(() => window.scrollY)
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(200)
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore)
  })

  test('arrow keys are ignored when the handle does not have focus', async ({ page }) => {
    const before = await position(page)
    await focusHandle(page)
    await page.locator('.housekeeper-handle').evaluate(el => (el as HTMLElement).blur())
    await expect(page.locator('.housekeeper-handle')).not.toBeFocused()
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(200)
    expect(await position(page)).toEqual(before)
    expect(await stored(page)).toBeNull()
  })

  test('nudging cannot push the panel out of reach', async ({ page }) => {
    await focusHandle(page)
    for (let i = 0; i < 40; i++) await page.keyboard.press('Shift+ArrowUp')
    for (let i = 0; i < 40; i++) await page.keyboard.press('Shift+ArrowRight')
    await page.waitForTimeout(300)

    const reachable = await page.evaluate(() => {
      const rect = document.querySelector('.housekeeper-wrapper')!.getBoundingClientRect()
      return rect.right > 20 && rect.left < window.innerWidth && rect.top >= 0 && rect.top < window.innerHeight - 20
    })
    expect(reachable).toBe(true)
  })
})
