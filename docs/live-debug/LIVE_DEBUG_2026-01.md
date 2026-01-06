# Live Debug Log — 2026-01

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
