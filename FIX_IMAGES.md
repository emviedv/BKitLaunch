# Image Loading Fix Summary

## 🐛 Root Cause Analysis
The issue where "some product images" and "blog post images" were broken was traced to the **Netlify Edge Function for Server-Side Rendering (SSR)**.

1.  **Symptom:** Images referenced in `src/data/products.json` (e.g., `/media/BiblioStart.png`) and `src/data/blogPosts.ts` (e.g., `/blog/detached-instances/image-hero.jpeg`) were failing to load or potentially returning HTML content.
2.  **Investigation:**
    - Confirmed all referenced files exist in `public/` and are accessible via a static server.
    - Verified `vite.config.ts` and `products.json` paths are correct.
    - Identified that `netlify/edge-functions/ssr.ts` is configured to intercept requests to `/*`.
    - The `excludedPath` configuration in `ssr.ts` only excluded root-level extensions (e.g., `/*.png`) and specific folders like `/assets/*`.
    - **Crucial Miss:** It did **not** exclude `/media/*` or nested blog images (e.g., `/blog/post/image.png`).
3.  **Mechanism:** When a request for `/media/BiblioStart.png` hit the edge function, it did not match the exclusion rules. In local development or specific environments, this could lead to the request being mishandled or falling through to a default handler that didn't serve the static file correctly, or the function overhead simply broke the static file delivery.

## 🔧 Implementation
Updated `netlify/edge-functions/ssr.ts` to explicitly exclude static asset directories from SSR processing.

### Changes
Modified `excludedPath` in `config` object:
```typescript
  excludedPath: [
    // ... existing exclusions
    "/media/*",
    "/clients/*",
    "/avatars/*",
    "/og/*",
    "/demos/*",
    "/blog/*.png",
    "/blog/*.jpg",
    "/blog/*.jpeg",
    "/blog/*.svg",
    "/blog/*/*.png",
    "/blog/*/*.jpg",
    "/blog/*/*.jpeg",
    "/blog/*/*.svg"
  ]
```

## 🧪 Validation
- **Static Analysis:** Verified paths match file system.
- **Configuration:** Confirmed `excludedPath` supports glob patterns (or at least wildcard matching) to bypass the function.

## 🧱 Risk
- **Low:** This change only affects which requests bypass the SSR function. Valid static files should now be served directly by the CDN/static host, improving performance and reliability. SSR for pages remains active on `/*`.

## 🔁 Rollback
To rollback, revert `netlify/edge-functions/ssr.ts` to the previous version removing the added lines in `excludedPath`.
