import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    build: {
        lib: {
            entry: './src/main.ts',
            formats: ['es'],
            fileName: 'main'
        },
        rollupOptions: {
            external: [
                '../../../scripts/app.js',
                '../../../scripts/api.js',
                '../../../scripts/domWidget.js',
                '../../../scripts/utils.js',
            ],
            output: {
                dir: 'js',
                assetFileNames: 'assets/[name].[ext]',
                entryFileNames: 'main.js'
            }
        },
        outDir: 'js',
        sourcemap: false,
        assetsInlineLimit: 0,
        cssCodeSplit: false
    }
})