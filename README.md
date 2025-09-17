# HouseKeeper - ComfyUI Node Alignment Tool

A simple ComfyUI custom node that provides node alignment tools and an interactive drawing canvas.

## Features

- Smart node alignment for multiple selected nodes
- 6 alignment options: Left, Right, Top, Bottom, H-flow, V-flow
- Keyboard shortcuts for quick alignment
- Auto-appearing alignment panel

## Installation

Navigate to your ComfyUI custom nodes directory and clone:

```bash
cd ComfyUI/custom_nodes/
git clone https://github.com/joanna910225/comfyui-housekeeper.git
```

Restart ComfyUI to load the new nodes.

## Usage

### Node Alignment
1. Select multiple nodes (2 or more) in ComfyUI
2. Alignment panel appears automatically in top-right corner
3. Click alignment buttons or use keyboard shortcuts:

**Basic Alignment:**
- `Ctrl+Shift+←` - Align Left (align to leftmost node)
- `Ctrl+Shift+→` - Align Right (align to rightmost node)
- `Ctrl+Shift+↑` - Align Top (align to topmost node)  
- `Ctrl+Shift+↓` - Align Bottom (align to bottommost node)

**Flow Alignment:**
- `Alt+→` - H-Flow (arrange nodes horizontally by workflow connections)
- `Alt+↓` - V-Flow (arrange nodes vertically by workflow connections)

**How Flow Alignment Works:**
- **H-Flow**: Analyzes node connections and arranges them left-to-right in columns based on their workflow dependencies
- **V-Flow**: Analyzes node connections and arranges them top-to-bottom in rows based on their workflow dependencies
- Flow alignment respects the selected nodes' bounding box and positions relative to existing connections

### Preview Functionality
Visual preview overlays show where nodes will be positioned before applying alignment.
