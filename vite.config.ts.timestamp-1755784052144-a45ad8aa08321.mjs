// vite.config.ts
import { defineConfig } from "file:///Users/emily/Products/BiblioKit%20Launch/node_modules/.deno/vite@5.4.19/node_modules/vite/dist/node/index.js";
import react from "file:///Users/emily/Products/BiblioKit%20Launch/node_modules/.deno/@vitejs+plugin-react@4.7.0/node_modules/@vitejs/plugin-react/dist/index.js";
import { resolve } from "path";
var __vite_injected_original_dirname = "/Users/emily/Products/BiblioKit Launch";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    {
      name: "html-cache-bust",
      transformIndexHtml(html) {
        return html.replace(
          "/src/main.tsx",
          `/src/main.tsx?bust=${Date.now()}`
        );
      }
    }
  ],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@": resolve(__vite_injected_original_dirname, "./src"),
      // Hard-dedupe React to avoid multiple copies causing invalid hook calls (#321)
      react: resolve(__vite_injected_original_dirname, "./node_modules/react"),
      "react-dom": resolve(__vite_injected_original_dirname, "./node_modules/react-dom"),
      "react/jsx-runtime": resolve(__vite_injected_original_dirname, "./node_modules/react/jsx-runtime"),
      "react/jsx-dev-runtime": resolve(__vite_injected_original_dirname, "./node_modules/react/jsx-dev-runtime")
    }
  },
  optimizeDeps: {
    include: ["react", "react-dom"]
  },
  server: {
    host: "0.0.0.0",
    port: 9990,
    strictPort: true
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    // Emit manifest at top-level so Netlify publishes it (avoid hidden .vite directory)
    manifest: "manifest.json",
    rollupOptions: {
      input: "./index.html"
    }
  },
  define: {
    // Add timestamp to force cache busting
    __CACHE_BUST__: JSON.stringify(Date.now())
  },
  ssr: {
    // Don't externalize dependencies for better Edge Function compatibility
    noExternal: [
      "react",
      "react-dom",
      "wouter",
      "wouter/static-location",
      "clsx",
      "lucide-react",
      "framer-motion",
      "tailwind-merge",
      "canvas-confetti",
      // Ensure Deno-compatible SSR bundle by including these packages
      "use-sync-external-store",
      "use-sync-external-store/shim"
    ]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZW1pbHkvUHJvZHVjdHMvQmlibGlvS2l0IExhdW5jaFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2VtaWx5L1Byb2R1Y3RzL0JpYmxpb0tpdCBMYXVuY2gvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2VtaWx5L1Byb2R1Y3RzL0JpYmxpb0tpdCUyMExhdW5jaC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcbiBcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgXG4gICAge1xuICAgICAgbmFtZTogJ2h0bWwtY2FjaGUtYnVzdCcsXG4gICAgICB0cmFuc2Zvcm1JbmRleEh0bWwoaHRtbCkge1xuICAgICAgICByZXR1cm4gaHRtbC5yZXBsYWNlKFxuICAgICAgICAgICcvc3JjL21haW4udHN4JyxcbiAgICAgICAgICBgL3NyYy9tYWluLnRzeD9idXN0PSR7RGF0ZS5ub3coKX1gXG4gICAgICAgICk7XG4gICAgICB9LFxuICAgIH0sXG4gIF0sXG4gIHJlc29sdmU6IHtcbiAgICBkZWR1cGU6IFtcInJlYWN0XCIsIFwicmVhY3QtZG9tXCJdLFxuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgICAvLyBIYXJkLWRlZHVwZSBSZWFjdCB0byBhdm9pZCBtdWx0aXBsZSBjb3BpZXMgY2F1c2luZyBpbnZhbGlkIGhvb2sgY2FsbHMgKCMzMjEpXG4gICAgICByZWFjdDogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9ub2RlX21vZHVsZXMvcmVhY3RcIiksXG4gICAgICBcInJlYWN0LWRvbVwiOiByZXNvbHZlKF9fZGlybmFtZSwgXCIuL25vZGVfbW9kdWxlcy9yZWFjdC1kb21cIiksXG4gICAgICBcInJlYWN0L2pzeC1ydW50aW1lXCI6IHJlc29sdmUoX19kaXJuYW1lLCBcIi4vbm9kZV9tb2R1bGVzL3JlYWN0L2pzeC1ydW50aW1lXCIpLFxuICAgICAgXCJyZWFjdC9qc3gtZGV2LXJ1bnRpbWVcIjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9ub2RlX21vZHVsZXMvcmVhY3QvanN4LWRldi1ydW50aW1lXCIpLFxuICAgIH0sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFtcInJlYWN0XCIsIFwicmVhY3QtZG9tXCJdLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiAnMC4wLjAuMCcsXG4gICAgcG9ydDogOTk5MCxcbiAgICBzdHJpY3RQb3J0OiB0cnVlLFxuICB9LFxuICBidWlsZDoge1xuICAgIG91dERpcjogJ2Rpc3QnLFxuICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICAvLyBFbWl0IG1hbmlmZXN0IGF0IHRvcC1sZXZlbCBzbyBOZXRsaWZ5IHB1Ymxpc2hlcyBpdCAoYXZvaWQgaGlkZGVuIC52aXRlIGRpcmVjdG9yeSlcbiAgICBtYW5pZmVzdDogJ21hbmlmZXN0Lmpzb24nLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGlucHV0OiAnLi9pbmRleC5odG1sJ1xuICAgIH1cbiAgfSxcbiAgZGVmaW5lOiB7XG4gICAgLy8gQWRkIHRpbWVzdGFtcCB0byBmb3JjZSBjYWNoZSBidXN0aW5nXG4gICAgX19DQUNIRV9CVVNUX186IEpTT04uc3RyaW5naWZ5KERhdGUubm93KCkpLFxuICB9LFxuICBzc3I6IHtcbiAgICAvLyBEb24ndCBleHRlcm5hbGl6ZSBkZXBlbmRlbmNpZXMgZm9yIGJldHRlciBFZGdlIEZ1bmN0aW9uIGNvbXBhdGliaWxpdHlcbiAgICBub0V4dGVybmFsOiBbXG4gICAgICAncmVhY3QnLFxuICAgICAgJ3JlYWN0LWRvbScsXG4gICAgICAnd291dGVyJyxcbiAgICAgICd3b3V0ZXIvc3RhdGljLWxvY2F0aW9uJyxcbiAgICAgICdjbHN4JyxcbiAgICAgICdsdWNpZGUtcmVhY3QnLFxuICAgICAgJ2ZyYW1lci1tb3Rpb24nLFxuICAgICAgJ3RhaWx3aW5kLW1lcmdlJyxcbiAgICAgICdjYW52YXMtY29uZmV0dGknLFxuICAgICAgLy8gRW5zdXJlIERlbm8tY29tcGF0aWJsZSBTU1IgYnVuZGxlIGJ5IGluY2x1ZGluZyB0aGVzZSBwYWNrYWdlc1xuICAgICAgJ3VzZS1zeW5jLWV4dGVybmFsLXN0b3JlJyxcbiAgICAgICd1c2Utc3luYy1leHRlcm5hbC1zdG9yZS9zaGltJ1xuICAgIF1cbiAgfVxufSkiXSwKICAibWFwcGluZ3MiOiAiO0FBQXNTLFNBQVMsb0JBQW9CO0FBQ25VLE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWU7QUFGeEIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBRU47QUFBQSxNQUNFLE1BQU07QUFBQSxNQUNOLG1CQUFtQixNQUFNO0FBQ3ZCLGVBQU8sS0FBSztBQUFBLFVBQ1Y7QUFBQSxVQUNBLHNCQUFzQixLQUFLLElBQUksQ0FBQztBQUFBLFFBQ2xDO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxRQUFRLENBQUMsU0FBUyxXQUFXO0FBQUEsSUFDN0IsT0FBTztBQUFBLE1BQ0wsS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQTtBQUFBLE1BRS9CLE9BQU8sUUFBUSxrQ0FBVyxzQkFBc0I7QUFBQSxNQUNoRCxhQUFhLFFBQVEsa0NBQVcsMEJBQTBCO0FBQUEsTUFDMUQscUJBQXFCLFFBQVEsa0NBQVcsa0NBQWtDO0FBQUEsTUFDMUUseUJBQXlCLFFBQVEsa0NBQVcsc0NBQXNDO0FBQUEsSUFDcEY7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsU0FBUyxXQUFXO0FBQUEsRUFDaEM7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxFQUNkO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUE7QUFBQSxJQUVYLFVBQVU7QUFBQSxJQUNWLGVBQWU7QUFBQSxNQUNiLE9BQU87QUFBQSxJQUNUO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBO0FBQUEsSUFFTixnQkFBZ0IsS0FBSyxVQUFVLEtBQUssSUFBSSxDQUFDO0FBQUEsRUFDM0M7QUFBQSxFQUNBLEtBQUs7QUFBQTtBQUFBLElBRUgsWUFBWTtBQUFBLE1BQ1Y7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBO0FBQUEsTUFFQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
