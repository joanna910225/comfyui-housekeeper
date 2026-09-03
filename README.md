<div align="center">

# <img src="icons/housekeeper.svg" alt="Housekeeper" height="32"> comfyui-housekeeper
### ComfyUI Node Alignment & Color Tool

</div>

A ComfyUI extension for aligning, arranging and colouring the nodes in a workflow. It runs entirely in the browser and adds nothing to your node menu.

[View Housekeeper on the Comfy Registry](https://registry.comfy.org/nodes/housekeeper)

## What's new

**v0.9.1** — grid snapping now aligns the full visible node height in both Nodes 1.0 and Nodes 2.0, including the title bar.

**v0.9.0** — keep groups intact during layout, arrange selected members inside a group, and snap node positions and sizes to ComfyUI's grid.

**v0.8.0** — preview **Spacing** changes directly on the graph, align reliably under **Nodes 2.0**, and use **Title only** when you want colour without replacing node bodies.

**v0.7.0** — the **shortcuts are yours to change**, from ComfyUI's own *Settings → Keybinding*. The panel also works **inside subgraphs**, where its buttons used to sit disabled with no explanation.

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
- Position and node-size snapping that uses ComfyUI's own grid setting
- Adjustable spacing between nodes
- Preset colour palettes, a custom colour picker, and recently used colours
- Hover preview showing where nodes will land before you commit
- A panel you can drag anywhere, by mouse or keyboard, which stays where you put it

## Installation

In ComfyUI Manager, search for **Housekeeper** and click **Install**.

Or install it with the Comfy CLI:

```bash
comfy node install housekeeper
```

For a manual install, clone it into your ComfyUI custom nodes directory:

```bash
cd ComfyUI/custom_nodes/
git clone https://github.com/joanna910225/comfyui-housekeeper.git
```

Restart ComfyUI. The Housekeeper handle appears at the right of the canvas.

## Tested versions

The browser suite runs against a real ComfyUI. These are the combinations it covers, so these
are the ones a change has to survive:

| ComfyUI | Frontend | Renderer | Runs |
| --- | --- | --- | --- |
| v0.32.0 | 1.48.7 | Legacy canvas | Every push |
| `master` | Newest published | Legacy canvas | Nightly and full manual runs |
| v0.32.0 | 1.48.7 | Nodes 2.0 (Vue) | Nightly and full manual runs |

ComfyUI does not ship its frontend in the repository — it pins the `comfyui-frontend-package`
Python dependency and serves whichever version of that is installed, so your frontend version
is not the same thing as your ComfyUI version. ComfyUI v0.31.0 and v0.32.0 both pin frontend
1.48.7. To see what you are actually on, ComfyUI prints it at startup:

```
comfyui-frontend-package version: 1.48.7
```

**Nodes 2.0 is covered by the browser suite.** ComfyUI's Vue renderer — **Settings → Comfy →
Nodes 2.0 → Modern Node Design** — draws each node as a DOM element positioned from its own
layout store. Housekeeper writes position changes through litegraph's accessors so that store
and the graph model stay in sync; the nightly and full manual runs exercise that renderer.

Anything not in the table is untested rather than known broken. The extension is
frontend-only, so a version it has not seen usually works; if something looks wrong, the
version you are on is the first thing worth checking.

## Usage

<img src="doc/handler.png" alt="Housekeeper Handler" height="200">

Click the handle to open the panel. Select two or more nodes to use the alignment and arrangement tools — **Snap positions and sizes to grid** and **Match smallest size** also work on a single node.

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
| **Snap positions and sizes to grid** | Move selected objects and resize independently positioned selected nodes to the nearest grid multiples |

Aligning on one axis also re-spaces the selection evenly along the other, using the gap set under **Spacing**.

Grid snapping uses ComfyUI's own **Snap to grid size** setting. Node widths and body heights
round to the nearest multiple, but are raised to the next multiple when needed to stay above
the node or renderer minimum. A selected group moves as one unit; its frame is not resized.
If the group itself is not selected, selected members snap normally and the frame refits around
its original members. Housekeeper cancels the layout if that fitted frame would change group
membership.

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

- **Arrange dependency stages left to right** — one column per stage; nodes in the same stage stack vertically
- **Arrange dependency stages top to bottom** — one row per stage; nodes in the same stage sit side by side

### Spacing

The **Spacing** slider sets the gap left between nodes by every alignment and arrangement above. The same setting is available in ComfyUI's settings under **Housekeeper → Layout**, and the two stay in sync.

Once you have applied an alignment, dragging the slider repeats it as you drag: the selection spreads out or closes up under the pointer, so the value is chosen by looking at the graph rather than at the number. Typing an exact value in the box beside it does the same. However far the slider travels, the whole drag is one `Ctrl+Z`. Pinned nodes stay where they are throughout.

With nothing selected, or before any alignment has been applied, the slider only changes the setting and leaves the canvas alone.

### Colours

Browse the preset palettes with the arrows and click a chip to apply it to the selection; hovering previews the colour first. Enable **Title only** to recolour node title bars without changing their bodies. **Custom** takes any colour from the picker or a hex code. Recently used colours are kept for quick reuse.

## Keyboard Shortcuts

Use `Cmd` in place of `Ctrl` on macOS. Shortcuts are ignored while the focus is in a text field, so they will not interfere with typing a prompt.

| Shortcut | Action |
| --- | --- |
| `Ctrl+Shift+H` | Show / hide the panel |
| `Ctrl+Shift+←` | Align left edges |
| `Ctrl+Shift+→` | Align right edges |
| `Ctrl+Shift+↑` | Align top edges |
| `Ctrl+Shift+↓` | Align bottom edges |
| `Ctrl+Alt+→` | Arrange dependency stages left to right |
| `Ctrl+Alt+↓` | Arrange dependency stages top to bottom |
| `←` `→` `↑` `↓` | Move the panel, while the handle has focus |
| `Shift` + arrow | Move the panel further |

Every operation is a single undo step — press `Ctrl+Z` once to revert it.

The first seven are defaults, not fixed: they are registered as ComfyUI commands, so you can
rebind or remove any of them under **Settings → Keybinding** along with every other shortcut.
Moving the panel is bound to the focused handle rather than globally, so it is not listed there.

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
