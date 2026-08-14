import { expect, type Locator, type Page } from '@playwright/test'

export type NodeSpec = {
  title: string
  x: number
  y: number
  width?: number
  height?: number
  collapsed?: boolean
  minSize?: [number, number]
  type?: string
}

export type LinkSpec = [sourceTitle: string, targetTitle: string]

export type NodeSnapshot = {
  id: number | string
  title: string
  x: number
  y: number
  width: number
  height: number
  bodyWidth: number
  bodyHeight: number
  collapsed: boolean
  color?: string
  bgcolor?: string
}

export type Rect = { x: number; y: number; width: number; height: number }

export type GroupSnapshot = { title: string; color?: string; selected: boolean }

// ROOT GRAPH vs DISPLAYED GRAPH.
//
// app.graph is always the root graph - upstream defines it as
// `get graph() { return this.rootGraphInternal }`. While the canvas is showing a subgraph,
// app.graph still answers with the root, so anything that reads it is looking at a different node
// list from the one on screen. app.canvas.graph is what is being displayed.
//
// The helpers below therefore act on app.canvas.graph (falling back to app.graph), so the same
// helper works at the root and inside a subgraph. The one exception is installGraph(), which
// deliberately builds the root fixture and clears it first.

/**
 * Which node renderer the run is aimed at.
 *
 * ComfyUI ships two. The legacy one paints every node into a single <canvas>, so the DOM
 * contains one element and the extension reads geometry from litegraph. Nodes 2.0 renders
 * each node as a Vue component - one `.lg-node` element per node, laid out by the browser.
 * They are genuinely different surfaces for an extension that measures nodes and places a
 * panel against ComfyUI's own chrome, so which one is in force is part of the run, not a
 * detail.
 *
 * Read from the environment rather than left to whatever the server last had, because the
 * setting is persisted server-side like everything else below: an unset run would silently
 * inherit the previous run's renderer.
 */
export const RENDERER = process.env.COMFYUI_RENDERER === 'vue' ? 'vue' : 'canvas'

/**
 * UI state that tests toggle and that ComfyUI persists SERVER-SIDE, in
 * user/default/comfy.settings.json - not in localStorage, so clearing browser storage or
 * using a fresh context does not reset it.
 *
 * Without this, a test that opens the right side panel changes the starting conditions of
 * every test after it, and results depend on execution order: the same suite run twice on
 * identical code produced 2 failures and then 1, and tests that failed in sequence passed
 * in isolation. That makes the suite unusable as a merge gate, because a real regression is
 * indistinguishable from ordering noise.
 *
 * The baseline deliberately closes the right side panel. That is the harder case for panel
 * placement - with the panel open there is a wide, obvious obstacle to measure against;
 * closed, only the narrow top-right control cluster is there to avoid.
 */
const UI_STATE_BASELINE: Record<string, unknown> = {
  'Comfy.RightSidePanel.IsOpen': false,
  'Comfy.Queue.History.Expanded': false,
  // Housekeeper's own node spacing is persisted the same way, so a test that changes it
  // would otherwise silently alter every layout assertion that runs after it.
  'Housekeeper.NodeSpacing': 30,
  // Housekeeper's shortcuts are ComfyUI commands, so a user rebinding is persisted here too.
  // A test that rebinds one would otherwise leave every later test running someone else's
  // keymap.
  'Comfy.Keybinding.NewBindings': [],
  'Comfy.Keybinding.UnsetBindings': [],
  // Nodes 2.0. Named `Comfy.VueNodes.Enabled` in the frontend's settings schema - checked
  // against the shipped bundle rather than guessed, and asserted below, so a rename upstream
  // turns into a failure instead of a run that quietly tests the legacy canvas twice.
  'Comfy.VueNodes.Enabled': RENDERER === 'vue'
}

/**
 * Put ComfyUI's persisted UI state back to a known baseline. Must run before navigation so
 * the page loads with it already applied.
 *
 * `overrides` is for state that has to be in place before the page boots - ComfyUI reads
 * user keybindings once, at startup - and is merged over the baseline rather than replacing
 * it, so the reset still happens.
 */
export async function resetComfyUIState(page: Page, overrides: Record<string, unknown> = {}) {
  const response = await page.request.post('/api/settings', {
    data: { ...UI_STATE_BASELINE, ...overrides }
  })
  // Fail loudly rather than silently reintroducing order-dependence if the endpoint moves.
  expect(
    response.ok(),
    `could not reset ComfyUI UI state (HTTP ${response.status()}) - tests would be order-dependent`
  ).toBe(true)
}

/**
 * Block until the panel has stopped moving.
 *
 * ComfyUI reflows its own chrome asynchronously after load, and the panel measures its
 * placement against it - so for a few hundred milliseconds the wrapper is still being
 * repositioned. A test that grabs it during that window drags from a stale box and the move
 * clamps back to where it started, which is a failure that only appears on slower machines.
 *
 * Waits for the wrapper's geometry to be identical across several consecutive samples rather
 * than sleeping a fixed amount: it returns as soon as things are actually stable, and keeps
 * waiting on a machine that needs longer.
 */
export async function waitForPanelSettled(page: Page, requiredStableSamples = 3) {
  await page.evaluate(() => {
    delete (window as any).__hkSettle
  })

  await page.waitForFunction(
    (needed: number) => {
      const element = document.querySelector('.housekeeper-wrapper')
      if (!element) return false

      const rect = element.getBoundingClientRect()
      const sample = [rect.x, rect.y, rect.width, rect.height]
      const state = ((window as any).__hkSettle ??= { last: null, stable: 0 })

      const unchanged =
        state.last !== null && state.last.every((value: number, i: number) => Math.abs(value - sample[i]) < 0.5)

      state.stable = unchanged ? state.stable + 1 : 0
      state.last = sample
      return state.stable >= needed
    },
    requiredStableSamples,
    { polling: 150, timeout: 20_000 }
  )
}

export async function openComfyUI(page: Page, settings: Record<string, unknown> = {}) {
  await resetComfyUIState(page, settings)

  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => {
    const app = (window as any).app
    return Boolean(app?.graph && app?.canvas && (window as any).LiteGraph)
  })

  await expect(page.locator('canvas').first()).toBeVisible()
  await expect(page.locator('.housekeeper-wrapper')).toBeAttached()

  // Prove the renderer the run asked for is the one that engaged. The frontend mirrors the
  // setting onto this flag, so it reports what is in force rather than what was requested -
  // and it is absent on frontends predating Nodes 2.0, which reads as the canvas renderer.
  // Without this check a renamed setting would leave the Vue run green against the canvas,
  // which is worse than no coverage: it would claim coverage that does not exist.
  const vueNodes = await page.evaluate(() => Boolean((window as any).LiteGraph?.vueNodesMode))
  expect(
    vueNodes,
    `asked for the ${RENDERER} renderer, but LiteGraph.vueNodesMode is ${vueNodes} - ` +
      'Comfy.VueNodes.Enabled may have been renamed or removed in this frontend'
  ).toBe(RENDERER === 'vue')

  // Every caller wants a panel that has finished placing itself. Doing it here rather than in
  // each spec is what stops this being rediscovered a fourth time.
  await waitForPanelSettled(page)
}

export async function openHousekeeper(page: Page) {
  const wrapper = page.locator('.housekeeper-wrapper')
  const className = (await wrapper.getAttribute('class')) ?? ''
  if (!className.includes('expanded')) {
    await page.getByRole('button', { name: 'Housekeeper', exact: true }).click()
  }
  await expect(
    page.getByRole('region', { name: 'Housekeeper alignment tools' })
  ).toBeVisible()
}

export async function installGraph(
  page: Page,
  specs: NodeSpec[],
  links: LinkSpec[] = [],
  selectedTitles: string[] = specs.map((spec) => spec.title)
) {
  await page.evaluate(
    ({ specs, links, selectedTitles }) => {
      const runtime = window as any
      const app = runtime.app
      // Fixtures are always built in the root graph - see the note above - and this clears it.
      const graph = app.graph
      const canvas = app.canvas

      canvas.emitBeforeChange?.()
      canvas.deselectAll?.()
      graph.clear()

      const incoming = new Map<string, number>()
      const outgoing = new Set<string>()
      for (const [source, target] of links) {
        outgoing.add(source)
        incoming.set(target, (incoming.get(target) ?? 0) + 1)
      }

      const nodes = new Map<string, any>()
      for (const spec of specs) {
        const node = spec.type
          ? runtime.LiteGraph.createNode(spec.type)
          : new runtime.LGraphNode(spec.title)
        if (!node) throw new Error(`Could not create node ${spec.title}`)

        node.title = spec.title
        if (!spec.type) {
          node.type = 'HousekeeperE2E'
          if (outgoing.has(spec.title)) node.addOutput('out', '*')
          for (let index = 0; index < (incoming.get(spec.title) ?? 0); index++) {
            node.addInput(`in-${index}`, '*')
          }
        }

        graph.add(node)
        // Through the accessor, never node.pos[0]/[1]. Nodes 2.0's layout store is only
        // updated by `set pos`; an indexed write mutates the underlying array behind its
        // back and the store writes its own value - litegraph's default [10, 10] - back over
        // it within a frame of graph.add(). See #67.
        node.pos = [spec.x, spec.y]
        node.setSize?.([spec.width ?? 180, spec.height ?? 100])
        if (spec.minSize) {
          const minSize = [...spec.minSize]
          node.computeSize = () => new Float32Array(minSize)
        }
        node.flags = { ...(node.flags ?? {}), collapsed: Boolean(spec.collapsed) }
        nodes.set(spec.title, node)
      }

      const nextInput = new Map<string, number>()
      for (const [sourceTitle, targetTitle] of links) {
        const source = nodes.get(sourceTitle)
        const target = nodes.get(targetTitle)
        const input = nextInput.get(targetTitle) ?? 0
        source.connect(0, target, input)
        nextInput.set(targetTitle, input + 1)
      }

      canvas.deselectAll?.()
      const selected = selectedTitles.map((title) => nodes.get(title)).filter(Boolean)
      canvas.selectNodes?.(selected)
      for (const node of graph._nodes) node.is_selected = selected.includes(node)

      canvas.ds.scale = 1
      // DragAndScale.offset is an accessor pair too. Unlike node.pos the indexed form does
      // currently survive under Nodes 2.0 (measured), but there is no reason to keep the
      // pattern that #67 is about where the setter is right there.
      canvas.ds.offset = [180, 150]
      canvas.setDirty?.(true, true)
      graph.setDirtyCanvas?.(true, true)
      canvas.emitAfterChange?.()
    },
    { specs, links, selectedTitles }
  )

  await page.waitForTimeout(650)

  // The fixture is a precondition of every caller, so prove it took rather than letting a
  // collapsed layout reach the assertions. Under #67 it did not take on the Vue renderer and
  // five tests failed on arithmetic that read as five unrelated bugs; sampled after the settle
  // above, because that is where the layout store's write-back landed.
  const placed = await page.evaluate(() =>
    ((window as any).app.graph.nodes as any[]).map((node) => [
      String(node.title),
      Math.round(node.pos[0]),
      Math.round(node.pos[1])
    ])
  )
  expect(
    placed,
    'installGraph could not place its nodes - the fixture is wrong, so nothing measured against it means anything'
  ).toEqual(specs.map((spec) => [spec.title, spec.x, spec.y]))
}

export async function selectNodes(page: Page, titles: string[]) {
  await page.evaluate((titles) => {
    const app = (window as any).app
    const graph = app.canvas?.graph ?? app.graph
    const selected = graph.nodes.filter((node: any) => titles.includes(node.title))
    app.canvas.deselectAll?.()
    app.canvas.selectNodes?.(selected)
    for (const node of graph.nodes) node.is_selected = selected.includes(node)
    app.canvas.setDirty?.(true, true)
  }, titles)
  await page.waitForTimeout(650)
}

/**
 * Convert nodes in the root graph into a subgraph and open it, the way the frontend does when a
 * user picks "Convert to Subgraph" and then clicks into the resulting node. Defaults to every
 * node currently in the root graph.
 */
export async function enterSubgraph(page: Page, titles?: string[]) {
  await page.evaluate((titles) => {
    const app = (window as any).app
    const canvas = app.canvas
    const rootGraph = app.graph
    const nodes = rootGraph.nodes.filter(
      (node: any) => !titles || titles.includes(node.title)
    )
    if (!nodes.length) throw new Error(`No nodes to convert to a subgraph: ${titles}`)

    const created = rootGraph.convertToSubgraph(new Set(nodes))
    if (!created?.subgraph) throw new Error('convertToSubgraph returned no subgraph')
    // openSubgraph is what the subgraph node's own title button and double-click handler call.
    canvas.openSubgraph(created.subgraph, created.node)
    if (canvas.graph === app.graph) {
      throw new Error('canvas is still displaying the root graph after openSubgraph')
    }
  }, titles)
  await page.waitForTimeout(650)
}

/** Back to the root graph, which is what the breadcrumb navigation does. */
export async function leaveSubgraph(page: Page) {
  await page.evaluate(() => {
    const app = (window as any).app
    app.canvas.setGraph(app.rootGraph ?? app.graph)
    if (app.canvas.graph !== app.graph) {
      throw new Error('canvas did not return to the root graph')
    }
  })
  await page.waitForTimeout(650)
}

export async function addGroup(page: Page, group: { title: string } & Rect) {
  await page.evaluate((group) => {
    const runtime = window as any
    const app = runtime.app
    const graph = app.canvas?.graph ?? app.graph
    const created = new runtime.LGraphGroup(group.title)
    created.pos = [group.x, group.y]
    created.size = [group.width, group.height]
    graph.add(created)
    app.canvas.setDirty?.(true, true)
  }, group)
  await page.waitForTimeout(100)
}

export async function selectGroup(page: Page, title: string) {
  await page.evaluate((title) => {
    const app = (window as any).app
    const graph = app.canvas?.graph ?? app.graph
    const group = graph.groups.find((candidate: any) => candidate.title === title)
    if (!group) throw new Error(`Missing group ${title}`)
    app.canvas.deselectAll?.()
    app.canvas.select?.(group)
    if (!group.selected) throw new Error(`select() did not take effect on group ${title}`)
    app.canvas.setDirty?.(true, true)
  }, title)
  await page.waitForTimeout(650)
}

export async function groupSnapshots(page: Page): Promise<GroupSnapshot[]> {
  return page.evaluate(() => {
    const app = (window as any).app
    const graph = app.canvas?.graph ?? app.graph
    return (graph.groups as any[]).map((group) => ({
      title: group.title,
      color: group.color,
      selected: Boolean(group.selected)
    }))
  })
}

export async function snapshots(page: Page): Promise<NodeSnapshot[]> {
  return page.evaluate(() => {
    const app = (window as any).app
    const nodes = (app.canvas?.graph ?? app.graph).nodes as any[]
    return nodes
      .map((node) => ({
        id: node.id,
        title: node.title,
        x: Number(node.pos[0]),
        y: Number(node.pos[1]),
        width: Number(node.width ?? node.size?.[0] ?? 0),
        height: Number(node.height ?? (node.size?.[1] ?? 0) + 30),
        bodyWidth: Number(node.size?.[0] ?? node.width ?? 0),
        bodyHeight: Number(node.size?.[1] ?? 0),
        collapsed: Boolean(node.flags?.collapsed),
        color: node.color,
        bgcolor: node.bgcolor
      }))
      .sort((a, b) => a.title.localeCompare(b.title))
  })
}

export async function setNodeSize(page: Page, title: string, size: [number, number]) {
  await page.evaluate(
    ({ title, size }) => {
      const app = (window as any).app
      const node = (app.canvas?.graph ?? app.graph).nodes.find(
        (candidate: any) => candidate.title === title
      )
      if (!node) throw new Error(`Missing node ${title}`)
      node.setSize(size)
      app.canvas.setDirty?.(true, true)
    },
    { title, size }
  )
  await page.waitForTimeout(100)
}

export async function setCollapsed(page: Page, title: string, collapsed: boolean) {
  await page.evaluate(
    ({ title, collapsed }) => {
      const app = (window as any).app
      const node = (app.canvas?.graph ?? app.graph).nodes.find(
        (candidate: any) => candidate.title === title
      )
      if (!node) throw new Error(`Missing node ${title}`)
      node.flags = { ...(node.flags ?? {}), collapsed }
      app.canvas.setDirty?.(true, true)
    },
    { title, collapsed }
  )
  await page.waitForTimeout(100)
}

/**
 * Pin through litegraph's own API rather than writing the flag, so the test proves the
 * extension reads what ComfyUI actually sets. Asserts the node reports itself pinned
 * afterwards — if upstream renames the accessor, this fails here instead of quietly
 * turning the pinned tests into no-ops.
 */
export async function setPinned(page: Page, title: string, pinned: boolean) {
  await page.evaluate(
    ({ title, pinned }) => {
      const app = (window as any).app
      const node = (app.canvas?.graph ?? app.graph).nodes.find(
        (candidate: any) => candidate.title === title
      )
      if (!node) throw new Error(`Missing node ${title}`)
      if (typeof node.pin === 'function') node.pin(pinned)
      else node.flags = { ...(node.flags ?? {}), pinned }
      if (!!node.pinned !== pinned) {
        throw new Error(`pin(${pinned}) did not take effect on ${title}; node.pinned=${node.pinned}`)
      }
      app.canvas.setDirty?.(true, true)
    },
    { title, pinned }
  )
  await page.waitForTimeout(100)
}

export function alignmentButton(page: Page, name: string): Locator {
  return page.getByRole('button', { name, exact: true })
}

export async function previewRects(page: Page): Promise<Rect[]> {
  return page.evaluate(() =>
    Array.from(document.body.children)
      .filter((element) => {
        if (!(element instanceof HTMLElement)) return false
        const style = getComputedStyle(element)
        return (
          style.position === 'fixed' &&
          style.pointerEvents === 'none' &&
          style.borderTopStyle === 'dashed' &&
          style.zIndex === '999'
        )
      })
      .map((element) => {
        const rect = element.getBoundingClientRect()
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
      })
  )
}

export async function projectedNodeRects(page: Page): Promise<Rect[]> {
  return page.evaluate(() => {
    const app = (window as any).app
    const canvasRect = app.canvas.canvas.getBoundingClientRect()
    const { scale, offset } = app.canvas.ds
    return (app.canvas?.graph ?? app.graph).nodes.map((node: any) => ({
      x: canvasRect.left + (node.pos[0] + offset[0]) * scale,
      y: canvasRect.top + (node.pos[1] + offset[1]) * scale - 30 * scale,
      width: Number(node.width ?? node.size[0]) * scale,
      height: Number(node.height ?? node.size[1] + 30) * scale
    }))
  })
}

export function byTitle(nodes: NodeSnapshot[], title: string) {
  const node = nodes.find((candidate) => candidate.title === title)
  if (!node) throw new Error(`Missing node snapshot ${title}`)
  return node
}

export function uniqueCoordinates(nodes: NodeSnapshot[], axis: 'x' | 'y') {
  return [...new Set(nodes.map((node) => Math.round(node[axis])))]
}

export function expectRectsClose(actual: Rect[], expected: Rect[], tolerance = 1) {
  expect(actual).toHaveLength(expected.length)
  const sort = (rects: Rect[]) =>
    [...rects].sort((a, b) => a.x - b.x || a.y - b.y || a.width - b.width)
  for (const [index, actualRect] of sort(actual).entries()) {
    const expectedRect = sort(expected)[index]
    expect(Math.abs(actualRect.x - expectedRect.x)).toBeLessThanOrEqual(tolerance)
    expect(Math.abs(actualRect.y - expectedRect.y)).toBeLessThanOrEqual(tolerance)
    expect(Math.abs(actualRect.width - expectedRect.width)).toBeLessThanOrEqual(tolerance)
    expect(Math.abs(actualRect.height - expectedRect.height)).toBeLessThanOrEqual(tolerance)
  }
}

export function rectanglesOverlap(a: NodeSnapshot, b: NodeSnapshot) {
  return !(
    a.x + a.width <= b.x ||
    b.x + b.width <= a.x ||
    a.y + a.height <= b.y ||
    b.y + b.height <= a.y
  )
}
