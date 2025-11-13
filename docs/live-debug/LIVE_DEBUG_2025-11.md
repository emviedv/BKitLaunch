# Live Debug Log — 2025-11

## 2025-11-11

- **Time:** 2025-11-11 18:40 EST
- **Summary:** Limited the landing hero gradient’s parallax shift so the background stays soft instead of hardening after a short scroll.
- **Root Cause:** The scroll offset allowed the gradient layer to travel ~45% of the hero height (hundreds of pixels), which pushed the glow completely above the card and exposed the flat base background, producing the “hardened” look.
- **Changed Files:** src/components/LandingHero.tsx
- **Verification:** *(not run; requires manual scroll test in browser)*

- **Time:** 2025-11-11 19:47 EST
- **Summary:** Recreated the landing hero gradient to match the soft multicolor glow reference, layering warm rose, midnight indigo, yellow flare, and cyan wash radials over a deep linear base.
- **Root Cause:** The previous gradient still showed grid lines and hard color bands that didn’t resemble the provided hero background reference.
- **Changed Files:** src/index.css
- **Verification:** *(not run; needs visual comparison in browser)*

- **Time:** 2025-11-12 00:53 EST
- **Summary:** Swapped the landing hero background to an off-white canvas with fine graphite grid lines and layered paper noise to match the new reference.
- **Root Cause:** Emily requested the hero to mirror the light grid card instead of the vibrant gradient version.
- **Changed Files:** src/index.css
- **Verification:** *(not run; requires in-browser visual inspection)*

- **Time:** 2025-11-12 08:41 EST
- **Summary:** Increased the hero grid contrast with red stroke lines and a rosy base tint so the pattern is immediately visible, matching Emily’s request for a red treatment.
- **Root Cause:** Earlier iteration kept the graphite grid too subtle, so the hero read as a flat off-white card instead of showing the desired red grid.
- **Changed Files:** src/index.css
- **Verification:** *(not run; needs browser visual check)*

- **Time:** 2025-11-12 08:43 EST
- **Summary:** Removed the “Built by designers for designers.” hero badge so the pill disappears from the landing hero.
- **Root Cause:** The badge text still shipped in the bundled content, so the UI continued rendering the pill even though Emily asked for it to be removed.
- **Changed Files:** src/data/products.json
- **Verification:** *(not run; confirm visually that the hero badge no longer renders)*

- **Time:** 2025-11-12 08:52 EST
- **Summary:** Extended the landing hero by 220px, enlarged the gradient layer, and added a multiply overlay so the white headline hits AAA contrast against the new red grid background.
- **Root Cause:** The shorter hero clipped the grid glow and the pale background failed contrast requirements, making the headline hard to read.
- **Changed Files:** src/components/LandingHero.tsx; src/index.css
- **Verification:** *(not run; manually verify hero height + contrast in browser with accessibility tools)*

- **Time:** 2025-11-12 22:45 EST
- **Summary:** Trimmed 100px from the landing hero by tightening padding, min-height, and gradient layer sizing so the fold breathes without losing the extended grid visuals.
- **Root Cause:** The prior +220px adjustment overshot the desired hero height, leaving too much vertical space above the fold.
- **Changed Files:** src/index.css
- **Verification:** *(not run; confirm hero height visually in browser)*

- **Time:** 2025-11-12 22:46 EST
- **Summary:** Stretched the hero gradient and noise layers to anchor to both the top and bottom offsets so they always cover the full hero height.
- **Root Cause:** Fixed-height layers stopped short when the hero resized, leaving exposed background bands near the CTAs.
- **Changed Files:** src/index.css
- **Verification:** *(not run; verify the gradient spans the entire hero in browser)*

- **Time:** 2025-11-12 22:46 EST
- **Summary:** Removed the “Join Designers shipping faster with BiblioKit” CTA panel from the landing page per request.
- **Root Cause:** The extra CTA section persisted even though Emily asked for it to be removed, leaving redundant messaging at the bottom of the hero funnel.
- **Changed Files:** src/components/BiblioKitLanding.tsx
- **Verification:** *(not run; confirm the CTA section no longer renders on the landing page)*

- **Time:** 2025-11-12 22:47 EST
- **Summary:** Reduced the landing hero height by another 120px by tightening min-height, padding, and gradient anchors.
- **Root Cause:** The latest hero iteration still sat taller than requested, so the fold needed to move back up without exposing bare background.
- **Changed Files:** src/index.css
- **Verification:** *(not run; verify hero height visually in browser)*

- **Time:** 2025-11-12 22:47 EST
- **Summary:** Forced the hero gradient/noise layers to span the full viewport width so the grid and overlay cover edge-to-edge.
- **Root Cause:** Centered layers with fixed widths left visible gutters on ultra-wide screens.
- **Changed Files:** src/index.css
- **Verification:** *(not run; confirm full-width coverage in browser)*

- **Time:** 2025-11-12 22:48 EST
- **Summary:** Removed the landing hero gradient scroll animation so the background stays static instead of shifting on scroll.
- **Root Cause:** Animated offsets were no longer desired and introduced unnecessary motion.
- **Changed Files:** src/components/LandingHero.tsx; src/index.css
- **Verification:** *(not run; visually confirm the gradient no longer animates while scrolling)*

- **Time:** 2025-11-12 22:51 EST
- **Summary:** Updated product pages to reuse the landing hero background (full-width red grid, contrast overlay, no scroll animation) so all heroes share the same visual system.
- **Root Cause:** ProductHero still used the old parallax gradient, causing visual drift from the landing hero.
- **Changed Files:** src/components/ProductHero.tsx
- **Verification:** *(not run; inspect a product page hero to confirm the new background appears)*

- **Time:** 2025-11-12 22:53 EST
- **Summary:** Swapped the plugin dropdown icons to resolved Lucide icons so the header uses consistent vector glyphs instead of emoji.
- **Root Cause:** The Plugins menu still rendered emoji strings, clashing with the new icon system request.
- **Changed Files:** src/components/Header.tsx; src/lib/iconUtils.ts
- **Verification:** *(not run; hover the Plugins nav to confirm Lucide icons appear)*

- **Time:** 2025-11-12 22:53 EST
- **Summary:** Removed the auto-injected “Docs” link from the top navigation so only CMS-defined nav items render.
- **Root Cause:** Header logic still appended a Docs link even after Emily asked for the nav to stay focused on Plugins + UXBiblio.
- **Changed Files:** src/components/Header.tsx
- **Verification:** *(not run; visually confirm the header only shows configured links)*

- **Time:** 2025-11-12 23:01 EST
- **Summary:** Halved the product hero content padding (py-24 → py-12) so the callouts and copy start closer to the top edge.
- **Root Cause:** Product hero content still had 6rem padding that Emily wanted removed.
- **Changed Files:** src/components/ProductHero.tsx
- **Verification:** *(not run; verify spacing visually on a product page)*

- **Time:** 2025-11-12 23:03 EST
- **Summary:** Restyled the header’s X icon button with a glassmorphic background (translucent fill, backdrop blur, subtle border/shadow) for both desktop and mobile menus.
- **Root Cause:** The X badge still used opaque fills and didn’t match the glass treatment used elsewhere in the hero/navigation.
- **Changed Files:** src/components/Header.tsx
- **Verification:** *(not run; visually confirm the X badge now shows the glass effect on desktop + mobile)*
