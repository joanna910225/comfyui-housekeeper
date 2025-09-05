# 🎯 Advanced Node Alignment Features

## ✨ **New Enhanced Alignment Panel**

The alignment panel now includes **6 alignment options** with intelligent node arrangement capabilities:

### **📐 Basic Alignment (Original 4)**
- **Left Align** (`⇤`) - Align all nodes to leftmost edge
- **Right Align** (`⇥`) - Align all nodes to rightmost edge  
- **Top Align** (`⇡`) - Align all nodes to topmost edge
- **Bottom Align** (`⇣`) - Align all nodes to bottommost edge

### **🔄 Smart Flow Alignment (New 2)**
- **Horizontal Flow** (`→`) - Arrange nodes following connection flow horizontally
- **Vertical Flow** (`↓`) - Arrange nodes following connection flow vertically

---

## 🧠 **Intelligent Flow Alignment Rules**

### **1. Connection Analysis**
- Analyzes input/output connections between selected nodes
- Builds a directed graph based on node relationships
- Identifies data flow direction and dependencies

### **2. Proper Spacing**
- **Horizontal Spacing**: 200px between columns (H-Flow) / 150px between rows (V-Flow)
- **Vertical Spacing**: 150px between rows (H-Flow) / 200px between columns (V-Flow)  
- **Node Padding**: 20px minimum gap between adjacent nodes
- **Dynamic Centering**: Automatically centers groups within their level

### **3. Connection-Based Ordering**
- **Root Detection**: Identifies nodes with no inputs as starting points
- **Level Assignment**: Uses breadth-first search to assign hierarchy levels
- **Order Preservation**: Maintains original Y-position order within each level
- **Smart Grouping**: Groups connected nodes together logically

---

## ⌨️ **Enhanced Keyboard Shortcuts**

### **Basic Alignment**
- `Ctrl+Shift+←` → Align Left
- `Ctrl+Shift+→` → Align Right
- `Ctrl+Shift+↑` → Align Top  
- `Ctrl+Shift+↓` → Align Bottom

### **Smart Flow Alignment** ⭐ NEW
- `Ctrl+Alt+→` → Horizontal Flow Layout
- `Ctrl+Alt+↓` → Vertical Flow Layout

---

## 🎨 **Visual Improvements**

### **Enhanced Panel Design**
- **6 buttons** in a 2x3 grid layout
- **Color coding**: Advanced flow buttons have distinct styling (darker blue-gray)
- **Visual separation**: Border between basic and advanced alignment options
- **Dynamic tooltips**: Show different hints based on selection

### **Smart Information Display**
- **No selection**: Shows keyboard shortcut help
- **1 node**: Prompts for additional selection
- **2+ nodes**: Shows count + suggests flow alignment for complex layouts

---

## 🚀 **How Flow Alignment Works**

### **Horizontal Flow Example**
```
Input → Process → Transform → Output
  ↓       ↓         ↓        ↓
Detail  Filter   Enhance   Save
```
**Result**: Nodes arranged in vertical columns, flowing left-to-right based on connections

### **Vertical Flow Example**
```
Input
  ↓
Process ← Detail
  ↓
Transform ← Filter  
  ↓
Output ← Enhance
```
**Result**: Nodes arranged in horizontal rows, flowing top-to-bottom based on connections

---

## 💡 **Usage Tips**

### **When to use Flow Alignment**
- ✅ **Complex workflows** with multiple connected nodes
- ✅ **Data processing pipelines** with clear input/output flow
- ✅ **Messy layouts** that need intelligent reorganization
- ✅ **Connected node groups** that should follow logical order

### **When to use Basic Alignment**  
- ✅ **Simple edge alignment** regardless of connections
- ✅ **Mixed node types** without clear flow relationships
- ✅ **Quick positioning** for visual organization
- ✅ **Fine-tuning** after flow alignment

### **Best Practices**
1. **Start with Flow**: Use H-Flow or V-Flow for connected node groups
2. **Refine with Basic**: Use basic alignment for final positioning
3. **Select Wisely**: Only select nodes that should be arranged together
4. **Check Connections**: Flow alignment works best with properly connected nodes

---

## 🔧 **Technical Features**

### **Graph Analysis Algorithm**
- **Connection Discovery**: Scans input/output links between nodes
- **Breadth-First Traversal**: Assigns hierarchical levels based on dependency depth
- **Topological Sorting**: Orders nodes within levels by original position
- **Cycle Handling**: Gracefully handles circular dependencies

### **Smart Positioning**
- **Adaptive Spacing**: Adjusts spacing based on node sizes
- **Center Alignment**: Centers groups within their assigned space
- **Boundary Respect**: Maintains minimum distances between node boundaries
- **Overlap Prevention**: Ensures no nodes overlap after positioning

### **Performance Optimized**
- **Efficient Algorithms**: O(n+e) complexity for n nodes and e edges
- **Minimal DOM Updates**: Batches position changes for smooth animation
- **Error Handling**: Graceful fallback for malformed node structures
- **Memory Efficient**: Cleans up temporary data structures after use

---

## 🎯 **Expected Results**

After using the advanced alignment features, you should see:

✅ **Organized Layouts**: Nodes arranged in logical, readable patterns  
✅ **Proper Spacing**: Consistent gaps between all nodes  
✅ **Flow Clarity**: Clear visual representation of data flow direction  
✅ **Professional Appearance**: Clean, organized workflow layouts  
✅ **Improved Workflow**: Easier to understand and modify complex node graphs  

The enhanced alignment system transforms chaotic node arrangements into clean, professional layouts that clearly show the logical flow of your ComfyUI workflows! 🚀
