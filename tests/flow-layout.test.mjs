/**
 * Regression tests for flow-layout node measurement.
 *
 * Sizes used to be cached on the live node as `node._calculatedSize` and never
 * invalidated, so the second flow layout of a session laid out against whatever size
 * each node had the first time.
 *
 * As with leveling.test.mjs, src/main.ts is one closure with zero exports, so the real
 * function text is extracted by brace matching rather than tested via a copy. The
 * surrounding closure is replaced with the minimum stubs the function touches.
 *
 *   node --test tests/flow-layout.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformSync } from 'esbuild';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const source = fs.readFileSync(path.join(ROOT, 'src/main.ts'), 'utf8');

function extractFunction(name) {
  const start = source.indexOf(`function ${name}(`);
  assert.ok(start >= 0, `could not find function ${name}() in src/main.ts - renamed or extracted?`);
  let depth = 0;
  for (let i = source.indexOf('{', start); i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}' && --depth === 0) return source.slice(start, i + 1);
  }
  throw new Error(`unbalanced braces while extracting ${name}()`);
}

// Required: if any of these vanish the extraction is broken and the tests must fail loudly
// rather than silently pass.
const REQUIRED = [
  'findSourceNode', 'findTargetNode', 'analyzeNodeConnections', 'buildNodeGraph',
  'nodeWidth', 'outerHeight', 'alignHorizontalFlow',
];
// nodeGap() lives at module scope rather than inside the panel closure, but the flow
// functions call it, so it has to come along or they throw ReferenceError.
const REQUIRED_MODULE_SCOPE = ['nodeGap'];
// Optional helpers: pulled in when present. Keeping these optional means the suite can be
// run against an older revision of src/main.ts to confirm it actually catches the bug,
// instead of erroring out during extraction and looking like a pass/fail either way.
const OPTIONAL = ['bodyHeight', 'measureFlowNodes', 'movable', 'isPinned'];

/** Load alignHorizontalFlow() bound to a given selection. */
function loadFlow(selectedNodes) {
  const present = [...REQUIRED, ...REQUIRED_MODULE_SCOPE, ...OPTIONAL.filter(n => source.includes(`function ${n}(`))];
  // Module-scope state the extracted functions close over. Parsed from source rather than
  // hard-coded, so the harness cannot quietly disagree with the real default.
  const defaultSpacing = source.match(/const DEFAULT_NODE_SPACING = (\d+)/)?.[1]
  assert.ok(defaultSpacing, 'could not read DEFAULT_NODE_SPACING from src/main.ts')

  const shim = `
    const NODE_TITLE_HEIGHT = 30;
    let nodeSpacingValue = ${defaultSpacing};
    function debugNodeStructure() {}
    function showMessage() {}
    function markCanvasDirty() {}
    function getActiveCanvas() { return null; }
    ${present.map(extractFunction).join('\n\n')}
    return alignHorizontalFlow;
  `;
  const { code } = transformSync(shim, { loader: 'ts' });
  globalThis.window = { app: { canvas: null, graph: null } };
  return new Function('selectedNodes', code)(selectedNodes);
}

const TITLE = 30;

/** litegraph-shaped node: size is a Float32Array; width/height are prototype getters. */
function makeNode(id, x, y, w, h) {
  return {
    id,
    pos: Float32Array.from([x, y]),
    size: Float32Array.from([w, h]),
    inputs: [],
    outputs: [],
    collapsed: false,
    get width() { return this.size[0]; },
    get height() { return this.collapsed ? TITLE : this.size[1] + TITLE; },
  };
}

function connect(from, to, id) {
  from.outputs.push({ name: 'out', links: [id] });
  to.inputs.push({ name: 'in', link: id });
}

/**
 * A feeds both B and C, so B and C stack vertically in one column and D follows B.
 * Growing B must push C down and shift D's column right.
 */
function fixture() {
  const a = makeNode('A', 0, 0, 200, 100);
  const b = makeNode('B', 400, 0, 200, 100);
  const c = makeNode('C', 400, 300, 200, 100);
  const d = makeNode('D', 800, 0, 200, 100);
  connect(a, b, 1); connect(a, c, 2); connect(b, d, 3);
  return { nodes: [a, b, c, d], a, b, c, d };
}

test('a resize between runs is reflected in the next layout', () => {
  const { nodes, b, c, d } = fixture();
  const align = loadFlow(nodes);

  align();
  const firstC = c.pos[1];
  const firstD = d.pos[0];

  b.size[1] = 400;   // user drags B taller
  b.size[0] = 500;   // ...and wider
  align();

  assert.ok(c.pos[1] > firstC, 'C should move down to clear the now-taller B');
  assert.ok(d.pos[0] > firstD, "D's column should shift right for the now-wider B");
});

test('a resize between runs does not leave nodes overlapping', () => {
  const { nodes, b, c } = fixture();
  const align = loadFlow(nodes);
  align();
  b.size[1] = 400;
  align();

  // rendered box spans pos[1] - TITLE .. pos[1] + size[1]
  const bBottom = b.pos[1] + b.size[1];
  const cTop = c.pos[1] - TITLE;
  assert.ok(bBottom <= cTop, `B ends at ${bBottom} but C starts at ${cTop}`);
});

test('collapsing a node is picked up, though it fires no resize event', () => {
  // node.height reports the collapsed pill while node.size is untouched, so any
  // invalidation keyed on resize or on node.size would miss this.
  const { nodes, b, c } = fixture();
  const align = loadFlow(nodes);
  align();
  const expandedC = c.pos[1];

  b.collapsed = true;
  align();
  assert.ok(c.pos[1] < expandedC, 'C should move up once B collapses');
});

test('layout does not depend on how many times it has already run', () => {
  // The property the cache broke: the same graph and settings must produce the same
  // coordinates regardless of session history.
  const first = fixture();
  const alignFirst = loadFlow(first.nodes);
  first.b.size[1] = 400;
  alignFirst();
  const fresh = first.nodes.map(n => [n.pos[0], n.pos[1]]);

  const second = fixture();
  const alignSecond = loadFlow(second.nodes);
  alignSecond();                 // a run at the ORIGINAL size first
  second.b.size[1] = 400;
  alignSecond();                 // then the same resize
  const afterHistory = second.nodes.map(n => [n.pos[0], n.pos[1]]);

  assert.deepEqual(afterHistory, fresh);
});

test('no measurement state is written onto live nodes', () => {
  const { nodes } = fixture();
  loadFlow(nodes)();
  for (const node of nodes) {
    assert.equal(node._calculatedSize, undefined,
      `node ${node.id} was stamped with _calculatedSize`);
  }
});

test('node.size is never modified by a flow layout', () => {
  const { nodes } = fixture();
  const before = nodes.map(n => [n.size[0], n.size[1]]);
  loadFlow(nodes)();
  assert.deepEqual(nodes.map(n => [n.size[0], n.size[1]]), before);
});

test('positions are not reset to the origin', () => {
  // node.pos is a Float32Array, so an `if (!Array.isArray(node.pos)) node.pos = [0,0]`
  // normalisation fired for every node on every run.
  const { nodes } = fixture();
  loadFlow(nodes)();
  const atOrigin = nodes.filter(n => n.pos[0] === 0 && n.pos[1] === 0);
  assert.ok(atOrigin.length <= 1, `${atOrigin.length} nodes collapsed onto the origin`);
});
