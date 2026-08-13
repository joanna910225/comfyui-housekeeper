// Ambient declarations for the module specifiers Vite resolves but tsc cannot.
//
// Nothing here describes application types; it only tells the compiler what the bundler
// already knows. See src/types/litegraph.d.ts for the one real type gap.

// Vite turns `import icon from '../icons/x.svg?url'` into the emitted asset path, a plain
// string. tsc has no notion of the `?url` query, so every icon import in src/main.ts is a
// TS2307 without this.
declare module '*.svg?url' {
    const src: string
    export default src
}

// ComfyUI serves its own frontend scripts from web/scripts/, which the installed bundle
// reaches as ../../../scripts/app.js from custom_nodes/<pack>/js/. No such file exists in
// this repo - vite.config.mts lists it in rollupOptions.external for exactly that reason -
// so the specifier resolves in the browser and nowhere else. Declaring it keeps `app`
// typed without checking a stub into the tree.
declare module '*/scripts/app.js' {
    export const app: import('@comfyorg/comfyui-frontend-types').ComfyApp
}
