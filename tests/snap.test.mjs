/**
 * Position-only grid snapping runs through the real action branch in src/main.ts.
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
assert.match(source, /type: 'snap-to-grid', icon: snapToGridIconUrl, label: 'Snap positions to grid'/,
  'the action must keep its user-facing label');

/** Load the real snap helpers and alignNodes(). */
function load({ gridSize, units }) {
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
    const positionUnitTargets = new WeakMap();
    let selectedNodes = [];
    let lastSpacingAlignment = null;
    const originalComputeSizeMethods = new WeakMap();
    function getActiveCanvas() { return __canvas; }
    function collectPositionUnits() { return { units: [], pinnedCount: 0, blockedCount: 0 }; }
    function isPinned(node) { return !!(node?.pinned ?? node?.flags?.pinned); }
    function movable(nodes) { return nodes.filter(node => !isPinned(node)); }
    function nodeWidth(node) { return node?.size?.[0] ?? 150; }
    function outerHeight(node) { return node?.size?.[1] ?? 100; }
    function bodyHeight(node) { return node?.size?.[1] ?? 100; }
    function rendererMinNodeWidth() { return null; }
    function clampWidthToRenderer(width) { return width; }
    function markCanvasDirty() {}
    function showMessage(text, type = 'info') { __messages.push({ text, type }); }
    function warnPinnedGroup(count) { showMessage('blocked ' + count, 'warning'); }
    function alignHorizontalFlow() {}
    function alignVerticalFlow() {}
    ${extractFunction('snapGridSize')}
    ${extractFunction('snappedPositionForUnit')}
    ${extractFunction('writeSnappedPositionForUnit')}
    ${extractFunction('alignNodes')}
    __units.forEach(unit => positionUnitTargets.set(unit, [{ target: unit, isNode: true }]));
    return { alignNodes, snapGridSize, snappedPositionForUnit };
  `;
  const { code } = transformSync(shim, { loader: 'ts' });
  globalThis.window = { app: { canvas, graph: canvas.graph } };
  return { ...new Function('__canvas', '__messages', '__units', code)(canvas, messages, units), messages, undo };
}

function node(x, y, width = 173, height = 91, pinned = false) {
  return { pos: [x, y], size: [width, height], flags: { pinned } };
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

test('snap-to-grid honors non-default 21px grids and never resizes nodes', () => {
  const a = node(10.5, 31.5, 201, 117);
  const beforeSize = sizeOf(a);
  a.x = 900;
  a.y = 901;
  const { alignNodes } = load({ gridSize: 21, units: [a] });

  alignNodes('snap-to-grid', undefined, [a]);

  assert.deepEqual(positionOf(a), [21, 42]);
  assert.deepEqual(sizeOf(a), beforeSize);
  assert.deepEqual([a.x, a.y], [900, 901], 'snap must only write the Vue-safe pos tuple');
});

test('one unpinned node can snap, while a pinned standalone node is left in place and announced', () => {
  const free = node(9, 29);
  const pinned = node(31, 31, 173, 91, true);
  const { alignNodes, messages } = load({ gridSize: 20, units: [free, pinned] });

  alignNodes('snap-to-grid', undefined, [free, pinned]);

  assert.deepEqual(positionOf(free), [0, 20]);
  assert.deepEqual(positionOf(pinned), [31, 31]);
  assert.ok(messages.some(message => /1 pinned node left in place/.test(message.text)),
    `expected pinned-node notice, got ${JSON.stringify(messages)}`);
});

test('an invalid active graph grid leaves position and undo untouched', () => {
  const a = node(29, -31);
  const before = positionOf(a);
  const { alignNodes, messages, undo, snapGridSize } = load({ gridSize: 0, units: [a] });

  assert.equal(snapGridSize(), null);
  alignNodes('snap-to-grid', undefined, [a]);

  assert.deepEqual(positionOf(a), before);
  assert.deepEqual(undo, { before: 0, after: 0 });
  assert.ok(messages.some(message => /grid size is invalid/.test(message.text)),
    `expected invalid-grid warning, got ${JSON.stringify(messages)}`);
});
