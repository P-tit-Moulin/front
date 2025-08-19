import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    vue(),
    vuetify({
      styles: {
        configFile: 'src/assets/styles/settings.scss',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @use "@/assets/styles/settings.scss" as *;
        `,
      },
    },
  },
  build: {
    minify: 'esbuild',
    sourcemap: false,
    brotliSize: true,
    chunkSizeWarningLimit: 600,
  },
})
