# Live Debug Log — 2026-03

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
