# Live Debug Log — 2025-12

## 2025-12-09

- **Time:** 2025-12-09 21:33 EST
- **Summary:** Fixed blog SSR metadata so each article serves its own title, description, hero image, and dates to crawlers instead of the generic blog defaults—improving search snippets and click-through.
- **Root Cause:** `generateMetadata` only received the CMS product payload during SSR; blog routes had no per-post lookup, so they inherited the `/blog` metadata and shipped bland previews despite rich on-page content.
- **Changed Files:** src/lib/seo.ts
- **Verification:** npm run build:server; spot-check `/blog/mastering-figma-auto-layout-wrap` and `/blog/fix-detached-instances-figma` for article-specific `<title>`, meta description, OG/Twitter images matching the hero art, canonical URLs with no trailing slash, and JSON-LD Article nodes carrying datePublished/dateModified.

## 2025-12-10

- **Time:** 2025-12-10 01:01 EST
- **Summary:** Restored broken landing and blog images by allowing `public/` assets into the build and adding guardrails. Added DEBUG_FIX logging for feature media to surface missing files during debugging.
- **Root Cause:** `.gitignore` excluded the entire `public/` directory, so most `/media`, `/clients`, and blog asset files never reached Netlify and were rewritten to HTML, producing broken images.
- **Changed Files:** .gitignore; src/components/ProductContentSections.tsx; tests/unit/staticAssetsTracking.spec.ts
- **Verification:** node --test tests/unit/staticAssetsTracking.spec.ts; node --test tests/unit/blogImages.spec.ts; curl -I https://www.bibliokit.com/media/BiblioStart.png (returned HTML before fix, indicating missing asset).
