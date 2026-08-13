import { expect, test } from '@playwright/test'
import {
  addGroup,
  alignmentButton,
  byTitle,
  enterSubgraph,
  groupSnapshots,
  installGraph,
  leaveSubgraph,
  openComfyUI,
  openHousekeeper,
  selectGroup,
  selectNodes,
  snapshots
} from './helpers/comfyui'

/**
 * Nothing in this suite entered a subgraph before, which is how #51 shipped: the panel read its
 * selection from `app.graph`, and `app.graph` is the ROOT graph even while the canvas is showing
 * a subgraph. Every button then disables itself, silently, because an empty selection is a
 * perfectly ordinary state.
 *
 * These tests select inside a subgraph and assert on what the panel does with that selection,
 * rather than on which property it read - the point is that the feature works there, not how.
 */
test.describe('selection inside a subgraph', () => {
  test.beforeEach(async ({ page }) => {
    await openComfyUI(page)
    await openHousekeeper(page)
  })

  test('alignment buttons enable for nodes selected inside a subgraph', async ({ page }) => {
    await installGraph(page, [
      { title: 'inner-a', x: 80, y: 80, width: 180, height: 120 },
      { title: 'inner-b', x: 460, y: 300, width: 180, height: 120 }
    ])
    await enterSubgraph(page)
    await selectNodes(page, ['inner-a', 'inner-b'])

    await expect(alignmentButton(page, 'Align left edges')).toBeEnabled()
    await expect(alignmentButton(page, 'Match widest width')).toBeEnabled()
  })

  test('an alignment moves the nodes inside a subgraph', async ({ page }) => {
    await installGraph(page, [
      { title: 'inner-a', x: 80, y: 80, width: 180, height: 120 },
      { title: 'inner-b', x: 460, y: 300, width: 180, height: 120 },
      { title: 'inner-c', x: 900, y: 620, width: 180, height: 120 }
    ])
    await enterSubgraph(page)
    await selectNodes(page, ['inner-a', 'inner-c'])

    const before = await snapshots(page)
    expect(byTitle(before, 'inner-a').x).not.toBe(byTitle(before, 'inner-c').x)

    await alignmentButton(page, 'Align left edges').click()
    const after = await snapshots(page)

    expect(byTitle(after, 'inner-a').x).toBe(byTitle(after, 'inner-c').x)
    // The unselected node is left where it was, so the alignment acted on the selection and not
    // on whatever the subgraph happened to contain.
    expect(byTitle(after, 'inner-b').x).toBe(byTitle(before, 'inner-b').x)
    expect(byTitle(after, 'inner-b').y).toBe(byTitle(before, 'inner-b').y)
  })

  test('a group selected inside a subgraph is recoloured', async ({ page }) => {
    // Groups are read off the same graph object as nodes, so they fail and recover together.
    await installGraph(page, [
      { title: 'inner-a', x: 80, y: 80, width: 180, height: 120 },
      { title: 'inner-b', x: 460, y: 300, width: 180, height: 120 }
    ])
    await enterSubgraph(page)
    await addGroup(page, { title: 'inner-group', x: 40, y: 40, width: 700, height: 500 })
    await selectGroup(page, 'inner-group')

    const before = (await groupSnapshots(page)).find((group) => group.title === 'inner-group')
    expect(before?.selected).toBe(true)

    await page.getByRole('button', { name: 'Apply color #553333' }).first().click()
    await page.waitForTimeout(300)

    const after = (await groupSnapshots(page)).find((group) => group.title === 'inner-group')
    expect(after?.color).not.toBe(before?.color)
    expect(after?.color).toBeTruthy()
  })

  test('selection still works at the root after leaving a subgraph', async ({ page }) => {
    // The root half of this is a guard on the fallback path, not a reproduction of #51 - selection
    // at the root worked before the fix too. It is here to fail if the panel ever starts holding
    // on to the graph it last read. (The test as a whole still fails without the fix, on the
    // in-subgraph assertion below.)
    await installGraph(page, [
      { title: 'inner-a', x: 80, y: 80, width: 180, height: 120 },
      { title: 'inner-b', x: 460, y: 300, width: 180, height: 120 },
      { title: 'outer-a', x: 900, y: 80, width: 180, height: 120 },
      { title: 'outer-b', x: 1200, y: 400, width: 180, height: 120 }
    ])
    await enterSubgraph(page, ['inner-a', 'inner-b'])
    await selectNodes(page, ['inner-a', 'inner-b'])
    await expect(alignmentButton(page, 'Align left edges')).toBeEnabled()

    await leaveSubgraph(page)
    await selectNodes(page, ['outer-a', 'outer-b'])

    await expect(alignmentButton(page, 'Align left edges')).toBeEnabled()
    const before = await snapshots(page)
    expect(byTitle(before, 'outer-a').x).not.toBe(byTitle(before, 'outer-b').x)

    await alignmentButton(page, 'Align left edges').click()
    const after = await snapshots(page)

    expect(byTitle(after, 'outer-a').x).toBe(byTitle(after, 'outer-b').x)
  })
})
