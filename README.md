<div align="center">

# <img src="icons/housekeeper.svg" alt="Housekeeper" height="32"> comfyui-housekeeper
### ComfyUI Node Alignment & Color Tool

</div>

A ComfyUI extension for aligning, arranging and colouring the nodes in a workflow. It runs entirely in the browser and adds nothing to your node menu.

## What's new

**v0.6.2** — **pinned nodes stay pinned.** Alignment and arrangement now leave them exactly where they are, however they are selected.

**v0.6.1** — arranging a selection whose links form a loop no longer throws the layout off the canvas, and the panel stays clear of the menu bar on ComfyUI's V1 and Desktop layouts.

**v0.5.0** — the gap between nodes is now yours to set, from a **Spacing** control on the panel or ComfyUI's settings. The panel can also be repositioned from the keyboard.

**v0.4.0** — the panel can be **dragged anywhere and remembers where you put it**, and no longer covers ComfyUI's own right-hand controls.

**v0.3.0** — flow arrangement now lays nodes out one column per dependency stage instead of collapsing several into one, and repeating it after resizing a node uses the node's real size.

**v0.2.0** — the hover preview appears where it should (it had been drawing about a screen height above the canvas), `Ctrl+Z` undoes an alignment in one step, and shortcuts no longer fire while you are typing in a prompt.

Full detail in [CHANGELOG.md](CHANGELOG.md), or on the
[releases page](https://github.com/joanna910225/comfyui-housekeeper/releases).

<div align="center">
<img src="doc/screenshot.png" alt="Housekeeper Panel" height="400">
</div>

## Demo

<div align="center">

### Node Alignment
<img src="doc/alignment.gif" alt="Node Alignment Demo" width="600">

### Size Alignment
<img src="doc/size-alignment.gif" alt="Size Alignment Demo" width="600">

### Color Management
<img src="doc/color.gif" alt="Color Management Demo" width="600">

</div>

## Features

- Six alignment options — four edges and two centre lines
- Size normalisation, to make a selection match in width, height or both
- Dependency-aware arrangement that follows the links in your workflow
- Adjustable spacing between nodes
- Preset colour palettes, a custom colour picker, and recently used colours
- Hover preview showing where nodes will land before you commit
- A panel you can drag anywhere, by mouse or keyboard, which stays where you put it

## Installation

Clone into your ComfyUI custom nodes directory:

```bash
cd ComfyUI/custom_nodes/
git clone https://github.com/joanna910225/comfyui-housekeeper.git
```

Restart ComfyUI. The Housekeeper handle appears at the right of the canvas.

## Tested versions

The browser suite runs against a real ComfyUI. These are the combinations it runs against, so
these are the ones a change has to survive:

| ComfyUI | Frontend | Renderer | Runs |
| --- | --- | --- | --- |
| v0.32.0 | 1.48.7 | Legacy canvas | Every push |
| `master` | Newest published (1.49.6 today) | Legacy canvas | Nightly |
| v0.32.0 | 1.48.7 | Nodes 2.0 (Vue) | Nightly, not passing yet |

ComfyUI does not ship its frontend in the repository — it pins the `comfyui-frontend-package`
Python dependency and serves whichever version of that is installed, so your frontend version
is not the same thing as your ComfyUI version. ComfyUI v0.31.0 and v0.32.0 both pin frontend
1.48.7. To see what you are actually on, ComfyUI prints it at startup:

```
comfyui-frontend-package version: 1.48.7
```

**Nodes 2.0 is not supported yet.** ComfyUI's Vue renderer — **Settings → Comfy → Nodes 2.0 →
Modern Node Design**, still marked experimental, and on by default on Desktop and Cloud
installs — draws each node as a DOM element positioned from its own layout store. Housekeeper
writes node positions straight into litegraph's arrays, which that store does not see, so the
buttons appear to do nothing. Tracked in
[#52](https://github.com/joanna910225/comfyui-housekeeper/issues/52); the nightly run covers
that renderer so the fix has something to prove itself against.

Anything not in the table is untested rather than known broken. The extension is
frontend-only, so a version it has not seen usually works; if something looks wrong, the
version you are on is the first thing worth checking.

## Usage

<img src="doc/handler.png" alt="Housekeeper Handler" height="200">

Click the handle to open the panel. Select two or more nodes to use the alignment and arrangement tools — **Match smallest size** is the exception and works on a single node.

**Pinned nodes are left alone.** Pin anything you want to stay exactly where it is and Housekeeper will not move or resize it, however it is selected. The rest of the selection arranges among itself, and the panel says how many nodes were skipped.

### Moving the panel

Drag the handle, or the panel's title bar while it is open, to put it anywhere on screen. The position is remembered. With the handle focused you can also move it with the arrow keys, or **Shift + arrow** to move further. A **Reset position** button appears in the panel once you have moved it.

### Alignment

| Button | Effect |
| --- | --- |
| **Align left edges** | Line the selection up on its leftmost edge |
| **Align right edges** | Line it up on its rightmost edge |
| **Align top edges** | Line it up on its topmost edge |
| **Align bottom edges** | Line it up on its bottommost edge |
| **Center horizontally** | Line the selection up on a shared vertical centre line |
| **Center vertically** | Line it up on a shared horizontal centre line |

Aligning on one axis also re-spaces the selection evenly along the other, using the gap set under **Spacing**.

### Size Adjustment

| Button | Effect |
| --- | --- |
| **Match widest width** | Every node takes the widest width in the selection |
| **Match narrowest width** | Every node takes the narrowest |
| **Match tallest height** | Every node takes the tallest height |
| **Match shortest height** | Every node takes the shortest |
| **Match largest size** | Every node takes the largest width and height |
| **Match smallest size** | Each node shrinks to the smallest size it will accept |

### Flow Alignment

Arranges the selection by following the links between nodes, so each node sits past everything that feeds it:

- **Distribute horizontally** — dependencies run left to right, one column per stage
- **Distribute vertically** — the same, top to bottom

### Spacing

The **Spacing** slider sets the gap left between nodes by every alignment and arrangement above. The same setting is available in ComfyUI's settings under **Housekeeper → Layout**, and the two stay in sync.

### Colours

Browse the preset palettes with the arrows and click a chip to apply it to the selection; hovering previews the colour first. **Custom** takes any colour from the picker or a hex code. Recently used colours are kept for quick reuse.

## Keyboard Shortcuts

Use `Cmd` in place of `Ctrl` on macOS. Shortcuts are ignored while the focus is in a text field, so they will not interfere with typing a prompt.

| Shortcut | Action |
| --- | --- |
| `Ctrl+Shift+H` | Show / hide the panel |
| `Ctrl+Shift+←` | Align left edges |
| `Ctrl+Shift+→` | Align right edges |
| `Ctrl+Shift+↑` | Align top edges |
| `Ctrl+Shift+↓` | Align bottom edges |
| `Ctrl+Alt+→` | Distribute horizontally |
| `Ctrl+Alt+↓` | Distribute vertically |
| `←` `→` `↑` `↓` | Move the panel, while the handle has focus |
| `Shift` + arrow | Move the panel further |

Every operation is a single undo step — press `Ctrl+Z` once to revert it.

Making these rebindable is tracked in [#43](https://github.com/joanna910225/comfyui-housekeeper/issues/43).

## Contributing

The extension is built from TypeScript. **`js/main.js` is a build artifact — do not edit it directly**, as the next build overwrites it and CI rejects a bundle that does not match its source.

```bash
npm ci
npm run build     # regenerates js/main.js from src/main.ts
npm test          # unit tests
```

Commit the rebuilt `js/main.js` alongside your source change: it is what ComfyUI actually serves, so the two must stay in step.

Browser tests run against a real ComfyUI — see [e2e/README.md](e2e/README.md).

## License

MIT — see [LICENSE](LICENSE).
