import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/widget.js',
      name: 'CRSETChat',
      fileName: 'widget',
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        entryFileNames: 'widget.js',
        assetFileNames: 'widget.[ext]'
      }
    },
    outDir: 'dist-widget',
    emptyOutDir: true
  }
})

