/**
 * Regression tests for flow-alignment level assignment.
 *
 * src/main.ts is a single 3,548-line closure with zero exports, so there is nothing to
 * import. Rather than testing a copy of the algorithm (which would drift from the real
 * one), this extracts the actual function text out of src/main.ts by brace matching,
 * strips the TypeScript with esbuild, and runs it. When the extraction stops finding a
 * function the tests fail loudly rather than silently passing against stale code.
 *
 * Replace this with a normal import once the layout math is extracted into its own module.
 *
 *   node --test tests/leveling.test.mjs      (or: npm run test:leveling)
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
  assert.ok(start >= 0, `could not find function ${name}() in src/main.ts - has it been renamed or extracted?`);
  let depth = 0;
  for (let i = source.indexOf('{', start); i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}' && --depth === 0) return source.slice(start, i + 1);
  }
  throw new Error(`unbalanced braces while extracting ${name}()`);
}

const NAMES = ['findSourceNode', 'findTargetNode', 'analyzeNodeConnections', 'buildNodeGraph'];
const { code } = transformSync(NAMES.map(extractFunction).join('\n\n') + `\nreturn { ${NAMES} };`, { loader: 'ts' });
const { analyzeNodeConnections, buildNodeGraph } = new Function(code)();

/** Build nodes in litegraph's shape from an edge list. */
function graphOf(ids, edges) {
  const nodes = new Map(ids.map(id => [id, { id, pos: [0, 0], size: [100, 60], inputs: [], outputs: [] }]));
  let link = 1;
  for (const [from, to] of edges) {
    nodes.get(from).outputs.push({ name: 'out', links: [link] });
    nodes.get(to).inputs.push({ name: 'in', link });
    link++;
  }
  return [...nodes.values()];
}

const levelsOf = nodes => buildNodeGraph(nodes, analyzeNodeConnections(nodes));
const depthOf = graph => new Set(Object.values(graph).map(d => d.level)).size;

test('stock ComfyUI workflow lays out one column per dependency stage', () => {
  // UNETLoader -> ModelSamplingAuraFlow -> KSampler -> VAEDecode -> SaveImage,
  // with EmptySD3LatentImage -> KSampler and VAELoader -> VAEDecode as skip links
  // straight from roots. Shortest-path BFS collapsed this to 3 columns, putting
  // KSampler beside its own inputs and VAEDecode beside KSampler.
  const nodes = graphOf(
    ['UNETLoader', 'CLIPLoader', 'VAELoader', 'EmptyLatent', 'ModelSampling', 'Pos', 'Neg', 'KSampler', 'VAEDecode', 'SaveImage'],
    [
      ['UNETLoader', 'ModelSampling'], ['ModelSampling', 'KSampler'],
      ['CLIPLoader', 'Pos'], ['CLIPLoader', 'Neg'],
      ['Pos', 'KSampler'], ['Neg', 'KSampler'],
      ['EmptyLatent', 'KSampler'],
      ['KSampler', 'VAEDecode'], ['VAELoader', 'VAEDecode'],
      ['VAEDecode', 'SaveImage'],
    ]
  );
  const graph = levelsOf(nodes);
  assert.equal(depthOf(graph), 5);
  assert.equal(graph.KSampler.level, 2, 'KSampler must sit past its deepest input, not beside it');
  assert.equal(graph.VAEDecode.level, 3);
  assert.equal(graph.SaveImage.level, 4);
});

test('every edge points strictly forward', () => {
  const nodes = graphOf([1, 2, 3, 4, 5], [[1, 2], [2, 3], [3, 4], [1, 4], [4, 5], [1, 5]]);
  const graph = levelsOf(nodes);
  const conns = analyzeNodeConnections(nodes);
  for (const node of nodes) {
    for (const { targetNode } of conns[node.id].outputs) {
      assert.ok(graph[targetNode.id].level > graph[node.id].level,
        `edge ${node.id} -> ${targetNode.id} is not forward`);
    }
  }
});

test('a skip link does not drag a node into its producer\'s column', () => {
  const graph = levelsOf(graphOf(['A', 'B', 'C'], [['A', 'B'], ['B', 'C'], ['A', 'C']]));
  assert.equal(graph.C.level, 2);
});

test('a node sits one past its deepest producer, not its first', () => {
  // diamond with one long arm: 1 -> 2 -> 3 -> 4 and 1 -> 4
  const graph = levelsOf(graphOf([1, 2, 3, 4], [[1, 2], [2, 3], [3, 4], [1, 4]]));
  assert.equal(graph[4].level, 3);
});

test('disconnected components are levelled independently', () => {
  const graph = levelsOf(graphOf([1, 2, 3, 4, 5], [[1, 2], [3, 4]]));
  assert.equal(graph[1].level, 0);
  assert.equal(graph[3].level, 0);
  assert.equal(graph[5].level, 0, 'an isolated node belongs at the start');
});

test('cycles terminate and still place every node', () => {
  for (const [name, nodes] of [
    ['2-cycle', graphOf([1, 2], [[1, 2], [2, 1]])],
    ['3-cycle', graphOf([1, 2, 3], [[1, 2], [2, 3], [3, 1]])],
    ['cycle with tail', graphOf([1, 2, 3, 4], [[1, 2], [2, 3], [3, 1], [3, 4]])],
    ['root feeding a cycle', graphOf([0, 1, 2, 3], [[0, 1], [1, 2], [2, 3], [3, 1]])],
  ]) {
    const graph = levelsOf(nodes);
    for (const node of nodes) {
      assert.ok(graph[node.id] !== undefined, `${name}: node ${node.id} was never placed`);
      assert.ok(Number.isFinite(graph[node.id].level) && graph[node.id].level >= 0,
        `${name}: node ${node.id} has a non-finite level`);
    }
  }
});

test('node id 0 is treated as a real id, not a missing one', () => {
  const graph = levelsOf(graphOf([0, 1, 2], [[0, 1], [1, 2]]));
  assert.equal(graph[0].level, 0);
  assert.equal(graph[2].level, 2);
});

test('parallel links between the same pair count once', () => {
  const nodes = graphOf([1, 2], [[1, 2]]);
  nodes[0].outputs.push({ name: 'out2', links: [99] });
  nodes[1].inputs.push({ name: 'in2', link: 99 });
  assert.equal(levelsOf(nodes)[2].level, 1);
});

test('nodes within a level are ordered by vertical position', () => {
  // Regression for the id lookup that compared a number against a string key, which
  // left every `order` at 0 and made the downstream sorts no-ops.
  const nodes = graphOf(['root', 'a', 'b', 'c'], [['root', 'a'], ['root', 'b'], ['root', 'c']]);
  nodes.find(n => n.id === 'a').pos = [0, 800];
  nodes.find(n => n.id === 'b').pos = [0, 0];
  nodes.find(n => n.id === 'c').pos = [0, 400];
  const graph = levelsOf(nodes);
  assert.equal(graph.b.order, 0);
  assert.equal(graph.c.order, 1);
  assert.equal(graph.a.order, 2);
});

test('is deterministic', () => {
  const nodes = graphOf([1, 2, 3, 4, 5], [[1, 2], [1, 3], [2, 4], [3, 4], [4, 5]]);
  assert.deepEqual(levelsOf(nodes), levelsOf(nodes));
});

test('handles a 1000-node graph without pathological slowdown', () => {
  const ids = [...Array(1000).keys()];
  const edges = [];
  for (let i = 1; i < 1000; i++) {
    edges.push([i - 1, i]);
    if (i > 2 && i % 3 === 0) edges.push([i - 3, i]);
  }
  const started = Date.now();
  const graph = levelsOf(graphOf(ids, edges));
  assert.equal(depthOf(graph), 1000);
  assert.ok(Date.now() - started < 5000, 'levelling 1000 nodes should not take seconds');
});
