# Live Debug Log — 2026-03

## 2026-03-05

- **Time:** 2026-03-05 18:11 EST
- **Summary:** Updated SEO metadata defaults and key route metadata to match current strategy (Workflow Automation homepage, BiblioRename, BiblioStart), removed unverified homepage `aggregateRating` schema, and stopped server-side title/description ellipsis truncation.
- **Root Cause:** `generateMetadata` clamped title/description strings with `…`, key route metadata had stale naming/targeting drift from current SEO rules, and homepage structured data included hardcoded rating values without verified source data.
- **Changed Files:** src/lib/seo.ts; docs/live-debug/LIVE_DEBUG_2026-03.md
- **Verification:** `npm run build:server` (pass); `npm run build:client` (pass); `node --loader ./tests/support/esbuild-loader.mjs --test tests/unit/sitemap.spec.ts tests/unit/seoClientNavigation.spec.ts tests/unit/updatePageMetadataStructuredData.spec.ts` (pass); `node --input-type=module -e "...generateMetadata sweep..."` (local output confirms no ellipsis and no `aggregateRating` in structured data for checked routes).

- **Time:** 2026-03-05 02:55 EST
- **Summary:** Updated the blog page featured post card to show two paragraphs of post content preview instead of a single excerpt line.
- **Root Cause:** Featured post preview rendered only one excerpt paragraph, which did not satisfy the requirement to show at least two content paragraphs from the post.
- **Changed Files:** src/components/BlogPage.tsx; docs/live-debug/LIVE_DEBUG_2026-03.md
- **Verification:** `npm run build:client` (pass).

- **Time:** 2026-03-05 02:53 EST
- **Summary:** Removed the “Latest Post” badge from the blog page featured article hero card.
- **Root Cause:** The featured-card badge added extra UI noise above the primary blog hero content and was explicitly requested to be removed.
- **Changed Files:** src/components/BlogPage.tsx; docs/live-debug/LIVE_DEBUG_2026-03.md
- **Verification:** `npm run build:client` (pass).

- **Time:** 2026-03-05 02:48 EST
- **Summary:** Applied a global blog hero copy-balance/alignment fix across all article pages and hardened first in-article image priority attributes for production SSR output.
- **Root Cause:** Blog article heroes reused shared landing hero styles with no blog-specific description balancing/line-length controls, and the first image priority attribute needed lowercase passthrough (`fetchpriority`) to avoid React DOM attribute warnings in SSR paths.
- **Changed Files:** src/components/BlogArticlePage.tsx; src/index.css; docs/live-debug/LIVE_DEBUG_2026-03.md
- **Verification:** `npm run build` (pass); `node --input-type=module -e "...renderToString blog slug sweep..."` (15/15 blog posts render with `h1Count:1`, no `"Loading page..."` fallback); `npm run test:unit` (fails in pre-existing `client/src/__tests__/unit/ProductContentSections.spec.tsx` `sectionsOrder` expectation for `faqs`, unrelated to blog hero changes).

- **Time:** 2026-03-05 01:09 EST
- **Summary:** Added canonical redirects and internal-link cleanup for legacy RenameVariantsAI URL variants to prevent duplicate indexable paths.
- **Root Cause:** The legacy path `/figma-ai-rename-variants` was discoverable via internal blog content and not explicitly redirected in SSR/public redirects, creating a duplicate indexable URL in SEO crawls.
- **Changed Files:** netlify/edge-functions/ssr.ts; public/_redirects; src/data/blogPosts.ts; docs/live-debug/LIVE_DEBUG_2026-03.md
- **Verification:** `npm run build:server` (pass); `npm run build:client` (pass); confirmed SSR redirect rule now includes `/figma-ai-rename-variants` and internal blog link points to `/figma-component-variant-renamer`.

- **Time:** 2026-03-05 01:08 EST
- **Summary:** Fixed missing `<h1>` in production SSR for most routes by removing route-level `React.lazy`/`Suspense` fallback rendering in the main app router.
- **Root Cause:** `renderToString` cannot resolve `React.lazy` route modules server-side, so SSR emitted the fallback `"Loading page..."` markup for lazy routes, causing crawlers to record `H1=0` on key pages.
- **Changed Files:** src/App.tsx; docs/live-debug/LIVE_DEBUG_2026-03.md
- **Verification:** `npm run build:server` (pass); `npm run build:client` (pass); `node --input-type=module -e "import { renderToString, fetchContentData } from './dist/server/entry-server.js'; ..."` (confirmed `/figma-design-system-audit-plugin`, `/learn`, `/about`, `/products`, `/blog` all return SSR HTML with `h1Count:1` and no `"Loading page..."` fallback)

- **Time:** 2026-03-05 01:02 EST
- **Summary:** Removed the default disabled state from the waitlist primary CTA so the button remains active before email input.
- **Root Cause:** Waitlist submit button used `disabled={state.isLoading || !state.email.trim()}`, which rendered the primary CTA in a disabled state on initial load.
- **Changed Files:** src/components/Waitlist.tsx; docs/live-debug/LIVE_DEBUG_2026-03.md
- **Verification:** Confirmed button prop is now `disabled={state.isLoading}` in `src/components/Waitlist.tsx`; `node --test src/__tests__/ui/waitlist.markup.test.mjs` (fails for pre-existing scoped alert class expectation unrelated to button disabled logic).

- **Time:** 2026-03-05 00:55 EST
- **Summary:** Resolved foundation config drift by standardizing dev port `9990`, consolidated base URL resolution into shared URL utilities, hardened debug logging defaults for production/SSR, added Coming Soon fallback copy safeguards, and removed redundant Tailwind font aliases.
- **Root Cause:** Multiple files still referenced legacy port `53173`, URL normalization logic was duplicated across SEO/server/functions, debug logging defaulted to enabled in non-browser contexts, coming-soon waitlist overrides could fall back to empty strings, and unused duplicate font aliases remained in theme config.
- **Changed Files:** vite.config.ts; package.json; netlify.toml; scripts/dev-full.sh; scripts/dev-monitor.sh; scripts/kill-dev-ports.sh; netlify/functions/utils.ts; src/lib/urlUtils.ts; src/lib/seo.ts; src/entry-server.tsx; netlify/functions/sitemap.ts; netlify/functions/indexnow.ts; netlify/edge-functions/bot-detection.ts; src/App.tsx; src/lib/debugService.ts; src/components/ComingSoon.tsx; tailwind.config.js; README.md; src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2026-03.md
- **Verification:** `npm run test:env` (pass); `npm run build:client` (pass); `npm run build:server` (pass); `node --loader ./tests/support/esbuild-loader.mjs --test tests/unit/sitemap.spec.ts tests/unit/seoClientNavigation.spec.ts tests/unit/updatePageMetadataStructuredData.spec.ts` (pass); `npm run test:unit` (fails in pre-existing client contract expectation: `client/src/__tests__/unit/ProductContentSections.spec.tsx` expects `faqs` in `sectionsOrder` snapshot)

- **Time:** 2026-03-05 00:35 EST
- **Summary:** Fixed blog post hero layout by widening hero content on small/medium breakpoints and removed the avatar strip above the hero badge for blog article heroes.
- **Root Cause:** Blog article pages reused `LandingHero` with a hardcoded avatar strip and a narrow fixed content width (`max-w-[70%]`) that made headings feel cramped and visually noisy in compact hero mode.
- **Changed Files:** src/components/LandingHero.tsx; src/components/BlogArticlePage.tsx; docs/live-debug/LIVE_DEBUG_2026-03.md
- **Verification:** `npm run build:client` (pass)

## 2026-03-04

- **Time:** 2026-03-04 10:41 EST
- **Summary:** Balanced hero page titles by enabling browser text balancing on all hero-section H1s.
- **Root Cause:** Hero page titles relied on default wrapping, which produced uneven line breaks on long headlines across breakpoints.
- **Changed Files:** src/index.css; docs/live-debug/LIVE_DEBUG_2026-03.md
- **Verification:** `npm run build:client` (pass)

- **Time:** 2026-03-04 10:44 EST
- **Summary:** Increased hero description copy line-height using a shared hero description utility, then applied it across landing/product/blog-learn hero descriptions.
- **Root Cause:** Hero description paragraphs used mixed or default line-height values, which made longer copy blocks feel dense in multiple hero layouts.
- **Changed Files:** src/index.css; src/components/LandingHero.tsx; src/components/Hero.tsx; src/components/ProductHero.tsx; src/components/AIRenameVariantsPage.tsx; src/components/BiblioCleanPage.tsx; src/components/ComponentQAPage.tsx; src/components/FixTablePage.tsx; src/components/OrganizeFilePage.tsx; src/components/ScaleResizerPage.tsx; src/components/StateBuilderPage.tsx; src/components/AboutPage.tsx; src/components/LearnPage.tsx; src/components/TutorialsPage.tsx; src/components/DesignOpsFundamentalsPage.tsx; src/components/BlogPage.tsx; docs/live-debug/LIVE_DEBUG_2026-03.md
- **Verification:** `npm run build:client` (pass)

- **Time:** 2026-03-04 21:29 EST
- **Summary:** Added DevTools overlays for page grid visualization and live spacing guides between hovered elements and their parent containers.
- **Root Cause:** Existing DevTools only supported color pick + inspector metadata, so layout debugging lacked an on-page grid reference and direct spacing visualization.
- **Changed Files:** src/components/DevTools.tsx; docs/live-debug/LIVE_DEBUG_2026-03.md
- **Verification:** `npm run build:client` (pass)

- **Time:** 2026-03-04 21:33 EST
- **Summary:** Added a standalone badge preview page that shows the current badge styling and all component variants/sizes in dark and light contexts.
- **Root Cause:** We needed a single isolated surface to review badge visuals quickly without navigating through multiple product pages.
- **Changed Files:** public/badge-variants.html; docs/live-debug/LIVE_DEBUG_2026-03.md
- **Verification:** `npm run build:client` (pass)

- **Time:** 2026-03-04 21:36 EST
- **Summary:** Corrected the badge preview to reflect consolidated component usage and icon-led status chips (Sparkles/Clock/Zap), and added a dedicated unit test to prevent preview drift.
- **Root Cause:** The first static preview used generic dot icons and did not explicitly mirror current status badge icon patterns from `Features.tsx` after consolidation.
- **Changed Files:** public/badge-variants.html; tests/unit/badgeVariantsPreview.spec.ts; docs/live-debug/LIVE_DEBUG_2026-03.md
- **Verification:** `node --test tests/unit/badgeVariantsPreview.spec.ts` (pass); `npm run build:client` (pass)

- **Time:** 2026-03-04 21:37 EST
- **Summary:** Added badge preview contract fixtures/tests to lock status-to-icon mappings and prevent future regressions to non-icon status treatments.
- **Root Cause:** Unit coverage validated presence only; we also needed a boundary contract that asserts canonical status/icon pairs and rejects known bad mappings.
- **Changed Files:** tests/contract/fixtures/badge-preview.contract.json; tests/contract/badgePreview.contract.spec.ts; docs/live-debug/LIVE_DEBUG_2026-03.md
- **Verification:** `node --test tests/unit/badgeVariantsPreview.spec.ts tests/contract/badgePreview.contract.spec.ts` (pass); `npm run build:client` (pass)

- **Time:** 2026-03-04 18:43 EST
- **Summary:** Logged a failing design-system characterization test that still expects legacy palette token names.
- **Root Cause:** `src/__tests__/ui/design-system.characterization.test.mjs` asserts `pink-500`/`blue-500`/`green-500`, but the current design-system data and labels use updated names like `brand-500` and gradient IDs.
- **Changed Files:** docs/live-debug/LIVE_DEBUG_2026-03.md
- **Verification:** `node --test src/__tests__/ui/design-system.characterization.test.mjs tests/contract/design-system/modalShowcases.contract.test.mjs` (fails: `core palette tokens remain available`, expected `pink-500` token)

- **Time:** 2026-03-04 19:26 EST
- **Summary:** Standardized theme initialization, replaced shared hardcoded color literals with semantic tokens in core primitives/product surfaces, synced design-system docs/data/tests, and added a token-lint guard script.
- **Root Cause:** Theme mode was forced to dark at startup, shared primitives/design-system data still mixed token and hex styles, and characterization tests/docs had drifted from current token names and usage.
- **Changed Files:** index.html; src/entry-client.tsx; src/index.css; src/components/ui/button.tsx; src/components/ui/input.tsx; src/components/ui/badge.tsx; src/lib/renderTextWithLinks.tsx; src/components/AIRenameVariantsPage.tsx; src/components/BiblioCleanPage.tsx; src/components/ComponentQAPage.tsx; src/components/FixTablePage.tsx; src/components/OrganizeFilePage.tsx; src/components/StateBuilderPage.tsx; src/components/design-system/data/colors.ts; src/components/design-system/data/forms.tsx; src/components/design-system/data/modals.tsx; src/components/design-system/ColorSection.tsx; src/components/DesignSystemDemo.tsx; src/__tests__/ui/design-system.characterization.test.mjs; scripts/check-design-token-literals.cjs; package.json; DESIGN_SYSTEM.md; docs/live-debug/LIVE_DEBUG_2026-03.md
- **Verification:** `npm run lint:tokens` (pass); `node --test src/__tests__/ui/design-system.characterization.test.mjs tests/contract/design-system/modalShowcases.contract.test.mjs` (pass); `npm run build:client` (pass)

- **Time:** 2026-03-04 19:34 EST
- **Summary:** Expanded token-lint coverage from a small shared-file set to product/marketing components, then removed remaining hex literals in that scope so the stricter guard passes.
- **Root Cause:** The original guard only covered six shared files, which allowed hardcoded hex colors to persist across marketing/product components without detection.
- **Changed Files:** scripts/check-design-token-literals.cjs; src/components/heroTitleGradient.tsx; src/components/BlogPage.tsx; src/components/TutorialsPage.tsx; src/components/LearnPage.tsx; src/components/DesignOpsFundamentalsPage.tsx; src/components/BlogArticlePage.tsx; src/components/ProductsPage.tsx; src/components/ResourcesPage.tsx; src/components/ExpertQuote.tsx; src/components/StatBox.tsx; src/components/ProductContentSections.tsx; src/components/LandingHero.tsx; src/components/Hero.tsx; src/components/Features.tsx; src/components/AIRenameVariantsPage.tsx; src/components/ProductFeaturesSection.tsx; src/components/RemovePrototypeLinkPage.tsx; src/components/ProductFeatureMedia.tsx; docs/live-debug/LIVE_DEBUG_2026-03.md
- **Verification:** `npm run lint:tokens` (pass, 75 files scanned); `node --test src/__tests__/ui/design-system.characterization.test.mjs tests/contract/design-system/modalShowcases.contract.test.mjs` (pass); `npm run build:client` (pass)

- **Time:** 2026-03-04 19:39 EST
- **Summary:** Fixed consolidated landing accent drift by making section badges and use-case step circles render pink in landing showcase mode.
- **Root Cause:** `ProductContentSections` still hardcoded dark/light badge variants and purple step circles, so consolidated landing sections showed non-pink accents (for example, the "Our Products" badge).
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2026-03.md
- **Verification:** `npm run lint:tokens` (pass); `npm run build:client` (pass)

- **Time:** 2026-03-04 19:44 EST
- **Summary:** Completed a full-repo consolidated accent pass by converting shared landing feature-card color themes and fallback media glows to pink-token accents.
- **Root Cause:** Shared landing assets (`ProductFeaturesSection` and `ProductFeatureMedia`) still used legacy multi-color accents (blue/teal/indigo/violet/cyan), causing consolidated surfaces to drift from the pink visual system.
- **Changed Files:** src/components/ProductFeaturesSection.tsx; src/components/ProductFeatureMedia.tsx; docs/live-debug/LIVE_DEBUG_2026-03.md
- **Verification:** `npm run lint:tokens` (pass); `npm run build:client` (pass)

- **Time:** 2026-03-04 21:08 EST
- **Summary:** Restored per-product landing card accent colors/icons and fixed status-chip behavior so `Launched` badges remain explicitly green.
- **Root Cause:** The prior consolidation pass over-flattened `ProductFeaturesSection` card accents to pink, removing per-product differentiation and overriding status badge semantics.
- **Changed Files:** src/components/ProductFeaturesSection.tsx; docs/live-debug/LIVE_DEBUG_2026-03.md
- **Verification:** `npm run lint:tokens` (pass); `npm run build:client` (pass)
