import { expect, test } from '@playwright/test'

test('ComfyUI loads the Housekeeper frontend extension', async ({ page }) => {
  const pageErrors: string[] = []
  const consoleErrors: string[] = []
  const failedHousekeeperRequests: string[] = []
  let housekeeperScriptStatus: number | undefined

  page.on('pageerror', (error) => pageErrors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('response', (response) => {
    if (response.url().includes('/extensions/comfyui-housekeeper/main.js')) {
      housekeeperScriptStatus = response.status()
    }
  })
  page.on('requestfailed', (request) => {
    if (request.url().includes('/extensions/comfyui-housekeeper/')) {
      failedHousekeeperRequests.push(request.url())
    }
  })

  await page.goto('/', { waitUntil: 'domcontentloaded' })

  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const app = (window as typeof window & {
            app?: { graph?: unknown; canvas?: unknown }
          }).app
          return Boolean(app?.graph && app?.canvas)
        }),
      { message: 'ComfyUI app and graph should become ready' }
    )
    .toBe(true)

  await expect(page.locator('canvas').first()).toBeVisible()

  await expect
    .poll(() => housekeeperScriptStatus, {
      message: 'Housekeeper main.js should be requested successfully'
    })
    .toBe(200)

  const extensionsResponse = await page.request.get('/api/extensions')
  expect(extensionsResponse.ok()).toBe(true)
  const extensions = (await extensionsResponse.json()) as string[]
  expect(extensions).toContain('/extensions/comfyui-housekeeper/main.js')

  const housekeeperHandle = page.locator('.housekeeper-handle')
  const housekeeperWrapper = page.locator('.housekeeper-wrapper')
  const housekeeperPanel = page.getByRole('region', {
    name: 'Housekeeper alignment tools'
  })

  await expect(housekeeperHandle).toBeVisible()
  await expect(housekeeperWrapper).toHaveClass(/collapsed/)

  await housekeeperHandle.click()
  await expect(housekeeperWrapper).toHaveClass(/expanded/)
  await expect(housekeeperPanel).toBeVisible()

  await page.getByRole('button', { name: 'Hide Housekeeper panel' }).click()
  await expect(housekeeperWrapper).toHaveClass(/collapsed/)

  expect(pageErrors, 'Uncaught browser exceptions').toEqual([])

  const relevantConsoleErrors = consoleErrors.filter(
    (message) =>
      message.toLowerCase().includes('housekeeper') ||
      message.includes('comfyui-housekeeper')
  )
  expect(relevantConsoleErrors, 'Housekeeper console errors').toEqual([])
  expect(failedHousekeeperRequests, 'Failed Housekeeper asset requests').toEqual([])
})
