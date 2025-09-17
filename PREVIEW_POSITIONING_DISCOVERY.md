# Preview Positioning Discovery

## Problem
When implementing preview functionality for ComfyUI node alignment, there was a consistent vertical drift between the preview position and the actual aligned node position. The preview elements appeared below where the nodes would actually be positioned after alignment.

## Investigation Process

### Initial Approach - Complex Coordinate Conversion
1. **Mathematical Accuracy**: Used LiteGraph's native `convertOffsetToCanvas()` method
2. **Canvas Transforms**: Applied canvas offset and scale transformations
3. **Viewport Positioning**: Accounted for canvas position within viewport
4. **Result**: Mathematically perfect calculations that matched alignment function exactly (0px difference)
5. **Issue**: Despite perfect mathematics, visual drift remained

### Key Finding - The 40-50px Vertical Offset
- User observation: "The vertical drift is the same value every time for every node"
- User insight: "I feel that the vertical drift is the same value as the tool bar height at the top"
- Consistent offset range: 40-80px depending on zoom level

### Failed Approaches
1. **UI Element Detection**: Searched for toolbar, header, menu elements
2. **Container Transforms**: Checked for CSS transforms on parent elements
3. **Device Pixel Ratio**: Attempted DPI scaling corrections
4. **Canvas Container Positioning**: Tried different positioning strategies

### The Solution - Navigation Element Height

The breakthrough came when we discovered the issue was related to the top navigation bar in ComfyUI:

```typescript
// Use nav element height as base offset
const navElement = document.querySelector('nav');
let BASE_OFFSET = 31; // Fallback if nav not found

if (navElement) {
    const navRect = navElement.getBoundingClientRect();
    BASE_OFFSET = navRect.height;
}

// Scale offset with canvas zoom level
const scaledOffset = BASE_OFFSET * canvas.ds.scale;
const screenY = canvasRect.top + baseScreenY - scaledOffset;
```

## Why This Works

1. **Dynamic Detection**: Automatically gets the actual nav element height (~30.5px)
2. **Zoom Scaling**: Scales the offset with canvas zoom level to maintain accuracy
3. **Future-Proof**: Adapts if ComfyUI nav height changes in updates
4. **Simple & Reliable**: Direct approach without complex calculations

## Key Lessons

1. **Simple Solutions First**: Complex mathematical approaches don't always solve UI positioning issues
2. **User Observations**: The user's insight about toolbar height was the critical breakthrough
3. **Zoom Considerations**: Fixed pixel offsets fail when users zoom in/out
4. **UI Element Discovery**: ComfyUI's nav element was the actual source of the offset

## Final Implementation

The preview positioning now:
- ✅ Works correctly at all zoom levels
- ✅ Automatically adapts to nav element height
- ✅ Provides pixel-perfect alignment between preview and actual positions
- ✅ Requires no manual calibration or guessing

## Code Location
Implementation in: `src/main.ts` lines ~148-167