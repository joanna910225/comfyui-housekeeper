import { expect, test } from '@playwright/test'

// ComfyUI and the browser both key off the platform's primary modifier: Meta (Cmd) on
// macOS, Control elsewhere. Hard-coding Meta makes these tests silently no-op on Linux -
// Meta is the Super key there, so the browser performs no word-selection and the
// assertions fail against perfectly correct behaviour.
const MOD = process.platform === 'darwin' ? 'Meta' : 'Control'
import {
  alignmentButton,
  installGraph,
  openComfyUI,
  openHousekeeper,
  snapshots
} from './helpers/comfyui'

test.describe('history, text input and colour', () => {
  test.beforeEach(async ({ page }) => {
    await openComfyUI(page)
    await openHousekeeper(page)
  })

  test('one undo restores all ten aligned node positions', async ({ page }) => {
    await installGraph(
      page,
      Array.from({ length: 10 }, (_, index) => ({
        title: `node-${index}`,
        x: 40 + ((index * 173) % 720),
        y: 30 + ((index * 137) % 600),
        width: 130 + (index % 3) * 20,
        height: 70 + (index % 4) * 20
      }))
    )
    const before = (await snapshots(page)).map(({ title, x, y }) => ({ title, x, y }))

    await alignmentButton(page, 'Align left edges').click()
    const aligned = (await snapshots(page)).map(({ title, x, y }) => ({ title, x, y }))
    expect(aligned).not.toEqual(before)

    await page.keyboard.press(`${MOD}+z`)
    await page.waitForTimeout(500)
    const undone = (await snapshots(page)).map(({ title, x, y }) => ({ title, x, y }))
    expect(undone).toEqual(before)
  })

  test('primary-modifier+Shift+Left edits prompt selection without moving selected nodes', async ({ page }) => {
    await installGraph(page, [
      { title: 'Prompt', type: 'CLIPTextEncode', x: 80, y: 80, width: 420, height: 220 },
      { title: 'Other', x: 620, y: 260, width: 180, height: 100 }
    ])
    const before = (await snapshots(page)).map(({ title, x, y }) => ({ title, x, y }))
    const prompt = page.locator('textarea:visible').first()
    await expect(prompt).toBeVisible()
    await prompt.fill('alpha beta gamma')
    await prompt.evaluate((element: HTMLTextAreaElement) => {
      element.focus()
      element.setSelectionRange(element.value.length, element.value.length)
    })

    await page.keyboard.press(`${MOD}+Shift+ArrowLeft`)
    const selection = await prompt.evaluate((element: HTMLTextAreaElement) => ({
      start: element.selectionStart,
      end: element.selectionEnd,
      length: element.value.length
    }))
    const after = (await snapshots(page)).map(({ title, x, y }) => ({ title, x, y }))

    expect(selection.end).toBe(selection.length)
    expect(selection.start).toBeLessThan(selection.end)
    expect(after).toEqual(before)
  })

  test('colour undo restores the pre-hover colours', async ({ page }) => {
    await installGraph(page, [
      { title: 'a', x: 80, y: 80 },
      { title: 'b', x: 380, y: 260 }
    ])
    const before = (await snapshots(page)).map(({ title, color, bgcolor }) => ({
      title,
      color,
      bgcolor
    }))
    const chip = page.getByRole('button', { name: 'Apply color #553333' }).first()

    await chip.hover()
    await page.waitForTimeout(150)
    await chip.click()
    await page.keyboard.press(`${MOD}+z`)
    await page.waitForTimeout(500)

    const after = (await snapshots(page)).map(({ title, color, bgcolor }) => ({
      title,
      color,
      bgcolor
    }))
    expect(after).toEqual(before)
  })
})
