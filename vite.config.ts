import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'html-cache-bust',
      transformIndexHtml(html) {
        return html.replace(
          '/src/main.tsx',
          `/src/main.tsx?bust=${Date.now()}`
        );
      },
    },
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5176,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    manifest: true,
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
      'clsx',
      'lucide-react',
      'tailwind-merge',
      // Ensure Deno-compatible SSR bundle by including these packages
      'use-sync-external-store',
      'use-sync-external-store/shim'
    ]
  }
})