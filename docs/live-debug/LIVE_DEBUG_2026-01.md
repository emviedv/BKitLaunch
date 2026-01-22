# Live Debug Log — 2026-01

## 2026-01-22

- **Time:** 2026-01-22 06:15 EST
- **Summary:** Added trailing-slash redirects in the SSR edge function to enforce non-trailing canonical URLs for blog/resources pages.
- **Root Cause:** `/blog/` and `/resources/` returned 200 alongside `/blog` and `/resources`, creating duplicate canonical warnings in Search Console.
- **Changed Files:** docs/live-debug/LIVE_DEBUG_2026-01.md; netlify/edge-functions/ssr.ts
- **Verification:** `curl -I https://bibliokit.com/blog/` and `/resources/` now return 301 to the non-trailing URLs after deploy.

- **Time:** 2026-01-22 05:50 EST
- **Summary:** Restored Google Search Console domain verification by adding the missing TXT record to Netlify DNS for bibliokit.com.
- **Root Cause:** The `google-site-verification` TXT record was removed, leaving only SPF/DMARC TXT entries, so GSC could no longer verify the domain.
- **Changed Files:** docs/live-debug/LIVE_DEBUG_2026-01.md; Netlify DNS zone `bibliokit.com`
- **Verification:** `netlify api getDnsRecords` shows TXT record `google-site-verification=uFHaAsAFus7W7xsYYteeBcvTMU5ek3KYqfQ-UQ9moq0` for bibliokit.com.

- **Time:** 2026-01-22 00:11 EST
- **Summary:** Noted evergreen landing pages were showing updated dates in search snippets.
- **Root Cause:** Product landing UI rendered an "Updated" badge, giving search engines a byline date on non-blog pages.
- **Changed Files:** docs/live-debug/LIVE_DEBUG_2026-01.md
- **Verification:** Reviewed `src/components/ProductHero.tsx` and `src/components/RemovePrototypeLinkPage.tsx` for date badges.

- **Time:** 2026-01-22 00:18 EST
- **Summary:** Removed updated date badges from evergreen product/resource landing pages.
- **Root Cause:** Product and resource heroes surfaced dates intended for blog/guide posts only.
- **Changed Files:** docs/live-debug/LIVE_DEBUG_2026-01.md; src/components/ProductHero.tsx; src/components/RemovePrototypeLinkPage.tsx
- **Verification:** Not run (UI copy-only removal).

## 2026-01-21

- **Time:** 2026-01-21 11:24 EST
- **Summary:** Added the “Stop the Chaos” blog post with hero art and kept heading links clickable in the article body.
- **Root Cause:** New Google Doc post needed publishing, and heading text previously did not render Markdown links.
- **Changed Files:** docs/live-debug/LIVE_DEBUG_2026-01.md; src/data/blogPosts.ts; src/components/BlogArticlePage.tsx; src/lib/imageDimensions.ts; public/blog/best-figma-plugins-organize-design-files-2026/hero.png
- **Verification:** Not run (content update only).

- **Time:** 2026-01-21 05:30 EST
- **Summary:** Sorted Blog and Learn hub lists by newest `lastUpdated` so fresh posts lead the feed.
- **Root Cause:** Blog used the `BLOG_POSTS` array order and Learn hubs used fixed slug arrays without date sorting.
- **Changed Files:** docs/live-debug/LIVE_DEBUG_2026-01.md; src/components/BlogPage.tsx; src/components/LearnPage.tsx; src/components/DesignOpsFundamentalsPage.tsx
- **Verification:** Not run (ordering update only).

- **Time:** 2026-01-21 05:28 EST
- **Summary:** Found blog and Learn hub lists aren’t sorted by newest `lastUpdated`, so fresh posts can appear later in the feed.
- **Root Cause:** Blog uses `BLOG_POSTS` array order, and Learn/Design Ops hubs use fixed slug arrays without date sorting.
- **Changed Files:** docs/live-debug/LIVE_DEBUG_2026-01.md
- **Verification:** Reviewed `src/components/BlogPage.tsx`, `src/components/LearnPage.tsx`, `src/components/DesignOpsFundamentalsPage.tsx`, and `src/data/blogPosts.ts` ordering.

- **Time:** 2026-01-21 05:30 EST
- **Summary:** Sorted Tutorials hub posts by newest `lastUpdated` so fresh guides appear first.
- **Root Cause:** Tutorials hub used a fixed slug order, so new posts could render last.
- **Changed Files:** docs/live-debug/LIVE_DEBUG_2026-01.md; src/components/TutorialsPage.tsx
- **Verification:** Not run (ordering update only).

- **Time:** 2026-01-21 (SEO fix)
- **Summary:** Added `offers` field to SoftwareApplication schemas; added missing SEO metadata for ScaleResizer page to fix duplicate title tag issue.
- **Root Cause:** (1) SoftwareApplication schemas missing required `offers` field; (2) `/figma-marketing-resizer-plugin` had no SEO entry, falling back to homepage title.
- **Changed Files:** src/lib/seo.ts, src/lib/useSchema.ts
- **Verification:** Build passes. Deploy to production and re-validate in Search Console.

## 2026-01-13

- **Time:** 2026-01-13 08:08 EST
- **Summary:** Added SSR FAQ and breadcrumb structured data so Search Console can detect them on product and blog pages.
- **Root Cause:** FAQ JSON-LD was only injected client-side and breadcrumb output skipped the root path, so Search Console reported zero items.
- **Changed Files:** docs/live-debug/LIVE_DEBUG_2026-01.md; src/data/pageFaqs.ts; src/lib/seo.ts; src/components/AIRenameVariantsPage.tsx; src/components/BiblioCleanPage.tsx; src/components/BiblioTablePage.tsx; src/components/ComponentQAPage.tsx; src/components/OrganizeFilePage.tsx; src/components/ScaleResizerPage.tsx; src/components/StateBuilderPage.tsx
- **Verification:** Not run (SEO metadata update only).

## 2026-01-05

- **Time:** 2026-01-05 15:40 EST
- **Summary:** Removed cross-product CTA helper lines from product page CTA sections to keep each page focused on its own plugin.
- **Root Cause:** CTA sections on BiblioAudit and BiblioClean included secondary copy linking to other products.
- **Changed Files:** docs/live-debug/LIVE_DEBUG_2026-01.md; src/components/BiblioAuditPage.tsx; src/components/BiblioCleanPage.tsx
- **Verification:** Not run (copy-only removal).

## 2026-01-02

- **Time:** 2026-01-02 04:56 EST
- **Summary:** Removed the background from the "Trusted by designers" callout, constrained the intersecting line to the box edges, and tightened the features description copy to focus on renaming speed.
- **Root Cause:** The trust callout still included a background layer and a full-width line that exceeded the container, and the description listed extra benefits beyond the requested focus.
- **Changed Files:** docs/live-debug/LIVE_DEBUG_2026-01.md; src/components/ProductContentSections.tsx; src/data/products.json
- **Verification:** Not run (UI update only).
