# Changelog

All notable changes to this project are documented here.

## [Unreleased]

### Fixed

- **The panel could sit under the menu bar on ComfyUI V1 and Desktop.** Its top offset is measured
  from ComfyUI's menu, but the selectors used to find that menu matched none of the elements those
  layouts use, so the panel fell back to a fixed default and overlapped. Reported with a working fix
  by [@ImagineerNL](https://github.com/ImagineerNL) in
  [#26](https://github.com/joanna910225/comfyui-housekeeper/pull/26); the selectors are theirs.
- The same measurement compared a DOM rectangle against zero with exact float equality, so it
  silently failed at any browser zoom other than 100%.

## [0.6.0] - 2026-08-12

Housekeeping. Nothing changes in the panel — this release is about what the project ships and
how that stays true. Detail in
[#27](https://github.com/joanna910225/comfyui-housekeeper/issues/27).

### Fixed

- **The build published the wrong package entirely.** `python -m build` produced a wheel whose
  only contents were five unused Vue components, installed as a top-level `components` package —
  no `__init__.py`, no `js/main.js`, none of the extension, and a name that would collide with
  anything else called `components`. Because a `src/` directory exists, setuptools' auto-discovery
  had been selecting it since the first commit.

  ComfyUI loads a custom node by scanning `custom_nodes/`, not by importing from site-packages, so
  no wheel content can make `pip install` work. The build now declares no packages and ships
  metadata only, which is the honest result. Installation is unchanged: clone into `custom_nodes`,
  or use the ComfyUI Registry.

### Removed

- The five Vue components the wheel had been shipping: 1,004 lines reachable only through two
  commented-out imports, absent from the built bundle, untouched since the first commit. With them
  gone the Vue build toolchain has nothing to compile, so the `vue`, `vue-i18n` and `primevue`
  dependencies go too. The built `js/main.js` is byte-identical afterwards, which is how we know
  none of it was doing anything.

### Internal

- **Continuous integration**, which the project had none of. Every push and pull request now runs
  the unit tests, checks the committed `js/main.js` still reproduces from source, lints the Python
  and asserts the extension imports with no ComfyUI present. A separate workflow runs the 57-test
  browser suite against a real ComfyUI on pushes to `main` and `test`.

  The bundle check is the one that matters: `js/main.js` is what ComfyUI actually serves, it is
  committed by hand, and it is minified — so it could drift from the source it is reviewed as, and
  nothing would have noticed.

## [0.5.0] - 2026-08-12

Spacing you can set, and a panel you can move without a mouse. Detail in
[#27](https://github.com/joanna910225/comfyui-housekeeper/issues/27).

### Added

- **The gap between nodes is now yours to set.** Every alignment re-stacks the selection along
  the other axis — aligning vertically also re-spaces horizontally — and that gap was fixed at
  30px with no way to change it. There is now a **Spacing** control on the panel, a slider with
  a number field beside it for an exact value, and the same setting appears under
  *Settings → Housekeeper → Layout* for anyone who prefers it there. The two stay in sync.
  Closes #20. Closes #23.

  If you never touch it, nothing changes: the default reproduces the previous 30px gap exactly,
  and there is a test asserting that.

- **The panel can be repositioned from the keyboard.** Arrow keys move it while the handle has
  focus, Shift+arrow moves further. The full round trip is now possible without a pointer:
  focus the handle, nudge it, open the panel, tab to *Reset position*. Dragging, added in 0.4.0,
  was pointer-only.

### Internal

- 23 further browser tests, covering keyboard positioning, the spacing setting and the in-panel
  control. The browser suite is now 57 tests and runs reproducibly.

## [0.4.0] - 2026-08-12

Panel placement you control. Detail in
[#27](https://github.com/joanna910225/comfyui-housekeeper/issues/27).

### Added

- **The panel can be dragged, and remembers where you put it.** Drag the handle when the panel is
  collapsed, or its header when open. [@ImagineerNL](https://github.com/ImagineerNL) proposed and
  implemented this independently in [#26](https://github.com/joanna910225/comfyui-housekeeper/pull/26),
  several months before it shipped here. A *Reset position* control appears once the panel has been
  moved and returns it to the automatic placement. The position is clamped on load and on window
  resize, so a position saved on a larger monitor can never leave the panel somewhere it cannot be
  grabbed again. Closes #22.

  Automatic placement remains the default. It is also, on its own, not something to rely on: ComfyUI
  has relocated its right-hand controls twice, so a panel that keeps out of the way today can be
  covering something after the next frontend release. Being able to move it is the durable answer.

### Fixed

- **The panel covered ComfyUI's right-hand controls.** The offset added in 0.2.0 measured the width
  of an element that still exists but is 0px wide in current ComfyUI, so no offset was applied and
  the collapsed handle sat on top of the properties toggle. It now measures the leftmost edge of
  ComfyUI's right-docked interface, which works whether the side panel is open or closed and does not
  depend on class names. Closes #25.
- **The panel header controls overlapped.** The *Reset position* button shared a row with the title
  and the close control, and the three did not fit in the panel's width — the title ran into the
  button and its label clipped to "Reset pos...". The reset control now has its own row, and the
  title yields rather than forcing the header wider than the panel.
- **The panel could not shrink on narrow viewports.** Its width was set by an expression whose
  minimum exceeded its maximum, so the viewport cap it was written to apply never took effect.
- **The panel could be pushed off the left edge** on narrow viewports, when the measured offset
  exceeded the space available. Staying on screen now takes priority over clearing ComfyUI's chrome
  when both cannot hold.

### Internal

- The browser test suite is now deterministic. ComfyUI persists part of its interface state
  server-side rather than in the browser, so tests that opened its side panel were changing the
  starting conditions of later tests, and results depended on execution order. Runs are now
  reproducible: 34 passed, 0 failed across consecutive runs, where previously one assertion failed
  in 5 of 8 runs and passed in isolation every time.
- 17 further browser tests covering panel dragging, persistence, reset, off-screen clamping and
  header layout at eight viewport widths.

### Known limitation

Dragging is pointer-driven, so the panel cannot currently be repositioned from the keyboard.

## [0.3.0] - 2026-08-12

Flow-layout correctness, plus the project's first tests. Detail in
[#27](https://github.com/joanna910225/comfyui-housekeeper/issues/27).

### Fixed

- **Flow alignment collapsed dependency stages into the same column.** Levels were assigned on the
  first visit during a breadth-first walk, which is the *shortest* path from a root, so any link that
  skipped ahead pulled a node into the same column as its own producer. On the stock ComfyUI workflow
  this produced 3 columns instead of 5, placing `KSampler` beside all three of the nodes feeding it
  and `VAEDecode` beside `KSampler`. Layout now uses longest path, so every link points forwards.
  Cycles are broken deterministically rather than looping.
- **Repeating a flow alignment used stale node sizes.** Sizes were cached on the node the first time
  a layout ran and never recalculated, so after resizing a node the next layout still reserved its old
  dimensions — a node grown from 100 to 400 tall left its neighbour drawn inside it. Sizes are now
  measured fresh on every run, which also covers collapsing a node (that changes a node's height
  without firing a resize, so it would have defeated any cache-invalidation approach).
- **Preview disagreed with the applied result** from the second flow alignment onward, for the same
  reason: the preview always recalculated while the applied layout reused the cache. Both now measure
  identically.
- **The panel covered ComfyUI's right-hand controls.** The offset added in 0.2.0 measured the width of
  `#comfyui-body-right`, which still exists but is 0px wide in current ComfyUI, so no offset was
  applied and the collapsed handle sat on top of the properties toggle. The panel now measures the
  leftmost edge of ComfyUI's right-docked interface instead, which works whether the side panel is
  open or closed and does not depend on class names that have already changed twice. Reopens #25 —
  see that issue for what remains.
- Flow alignment no longer writes `(0, 0)` into node positions before laying out. This was invisible
  on the classic canvas but reached the layout store under the Vue node renderer.

### Added

- **Test suite** — 18 tests covering flow leveling and node measurement, run with `npm test`. The
  project previously had none. Both suites were verified to fail against the previous implementation
  rather than passing vacuously.

## [0.2.0] - 2026-08-12

Correctness release. Findings and verification detail are in
[#27](https://github.com/joanna910225/comfyui-housekeeper/issues/27).

### Fixed

- **Hover preview rendered off-screen.** The preview overlay subtracted
  `document.querySelector('nav').height` from its Y coordinate. That `<nav>` is ComfyUI's
  *vertical* side toolbar (`height: 100%`), so on a 1080p install the term was ~1030px and every
  preview rectangle was drawn roughly a full screen above the canvas. The overlay now applies only
  the node title-bar offset, which is what it always needed. Closes #24.
- **Panel covered the right sidebar.** `.housekeeper-wrapper` was pinned to `right: 0` at
  `z-index: 1000` with no horizontal offset logic, while ComfyUI's right sidebar sits at
  `z-index: 10`. The panel now offsets by the sidebar's width via `--hk-right-offset` and tracks it
  with a `ResizeObserver`, so it keeps clear when the sidebar is toggled. Closes #25.
- **Alignment could not be undone.** Position and size changes were not recorded in ComfyUI's
  undo history, so Ctrl+Z after an align did nothing or reverted an unrelated edit. All alignment,
  sizing and colour operations are now bracketed in a single undo transaction using the canvas
  change events ComfyUI actually listens for. `graph.beforeChange()`/`afterChange()`, used
  previously by the colour path, forward only to a callback the frontend never assigns and
  recorded nothing.
- **Flow layout ignored vertical ordering.** Within a column, nodes were laid out in graph
  creation order rather than by vertical position, because the lookup compared a numeric node id
  against a string object key and could never match.
- **Keyboard shortcuts fired while typing.** `Ctrl/Cmd+Shift+Arrow`, `Ctrl+Shift+H` and
  `Ctrl+Alt+Arrow` were captured globally with no check for the focused element, so word-selection
  inside a prompt widget was swallowed and silently realigned the still-selected nodes instead.
  Shortcuts now ignore input, textarea, select and contenteditable targets.
- **Colour preview corrupted the undo baseline.** Hovering a swatch writes colours directly onto
  live nodes; clicking then applied on top of that state, so one undo restored the *preview*
  colour rather than the original. The preview is now rolled back before the change is committed.
- **`size-min` / `height-min` preview did not match the applied result.** One side of the
  comparison was body-only height and the other included the title bar.
- Node ids are no longer rewritten on live graph nodes. A node with id `0` was renamed to the
  string `"node_0"`, which dangled every link referencing it and corrupted serialisation. Id `0`
  is now handled correctly throughout rather than being treated as absent.
- Canvas redraws no longer call `LGraphCanvas.setDirtyCanvas`, which does not exist — all three
  copies silently fell through to a secondary path.
- Warning and error toasts no longer intercept clicks: they had no `pointer-events: none`, so for
  3.3 seconds they blocked ComfyUI's top-right menu, including while fully transparent.
- Errors are now logged to the console. Previously a failure during startup or alignment was
  swallowed by an empty `catch`, leaving the extension silently absent with no diagnostic.

### Changed

- **Housekeeper is now a frontend-only extension.** The three backend nodes (`vue-basic`,
  `housekeeper-alignment`, `housekeeper-alignment-cmd`) were unreachable placeholders from the
  ComfyUI example template and have been removed, along with `ComfyUIFEExampleVueBasic.py`. The
  panel has always been created client-side and never needed them.
- `__init__.py` no longer imports `comfy_config`, which is absent from ComfyUI builds older than
  2025-06-03 and caused the entire extension — panel included — to fail to load there. It now uses
  the long-supported `WEB_DIRECTORY` contract and imports with no ComfyUI dependencies at all.
- Removed three debug `print` banners emitted on every ComfyUI startup.
- Repository, bug tracker and documentation URLs pointed at `joanna910225/housekeeper`, which does
  not exist; they now point at `joanna910225/comfyui-housekeeper`.
- Version bumped from `0.0.1`, unchanged since the first commit, so Registry releases can be
  distinguished.

### Notes

An earlier draft of #27 reported a path-traversal issue in `ComfyUIFEExampleVueBasic.py`. That
finding was **retracted** on verification: ComfyUI added path containment to
`folder_paths.get_annotated_filepath` on 2026-07-03, and on older builds the code granted no
capability that core `LoadImage` did not already expose. The file is removed here because it is
dead template code, not for security reasons.

## [0.0.1]

Initial release.
