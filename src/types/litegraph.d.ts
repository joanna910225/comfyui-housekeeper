import type { LGraphNode } from '@comfyorg/litegraph'

// ComfyUI stamps `comfyClass` onto the node constructor when it registers a node type, but
// the property is a ComfyUI addition and litegraph's own LGraphNodeConstructor does not
// declare it. src/main.ts reads it in nodeCreated() to tell its own nodes apart from every
// other node on the graph, which is a TS2339 against the upstream type.
//
// Declared here rather than in src/main.ts so the source - and therefore the committed
// js/main.js bundle - is untouched. Type parameters must match the upstream declaration
// exactly for the interfaces to merge.
declare module '@comfyorg/litegraph' {
    interface LGraphNodeConstructor<T extends LGraphNode = LGraphNode> {
        comfyClass?: string
    }
}
