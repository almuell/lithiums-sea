import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

// Multi-page build: the main site plus the legal pages.
const page = (file) => fileURLToPath(new URL(file, import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: page('./index.html'),
        impressum: page('./impressum.html'),
      },
    },
  },
})
