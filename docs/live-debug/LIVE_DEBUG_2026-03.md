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
