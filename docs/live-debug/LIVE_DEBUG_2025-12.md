# Live Debug Log — 2025-12

## 2025-12-09

- **Time:** 2025-12-09 21:33 EST
- **Summary:** Fixed blog SSR metadata so each article serves its own title, description, hero image, and dates to crawlers instead of the generic blog defaults—improving search snippets and click-through.
- **Root Cause:** `generateMetadata` only received the CMS product payload during SSR; blog routes had no per-post lookup, so they inherited the `/blog` metadata and shipped bland previews despite rich on-page content.
- **Changed Files:** src/lib/seo.ts
- **Verification:** npm run build:server; spot-check `/blog/mastering-figma-auto-layout-wrap` and `/blog/fix-detached-instances-figma` for article-specific `<title>`, meta description, OG/Twitter images matching the hero art, canonical URLs with no trailing slash, and JSON-LD Article nodes carrying datePublished/dateModified.
