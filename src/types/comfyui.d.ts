// The gaps between what ComfyUI's published types describe and what src/main.ts actually
// calls. Declared here rather than in src/main.ts so the source - and therefore the
// committed js/main.js bundle - is untouched.
//
// This file replaces the old src/types/litegraph.d.ts. Up to @comfyorg/comfyui-frontend-types
// 1.22.x the package depended on @comfyorg/litegraph and the litegraph types could be
// augmented directly. From 1.47.x the litegraph declarations are inlined into the
// frontend-types bundle and that dependency is gone, so there is no '@comfyorg/litegraph'
// module left to augment.

import type { ComfyApp, ComfyExtension } from '@comfyorg/comfyui-frontend-types'

// ComfyExtension ends with `[key: string]: unknown`, which makes `keyof ComfyExtension` be
// `string | number`. The stock `Omit` is `Pick<T, Exclude<keyof T, K>>`, and `Exclude` cannot
// subtract a literal from `string`, so it picks the index signature and silently discards
// every named member - `name` included. A homomorphic mapped type with a key filter keeps the
// named members and the index signature both, and drops only what was asked for.
type OmitDeclared<T, K extends keyof never> = { [P in keyof T as P extends K ? never : P]: T[P] }

// Neither type is exported by the package, so reach them through the shapes that are.
type LGraphNode = Parameters<NonNullable<ComfyExtension['nodeCreated']>>[0]
type SettingParams = NonNullable<ComfyExtension['settings']>[number]

type HousekeeperExtension = OmitDeclared<ComfyExtension, 'settings' | 'nodeCreated'> & {
    // SettingParams types `id` as `keyof Settings`, a closed union of the ids ComfyUI ships
    // with. A third-party extension's own id - here 'Housekeeper.NodeSpacing' - is not in it
    // and never can be. Everything else about a setting stays checked.
    settings?: (OmitDeclared<SettingParams, 'id'> & { id: string })[]

    // ComfyUI stamps `comfyClass` onto the node constructor when it registers a node type.
    // It is a ComfyUI addition; litegraph's own LGraphNodeConstructor does not declare it,
    // and unlike the instance-side `comfyClass` the constructor-side one is still missing.
    // nodeCreated() reads it to tell Housekeeper's own nodes apart from every other node on
    // the graph.
    nodeCreated?(node: LGraphNode & { constructor: { comfyClass?: string } }, app: ComfyApp): void
}

declare global {
    // 1.22.x declared `window.app` and `window.graph` in a `declare global` block. 1.47.x
    // dropped it, but the frontend still puts `app` on the window and main.ts still reads it
    // as a fallback when no active canvas is reachable.
    interface Window {
        app?: ComfyApp
    }
}

declare module '@comfyorg/comfyui-frontend-types' {
    // ComfyApp is an exported class, so an interface of the same name merges into its
    // instance type, and a method of the same name merges as an extra overload rather than
    // replacing the original. Calls that satisfy the published ComfyExtension keep matching
    // it; only the two relaxations above fall through to this one.
    interface ComfyApp {
        registerExtension(extension: HousekeeperExtension): void
    }
}
