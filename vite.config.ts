import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const envPort = Number(process.env.PORT || process.env.VITE_PORT)
const port = Number.isFinite(envPort) && envPort > 0 ? envPort : 53173

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@": resolve(__dirname, "./src"),
      // Hard-dedupe React to avoid multiple copies causing invalid hook calls (#321)
      react: resolve(__dirname, "./node_modules/react"),
      "react-dom": resolve(__dirname, "./node_modules/react-dom"),
      "react/jsx-runtime": resolve(__dirname, "./node_modules/react/jsx-runtime"),
      "react/jsx-dev-runtime": resolve(__dirname, "./node_modules/react/jsx-dev-runtime"),
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
  server: {
    host: '127.0.0.1',
    port,
    strictPort: true,
    hmr: {
      host: '127.0.0.1',
      port,
      protocol: 'ws'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: process.env.SOURCEMAPS === '1',
    // Emit manifest at top-level so Netlify publishes it (avoid hidden .vite directory)
    manifest: 'manifest.json',
    rollupOptions: {
      input: './index.html'
    }
  },
  define: {
    // Add timestamp to force cache busting
    __CACHE_BUST__: JSON.stringify(Date.now()),
  },
  ssr: {
    // Don't externalize dependencies for better Edge Function compatibility
    noExternal: [
      'react',
      'react-dom',
      'wouter',
      'wouter/static-location',
      'clsx',
      'lucide-react',
      'framer-motion',
      'tailwind-merge',
      'canvas-confetti',
      // Ensure Deno-compatible SSR bundle by including these packages
      'use-sync-external-store',
      'use-sync-external-store/shim'
    ]
  }
})
