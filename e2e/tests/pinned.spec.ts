import { expect, test } from '@playwright/test'
import {
  alignmentButton,
  byTitle,
  installGraph,
  openComfyUI,
  openHousekeeper,
  previewRects,
  setPinned,
  snapshots
} from './helpers/comfyui'

// The unit suite proves the filter works against litegraph-shaped mocks. These run it against
// real litegraph nodes pinned through node.pin(), which is the part a mock cannot vouch for.
test.describe('pinned nodes', () => {
  test.beforeEach(async ({ page }) => {
    await openComfyUI(page)
    await openHousekeeper(page)
  })

  test('a pinned node is not moved by an alignment', async ({ page }) => {
    await installGraph(page, [
      { title: 'free-a', x: 400, y: 60, width: 180, height: 120 },
      { title: 'anchored', x: 90, y: 300, width: 200, height: 140 },
      { title: 'free-b', x: 660, y: 540, width: 180, height: 120 }
    ])
    await setPinned(page, 'anchored', true)

    const before = byTitle(await snapshots(page), 'anchored')
    await alignmentButton(page, 'Align left edges').click()
    const after = await snapshots(page)

    expect(byTitle(after, 'anchored').x).toBe(before.x)
    expect(byTitle(after, 'anchored').y).toBe(before.y)
    // The two movable nodes still align to each other.
    expect(byTitle(after, 'free-a').x).toBe(byTitle(after, 'free-b').x)
  })

  test('a pinned node is not resized', async ({ page }) => {
    await installGraph(page, [
      { title: 'wide', x: 60, y: 60, width: 400, height: 120 },
      { title: 'anchored', x: 60, y: 320, width: 150, height: 120 },
      { title: 'narrow', x: 60, y: 580, width: 150, height: 120 }
    ])
    await setPinned(page, 'anchored', true)

    // Snapshot the width the fixture actually got rather than asserting the 150 it asked for.
    // Nodes 2.0 will not draw a node narrower than its own floor and writes the box it drew
    // back onto the node, so `anchored` is already 225 wide before this test clicks anything -
    // and asserting 150 failed on a resize Housekeeper never performed (#68). The claim here is
    // "the pinned node was not resized", which is expressible without naming a width and
    // survives that floor changing.
    const before = byTitle(await snapshots(page), 'anchored')

    await alignmentButton(page, 'Match widest width').click()
    const after = await snapshots(page)

    expect(byTitle(after, 'anchored').width).toBe(before.width)
    expect(byTitle(after, 'narrow').width).toBe(400)
  })

  test('the preview does not promise to move a pinned node', async ({ page }) => {
    await installGraph(page, [
      { title: 'free-a', x: 400, y: 60, width: 180, height: 120 },
      { title: 'anchored', x: 90, y: 300, width: 200, height: 140 },
      { title: 'free-b', x: 660, y: 540, width: 180, height: 120 }
    ])
    await setPinned(page, 'anchored', true)

    await alignmentButton(page, 'Align left edges').hover()
    await expect.poll(async () => (await previewRects(page)).length).toBe(2)
  })

  test('flow layout leaves a pinned node in place', async ({ page }) => {
    await installGraph(
      page,
      [
        { title: 'source', x: 80, y: 80, width: 180, height: 120 },
        { title: 'middle', x: 900, y: 400, width: 180, height: 120 },
        { title: 'sink', x: 500, y: 700, width: 180, height: 120 },
        { title: 'anchored', x: 1200, y: 900, width: 180, height: 120 }
      ],
      [
        ['source', 'middle'],
        ['middle', 'sink']
      ]
    )
    await setPinned(page, 'anchored', true)

    const before = byTitle(await snapshots(page), 'anchored')
    await alignmentButton(page, 'Distribute horizontally').click()
    const after = await snapshots(page)

    expect(byTitle(after, 'anchored').x).toBe(before.x)
    expect(byTitle(after, 'anchored').y).toBe(before.y)
    // The chain still lays out one column per dependency stage.
    expect(byTitle(after, 'middle').x).toBeGreaterThan(byTitle(after, 'source').x)
    expect(byTitle(after, 'sink').x).toBeGreaterThan(byTitle(after, 'middle').x)
  })
})
