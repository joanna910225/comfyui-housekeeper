import { app } from "../../../scripts/app.js";
import { ComfyApp } from '@comfyorg/comfyui-frontend-types'

// import { addWidget, ComponentWidgetImpl } from "../../../scripts/domWidget.js";

// import VueExampleComponent from "@/components/VueExampleComponent.vue";
// import NodeAlignmentPanel from "@/components/NodeAlignmentPanel.vue";

import homeIconUrl from "../icons/housekeeper.svg?url";
import collapseIconUrl from "../icons/collapse.svg?url";
import alignLeftIconUrl from "../icons/left.svg?url";
import alignRightIconUrl from "../icons/right.svg?url";
import alignTopIconUrl from "../icons/top.svg?url";
import alignBottomIconUrl from "../icons/bottom.svg?url";
import widthCenterIconUrl from "../icons/width-center.svg?url";
import heightCenterIconUrl from "../icons/height-center.svg?url";
import widthMaxIconUrl from "../icons/width-max.svg?url";
import widthMinIconUrl from "../icons/width-min.svg?url";
import heightMaxIconUrl from "../icons/height-max.svg?url";
import heightMinIconUrl from "../icons/height-min.svg?url";
import sizeMaxIconUrl from "../icons/size-max.svg?url";
import sizeMinIconUrl from "../icons/size-min.svg?url";
import horizontalFlowIconUrl from "../icons/horizontal-flow.svg?url";
import verticalFlowIconUrl from "../icons/vertical-flow.svg?url";

const comfyApp: ComfyApp = app;

// Global alignment panel instance
let alignmentPanel: any = null;

// Commented out Vue-based extension - uncomment if you need Vue components
/*
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
*/

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
                // Without this the extension vanishes silently and field reports
                // ("it stopped working after I updated ComfyUI") are undiagnosable.
                console.error('[housekeeper] failed to initialize alignment panel:', error);
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
    let wrapper: HTMLElement | null = null;
    let panel: HTMLElement | null = null;
    let infoPanel: HTMLElement | null = null;
    let toggleHandle: HTMLButtonElement | null = null;
    let resetPositionButton: HTMLButtonElement | null = null;
    let isExpanded = false;
    let selectedNodes: any[] = [];
    let selectedGroups: any[] = [];
    let previewElements: HTMLElement[] = [];
    let currentPaletteIndex = 0;

    const RECENT_COLOR_STORAGE_KEY = 'housekeeper-recent-colors';
    const PANEL_POSITION_STORAGE_KEY = 'housekeeper-panel-position';

    // A position the user has dragged the panel to. While set, it wins over the automatic
    // placement: ComfyUI moves its own right-hand controls between releases, so no amount of
    // measuring can be relied on to keep out of the way forever - being able to put the panel
    // somewhere and have it stay there is the durable answer.
    type PanelPosition = { top: number; right: number };
    let customPosition: PanelPosition | null = null;

    // Keep at least this much of the wrapper on screen, so it can never be dragged (or
    // resized) somewhere it cannot be grabbed again.
    const PANEL_MIN_VISIBLE = 48;
    // Pointer travel before a press on the handle counts as a drag rather than a click.
    const PANEL_DRAG_THRESHOLD = 4;
    const RECENT_COLOR_LIMIT = 9;
    const FALLBACK_RECENT_COLORS = ['#353535', '#3f5159', '#593930', '#335533', '#333355', '#335555', '#553355', '#665533', '#000000'];

    let recentColors = loadRecentColors();
    let recentPaletteStrip: HTMLElement | null = null;
    let customColorInput: HTMLInputElement | null = null;
    let customHexInput: HTMLInputElement | null = null;
    let customPreviewSwatch: HTMLElement | null = null;

    // Flag to suppress preview after clicking until mouse moves
    let suppressPreview = false;

    // Store original computeSize methods for size-max functionality.
    // NOTE: never written - every `.get()` falls through to node.computeSize. Left in place
    // for the wider dead-code sweep rather than widening this changeset.
    const originalComputeSizeMethods = new WeakMap();
    let layoutObserver: ResizeObserver | null = null;
    let layoutListenersAttached = false;

    // --- Canvas + geometry helpers -------------------------------------------------
    // litegraph exposes node geometry as typed arrays (pos is a Float32Array, size is a
    // Float32Array or a Proxy over one), so Array.isArray() is always false for them.
    // Read through the documented accessors instead of testing for a plain Array.

    // Height of a node's title bar in graph units. node.pos is the top-left of the node BODY;
    // the title renders above it, so the rendered box spans pos[1] - NODE_TITLE_HEIGHT to
    // pos[1] + size[1]. Read from litegraph when available so a future core change carries over.
    const NODE_TITLE_HEIGHT: number = (window as any).LiteGraph?.NODE_TITLE_HEIGHT ?? 30;

    function getActiveCanvas(): any {
        return (window as any).LGraphCanvas?.active_canvas ?? (window as any).app?.canvas;
    }

    function markCanvasDirty() {
        try {
            const canvas = getActiveCanvas();
            if (canvas?.setDirty) {
                canvas.setDirty(true, true);
            } else if ((window as any).app?.graph?.setDirtyCanvas) {
                (window as any).app.graph.setDirtyCanvas(true, true);
            } else if (canvas?.draw) {
                canvas.draw(true, true);
            }
        } catch {
            // Changes are still applied even if the redraw request fails.
        }
    }

    // node.width === node.size[0]; node.height === NODE_TITLE_HEIGHT + bodyHeight.
    // Positioning must use the rendered (title-inclusive) box; size operations write
    // node.size[1], which is body-only. Keeping these separate avoids mixing the two.
    function nodeWidth(node: any): number {
        return typeof node?.width === 'number' ? node.width : (node?.size?.[0] ?? 150);
    }

    function outerHeight(node: any): number {
        return typeof node?.height === 'number' ? node.height : (node?.size?.[1] ?? 100);
    }

    function bodyHeight(node: any): number {
        return node?.size?.[1] !== undefined ? node.size[1] : Math.max(outerHeight(node) - 30, 0);
    }

    // Measure nodes for a single flow-layout run and return a lookup over the result.
    //
    // Sizes are deliberately NOT cached on the node. They used to be stamped as
    // `node._calculatedSize` behind an `if (!node._calculatedSize)` guard and were never
    // invalidated, so the second flow layout in a session laid every node out against the
    // size it happened to have the first time - a node grown from 100 to 400 tall still
    // reserved 100, and its neighbour was drawn inside it.
    //
    // Invalidating on resize would not have been enough either: collapsing a node changes
    // what node.height reports without touching node.size and fires no resize event at all.
    // Measuring fresh per run is both simpler and correct for every case.
    //
    // Measure the LIVE node, never a `{...node}` copy: width/height are prototype getters,
    // so a spread copy loses them and would silently fall back to the 150x100 defaults.
    function measureFlowNodes(nodes: any[]) {
        const sizes = new Map<any, [number, number]>();
        nodes.forEach(node => {
            if (node) sizes.set(node, [nodeWidth(node), outerHeight(node)]);
        });
        return (node: any): [number, number] => sizes.get(node) ?? [150, 100];
    }

    const DEFAULT_TOP_OFFSET = 48;
    const PANEL_BOTTOM_MARGIN = 24;

    function getTopMenuElement(): HTMLElement | null {
        // Look for the top menu bar specifically (not bottom menu)
        const topMenu = document.querySelector<HTMLElement>('#comfyui-body-top, .comfyui-body-top');
        if (topMenu && topMenu.getBoundingClientRect().top === 0) {
            return topMenu;
        }
        
        // Fallback to any menu if no specific top menu found
        return document.querySelector<HTMLElement>('#comfy-menu, .comfyui-menu, .litegraph-menu, .comfyui-toolbar');
    }

    function computeToolbarOffset(): number {
        const topMenu = getTopMenuElement();
        if (!topMenu) {
            return DEFAULT_TOP_OFFSET;
        }
        const rect = topMenu.getBoundingClientRect();
        if (!rect || (rect.width === 0 && rect.height === 0)) {
            return DEFAULT_TOP_OFFSET;
        }
        
        // Only use the menu's bottom position if it's at the top of the page
        // This prevents using a bottom menu's position
        if (rect.top < 100) {
            return Math.max(DEFAULT_TOP_OFFSET, Math.ceil(rect.bottom + 8));
        }
        
        // If menu is not at top (e.g., at bottom), use default offset
        return DEFAULT_TOP_OFFSET;
    }

    // How far in from the right edge the panel must sit to stay clear of ComfyUI's own
    // right-hand chrome. The wrapper is z-index 1000 against the sidebar's 10, so without
    // this it wins the stacking order and covers whatever is underneath (issue #25).
    //
    // This measures the LEFTMOST EDGE of right-docked chrome rather than a sidebar width,
    // because two different things have to be cleared and only one is a panel:
    //
    //   side panel open   -> clear the whole panel      (its left edge, e.g. 1038 of 1280)
    //   side panel closed -> the top-right control cluster is still there and must stay
    //                        clickable (its left edge, e.g. 1235 of 1280)
    //
    // Measuring an edge also survives ComfyUI moving the sidebar between implementations -
    // it has been #comfyui-body-right and is currently a PrimeVue splitter panel, and the
    // splitter's right pane is `position: static`, so it cannot be found by looking for
    // overlays either.
    const RIGHT_EDGE_TOLERANCE = 24;   // a control may sit a little in from the edge
    const RIGHT_CHROME_BAND = 240;     // only chrome beside the handle matters
    // Clearance so the panel never lands flush against ComfyUI's chrome. Without it the two
    // edges coincide exactly and sub-pixel rounding is enough to make the panel win a
    // hit-test on the control immediately beside it.
    const RIGHT_CHROME_MARGIN = 8;

    function computeRightOffset(): number {
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
        if (!viewportWidth) return 0;

        let leftmost = viewportWidth;

        const consider = (element: Element) => {
            const rect = element.getBoundingClientRect();
            if (rect.width < 24 || rect.height < 24) return;
            // Must actually hug the right edge...
            if (rect.right < viewportWidth - RIGHT_EDGE_TOLERANCE) return;
            // ...not be a full-width container such as the canvas pane...
            if (rect.width > viewportWidth * 0.6) return;
            // ...and sit in the band the panel occupies.
            if (rect.top > RIGHT_CHROME_BAND || rect.bottom < 0) return;

            leftmost = Math.min(leftmost, rect.left);
        };

        // Named containers first, for frontends that still expose them.
        document
            .querySelectorAll('#comfyui-body-right, .comfyui-body-right, .p-splitterpanel')
            .forEach(consider);

        // The current frontend renders its right-hand controls as floating overlays built
        // from utility classes - no id, no stable class, not a splitter pane. What they do
        // share is structural: they sit inside a `pointer-events: none` overlay layer and
        // opt back in with `pointer-events: auto`. Keying on that survives class churn.
        //
        // Scoped to the overlay roots rather than walking the whole document, so this stays
        // cheap enough to run from a ResizeObserver.
        const overlayRoots = document.querySelectorAll<HTMLElement>('#vue-app, .comfyui-body-right, .graph-canvas-container');
        overlayRoots.forEach(root => {
            root.querySelectorAll<HTMLElement>('.pointer-events-auto, [style*="pointer-events: auto"]').forEach(element => {
                if (element.closest('.housekeeper-wrapper')) return;
                consider(element);
            });
        });

        if (leftmost >= viewportWidth) return 0;
        return Math.ceil(viewportWidth - leftmost) + RIGHT_CHROME_MARGIN;
    }

    // --- Draggable panel position ---------------------------------------------------

    function clampPanelPosition(position: PanelPosition): PanelPosition {
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
        const width = wrapper?.offsetWidth ?? PANEL_MIN_VISIBLE;
        const height = wrapper?.offsetHeight ?? PANEL_MIN_VISIBLE;

        // Allow the panel to hang off an edge, but never so far that the handle is
        // unreachable - otherwise a stored position could make it impossible to recover.
        const maxRight = Math.max(viewportWidth - PANEL_MIN_VISIBLE, 0);
        const maxTop = Math.max(viewportHeight - PANEL_MIN_VISIBLE, 0);

        return {
            right: Math.min(Math.max(position.right, -(width - PANEL_MIN_VISIBLE)), maxRight),
            top: Math.min(Math.max(position.top, 0), maxTop)
        };
    }

    function loadPanelPosition(): PanelPosition | null {
        try {
            const stored = window.localStorage?.getItem(PANEL_POSITION_STORAGE_KEY);
            if (!stored) return null;
            const parsed = JSON.parse(stored);
            if (!parsed || typeof parsed !== 'object') return null;
            const { top, right } = parsed as Record<string, unknown>;
            if (typeof top !== 'number' || typeof right !== 'number') return null;
            if (!Number.isFinite(top) || !Number.isFinite(right)) return null;
            return { top, right };
        } catch (error) {
            return null;
        }
    }

    function savePanelPosition(position: PanelPosition | null) {
        try {
            if (!position) {
                window.localStorage?.removeItem(PANEL_POSITION_STORAGE_KEY);
            } else {
                window.localStorage?.setItem(PANEL_POSITION_STORAGE_KEY, JSON.stringify(position));
            }
        } catch (error) {
            // A full or unavailable localStorage must not stop the panel working.
        }
    }

    // Inline styles beat the stylesheet's var()-driven top/right, so setting them here is
    // what makes a custom position override the automatic placement, and clearing them is
    // what hands control back to it.
    function applyPanelPosition() {
        if (!wrapper) return;

        if (customPosition) {
            const clamped = clampPanelPosition(customPosition);
            wrapper.style.top = `${clamped.top}px`;
            wrapper.style.right = `${clamped.right}px`;
            wrapper.classList.add('hk-user-positioned');
        } else {
            wrapper.style.removeProperty('top');
            wrapper.style.removeProperty('right');
            wrapper.classList.remove('hk-user-positioned');
        }

        if (resetPositionButton) {
            resetPositionButton.hidden = !customPosition;
        }
    }

    function resetPanelPosition() {
        customPosition = null;
        savePanelPosition(null);
        applyPanelPosition();
        updateLayoutMetrics();
    }

    /**
     * Lets `grip` drag the whole wrapper. Movement below PANEL_DRAG_THRESHOLD is left alone
     * so the handle keeps working as a toggle button; past it, the click that a pointerup
     * would otherwise produce is swallowed.
     */
    function makeDraggable(grip: HTMLElement) {
        let pointerId: number | null = null;
        let startX = 0;
        let startY = 0;
        let grabRight = 0;
        let grabTop = 0;
        let dragging = false;

        // Move and release are tracked on the document rather than the grip. The pointer
        // leaves a 40px-tall header almost immediately, and pointer capture cannot be set
        // until the drag threshold is crossed - which needs a move event that, bound to the
        // grip, would never arrive.
        const onMove = (event: PointerEvent) => {
            if (pointerId === null || event.pointerId !== pointerId || !wrapper) return;

            const dx = event.clientX - startX;
            const dy = event.clientY - startY;

            if (!dragging) {
                if (Math.abs(dx) < PANEL_DRAG_THRESHOLD && Math.abs(dy) < PANEL_DRAG_THRESHOLD) return;
                dragging = true;
                wrapper.classList.add('hk-dragging');
            }

            event.preventDefault();
            customPosition = clampPanelPosition({ top: grabTop + dy, right: grabRight - dx });
            applyPanelPosition();
        };

        const swallow = (event: Event) => {
            event.stopPropagation();
            event.preventDefault();
        };

        const onUp = (event: PointerEvent) => {
            if (pointerId === null || event.pointerId !== pointerId) return;
            pointerId = null;
            document.removeEventListener('pointermove', onMove, true);
            document.removeEventListener('pointerup', onUp, true);
            document.removeEventListener('pointercancel', onUp, true);

            if (!dragging) return;
            dragging = false;
            wrapper?.classList.remove('hk-dragging');
            savePanelPosition(customPosition);

            // Swallow the click this pointerup is about to generate, so finishing a drag on
            // the handle does not also toggle the panel.
            grip.addEventListener('click', swallow, { capture: true, once: true });
            // ...but do not leave the swallower armed if no click follows (drag ended off-grip).
            window.setTimeout(() => grip.removeEventListener('click', swallow, true), 0);
        };

        grip.addEventListener('pointerdown', (event: PointerEvent) => {
            if (event.button !== 0) return;
            if (!wrapper) return;

            // Never start a drag from a control sitting inside the grip - the header holds
            // the close and reset buttons. When the grip IS the button (the collapsed
            // handle), closest() returns the grip itself and the drag is allowed.
            const target = event.target as HTMLElement | null;
            const button = target?.closest('button');
            if (button && button !== grip) return;

            const rect = wrapper.getBoundingClientRect();
            const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;

            pointerId = event.pointerId;
            startX = event.clientX;
            startY = event.clientY;
            grabRight = viewportWidth - rect.right;
            grabTop = rect.top;
            dragging = false;

            document.addEventListener('pointermove', onMove, true);
            document.addEventListener('pointerup', onUp, true);
            document.addEventListener('pointercancel', onUp, true);
        });
    }

    function updateLayoutMetrics() {
        const topOffset = computeToolbarOffset();
        const rightOffset = computeRightOffset();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
        const maxHeight = Math.max(viewportHeight - topOffset - PANEL_BOTTOM_MARGIN, 280);

        document.documentElement.style.setProperty('--hk-top-offset', `${topOffset}px`);
        document.documentElement.style.setProperty('--hk-right-offset', `${rightOffset}px`);
        document.documentElement.style.setProperty('--hk-panel-max-height', `${maxHeight}px`);

        // Re-clamp a dragged position against the new viewport, so shrinking the window (or
        // switching monitors) cannot strand the panel off-screen.
        if (customPosition) {
            const clamped = clampPanelPosition(customPosition);
            if (clamped.top !== customPosition.top || clamped.right !== customPosition.right) {
                customPosition = clamped;
                savePanelPosition(customPosition);
            }
            applyPanelPosition();
        }
    }

    function ensureLayoutListeners() {
        if (!layoutListenersAttached) {
            layoutListenersAttached = true;
            window.addEventListener('resize', updateLayoutMetrics);
            window.addEventListener('orientationchange', updateLayoutMetrics);
        }

        if (typeof ResizeObserver !== 'undefined') {
            if (!layoutObserver) {
                layoutObserver = new ResizeObserver(() => updateLayoutMetrics());
            } else {
                layoutObserver.disconnect();
            }

            // Observe both the top menubar and the right sidebar. The sidebar is toggled at
            // runtime, so without observing it the panel would only avoid it on load.
            const topMenu = getTopMenuElement();
            if (topMenu) layoutObserver.observe(topMenu);

            const sidebar = document.querySelector<HTMLElement>('#comfyui-body-right, .comfyui-body-right');
            if (sidebar) layoutObserver.observe(sidebar);
        }

        updateLayoutMetrics();
    }

    interface AlignmentButtonConfig {
        type: string;
        icon: string;
        label: string;
        group: 'basic' | 'size' | 'flow';
    }

    const basicAlignments: AlignmentButtonConfig[] = [
        { type: 'left', icon: alignLeftIconUrl, label: 'Align left edges', group: 'basic' },
        { type: 'height-center', icon: heightCenterIconUrl, label: 'Center horizontally', group: 'basic' },
        { type: 'right', icon: alignRightIconUrl, label: 'Align right edges', group: 'basic' },
        { type: 'top', icon: alignTopIconUrl, label: 'Align top edges', group: 'basic' },
        { type: 'width-center', icon: widthCenterIconUrl, label: 'Center vertically', group: 'basic' },
        { type: 'bottom', icon: alignBottomIconUrl, label: 'Align bottom edges', group: 'basic' }
    ];

    const sizeAlignments: AlignmentButtonConfig[] = [
        { type: 'width-max', icon: widthMaxIconUrl, label: 'Match widest width', group: 'size' },
        { type: 'width-min', icon: widthMinIconUrl, label: 'Match narrowest width', group: 'size' },
        { type: 'height-max', icon: heightMaxIconUrl, label: 'Match tallest height', group: 'size' },
        { type: 'height-min', icon: heightMinIconUrl, label: 'Match shortest height', group: 'size' },
        { type: 'size-max', icon: sizeMaxIconUrl, label: 'Match largest size', group: 'size' },
        { type: 'size-min', icon: sizeMinIconUrl, label: 'Match smallest size', group: 'size' }
    ];

    const flowAlignments: AlignmentButtonConfig[] = [
        { type: 'horizontal-flow', icon: horizontalFlowIconUrl, label: 'Distribute horizontally', group: 'flow' },
        { type: 'vertical-flow', icon: verticalFlowIconUrl, label: 'Distribute vertically', group: 'flow' }
    ];

    const harmonyColorSets: string[][] = [
        ['#553333', '#593930', '#335533', '#333355', '#3f5159', '#335555', '#553355', '#665533', '#000000'],
        ['#ff6f61', '#ff9a76', '#ffc36a', '#ffe29a', '#ffd6d1', '#ffa69e', '#ff7b89', '#ef5d60', '#c03a53'],
        ['#003f5c', '#2f4b7c', '#376996', '#3f7cac', '#49a3c7', '#56cfe1', '#72efdd', '#80ffdb', '#c0fdfb'],
        ['#2a6041', '#3b7d4f', '#4f945c', '#66ad71', '#81c784', '#a5d6a7', '#dcedc8', '#93b48b', '#6d8b74'],
        ['#150050', '#3f0071', '#610094', '#7b2cbf', '#c77dff', '#ff61d2', '#ff97c1', '#ffcbf2', '#ffe5f1'],
        ['#f6d1c1', '#f5b5c4', '#e9a6c1', '#d4a5e3', '#b4a0e5', '#9fc9eb', '#a7d7c5', '#d5e2b8', '#f1e3a0'],
        ['#3d0c02', '#7f2b0a', '#b3541e', '#d89a54', '#f2d0a9', '#c2956b', '#8c5a45', '#5a3d2b', '#2f1b10'],
        ['#0f0f3d', '#1b1b7d', '#3a0ca3', '#7209b7', '#f72585', '#ff0677', '#ff6d00', '#ff9f1c', '#ffbf69'],
        ['#051937', '#004d7a', '#008793', '#00bf72', '#a8eb12', '#dce35b', '#ffd23f', '#ff9b71', '#ef476f'],
        ['#0d1b2a', '#1b263b', '#274060', '#335c81', '#406e8e', '#4f83a1', '#5f9bbf', '#6faad1', '#8fc0e6'],
        ['#2b193d', '#412271', '#6a4c93', '#9b5de5', '#f15bb5', '#f9a1bc', '#feeafa', '#ffd6e0', '#ffe5f1']
    ];

    const MIN_CONTRAST_RATIO = 4.5;
    const CONTRAST_STEP = 0.06;
    const DEFAULT_TEXT_COLOR = '#AAAAAA';

    function ensureStyleSheet() {
        const styleId = 'housekeeper-alignment-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `

:root {
    --hk-accent: #8BC3F3;
    --hk-panel-bg: rgba(24, 26, 32, 0.95);
    --hk-panel-border: rgba(139, 195, 243, 0.35);
    --hk-handle-bg: rgba(32, 35, 42, 0.92);
    --hk-text-strong: #E8F3FF;
    --hk-text-muted: rgba(232, 243, 255, 0.74);
    --hk-top-offset: 48px;
    --hk-right-offset: 0px;
    --hk-panel-max-height: calc(100vh - 96px);
    --hk-panel-width: clamp(270px, 18vw, min(270px, calc(100vw - 24px)));
    --hk-button-size: clamp(34px, 7vw, 40px);
    --hk-icon-size: clamp(16px, 4vw, 20px);
    --hk-button-gap: clamp(4px, 1vw, 8px);
    --hk-header-font-size: clamp(18px, 2vw, 22px);
    --hk-body-font-size: clamp(12px, 1.4vw, 14px);
    --hk-subtitle-font-size: clamp(11px, 1.3vw, 13px);
}


.housekeeper-wrapper {
    position: fixed;
    top: var(--hk-top-offset);
    right: var(--hk-right-offset, 0px);
    display: flex;
    flex-direction: row-reverse;
    align-items: flex-start;
    gap: 8px;
    padding-right: 4px;
    z-index: 1000;
    pointer-events: none;
}

.housekeeper-handle,
.housekeeper-panel {
    pointer-events: auto;
}

.housekeeper-handle {
    border: 1px solid var(--hk-panel-border);
    background: var(--hk-handle-bg);
    color: var(--hk-accent);
    border-radius: clamp(8px, 1.5vw, 12px) 0 0 clamp(8px, 1.5vw, 12px);
    padding: clamp(6px, 1.2vh, 10px) clamp(2px, 0.5vw, 4px) clamp(4px, 0.8vh, 6px) clamp(6px, 1.2vw, 9px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(6px, 1.2vh, 8px);
    cursor: pointer;
    width: clamp(32px, 4vw, 48px);
    max-width: 44px;
    min-height: clamp(100px, 18vh, 140px);
    max-height: 140px;
    transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
    font-family: Arial, sans-serif;
    font-size: clamp(10px, 1.4vw, 12px);
    letter-spacing: 0.08em;
    background-image: linear-gradient(160deg, rgba(139, 195, 243, 0.12), rgba(139, 195, 243, 0.05));
    margin-right: -4px;
}

.housekeeper-handle img {
    width: clamp(18px, 2.5vw, 24px);
    height: clamp(18px, 2.5vw, 24px);
    max-width: 24px;
    max-height: 24px;
}

.housekeeper-handle span {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    transition: transform 0.3s ease;
}

.housekeeper-wrapper.collapsed .housekeeper-handle span {
    transform: rotate(0deg);
}

.housekeeper-handle:focus-visible {
    outline: 2px solid var(--hk-accent);
    outline-offset: 2px;
}

.housekeeper-wrapper.hk-has-selection .housekeeper-handle {
    box-shadow: 0 0 14px rgba(139, 195, 243, 0.35);
}

.housekeeper-panel {
    width: var(--hk-panel-width);
    background: var(--hk-panel-bg);
    border: 1px solid var(--hk-panel-border);
    border-radius: 10px;
    padding: clamp(8px, 1vw, 10px) clamp(10px, 1.2vw, 14px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
    color: var(--hk-text-strong);
    font-family: Arial, sans-serif;
    transform: translateX(110%);
    opacity: 0;
    max-height: var(--hk-panel-max-height);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
}

.housekeeper-wrapper.expanded .housekeeper-panel {
    transform: translateX(0);
    opacity: 1;
}

.housekeeper-wrapper.collapsed .housekeeper-panel {
    pointer-events: none;
}

.housekeeper-content {
    display: flex;
    flex-direction: column;
    gap: 0;
    flex: 1;
    overflow-y: auto;
    padding: 0 0 8px 0;
}

// .housekeeper-content > * + * {
//     margin-top: clamp(6px, 1vw, 12px);
// }

.housekeeper-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    color: var(--hk-accent);
    cursor: grab;
    /* Stop the browser turning a drag into a text selection or a native scroll gesture. */
    user-select: none;
    touch-action: none;
}

.housekeeper-handle {
    touch-action: none;
}

.housekeeper-wrapper.hk-dragging,
.housekeeper-wrapper.hk-dragging .housekeeper-header {
    cursor: grabbing;
}

/* No transition while dragging, so the panel tracks the pointer instead of easing after it. */
.housekeeper-wrapper.hk-dragging .housekeeper-panel,
.housekeeper-wrapper.hk-dragging .housekeeper-handle {
    transition: none;
}

.housekeeper-reset-position {
    background: transparent;
    border: 1px solid var(--hk-accent);
    border-radius: 4px;
    color: var(--hk-accent);
    font-size: var(--hk-subtitle-font-size);
    font-family: inherit;
    cursor: pointer;
    padding: 2px 8px;
    margin-left: auto;
    white-space: nowrap;
    opacity: 0.85;
}

.housekeeper-reset-position:hover {
    opacity: 1;
}

.housekeeper-reset-position:focus-visible {
    outline: 2px solid var(--hk-accent);
    outline-offset: 2px;
}

.housekeeper-reset-position[hidden] {
    display: none;
}

.housekeeper-header-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: var(--hk-header-font-size);
    margin: 0;
}

.housekeeper-header-title img {
    width: 24px;
    height: 24px;
}

.housekeeper-close {
    background: transparent;
    border: none;
    color: var(--hk-accent);
    font-size: 24px;
    cursor: pointer;
    line-height: 1;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    transition: transform 0.2s ease;
}

.housekeeper-close img {
    width: 24px;
    height: 24px;
}

.housekeeper-close:hover {
    opacity: 0.7;
}

.housekeeper-divider {
    height: 1px;
    background: rgba(139, 195, 243, 0.25);
    width: 100%;
    margin: 12px 0 12px;
}

.housekeeper-divider.housekeeper-divider-spaced {
    margin: clamp(16px, 2vw, 24px) 0 clamp(16px, 2vw, 24px);
}

.housekeeper-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
}

.housekeeper-section-primary {
    margin-top: 0 !important;
}

.housekeeper-divider + .housekeeper-section-primary {
    margin-top: 0 !important;
}

.housekeeper-subtitle {
    font-size: var(--hk-subtitle-font-size);
    margin: 0;
    color: var(--hk-text-muted);
}

.housekeeper-palette-header,
.housekeeper-custom-inline,
.housekeeper-color-section-title {
    font-size: var(--hk-subtitle-font-size);
    color: var(--hk-text-muted);
}

.housekeeper-button-grid {
    display: flex;
    flex-wrap: wrap;
    // gap: var(--hk-button-gap);
    // padding: clamp(4px, 0.8vw, 6px);
    border-radius: 8px;
    border: 1px solid rgba(139, 195, 243, 0.35);
    background: rgba(22, 24, 29, 0.6);
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    --hk-button-unit: calc(100% / 6);
}

.hk-button {
    background: transparent;
    border: none;
    border-radius: 10px;
    flex: 0 0 var(--hk-button-unit);
    aspect-ratio: 1 / 1;
    max-width: var(--hk-button-unit);
    padding: clamp(2px, 0.6vw, 4px);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
    cursor: pointer;
}

.hk-button img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.hk-button:hover:not(:disabled),
.hk-button:focus-visible {
    transform: translateY(-1px);
    background: rgba(139, 195, 243, 0.18);
    outline: none;
}

.hk-button:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
}

.housekeeper-info {
    background: rgba(34, 37, 45, 0.9);
    border-radius: 12px;
    padding: 12px 16px;
    font-size: var(--hk-body-font-size);
    color: var(--hk-text-muted);
    text-align: left;
    line-height: 1.4;
}

.housekeeper-info small {
    display: block;
    margin-top: 6px;
    font-size: 12px;
    opacity: 0.7;
}

.housekeeper-wrapper.expanded .housekeeper-handle {
    display: none;
}

.housekeeper-wrapper.collapsed .housekeeper-handle {
    opacity: 0.85;
}

.housekeeper-color-strip,
.housekeeper-color-footer,
.housekeeper-color-recent {
    display: flex;
    flex-wrap: nowrap;
    gap: 4px;
    width: 100%;
    justify-content: flex-start;
}

.housekeeper-color-recent {
    justify-content: center;
}

.housekeeper-custom-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    color: var(--hk-text-muted);
}

.hk-custom-toggle {
    border: 1px solid rgba(139, 195, 243, 0.35);
    background: rgba(139, 195, 243, 0.12);
    color: var(--hk-accent);
    border-radius: 8px;
    padding: 4px 12px;
    cursor: pointer;
    font-size: 13px;
    transition: background 0.2s ease, transform 0.2s ease;
}

.hk-custom-toggle:hover {
    background: rgba(139, 195, 243, 0.22);
    transform: translateY(-1px);
}

.hk-custom-toggle:focus-visible {
    outline: 2px solid var(--hk-accent);
    outline-offset: 2px;
}

.housekeeper-custom-inline {
    display: flex;
    align-items: center;
    gap: clamp(4px, 0.8vw, 6px);
    margin-top: clamp(8px, 1.5vh, 12px);
}

.housekeeper-custom-inline span {
    color: var(--hk-text-muted);
    font-size: var(--hk-body-font-size);
    white-space: nowrap;
}

.hk-custom-inline-picker {
    width: 24px;
    height: 24px;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: 4px;
    overflow: hidden;
}

.hk-custom-inline-picker::-webkit-color-swatch-wrapper {
    padding: 0;
}

.hk-custom-inline-picker::-webkit-color-swatch {
    border: none;
    border-radius: 4px;
}

.hk-custom-inline-picker::-moz-color-swatch {
    border: none;
    border-radius: 4px;
}

.hk-custom-hex-inline {
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(139, 195, 243, 0.35);
    padding: 4px 6px;
    color: var(--hk-text-strong);
    font-family: Arial, sans-serif;
    letter-spacing: 0.04em;
    width: clamp(60px, 12vw, 80px);
    flex: 1;
    min-width: 60px;
}

.hk-custom-hex-inline::placeholder {
    color: rgba(232, 243, 255, 0.45);
}

.hk-custom-preview-inline {
    width: 42px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid rgba(139, 195, 243, 0.35);
}

.hk-custom-apply-inline {
    border: 1px solid rgba(139, 195, 243, 0.35);
    background: rgba(139, 195, 243, 0.12);
    color: var(--hk-accent);
    border-radius: 6px;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    line-height: 1;
    transition: background 0.2s ease, transform 0.2s ease;
}

.hk-custom-apply-inline:hover {
    background: rgba(139, 195, 243, 0.25);
    transform: translateY(-1px);
}

.hk-custom-apply-inline:focus-visible {
    outline: 2px solid var(--hk-accent);
    outline-offset: 2px;
}

.housekeeper-palette-header {
    display: flex;
    align-items: center;
    justify-content: left;
    gap: 6px;
    width: 100%;
    margin: 4px 0;
    color: var(--hk-text-muted);
}

.housekeeper-palette-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: 100%;
}

.housekeeper-color-strip {
    flex: 1;
    flex-wrap: nowrap;
    justify-content: center;
    min-width: 0;
}

.housekeeper-color-footer {
    flex-wrap: wrap;
    justify-content: flex-start;
}

.housekeeper-color-carousel {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
}

.hk-palette-arrow {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    border-radius: 6px;
    border: 1px solid rgba(139, 195, 243, 0.35);
    background: rgba(139, 195, 243, 0.12);
    color: var(--hk-accent);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;
    font-size: 11px;
    padding: 0;
}

.hk-palette-arrow:hover {
    background: rgba(139, 195, 243, 0.25);
    transform: translateY(-1px);
}

.hk-palette-arrow:focus-visible {
    outline: 2px solid var(--hk-accent);
    outline-offset: 2px;
}

.hk-color-chip {
    flex: 0 0 16px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: none;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    background: transparent;
}

.hk-color-chip:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
}

.hk-color-chip:focus-visible {
    outline: 2px solid var(--hk-accent);
    outline-offset: 2px;
}

.housekeeper-color-custom-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: var(--hk-body-font-size);
    color: var(--hk-text-muted);
    margin-top: 14px;
}

.hk-toggle-placeholder {
    width: 38px;
    height: 20px;
    border-radius: 12px;
    border: 1px solid rgba(139, 195, 243, 0.35);
    background: rgba(139, 195, 243, 0.08);
    position: relative;
}

.hk-toggle-placeholder::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: rgba(139, 195, 243, 0.85);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.housekeeper-color-picker-placeholder {
    margin-top: 16px;
    border: 1px solid rgba(139, 195, 243, 0.25);
    border-radius: 14px;
    background: linear-gradient(135deg, #ffffff 0%, #ff0000 50%, #000000 100%);
    height: clamp(160px, 32vh, 220px);
    position: relative;
    overflow: hidden;
}

.housekeeper-color-picker-toolbar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 54px;
    background: rgba(16, 17, 21, 0.92);
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 16px;
    color: var(--hk-text-muted);
    font-size: var(--hk-body-font-size);
}

.housekeeper-color-picker-toolbar .hk-swatch {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.65);
}

.housekeeper-color-picker-toolbar .hk-slider-placeholder {
    flex: 1;
    height: 12px;
    border-radius: 8px;
    background: linear-gradient(90deg, red, yellow, lime, cyan, blue, magenta, red);
    box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.35);
}

.hk-rgb-placeholder {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: var(--hk-subtitle-font-size);
}

.hk-rgb-placeholder .hk-rgb-pill {
    width: 36px;
    height: 22px;
    border-radius: 6px;
    border: 1px solid rgba(139, 195, 243, 0.35);
    background: rgba(139, 195, 243, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--hk-text-muted);
    font-family: Arial, sans-serif;
    letter-spacing: 0.04em;
}
`;
        document.head.appendChild(style);
    }

    ensureStyleSheet();
    ensureLayoutListeners();
    updateLayoutMetrics();

    function createSection() {
        const section = document.createElement('section');
        section.className = 'housekeeper-section';
        return section;
    }

    function createSubtitle(text: string) {
        const subtitle = document.createElement('p');
        subtitle.className = 'housekeeper-subtitle';
        subtitle.textContent = text;
        return subtitle;
    }

    function createButtonGrid(buttons: AlignmentButtonConfig[], group: AlignmentButtonConfig['group']) {
        const grid = document.createElement('div');
        grid.className = `housekeeper-button-grid housekeeper-button-grid-${group}`;
        buttons.forEach(button => {
            grid.appendChild(createAlignmentButton(button));
        });
        return grid;
    }

    function createAlignmentButton(alignment: AlignmentButtonConfig) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'hk-button';
        button.dataset.alignmentType = alignment.type;
        button.title = alignment.label;
        button.setAttribute('aria-label', alignment.label);

        const icon = document.createElement('img');
        icon.src = alignment.icon;
        icon.alt = '';
        icon.draggable = false;
        button.appendChild(icon);

        button.addEventListener('mouseenter', () => showPreview(alignment.type));
        button.addEventListener('mouseleave', () => hidePreview());
        button.addEventListener('focus', () => showPreview(alignment.type));
        button.addEventListener('blur', () => hidePreview());
        button.addEventListener('click', () => alignNodes(alignment.type));

        return button;
    }

    function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
        const normalized = hex.replace('#', '');
        if (normalized.length === 3) {
            const r = parseInt(normalized[0] + normalized[0], 16);
            const g = parseInt(normalized[1] + normalized[1], 16);
            const b = parseInt(normalized[2] + normalized[2], 16);
            return { r, g, b };
        }
        if (normalized.length === 6) {
            return {
                r: parseInt(normalized.slice(0, 2), 16),
                g: parseInt(normalized.slice(2, 4), 16),
                b: parseInt(normalized.slice(4, 6), 16)
            };
        }
        return null;
    }

    function rgbToHex(r: number, g: number, b: number) {
        const toHex = (value: number) => {
            const clamped = Math.max(0, Math.min(255, Math.round(value)));
            return clamped.toString(16).padStart(2, '0');
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
        const rgb = hexToRgb(hex);
        if (!rgb) return null;

        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;
        let h = 0;
        if (delta !== 0) {
            if (max === r) {
                h = ((g - b) / delta) % 6;
            } else if (max === g) {
                h = (b - r) / delta + 2;
            } else {
                h = (r - g) / delta + 4;
            }
        }
        h = Math.round(h * 60);
        if (h < 0) h += 360;

        const l = (max + min) / 2;
        const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

        return { h, s, l };
    }

    function hslToHex(h: number, s: number, l: number) {
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = l - c / 2;

        let r = 0;
        let g = 0;
        let b = 0;

        if (0 <= h && h < 60) {
            r = c;
            g = x;
            b = 0;
        } else if (60 <= h && h < 120) {
            r = x;
            g = c;
            b = 0;
        } else if (120 <= h && h < 180) {
            r = 0;
            g = c;
            b = x;
        } else if (180 <= h && h < 240) {
            r = 0;
            g = x;
            b = c;
        } else if (240 <= h && h < 300) {
            r = x;
            g = 0;
            b = c;
        } else {
            r = c;
            g = 0;
            b = x;
        }

        return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
    }

    function adjustLightness(hex: string, delta: number) {
        const hsl = hexToHsl(hex);
        if (!hsl) return hex;
        const newLightness = Math.max(0, Math.min(1, hsl.l + delta));
        return hslToHex(hsl.h, hsl.s, newLightness);
    }

    function luminanceFromHex(hex: string): number {
        const rgb = hexToRgb(hex);
        if (!rgb) return 0;
        return getRelativeLuminance(rgb);
    }

    function getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
        const channel = (value: number) => {
            const v = value / 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
    }

    function getContrastRatio(l1: number, l2: number) {
        const brightest = Math.max(l1, l2);
        const darkest = Math.min(l1, l2);
        return (brightest + 0.05) / (darkest + 0.05);
    }

    function normalizeHex(input: string | null | undefined): string | null {
        if (typeof input !== 'string') return null;
        let value = input.trim();
        if (!value) return null;
        if (!value.startsWith('#')) value = `#${value}`;
        if (/^#([0-9a-fA-F]{3})$/.test(value)) {
            value = `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
        }
        if (/^#([0-9a-fA-F]{6})$/.test(value)) {
            return value.toLowerCase();
        }
        return null;
    }

    function getDefaultRecentColors(): string[] {
        const colors: string[] = [];
        const canvasColors = (window as any).LGraphCanvas?.node_colors;
        if (canvasColors) {
            for (const key of Object.keys(canvasColors)) {
                const option = canvasColors[key];
                const source = option?.bgcolor || option?.color || option?.groupcolor;
                const normalized = normalizeHex(source);
                if (normalized && !colors.includes(normalized)) {
                    colors.push(normalized);
                }
                if (colors.length >= RECENT_COLOR_LIMIT) break;
            }
        }
        if (!colors.length) {
            FALLBACK_RECENT_COLORS.forEach(color => {
                const normalized = normalizeHex(color);
                if (normalized && !colors.includes(normalized) && colors.length < RECENT_COLOR_LIMIT) {
                    colors.push(normalized);
                }
            });
        }
        return colors.slice(0, RECENT_COLOR_LIMIT);
    }

    function loadRecentColors(): string[] {
        try {
            const stored = window.localStorage?.getItem(RECENT_COLOR_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    const normalized = parsed
                        .map(item => normalizeHex(item))
                        .filter((item): item is string => !!item);
                    if (normalized.length) {
                        return normalized.slice(0, RECENT_COLOR_LIMIT);
                    }
                }
            }
        } catch (error) {
        }
        return getDefaultRecentColors();
    }

    function saveRecentColors(colors: string[]) {
        try {
            window.localStorage?.setItem(RECENT_COLOR_STORAGE_KEY, JSON.stringify(colors));
        } catch (error) {
        }
    }

    function renderRecentPalette() {
        if (!recentPaletteStrip) return;
        recentPaletteStrip.replaceChildren();
        recentColors.forEach(color => {
            const chip = createColorChip(color);
            recentPaletteStrip.appendChild(chip);
        });
    }

    function updateCustomPreview(hex: string) {
        const normalized = normalizeHex(hex);
        if (!normalized || !customPreviewSwatch) return;
        const option = buildColorOption(normalized);
        customPreviewSwatch.style.background = `linear-gradient(90deg, ${option.color} 0%, ${option.color} 20%, ${option.bgcolor} 20%, ${option.bgcolor} 60%, ${option.groupcolor} 60%, ${option.groupcolor} 100%)`;
    }

    function updateCustomInputs(hex: string) {
        const normalized = normalizeHex(hex);
        if (!normalized) return;
        if (customColorInput) customColorInput.value = normalized;
        if (customHexInput) customHexInput.value = normalized.toUpperCase();
        updateCustomPreview(normalized);
    }

    function recordRecentColor(hex: string) {
        const normalized = normalizeHex(hex);
        if (!normalized) return;
        recentColors = [normalized, ...recentColors.filter(color => color !== normalized)];
        if (recentColors.length > RECENT_COLOR_LIMIT) {
            recentColors.length = RECENT_COLOR_LIMIT;
        }
        saveRecentColors(recentColors);
        renderRecentPalette();
        updateCustomInputs(normalized);
    }

    function commitCustomColor(hex: string) {
        const normalized = normalizeHex(hex);
        if (!normalized) return;
        applyColorToSelection(normalized);
        restorePreviewColors();
    }


    function ensureContrastWithDefaultText(hex: string) {
        const baseLum = luminanceFromHex(hex);
        const textLum = luminanceFromHex(DEFAULT_TEXT_COLOR);
        let ratio = getContrastRatio(baseLum, textLum);
        if (ratio >= MIN_CONTRAST_RATIO) return hex;

        const hsl = hexToHsl(hex);
        if (!hsl) return hex;

        const direction = baseLum > textLum ? -1 : 1;
        let low = hsl.l;
        let high = direction > 0 ? 0.98 : 0.02;
        let bestHex = hex;
        let bestRatio = ratio;

        for (let i = 0; i < 12; i++) {
            const mid = low + (high - low) * 0.5;
            const candidate = hslToHex(hsl.h, hsl.s, Math.max(0.02, Math.min(0.98, mid)));
            const candidateLum = luminanceFromHex(candidate);
            const candidateRatio = getContrastRatio(candidateLum, textLum);

            if (candidateRatio >= MIN_CONTRAST_RATIO) {
                bestHex = candidate;
                bestRatio = candidateRatio;
                if (direction > 0) {
                    low = mid;
                } else {
                    high = mid;
                }
            } else {
                if (direction > 0) {
                    high = mid;
                } else {
                    low = mid;
                }
            }
        }

        return bestRatio >= MIN_CONTRAST_RATIO ? bestHex : hex;
    }

    function computeAccessibleTextPalette(baseHex: string) {
        const baseHsl = hexToHsl(baseHex);
        if (!baseHsl) return null;
        const baseLum = luminanceFromHex(baseHex);
        const direction = baseLum >= 0.5 ? -1 : 1;

        let candidateHex = baseHex;
        let candidateLum = baseLum;
        let offset = 0.5;

        for (let i = 0; i < 12; i++) {
            const newLightness = Math.max(0.02, Math.min(0.98, baseHsl.l + direction * offset));
            candidateHex = hslToHex(baseHsl.h, baseHsl.s, newLightness);
            candidateLum = luminanceFromHex(candidateHex);
            if (getContrastRatio(baseLum, candidateLum) >= MIN_CONTRAST_RATIO) {
                break;
            }
            offset += CONTRAST_STEP;
        }

        const textColor = candidateHex;
        const titleColor = adjustLightness(textColor, direction * -0.08);
        const selectedColor = adjustLightness(textColor, direction * 0.12);

        return {
            textColor,
            titleColor,
            selectedColor
        };
    }

    function ensureSeparation(base: string, candidate: string, step: number, maxIterations = 6) {
        let result = candidate;
        let attempts = 0;
        while (Math.abs(luminanceFromHex(base) - luminanceFromHex(result)) < 0.08 && attempts < maxIterations) {
            const adjusted = adjustLightness(result, step);
            if (adjusted === result) break;
            result = adjusted;
            attempts += 1;
        }
        return result;
    }

    function buildColorOption(hex: string) {
        const sanitized = hex.startsWith('#') ? hex : `#${hex}`;
        const base = sanitized;

        let bgcolor = ensureContrastWithDefaultText(base);
        
        // For dark/medium-dark backgrounds, lighten the title bar instead of darkening
        const bgHsl = hexToHsl(bgcolor);
        let color;
        if (bgHsl && bgHsl.l < 0.40) {
            // Dark background: lighten the title bar to keep it visible
            color = adjustLightness(bgcolor, 0.12);
        } else {
            // Normal/light background: darken the title bar as usual
            color = adjustLightness(bgcolor, -0.16);
        }
        
        let groupcolor = adjustLightness(bgcolor, 0.12);

        color = ensureSeparation(bgcolor, color, bgHsl && bgHsl.l < 0.40 ? 0.08 : -0.08);
        groupcolor = ensureSeparation(bgcolor, groupcolor, 0.08);

        return {
            color,
            bgcolor,
            groupcolor
        };
    }

    function applyColorToSelection(hex: string) {
        const targets = [...selectedNodes, ...selectedGroups];
        if (!targets.length) {
            showMessage('Select nodes or groups to apply color', 'warning');
            return;
        }

        const colorOption = buildColorOption(hex);

        // graph.beforeChange()/afterChange() only forward to canvas.onBeforeChange, which the
        // ComfyUI frontend never assigns - they record nothing. The canvas emit* pair is what
        // dispatches the event ChangeTracker listens for. try/finally so a throw mid-apply
        // cannot leave the transaction open.
        const undoCanvas = getActiveCanvas();
        undoCanvas?.emitBeforeChange?.();

        try {
            targets.forEach((item: any) => {
                applyColorToTarget(item, colorOption);
            });
        } finally {
            undoCanvas?.emitAfterChange?.();
        }

        recordRecentColor(colorOption.bgcolor);
        markCanvasDirty();
    }

    function applyColorToTarget(target: any, option: { color: string; bgcolor: string; groupcolor: string }) {
        if (typeof target.setColorOption === 'function') {
            target.setColorOption(option);
        } else {
            target.color = option.color;
            target.bgcolor = option.bgcolor;
            target.groupcolor = option.groupcolor;
        }
    }

    function captureCurrentColors(option: { color: string; bgcolor: string; groupcolor: string }) {
        if (previewState.active && previewState.colorOption?.bgcolor === option.bgcolor) {
            return;
        }

        previewState.active = true;
        previewState.colorOption = option;
        previewState.nodes.clear();
        previewState.groups.clear();

        selectedNodes.forEach(node => {
            previewState.nodes.set(node, {
                color: node.color,
                bgcolor: node.bgcolor,
                groupcolor: node.groupcolor
            });
        });

        selectedGroups.forEach(group => {
            previewState.groups.set(group, {
                color: group.color
            });
        });
    }

    function applyPreviewColor(option: { color: string; bgcolor: string; groupcolor: string }) {
        selectedNodes.forEach(node => applyColorToTarget(node, option));
        selectedGroups.forEach(group => applyColorToTarget(group, option));

        const canvas = (window as any).LGraphCanvas?.active_canvas ?? (window as any).app?.canvas;
        canvas?.setDirty?.(true, true);
    }

    function restorePreviewColors() {
        if (!previewState.active) return;

        let restoreBaseHex: string | undefined;
        for (const stored of previewState.nodes.values()) {
            if (stored.bgcolor) {
                restoreBaseHex = stored.bgcolor;
                break;
            }
        }
        if (!restoreBaseHex) {
            for (const stored of previewState.groups.values()) {
                if (stored.color) {
                    restoreBaseHex = stored.color;
                    break;
                }
            }
        }

        previewState.nodes.forEach((stored, node) => {
            if (!node) return;
            if (typeof node.setColorOption === 'function') {
                // If all colors were undefined (default node), pass null to remove color
                if (stored.color === undefined && stored.bgcolor === undefined && stored.groupcolor === undefined) {
                    node.setColorOption(null);
                } else {
                    node.setColorOption({
                        color: stored.color,
                        bgcolor: stored.bgcolor,
                        groupcolor: stored.groupcolor
                    });
                }
            } else {
                // Delete properties if they were originally undefined to restore default appearance
                if (stored.color === undefined) {
                    delete node.color;
                } else {
                    node.color = stored.color;
                }
                if (stored.bgcolor === undefined) {
                    delete node.bgcolor;
                } else {
                    node.bgcolor = stored.bgcolor;
                }
                if (stored.groupcolor === undefined) {
                    delete node.groupcolor;
                } else {
                    node.groupcolor = stored.groupcolor;
                }
            }
        });

        previewState.groups.forEach((stored, group) => {
            if (!group) return;
            if (typeof group.setColorOption === 'function') {
                // If color was undefined (default group), pass null to remove color
                if (stored.color === undefined) {
                    group.setColorOption(null);
                } else {
                    group.setColorOption({
                        color: stored.color,
                        bgcolor: stored.color,
                        groupcolor: stored.color
                    });
                }
            } else {
                // Delete property if it was originally undefined to restore default appearance
                if (stored.color === undefined) {
                    delete group.color;
                } else {
                    group.color = stored.color;
                }
            }
        });

        previewState.active = false;
        previewState.colorOption = null;

        const canvas = (window as any).LGraphCanvas?.active_canvas ?? (window as any).app?.canvas;
        canvas?.setDirty?.(true, true);
    }

    function attachColorChipHandlers(chip: HTMLButtonElement, hex: string) {
        const activate = (event?: Event) => {
            event?.preventDefault();
            // Roll the hover preview back BEFORE applying. The preview writes colours straight
            // onto live nodes, so applying on top of it would make the undo snapshot baseline
            // the preview colour and Ctrl+Z would restore that instead of the user's original.
            // restorePreviewColors() also clears previewState.active, which preserves the
            // original guard here: the re-render triggered by applying fires mouseleave on the
            // re-ordered chips, and that must not revert what we just applied.
            restorePreviewColors();
            previewState.nodes.clear();
            previewState.groups.clear();
            // Suppress preview until mouse moves to prevent auto-preview on re-ordered chips
            suppressPreview = true;
            applyColorToSelection(hex);
        };
        chip.addEventListener('click', activate);
        chip.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                activate();
            }
        });
        chip.addEventListener('mouseenter', () => {
            // Don't show preview if we just clicked and chips re-ordered
            if (suppressPreview) return;
            const option = buildColorOption(hex);
            captureCurrentColors(option);
            applyPreviewColor(option);
        });
        chip.addEventListener('focus', () => {
            const option = buildColorOption(hex);
            captureCurrentColors(option);
            applyPreviewColor(option);
        });
        chip.addEventListener('mouseleave', () => restorePreviewColors());
        chip.addEventListener('blur', () => restorePreviewColors());
    }

    function createColorChip(hex: string, interactive = true) {
        const optionPreview = buildColorOption(hex);
        const labelHex = optionPreview.bgcolor.toUpperCase();
        const element = document.createElement(interactive ? 'button' : 'div') as HTMLButtonElement | HTMLDivElement;
        if (interactive) {
            (element as HTMLButtonElement).type = 'button';
            element.setAttribute('aria-label', `Apply color ${labelHex}`);
            element.title = `Apply color ${labelHex}`;
        }
        element.className = 'hk-color-chip';
        element.style.background = optionPreview.bgcolor;
        element.style.borderColor = optionPreview.color;
        element.dataset.colorHex = optionPreview.bgcolor;
        if (interactive) {
            attachColorChipHandlers(element as HTMLButtonElement, hex);
        }
        return element;
    }

    function renderHarmonyPalette(target: HTMLElement, paletteIndex: number) {
        if (!harmonyColorSets.length) return;
        const total = harmonyColorSets.length;
        const normalizedIndex = ((paletteIndex % total) + total) % total;
        currentPaletteIndex = normalizedIndex;

        const colors = harmonyColorSets[normalizedIndex];
        target.replaceChildren();
        colors.forEach(color => {
            const chip = createColorChip(color);
            target.appendChild(chip);
        });

        target.setAttribute('aria-label', `Color harmony palette ${normalizedIndex + 1} of ${total}`);
    }

    function showPanel() {
        if (!wrapper) return;
        updateLayoutMetrics();
        isExpanded = true;
        wrapper.classList.remove('collapsed');
        wrapper.classList.add('expanded');
        setTimeout(() => {
            panel?.focus();
        }, 0);
    }

    function hidePanel() {
        if (!wrapper) return;
        isExpanded = false;
        wrapper.classList.remove('expanded');
        wrapper.classList.add('collapsed');
        toggleHandle?.focus();
    }

    function togglePanel(force?: boolean) {
        const shouldExpand = typeof force === 'boolean' ? force : !isExpanded;
        if (shouldExpand) {
            showPanel();
        } else {
            hidePanel();
        }
    }

    function createPanel() {
        if (panel) return;

        wrapper = document.createElement('div');
        wrapper.className = 'housekeeper-wrapper collapsed';

        toggleHandle = document.createElement('button');
        toggleHandle.type = 'button';
        toggleHandle.className = 'housekeeper-handle';
        toggleHandle.title = 'Toggle Housekeeper panel (Ctrl+Shift+H)';

        const handleIcon = document.createElement('img');
        handleIcon.src = homeIconUrl;
        handleIcon.alt = '';
        handleIcon.draggable = false;
        toggleHandle.appendChild(handleIcon);

        const handleText = document.createElement('span');
        handleText.textContent = 'Housekeeper';
        toggleHandle.appendChild(handleText);

        toggleHandle.addEventListener('click', () => togglePanel());

        panel = document.createElement('div');
        panel.className = 'housekeeper-panel';
        panel.setAttribute('role', 'region');
        panel.setAttribute('aria-label', 'Housekeeper alignment tools');
        panel.tabIndex = -1;

        // Clear suppressPreview flag when mouse moves, allowing preview to work again
        panel.addEventListener('mousemove', () => {
            if (suppressPreview) {
                suppressPreview = false;
            }
        });

        const content = document.createElement('div');
        content.className = 'housekeeper-content';

        const header = document.createElement('div');
        header.className = 'housekeeper-header';

        const headerTitle = document.createElement('div');
        headerTitle.className = 'housekeeper-header-title';

        const headerIcon = document.createElement('img');
        headerIcon.src = homeIconUrl;
        headerIcon.alt = '';
        headerIcon.draggable = false;
        headerTitle.appendChild(headerIcon);

        const headerText = document.createElement('span');
        headerText.textContent = 'Housekeeper';
        headerTitle.appendChild(headerText);

        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'housekeeper-close';
        closeButton.setAttribute('aria-label', 'Hide Housekeeper panel');
        const closeIcon = document.createElement('img');
        closeIcon.src = collapseIconUrl;
        closeIcon.alt = '';
        closeIcon.draggable = false;
        closeButton.appendChild(closeIcon);
        closeButton.addEventListener('click', () => togglePanel(false));

        // Only shown once the panel has actually been dragged, so it stays out of the way
        // for anyone happy with the default placement.
        resetPositionButton = document.createElement('button');
        resetPositionButton.type = 'button';
        resetPositionButton.className = 'housekeeper-reset-position';
        resetPositionButton.textContent = 'Reset position';
        resetPositionButton.title = 'Return the panel to its default position';
        resetPositionButton.setAttribute('aria-label', 'Reset Housekeeper panel position');
        resetPositionButton.hidden = true;
        resetPositionButton.addEventListener('click', () => resetPanelPosition());

        header.appendChild(headerTitle);
        header.appendChild(resetPositionButton);
        header.appendChild(closeButton);

        // The header doubles as a drag grip while the panel is open; the handle is the grip
        // when it is collapsed. Both move the same wrapper.
        makeDraggable(header);

        const divider = document.createElement('div');
        divider.className = 'housekeeper-divider';

        const alignmentSection = createSection();
        alignmentSection.classList.add('housekeeper-section-primary');
        alignmentSection.appendChild(createSubtitle('Basic Alignment'));
        alignmentSection.appendChild(createButtonGrid(basicAlignments, 'basic'));
        alignmentSection.appendChild(createSubtitle('Size Adjustment'));
        alignmentSection.appendChild(createButtonGrid(sizeAlignments, 'size'));
        alignmentSection.appendChild(createSubtitle('Flow Alignment'));
        alignmentSection.appendChild(createButtonGrid(flowAlignments, 'flow'));

        const buildPalette = (colors: string[], className: string, interactive = true) => {
            const palette = document.createElement('div');
            palette.className = className;
            palette.setAttribute('role', 'group');
            colors.forEach(color => {
                const chip = createColorChip(color, interactive);
                palette.appendChild(chip);
            });
            return palette;
        };

        const colorSection = createSection();
        const paletteHeader = document.createElement('div');
        paletteHeader.className = 'housekeeper-palette-header';
        paletteHeader.classList.add('housekeeper-color-section-title');
        const paletteTitle = document.createElement('span');
        paletteTitle.textContent = 'Preset palettes';
        paletteHeader.appendChild(paletteTitle);
        colorSection.appendChild(paletteHeader);

        const paletteRowWrapper = document.createElement('div');
        paletteRowWrapper.className = 'housekeeper-palette-row';

        const prevPaletteButton = document.createElement('button');
        prevPaletteButton.type = 'button';
        prevPaletteButton.className = 'hk-palette-arrow hk-palette-arrow-prev';
        prevPaletteButton.innerHTML = '&#9664;';
        paletteRowWrapper.appendChild(prevPaletteButton);

        const paletteStrip = document.createElement('div');
        paletteStrip.className = 'housekeeper-color-strip';
        paletteStrip.setAttribute('role', 'group');
        paletteRowWrapper.appendChild(paletteStrip);

        const nextPaletteButton = document.createElement('button');
        nextPaletteButton.type = 'button';
        nextPaletteButton.className = 'hk-palette-arrow hk-palette-arrow-next';
        nextPaletteButton.innerHTML = '&#9654;';
        paletteRowWrapper.appendChild(nextPaletteButton);

        colorSection.appendChild(paletteRowWrapper);

        const updatePaletteArrowLabels = () => {
            const total = harmonyColorSets.length;
            const prevIndex = (currentPaletteIndex - 1 + total) % total;
            const nextIndex = (currentPaletteIndex + 1) % total;
            prevPaletteButton.setAttribute('aria-label', `Show color set ${prevIndex + 1} of ${total}`);
            nextPaletteButton.setAttribute('aria-label', `Show color set ${nextIndex + 1} of ${total}`);
        };

        const cyclePalette = (delta: number) => {
            const total = harmonyColorSets.length;
            if (!total) return;
            currentPaletteIndex = (currentPaletteIndex + delta + total) % total;
            renderHarmonyPalette(paletteStrip, currentPaletteIndex);
            updatePaletteArrowLabels();
        };

        prevPaletteButton.addEventListener('click', () => cyclePalette(-1));
        nextPaletteButton.addEventListener('click', () => cyclePalette(1));

        renderHarmonyPalette(paletteStrip, currentPaletteIndex);
        updatePaletteArrowLabels();

        const customRow = document.createElement('div');
        customRow.className = 'housekeeper-custom-inline';

        const customLabel = document.createElement('span');
        customLabel.textContent = 'Custom';
        customRow.appendChild(customLabel);

        customColorInput = document.createElement('input');
        customColorInput.type = 'color';
        customColorInput.className = 'hk-custom-inline-picker';
        customRow.appendChild(customColorInput);

        customHexInput = document.createElement('input');
        customHexInput.type = 'text';
        customHexInput.placeholder = '#RRGGBB';
        customHexInput.maxLength = 7;
        customHexInput.className = 'hk-custom-hex-inline';
        customRow.appendChild(customHexInput);

        const customApplyButton = document.createElement('button');
        customApplyButton.type = 'button';
        customApplyButton.className = 'hk-custom-apply-inline';
        customApplyButton.textContent = '✓';
        customApplyButton.setAttribute('aria-label', 'Apply custom color');
        customApplyButton.title = 'Apply custom color';
        customRow.appendChild(customApplyButton);

        colorSection.appendChild(customRow);

        const recentTitle = createSubtitle('Recent colors');
        recentTitle.classList.add('housekeeper-color-section-title');
        colorSection.appendChild(recentTitle);
        recentPaletteStrip = document.createElement('div');
        recentPaletteStrip.className = 'housekeeper-color-recent';
        renderRecentPalette();
        colorSection.appendChild(recentPaletteStrip);

        const initialCustomColor = recentColors[0] || FALLBACK_RECENT_COLORS[0];
        updateCustomInputs(initialCustomColor);

        const handleCustomPreview = (value: string, source: 'color' | 'text') => {
            const normalized = normalizeHex(value);
            if (!normalized) return;
            if (source === 'color' && customHexInput) customHexInput.value = normalized.toUpperCase();
            if (source === 'text' && customColorInput) customColorInput.value = normalized;
            updateCustomPreview(normalized);
            if (!selectedNodes.length && !selectedGroups.length) return;
            const option = buildColorOption(normalized);
            captureCurrentColors(option);
            applyPreviewColor(option);
        };

        customColorInput?.addEventListener('input', () => handleCustomPreview(customColorInput!.value, 'color'));
        customColorInput?.addEventListener('change', () => commitCustomColor(customColorInput!.value));
        customColorInput?.addEventListener('click', () => captureCurrentColors(buildColorOption(customColorInput!.value)));
        customColorInput?.addEventListener('blur', () => restorePreviewColors());

        customHexInput?.addEventListener('input', () => handleCustomPreview(customHexInput!.value, 'text'));
        customHexInput?.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                commitCustomColor(customHexInput!.value);
            }
        });
        customHexInput?.addEventListener('blur', () => restorePreviewColors());

        const applyColor = () => commitCustomColor(customHexInput?.value || customColorInput?.value || initialCustomColor);
        customApplyButton.addEventListener('click', () => applyColor());

        customRow.addEventListener('keydown', (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'enter') {
                event.preventDefault();
                applyColor();
            }
        });
        customRow.addEventListener('dblclick', () => applyColor());
        content.appendChild(header);
        content.appendChild(divider);
        content.appendChild(alignmentSection);
        const colorDivider = document.createElement('div');
        colorDivider.className = 'housekeeper-divider';
        colorDivider.style.marginTop = '10px';
        content.appendChild(colorDivider);
        content.appendChild(colorSection);

        panel.appendChild(content);

        wrapper.appendChild(toggleHandle);
        wrapper.appendChild(panel);
        document.body.appendChild(wrapper);

        makeDraggable(toggleHandle);

        // Restore a previously dragged position. Applied after the wrapper is in the document
        // so clamping can measure it, and re-clamped against the current viewport in case the
        // window is smaller than it was when the position was stored.
        customPosition = loadPanelPosition();
        applyPanelPosition();

        ensureLayoutListeners();
        updateLayoutMetrics();
    }

    // Preview functionality
    function showPreview(alignmentType: string) {
        // Allow size-min with 1 node, others need at least 2
        if (selectedNodes.length < 1 || (selectedNodes.length < 2 && alignmentType !== 'size-min')) return;
        hidePreview(); // Clear any existing previews

        const canvas = (window as any).app?.canvas;
        if (!canvas) return;



        // Calculate preview positions using the same logic as the alignment functions
        const previewPositions = calculatePreviewPositions(alignmentType, selectedNodes);
        
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

                // Convert graph coordinates to viewport coordinates. canvasRect already accounts
                // for every toolbar above the canvas, exactly like litegraph's own
                // DragAndScale.convertOffsetToCanvas - no page-chrome correction belongs here.
                //
                // The only correction needed is the node title bar: pos.y is the top-left of the
                // node BODY, while the rendered node starts NODE_TITLE_HEIGHT above it. That is a
                // graph-space constant, so it is correctly multiplied by the zoom scale.
                //
                // This previously used document.querySelector('nav').height. That <nav> is
                // ComfyUI's VERTICAL side toolbar (height: 100%), so on a default install the
                // term was ~1000px instead of ~30 and every preview rect landed off-screen.
                const baseScreenX = (pos.x + canvas.ds.offset[0]) * canvas.ds.scale;
                const baseScreenY = (pos.y + canvas.ds.offset[1]) * canvas.ds.scale;

                const canvasRect = canvas.canvas.getBoundingClientRect();
                const screenX = canvasRect.left + baseScreenX;
                const screenY = canvasRect.top + baseScreenY - (NODE_TITLE_HEIGHT * canvas.ds.scale);

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

            case 'height-center':
                // Align all nodes' horizontal centers on the same vertical line
                // Calculate the horizontal center line of all nodes
                const leftmostX = Math.min(...nodes.map((node: any) => node.pos[0]));
                const rightmostX = Math.max(...nodes.map((node: any) => {
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
                const horizontalCenter = (leftmostX + rightmostX) / 2;

                // Sort nodes by vertical position to maintain order
                const widthCenterSorted = [...nodes].sort((a: any, b: any) => a.pos[1] - b.pos[1]);
                let currentYWidthCenter = widthCenterSorted[0].pos[1];

                const widthCenterPositions = new Map();

                widthCenterSorted.forEach((node: any) => {
                    let nodeWidth = 150, nodeHeight = 100;
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

                    widthCenterPositions.set(node.id, {
                        x: horizontalCenter - (nodeWidth / 2),
                        y: currentYWidthCenter,
                        width: nodeWidth,
                        height: nodeHeight
                    });
                    currentYWidthCenter += nodeHeight + 30;
                });

                nodes.forEach((node: any) => {
                    positions.push(widthCenterPositions.get(node.id));
                });
                break;

            case 'width-center':
                // Align all nodes' vertical centers on the same horizontal line
                // Calculate the vertical center line of all nodes
                const topmostY = Math.min(...nodes.map((node: any) => node.pos[1]));
                const bottommostY = Math.max(...nodes.map((node: any) => {
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
                const verticalCenter = (topmostY + bottommostY) / 2;

                // Sort nodes by horizontal position to maintain order
                const heightCenterSorted = [...nodes].sort((a: any, b: any) => a.pos[0] - b.pos[0]);
                let currentXHeightCenter = heightCenterSorted[0].pos[0];

                const heightCenterPositions = new Map();

                heightCenterSorted.forEach((node: any) => {
                    let nodeWidth = 150, nodeHeight = 100;
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

                    heightCenterPositions.set(node.id, {
                        x: currentXHeightCenter,
                        y: verticalCenter - (nodeHeight / 2),
                        width: nodeWidth,
                        height: nodeHeight
                    });
                    currentXHeightCenter += nodeWidth + 30;
                });

                nodes.forEach((node: any) => {
                    positions.push(heightCenterPositions.get(node.id));
                });
                break;
                
            case 'horizontal-flow':
                // EXACT HORIZONTAL FLOW ALGORITHM from alignHorizontalFlow()
                const hFlowValidNodes = nodes.filter(node => {
                    if (!node) return false;
                    const hasPosition = node.pos || node.position || (typeof node.x === 'number' && typeof node.y === 'number');
                    const hasSize = node.size || node.width || node.height ||
                                  (typeof node.width === 'number' && typeof node.height === 'number');
                    return !!hasPosition && !!hasSize;
                });

                if (hFlowValidNodes.length < 2) break;

                // Calculate starting position - same as actual algorithm
                const hFlowStartX = Math.min(...hFlowValidNodes.map(node => {
                    if (node.pos && (Array.isArray(node.pos) || node.pos.length !== undefined)) return node.pos[0];
                    if (node.position && (Array.isArray(node.position) || node.position.length !== undefined)) return node.position[0];
                    if (typeof node.x === 'number') return node.x;
                    return 0;
                }));
                const hFlowStartY = Math.min(...hFlowValidNodes.map(node => {
                    if (node.pos && (Array.isArray(node.pos) || node.pos.length !== undefined)) return node.pos[1];
                    if (node.position && (Array.isArray(node.position) || node.position.length !== undefined)) return node.position[1];
                    if (typeof node.y === 'number') return node.y;
                    return 0;
                }));

                // Measure the live nodes, then lay out against copies so the originals are
                // never touched. Measuring must happen before the spread: width and height are
                // prototype getters, so `{...node}` drops them and a copy would measure as the
                // 150x100 fallback. Keyed by copy identity so the layout below can look it up.
                const hFlowMeasured = new Map<any, [number, number]>();
                const hFlowNodeCopies = hFlowValidNodes.map(node => {
                    const copy = {
                        ...node,
                        pos: node.pos ? [...node.pos] : [node.x || 0, node.y || 0]
                    };
                    hFlowMeasured.set(copy, [nodeWidth(node), outerHeight(node)]);
                    return copy;
                });
                const hSizeOf = (node: any): [number, number] => hFlowMeasured.get(node) ?? [150, 100];

                // Use exact connection analysis
                const hFlowConnections = analyzeNodeConnections(hFlowNodeCopies);
                const hFlowNodeGraph = buildNodeGraph(hFlowNodeCopies, hFlowConnections);

                // Exact spacing constants from H-Flow
                const H_COLUMN_SPACING = 30;
                const H_NODE_SPACING_Y = 30;
                const H_LEVEL_PADDING = 0;

                // Group by levels exactly like H-Flow
                const hFlowLevels: {[level: number]: any[]} = {};
                hFlowNodeCopies.forEach(node => {
                    if (node && node.id != null) {
                        const level = hFlowNodeGraph[node.id]?.level ?? 0;
                        if (!hFlowLevels[level]) hFlowLevels[level] = [];
                        hFlowLevels[level].push(node);
                    }
                });

                // Position nodes exactly like H-Flow
                const hFlowNodePositions = new Map();
                Object.entries(hFlowLevels).forEach(([levelStr, levelNodes]) => {
                    const level = parseInt(levelStr);
                    if (levelNodes && levelNodes.length > 0) {
                        levelNodes.sort((a, b) => {
                            const aOrder = a && a.id != null && hFlowNodeGraph[a.id] ? hFlowNodeGraph[a.id].order : 0;
                            const bOrder = b && b.id != null && hFlowNodeGraph[b.id] ? hFlowNodeGraph[b.id].order : 0;
                            return aOrder - bOrder;
                        });

                        // Calculate X position for this level
                        let currentX = hFlowStartX;
                        if (level > 0) {
                            for (let prevLevel = 0; prevLevel < level; prevLevel++) {
                                const prevLevelNodes = hFlowLevels[prevLevel] || [];
                                const prevMaxWidth = Math.max(...prevLevelNodes.map(node =>
                                    hSizeOf(node)[0]
                                ));
                                currentX += prevMaxWidth + H_COLUMN_SPACING + H_LEVEL_PADDING;
                            }
                        }

                        let currentY = hFlowStartY;
                        levelNodes.forEach((node) => {
                            if (node) {
                                hFlowNodePositions.set(node.id, {
                                    x: currentX,
                                    y: currentY,
                                    width: hSizeOf(node)[0],
                                    height: hSizeOf(node)[1]
                                });
                                currentY += hSizeOf(node)[1] + H_NODE_SPACING_Y;
                            }
                        });
                    }
                });

                nodes.forEach((node: any) => {
                    const pos = hFlowNodePositions.get(node.id);
                    if (pos) positions.push(pos);
                });
                break;

            case 'vertical-flow':
                // EXACT VERTICAL FLOW ALGORITHM from alignVerticalFlow()
                const vFlowValidNodes = nodes.filter(node => {
                    if (!node) return false;
                    const hasPosition = node.pos || node.position || (typeof node.x === 'number' && typeof node.y === 'number');
                    const hasSize = node.size || node.width || node.height ||
                                  (typeof node.width === 'number' && typeof node.height === 'number');
                    return !!hasPosition && !!hasSize;
                });

                if (vFlowValidNodes.length < 2) break;

                // Calculate starting position - same as actual algorithm
                const vFlowStartX = Math.min(...vFlowValidNodes.map(node => {
                    if (node.pos && (Array.isArray(node.pos) || node.pos.length !== undefined)) return node.pos[0];
                    if (node.position && (Array.isArray(node.position) || node.position.length !== undefined)) return node.position[0];
                    if (typeof node.x === 'number') return node.x;
                    return 0;
                }));
                const vFlowStartY = Math.min(...vFlowValidNodes.map(node => {
                    if (node.pos && (Array.isArray(node.pos) || node.pos.length !== undefined)) return node.pos[1];
                    if (node.position && (Array.isArray(node.position) || node.position.length !== undefined)) return node.position[1];
                    if (typeof node.y === 'number') return node.y;
                    return 0;
                }));

                // Measure the live nodes before spreading - see the H-Flow branch above for why.
                const vFlowMeasured = new Map<any, [number, number]>();
                const vFlowNodeCopies = vFlowValidNodes.map(node => {
                    const copy = {
                        ...node,
                        pos: node.pos ? [...node.pos] : [node.x || 0, node.y || 0]
                    };
                    vFlowMeasured.set(copy, [nodeWidth(node), outerHeight(node)]);
                    return copy;
                });
                const vSizeOf = (node: any): [number, number] => vFlowMeasured.get(node) ?? [150, 100];

                // Use exact connection analysis
                const vFlowConnections = analyzeNodeConnections(vFlowNodeCopies);
                const vFlowNodeGraph = buildNodeGraph(vFlowNodeCopies, vFlowConnections);

                // Exact spacing constants from V-Flow
                const V_ROW_SPACING = 30;
                const V_NODE_SPACING_X = 30;
                const V_LEVEL_PADDING = 0;

                // Group by levels exactly like V-Flow
                const vFlowLevels: {[level: number]: any[]} = {};
                vFlowNodeCopies.forEach(node => {
                    if (node && node.id != null) {
                        const level = vFlowNodeGraph[node.id]?.level ?? 0;
                        if (!vFlowLevels[level]) vFlowLevels[level] = [];
                        vFlowLevels[level].push(node);
                    }
                });

                // Position nodes exactly like V-Flow
                const vFlowNodePositions = new Map();
                Object.entries(vFlowLevels).forEach(([levelStr, levelNodes]) => {
                    const level = parseInt(levelStr);
                    if (levelNodes && levelNodes.length > 0) {
                        levelNodes.sort((a, b) => {
                            const aOrder = a && a.id != null && vFlowNodeGraph[a.id] ? vFlowNodeGraph[a.id].order : 0;
                            const bOrder = b && b.id != null && vFlowNodeGraph[b.id] ? vFlowNodeGraph[b.id].order : 0;
                            return aOrder - bOrder;
                        });

                        // Calculate Y position for this level
                        let currentY = vFlowStartY;
                        if (level > 0) {
                            for (let prevLevel = 0; prevLevel < level; prevLevel++) {
                                const prevLevelNodes = vFlowLevels[prevLevel] || [];
                                const prevMaxHeight = Math.max(...prevLevelNodes.map(node =>
                                    vSizeOf(node)[1]
                                ));
                                currentY += prevMaxHeight + V_ROW_SPACING + V_LEVEL_PADDING;
                            }
                        }

                        let currentX = vFlowStartX;
                        levelNodes.forEach((node) => {
                            if (node) {
                                vFlowNodePositions.set(node.id, {
                                    x: currentX,
                                    y: currentY,
                                    width: vSizeOf(node)[0],
                                    height: vSizeOf(node)[1]
                                });
                                currentX += vSizeOf(node)[0] + V_NODE_SPACING_X;
                            }
                        });
                    }
                });

                nodes.forEach((node: any) => {
                    const pos = vFlowNodePositions.get(node.id);
                    if (pos) positions.push(pos);
                });
                break;

            case 'width-max':
            case 'width-min':
            case 'height-max':
            case 'height-min':
            case 'size-max':
            case 'size-min':
                // Calculate preview dimensions for size adjustment
                nodes.forEach((node: any) => {
                    let currentWidth = 150, currentHeight = 100;
                    if (node.size && Array.isArray(node.size)) {
                        if (node.size[0]) currentWidth = node.size[0];
                        if (node.size[1]) currentHeight = node.size[1];
                    } else {
                        if (typeof node.width === 'number') currentWidth = node.width;
                        if (typeof node.height === 'number') currentHeight = node.height;
                        if (node.properties) {
                            if (typeof node.properties.width === 'number') currentWidth = node.properties.width;
                            if (typeof node.properties.height === 'number') currentHeight = node.properties.height;
                        }
                    }

                    let previewWidth = currentWidth;
                    let previewHeight = currentHeight;

                    if (alignmentType === 'width-max' || alignmentType === 'size-max') {
                        previewWidth = Math.max(...nodes.map((n: any) => {
                            if (n.size && Array.isArray(n.size) && n.size[0]) return n.size[0];
                            if (typeof n.width === 'number') return n.width;
                            if (n.properties && typeof n.properties.width === 'number') return n.properties.width;
                            return 150;
                        }));
                    } else if (alignmentType === 'width-min') {
                        previewWidth = Math.min(...nodes.map((n: any) => {
                            if (n.size && Array.isArray(n.size) && n.size[0]) return n.size[0];
                            if (typeof n.width === 'number') return n.width;
                            if (n.properties && typeof n.properties.width === 'number') return n.properties.width;
                            return 150;
                        }));
                    } else if (alignmentType === 'size-min') {
                        // For size-min, use the node's minimum accepted size from computeSize
                        // Use original computeSize if it was overridden by size-max
                        const computeSizeMethod = originalComputeSizeMethods.get(node) || node.computeSize;
                        if (computeSizeMethod) {
                            try {
                                const minSize = computeSizeMethod.call(node);
                                // Check for both Array and Float32Array (use length and index access)
                                if (minSize && minSize.length >= 2 && minSize[0] !== undefined && minSize[1] !== undefined) {
                                    previewWidth = minSize[0];
                                    // computeSize() is body-only; add the title to match the rect origin
                                    previewHeight = minSize[1] + NODE_TITLE_HEIGHT;
                                } else if (typeof minSize === 'number') {
                                    previewWidth = currentWidth;
                                    previewHeight = minSize + NODE_TITLE_HEIGHT;
                                } else {
                                    previewWidth = currentWidth;
                                    previewHeight = currentHeight;
                                }
                            } catch (e) {
                                previewWidth = currentWidth;
                                previewHeight = currentHeight;
                            }
                        }
                    }

                    // Every previewHeight below is title-INCLUSIVE, matching the rect origin in
                    // showPreview (which starts at pos[1] - NODE_TITLE_HEIGHT). computeSize()
                    // returns a body-only size, hence the explicit + NODE_TITLE_HEIGHT on it.
                    if (alignmentType === 'height-max' || alignmentType === 'size-max') {
                        previewHeight = Math.max(...nodes.map((n: any) => outerHeight(n)));
                    } else if (alignmentType === 'height-min') {
                        // Was reading n.size[1] directly here (body-only) while comparing it
                        // against a title-inclusive computeSize result below, which made the
                        // preview up to NODE_TITLE_HEIGHT too short.
                        const minHeightAmongSelected = Math.min(...nodes.map((n: any) => outerHeight(n)));

                        // Get this node's minimum accepted height from computeSize
                        const computeSizeMethod = originalComputeSizeMethods.get(node) || node.computeSize;
                        let nodeMinHeight = null;
                        if (computeSizeMethod) {
                            try {
                                const result = computeSizeMethod.call(node);
                                if (result && result.length >= 2 && result[1] !== undefined) {
                                    // computeSize() is body-only; add the title to match the rect origin
                                    nodeMinHeight = result[1] + NODE_TITLE_HEIGHT;
                                } else if (typeof result === 'number') {
                                    nodeMinHeight = result + NODE_TITLE_HEIGHT;
                                }
                            } catch (e) {
                                // computeSize failed, use null
                            }
                        }

                        // Use the larger of: min height among selected OR node's accepted minimum
                        previewHeight = nodeMinHeight && nodeMinHeight > minHeightAmongSelected ? nodeMinHeight : minHeightAmongSelected;
                    }

                    positions.push({
                        x: node.pos[0],
                        y: node.pos[1],
                        width: previewWidth,
                        height: previewHeight
                    });
                });
                break;
        }

        return positions;
    }

    // Update selected nodes
    function updateSelectedNodes() {
        if (!window.app?.graph) return;
        
        const graph = window.app.graph;
        const allNodes = Object.values(graph._nodes || {});
        selectedNodes = allNodes.filter((node: any) => node && node.is_selected);
        const allGroups = Array.isArray(graph._groups) ? graph._groups : [];
        selectedGroups = allGroups.filter((group: any) => group && group.selected);
        
        const hasSelectedNodes = selectedNodes.length > 1;
        const totalSelections = selectedNodes.length + selectedGroups.length;

        if (!hasSelectedNodes) {
            hidePreview();
        }

        if (wrapper) {
            wrapper.classList.toggle('hk-has-selection', hasSelectedNodes);
        }

        if (infoPanel) {
            if (totalSelections === 0) {
                infoPanel.innerHTML = `
                    Select multiple nodes to enable alignment
                    <small>Basic: Ctrl+Shift+Arrows · Flow: Ctrl+Alt+→/↓ · Toggle: Ctrl+Shift+H</small>
                `;
            } else if (selectedNodes.length === 0 && selectedGroups.length > 0) {
                infoPanel.innerHTML = `
                    ${selectedGroups.length} group${selectedGroups.length === 1 ? '' : 's'} selected
                    <small>Click a palette color to recolor the group</small>
                `;
            } else if (selectedNodes.length === 1 && selectedGroups.length === 0) {
                infoPanel.innerHTML = `
                    1 node selected · Size-Min available
                    <small>Select more nodes for alignment options</small>
                `;
            } else {
                infoPanel.innerHTML = `
                    ${selectedNodes.length} node${selectedNodes.length === 1 ? '' : 's'} selected${selectedGroups.length ? ` · ${selectedGroups.length} group${selectedGroups.length === 1 ? '' : 's'} selected` : ''} 
                    <small>Try H-Flow/V-Flow for smart layout</small>
                `;
            }
        }

        const buttons = panel?.querySelectorAll<HTMLButtonElement>('.hk-button');
        buttons?.forEach(button => {
            // Size-min can work with 1 node, others need 2+
            const isSizeMin = button.dataset.alignmentType === 'size-min';
            button.disabled = isSizeMin ? selectedNodes.length < 1 : !hasSelectedNodes;
        });
    }

    // Advanced node analysis functions
    function analyzeNodeConnections(nodes: any[]) {
        const connections: {[nodeId: string]: {inputs: any[], outputs: any[]}} = {};
        
        // NOTE: the previous predicate here was `node.id !== undefined || node.id !== null`,
        // which is true for every value. It is dropped rather than changed to `&&`: the loop
        // below deliberately synthesises an id for nodes that lack one, and `&&` would filter
        // those out and make that synthesis dead code.
        const validNodes = nodes.filter(node => node);

        validNodes.forEach((node, index) => {
            // Derive a local key when the node has no usable id. Note `node.id` is NOT written
            // back: doing so renames live graph nodes (id 0 becomes "node_0"), which dangles
            // every link referencing them and corrupts serialisation.
            const nodeId = node.id ?? `node_${index}`;

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
        // `!= null` rather than a truthiness test: id 0 is a legal litegraph id (it arrives via
        // configure() from hand-edited or third-party workflow JSON). Dropping it here would
        // leave a hole in `levels`, and Math.max(...[]) on an empty level yields -Infinity.
        const validNodes = nodes.filter(node => node && node.id != null);
        
        // Level assignment is LONGEST path from a root, not shortest.
        //
        // A plain BFS commits a node's level the first time it is reached, which is the
        // SHORTEST path. Any "skip link" then drags a node forward into the same column as
        // its own producer. On the stock ComfyUI workflow this collapses 5 columns to 3:
        // EmptySD3LatentImage -> KSampler and VAELoader -> VAEDecode are both edges straight
        // from a root, so KSampler lands beside the encoders that feed it and VAEDecode
        // beside KSampler. Longest path is what makes every edge point strictly forward.
        //
        // Kahn's algorithm with relaxation, over the SELECTED nodes only: edges to nodes
        // outside the selection are ignored, so aligning a subset behaves sensibly.

        const idOf = (node: any) => String(node.id);
        const successors = new Map<string, Set<string>>();
        const indegree = new Map<string, number>();
        const level = new Map<string, number>();

        validNodes.forEach(node => {
            successors.set(idOf(node), new Set());
            indegree.set(idOf(node), 0);
            level.set(idOf(node), 0);
        });

        validNodes.forEach(node => {
            const from = idOf(node);
            const outputs = connections[node.id]?.outputs ?? [];
            outputs.forEach((output: any) => {
                const target = output?.targetNode;
                if (!target || target.id == null) return;
                const to = String(target.id);
                // Skip targets outside the selection, self-loops, and duplicate edges
                // (two links between the same pair must count as one for in-degree).
                if (to === from || !successors.has(to) || successors.get(from)!.has(to)) return;
                successors.get(from)!.add(to);
                indegree.set(to, indegree.get(to)! + 1);
            });
        });

        const ready = validNodes.map(idOf).filter(id => indegree.get(id) === 0);

        while (visited.size < validNodes.length) {
            if (ready.length === 0) {
                // Every remaining node is inside a cycle, so none will ever reach in-degree 0.
                // Break it deterministically at the lowest-level, lowest-id node still waiting
                // and carry on. This is what keeps a cyclic selection from looping forever.
                let breakAt: string | null = null;
                for (const node of validNodes) {
                    const id = idOf(node);
                    if (visited.has(id)) continue;
                    if (breakAt === null || level.get(id)! < level.get(breakAt)!) breakAt = id;
                }
                if (breakAt === null) break;
                indegree.set(breakAt, 0);
                ready.push(breakAt);
            }

            const current = ready.shift()!;
            if (visited.has(current)) continue;
            visited.add(current);

            successors.get(current)!.forEach(next => {
                // Relaxation: a node sits one past its DEEPEST producer, not its first.
                if (level.get(next)! < level.get(current)! + 1) {
                    level.set(next, level.get(current)! + 1);
                }
                const remaining = indegree.get(next)! - 1;
                indegree.set(next, remaining);
                if (remaining <= 0 && !visited.has(next)) ready.push(next);
            });
        }

        // Disconnected nodes never gain an in-edge, so they stay at level 0.
        validNodes.forEach(node => {
            graph[node.id] = {level: level.get(idOf(node)) ?? 0, order: 0};
        });

        // Assign order within each level
        const levels: {[level: number]: any[]} = {};
        // `nodeId` is an Object.entries key, so always a string, while node.id is a number on
        // current frontends. The previous strict compare could therefore never match: every
        // level stayed empty, no `order` was ever assigned, and the four downstream sorts
        // became stable no-ops - i.e. "sort within a level by vertical position" never ran.
        const nodesById = new Map(validNodes.map(n => [String(n.id), n]));
        Object.entries(graph).forEach(([nodeId, data]) => {
            if (!levels[data.level]) levels[data.level] = [];
            const node = nodesById.get(nodeId);
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
                    if (node && node.id != null && graph[node.id]) {
                        graph[node.id].order = index;
                    }
                });
            }
        });
        
        return graph;
    }

    // Align nodes function with advanced options
    function alignNodes(alignmentType: string) {
        // Allow size-min with 1 node, others need at least 2
        if (selectedNodes.length < 1 || (selectedNodes.length < 2 && alignmentType !== 'size-min')) {
            showMessage('Please select at least 2 nodes to align', 'warning');
            return;
        }

        // Bracket every mutation in one undo transaction. ComfyUI's ChangeTracker listens
        // for the DOM event emitted by these two methods; graph.beforeChange()/afterChange()
        // only invoke canvas.onBeforeChange, which the frontend never assigns.
        // finally is required: the horizontal/vertical-flow cases return from inside the try.
        const undoCanvas = getActiveCanvas();
        undoCanvas?.emitBeforeChange?.();

        try {
            // Calculate all reference positions and sizes at the start to avoid drift on consecutive clicks
            const originalLeftPos = Math.min(...selectedNodes.map((node: any) => node.pos[0]));
            // Positioning bounds use the rendered (title-inclusive) box, so that every node's
            // rendered edge lands the same distance from the reference value regardless of size.
            const originalRightPos = Math.max(...selectedNodes.map((node: any) => node.pos[0] + nodeWidth(node)));
            const originalTopPos = Math.min(...selectedNodes.map((node: any) => node.pos[1]));
            const originalBottomPos = Math.max(...selectedNodes.map((node: any) => node.pos[1] + outerHeight(node)));

            // Size bounds are body-only, because the size operations below write node.size[1].
            // Mixing these two conventions is the trap this block used to hide behind dead
            // Array.isArray() guards - keep them explicitly separate.
            const originalMaxWidth = Math.max(...selectedNodes.map((node: any) => nodeWidth(node)));
            const originalMinWidth = Math.min(...selectedNodes.map((node: any) => nodeWidth(node)));
            const originalMaxHeight = Math.max(...selectedNodes.map((node: any) => bodyHeight(node)));
            const originalMinHeight = Math.min(...selectedNodes.map((node: any) => bodyHeight(node)));

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

                case 'height-center':
                    // Align all nodes' horizontal centers on the same vertical line, maintain vertical spacing
                    // Calculate the horizontal center line of all nodes
                    const leftmostXAlign = Math.min(...selectedNodes.map((node: any) => node.pos[0]));
                    const rightmostXAlign = Math.max(...selectedNodes.map((node: any) => {
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
                    const horizontalCenterAlign = (leftmostXAlign + rightmostXAlign) / 2;

                    // Sort nodes by vertical position to maintain order
                    const widthCenterSortedNodes = [...selectedNodes].sort((a: any, b: any) => a.pos[1] - b.pos[1]);
                    
                    let currentYWidthCenterAlign = widthCenterSortedNodes[0].pos[1];
                    
                    widthCenterSortedNodes.forEach((node: any) => {
                        const nodeSpacing = 30;
                        
                        let nodeWidth = 150, nodeHeight = 100;
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

                        // Center the node horizontally on the center line
                        node.pos[0] = horizontalCenterAlign - (nodeWidth / 2);
                        node.pos[1] = currentYWidthCenterAlign;
                        
                        // Update x,y properties if they exist
                        if (typeof node.x === 'number') node.x = node.pos[0];
                        if (typeof node.y === 'number') node.y = node.pos[1];
                        
                        currentYWidthCenterAlign += nodeHeight + nodeSpacing;
                    });
                    break;

                case 'width-center':
                    // Align all nodes' vertical centers on the same horizontal line, maintain horizontal spacing
                    // Calculate the vertical center line of all nodes
                    const topmostYAlign = Math.min(...selectedNodes.map((node: any) => node.pos[1]));
                    const bottommostYAlign = Math.max(...selectedNodes.map((node: any) => {
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
                    const verticalCenterAlign = (topmostYAlign + bottommostYAlign) / 2;

                    // Sort nodes by horizontal position to maintain order
                    const heightCenterSortedNodes = [...selectedNodes].sort((a: any, b: any) => a.pos[0] - b.pos[0]);
                    
                    let currentXHeightCenterAlign = heightCenterSortedNodes[0].pos[0];
                    
                    heightCenterSortedNodes.forEach((node: any) => {
                        const nodeSpacing = 30;
                        
                        let nodeWidth = 150, nodeHeight = 100;
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

                        // Center the node vertically on the center line
                        node.pos[1] = verticalCenterAlign - (nodeHeight / 2);
                        node.pos[0] = currentXHeightCenterAlign;
                        
                        // Update x,y properties if they exist
                        if (typeof node.x === 'number') node.x = node.pos[0];
                        if (typeof node.y === 'number') node.y = node.pos[1];
                        
                        currentXHeightCenterAlign += nodeWidth + nodeSpacing;
                    });
                    break;

                case 'width-max':
                    selectedNodes.forEach((node: any) => {
                        if (node.size) {
                            node.size[0] = originalMaxWidth;
                        }
                    });
                    break;

                case 'width-min':
                    selectedNodes.forEach((node: any) => {
                        if (node.size) {
                            node.size[0] = originalMinWidth;
                        }
                    });
                    break;

                case 'height-max':
                    selectedNodes.forEach((node: any) => {
                        if (node.size) {
                            node.size[1] = originalMaxHeight;
                        }
                    });
                    break;

                case 'height-min':
                    selectedNodes.forEach((node: any) => {
                        if (node.size) {
                            const computeSizeMethod = originalComputeSizeMethods.get(node) || node.computeSize;
                            if (computeSizeMethod) {
                                const minSize = computeSizeMethod.call(node);
                                node.size[1] = Math.max(originalMinHeight, minSize[1]); // Minimum height
                            }
                        }
                    });
                    break;

                case 'size-max':
                    selectedNodes.forEach((node: any) => {
                        if (node.size) {
                            node.size[0] = originalMaxWidth;
                            node.size[1] = originalMaxHeight;
                        }
                    });
                    break;

                case 'size-min':
                    selectedNodes.forEach((node: any) => {
                        if (node.size) {
                            // Get the node's minimum accepted size from computeSize
                            // Use original computeSize if it was overridden by size-max
                            const computeSizeMethod = originalComputeSizeMethods.get(node) || node.computeSize;
                            if (computeSizeMethod) {
                                const minSize = computeSizeMethod.call(node);
                                node.size[0] = minSize[0]; // Minimum width
                                node.size[1] = minSize[1]; // Minimum height
                            }
                        }
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
            markCanvasDirty();

        } catch (error) {
            console.error('[housekeeper] alignment failed:', alignmentType, error);
            showMessage('Error during alignment', 'error');
        } finally {
            undoCanvas?.emitAfterChange?.();
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
                
                // Sizes are measured per run by measureFlowNodes() below - never cached on
                // the node, and node.size is never modified.
                //
                // The `if (!Array.isArray(node.pos)) node.pos = [0, 0]` reset that used to sit
                // here is gone. node.pos is a Float32Array, so Array.isArray was false for
                // every node and this fired every time, writing the origin into the position
                // accessor. It happened to be invisible on the classic canvas because every
                // node is repositioned below anyway - but under Vue Nodes that write lands in
                // the layout store, which is exactly where it does damage.
            });
            
            const connections = analyzeNodeConnections(validNodes);
            const nodeGraph = buildNodeGraph(validNodes, connections);
            // Fresh every run - see measureFlowNodes(). A cached size goes stale the moment
            // the user resizes or collapses a node.
            const sizeOf = measureFlowNodes(validNodes);
            
            // Configuration for horizontal flow - OPTIMIZED for staying near original location
            const COLUMN_SPACING = 30;      // Spacing between columns
            const NODE_SPACING_X = 30;      // Horizontal space between node edges
            const NODE_SPACING_Y = 30;      // Vertical space between node edges
            const LEVEL_PADDING = 0;        // Minimal padding between levels
            
            // Group nodes by level
            const levels: {[level: number]: any[]} = {};
            validNodes.forEach(node => {
                if (node && node.id != null) {
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
                        const aOrder = a && a.id != null && nodeGraph[a.id] ? nodeGraph[a.id].order : 0;
                        const bOrder = b && b.id != null && nodeGraph[b.id] ? nodeGraph[b.id].order : 0;
                        return aOrder - bOrder;
                    });
                    
                    // Calculate total height needed for this level (preserving original node sizes)
                    const totalHeight = levelNodes.reduce((sum, node, index) => {
                        const nodeHeight = sizeOf(node)[1];
                        return sum + nodeHeight + (index < levelNodes.length - 1 ? NODE_SPACING_Y : 0);
                    }, 0);
                    
                    // Calculate maximum node width in this level for proper column spacing
                    const maxNodeWidth = Math.max(...levelNodes.map(node => 
                        sizeOf(node)[0]
                    ));
                    
                    // Position horizontally (X-axis) - ensure proper spacing between columns
                    let currentX = startX;
                    if (level > 0) {
                        // Calculate cumulative width of previous levels plus spacing
                        for (let prevLevel = 0; prevLevel < level; prevLevel++) {
                            const prevLevelNodes = levels[prevLevel] || [];
                            const prevMaxWidth = Math.max(...prevLevelNodes.map(node => 
                                sizeOf(node)[0]
                            ));
                            currentX += prevMaxWidth + COLUMN_SPACING + LEVEL_PADDING;
                        }
                    }
                    
                    // Position vertically (Y-axis) - start from top edge, no centering
                    let currentY = startY;
                    
                    
                    levelNodes.forEach((node, index) => {
                        if (node && node.pos) {
                            const oldPos = [node.pos[0], node.pos[1]];
                            
                            // Set horizontal position (column based on level) 
                            node.pos[0] = currentX;
                            
                            // Set vertical position with proper spacing
                            node.pos[1] = currentY;
                            
                            
                            // CRITICAL: NEVER modify node.size, node.width, node.height properties!
                            // All original size properties remain completely unchanged
                            
                            // Move to next vertical position for next node in this level
                            // Add the current node's height plus spacing (using calculated size)
                            currentY += sizeOf(node)[1] + NODE_SPACING_Y;
                            
                            // Only update position properties (x,y,pos) - NEVER size properties
                            if (typeof node.x === 'number') node.x = node.pos[0];
                            if (typeof node.y === 'number') node.y = node.pos[1];
                            // NEVER modify width/height/size properties - they stay exactly as they were
                        }
                    });
                }
            });
            
            // Mark canvas as dirty to trigger redraw
            markCanvasDirty();
            
            // Success message removed - clean prompt window
        } catch (error) {
            console.error('[housekeeper] horizontal flow alignment failed:', error);
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
                
                // Sizes are measured per run by measureFlowNodes() below - never cached on
                // the node, and node.size is never modified.
                //
                // The `if (!Array.isArray(node.pos)) node.pos = [0, 0]` reset that used to sit
                // here is gone. node.pos is a Float32Array, so Array.isArray was false for
                // every node and this fired every time, writing the origin into the position
                // accessor. It happened to be invisible on the classic canvas because every
                // node is repositioned below anyway - but under Vue Nodes that write lands in
                // the layout store, which is exactly where it does damage.
            });
            
            const connections = analyzeNodeConnections(validNodes);
            const nodeGraph = buildNodeGraph(validNodes, connections);
            // Fresh every run - see measureFlowNodes(). A cached size goes stale the moment
            // the user resizes or collapses a node.
            const sizeOf = measureFlowNodes(validNodes);
            
            // Configuration for vertical flow - ENHANCED spacing to prevent overlapping
            const ROW_SPACING = 30;         // Spacing between rows
            const NODE_SPACING_X = 30;      // Horizontal space between node edges
            const NODE_SPACING_Y = 30;      // Vertical space between node edges
            const LEVEL_PADDING = 0;        // Minimal padding between levels
            
            // Group nodes by level
            const levels: {[level: number]: any[]} = {};
            validNodes.forEach(node => {
                if (node && node.id != null) {
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
                        const aOrder = a && a.id != null && nodeGraph[a.id] ? nodeGraph[a.id].order : 0;
                        const bOrder = b && b.id != null && nodeGraph[b.id] ? nodeGraph[b.id].order : 0;
                        return aOrder - bOrder;
                    });
                    
                    // Calculate total width needed for this level (preserving original node sizes)
                    const totalWidth = levelNodes.reduce((sum, node, index) => {
                        const nodeWidth = sizeOf(node)[0];
                        // Add spacing between all nodes, including after the last one for visual balance
                        return sum + nodeWidth + NODE_SPACING_X;
                    }, 0);
                    
                    // Calculate maximum node height in this level for proper row spacing
                    const maxNodeHeight = Math.max(...levelNodes.map(node => 
                        sizeOf(node)[1]
                    ));
                    
                    // Position vertically (Y-axis) - ensure proper spacing between rows
                    let currentY = startY;
                    if (level > 0) {
                        // Calculate cumulative height of previous levels plus spacing
                        for (let prevLevel = 0; prevLevel < level; prevLevel++) {
                            const prevLevelNodes = levels[prevLevel] || [];
                            const prevMaxHeight = Math.max(...prevLevelNodes.map(node => 
                                sizeOf(node)[1]
                            ));
                            currentY += prevMaxHeight + ROW_SPACING + LEVEL_PADDING;
                        }
                    }
                    
                    // Position horizontally (X-axis) - start from left edge and space nodes properly
                    let currentX = startX;
                    
                    
                    levelNodes.forEach((node, index) => {
                        if (node && node.pos) {
                            const oldPos = [node.pos[0], node.pos[1]];
                            
                            // Set horizontal position with proper spacing
                            node.pos[0] = currentX;
                            
                            // Set vertical position (row based on level)
                            node.pos[1] = currentY;
                            
                            
                            // CRITICAL: NEVER modify node.size, node.width, node.height properties!
                            // All original size properties remain completely unchanged
                            
                            // Move to next horizontal position for next node in this level
                            // Add the current node's width plus spacing (using calculated size)
                            currentX += sizeOf(node)[0] + NODE_SPACING_X;
                            
                            // Only update position properties (x,y,pos) - NEVER size properties
                            if (typeof node.x === 'number') node.x = node.pos[0];
                            if (typeof node.y === 'number') node.y = node.pos[1];
                            // NEVER modify width/height/size properties - they stay exactly as they were
                        }
                    });
                }
            });
            
            // Mark canvas as dirty to trigger redraw
            markCanvasDirty();
            
            // Success message removed - clean prompt window
        } catch (error) {
            console.error('[housekeeper] vertical flow alignment failed:', error);
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
            pointer-events: none;
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
    // True when the keystroke is destined for a text field, in which case none of the
    // shortcuts below may claim it. Ctrl/Cmd+Shift+Arrow is the OS word-selection binding and
    // is used constantly in ComfyUI's prompt widgets. This must run before preventDefault():
    // checking the selection instead is not enough, because preventDefault happens first, and
    // a canvas selection survives while the user types (clicks into an overlaid DOM widget are
    // never forwarded to litegraph), so the shortcut would rewrite node positions mid-sentence.
    function isTextEntryTarget(e: KeyboardEvent): boolean {
        const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
        const target = (path[0] as HTMLElement) ?? (e.target as HTMLElement) ?? document.activeElement;
        if (!target || !(target as any).tagName) return false;

        const tag = (target as HTMLElement).tagName.toUpperCase();
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
        return (target as HTMLElement).isContentEditable === true;
    }

    function handleKeyboard(e: KeyboardEvent) {
        if (!(e.ctrlKey || e.metaKey)) return;
        if (isTextEntryTarget(e)) return;

        if (e.shiftKey && !e.altKey && (e.key === 'H' || e.key === 'h')) {
            e.preventDefault();
            togglePanel();
            return;
        }
        
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
    const previewState = {
        active: false,
        colorOption: null as null | { color: string; bgcolor: string; groupcolor: string },
        nodes: new Map<any, { color?: string; bgcolor?: string; groupcolor?: string }>(),
        groups: new Map<any, { color?: string }>()
    };
