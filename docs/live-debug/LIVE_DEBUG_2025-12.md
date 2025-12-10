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

## 2025-12-10

- **Time:** 2025-12-10 01:43 EST
- **Summary:** Shortened bare URL link labels in blog summaries/related cards so URLs render as concise hyperlinks instead of full strings; added reusable label formatter and tests.
- **Root Cause:** Plain URLs in excerpts were rendered verbatim; `renderTextWithLinks` lacked a compact display label for non-markdown URLs.
- **Changed Files:** src/lib/renderTextWithLinks.tsx; src/lib/linkLabel.ts; tests/unit/linkLabel.spec.ts; netlify.toml (edge function path for CLI deploy).
- **Verification:** node --test tests/unit/linkLabel.spec.ts; visual check expected to show compact host-based link text instead of long URLs in blog related/next sections.

## 2025-12-10

- **Time:** 2025-12-10 02:13 EST
- **Summary:** Sanitized markdown URLs with stray whitespace (e.g., `https: //...`) so blog copy renders clean hyperlink labels in steps and lists.
- **Root Cause:** `renderTextWithLinks` consumed the raw markdown target; whitespace inside URLs bypassed detection and rendered as literal strings.
- **Changed Files:** src/lib/renderTextWithLinks.tsx; src/lib/linkLabel.ts; tests/unit/linkLabel.spec.ts
- **Verification:** node --test tests/unit/linkLabel.spec.ts; deployed via Netlify (see deploy message: "Force compact link labels for bare URLs").

## 2025-12-10

- **Time:** 2025-12-10 02:18 EST
- **Summary:** Prevented blog ordered-list labels from swallowing markdown links so step 1 renders the BiblioClean hyperlink correctly.
- **Root Cause:** The lead/colon detector matched the `https:` in the markdown URL, splitting the string before `renderTextWithLinks` could convert it to an anchor, leaving raw `[BiblioClean](...)` text.
- **Changed Files:** src/components/BlogArticlePage.tsx
- **Verification:** node -e test confirming the new `^\\s*([^:]+):\\s+(.*)$` pattern matches "Select Scope: …" but not "Install [BiblioClean](https://…)", so markdown links now render.

## 2025-12-10

- **Time:** 2025-12-10 02:39 EST
- **Summary:** Fixed SPA navigation SEO drift by centralizing client metadata updates, aligning baseUrl with the active host, and purging stale SSR JSON-LD before injecting new scripts.
- **Root Cause:** Only Home/Docs mounted the SEO hook; other routes like `/blog` and `/resources/remove-prototype-link` kept the prior page’s head tags, and client updates always fell back to `https://www.bibliokit.com`, diverging from preview hosts. JSON-LD from SSR wasn’t removed on client navigations, leaving mixed graphs.
- **Changed Files:** src/hooks/useSEO.ts; src/App.tsx; src/components/Docs.tsx; src/lib/seo.ts; tests/unit/seoClientNavigation.spec.ts
- **Verification:** `node --loader ./tests/support/esbuild-loader.mjs --test tests/unit/seoClientNavigation.spec.ts` (passes; confirms canonical/title and JSON-LD swap on SPA nav).

## 2025-12-10

- **Time:** 2025-12-10 04:15 EST
- **Summary:** Corrected blog index heading hierarchy so the page owns the H1 and the featured article uses an H2, improving accessibility and SEO clarity.
- **Root Cause:** The blog listing used the featured article title as the H1, leaving the page without a page-level heading and over-weighting a single post.
- **Changed Files:** src/components/BlogPage.tsx
- **Verification:** Manual review of rendered markup/headings; single H1 now reads “BiblioKit Blog | Design Ops Playbooks” with the featured article demoted to H2.
