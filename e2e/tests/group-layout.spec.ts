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

    await alignmentButton(page, 'Distribute horizontally').click()
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

  test('a selected member moves every group connected through a shared member', async ({ page }) => {
    await installGraph(page, [
      { title: 'a-only', x: 100, y: 100, width: 180, height: 100 },
      { title: 'shared', x: 330, y: 100, width: 180, height: 100 },
      { title: 'b-only', x: 560, y: 100, width: 180, height: 100 },
      { title: 'outsider', x: 1000, y: 500, width: 180, height: 100 }
    ])
    await addGroup(page, { title: 'group-a', x: 80, y: 70, width: 450, height: 210 })
    await addGroup(page, { title: 'group-b', x: 300, y: 70, width: 460, height: 210 })
    await selectNodes(page, ['a-only', 'outsider'])

    const beforeNodes = await snapshots(page)
    const beforeGroups = new Map((await groupSnapshots(page)).map((group) => [group.title, group]))
    expect(beforeGroups.get('group-a')?.members).toEqual(['a-only', 'shared'])
    expect(beforeGroups.get('group-b')?.members).toEqual(['b-only', 'shared'])
    expect([...beforeGroups.values()].every((group) => !group.selected)).toBe(true)

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
