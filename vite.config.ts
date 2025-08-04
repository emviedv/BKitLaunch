import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5176,
    force: true, // Force cache clearing
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  publicDir: 'public',
  // Copy _redirects file to build output
  assetsInclude: ['**/_redirects'],
  define: {
    // Add timestamp to force cache busting
    __CACHE_BUST__: JSON.stringify(Date.now()),
  },
}) 