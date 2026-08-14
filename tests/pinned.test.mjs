// Pinned nodes must not be moved or resized by any layout command.
//
// litegraph enforces this only in its own relative movement path
// (`!pinned && (this._pos[0] += ...)`); the `pos` setter and the indexed node.size writes
// src/main.ts uses place a node absolutely and never reach that guard. So the check lives at
// the layout boundary instead, and these tests run the REAL alignNodes() and
// alignHorizontalFlow() to prove it holds.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformSync } from 'esbuild';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(HERE, '..', 'src', 'main.ts');
const source = fs.readFileSync(SRC, 'utf8');

/** Brace-match a top-level `function name(...) {...}` out of the source. */
function extractFunction(name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `could not find ${name}() in src/main.ts`);
  let depth = 0;
  for (let i = source.indexOf('{', start); i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}' && --depth === 0) return source.slice(start, i + 1);
  }
  throw new Error(`unbalanced braces while extracting ${name}()`);
}

// If any of these disappear the extraction is broken and the suite must fail loudly rather
// than quietly testing nothing.
const REQUIRED = [
  'isPinned', 'movable', 'nodeGap', 'nodeWidth', 'outerHeight', 'bodyHeight',
  'alignNodes', 'findSourceNode', 'findTargetNode', 'analyzeNodeConnections',
  'buildNodeGraph', 'measureFlowNodes', 'alignHorizontalFlow',
];

/** Load alignNodes()/alignHorizontalFlow() bound to a selection, capturing any messages. */
function load(selectedNodes) {
  const defaultSpacing = source.match(/const DEFAULT_NODE_SPACING = (\d+)/)?.[1];
  assert.ok(defaultSpacing, 'could not read DEFAULT_NODE_SPACING from src/main.ts');

  // alignNodes() records which alignment the live spacing preview should repeat, so the two
  // names it touches have to come along. Lifted from source rather than restated here, so
  // the harness cannot quietly disagree with the real list.
  const spacingAlignments = source.match(/const SPACING_ALIGNMENTS = new Set\(\[[^\]]*\]\);/)?.[0];
  assert.ok(spacingAlignments, 'could not read SPACING_ALIGNMENTS from src/main.ts');

  const shim = `
    const NODE_TITLE_HEIGHT = 30;
    let nodeSpacingValue = ${defaultSpacing};
    ${spacingAlignments}
    let lastSpacingAlignment = null;
    function debugNodeStructure() {}
    function showMessage(text, type) { __messages.push({ text, type: type ?? 'info' }); }
    function markCanvasDirty() {}
    function getActiveCanvas() { return null; }
    function alignVerticalFlow() { __messages.push({ text: 'vertical-flow', type: 'stub' }); }
    ${REQUIRED.map(extractFunction).join('\n\n')}
    return { alignNodes, alignHorizontalFlow };
  `;
  const { code } = transformSync(shim, { loader: 'ts' });
  globalThis.window = { app: { canvas: null, graph: null } };
  const messages = [];
  return { ...new Function('selectedNodes', '__messages', code)(selectedNodes, messages), messages };
}

const TITLE = 30;

/** litegraph-shaped node: pos/size are Float32Arrays, width/height are title-aware getters. */
function makeNode(id, x, y, w = 200, h = 100, { pinned = false } = {}) {
  return {
    id,
    pos: Float32Array.from([x, y]),
    size: Float32Array.from([w, h]),
    inputs: [],
    outputs: [],
    flags: pinned ? { pinned: true } : {},
    // litegraph exposes `pinned` as a getter over flags.pinned.
    get pinned() { return !!this.flags.pinned; },
    get width() { return this.size[0]; },
    get height() { return this.size[1] + TITLE; },
  };
}

function link(from, to, id) {
  from.outputs.push({ name: 'out', links: [id] });
  to.inputs.push({ name: 'in', link: id });
}

const at = node => [node.pos[0], node.pos[1]];
const sizeOf = node => [node.size[0], node.size[1]];

test('a pinned node is not moved by an alignment', () => {
  const free = makeNode(1, 0, 0);
  const pinned = makeNode(2, 500, 400, 200, 100, { pinned: true });
  const other = makeNode(3, 50, 300);
  const { alignNodes } = load([free, pinned, other]);

  alignNodes('left');

  assert.deepEqual(at(pinned), [500, 400], 'pinned node moved');
  assert.equal(free.pos[0], other.pos[0], 'unpinned nodes did not align to each other');
});

test('a pinned node does not supply the reference edge', () => {
  // The pinned node is the leftmost. If it were measured, everything would align to x=0;
  // it is excluded, so the reference is the leftmost MOVABLE node instead.
  const pinned = makeNode(1, 0, 0, 200, 100, { pinned: true });
  const a = makeNode(2, 300, 0);
  const b = makeNode(3, 450, 200);
  const { alignNodes } = load([pinned, a, b]);

  alignNodes('left');

  assert.deepEqual(at(pinned), [0, 0]);
  assert.equal(a.pos[0], 300, 'reference edge should come from the movable nodes');
  assert.equal(b.pos[0], 300);
});

test('a pinned node is not resized', () => {
  const wide = makeNode(1, 0, 0, 400, 100);
  const pinned = makeNode(2, 0, 300, 150, 100, { pinned: true });
  const narrow = makeNode(3, 0, 600, 150, 100);
  const { alignNodes } = load([wide, pinned, narrow]);

  alignNodes('width-max');

  assert.deepEqual(sizeOf(pinned), [150, 100], 'pinned node was resized');
  assert.equal(narrow.size[0], 400, 'unpinned node should have taken the widest width');
});

test('the user is told when pinned nodes were skipped', () => {
  const a = makeNode(1, 0, 0);
  const b = makeNode(2, 100, 200);
  const pinned = makeNode(3, 500, 500, 200, 100, { pinned: true });
  const { alignNodes, messages } = load([a, b, pinned]);

  alignNodes('left');

  assert.ok(
    messages.some(m => /1 pinned node left in place/.test(m.text)),
    `expected a skip notice, got ${JSON.stringify(messages)}`
  );
});

test('a selection with too few unpinned nodes is refused, and nothing moves', () => {
  const free = makeNode(1, 0, 0);
  const pinnedA = makeNode(2, 500, 0, 200, 100, { pinned: true });
  const pinnedB = makeNode(3, 900, 0, 200, 100, { pinned: true });
  const { alignNodes, messages } = load([free, pinnedA, pinnedB]);

  alignNodes('left');

  assert.deepEqual(at(free), [0, 0], 'nothing should move when the command is refused');
  assert.deepEqual(at(pinnedA), [500, 0]);
  assert.deepEqual(at(pinnedB), [900, 0]);
  assert.ok(
    messages.some(m => m.type === 'warning' && /unpinned/.test(m.text)),
    `expected a warning naming the pinned nodes, got ${JSON.stringify(messages)}`
  );
});

test('flow layout leaves a pinned node in place', () => {
  const a = makeNode(1, 0, 0);
  const b = makeNode(2, 300, 0);
  const c = makeNode(3, 600, 0);
  const pinned = makeNode(4, 1200, 800, 200, 100, { pinned: true });
  link(a, b, 1);
  link(b, c, 2);
  const { alignHorizontalFlow } = load([a, b, c, pinned]);

  alignHorizontalFlow();

  assert.deepEqual(at(pinned), [1200, 800], 'pinned node moved during flow layout');
  assert.ok(b.pos[0] > a.pos[0], 'b should sit past its producer');
  assert.ok(c.pos[0] > b.pos[0], 'c should sit past its producer');
});

test('a pinned node in the middle of a chain does not reserve an empty column', () => {
  // a -> b -> c, with b pinned. b leaves the selection before the graph is built, so a and c
  // become independent roots rather than c being pushed out past a column b never occupies.
  const a = makeNode(1, 0, 0);
  const b = makeNode(2, 300, 0, 200, 100, { pinned: true });
  const c = makeNode(3, 600, 0);
  link(a, b, 1);
  link(b, c, 2);
  const { alignHorizontalFlow } = load([a, b, c]);

  alignHorizontalFlow();

  assert.deepEqual(at(b), [300, 0], 'pinned node moved');
  assert.equal(a.pos[0], c.pos[0], 'a and c should share a column once b is excluded');
  assert.ok(Number.isFinite(a.pos[0]), 'positions must stay finite');
});
