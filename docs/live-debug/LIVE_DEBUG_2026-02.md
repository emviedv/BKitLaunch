# Live Debug Log — 2026-02

## 2026-02-05

- **Time:** 2026-02-05 (URL normalization refactor)
- **Summary:** Consolidated four separate URL normalization functions into a single shared utility to prevent future www/non-www mismatches.
- **Root Cause:** The January 2026 canonical fix (2026-01-25) updated `seo.ts`, `entry-server.tsx`, and `useSEO.ts` but missed `sitemap.ts`, which still had its own `normalizeBase()` function. Code duplication meant fixes in one place didn't propagate to others.
- **Changed Files:** src/lib/urlUtils.ts (new); src/lib/seo.ts; src/entry-server.tsx; src/hooks/useSEO.ts; netlify/functions/sitemap.ts; tests/unit/sitemap.spec.ts; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** All unit tests pass. Build succeeds.

- **Time:** 2026-02-05 (sitemap canonical URL fix)
- **Summary:** Fixed sitemap generating non-www URLs while canonical tags used www, causing 30 "Non-canonical URL" errors in Google Search Console.
- **Root Cause:** The `normalizeBase()` function in `sitemap.ts` returned `url.origin` directly from environment variables (often `https://bibliokit.com` without www), while `normalizeCanonicalBaseUrl()` in `seo.ts` always normalized to `https://www.bibliokit.com`. This mismatch meant sitemap URLs didn't match the declared canonical URLs on pages.
- **Changed Files:** netlify/functions/sitemap.ts; tests/unit/sitemap.spec.ts; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** Unit tests pass. Deploy to production and resubmit sitemap in GSC to verify all 30 errors resolve.
