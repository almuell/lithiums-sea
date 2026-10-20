import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

// Multi-page build: the main site plus the legal pages.
const page = (file) => fileURLToPath(new URL(file, import.meta.url))

export default defineConfig({
  build: {
    // Never inline assets as data: URIs — the Content-Security-Policy in
    // vercel.json only allows fonts and media from our own origin.
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: page('./index.html'),
        impressum: page('./impressum.html'),
        datenschutz: page('./datenschutz.html'),
      },
    },
  },
})
