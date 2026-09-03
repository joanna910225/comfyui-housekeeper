/**
 * Position-and-size grid snapping runs through the real action branch in src/main.ts.
 * The extension has no exports, so this harness extracts its snap helpers and
 * alignNodes() rather than keeping a second copy of the rounding behaviour.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformSync } from 'esbuild';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const source = fs.readFileSync(path.join(ROOT, 'src', 'main.ts'), 'utf8');

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

const spacingActions = source.match(/const SPACING_ALIGNMENTS = new Set\(\[[\s\S]*?\]\);/)?.[0];
const positionActions = source.match(/const POSITION_ACTIONS = new Set\(\[\.\.\.SPACING_ALIGNMENTS, 'snap-to-grid'\]\);/)?.[0];
assert.ok(spacingActions, 'could not read SPACING_ALIGNMENTS from src/main.ts');
assert.ok(positionActions, 'snap-to-grid must be a POSITION_ACTIONS member');
assert.match(source, /type: 'snap-to-grid', icon: snapToGridIconUrl, label: 'Snap positions and sizes to grid'/,
  'the action must keep its user-facing label');

/** Load the real snap helpers and alignNodes(). */
function load({ gridSize, units, rendererMinWidth = null }) {
  const messages = [];
  const undo = { before: 0, after: 0 };
  const canvas = {
    graph: { getSnapToGridSize: () => gridSize },
    emitBeforeChange: () => undo.before++,
    emitAfterChange: () => undo.after++,
  };
  const shim = `
    ${spacingActions}
    ${positionActions}
    const NODE_TITLE_HEIGHT = 30;
    const positionUnitTargets = new WeakMap();
    let selectedNodes = [];
    let lastSpacingAlignment = null;
    const originalComputeSizeMethods = new WeakMap();
    function getActiveCanvas() { return __canvas; }
    function collectPositionUnits() { return { units: [], pinnedCount: 0, blockedCount: 0 }; }
    function isPinned(node) { return !!(node?.pinned ?? node?.flags?.pinned); }
    function movable(nodes) { return nodes.filter(node => !isPinned(node)); }
    function nodeWidth(node) { return node?.size?.[0] ?? 150; }
    function outerHeight(node) {
      return node?.flags?.collapsed
        ? NODE_TITLE_HEIGHT
        : (node?.size?.[1] ?? 100) + NODE_TITLE_HEIGHT;
    }
    function bodyHeight(node) { return node?.size?.[1] ?? 100; }
    function rendererMinNodeWidth() { return __rendererMinWidth; }
    function clampWidthToRenderer(width) { return width; }
    function markCanvasDirty() {}
    function showMessage(text, type = 'info') { __messages.push({ text, type }); }
    function warnPinnedGroup(count) { showMessage('blocked ' + count, 'warning'); }
    function alignHorizontalFlow() {}
    function alignVerticalFlow() {}
    ${extractFunction('snapGridSize')}
    ${extractFunction('snappedPositionForUnit')}
    ${extractFunction('writeSnappedPositionForUnit')}
    ${extractFunction('snapSizeTargetForUnit')}
    ${extractFunction('snappedSizeForNode')}
    ${extractFunction('writeNodeSize')}
    ${extractFunction('writeSnappedSizeForNode')}
    ${extractFunction('alignNodes')}
    __units.forEach(unit => positionUnitTargets.set(unit, [{ target: unit, isNode: true }]));
    return { alignNodes, snapGridSize, snappedPositionForUnit };
  `;
  const { code } = transformSync(shim, { loader: 'ts' });
  globalThis.window = { app: { canvas, graph: canvas.graph } };
  return {
    ...new Function('__canvas', '__messages', '__units', '__rendererMinWidth', code)(
      canvas,
      messages,
      units,
      rendererMinWidth
    ),
    messages,
    undo
  };
}

function node(x, y, width = 173, height = 91, pinned = false, minSize = [140, 70]) {
  return {
    pos: [x, y],
    size: [width, height],
    flags: { pinned },
    computeSize: () => minSize,
    setSize(next) { this.size = [...next]; }
  };
}

const positionOf = unit => [...unit.pos];
const sizeOf = unit => [...unit.size];

test('snap-to-grid uses the active graph grid and Math.round at 20px, including negative half-grid input', () => {
  const a = node(29, 31);
  const negativeHalf = node(-30, -21); // -30 / 20 is -1.5, which rounds to -1.
  const { alignNodes, undo } = load({ gridSize: 20, units: [a, negativeHalf] });

  alignNodes('snap-to-grid', undefined, [a, negativeHalf]);

  assert.deepEqual(positionOf(a), [20, 40]);
  assert.deepEqual(positionOf(negativeHalf), [-20, -20]);
  assert.deepEqual(undo, { before: 1, after: 1 });
});

test('snap-to-grid rounds node size to a non-default 21px grid without writing x/y aliases', () => {
  const a = node(10.5, 31.5, 201, 117);
  a.x = 900;
  a.y = 901;
  const { alignNodes } = load({ gridSize: 21, units: [a] });

  alignNodes('snap-to-grid', undefined, [a]);

  assert.deepEqual(positionOf(a), [21, 42]);
  assert.deepEqual(sizeOf(a), [210, 117]);
  assert.equal((sizeOf(a)[1] + 30) % 21, 0, 'visible height must follow the grid');
  assert.deepEqual([a.x, a.y], [900, 901], 'snap must only write the Vue-safe pos tuple');
});

test('snap-to-grid writes every position before resizing any node', () => {
  const first = node(9, 9, 173, 91);
  const second = node(31, 31, 173, 91);
  first.setSize = function (next) {
    assert.deepEqual(positionOf(second), [40, 40]);
    this.size = [...next];
  };
  const { alignNodes } = load({ gridSize: 20, units: [first, second] });

  alignNodes('snap-to-grid', undefined, [first, second]);

  assert.deepEqual(sizeOf(first), [180, 90]);
  assert.deepEqual(sizeOf(second), [180, 90]);
});

test('snap-to-grid ceils renderer and node minimums to the next grid multiple', () => {
  const a = node(9, 29, 190, 110, false, [201, 118]);
  const { alignNodes } = load({ gridSize: 21, units: [a], rendererMinWidth: 225 });

  alignNodes('snap-to-grid', undefined, [a]);

  assert.deepEqual(sizeOf(a), [231, 138]);
});

test('snap-to-grid never shrinks a node whose minimum size cannot be measured', () => {
  const a = node(9, 29, 169, 99);
  a.computeSize = () => { throw new Error('cannot measure'); };
  const { alignNodes } = load({ gridSize: 20, units: [a] });

  alignNodes('snap-to-grid', undefined, [a]);

  assert.deepEqual(sizeOf(a), [180, 110]);
});

test('one unpinned node can snap, while a pinned standalone node is left in place and announced', () => {
  const free = node(9, 29);
  const pinned = node(31, 31, 173, 91, true);
  const { alignNodes, messages } = load({ gridSize: 20, units: [free, pinned] });

  alignNodes('snap-to-grid', undefined, [free, pinned]);

  assert.deepEqual(positionOf(free), [0, 20]);
  assert.deepEqual(sizeOf(free), [180, 90]);
  assert.deepEqual(positionOf(pinned), [31, 31]);
  assert.deepEqual(sizeOf(pinned), [173, 91]);
  assert.ok(messages.some(message => /1 pinned node left in place/.test(message.text)),
    `expected pinned-node notice, got ${JSON.stringify(messages)}`);
});

test('a collapsed node snaps its position without rewriting its hidden expanded size', () => {
  const collapsed = node(31, 31, 263, 147);
  collapsed.flags.collapsed = true;
  const { alignNodes } = load({ gridSize: 20, units: [collapsed] });

  alignNodes('snap-to-grid', undefined, [collapsed]);

  assert.deepEqual(positionOf(collapsed), [40, 40]);
  assert.deepEqual(sizeOf(collapsed), [263, 147]);
});

test('an invalid active graph grid leaves position and undo untouched', () => {
  const a = node(29, -31);
  const before = positionOf(a);
  const beforeSize = sizeOf(a);
  const { alignNodes, messages, undo, snapGridSize } = load({ gridSize: 0, units: [a] });

  assert.equal(snapGridSize(), null);
  alignNodes('snap-to-grid', undefined, [a]);

  assert.deepEqual(positionOf(a), before);
  assert.deepEqual(sizeOf(a), beforeSize);
  assert.deepEqual(undo, { before: 0, after: 0 });
  assert.ok(messages.some(message => /grid size is invalid/.test(message.text)),
    `expected invalid-grid warning, got ${JSON.stringify(messages)}`);
});
