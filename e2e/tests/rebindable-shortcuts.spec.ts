import { expect, test, type Page } from '@playwright/test'
import {
  installGraph,
  openComfyUI,
  openHousekeeper,
  selectNodes,
  snapshots,
  uniqueCoordinates
} from './helpers/comfyui'

// ComfyUI folds Meta into Ctrl (KeyComboImpl.fromEvent reads `event.ctrlKey || event.metaKey`),
// and so does Housekeeper. Press whichever one the platform actually uses, or the assertions
// measure nothing - see the note in history-input-color.spec.ts.
const MOD = process.platform === 'darwin' ? 'Meta' : 'Control'

const EXPECTED_COMMANDS = [
  { id: 'Housekeeper.AlignBottom', label: 'Align bottom edges', combo: 'Ctrl + Shift + ArrowDown' },
  { id: 'Housekeeper.AlignLeft', label: 'Align left edges', combo: 'Ctrl + Shift + ArrowLeft' },
  { id: 'Housekeeper.AlignRight', label: 'Align right edges', combo: 'Ctrl + Shift + ArrowRight' },
  { id: 'Housekeeper.AlignTop', label: 'Align top edges', combo: 'Ctrl + Shift + ArrowUp' },
  {
    id: 'Housekeeper.DistributeHorizontally',
    label: 'Distribute horizontally',
    combo: 'Ctrl + Alt + ArrowRight'
  },
  {
    id: 'Housekeeper.DistributeVertically',
    label: 'Distribute vertically',
    combo: 'Ctrl + Alt + ArrowDown'
  },
  { id: 'Housekeeper.TogglePanel', label: 'Show/hide Housekeeper panel', combo: 'Ctrl + Shift + h' }
]

/**
 * What ComfyUI itself knows about Housekeeper's shortcuts.
 *
 * Read through `app.extensionManager.command`, the public surface, rather than the internal
 * Pinia stores: this is the same list the Keybinding settings panel renders, so if these
 * entries are here the shortcuts are rebindable from the UI. `command.keybinding` is the
 * getter ComfyCommandImpl exposes over the keybinding store, so a null combo means the
 * default binding never landed.
 */
async function housekeeperCommands(page: Page) {
  return page.evaluate(() => {
    const commands = (window as any).app?.extensionManager?.command?.commands
    if (!Array.isArray(commands)) return null
    return commands
      .filter((command: any) => String(command?.id ?? '').startsWith('Housekeeper.'))
      .map((command: any) => ({
        id: command.id as string,
        label: (command.label ?? null) as string | null,
        source: (command.source ?? null) as string | null,
        combo: command.keybinding ? String(command.keybinding.combo) : null
      }))
      .sort((a: any, b: any) => a.id.localeCompare(b.id))
  })
}

async function panelExpanded(page: Page) {
  return page.evaluate(() =>
    Boolean(document.querySelector('.housekeeper-wrapper')?.classList.contains('expanded'))
  )
}

/** Three nodes at three different left edges, so "aligned" is unambiguous. */
const SPREAD = [
  { title: 'a', x: 120, y: 60, width: 180, height: 120 },
  { title: 'b', x: 520, y: 300, width: 180, height: 120 },
  { title: 'c', x: 320, y: 560, width: 180, height: 120 }
]

test.describe('rebindable shortcuts', () => {
  test.beforeEach(async ({ page }) => {
    await openComfyUI(page)
    await openHousekeeper(page)
  })

  // The point of #43: the actions are ComfyUI commands, so ComfyUI's own Keybinding settings
  // panel lists them and a user can rebind or unbind them. Nothing about the private keydown
  // listener this replaces was ever visible to ComfyUI.
  test('every action is registered with ComfyUI as a command with a default binding', async ({
    page
  }) => {
    const commands = await housekeeperCommands(page)

    expect(commands, 'ComfyUI exposes no command registry at all').not.toBeNull()
    expect(commands!.map((command) => command.id)).toEqual(
      EXPECTED_COMMANDS.map((command) => command.id)
    )
    // A label is what the Keybinding panel lists the row under; without one the row is blank.
    expect(commands!.map((command) => command.label)).toEqual(
      EXPECTED_COMMANDS.map((command) => command.label)
    )
    // Attributed to the extension, so the panel groups them under Housekeeper.
    for (const command of commands!) {
      expect(command.source).toBe('housekeeper-alignment')
    }
    // The shipped defaults are unchanged from before the migration, so existing muscle memory
    // still works.
    expect(commands!.map((command) => command.combo)).toEqual(
      EXPECTED_COMMANDS.map((command) => command.combo)
    )
  })

  test('a default shortcut still performs the alignment', async ({ page }) => {
    await installGraph(page, SPREAD)
    expect(uniqueCoordinates(await snapshots(page), 'x')).toHaveLength(3)

    await page.keyboard.press(`${MOD}+Shift+ArrowLeft`)
    await page.waitForTimeout(500)

    expect(uniqueCoordinates(await snapshots(page), 'x')).toHaveLength(1)
  })

  test('running the command by id performs the alignment', async ({ page }) => {
    await installGraph(page, SPREAD)

    const failure = await page.evaluate(async () => {
      try {
        await (window as any).app.extensionManager.command.execute('Housekeeper.AlignLeft')
        return null
      } catch (error) {
        return String(error)
      }
    })

    expect(failure).toBeNull()
    await page.waitForTimeout(500)
    expect(uniqueCoordinates(await snapshots(page), 'x')).toHaveLength(1)
  })

  // Double-firing is invisible on an alignment, which is idempotent - but not on a toggle.
  // If both ComfyUI's command and the legacy listener ran for one keystroke the panel would
  // flip twice and appear not to have moved at all.
  test('one keystroke toggles the panel exactly once', async ({ page }) => {
    expect(await panelExpanded(page)).toBe(true)

    await page.keyboard.press(`${MOD}+Shift+H`)
    await page.waitForTimeout(300)
    expect(await panelExpanded(page)).toBe(false)

    await page.keyboard.press(`${MOD}+Shift+H`)
    await page.waitForTimeout(300)
    expect(await panelExpanded(page)).toBe(true)
  })

  // The other half of the no-double-application guarantee: one keystroke has to be one undo
  // transaction, or Ctrl+Z leaves the graph half aligned.
  test('one keystroke is one undo step', async ({ page }) => {
    await installGraph(page, SPREAD)
    const before = (await snapshots(page)).map(({ title, x, y }) => ({ title, x, y }))

    await page.keyboard.press(`${MOD}+Shift+ArrowLeft`)
    await page.waitForTimeout(500)
    const aligned = (await snapshots(page)).map(({ title, x, y }) => ({ title, x, y }))
    expect(aligned).not.toEqual(before)

    await page.keyboard.press(`${MOD}+z`)
    await page.waitForTimeout(500)
    expect((await snapshots(page)).map(({ title, x, y }) => ({ title, x, y }))).toEqual(before)
  })

  // A warning toast is emitted once per invocation, so a second one on screen at the same
  // time is a second dispatch of the same keystroke. Unlike the alignment itself, this counts.
  test('one keystroke produces one warning, not two', async ({ page }) => {
    await installGraph(page, SPREAD)
    await selectNodes(page, ['a'])

    await page.keyboard.press(`${MOD}+Shift+ArrowLeft`)
    await page.waitForTimeout(300)

    const warnings = await page.evaluate(() =>
      Array.from(document.body.children).filter(
        (element) =>
          element instanceof HTMLElement &&
          element.textContent?.includes('Please select at least 2 nodes to align')
      ).length
    )
    expect(warnings).toBe(1)
  })
})

// This is the guard the issue proposed deleting. ComfyUI's dispatcher only spares a combo it
// considers RESERVED_BY_TEXT_INPUT, and as of comfyui_frontend_package 1.48.7 that set covers
// Ctrl+Shift+ArrowLeft/Right but not Ctrl+Shift+ArrowUp/Down and no Ctrl+Alt combination at
// all. So these two are exactly the cases ComfyUI does not cover, and if Housekeeper's own
// guard goes they start rewriting node positions mid-sentence again - the v0.2.0 bug.
test.describe('shortcuts ComfyUI does not suppress in text fields', () => {
  test.beforeEach(async ({ page }) => {
    await openComfyUI(page)
    await openHousekeeper(page)
  })

  for (const { name, combo } of [
    { name: 'align top', combo: `${MOD}+Shift+ArrowUp` },
    { name: 'distribute vertically', combo: `${MOD}+Alt+ArrowDown` }
  ]) {
    test(`${combo} does not ${name} while typing in a prompt widget`, async ({ page }) => {
      // Linked, so the flow layouts have something to rearrange - an unlinked selection is a
      // single stage and distributing it is a no-op, which would make this assertion vacuous.
      await installGraph(
        page,
        [
          { title: 'Prompt', type: 'CLIPTextEncode', x: 80, y: 80, width: 420, height: 220 },
          { title: 'Other', x: 620, y: 400, width: 180, height: 100 },
          { title: 'Third', x: 900, y: 700, width: 180, height: 100 }
        ],
        [['Other', 'Third']]
      )
      const before = (await snapshots(page)).map(({ title, x, y }) => ({ title, x, y }))

      const prompt = page.locator('textarea:visible').first()
      await expect(prompt).toBeVisible()
      await prompt.fill('alpha beta gamma')
      await prompt.evaluate((element: HTMLTextAreaElement) => element.focus())

      await page.keyboard.press(combo)
      await page.waitForTimeout(500)

      expect((await snapshots(page)).map(({ title, x, y }) => ({ title, x, y }))).toEqual(before)
      // Left where the user was typing rather than yanked to the canvas. Both of these combos
      // are already ComfyUI's own prompt-weight editing (Ctrl+ArrowUp/Down rewrites the text
      // to `(word:0.95)`), which is a second reason they cannot be allowed through here.
      expect(
        await page.evaluate(() => document.activeElement?.tagName.toUpperCase())
      ).toBe('TEXTAREA')
    })
  }
})

// Registering the commands is only worth anything if a user's own binding then wins.
//
// This is the state ComfyUI's own Keybinding settings panel persists when someone rebinds a
// shortcut: updateKeybindingOnCommand() unsets the old combo and adds the new one, which lands
// in these two settings. They are read once, at startup, so they have to be in place before
// the page loads.
test.describe('user rebinding', () => {
  test('a rebound shortcut fires on the new combo, and the default goes quiet', async ({
    page
  }) => {
    await openComfyUI(page, {
      'Comfy.Keybinding.NewBindings': [
        {
          commandId: 'Housekeeper.AlignLeft',
          combo: { key: 'j', ctrl: true, alt: true, shift: true }
        }
      ],
      'Comfy.Keybinding.UnsetBindings': [
        {
          commandId: 'Housekeeper.AlignLeft',
          combo: { key: 'ArrowLeft', ctrl: true, alt: false, shift: true }
        }
      ]
    })
    await openHousekeeper(page)
    await installGraph(page, SPREAD)

    // The default combo is no longer bound to the command.
    await page.keyboard.press(`${MOD}+Shift+ArrowLeft`)
    await page.waitForTimeout(500)
    expect(uniqueCoordinates(await snapshots(page), 'x')).toHaveLength(3)

    await page.keyboard.press(`${MOD}+Alt+Shift+J`)
    await page.waitForTimeout(500)
    expect(uniqueCoordinates(await snapshots(page), 'x')).toHaveLength(1)
  })
})
