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
    manifest: true,
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZW1pbHkvUHJvZHVjdHMvQmlibGlvS2l0IExhdW5jaFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2VtaWx5L1Byb2R1Y3RzL0JpYmxpb0tpdCBMYXVuY2gvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2VtaWx5L1Byb2R1Y3RzL0JpYmxpb0tpdCUyMExhdW5jaC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcbiBcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgXG4gICAge1xuICAgICAgbmFtZTogJ2h0bWwtY2FjaGUtYnVzdCcsXG4gICAgICB0cmFuc2Zvcm1JbmRleEh0bWwoaHRtbCkge1xuICAgICAgICByZXR1cm4gaHRtbC5yZXBsYWNlKFxuICAgICAgICAgICcvc3JjL21haW4udHN4JyxcbiAgICAgICAgICBgL3NyYy9tYWluLnRzeD9idXN0PSR7RGF0ZS5ub3coKX1gXG4gICAgICAgICk7XG4gICAgICB9LFxuICAgIH0sXG4gIF0sXG4gIHJlc29sdmU6IHtcbiAgICBkZWR1cGU6IFtcInJlYWN0XCIsIFwicmVhY3QtZG9tXCJdLFxuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgICAvLyBIYXJkLWRlZHVwZSBSZWFjdCB0byBhdm9pZCBtdWx0aXBsZSBjb3BpZXMgY2F1c2luZyBpbnZhbGlkIGhvb2sgY2FsbHMgKCMzMjEpXG4gICAgICByZWFjdDogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9ub2RlX21vZHVsZXMvcmVhY3RcIiksXG4gICAgICBcInJlYWN0LWRvbVwiOiByZXNvbHZlKF9fZGlybmFtZSwgXCIuL25vZGVfbW9kdWxlcy9yZWFjdC1kb21cIiksXG4gICAgICBcInJlYWN0L2pzeC1ydW50aW1lXCI6IHJlc29sdmUoX19kaXJuYW1lLCBcIi4vbm9kZV9tb2R1bGVzL3JlYWN0L2pzeC1ydW50aW1lXCIpLFxuICAgICAgXCJyZWFjdC9qc3gtZGV2LXJ1bnRpbWVcIjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9ub2RlX21vZHVsZXMvcmVhY3QvanN4LWRldi1ydW50aW1lXCIpLFxuICAgIH0sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFtcInJlYWN0XCIsIFwicmVhY3QtZG9tXCJdLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiAnMC4wLjAuMCcsXG4gICAgcG9ydDogOTk5MCxcbiAgICBzdHJpY3RQb3J0OiB0cnVlLFxuICB9LFxuICBidWlsZDoge1xuICAgIG91dERpcjogJ2Rpc3QnLFxuICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICBtYW5pZmVzdDogdHJ1ZSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBpbnB1dDogJy4vaW5kZXguaHRtbCdcbiAgICB9XG4gIH0sXG4gIGRlZmluZToge1xuICAgIC8vIEFkZCB0aW1lc3RhbXAgdG8gZm9yY2UgY2FjaGUgYnVzdGluZ1xuICAgIF9fQ0FDSEVfQlVTVF9fOiBKU09OLnN0cmluZ2lmeShEYXRlLm5vdygpKSxcbiAgfSxcbiAgc3NyOiB7XG4gICAgLy8gRG9uJ3QgZXh0ZXJuYWxpemUgZGVwZW5kZW5jaWVzIGZvciBiZXR0ZXIgRWRnZSBGdW5jdGlvbiBjb21wYXRpYmlsaXR5XG4gICAgbm9FeHRlcm5hbDogW1xuICAgICAgJ3JlYWN0JyxcbiAgICAgICdyZWFjdC1kb20nLFxuICAgICAgJ3dvdXRlcicsXG4gICAgICAnd291dGVyL3N0YXRpYy1sb2NhdGlvbicsXG4gICAgICAnY2xzeCcsXG4gICAgICAnbHVjaWRlLXJlYWN0JyxcbiAgICAgICdmcmFtZXItbW90aW9uJyxcbiAgICAgICd0YWlsd2luZC1tZXJnZScsXG4gICAgICAnY2FudmFzLWNvbmZldHRpJyxcbiAgICAgIC8vIEVuc3VyZSBEZW5vLWNvbXBhdGlibGUgU1NSIGJ1bmRsZSBieSBpbmNsdWRpbmcgdGhlc2UgcGFja2FnZXNcbiAgICAgICd1c2Utc3luYy1leHRlcm5hbC1zdG9yZScsXG4gICAgICAndXNlLXN5bmMtZXh0ZXJuYWwtc3RvcmUvc2hpbSdcbiAgICBdXG4gIH1cbn0pIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzUyxTQUFTLG9CQUFvQjtBQUNuVSxPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBRnhCLElBQU0sbUNBQW1DO0FBS3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUVOO0FBQUEsTUFDRSxNQUFNO0FBQUEsTUFDTixtQkFBbUIsTUFBTTtBQUN2QixlQUFPLEtBQUs7QUFBQSxVQUNWO0FBQUEsVUFDQSxzQkFBc0IsS0FBSyxJQUFJLENBQUM7QUFBQSxRQUNsQztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsUUFBUSxDQUFDLFNBQVMsV0FBVztBQUFBLElBQzdCLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUE7QUFBQSxNQUUvQixPQUFPLFFBQVEsa0NBQVcsc0JBQXNCO0FBQUEsTUFDaEQsYUFBYSxRQUFRLGtDQUFXLDBCQUEwQjtBQUFBLE1BQzFELHFCQUFxQixRQUFRLGtDQUFXLGtDQUFrQztBQUFBLE1BQzFFLHlCQUF5QixRQUFRLGtDQUFXLHNDQUFzQztBQUFBLElBQ3BGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLFNBQVMsV0FBVztBQUFBLEVBQ2hDO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsRUFDZDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLElBQ1gsVUFBVTtBQUFBLElBQ1YsZUFBZTtBQUFBLE1BQ2IsT0FBTztBQUFBLElBQ1Q7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUE7QUFBQSxJQUVOLGdCQUFnQixLQUFLLFVBQVUsS0FBSyxJQUFJLENBQUM7QUFBQSxFQUMzQztBQUFBLEVBQ0EsS0FBSztBQUFBO0FBQUEsSUFFSCxZQUFZO0FBQUEsTUFDVjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUE7QUFBQSxNQUVBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
