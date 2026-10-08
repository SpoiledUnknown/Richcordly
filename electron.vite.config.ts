import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    build: {
      minify: 'esbuild',
      sourcemap: false,
      rollupOptions: {
        external: ['electron']
      }
    }
  },
  preload: {
    build: {
      minify: 'esbuild',
      sourcemap: false,
      rollupOptions: {
        external: ['electron']
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    build: {
      minify: 'esbuild',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'pinia']
          }
        }
      }
    },
    plugins: [vue()]
  }
})
