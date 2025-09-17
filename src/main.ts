import { app } from "../../../scripts/app.js";
import { ComfyApp } from '@comfyorg/comfyui-frontend-types'

import { addWidget, ComponentWidgetImpl } from "../../../scripts/domWidget.js";

import VueExampleComponent from "@/components/VueExampleComponent.vue";
import NodeAlignmentPanel from "@/components/NodeAlignmentPanel.vue";

const comfyApp: ComfyApp = app;

// Global alignment panel instance
let alignmentPanel: any = null;

comfyApp.registerExtension({
    name: 'vue-basic',
    getCustomWidgets(app) {
        return {
            CUSTOM_VUE_COMPONENT_BASIC(node) {
                // Add custom vue component here

                const inputSpec = {
                    name: 'custom_vue_component_basic',
                    type: 'vue-basic',
                }

                const widget = new ComponentWidgetImpl({
                    node,
                    name: inputSpec.name,
                    component: VueExampleComponent,
                    inputSpec,
                    options: {}
                })

                addWidget(node, widget)

                return {widget}
            }
        }
    },
    nodeCreated(node) {
        if (node.constructor.comfyClass !== 'vue-basic') return

        const [oldWidth, oldHeight] = node.size

        node.setSize([Math.max(oldWidth, 300), Math.max(oldHeight, 520)])
    }
});

// Register alignment panel extension that loads immediately
comfyApp.registerExtension({
    name: 'housekeeper-alignment',
    
    async setup() {
        
        // Create the alignment panel immediately without waiting for a specific node
        if (!alignmentPanel) {
            try {
                // Import the alignment panel as a plain JavaScript implementation
                // instead of trying to mount a Vue component globally
                
                // Initialize the alignment panel
                initializeAlignmentPanel();
                
            } catch (error) {
                console.error("Housekeeper: Error setting up alignment panel:", error);
            }
        }
    },
    
    nodeCreated(node) {
        // Handle alignment node creation
        if (node.constructor.comfyClass === 'housekeeper-alignment') {
            // This node just serves as a placeholder/indicator
            // The actual alignment panel is global
            node.setSize([200, 100]);
            
            // Add some visual indication
            if (node.title) {
                node.title = "🎯 Alignment Panel Active";
            }
        }
    }
});

// Plain JavaScript implementation of the alignment panel
function initializeAlignmentPanel() {
    let panel: HTMLElement | null = null;
    let isVisible = false;
    let selectedNodes: any[] = [];
    let previewElements: HTMLElement[] = [];

    // Preview functionality
    function showPreview(alignmentType: string) {
        if (selectedNodes.length < 2) return;
        hidePreview(); // Clear any existing previews

        const canvas = (window as any).app?.canvas;
        if (!canvas) return;

        console.log('📍 ORIGINAL NODE POSITIONS BEFORE PREVIEW:', selectedNodes.map((node, index) => ({
            index: index,
            nodeId: node.id,
            currentPos: { x: node.pos[0], y: node.pos[1] }
        })));

        console.log('🎛️ Canvas state:', {
            canvasOffset: canvas.ds.offset,
            canvasScale: canvas.ds.scale
        });

        // Calculate preview positions using the same logic as the alignment functions
        const previewPositions = calculatePreviewPositions(alignmentType, selectedNodes);
        console.log('📍 Preview positions:', previewPositions.map((pos, index) => ({
            index: index,
            nodeId: selectedNodes[index].id,
            previewPos: { x: pos.x, y: pos.y }
        })));
        
        previewPositions.forEach((pos, index) => {
            if (pos && selectedNodes[index]) {
                const previewEl = document.createElement('div');
                previewEl.style.cssText = `
                    position: fixed;
                    background: rgba(74, 144, 226, 0.3);
                    border: 2px dashed rgba(74, 144, 226, 0.7);
                    border-radius: 4px;
                    z-index: 999;
                    pointer-events: none;
                    transition: all 0.2s ease;
                `;

                // Convert node canvas coordinates to screen coordinates using canvas transform
                // Account for high-DPI displays and container offsets
                const dpr = window.devicePixelRatio || 1;
                const baseScreenX = (pos.x + canvas.ds.offset[0]) * canvas.ds.scale;
                const baseScreenY = (pos.y + canvas.ds.offset[1]) * canvas.ds.scale;

                // Check if we need to account for container offset
                const canvasContainer = canvas.canvas.parentElement;
                const canvasRect = canvas.canvas.getBoundingClientRect();
                const containerRect = canvasContainer ? canvasContainer.getBoundingClientRect() : null;
                const containerOffsetY = containerRect ? canvasRect.top - containerRect.top : 0;

                // Calculate any offset from top of viewport to canvas
                // This accounts for toolbars, headers, or other UI elements above the canvas
                const viewportToCanvasOffset = canvasRect.top;

                // Use nav element height as base offset
                const navElement = document.querySelector('nav');
                let BASE_OFFSET = 31; // Fallback if nav not found

                if (navElement) {
                    const navRect = navElement.getBoundingClientRect();
                    BASE_OFFSET = navRect.height;
                }

                const scaledOffset = BASE_OFFSET * canvas.ds.scale;
                const screenX = canvasRect.left + baseScreenX;
                const screenY = canvasRect.top + baseScreenY - scaledOffset;

                console.log(`🔧 Nav-based offset method:`, {
                    navHeight: navElement ? navElement.getBoundingClientRect().height : 'not found',
                    baseOffset: BASE_OFFSET,
                    canvasScale: canvas.ds.scale,
                    scaledOffset: scaledOffset,
                    calculation: `${canvasRect.top} + ${baseScreenY} - ${scaledOffset} = ${screenY}`,
                    result: { x: screenX, y: screenY }
                });
                const screenWidth = pos.width * canvas.ds.scale;
                const screenHeight = pos.height * canvas.ds.scale;

                // Position preview element using calculated coordinates

                
                previewEl.style.left = screenX + 'px';
                previewEl.style.top = screenY + 'px';
                previewEl.style.width = screenWidth + 'px';
                previewEl.style.height = screenHeight + 'px';

                // Use fixed positioning relative to viewport
                document.body.appendChild(previewEl);
                previewElements.push(previewEl);
            }
        });
    }

    function hidePreview() {
        previewElements.forEach(el => {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
        previewElements = [];
    }

    function calculatePreviewPositions(alignmentType: string, nodes: any[]) {
        if (nodes.length < 2) return [];

        const positions: any[] = [];

        // Calculate reference positions using same logic as alignment functions
        const originalLeftPos = Math.min(...nodes.map((node: any) => node.pos[0]));
        const originalRightPos = Math.max(...nodes.map((node: any) => {
            let nodeWidth = 150;
            if (node.size && Array.isArray(node.size) && node.size[0]) {
                nodeWidth = node.size[0];
            } else if (typeof node.width === 'number') {
                nodeWidth = node.width;
            } else if (node.properties && typeof node.properties.width === 'number') {
                nodeWidth = node.properties.width;
            }
            return node.pos[0] + nodeWidth;
        }));
        const originalTopPos = Math.min(...nodes.map((node: any) => node.pos[1]));
        const originalBottomPos = Math.max(...nodes.map((node: any) => {
            let nodeHeight = 100;
            if (node.size && Array.isArray(node.size) && node.size[1]) {
                nodeHeight = node.size[1];
            } else if (typeof node.height === 'number') {
                nodeHeight = node.height;
            } else if (node.properties && typeof node.properties.height === 'number') {
                nodeHeight = node.properties.height;
            }
            return node.pos[1] + nodeHeight;
        }));

        switch (alignmentType) {
            case 'left':
                const leftSortedNodes = [...nodes].sort((a: any, b: any) => a.pos[1] - b.pos[1]);
                let currentY = leftSortedNodes[0].pos[1];

                // Create a map to store positions for each node ID
                const nodePositions = new Map();

                leftSortedNodes.forEach((node: any) => {
                    let nodeHeight = 100, nodeWidth = 150;
                    if (node.size && Array.isArray(node.size)) {
                        if (node.size[1]) nodeHeight = node.size[1];
                        if (node.size[0]) nodeWidth = node.size[0];
                    } else {
                        if (typeof node.height === 'number') nodeHeight = node.height;
                        if (typeof node.width === 'number') nodeWidth = node.width;
                        if (node.properties) {
                            if (typeof node.properties.height === 'number') nodeHeight = node.properties.height;
                            if (typeof node.properties.width === 'number') nodeWidth = node.properties.width;
                        }
                    }

                    nodePositions.set(node.id, {
                        x: originalLeftPos,
                        y: currentY,
                        width: nodeWidth,
                        height: nodeHeight
                    });
                    currentY += nodeHeight + 30;
                });

                // Push positions in the original node order
                nodes.forEach((node: any) => {
                    positions.push(nodePositions.get(node.id));
                });
                break;
                
            case 'right':
                const rightSortedNodes = [...nodes].sort((a: any, b: any) => a.pos[1] - b.pos[1]);
                let currentYRight = rightSortedNodes[0].pos[1];

                const rightNodePositions = new Map();

                rightSortedNodes.forEach((node: any) => {
                    let nodeHeight = 100, nodeWidth = 150;
                    if (node.size && Array.isArray(node.size)) {
                        if (node.size[1]) nodeHeight = node.size[1];
                        if (node.size[0]) nodeWidth = node.size[0];
                    } else {
                        if (typeof node.height === 'number') nodeHeight = node.height;
                        if (typeof node.width === 'number') nodeWidth = node.width;
                        if (node.properties) {
                            if (typeof node.properties.height === 'number') nodeHeight = node.properties.height;
                            if (typeof node.properties.width === 'number') nodeWidth = node.properties.width;
                        }
                    }

                    rightNodePositions.set(node.id, {
                        x: originalRightPos - nodeWidth,
                        y: currentYRight,
                        width: nodeWidth,
                        height: nodeHeight
                    });
                    currentYRight += nodeHeight + 30;
                });

                nodes.forEach((node: any) => {
                    positions.push(rightNodePositions.get(node.id));
                });
                break;
                
            case 'top':
                const topSortedNodes = [...nodes].sort((a: any, b: any) => a.pos[0] - b.pos[0]);
                let currentX = topSortedNodes[0].pos[0];

                const topNodePositions = new Map();

                topSortedNodes.forEach((node: any) => {
                    let nodeHeight = 100, nodeWidth = 150;
                    if (node.size && Array.isArray(node.size)) {
                        if (node.size[1]) nodeHeight = node.size[1];
                        if (node.size[0]) nodeWidth = node.size[0];
                    } else {
                        if (typeof node.height === 'number') nodeHeight = node.height;
                        if (typeof node.width === 'number') nodeWidth = node.width;
                        if (node.properties) {
                            if (typeof node.properties.height === 'number') nodeHeight = node.properties.height;
                            if (typeof node.properties.width === 'number') nodeWidth = node.properties.width;
                        }
                    }

                    topNodePositions.set(node.id, {
                        x: currentX,
                        y: originalTopPos,
                        width: nodeWidth,
                        height: nodeHeight
                    });
                    currentX += nodeWidth + 30;
                });

                nodes.forEach((node: any) => {
                    positions.push(topNodePositions.get(node.id));
                });
                break;
                
            case 'bottom':
                const bottomSortedNodes = [...nodes].sort((a: any, b: any) => a.pos[0] - b.pos[0]);
                let currentXBottom = originalLeftPos;

                const bottomNodePositions = new Map();

                bottomSortedNodes.forEach((node: any) => {
                    let nodeHeight = 100, nodeWidth = 150;
                    if (node.size && Array.isArray(node.size)) {
                        if (node.size[1]) nodeHeight = node.size[1];
                        if (node.size[0]) nodeWidth = node.size[0];
                    } else {
                        if (typeof node.height === 'number') nodeHeight = node.height;
                        if (typeof node.width === 'number') nodeWidth = node.width;
                        if (node.properties) {
                            if (typeof node.properties.height === 'number') nodeHeight = node.properties.height;
                            if (typeof node.properties.width === 'number') nodeWidth = node.properties.width;
                        }
                    }

                    bottomNodePositions.set(node.id, {
                        x: currentXBottom,
                        y: originalBottomPos - nodeHeight,
                        width: nodeWidth,
                        height: nodeHeight
                    });
                    currentXBottom += nodeWidth + 30;
                });

                nodes.forEach((node: any) => {
                    positions.push(bottomNodePositions.get(node.id));
                });
                break;
                
            case 'horizontal-flow':
            case 'vertical-flow':
                // For flow alignments, show current positions with highlight
                nodes.forEach((node: any) => {
                    let nodeHeight = 100, nodeWidth = 150;
                    if (node.size && Array.isArray(node.size)) {
                        if (node.size[1]) nodeHeight = node.size[1];
                        if (node.size[0]) nodeWidth = node.size[0];
                    } else {
                        if (typeof node.height === 'number') nodeHeight = node.height;
                        if (typeof node.width === 'number') nodeWidth = node.width;
                        if (node.properties) {
                            if (typeof node.properties.height === 'number') nodeHeight = node.properties.height;
                            if (typeof node.properties.width === 'number') nodeWidth = node.properties.width;
                        }
                    }
                    
                    positions.push({
                        x: node.pos[0],
                        y: node.pos[1],
                        width: nodeWidth,
                        height: nodeHeight
                    });
                });
                break;
        }
        
        return positions;
    }

    // Create alignment button helper function
    function createAlignmentButton(alignment: {type: string, icon: string, label: string}, isAdvanced: boolean = false) {
        const button = document.createElement('button');
        button.innerHTML = `
            <span style="font-size: 16px; display: block;">${alignment.icon}</span>
            <span style="font-size: 11px;">${alignment.label}</span>
        `;
        
        const baseColor = isAdvanced ? '#4a5568' : '#505050';
        const hoverColor = isAdvanced ? '#5a6578' : '#606060';
        
        button.style.cssText = `
            background: linear-gradient(145deg, ${baseColor}, #404040);
            border: 1px solid ${isAdvanced ? '#718096' : '#666'};
            border-radius: 6px;
            color: white;
            padding: 12px 8px;
            cursor: pointer;
            font-family: inherit;
            transition: all 0.2s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            min-height: 44px;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.background = `linear-gradient(145deg, ${hoverColor}, #505050)`;
            button.style.transform = 'translateY(-1px)';
            button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            showPreview(alignment.type);
        });

        button.addEventListener('mouseleave', () => {
            button.style.background = `linear-gradient(145deg, ${baseColor}, #404040)`;
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = 'none';
            hidePreview();
        });

        button.addEventListener('click', () => alignNodes(alignment.type));
        return button;
    }

    // Create the alignment panel
    function createPanel() {
        panel = document.createElement('div');
        panel.className = 'housekeeper-alignment-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(40, 40, 40, 0.95);
            border: 1px solid #555;
            border-radius: 8px;
            padding: 12px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            min-width: 220px;
            backdrop-filter: blur(10px);
            opacity: 0;
            transform: translateX(20px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: none;
            font-family: Arial, sans-serif;
            color: white;
        `;

        // Header
        const header = document.createElement('div');
        header.innerHTML = '🎯 Node Alignment';
        header.style.cssText = `
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 12px;
            text-align: center;
            border-bottom: 1px solid #555;
            padding-bottom: 8px;
        `;
        panel.appendChild(header);

        // Basic alignment buttons container
        const basicContainer = document.createElement('div');
        basicContainer.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 8px;
        `;
        
        // Advanced alignment buttons container
        const advancedContainer = document.createElement('div');
        advancedContainer.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 12px;
            border-top: 1px solid #555;
            padding-top: 8px;
        `;

        // Create alignment buttons
        const alignments = [
            { type: 'left', icon: '⇤', label: 'Left' },
            { type: 'right', icon: '⇥', label: 'Right' },
            { type: 'top', icon: '⇡', label: 'Top' },
            { type: 'bottom', icon: '⇣', label: 'Bottom' },
            { type: 'horizontal-flow', icon: '→', label: 'H-Flow' },
            { type: 'vertical-flow', icon: '↓', label: 'V-Flow' }
        ];

        const basicAlignments = alignments.slice(0, 4); // First 4 are basic
        const advancedAlignments = alignments.slice(4); // Last 2 are advanced

        // Create basic alignment buttons
        basicAlignments.forEach(alignment => {
            const button = createAlignmentButton(alignment);
            basicContainer.appendChild(button);
        });

        // Create advanced alignment buttons
        advancedAlignments.forEach(alignment => {
            const button = createAlignmentButton(alignment, true);
            advancedContainer.appendChild(button);
        });

        panel.appendChild(basicContainer);
        panel.appendChild(advancedContainer);

        // Info panel
        const infoPanel = document.createElement('div');
        infoPanel.id = 'alignment-info';
        infoPanel.style.cssText = `
            background: rgba(60, 60, 60, 0.8);
            border-radius: 6px;
            padding: 10px;
            font-size: 12px;
            text-align: center;
        `;
        infoPanel.innerHTML = `
            Select multiple nodes to enable alignment<br>
            <small style="opacity: 0.8;">
                Basic: Ctrl+Shift+Arrows<br>
                Flow: Ctrl+Alt+→/↓
            </small>
        `;
        panel.appendChild(infoPanel);

        document.body.appendChild(panel);
    }

    // Update selected nodes
    function updateSelectedNodes() {
        if (!window.app?.graph) return;
        
        const allNodes = Object.values(window.app.graph._nodes || {});
        selectedNodes = allNodes.filter((node: any) => node && node.is_selected);
        
        const hasSelectedNodes = selectedNodes.length > 1;
        
        if (hasSelectedNodes && !isVisible) {
            showPanel();
        } else if (!hasSelectedNodes && isVisible) {
            hidePanel();
        }

        // Update info text
        const infoDiv = document.getElementById('alignment-info');
        if (infoDiv) {
            if (selectedNodes.length === 0) {
                infoDiv.innerHTML = `
                    Select multiple nodes to enable alignment<br>
                    <small style="opacity: 0.8;">
                        Basic: Ctrl+Shift+Arrows<br>
                        Flow: Ctrl+Alt+→/↓
                    </small>
                `;
            } else if (selectedNodes.length === 1) {
                infoDiv.textContent = 'Select additional nodes to align';
            } else {
                infoDiv.innerHTML = `
                    ${selectedNodes.length} nodes selected - ready to align<br>
                    <small style="opacity: 0.8;">Try H-Flow/V-Flow for smart layout</small>
                `;
            }
        }

        // Enable/disable buttons
        const buttons = panel?.querySelectorAll('button');
        buttons?.forEach(button => {
            if (hasSelectedNodes) {
                (button as HTMLButtonElement).style.opacity = '1';
                (button as HTMLButtonElement).style.pointerEvents = 'auto';
            } else {
                (button as HTMLButtonElement).style.opacity = '0.5';
                (button as HTMLButtonElement).style.pointerEvents = 'none';
            }
        });
    }

    // Show panel
    function showPanel() {
        if (!panel) return;
        isVisible = true;
        panel.style.display = 'block';
        
        setTimeout(() => {
            if (panel) {
                panel.style.opacity = '1';
                panel.style.transform = 'translateX(0)';
            }
        }, 10);
    }

    // Hide panel
    function hidePanel() {
        if (!panel) return;
        isVisible = false;
        panel.style.opacity = '0';
        panel.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            if (panel) {
                panel.style.display = 'none';
            }
        }, 300);
    }

    // Advanced node analysis functions
    function analyzeNodeConnections(nodes: any[]) {
        const connections: {[nodeId: string]: {inputs: any[], outputs: any[]}} = {};
        
        // Filter out invalid nodes and ensure they have IDs
        const validNodes = nodes.filter(node => node && (node.id !== undefined || node.id !== null));
        
        validNodes.forEach(node => {
            // Create a unique identifier if node.id is missing
            const nodeId = node.id || `node_${validNodes.indexOf(node)}`;
            node.id = nodeId; // Ensure the node has an id
            
            connections[nodeId] = { inputs: [], outputs: [] };
            
            // Analyze inputs
            if (node.inputs && Array.isArray(node.inputs)) {
                node.inputs.forEach((input: any, index: number) => {
                    if (input && input.link !== null && input.link !== undefined) {
                        connections[nodeId].inputs.push({
                            index,
                            link: input.link,
                            sourceNode: findSourceNode(input.link, validNodes)
                        });
                    }
                });
            }
            
            // Analyze outputs
            if (node.outputs && Array.isArray(node.outputs)) {
                node.outputs.forEach((output: any, index: number) => {
                    if (output && output.links && Array.isArray(output.links) && output.links.length > 0) {
                        output.links.forEach((linkId: number) => {
                            const targetNode = findTargetNode(linkId, validNodes);
                            if (targetNode) {
                                connections[nodeId].outputs.push({
                                    index,
                                    link: linkId,
                                    targetNode
                                });
                            }
                        });
                    }
                });
            }
        });
        
        return connections;
    }
    
    function findSourceNode(linkId: number, nodes: any[]) {
        for (const node of nodes) {
            if (node && node.outputs && Array.isArray(node.outputs)) {
                for (const output of node.outputs) {
                    if (output && output.links && Array.isArray(output.links) && output.links.includes(linkId)) {
                        return node;
                    }
                }
            }
        }
        return null;
    }
    
    function findTargetNode(linkId: number, nodes: any[]) {
        for (const node of nodes) {
            if (node && node.inputs && Array.isArray(node.inputs)) {
                for (const input of node.inputs) {
                    if (input && input.link === linkId) {
                        return node;
                    }
                }
            }
        }
        return null;
    }
    
    function buildNodeGraph(nodes: any[], connections: any) {
        const graph: {[nodeId: string]: {level: number, order: number}} = {};
        const visited = new Set();
        
        // Filter valid nodes
        const validNodes = nodes.filter(node => node && node.id);
        
        // Find root nodes (nodes with no inputs)
        const rootNodes = validNodes.filter(node => {
            const nodeId = node.id;
            return !connections[nodeId] || 
                   !connections[nodeId].inputs.length || 
                   connections[nodeId].inputs.every((input: any) => !input.sourceNode);
        });
        
        // If no root nodes found, use the first node as root
        if (rootNodes.length === 0 && validNodes.length > 0) {
            rootNodes.push(validNodes[0]);
        }
        
        // Assign levels using BFS
        const queue = rootNodes.map(node => ({node, level: 0}));
        
        while (queue.length > 0) {
            const {node, level} = queue.shift()!;
            
            if (!node || !node.id || visited.has(node.id)) continue;
            visited.add(node.id);
            
            graph[node.id] = {level, order: 0};
            
            // Add connected nodes to queue
            if (connections[node.id] && connections[node.id].outputs) {
                connections[node.id].outputs.forEach((output: any) => {
                    if (output && output.targetNode && output.targetNode.id && !visited.has(output.targetNode.id)) {
                        queue.push({node: output.targetNode, level: level + 1});
                    }
                });
            }
        }
        
        // Handle disconnected nodes (assign them to level 0)
        validNodes.forEach(node => {
            if (node && node.id && !graph[node.id]) {
                graph[node.id] = {level: 0, order: 0};
            }
        });
        
        // Assign order within each level
        const levels: {[level: number]: any[]} = {};
        Object.entries(graph).forEach(([nodeId, data]) => {
            if (!levels[data.level]) levels[data.level] = [];
            const node = validNodes.find(n => n && n.id === nodeId);
            if (node) {
                levels[data.level].push(node);
            }
        });
        
        Object.entries(levels).forEach(([level, levelNodes]) => {
            if (levelNodes && levelNodes.length > 0) {
                levelNodes.sort((a, b) => {
                    // Safe position comparison
                    const aY = a && a.pos && a.pos[1] ? a.pos[1] : 0;
                    const bY = b && b.pos && b.pos[1] ? b.pos[1] : 0;
                    return aY - bY;
                });
                levelNodes.forEach((node, index) => {
                    if (node && node.id && graph[node.id]) {
                        graph[node.id].order = index;
                    }
                });
            }
        });
        
        return graph;
    }

    // Align nodes function with advanced options
    function alignNodes(alignmentType: string) {
        if (selectedNodes.length < 2) {
            showMessage('Please select at least 2 nodes to align', 'warning');
            return;
        }

        console.log('📍 ORIGINAL NODE POSITIONS BEFORE CLICKED ALIGNMENT:', selectedNodes.map((node, index) => ({
            index: index,
            nodeId: node.id,
            currentPos: { x: node.pos[0], y: node.pos[1] }
        })));

        try {
            // Calculate all reference positions at the start to avoid drift on consecutive clicks
            const originalLeftPos = Math.min(...selectedNodes.map((node: any) => node.pos[0]));
            const originalRightPos = Math.max(...selectedNodes.map((node: any) => {
                // Get actual node width, same logic as in positioning
                let nodeWidth = 150; // Default fallback
                if (node.size && Array.isArray(node.size) && node.size[0]) {
                    nodeWidth = node.size[0];
                } else if (typeof node.width === 'number') {
                    nodeWidth = node.width;
                } else if (node.properties && typeof node.properties.width === 'number') {
                    nodeWidth = node.properties.width;
                }
                return node.pos[0] + nodeWidth;
            }));
            const originalTopPos = Math.min(...selectedNodes.map((node: any) => node.pos[1]));
            const originalBottomPos = Math.max(...selectedNodes.map((node: any) => {
                // Get actual node height, same logic as in positioning
                let nodeHeight = 100; // Default fallback
                if (node.size && Array.isArray(node.size) && node.size[1]) {
                    nodeHeight = node.size[1];
                } else if (typeof node.height === 'number') {
                    nodeHeight = node.height;
                } else if (node.properties && typeof node.properties.height === 'number') {
                    nodeHeight = node.properties.height;
                }
                return node.pos[1] + nodeHeight;
            }));


            let referenceValue: number;

            switch (alignmentType) {
                case 'left':
                    // Align all nodes to the leftmost edge, but maintain vertical spacing
                    referenceValue = originalLeftPos;
                    
                    // Sort nodes by vertical position to maintain order
                    const leftSortedNodes = [...selectedNodes].sort((a: any, b: any) => a.pos[1] - b.pos[1]);
                    
                    // Calculate positions to ensure no overlapping
                    let currentY = leftSortedNodes[0].pos[1]; // Start from the topmost node's position
                    leftSortedNodes.forEach((node: any, index: number) => {
                        const nodeSpacing = 30; // Extra spacing for safety
                        
                        // Get node height from multiple possible sources
                        let nodeHeight = 100; // Default fallback
                        if (node.size && Array.isArray(node.size) && node.size[1]) {
                            nodeHeight = node.size[1];
                        } else if (typeof node.height === 'number') {
                            nodeHeight = node.height;
                        } else if (node.properties && typeof node.properties.height === 'number') {
                            nodeHeight = node.properties.height;
                        }
                        
                        
                        // Set position
                        node.pos[0] = referenceValue; // Align to left edge
                        node.pos[1] = currentY;

                        // Position updated successfully
                        
                        // Update x,y properties if they exist
                        if (typeof node.x === 'number') node.x = node.pos[0];
                        if (typeof node.y === 'number') node.y = node.pos[1];
                        
                        // Calculate next Y position: current Y + this node's height + spacing
                        currentY += nodeHeight + nodeSpacing;
                    });
                    break;
                    
                case 'right':
                    // Align all nodes to the rightmost edge, but maintain vertical spacing
                    referenceValue = originalRightPos;
                    
                    // Sort nodes by vertical position to maintain order
                    const rightSortedNodes = [...selectedNodes].sort((a: any, b: any) => a.pos[1] - b.pos[1]);
                    
                    // Calculate positions to ensure no overlapping
                    let currentYRight = rightSortedNodes[0].pos[1]; // Start from the topmost node's position
                    rightSortedNodes.forEach((node: any, index: number) => {
                        const nodeSpacing = 30; // Extra spacing for safety
                        
                        // Get node dimensions from multiple possible sources
                        let nodeHeight = 100; // Default fallback
                        let nodeWidth = 150; // Default fallback
                        
                        if (node.size && Array.isArray(node.size)) {
                            if (node.size[1]) nodeHeight = node.size[1];
                            if (node.size[0]) nodeWidth = node.size[0];
                        } else {
                            if (typeof node.height === 'number') nodeHeight = node.height;
                            if (typeof node.width === 'number') nodeWidth = node.width;
                            if (node.properties) {
                                if (typeof node.properties.height === 'number') nodeHeight = node.properties.height;
                                if (typeof node.properties.width === 'number') nodeWidth = node.properties.width;
                            }
                        }
                        
                        
                        // Set position
                        node.pos[0] = referenceValue - nodeWidth; // Align to right edge
                        node.pos[1] = currentYRight;
                        
                        // Update x,y properties if they exist
                        if (typeof node.x === 'number') node.x = node.pos[0];
                        if (typeof node.y === 'number') node.y = node.pos[1];
                        
                        // Calculate next Y position: current Y + this node's height + spacing
                        currentYRight += nodeHeight + nodeSpacing;
                    });
                    break;
                    
                case 'top':
                    // Align all nodes to the topmost edge, but maintain horizontal spacing
                    referenceValue = originalTopPos;
                    
                    // Sort nodes by horizontal position to maintain order
                    const topSortedNodes = [...selectedNodes].sort((a: any, b: any) => a.pos[0] - b.pos[0]);
                    
                    // Calculate positions to ensure no overlapping
                    let currentX = topSortedNodes[0].pos[0]; // Start from the leftmost node's position
                    topSortedNodes.forEach((node: any, index: number) => {
                        const nodeSpacing = 30; // Extra spacing for safety
                        
                        // Get node width from multiple possible sources
                        let nodeWidth = 150; // Default fallback
                        if (node.size && Array.isArray(node.size) && node.size[0]) {
                            nodeWidth = node.size[0];
                        } else if (typeof node.width === 'number') {
                            nodeWidth = node.width;
                        } else if (node.properties && typeof node.properties.width === 'number') {
                            nodeWidth = node.properties.width;
                        }
                        
                        
                        // Set position
                        node.pos[1] = referenceValue; // Align to top edge
                        node.pos[0] = currentX;
                        
                        // Update x,y properties if they exist
                        if (typeof node.x === 'number') node.x = node.pos[0];
                        if (typeof node.y === 'number') node.y = node.pos[1];
                        
                        // Calculate next X position: current X + this node's width + spacing
                        currentX += nodeWidth + nodeSpacing;
                    });
                    break;
                    
                case 'bottom':
                    // Align all nodes to the bottommost edge, but maintain horizontal spacing
                    referenceValue = originalBottomPos;
                    
                    
                    // Sort nodes by horizontal position to maintain order
                    const bottomSortedNodes = [...selectedNodes].sort((a: any, b: any) => a.pos[0] - b.pos[0]);
                    
                    // Calculate positions to ensure no overlapping  
                    let currentXBottom = originalLeftPos; // Start from the leftmost edge of selected area
                    
                    
                    bottomSortedNodes.forEach((node: any, index: number) => {
                        const nodeSpacing = 30; // Extra spacing for safety
                        
                        // Get node dimensions from multiple possible sources
                        let nodeWidth = 150; // Default fallback
                        let nodeHeight = 100; // Default fallback
                        
                        if (node.size && Array.isArray(node.size)) {
                            if (node.size[0]) nodeWidth = node.size[0];
                            if (node.size[1]) nodeHeight = node.size[1];
                        } else {
                            if (typeof node.width === 'number') nodeWidth = node.width;
                            if (typeof node.height === 'number') nodeHeight = node.height;
                            if (node.properties) {
                                if (typeof node.properties.width === 'number') nodeWidth = node.properties.width;
                                if (typeof node.properties.height === 'number') nodeHeight = node.properties.height;
                            }
                        }
                        
                        
                        // Calculate new position
                        const newY = referenceValue - nodeHeight; // Align to bottom edge
                        const newX = currentXBottom;
                        
                        
                        // Set position
                        node.pos[1] = newY;
                        node.pos[0] = newX;
                        
                        // Update x,y properties if they exist
                        if (typeof node.x === 'number') node.x = node.pos[0];
                        if (typeof node.y === 'number') node.y = node.pos[1];
                        
                        
                        // Calculate next X position: current X + this node's width + spacing
                        currentXBottom += nodeWidth + nodeSpacing;
                    });
                    break;
                    
                case 'horizontal-flow':
                    alignHorizontalFlow();
                    return; // Don't continue to the success message at the bottom
                    
                case 'vertical-flow':
                    alignVerticalFlow();
                    return; // Don't continue to the success message at the bottom
            }

            // Mark canvas as dirty to trigger redraw (only for basic alignment)
            try {
                if (window.app?.canvas?.setDirtyCanvas) {
                    window.app.canvas.setDirtyCanvas(true, true);
                } else if (window.app?.graph?.setDirtyCanvas) {
                    window.app.graph.setDirtyCanvas(true, true);
                } else if (window.app?.canvas) {
                    // Force a redraw by triggering a canvas event
                    window.app.canvas.draw(true, true);
                }
            } catch (redrawError) {
                console.warn('Could not trigger canvas redraw:', redrawError);
                // Continue without redraw - the changes are still applied
            }
            

            // Success message removed - clean prompt window
            
        } catch (error) {
            console.error('Alignment error:', error);
            showMessage('Error during alignment', 'error');
        }
    }
    
    // Debug function to understand node structure
    function debugNodeStructure(nodes: any[]) {
    }

    // Advanced alignment functions
    function alignHorizontalFlow() {
        try {
            debugNodeStructure(selectedNodes);
            
            // More lenient validation - check for essential properties
            const validNodes = selectedNodes.filter(node => {
                if (!node) return false;
                
                // Check for position (might be different property names)
                const hasPosition = node.pos || node.position || (typeof node.x === 'number' && typeof node.y === 'number');
                
                // Check for size (might be different property names)  
                const hasSize = node.size || node.width || node.height || 
                              (typeof node.width === 'number' && typeof node.height === 'number');
                
                const isValid = !!hasPosition && !!hasSize;
                
                if (!isValid) {
                }
                
                return isValid;
            });
            
            
            if (validNodes.length < 2) {
                showMessage(`Not enough valid nodes: ${validNodes.length}/${selectedNodes.length} nodes are valid`, 'warning');
                return;
            }
            
            // CRITICAL: Calculate starting position BEFORE normalizing nodes
            // Find starting position - TOP-LEFT CORNER of selected nodes
            const selectedLeftmostX = Math.min(...validNodes.map(node => {
                // Use original position data before normalization - handle Float32Array
                if (node.pos && (Array.isArray(node.pos) || node.pos.length !== undefined)) return node.pos[0];
                if (node.position && (Array.isArray(node.position) || node.position.length !== undefined)) return node.position[0];
                if (typeof node.x === 'number') return node.x;
                return 0; // fallback
            }));
            const selectedTopmostY = Math.min(...validNodes.map(node => {
                // Use original position data before normalization - handle Float32Array
                if (node.pos && (Array.isArray(node.pos) || node.pos.length !== undefined)) return node.pos[1];
                if (node.position && (Array.isArray(node.position) || node.position.length !== undefined)) return node.position[1];
                if (typeof node.y === 'number') return node.y;
                return 0; // fallback
            }));
            
            // Start from the top-left corner of selected nodes
            const startX = selectedLeftmostX;
            const startY = selectedTopmostY;
            
            
            // Normalize node properties for consistent access
            validNodes.forEach(node => {
                // Normalize position
                if (!node.pos) {
                    if (node.position && Array.isArray(node.position)) {
                        node.pos = node.position;
                    } else if (typeof node.x === 'number' && typeof node.y === 'number') {
                        node.pos = [node.x, node.y];
                    } else {
                        node.pos = [0, 0]; // fallback
                    }
                }
                
                // CRITICAL: NEVER modify node.size - only read for calculations
                // Get size for calculations without modifying original
                if (!node._calculatedSize) {
                    if (node.size && Array.isArray(node.size)) {
                        node._calculatedSize = [node.size[0], node.size[1]]; // Copy, don't modify
                    } else if (typeof node.width === 'number' && typeof node.height === 'number') {
                        node._calculatedSize = [node.width, node.height];
                    } else {
                        node._calculatedSize = [150, 100]; // Fallback for calculations only
                    }
                }
                
                // Ensure position array is properly formatted (OK to modify position)
                if (!Array.isArray(node.pos)) {
                    node.pos = [0, 0];
                }
                
                // NEVER modify node.size, node.width, node.height properties!
            });
            
            const connections = analyzeNodeConnections(validNodes);
            const nodeGraph = buildNodeGraph(validNodes, connections);
            
            // Configuration for horizontal flow - OPTIMIZED for staying near original location
            const COLUMN_SPACING = 40;      // Reduced spacing between columns to stay closer
            const NODE_SPACING_X = 20;      // Horizontal space between node edges
            const NODE_SPACING_Y = 15;      // Vertical space between node edges
            const LEVEL_PADDING = 5;        // Minimal padding between levels
            
            // Group nodes by level
            const levels: {[level: number]: any[]} = {};
            validNodes.forEach(node => {
                if (node && node.id) {
                    const level = nodeGraph[node.id]?.level ?? 0;
                    if (!levels[level]) levels[level] = [];
                    levels[level].push(node);
                }
            });
            
            // Position nodes horizontally with proper spacing
            Object.entries(levels).forEach(([levelStr, levelNodes]) => {
                const level = parseInt(levelStr);
                if (levelNodes && levelNodes.length > 0) {
                    levelNodes.sort((a, b) => {
                        const aOrder = a && a.id && nodeGraph[a.id] ? nodeGraph[a.id].order : 0;
                        const bOrder = b && b.id && nodeGraph[b.id] ? nodeGraph[b.id].order : 0;
                        return aOrder - bOrder;
                    });
                    
                    // Calculate total height needed for this level (preserving original node sizes)
                    const totalHeight = levelNodes.reduce((sum, node, index) => {
                        const nodeHeight = node && node._calculatedSize && node._calculatedSize[1] ? node._calculatedSize[1] : 100;
                        return sum + nodeHeight + (index < levelNodes.length - 1 ? NODE_SPACING_Y : 0);
                    }, 0);
                    
                    // Calculate maximum node width in this level for proper column spacing
                    const maxNodeWidth = Math.max(...levelNodes.map(node => 
                        node && node._calculatedSize && node._calculatedSize[0] ? node._calculatedSize[0] : 150
                    ));
                    
                    // Position horizontally (X-axis) - ensure proper spacing between columns
                    let currentX = startX;
                    if (level > 0) {
                        // Calculate cumulative width of previous levels plus spacing
                        for (let prevLevel = 0; prevLevel < level; prevLevel++) {
                            const prevLevelNodes = levels[prevLevel] || [];
                            const prevMaxWidth = Math.max(...prevLevelNodes.map(node => 
                                node && node._calculatedSize && node._calculatedSize[0] ? node._calculatedSize[0] : 150
                            ));
                            currentX += prevMaxWidth + COLUMN_SPACING + LEVEL_PADDING;
                        }
                    }
                    
                    // Position vertically (Y-axis) - start from top edge, no centering
                    let currentY = startY;
                    
                    
                    levelNodes.forEach((node, index) => {
                        if (node && node.pos && node._calculatedSize) {
                            const oldPos = [node.pos[0], node.pos[1]];
                            const calculatedSize = [node._calculatedSize[0], node._calculatedSize[1]]; // Use calculated size for display
                            
                            // Set horizontal position (column based on level) 
                            node.pos[0] = currentX;
                            
                            // Set vertical position with proper spacing
                            node.pos[1] = currentY;
                            
                            
                            // CRITICAL: NEVER modify node.size, node.width, node.height properties!
                            // All original size properties remain completely unchanged
                            
                            // Move to next vertical position for next node in this level
                            // Add the current node's height plus spacing (using calculated size)
                            currentY += node._calculatedSize[1] + NODE_SPACING_Y;
                            
                            // Only update position properties (x,y,pos) - NEVER size properties
                            if (typeof node.x === 'number') node.x = node.pos[0];
                            if (typeof node.y === 'number') node.y = node.pos[1];
                            // NEVER modify width/height/size properties - they stay exactly as they were
                        }
                    });
                }
            });
            
            // Mark canvas as dirty to trigger redraw
            try {
                if (window.app?.canvas?.setDirtyCanvas) {
                    window.app.canvas.setDirtyCanvas(true, true);
                } else if (window.app?.graph?.setDirtyCanvas) {
                    window.app.graph.setDirtyCanvas(true, true);
                } else if (window.app?.canvas) {
                    window.app.canvas.draw(true, true);
                }
            } catch (redrawError) {
                console.warn('Could not trigger canvas redraw:', redrawError);
            }
            
            // Success message removed - clean prompt window
        } catch (error) {
            console.error('Horizontal flow alignment error:', error);
            showMessage('Error in horizontal flow alignment', 'error');
        }
    }
    
    function alignVerticalFlow() {
        try {
            
            // More lenient validation - check for essential properties
            const validNodes = selectedNodes.filter(node => {
                if (!node) return false;
                
                // Check for position (might be different property names)
                const hasPosition = node.pos || node.position || (typeof node.x === 'number' && typeof node.y === 'number');
                
                // Check for size (might be different property names)  
                const hasSize = node.size || node.width || node.height || 
                              (typeof node.width === 'number' && typeof node.height === 'number');
                
                return !!hasPosition && !!hasSize;
            });
            
            
            if (validNodes.length < 2) {
                showMessage(`Not enough valid nodes: ${validNodes.length}/${selectedNodes.length} nodes are valid`, 'warning');
                return;
            }
            
            // CRITICAL: Calculate starting position BEFORE normalizing nodes
            // Find starting position - TOP-LEFT CORNER of selected nodes
            const selectedLeftmostX = Math.min(...validNodes.map(node => {
                // Use original position data before normalization - handle Float32Array
                if (node.pos && (Array.isArray(node.pos) || node.pos.length !== undefined)) return node.pos[0];
                if (node.position && (Array.isArray(node.position) || node.position.length !== undefined)) return node.position[0];
                if (typeof node.x === 'number') return node.x;
                return 0; // fallback
            }));
            const selectedTopmostY = Math.min(...validNodes.map(node => {
                // Use original position data before normalization - handle Float32Array
                if (node.pos && (Array.isArray(node.pos) || node.pos.length !== undefined)) return node.pos[1];
                if (node.position && (Array.isArray(node.position) || node.position.length !== undefined)) return node.position[1];
                if (typeof node.y === 'number') return node.y;
                return 0; // fallback
            }));
            
            // Start from the top-left corner of selected nodes
            const startX = selectedLeftmostX;
            const startY = selectedTopmostY;
            
            
            // Normalize node properties for consistent access
            validNodes.forEach(node => {
                // Normalize position
                if (!node.pos) {
                    if (node.position && Array.isArray(node.position)) {
                        node.pos = node.position;
                    } else if (typeof node.x === 'number' && typeof node.y === 'number') {
                        node.pos = [node.x, node.y];
                    } else {
                        node.pos = [0, 0]; // fallback
                    }
                }
                
                // CRITICAL: NEVER modify node.size - only read for calculations
                // Get size for calculations without modifying original
                if (!node._calculatedSize) {
                    if (node.size && Array.isArray(node.size)) {
                        node._calculatedSize = [node.size[0], node.size[1]]; // Copy, don't modify
                    } else if (typeof node.width === 'number' && typeof node.height === 'number') {
                        node._calculatedSize = [node.width, node.height];
                    } else {
                        node._calculatedSize = [150, 100]; // Fallback for calculations only
                    }
                }
                
                // Ensure position array is properly formatted (OK to modify position)
                if (!Array.isArray(node.pos)) {
                    node.pos = [0, 0];
                }
                
                // NEVER modify node.size, node.width, node.height properties!
            });
            
            const connections = analyzeNodeConnections(validNodes);
            const nodeGraph = buildNodeGraph(validNodes, connections);
            
            // Configuration for vertical flow - ENHANCED spacing to prevent overlapping
            const ROW_SPACING = 50;         // Increased spacing between rows to prevent overlap
            const NODE_SPACING_X = 30;      // Horizontal space between node edges
            const NODE_SPACING_Y = 25;      // Vertical space between node edges
            const LEVEL_PADDING = 15;       // Extra padding between levels for clarity
            
            // Group nodes by level
            const levels: {[level: number]: any[]} = {};
            validNodes.forEach(node => {
                if (node && node.id) {
                    const level = nodeGraph[node.id]?.level ?? 0;
                    if (!levels[level]) levels[level] = [];
                    levels[level].push(node);
                }
            });
            
            
            // Position nodes vertically with proper spacing
            Object.entries(levels).forEach(([levelStr, levelNodes]) => {
                const level = parseInt(levelStr);
                if (levelNodes && levelNodes.length > 0) {
                    levelNodes.sort((a, b) => {
                        const aOrder = a && a.id && nodeGraph[a.id] ? nodeGraph[a.id].order : 0;
                        const bOrder = b && b.id && nodeGraph[b.id] ? nodeGraph[b.id].order : 0;
                        return aOrder - bOrder;
                    });
                    
                    // Calculate total width needed for this level (preserving original node sizes)
                    const totalWidth = levelNodes.reduce((sum, node, index) => {
                        const nodeWidth = node && node._calculatedSize && node._calculatedSize[0] ? node._calculatedSize[0] : 150;
                        // Add spacing between all nodes, including after the last one for visual balance
                        return sum + nodeWidth + NODE_SPACING_X;
                    }, 0);
                    
                    // Calculate maximum node height in this level for proper row spacing
                    const maxNodeHeight = Math.max(...levelNodes.map(node => 
                        node && node._calculatedSize && node._calculatedSize[1] ? node._calculatedSize[1] : 100
                    ));
                    
                    // Position vertically (Y-axis) - ensure proper spacing between rows
                    let currentY = startY;
                    if (level > 0) {
                        // Calculate cumulative height of previous levels plus spacing
                        for (let prevLevel = 0; prevLevel < level; prevLevel++) {
                            const prevLevelNodes = levels[prevLevel] || [];
                            const prevMaxHeight = Math.max(...prevLevelNodes.map(node => 
                                node && node._calculatedSize && node._calculatedSize[1] ? node._calculatedSize[1] : 100
                            ));
                            currentY += prevMaxHeight + ROW_SPACING + LEVEL_PADDING;
                        }
                    }
                    
                    // Position horizontally (X-axis) - start from left edge and space nodes properly
                    let currentX = startX;
                    
                    
                    levelNodes.forEach((node, index) => {
                        if (node && node.pos && node._calculatedSize) {
                            const oldPos = [node.pos[0], node.pos[1]];
                            const calculatedSize = [node._calculatedSize[0], node._calculatedSize[1]]; // Use calculated size for display
                            
                            // Set horizontal position with proper spacing
                            node.pos[0] = currentX;
                            
                            // Set vertical position (row based on level)
                            node.pos[1] = currentY;
                            
                            
                            // CRITICAL: NEVER modify node.size, node.width, node.height properties!
                            // All original size properties remain completely unchanged
                            
                            // Move to next horizontal position for next node in this level
                            // Add the current node's width plus spacing (using calculated size)
                            currentX += node._calculatedSize[0] + NODE_SPACING_X;
                            
                            // Only update position properties (x,y,pos) - NEVER size properties
                            if (typeof node.x === 'number') node.x = node.pos[0];
                            if (typeof node.y === 'number') node.y = node.pos[1];
                            // NEVER modify width/height/size properties - they stay exactly as they were
                        }
                    });
                }
            });
            
            // Mark canvas as dirty to trigger redraw
            try {
                if (window.app?.canvas?.setDirtyCanvas) {
                    window.app.canvas.setDirtyCanvas(true, true);
                } else if (window.app?.graph?.setDirtyCanvas) {
                    window.app.graph.setDirtyCanvas(true, true);
                } else if (window.app?.canvas) {
                    window.app.canvas.draw(true, true);
                }
            } catch (redrawError) {
                console.warn('Could not trigger canvas redraw:', redrawError);
            }
            
            // Success message removed - clean prompt window
        } catch (error) {
            console.error('Vertical flow alignment error:', error);
            showMessage('Error in vertical flow alignment', 'error');
        }
    }

    // Show message toast
    function showMessage(text: string, type: string = 'info') {
        const toast = document.createElement('div');
        toast.textContent = text;
        toast.style.cssText = `
            position: fixed;
            top: 60px;
            right: 10px;
            background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#FF9800' : type === 'error' ? '#F44336' : '#2196F3'};
            color: white;
            padding: 12px 16px;
            border-radius: 6px;
            z-index: 1001;
            font-size: 14px;
            max-width: 300px;
            word-wrap: break-word;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            opacity: 0;
            transform: translateX(20px);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 10);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(20px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // Setup monitoring
    function setupCanvasMonitoring() {
        if (!window.app?.canvas) {
            setTimeout(setupCanvasMonitoring, 100);
            return;
        }

        // Monitor canvas clicks and selection changes
        if (window.app.canvas.canvas) {
            window.app.canvas.canvas.addEventListener('click', () => {
                setTimeout(updateSelectedNodes, 10);
            });
            
            window.app.canvas.canvas.addEventListener('mouseup', () => {
                setTimeout(updateSelectedNodes, 10);
            });
            
            // Also monitor keydown for selection changes
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey || e.metaKey) {
                    setTimeout(updateSelectedNodes, 10);
                }
            });
        }
        
        // Set up a periodic check for selection changes as a fallback
        setInterval(updateSelectedNodes, 500);
    }

    // Keyboard shortcuts
    function handleKeyboard(e: KeyboardEvent) {
        if (!(e.ctrlKey || e.metaKey)) return;
        
        if (e.shiftKey) {
            // Basic alignment shortcuts
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    alignNodes('left');
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    alignNodes('right');
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    alignNodes('top');
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    alignNodes('bottom');
                    break;
            }
        } else if (e.altKey) {
            // Advanced flow alignment shortcuts
            switch(e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    alignNodes('horizontal-flow');
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    alignNodes('vertical-flow');
                    break;
            }
        }
    }

    // Initialize
    createPanel();
    setupCanvasMonitoring();
    document.addEventListener('keydown', handleKeyboard);
    
}