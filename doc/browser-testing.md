# Browser verification

This page records manual browser testing for the code merged in
[#28](https://github.com/joanna910225/comfyui-housekeeper/pull/28). It separates observed behavior
from build and type-check results so release notes do not imply that an interaction was tested when
it was only inspected statically.

## Environment

- Housekeeper: v0.2.0, merge commit `9fffdc7`
- ComfyUI: 0.32.0, CPU mode
- ComfyUI frontend: 1.48.7
- Browser viewport: 1280 × 720
- Platform: macOS on Apple silicon
- Models: none; the test workflow used built-in Note and CLIP Text Encode nodes

Housekeeper loaded as a frontend-only extension. The startup log listed the extension under custom
node import times with no `(IMPORT FAILED)` entry and no Housekeeper debug banners.

## Results

| Check | Result | Evidence |
| --- | --- | --- |
| Startup/import | Pass | Housekeeper loaded in 0.0 seconds with no import failure or Housekeeper console error. |
| Hover preview at 100% | Pass | Four dashed preview rectangles appeared over the selected nodes. |
| Hover preview at 25% | Pass | Four 35 × 22.5px rectangles remained in the viewport, matching a 0.25 scale of 140 × 90px nodes. |
| Hover preview at 200% | Partial | Four 280 × 180px rectangles were created with the correct 2× scale. ComfyUI's zoom pivot moved the selected nodes and previews off-screen in this 1280px test viewport, so visual overlap could not be asserted. |
| Left-align stacking | Pass | Preview tops were 120px apart for 90px-high nodes: an exact 30px edge-to-edge gap. Applied alignment matched the preview. |
| Undo | Pass | One `Cmd+Z` restored the scattered layout after aligning all selected nodes. |
| Shortcut while typing | Partial | Sending `Cmd+Shift+Left` from a focused CLIP Text Encode textarea did not align the selected graph. The in-app browser driver did not expose a changed native selection range, even for plain `Shift+Left`, so word selection itself was not asserted. |
| Right-sidebar avoidance | Fail | The Housekeeper handle occupies the same top-right hit area as ComfyUI's `Toggle properties panel` button. Clicking the visible area toggles Housekeeper, so the sidebar cannot be opened normally while the handle is present. |
| H-Flow order within a column | Fail | Nodes labelled by starting Y rank were emitted in creation order (`rank-5`, `rank-2`, `rank-3`, `rank-1`, `rank-4`) rather than starting-Y order. |

## Remaining issues

### Flow order loses the original Y positions

The browser result has a separate cause from the numeric-ID/string-key lookup fixed in #28.
Before `buildNodeGraph()` sorts a level, the flow preparation code runs:

```ts
if (!Array.isArray(node.pos)) {
    node.pos = [0, 0]
}
```

LiteGraph positions are typed arrays, so `Array.isArray(node.pos)` is false for valid nodes. Their
positions are therefore replaced with `[0, 0]` before the Y sort runs. With every Y value equal,
the stable sort preserves graph creation order.

Reproduction:

1. Create several disconnected nodes.
2. Move them so their vertical order differs from creation order.
3. Select all nodes and click **H-Flow**.
4. Observe that the resulting column follows creation order, not the original top-to-bottom order.

### The current properties-panel toggle is covered

Housekeeper v0.2.0 looks only for `#comfyui-body-right` or `.comfyui-body-right` when calculating
`--hk-right-offset`. Frontend 1.48.7 exposes its properties-panel toggle at the right edge without
either sidebar selector present before the panel opens. At 1280px width, the toggle occupied
`x=1235..1267`, inside Housekeeper's fixed `x=958..1280` wrapper. Pointer input therefore reaches
Housekeeper instead of the ComfyUI control.

Reproduction:

1. Open Housekeeper on frontend 1.48.7.
2. Click ComfyUI's top-right properties-panel icon.
3. Observe that Housekeeper collapses or expands instead of the properties panel opening.

## Retest checklist

After either issue is fixed, rerun at least these checks:

1. Open and close the properties panel with Housekeeper expanded and collapsed; neither handle nor
   panel should overlap ComfyUI controls.
2. Resize the properties panel and confirm Housekeeper follows its live width.
3. Arrange nodes so canvas Y order differs from graph creation order; H-Flow must preserve canvas Y
   order within each column.
4. Repeat the ordering check for V-Flow using canvas X order within each row.
5. Repeat hover, 30px spacing and one-step undo checks to catch geometry regressions.

## Automated checklist coverage on `test`

The Playwright suite now targets the bundle served from `origin/test` at `774ec13`, containing
#29 and #30. The served `main.js` SHA-256 matched the branch bundle exactly:
`9301b7766b7eb917463a04c6709333514f186885eefede59834caebcd944332e`.

| Issue #27 checklist area | Automated coverage |
| --- | --- |
| Different-height and collapsed-node alignment | `geometry.spec.ts` verifies live rendered heights and exact 30px gaps. |
| Hover overlays at 1×, 0.5×, 2× | `geometry.spec.ts` compares hover rectangles with applied node bounds at every zoom. |
| Size-Min preview/apply | `geometry.spec.ts` uses nodes with different minimum sizes and compares rectangles pixel-for-pixel. |
| Longest-path H/V flow | `flow-leveling.spec.ts` verifies five stages and strict encoder → KSampler → VAEDecode → SaveImage ordering. |
| Ordering within a level | H-Flow asserts original Y order; V-Flow asserts the equivalent dependency row structure. |
| Resize and collapse remeasurement | `flow-measurement.spec.ts` runs flow twice, checks that neighbours move and never overlap. |
| Second-run preview/apply | Both resize and collapse cases compare the second hover preview with applied bounds. |
| One-step undo | `history-input-color.spec.ts` snapshots ten nodes and requires one `Cmd+Z` to restore every position. |
| Shortcut while typing | A real `CLIPTextEncode` textarea must change its native selection range without moving selected nodes. |
| Colour undo | A hover + click + `Cmd+Z` must restore the pre-hover colours. |
| Properties/right-sidebar avoidance | `panel-toast.spec.ts` hit-tests the current properties toggle expanded/collapsed and conditionally tests the legacy docked sidebar. |
| Correct placement after reload | Panel top offset and maximum height are asserted immediately after reload. |
| Toast hit-testing | A no-selection colour warning must have `pointer-events: none`; the top-right queue control remains clickable. |
| Clean initial console | The smoke test registers exception, console, response and failed-request listeners before navigation. |

Current browser results on `test`:

- Full Google Chrome run: **16 passed, 1 failed, 1 skipped** in 11 minutes.
- Passed: longest-path H/V flow, per-run resize/collapse measurement, preview/apply consistency,
  different-height and collapsed-node geometry, three zoom levels, Size-Min, one-step undo,
  prompt shortcut isolation, colour undo, immediate reload placement, toast hit-testing, and clean startup.
- Failed: the collapsed Housekeeper handle still covers ComfyUI's properties toggle. This is the
  same hit-area regression observed manually; `elementFromPoint()` resolves to Housekeeper rather
  than the ComfyUI button.
- Not applicable on frontend 1.48.7's current UI: the legacy docked sidebar selector
  (`#comfyui-body-right, .comfyui-body-right`) is not present, so its live-resize check is skipped.

Runs are headless by default so Chrome does not steal desktop focus. Use `npm run test:headed` only
when visual observation is specifically required.
