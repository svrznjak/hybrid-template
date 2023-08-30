import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import indexFilePlugin from './vite-plugins/indexFilePlugin.ts'
import appConfig from './src/app/config.json'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), indexFilePlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '#': fileURLToPath(new URL('./src/app', import.meta.url))
    }
  },
  define: {
    __APP_CONFIG__: appConfig
  }
})
