import { expect, test } from '@playwright/test'
import {
  addGroup,
  alignmentButton,
  byTitle,
  groupSnapshots,
  installGraph,
  openComfyUI,
  openHousekeeper,
  selectNodes,
  selectNodesAndGroup,
  snapshots
} from './helpers/comfyui'

const MOD = process.platform === 'darwin' ? 'Meta' : 'Control'

test.describe('mixed node and group layout', () => {
  test.beforeEach(async ({ page }) => {
    await openComfyUI(page)
    await openHousekeeper(page)
  })

  test('basic alignment moves a group with its members and preserves membership', async ({ page }) => {
    await installGraph(page, [
      { title: 'member-a', x: 100, y: 100, width: 180, height: 100 },
      { title: 'member-b', x: 330, y: 150, width: 180, height: 100 },
      { title: 'outsider', x: 1000, y: 500, width: 180, height: 100 }
    ])
    await addGroup(page, { title: 'members', x: 80, y: 70, width: 450, height: 210 })
    await selectNodesAndGroup(page, ['member-a', 'member-b', 'outsider'], 'members')

    const beforeNodes = await snapshots(page)
    const beforeGroup = (await groupSnapshots(page))[0]
    expect(beforeGroup.members).toEqual(['member-a', 'member-b'])

    await alignmentButton(page, 'Align right edges').click()
    await page.waitForTimeout(75)

    const afterNodes = await snapshots(page)
    const afterGroup = (await groupSnapshots(page))[0]
    const dx = afterGroup.x - beforeGroup.x
    const dy = afterGroup.y - beforeGroup.y

    expect(Math.abs(dx) + Math.abs(dy)).toBeGreaterThan(0)
    for (const title of ['member-a', 'member-b']) {
      expect(byTitle(afterNodes, title).x - byTitle(beforeNodes, title).x).toBeCloseTo(dx)
      expect(byTitle(afterNodes, title).y - byTitle(beforeNodes, title).y).toBeCloseTo(dy)
    }
    expect(afterGroup.members).toEqual(['member-a', 'member-b'])
    expect(afterGroup.members).not.toContain('outsider')
  })

  test('H-flow moves a selected group atomically without changing membership', async ({ page }) => {
    await installGraph(
      page,
      [
        { title: 'src', x: 1000, y: 120, width: 180, height: 100 },
        { title: 'mid', x: 100, y: 100, width: 180, height: 100 },
        { title: 'sink', x: 330, y: 150, width: 180, height: 100 }
      ],
      [
        ['src', 'mid'],
        ['mid', 'sink']
      ]
    )
    await addGroup(page, { title: 'downstream', x: 80, y: 70, width: 450, height: 210 })
    await selectNodesAndGroup(page, ['src', 'mid', 'sink'], 'downstream')

    const beforeNodes = await snapshots(page)
    const beforeGroup = (await groupSnapshots(page))[0]
    expect(beforeGroup.members).toEqual(['mid', 'sink'])

    await alignmentButton(page, 'Arrange dependency stages left to right').click()
    await page.waitForTimeout(75)

    const afterNodes = await snapshots(page)
    const afterGroup = (await groupSnapshots(page))[0]
    const dx = afterGroup.x - beforeGroup.x
    const dy = afterGroup.y - beforeGroup.y

    expect(Math.abs(dx) + Math.abs(dy)).toBeGreaterThan(0)
    for (const title of ['mid', 'sink']) {
      expect(byTitle(afterNodes, title).x - byTitle(beforeNodes, title).x).toBeCloseTo(dx)
      expect(byTitle(afterNodes, title).y - byTitle(beforeNodes, title).y).toBeCloseTo(dy)
    }
    expect(afterGroup.members).toEqual(['mid', 'sink'])
    expect(afterGroup.members).not.toContain('src')
  })

  test('H-flow arranges selected members and fits their unselected group', async ({ page }) => {
    await installGraph(
      page,
      [
        { title: 'src', x: 330, y: 100, width: 180, height: 100 },
        { title: 'mid', x: 100, y: 180, width: 180, height: 100 },
        { title: 'sink', x: 560, y: 260, width: 180, height: 100 }
      ],
      [
        ['src', 'mid'],
        ['mid', 'sink']
      ]
    )
    await addGroup(page, { title: 'pipeline', x: 50, y: 50, width: 800, height: 450 })
    await selectNodes(page, ['src', 'mid', 'sink'])

    const beforeNodes = await snapshots(page)
    const beforeGroup = (await groupSnapshots(page))[0]
    expect(beforeGroup.selected).toBe(false)
    expect(beforeGroup.members).toEqual(['mid', 'sink', 'src'])

    const flow = alignmentButton(page, 'Arrange dependency stages left to right')
    await expect(flow).toBeEnabled()
    await flow.click()
    await page.waitForTimeout(75)

    const afterNodes = await snapshots(page)
    const afterGroup = (await groupSnapshots(page))[0]
    expect(byTitle(afterNodes, 'src').x).toBeLessThan(byTitle(afterNodes, 'mid').x)
    expect(byTitle(afterNodes, 'mid').x).toBeLessThan(byTitle(afterNodes, 'sink').x)
    expect(afterNodes).not.toEqual(beforeNodes)
    expect(afterGroup.members).toEqual(beforeGroup.members)
    expect(afterGroup.selected).toBe(false)
    expect([afterGroup.x, afterGroup.y, afterGroup.width, afterGroup.height]).not.toEqual([
      beforeGroup.x,
      beforeGroup.y,
      beforeGroup.width,
      beforeGroup.height
    ])
  })

  test('an unsafe member layout is rolled back instead of changing group membership', async ({
    page
  }) => {
    await installGraph(page, [
      { title: 'member-a', x: 100, y: 100, width: 180, height: 100 },
      { title: 'member-b', x: 330, y: 150, width: 180, height: 100 },
      { title: 'outsider', x: 1000, y: 125, width: 180, height: 100 }
    ])
    await addGroup(page, { title: 'members', x: 80, y: 70, width: 450, height: 210 })
    await selectNodes(page, ['member-a', 'member-b', 'outsider'])

    const beforeNodes = await snapshots(page)
    const beforeGroup = (await groupSnapshots(page))[0]
    const align = alignmentButton(page, 'Align right edges')
    await expect(align).toBeEnabled()
    await align.click()
    await page.waitForTimeout(75)

    expect(await snapshots(page)).toEqual(beforeNodes)
    expect((await groupSnapshots(page))[0]).toEqual(beforeGroup)
    await expect(
      page.getByText('Cannot arrange selection without changing group membership', { exact: true })
    ).toBeVisible()
  })

  test('group API failures roll back and leave the next layout undoable', async ({ page }) => {
    await installGraph(page, [
      { title: 'member-a', x: 100, y: 100, width: 180, height: 100 },
      { title: 'member-b', x: 330, y: 150, width: 180, height: 100 }
    ])
    await addGroup(page, { title: 'members', x: 80, y: 70, width: 450, height: 210 })
    await selectNodes(page, ['member-a', 'member-b'])

    const beforeNodes = await snapshots(page)
    const beforeGroup = (await groupSnapshots(page))[0]
    await page.evaluate(() => {
      const graph = (window as any).app.canvas?.graph ?? (window as any).app.graph
      const group = graph.groups.find((candidate: any) => candidate.title === 'members')
      const resizeTo = group.resizeTo.bind(group)
      group.resizeTo = (...args: any[]) => {
        group.resizeTo = resizeTo
        throw new Error(`intentional resize failure with ${args.length} argument`)
      }
    })

    const align = alignmentButton(page, 'Align right edges')
    await align.click()
    await page.waitForTimeout(75)
    expect(await snapshots(page)).toEqual(beforeNodes)
    expect((await groupSnapshots(page))[0]).toEqual(beforeGroup)

    await page.evaluate(() => {
      const graph = (window as any).app.canvas?.graph ?? (window as any).app.graph
      const group = graph.groups.find((candidate: any) => candidate.title === 'members')
      const resizeTo = group.resizeTo.bind(group)
      const recomputeInsideNodes = group.recomputeInsideNodes.bind(group)
      group.resizeTo = (...args: any[]) => {
        resizeTo(...args)
        group.resizeTo = resizeTo
        group.recomputeInsideNodes = () => {
          group.recomputeInsideNodes = recomputeInsideNodes
          throw new Error('intentional membership refresh failure')
        }
      }
    })

    await align.click()
    await page.waitForTimeout(75)
    expect(await snapshots(page)).toEqual(beforeNodes)
    expect((await groupSnapshots(page))[0]).toEqual(beforeGroup)

    await align.click()
    await page.waitForTimeout(75)
    expect(await snapshots(page)).not.toEqual(beforeNodes)

    await page.keyboard.press(`${MOD}+z`)
    await page.waitForTimeout(500)
    expect(await snapshots(page)).toEqual(beforeNodes)
    expect((await groupSnapshots(page))[0]).toEqual(beforeGroup)
  })

  test('an explicitly selected group moves every group connected through a shared member', async ({
    page
  }) => {
    await installGraph(page, [
      { title: 'a-only', x: 100, y: 100, width: 180, height: 100 },
      { title: 'shared', x: 330, y: 100, width: 180, height: 100 },
      { title: 'b-only', x: 560, y: 100, width: 180, height: 100 },
      { title: 'outsider', x: 1000, y: 500, width: 180, height: 100 }
    ])
    await addGroup(page, { title: 'group-a', x: 80, y: 70, width: 450, height: 210 })
    await addGroup(page, { title: 'group-b', x: 300, y: 70, width: 460, height: 210 })
    await selectNodesAndGroup(page, ['a-only', 'outsider'], 'group-a')

    const beforeNodes = await snapshots(page)
    const beforeGroups = new Map((await groupSnapshots(page)).map((group) => [group.title, group]))
    expect(beforeGroups.get('group-a')?.members).toEqual(['a-only', 'shared'])
    expect(beforeGroups.get('group-b')?.members).toEqual(['b-only', 'shared'])
    expect(beforeGroups.get('group-a')?.selected).toBe(true)

    await alignmentButton(page, 'Align right edges').click()
    await page.waitForTimeout(75)

    const afterNodes = await snapshots(page)
    const afterGroups = new Map((await groupSnapshots(page)).map((group) => [group.title, group]))
    const groupA = beforeGroups.get('group-a')!
    const groupB = beforeGroups.get('group-b')!
    const dx = afterGroups.get('group-a')!.x - groupA.x
    const dy = afterGroups.get('group-a')!.y - groupA.y

    expect(Math.abs(dx) + Math.abs(dy)).toBeGreaterThan(0)
    expect(afterGroups.get('group-b')!.x - groupB.x).toBeCloseTo(dx)
    expect(afterGroups.get('group-b')!.y - groupB.y).toBeCloseTo(dy)
    for (const title of ['a-only', 'shared', 'b-only']) {
      expect(byTitle(afterNodes, title).x - byTitle(beforeNodes, title).x).toBeCloseTo(dx)
      expect(byTitle(afterNodes, title).y - byTitle(beforeNodes, title).y).toBeCloseTo(dy)
    }
    expect(afterGroups.get('group-a')!.members).toEqual(groupA.members)
    expect(afterGroups.get('group-b')!.members).toEqual(groupB.members)
    expect([...afterGroups.values()].every((group) => !group.members.includes('outsider'))).toBe(true)
  })
})
