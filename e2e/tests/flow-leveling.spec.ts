import { expect, test } from '@playwright/test'
import {
  alignmentButton,
  byTitle,
  installGraph,
  openComfyUI,
  openHousekeeper,
  snapshots,
  uniqueCoordinates,
  type LinkSpec,
  type NodeSpec
} from './helpers/comfyui'

const flowNodes: NodeSpec[] = [
  { title: 'CLIPLoader', x: 20, y: 390 },
  { title: 'VAELoader', x: 20, y: 40 },
  { title: 'UNETLoader', x: 20, y: 270 },
  { title: 'EmptySD3LatentImage', x: 20, y: 150 },
  { title: 'Positive CLIPTextEncode', x: 340, y: 420 },
  { title: 'ModelSamplingSD3', x: 340, y: 60 },
  { title: 'Negative CLIPTextEncode', x: 340, y: 230 },
  { title: 'KSampler', x: 660, y: 170 },
  { title: 'VAEDecode', x: 900, y: 280 },
  { title: 'SaveImage', x: 1120, y: 100 }
]

const flowLinks: LinkSpec[] = [
  ['CLIPLoader', 'Positive CLIPTextEncode'],
  ['CLIPLoader', 'Negative CLIPTextEncode'],
  ['UNETLoader', 'ModelSamplingSD3'],
  ['ModelSamplingSD3', 'KSampler'],
  ['Positive CLIPTextEncode', 'KSampler'],
  ['Negative CLIPTextEncode', 'KSampler'],
  ['EmptySD3LatentImage', 'KSampler'],
  ['KSampler', 'VAEDecode'],
  ['VAELoader', 'VAEDecode'],
  ['VAEDecode', 'SaveImage']
]

test.describe('longest-path flow leveling', () => {
  test.beforeEach(async ({ page }) => {
    await openComfyUI(page)
    await openHousekeeper(page)
  })

  test('H-Flow creates five dependency columns and preserves prior Y order', async ({ page }) => {
    const originalRootOrder = flowNodes
      .filter((node) => ['CLIPLoader', 'VAELoader', 'UNETLoader', 'EmptySD3LatentImage'].includes(node.title))
      .sort((a, b) => a.y - b.y)
      .map((node) => node.title)

    await installGraph(page, flowNodes, flowLinks)
    await alignmentButton(page, 'Distribute horizontally').click()
    const nodes = await snapshots(page)

    expect(uniqueCoordinates(nodes, 'x')).toHaveLength(5)
    expect(byTitle(nodes, 'KSampler').x).toBeGreaterThan(
      Math.max(
        byTitle(nodes, 'Positive CLIPTextEncode').x,
        byTitle(nodes, 'Negative CLIPTextEncode').x,
        byTitle(nodes, 'ModelSamplingSD3').x
      )
    )
    expect(byTitle(nodes, 'VAEDecode').x).toBeGreaterThan(byTitle(nodes, 'KSampler').x)
    expect(byTitle(nodes, 'SaveImage').x).toBeGreaterThan(byTitle(nodes, 'VAEDecode').x)

    const rootX = byTitle(nodes, 'CLIPLoader').x
    const actualRootOrder = nodes
      .filter((node) => node.x === rootX)
      .sort((a, b) => a.y - b.y)
      .map((node) => node.title)
    expect(actualRootOrder).toEqual(originalRootOrder)
  })

  test('V-Flow creates five dependency rows', async ({ page }) => {
    await installGraph(page, flowNodes, flowLinks)
    await alignmentButton(page, 'Distribute vertically').click()
    const nodes = await snapshots(page)

    expect(uniqueCoordinates(nodes, 'y')).toHaveLength(5)
    expect(byTitle(nodes, 'KSampler').y).toBeGreaterThan(
      Math.max(
        byTitle(nodes, 'Positive CLIPTextEncode').y,
        byTitle(nodes, 'Negative CLIPTextEncode').y,
        byTitle(nodes, 'ModelSamplingSD3').y
      )
    )
    expect(byTitle(nodes, 'VAEDecode').y).toBeGreaterThan(byTitle(nodes, 'KSampler').y)
    expect(byTitle(nodes, 'SaveImage').y).toBeGreaterThan(byTitle(nodes, 'VAEDecode').y)
  })
})
