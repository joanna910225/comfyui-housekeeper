import { expect, test } from '@playwright/test'
import {
  installGraph,
  openComfyUI,
  openHousekeeper
} from './helpers/comfyui'

async function topRightHitTargetIsPropertiesButton(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const button = document.querySelector<HTMLElement>(
      'button[aria-label="Toggle properties panel"]'
    )
    if (!button) return false
    const rect = button.getBoundingClientRect()
    const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)
    return hit === button || button.contains(hit)
  })
}

test.describe('panel placement and toast hit-testing', () => {
  test.use({ viewport: { width: 1280, height: 720 } })

  test.beforeEach(async ({ page }) => {
    await openComfyUI(page)
  })

  test('expanded Housekeeper does not cover the properties toggle', async ({ page }) => {
    await openHousekeeper(page)
    expect(await topRightHitTargetIsPropertiesButton(page)).toBe(true)
    await page.getByRole('button', { name: 'Toggle properties panel' }).click()
  })

  test('expanded Housekeeper remains clear at a 1215px desktop width', async ({ page }) => {
    await page.setViewportSize({ width: 1215, height: 900 })
    await openHousekeeper(page)
    expect(await topRightHitTargetIsPropertiesButton(page)).toBe(true)
    await page.getByRole('button', { name: 'Toggle properties panel' }).click()
  })

  test('collapsed Housekeeper does not cover the properties toggle', async ({ page }) => {
    await openHousekeeper(page)
    await page.getByRole('button', { name: 'Hide Housekeeper panel' }).click()
    expect(await topRightHitTargetIsPropertiesButton(page)).toBe(true)
    await page.getByRole('button', { name: 'Toggle properties panel' }).click()
  })

  test('right offset follows a docked legacy sidebar when one is exposed', async ({ page }) => {
    await openHousekeeper(page)
    const sidebarExists = await page.evaluate(() => {
      const sidebar = document.querySelector<HTMLElement>(
        '#comfyui-body-right, .comfyui-body-right'
      )
      return Boolean(sidebar && sidebar.getBoundingClientRect().width > 0)
    })
    test.skip(!sidebarExists, 'This frontend exposes a popover, not a docked legacy sidebar')

    const before = await page.evaluate(() => {
      const sidebar = document.querySelector<HTMLElement>(
        '#comfyui-body-right, .comfyui-body-right'
      )!
      return {
        width: sidebar.getBoundingClientRect().width,
        offset:
          Number.parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue('--hk-right-offset')
          ) || 0
      }
    })
    expect(before.offset).toBeGreaterThanOrEqual(before.width - 1)
  })

  test('panel metrics are correct immediately after reload', async ({ page }) => {
    await openHousekeeper(page)
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForFunction(() => Boolean((window as any).app?.graph))
    const metrics = await page.locator('.housekeeper-wrapper').evaluate((wrapper) => {
      const rect = wrapper.getBoundingClientRect()
      const rootStyle = getComputedStyle(document.documentElement)
      return {
        y: rect.y,
        topOffset: Number.parseFloat(rootStyle.getPropertyValue('--hk-top-offset')),
        maxHeight: Number.parseFloat(rootStyle.getPropertyValue('--hk-panel-max-height'))
      }
    })

    expect(metrics.topOffset).toBeGreaterThan(0)
    expect(Math.abs(metrics.y - metrics.topOffset)).toBeLessThanOrEqual(1)
    expect(metrics.maxHeight).toBeGreaterThan(280)
  })

  test('warning toast does not block the top-right queue control', async ({ page }) => {
    await openHousekeeper(page)
    await installGraph(page, [{ title: 'unselected', x: 100, y: 100 }], [], [])
    await page.getByRole('button', { name: 'Apply color #553333' }).first().click()

    const toast = page.getByText('Select nodes or groups to apply color', { exact: true })
    await expect(toast).toBeVisible()
    await expect(toast).toHaveCSS('pointer-events', 'none')
    await page.getByRole('button', { name: 'Hide Housekeeper panel' }).click()

    const queue = page.getByRole('button', { name: /active.*Expand job queue/ })
    await queue.click()
    await expect(page.getByText(/Queue/i).filter({ visible: true }).first()).toBeVisible()
  })
})
