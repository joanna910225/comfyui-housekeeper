// Debug script to test alignment panel functionality
// Open browser console and paste this to test the alignment functions

console.log("🔧 Debug: Testing alignment panel functionality");

// Check if the panel exists
const panel = document.querySelector('.housekeeper-alignment-panel');
console.log("Panel found:", !!panel);

if (panel) {
    console.log("Panel element:", panel);
    console.log("Panel display:", window.getComputedStyle(panel).display);
    console.log("Panel opacity:", window.getComputedStyle(panel).opacity);
}

// Check if window.app is available
console.log("window.app available:", !!window.app);
if (window.app) {
    console.log("window.app.canvas available:", !!window.app.canvas);
    console.log("window.app.graph available:", !!window.app.graph);
    
    if (window.app.graph && window.app.graph._nodes) {
        const nodes = Object.values(window.app.graph._nodes);
        console.log("Total nodes:", nodes.length);
        const selectedNodes = nodes.filter(node => node && node.is_selected);
        console.log("Selected nodes:", selectedNodes.length);
    }
}

// Test alignment function manually
function testAlignment() {
    if (!window.app?.graph?._nodes) {
        console.log("❌ No graph nodes available");
        return;
    }
    
    const nodes = Object.values(window.app.graph._nodes);
    const selectedNodes = nodes.filter(node => node && node.is_selected);
    
    console.log(`Found ${selectedNodes.length} selected nodes`);
    
    if (selectedNodes.length < 2) {
        console.log("❌ Need at least 2 selected nodes to test alignment");
        console.log("💡 Select multiple nodes and try again");
        return;
    }
    
    console.log("📍 Node positions before alignment:");
    selectedNodes.forEach((node, i) => {
        console.log(`  Node ${i}: x=${node.pos[0]}, y=${node.pos[1]}`);
    });
    
    // Test left alignment
    const leftmostX = Math.min(...selectedNodes.map(node => node.pos[0]));
    selectedNodes.forEach(node => {
        node.pos[0] = leftmostX;
    });
    
    console.log("📍 Node positions after left alignment:");
    selectedNodes.forEach((node, i) => {
        console.log(`  Node ${i}: x=${node.pos[0]}, y=${node.pos[1]}`);
    });
    
    console.log("✅ Alignment test completed successfully!");
    return true;
}

// Make test function available globally
window.testAlignment = testAlignment;

console.log("💡 To test alignment manually:");
console.log("1. Select 2+ nodes in ComfyUI");
console.log("2. Run: testAlignment()");
console.log("3. Check if nodes align to the left");

// Check for extension registration
console.log("🔍 Checking for extension registration...");
console.log("Extension should have logged:");
console.log("  - 'Housekeeper: Setting up node alignment panel'");
console.log("  - 'Housekeeper: Creating alignment panel...'");
console.log("  - 'Housekeeper: Node alignment panel initialized successfully'");
