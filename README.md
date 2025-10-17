# HouseKeeper - ComfyUI Node Alignment Tool

A simple ComfyUI custom node that provides node alignment tools and an interactive drawing canvas.

## Features

- Smart node alignment for multiple selected nodes
- 12 alignment options: Left, Right, Top, Bottom, H-flow, V-flow, Width-Max, Width-Min, Height-Max, Height-Min, Size-Max, Size-Min
- Keyboard shortcuts for quick alignment
- Auto-appearing alignment panel
- Width and height normalization for consistent node sizing

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

**Size Alignment:**
- **W-Max**: Set all selected nodes to the width of the widest node
- **W-Min**: Set all selected nodes to the width of the narrowest node (respects minimum node width requirements)
- **H-Max**: Set all selected nodes to the height of the tallest node
- **H-Min**: Set all selected nodes to the height of the shortest node (respects each node's minimum height requirements)
- **Size-Max**: Set all selected nodes to both the maximum width and maximum height (makes all nodes the same size as the largest node)
- **Size-Min**: Minimize each node to its smallest accepted size based on content (respects each node's minimum size requirements)

**How Size Alignment Works:**
- Width and height alignment normalize node dimensions across selected nodes for a cleaner, more uniform appearance
- W-Min and H-Min respect each node's minimum width/height based on its widgets and content
- Size-Max combines both W-Max and H-Max to create uniformly sized nodes
- Size-Min shrinks each node to its individual minimum size - different nodes may end up with different dimensions based on their content requirements
- All size operations respect ComfyUI's minimum node size constraints to ensure nodes remain functional
- Useful for creating consistent layouts and organizing workflows visually

### Preview Functionality
Visual preview overlays show where nodes will be positioned before applying alignment.
