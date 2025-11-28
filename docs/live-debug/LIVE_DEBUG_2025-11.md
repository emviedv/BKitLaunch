# Live Debug Log — 2025-11

## 2025-11-27

- **Time:** 2025-11-27 00:48 EST
- **Summary:** Ensured all blog text surfaces convert raw URLs into hyperlinks, including hero summaries, excerpts, and FAQ answers, while trimming trailing punctuation.
- **Root Cause:** Blog copy that included plain URLs (especially those inside parentheses) rendered as raw text or with punctuation inside the href on certain surfaces, leaving some links unclickable or pointed at malformed destinations.
- **Changed Files:** src/lib/renderTextWithLinks.tsx; src/components/BlogArticlePage.tsx; src/components/BlogPage.tsx; src/components/LandingHero.tsx
- **Verification:** Open any blog article and confirm URLs inside paragraphs/lists/FAQs render as clickable pink links without trailing punctuation; check the blog hero summary and blog listing excerpts to ensure URLs are clickable and open the correct destination in a new tab.

- **Time:** 2025-11-27 02:57 EST
- **Summary:** Converted BiblioAudit and Unsplash credit URLs in blog content to Markdown links so hyperlink styling shows on the plugin names instead of raw URLs.
- **Root Cause:** Blog copy stored bare URLs in parentheses, so list items and paragraphs surfaced plain text instead of linked plugin names—making links look absent.
- **Changed Files:** src/data/blogPosts.ts
- **Verification:** Render the detached-instances article and confirm BiblioAudit mentions now show as pink hyperlinks on the plugin name (no visible raw URL); check the Atlassian design system caption links to the photographer profile. *(Not run automatically.)*

- **Time:** 2025-11-27 11:29 EST
- **Summary:** Pointed blog content images at local /public assets, enforced alt text for every blog image block, and added DEBUG_FIX logging for blog image rendering.
- **Root Cause:** The remove-prototype-links article still hotlinked two hero images from Medium/Sanity, which 403ed in production and lacked guardrails to prevent external sources or missing alt coverage.
- **Changed Files:** src/data/blogPosts.ts; src/components/BlogArticlePage.tsx; tests/unit/blogImages.spec.ts
- **Verification:** node --test tests/unit/blogImages.spec.ts; confirm remove-prototype-links article images load from /blog/remove-prototype-links/* with visible alt text fallback when images are disabled.

## 2025-11-26

- **Time:** 2025-11-26 03:37 EST
- **Summary:** Updated the landing page title/OG/Twitter defaults to “BiblioKit | AI Figma Plugins for Design Systems & Handoff” in both static HTML and bot fallback metadata.
- **Root Cause:** Landing metadata still used the older “Design Toolkit…” title, causing mismatched titles across head tags and bot fallback responses.
- **Changed Files:** index.html; src/lib/seo.ts; netlify/edge-functions/bot-detection.ts
- **Verification:** *(not run; verify head/title and social preview tags show the new title on the landing page and bot fallback response.)*

- **Time:** 2025-11-26 03:36 EST
- **Summary:** Added the design-operations plugins line to the footer to clarify the suite includes BiblioAudit, BiblioScale, and BiblioClean.
- **Root Cause:** Footer lacked the requested suite description, leaving visitors without a clear view of the included Figma plugins.
- **Changed Files:** src/components/Footer.tsx
- **Verification:** *(not run; visually confirm the footer shows the new sentence beneath the copyright.)*

## 2025-11-25

- **Time:** 2025-11-25 17:06 EST
- **Summary:** Added launch/beta pills above landing product titles so statuses are visible on every card.
- **Root Cause:** Landing product cards were missing badge pills, leaving designers, developers, and marketers without a quick status cue for each product.
- **Changed Files:** src/components/BiblioKitLanding.tsx; src/components/ProductContentSections.tsx
- **Verification:** *(not run; visually confirm each landing product card shows a status pill above the title with the correct label and tint.)*

- **Time:** 2025-11-25 12:45 EST
- **Summary:** Removed the white background on the shared landing hero illustration so it renders transparently over page gradients.
- **Root Cause:** The Origami hero visual used a semi-opaque white backdrop, leaving a visible box behind the illustration on landing surfaces.
- **Changed Files:** src/components/OrigamiIllustration.tsx
- **Verification:** *(not run; visually confirm the landing hero illustration no longer shows a white background and blends with the gradient.)*

- **Time:** 2025-11-25 12:55 EST
- **Summary:** Added 24px more vertical spacing between product feature cards to reduce visual crowding across landing and product pages.
- **Root Cause:** Product cards sat too close together, making the features section feel cramped.
- **Changed Files:** src/components/ProductContentSections.tsx
- **Verification:** *(not run; visually confirm increased gaps between product cards in both landing and product feature sections.)*

- **Time:** 2025-11-25 13:05 EST
- **Summary:** Centered the hero illustration within its dotted container while keeping animations intact and avoiding shifts to feature cards.
- **Root Cause:** The shared hero illustration was anchored to the container edge, making the dotted background feel off-center after removing its white backdrop.
- **Changed Files:** src/components/OrigamiIllustration.tsx
- **Verification:** *(not run; visually confirm the illustration sits centered within the dotted background, cursors/line animations still run, and product/feature cards remain in place.)*

- **Time:** 2025-11-25 13:22 EST
- **Summary:** Re-centered the hero illustration cluster and enlarged the green card so connectors tuck beneath it.
- **Root Cause:** The origami cluster sat left of center and the green card was too small to cover the flow connector.
- **Changed Files:** src/components/OrigamiIllustration.tsx
- **Verification:** *(not run; visually confirm the illustration is centered within the dotted container and the green card overlaps its connector.)*

- **Time:** 2025-11-25 13:32 EST
- **Summary:** Reverted the hero illustration to its original layout.
- **Root Cause:** Centering and sizing tweaks misaligned the illustration and exposed connectors; original layout requested instead.
- **Changed Files:** src/components/OrigamiIllustration.tsx
- **Verification:** *(not run; visually confirm the illustration matches the original layout.)*

- **Time:** 2025-11-25 13:38 EST
- **Summary:** Re-applied the centered hero illustration and larger green card after undoing the revert.
- **Root Cause:** Centering/scale adjustments were reverted but need to stay live.
- **Changed Files:** src/components/OrigamiIllustration.tsx
- **Verification:** *(not run; visually confirm the illustration is centered with the dotted background and the green card overlaps its connector.)*

- **Time:** 2025-11-25 13:46 EST
- **Summary:** Restyled hero connectors to mimic Figma prototype connectors with rounded dashed lines, subtle glow, and endpoint dots.
- **Root Cause:** Connector strokes looked generic and didn’t match Figma-style prototype links.
- **Changed Files:** src/components/OrigamiIllustration.tsx
- **Verification:** *(not run; visually confirm connectors show rounded dashed/solid strokes with endpoint dots and existing animations remain.)*

- **Time:** 2025-11-25 13:55 EST
- **Summary:** Slimmed connector strokes and enlarged endpoint dots to fully cap the lines.
- **Root Cause:** Connectors were too thick and the dots didn’t cover the line ends.
- **Changed Files:** src/components/OrigamiIllustration.tsx
- **Verification:** *(not run; visually confirm thinner strokes with dots fully covering line ends while animations remain intact.)*

- **Time:** 2025-11-25 14:03 EST
- **Summary:** Simplified hero connectors to solid strokes without glow or dashes while keeping endpoint dots.
- **Root Cause:** Glow and dashed styling weren’t desired for the prototype-like connectors.
- **Changed Files:** src/components/OrigamiIllustration.tsx
- **Verification:** *(not run; visually confirm solid connector strokes with dots capping ends; animations intact.)*

- **Time:** 2025-11-25 14:10 EST
- **Summary:** Removed the interior lines from the orange document card in the hero illustration.
- **Root Cause:** The orange doc card had extra line accents that weren’t desired.
- **Changed Files:** src/components/OrigamiIllustration.tsx
- **Verification:** *(not run; visually confirm the orange doc card shows only the pill icon without extra lines.)*

- **Time:** 2025-11-25 14:14 EST
- **Summary:** Increased the orange document icon size by ~20% for better legibility.
- **Root Cause:** The document icon was undersized after removing the supporting lines.
- **Changed Files:** src/components/OrigamiIllustration.tsx
- **Verification:** *(not run; visually confirm the orange icon is larger while the card remains line-free.)*

- **Time:** 2025-11-25 03:10 EST
- **Summary:** Expanded the Netlify sitemap to cover deep product/blog/resource URLs with `<lastmod>` dates and image metadata so Google can crawl the full surface area.
- **Root Cause:** The sitemap only listed a handful of top-level paths and omitted per-page freshness and images, preventing discovery of individual blog posts and product visuals.
- **Changed Files:** netlify/functions/sitemap.ts; src/data/blogPosts.ts; src/data/products.json
- **Verification:** *(not run; fetch `/sitemap.xml` and confirm blog/product/resource URLs include `<lastmod>` plus `<image:image>` entries with the expected hero/cover assets.)*

- **Time:** 2025-11-25 03:07 EST
- **Summary:** Matched the landing content sections’ horizontal padding to the hero gutters by reusing the shared section-content container for the compact layout.
- **Root Cause:** The landing content layout used a narrower custom width/padding than the hero, leaving the feature stack inset relative to the hero’s left/right gutters.
- **Changed Files:** src/components/ProductContentSections.tsx
- **Verification:** *(not run; visually confirm the landing product sections align with the hero’s left/right padding in the shared gradient background.)*

- **Time:** 2025-11-25 02:04 EST
- **Summary:** Swapped BiblioTable’s product card art to the provided Figma cover image.
- **Root Cause:** Product card still showed the older UI illustration instead of the latest marketing cover.
- **Changed Files:** src/data/products.json; public/media/table-fixer-figma.png
- **Verification:** *(not run; confirm BiblioTable card renders the new cover image in product and landing sections.)*

- **Time:** 2025-11-25 02:27 EST
- **Summary:** Updated the UXBiblio product card to use the provided cover image.
- **Root Cause:** UXBiblio still referenced the old abstract list visual instead of the supplied marketing cover.
- **Changed Files:** src/data/products.json; public/media/uxbiblio-cover.png
- **Verification:** *(not run; check UXBiblio card shows the new cover art on product/landing sections.)*

- **Time:** 2025-11-25 02:00 EST
- **Summary:** Removed the left-side features nav on product sections, matched product content padding to the hero container, and added Figma community cover images to all plugin product cards.
- **Root Cause:** Product pages showed an extra side nav and wider padding than the hero, and cards lacked cover imagery despite available community thumbnails.
- **Changed Files:** src/components/ProductContentSections.tsx; src/data/products.json
- **Verification:** *(not run; verify product sections no longer show a side nav, content width aligns with the hero, and BiblioRename/BiblioAudit/BiblioClean cards render their Figma cover images.)*

- **Time:** 2025-11-25 02:02 EST
- **Summary:** Removed the image wrapper border/background so product feature images can fill the full container height without the illustration frame.
- **Root Cause:** The image container styling constrained plugin cover art inside a framed illustration box.
- **Changed Files:** src/components/ProductContentSections.tsx
- **Verification:** *(not run; check feature images now span the full container height with no surrounding border/background.)*

- **Time:** 2025-11-25 02:02 EST
- **Summary:** Tightened product feature image rounding to 8px so covers match the simplified container styling.
- **Root Cause:** Image wrappers still used oversized rounding after removing the frame, conflicting with the new bare layout.
- **Changed Files:** src/components/ProductContentSections.tsx
- **Verification:** *(not run; confirm product feature images render with ~8px rounded corners.)*

- **Time:** 2025-11-25 01:38 EST
- **Summary:** Updated hero/SEO tagline to “Automate the things you hate, focus on design you love.” across bundled content, scripts, and bot fallback.
- **Root Cause:** Marketing requested the new phrasing; old “Automate the stuff you hate…” line was still shipping.
- **Changed Files:** default-content.json; current-default-content.json; clean-content.json; correct-content.json; fixed-content.json; src/data/products.json; netlify/edge-functions/bot-detection.ts; scripts/migrate-content-to-db.js; STRATEGIC_MASTER_DOC.md
- **Verification:** *(not run; check hero, SEO metadata, and bot-detection fallback text show the updated tagline)* 

- **Time:** 2025-11-25 01:37 EST
- **Summary:** Standardized plugin dropdown labels to use the em dash syntax so BiblioAudit matches the other plugin naming.
- **Root Cause:** Mixed punctuation (colon vs. em dash) in the header dropdown produced inconsistent plugin naming.
- **Changed Files:** src/data/products.json
- **Verification:** *(not run; check the header Plugins dropdown shows “BiblioAudit — Find Detached Instances & Design System Check” with the em dash)*

- **Time:** 2025-11-25 01:35 EST
- **Summary:** Darkened the pink primary button hover state to a deeper pink across hero, blog, and shared button styles.
- **Root Cause:** Hover styling boosted brightness, lightening the pink CTA instead of giving a darker hover affordance.
- **Changed Files:** src/components/heroConstants.ts; src/components/BlogPage.tsx; src/components/ui/button.tsx; src/index.css
- **Verification:** *(not run; visually confirm hero/blog CTAs and primary buttons darken to the deeper pink on hover)*

- **Time:** 2025-11-25 01:30 EST
- **Summary:** Split the BiblioRename product card title and tagline so “AI Layer Renamer & Naming Conventions” renders beneath the name.
- **Root Cause:** The tagline text was embedded in the title, preventing the product card from showing the dedicated subtitle line.
- **Changed Files:** src/data/products.json
- **Verification:** *(not run; confirm the BiblioRename card now shows the tagline under the title on the landing page)*

- **Time:** 2025-11-25 00:42 EST
- **Summary:** Retired unused legacy URLs (/product, /roadmap, /sign-up, /test, /component-auditor-figma-plugin, /month, /learn-more) by serving 410s and stripping them from bot/SEO/index submissions.
- **Root Cause:** Old experimental paths were still reachable via bot-specific HTML and IndexNow payloads, keeping crawlers aware of pages we no longer support.
- **Changed Files:** _redirects; netlify/edge-functions/bot-detection.ts; netlify/functions/indexnow.ts; src/lib/seo.ts; src/data/products.json; default-content.json; current-default-content.json; features-default.json
- **Verification:** *(not run; `npm test -- tests/unit/sitemap.spec.ts` fails because package.json has no test script; manually hit the retired URLs to confirm 410 responses and that navigation links now point to live destinations)*

- **Time:** 2025-11-25 00:36 EST
- **Summary:** Aligned the landing hero content to the shared section gutters so its left/right padding matches the content sections.
- **Root Cause:** The hero canvas was full-bleed without the standard section padding, making the hero text and illustration start wider than the downstream content blocks.
- **Changed Files:** src/components/LandingHero.tsx
- **Verification:** *(not run; visually confirm hero text/illustration align to the same horizontal gutters as the content sections)*

- **Time:** 2025-11-25 00:36 EST
- **Summary:** Pinned the landing hero illustration to the far right and raised its z-order so it sits above the gradient layer instead of under it.
- **Root Cause:** After constraining the hero to the section gutters, the isometric illustration pulled inward and appeared partially hidden under the background gradient.
- **Changed Files:** src/components/LandingHero.tsx
- **Verification:** *(not run; visually confirm the illustration hugs the right edge and is fully visible above the gradient overlay)*

- **Time:** 2025-11-25 00:37 EST
- **Summary:** Boosted the hero illustration’s stacking order to sit above all gradient overlays, eliminating the color cast difference.
- **Root Cause:** The isometric art still inherited a tint from overlay layers because its z-index sat below some hero overlays.
- **Changed Files:** src/components/LandingHero.tsx
- **Verification:** *(not run; visually confirm the illustration renders at full color without overlay tint)*

- **Time:** 2025-11-25 00:38 EST
- **Summary:** Restored the origami illustration colors to the original palette (soft yellows/indigos/emeralds with white borders) matching the reference hero.
- **Root Cause:** The updated gradient palette shifted blob fills and strokes away from the source design, altering the Logic diamond and cards.
- **Changed Files:** src/components/LandingHero.tsx
- **Verification:** *(not run; visually compare to the original OrigamiHero palette to confirm colors match)* 

- **Time:** 2025-11-25 00:39 EST
- **Summary:** Centered the hero’s left content vertically to match the original OrigamiHero positioning.
- **Root Cause:** Text block sat higher than in the reference layout, so the hero looked top-heavy.
- **Changed Files:** src/components/LandingHero.tsx
- **Verification:** *(not run; visually confirm the left column aligns vertically with the original hero reference)* 

- **Time:** 2025-11-25 00:40 EST
- **Summary:** Removed the clients marquee from the landing page hero stack per request.
- **Root Cause:** Clients section should not render on the landing hero sequence.
- **Changed Files:** src/components/BiblioKitLanding.tsx
- **Verification:** *(not run; check landing page no longer shows the clients row under the hero)*

- **Time:** 2025-11-25 00:41 EST
- **Summary:** Extended the hero background overlays (gradient, grid, noise, contrast) behind the product sections to remove the hard color band between hero and section two.
- **Root Cause:** The product content area restarted a fresh background, creating a visible band after the hero.
- **Changed Files:** src/components/BiblioKitLanding.tsx
- **Verification:** *(not run; reload landing and confirm the hero background flows smoothly into the next section without a band)*

- **Time:** 2025-11-25 00:42 EST
- **Summary:** Removed the unused landing-sections gradient style and relied on the hero gradient layer to flow behind the next section.
- **Root Cause:** Stale CSS kept the old gradient definition; the new hero overlay now drives the background for subsequent sections.
- **Changed Files:** src/components/BiblioKitLanding.tsx; src/index.css
- **Verification:** *(not run; ensure the background continues smoothly with no leftover band and no landing-sections gradient CSS present)*

- **Time:** 2025-11-25 00:43 EST
- **Summary:** Split BiblioAudit’s product card into title + tagline so “Find Detached Instances & Design System Check” now appears beneath the title.
- **Root Cause:** The tagline was embedded in the title; the card needed a separate subtitle line.
- **Changed Files:** src/components/Features.tsx; src/data/products.json
- **Verification:** *(not run; open the landing product cards and confirm the BiblioAudit card shows the tagline under the title)* 

- **Time:** 2025-11-25 00:44 EST
- **Summary:** Removed the “High-performers teams rely…” clause from the features description and tests; aligned AI Rename copy to the updated tagline.
- **Root Cause:** Requested to drop the “High-performers teams rely…” phrasing from the product copy.
- **Changed Files:** src/data/products.json; tests/unit/homepageFeaturesCopy.spec.ts; tests/unit/aiRenameVariantsCopy.spec.ts; src/components/aiRenameVariantsCopy.ts
- **Verification:** *(not run; confirm the features section and AI Rename copy show the updated wording without the removed clause)*

- **Time:** 2025-11-25 00:45 EST
- **Summary:** Swapped the landing hero primary CTA to the pink product-card button style (HERO_PRIMARY_BUTTON_CLASS).
- **Root Cause:** Hero still used a slate button instead of the shared pink CTA styling from product cards.
- **Changed Files:** src/components/LandingHero.tsx
- **Verification:** *(not run; visually confirm hero primary CTA uses the pink button style)* 

- **Time:** 2025-11-25 00:46 EST
- **Summary:** Renamed the BiblioRename product card to “BiblioRename: AI Layer Renamer & Naming Conventions.”
- **Root Cause:** Requested updated naming for the product card.
- **Changed Files:** src/data/products.json
- **Verification:** *(not run; check the BiblioRename card title renders the new name)* 

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

## 2025-11-18

- **Time:** 2025-11-18 03:21 UTC
- **Summary:** Matched the featured blog hero layout to the latest request by tightening the image corner radius to 2px and increasing the hero column gap to 48px between the featured content and sidebar.
- **Root Cause:** The hero still used larger rounding and a 40px grid gap, which didn't align with the updated spec for the featured blog layout.
- **Changed Files:** src/components/BlogPage.tsx
- **Verification:** *(not run; visually confirm 2px rounding and 48px column gap in the blog hero)*
- **Time:** 2025-11-18 03:22 UTC
- **Summary:** Added an extra 120px of horizontal gap between the featured blog content and sidebar to meet the wider hero spacing request.
- **Root Cause:** The prior 48px gap was still tighter than the newly requested spacing for the featured hero layout.
- **Changed Files:** src/components/BlogPage.tsx
- **Verification:** *(not run; visually confirm the ~168px column gap on large screens in the blog hero)*
- **Time:** 2025-11-18 03:23 UTC
- **Summary:** Added a “Latest Post” badge above the featured blog hero so the top article is labeled clearly.
- **Root Cause:** The hero lacked the requested badge, so the featured article wasn’t explicitly marked as the latest post.
- **Changed Files:** src/components/BlogPage.tsx
- **Verification:** *(not run; check the featured blog hero renders the “Latest Post” pill above the image/title)*
- **Time:** 2025-11-18 03:24 UTC
- **Summary:** Unified all blog page CTAs to the same label, font size, sizing, and rounding by reusing one CTA style for the hero and grid cards.
- **Root Cause:** CTA text/size were inconsistent because the hero used a different button component and styling than the article cards.
- **Changed Files:** src/components/BlogPage.tsx
- **Verification:** *(not run; verify all “Read the article” buttons share identical sizing, rounding, and typography on the blog page)*
- **Time:** 2025-11-18 03:25 UTC
- **Summary:** Ensured CTA typography matches everywhere by removing the mismatched button wrapper in the hero and using the shared “Read the article” class directly.
- **Root Cause:** The Button wrapper applied different font sizing than the shared CTA class, so the hero CTA looked inconsistent.
- **Changed Files:** src/components/BlogPage.tsx
- **Verification:** *(not run; confirm hero and card CTAs now share the same font size/weight and sizing)*
- **Time:** 2025-11-18 03:26 UTC
- **Summary:** Moved category and reading time text to the top of all blog cards (featured hero, grid cards, and sidebar list) for consistent metadata placement.
- **Root Cause:** Category/read-time labels were buried near the CTAs, making metadata less scannable and inconsistently placed across surfaces.
- **Changed Files:** src/components/BlogPage.tsx
- **Verification:** *(not run; open the blog page and confirm category • read-time appears above titles in hero, grid, and sidebar cards)*
- **Time:** 2025-11-18 03:27 UTC
- **Summary:** Scaled down all blog CTA buttons (hero, grid, sidebar) to a smaller font and tighter vertical padding while keeping uniform sizing.
- **Root Cause:** CTA font size looked oversized relative to surrounding text, breaking visual hierarchy even after unifying styles.
- **Changed Files:** src/components/BlogPage.tsx
- **Verification:** *(not run; visually confirm all “Read the article” buttons share the reduced text size and consistent padding)*
- **Time:** 2025-11-18 03:26 UTC
- **Summary:** Added 4px bottom padding to category/read-time metadata across featured hero, grid cards, and sidebar list for consistent spacing above titles.
- **Root Cause:** Metadata sat too close to adjacent content, reducing readability and consistency between surfaces.
- **Changed Files:** src/components/BlogPage.tsx
- **Verification:** *(not run; check that category • read-time labels have a small gap before titles across the blog page)*
- **Time:** 2025-11-18 03:27 UTC
- **Summary:** Added an extra 4px bottom padding to all category/read-time labels to further separate metadata from titles across hero, sidebar, and grid cards.
- **Root Cause:** The previous 4px gap was still tighter than desired for metadata readability.
- **Changed Files:** src/components/BlogPage.tsx
- **Verification:** *(not run; confirm metadata-to-title spacing shows the increased gap on all blog cards)*
- **Time:** 2025-11-18 03:28 UTC
- **Summary:** Scaled the “Browse BiblioKit Articles” heading down one type size to soften hierarchy under the featured hero.
- **Root Cause:** Heading size overwhelmed the layout after other hero adjustments; dropping one scale restores hierarchy.
- **Changed Files:** src/components/BlogPage.tsx
- **Verification:** *(not run; check heading renders at the reduced size in the articles section)*
- **Time:** 2025-11-18 03:29 UTC
- **Summary:** Dropped the supporting subheading text in the articles section down one type scale to keep hierarchy consistent after shrinking the heading.
- **Root Cause:** The body copy sat too close in size to the prior heading scale, so lowering both maintains a clear hierarchy.
- **Changed Files:** src/components/BlogPage.tsx
- **Verification:** *(not run; confirm the subheading renders at the reduced size under the section heading)*
- **Time:** 2025-11-18 03:29 UTC
- **Summary:** Set blog grid cards to a slightly lighter shade of the page background for a subtler, uniform backdrop.
- **Root Cause:** Cards were using a light translucent white fill that clashed with the dark page background instead of feeling like a lighter step of the same palette.
- **Changed Files:** src/components/BlogPage.tsx
- **Verification:** *(not run; visually confirm cards use the darker backdrop shade and still maintain readable contrast)*
- **Time:** 2025-11-18 03:30 UTC
- **Summary:** Matched the footer background to the dark page palette (one shade lighter) and updated footer text/link colors for contrast.
- **Root Cause:** The footer used a muted light background that clashed with the new dark blog palette; needed to align with the shared background color.
- **Changed Files:** src/components/Footer.tsx
- **Verification:** *(not run; visually confirm footer uses the darker background with readable white text and accent hover state)*
- **Time:** 2025-11-18 03:31 UTC
- **Summary:** Added 24px more bottom padding to the secondary blog section to give the grid extra breathing room below.
- **Root Cause:** The section bottom spacing was tight after other layout tweaks; increasing padding keeps content from feeling cramped.
- **Changed Files:** src/components/BlogPage.tsx
- **Verification:** *(not run; check the secondary section bottom padding reflects the increased space)*
- **Time:** 2025-11-18 03:32 UTC
- **Summary:** Reduced the top margin before the blog grid to 2rem to tighten the gap beneath the section header.
- **Root Cause:** The 3rem top margin left the grid sitting too far below the heading after other spacing changes.
- **Changed Files:** src/components/BlogPage.tsx
- **Verification:** *(not run; confirm the grid starts 2rem below the section heading)*
- **Time:** 2025-11-18 03:33 UTC
- **Summary:** Simplified sidebar recent-article cards by removing descriptions and adding a stronger hover fill so metadata + title remain scannable.
- **Root Cause:** Sidebar excerpts cluttered the compact list and hover feedback was too subtle.
- **Changed Files:** src/components/BlogPage.tsx
- **Verification:** *(not run; check sidebar list omits excerpts and hover darkens the card background)*
- **Time:** 2025-11-18 03:34 UTC
- **Summary:** Redrew the featured hero line abstraction at a taller 484px canvas and raised the hero image cap by 64px for more breathing room.
- **Root Cause:** The previous 420px height constrained the illustration and hero image height below the requested taller spec.
- **Changed Files:** public/blog/remove-prototype-links/hero-abstract.svg; src/components/BlogPage.tsx
- **Verification:** *(not run; visually confirm the taller hero image renders with the updated line art at the new height)*
- **Time:** 2025-11-18 03:35 UTC
- **Summary:** Moved the featured post metadata directly under the hero image to sit closer to the artwork while keeping a small gap above the title.
- **Root Cause:** Category/read-time sat above the image, creating an unwanted gap from the hero art.
- **Changed Files:** src/components/BlogPage.tsx
- **Verification:** *(not run; check metadata appears beneath the hero image with a small buffer before the title)*
- **Time:** 2025-11-18 03:36 UTC
- **Summary:** Matched the blog index hero badge and title styling to the article page hero: pill with accent dot/outline and a large, tight headline.
- **Root Cause:** The featured card badge/title used smaller, mismatched styles compared to the blog post hero presentation.
- **Changed Files:** src/components/BlogPage.tsx
- **Verification:** *(not run; confirm the badge mirrors the article hero style and the title uses the large headline scale)*
- **Time:** 2025-11-18 03:37 UTC
- **Summary:** Applied the blog title gradient to the landing hero subtitle (“Work x10,000 faster.”) so it matches the blog post title treatment.
- **Root Cause:** The landing subtitle used a flat color while the blog titles used the pink-purple gradient, creating inconsistency.
- **Changed Files:** src/components/LandingHero.tsx
- **Verification:** *(not run; check the landing hero subtitle renders with the pink-purple gradient)*
- **Time:** 2025-11-18 03:35 UTC
- **Summary:** Removed the landing hero secondary CTA, retitled the primary CTA to “View Products,” and pointed it to the products section anchor.
- **Root Cause:** Requested to drop “View Products” secondary and reuse that label on the primary button to jump to the products section.
- **Changed Files:** src/data/products.json
- **Verification:** *(not run; verify the landing hero shows a single “View Products” button linking to #landing-features)*
- **Time:** 2025-11-18 03:35 UTC
- **Summary:** Replaced remote avatar URLs with product-specific local avatars (rename/audit/library/default sets) to avoid broken photos and vary social proof per product.
- **Root Cause:** Unsplash avatars could break and didn’t adapt visuals per product; needed reliable local assets and per-product differentiation.
- **Changed Files:** src/components/ProductContentSections.tsx; public/avatars/*
- **Verification:** *(not run; check social-proof avatar stacks render unique local avatars per product without broken images)*
- **Time:** 2025-11-18 03:36 UTC
- **Summary:** Boosted hero grid line opacity by +10% so grid overlays read more clearly across pages.
- **Root Cause:** Grid visuals were still too faint; increasing opacity improves legibility.
- **Changed Files:** src/index.css
- **Verification:** *(not run; visually confirm hero grid lines are slightly stronger across pages)*
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

## 2025-11-13

- **Time:** 2025-11-13 10:26 EST
- **Summary:** Swapped the clients marquee defaults to real Clearbit-hosted company logos and added AARP, Fisher-Price, GEICO, Netflix, and Apple so the chip row shows the requested brands.
- **Root Cause:** The marquee still rendered simplified placeholder SVGs and lacked the additional enterprise/customer logos Emily requested.
- **Changed Files:** src/components/ClientsMarquee.tsx
- **Verification:** *(not run; visually confirm the marquee renders the requested logos in-browser)*

- **Time:** 2025-11-13 11:46 EST
- **Summary:** Converted the marquee logos to inline white SVG wordmarks so each client shows a text logo (including the new AARP, Fisher-Price, GEICO, Netflix, and Apple tokens) without loading external assets.
- **Root Cause:** Emily requested text logos rendered as white SVGs instead of the previously linked brand image assets.
- **Changed Files:** src/components/ClientsMarquee.tsx; src/components/clientsLogoResolver.ts
- **Verification:** *(not run; check the marquee visually to confirm the white text wordmarks appear as expected)*

## 2025-11-17

- **Time:** 2025-11-17 16:44 EST
- **Summary:** Enabled blog autolinking plus next/previous and related-article sections so readers can hop between playbooks without dead ends.
- **Root Cause:** Blog content rendered as plain text and lacked navigation, preventing cross-post linking or in-flow movement to other articles.
- **Changed Files:** src/components/BlogArticlePage.tsx
- **Verification:** *(not run; manually click through autolinks, next/previous, and related article links in the browser)*

- **Time:** 2025-11-17 16:49 EST
- **Summary:** Reworded the related-articles heading and subcopy to remove the “shared workspace 10x faster” claim.
- **Root Cause:** The related section used tone implying a capability the main product doesn’t provide.
- **Changed Files:** src/components/BlogArticlePage.tsx
- **Verification:** *(not run; confirm the related-articles block no longer references shared workspaces or 10x claims)*

- **Time:** 2025-11-17 16:51 EST
- **Summary:** Removed background, padding, and borders from next/previous and related-article sections to keep the navigation minimal.
- **Root Cause:** The navigation blocks still used framed cards and padded wrappers, conflicting with the request for unadorned navigation links.
- **Changed Files:** src/components/BlogArticlePage.tsx
- **Verification:** *(not run; open any blog article and confirm next/previous/related links render without container backgrounds, padding, or borders)*

- **Time:** 2025-11-17 16:52 EST
- **Summary:** Standardized blog hover styling (pink text hover + focus ring) across related/next/previous links and applied the same default hover to main blog listing cards.
- **Root Cause:** Related navigation used the new hover style, but the main blog cards and other lists still used different hover treatments.
- **Changed Files:** src/components/BlogArticlePage.tsx; src/components/BlogPage.tsx
- **Verification:** *(not run; hover related/next/previous links and blog listing cards to confirm the shared hover/focus treatment)*

- **Time:** 2025-11-17 16:53 EST
- **Summary:** Kept blog card titles at their default color on hover so text doesn’t shift hue in related/next/previous links.
- **Root Cause:** Titles were inheriting a pink hover color, conflicting with the request to keep hover styling consistent with the default title color.
- **Changed Files:** src/components/BlogArticlePage.tsx
- **Verification:** *(not run; hover related/next/previous/related titles to confirm the color stays the default)* 

- **Time:** 2025-11-17 16:54 EST
- **Summary:** Removed the “Bounce between articles without losing momentum.” helper line from the next/previous section.
- **Root Cause:** The helper text was not desired in the next/previous navigation.
- **Changed Files:** src/components/BlogArticlePage.tsx
- **Verification:** *(not run; open a blog article and confirm the subtext under “Next & previous” is gone)*

- **Time:** 2025-11-17 16:53 EST
- **Summary:** Dropped the “Keep shipping with the next playbook” heading from the next/previous navigation.
- **Root Cause:** The heading copy was not desired for that navigation block.
- **Changed Files:** src/components/BlogArticlePage.tsx
- **Verification:** *(not run; open a blog article and confirm the next/previous block shows only the label without the extra heading)*

- **Time:** 2025-11-17 16:53 EST
- **Summary:** Removed the “Browse more BiblioKit playbooks” heading from the related articles section.
- **Root Cause:** The heading text was not desired in the related-articles block.
- **Changed Files:** src/components/BlogArticlePage.tsx
- **Verification:** *(not run; open a blog article and confirm the related section shows only the label and description without that heading)*

- **Time:** 2025-11-17 16:54 EST
- **Summary:** Swapped the prototype links post hero and lead image to the provided asset URL.
- **Root Cause:** Requested to replace the prototype links image with the supplied external image.
- **Changed Files:** src/data/blogPosts.ts
- **Verification:** *(not run; open /blog/remove-prototype-links-in-figma to confirm the hero and lead image use https://i.sstatic.net/LzAOP.png)*

- **Time:** 2025-11-17 16:55 EST
- **Summary:** Converted “Regularly Review Your Prototype” and “Use Naming Conventions” into h4 headings followed by bulleted list items instead of paragraphs.
- **Root Cause:** These best-practice titles needed to render as h4 and be represented in a bulleted list.
- **Changed Files:** src/data/blogPosts.ts
- **Verification:** *(not run; open /blog/remove-prototype-links-in-figma and confirm each title is h4 with its copy shown as a bullet)* 

- **Time:** 2025-11-17 16:55 EST
- **Summary:** Removed borders and corner radii from blog article images to keep visuals unframed.
- **Root Cause:** Blog images still rendered inside rounded, bordered wrappers contrary to the request for frameless images.
- **Changed Files:** src/components/BlogArticlePage.tsx
- **Verification:** *(not run; open a blog article and confirm images show without borders or rounded corners)*

- **Time:** 2025-11-17 16:56 EST
- **Summary:** Removed the related-articles helper line beneath the “Related articles” label.
- **Root Cause:** The helper sentence wasn’t desired in the related section.
- **Changed Files:** src/components/BlogArticlePage.tsx
- **Verification:** *(not run; open a blog article and confirm the related section only shows the label with no helper text)*

- **Time:** 2025-11-17 16:56 EST
- **Summary:** Set next/previous and related article titles to light pink for consistent accent styling.
- **Root Cause:** Titles still used the default white color; request was to render them in the light pink accent instead.
- **Changed Files:** src/components/BlogArticlePage.tsx
- **Verification:** *(not run; open a blog article and confirm next/previous/related titles render in light pink)*

- **Time:** 2025-11-17 16:57 EST
- **Summary:** Reduced next/previous and related titles to 300 font weight while keeping the light pink accent.
- **Root Cause:** Titles were still using the heavier font weight; request was for a lighter (300) weight on these accents.
- **Changed Files:** src/components/BlogArticlePage.tsx
- **Verification:** *(not run; open a blog article and confirm next/previous/related titles use light pink with light font weight)*

- **Time:** 2025-11-17 16:57 EST
- **Summary:** Adjusted next/previous and related titles to 400 font weight while retaining the light pink accent.
- **Root Cause:** Titles needed the standard weight (400) instead of the lighter 300 weight.
- **Changed Files:** src/components/BlogArticlePage.tsx
- **Verification:** *(not run; open a blog article and confirm next/previous/related titles show light pink with normal weight)*

- **Time:** 2025-11-17 16:58 EST
- **Summary:** Moved category/reading-time meta under content across blog cards (next/previous, related, main cards, and recent list) so metadata sits below the excerpts.
- **Root Cause:** Meta details were absent or appeared above titles; request was to place them beneath card content consistently.
- **Changed Files:** src/components/BlogArticlePage.tsx; src/components/BlogPage.tsx
- **Verification:** *(not run; open blog articles and the blog listing to confirm meta sits under summaries on all cards)*

- **Time:** 2025-11-17 16:59 EST
- **Summary:** Tightened blog article content width to 680px.
- **Root Cause:** Content container exceeded the desired width; request was to limit article content width to 680px.
- **Changed Files:** src/components/BlogArticlePage.tsx
- **Verification:** *(not run; open a blog article and confirm the content column is capped at ~680px)*

- **Time:** 2025-11-17 16:59 EST
- **Summary:** Removed the hero description for the “Remove Prototype Links in Figma” post.
- **Root Cause:** The hero still showed the excerpt; request was to hide the description on that article’s hero.
- **Changed Files:** src/components/BlogArticlePage.tsx
- **Verification:** *(not run; open /blog/remove-prototype-links-in-figma and confirm the hero shows no description line)*

- **Time:** 2025-11-17 17:00 EST
- **Summary:** Added a compact hero mode for blog articles so the hero hugs the title (tighter padding/min-height).
- **Root Cause:** Blog heroes were too tall; needed a compact variant for article pages.
- **Changed Files:** src/components/LandingHero.tsx; src/components/BlogArticlePage.tsx; src/index.css
- **Verification:** *(not run; open a blog article to confirm the hero height hugs the title with shorter padding)*

- **Time:** 2025-11-17 17:02 EST
- **Summary:** Increased the compact blog hero padding by 64px on top and bottom to give the title breathing room.
- **Root Cause:** The compact hero needed a bit more vertical padding after tightening.
- **Changed Files:** src/index.css
- **Verification:** *(not run; open a blog article and confirm the hero has an extra 64px top/bottom padding versus the previous compact size)*

- **Time:** 2025-11-17 17:02 EST
- **Summary:** Added 24px top padding to the blog article section below the hero.
- **Root Cause:** The secondary section under the hero needed a bit more top spacing.
- **Changed Files:** src/components/BlogArticlePage.tsx
- **Verification:** *(not run; open a blog article to confirm the content section starts with an extra 24px top padding)*

- **Time:** 2025-11-17 17:03 EST
- **Summary:** Replaced the “Design project plan” image in the prototype links post with the provided LzAOP.png asset (used as inline image).
- **Root Cause:** Requested to swap the design project plan visual to the supplied image.
- **Changed Files:** src/data/blogPosts.ts
- **Verification:** *(not run; open /blog/remove-prototype-links-in-figma and confirm the design project plan image now shows the LzAOP asset)*

- **Time:** 2025-11-17 17:06 EST
- **Summary:** Set blog paragraphs and lists to 20px font size with 32px line height for improved readability.
- **Root Cause:** Blog body text sizing needed to match the requested 20/32 typographic spec.
- **Changed Files:** src/components/BlogArticlePage.tsx
- **Verification:** *(not run; open any blog article and confirm body text and lists render at 20px with 32px line height)*

- **Time:** 2025-11-17 17:07 EST
- **Summary:** Swapped the Figma interface image to the provided Medium-hosted asset in the prototype links post.
- **Root Cause:** Requested to replace the Figma interface image with the supplied URL.
- **Changed Files:** src/data/blogPosts.ts
- **Verification:** *(not run; open /blog/remove-prototype-links-in-figma to confirm the first inline image loads the new Medium asset)*

- **Time:** 2025-11-17 17:08 EST
- **Summary:** Converted the best-practice subheads in the prototype links post from h4 to h3.
- **Root Cause:** Requested to render those subheadings at the h3 level.
- **Changed Files:** src/data/blogPosts.ts
- **Verification:** *(not run; open /blog/remove-prototype-links-in-figma and confirm “Plan Your Interactions,” “Regularly Review Your Prototype,” and “Use Naming Conventions” render as h3)*

- **Time:** 2025-11-17 17:08 EST
- **Summary:** Set blog paragraph and list text weight to 300 while retaining the 20px/32px sizing.
- **Root Cause:** Blog body text needed the lighter 300 weight spec.
- **Changed Files:** src/components/BlogArticlePage.tsx
- **Verification:** *(not run; open any blog article and confirm paragraphs/lists render at 20px/32px with font-weight 300)*

- **Time:** 2025-11-17 17:09 EST
- **Summary:** Kept list text at normal weight (removed font-light) while paragraphs stay at 300, so list items retain the stronger weight with bolded leads.
- **Root Cause:** Needed lists to remain bold/normal instead of the lighter 300 weight applied to paragraphs.
- **Changed Files:** src/components/BlogArticlePage.tsx
- **Verification:** *(not run; open any blog article and confirm lists use normal weight while paragraphs stay light)* 

- **Time:** 2025-11-17 17:10 EST
- **Summary:** Restored the design project plan image to the local asset to fix the broken inline image.
- **Root Cause:** The previous hotlinked image was failing; local asset is more reliable.
- **Changed Files:** src/data/blogPosts.ts
- **Verification:** *(not run; open /blog/remove-prototype-links-in-figma and confirm the design project plan image renders from the local asset)* 

- **Time:** 2025-11-17 17:10 EST
- **Summary:** Reset the design project plan image to the provided LzAOP.png asset per request.
- **Root Cause:** Needed the design project plan visual to use the specified LzAOP image instead of the local fallback.
- **Changed Files:** src/data/blogPosts.ts
- **Verification:** *(not run; open /blog/remove-prototype-links-in-figma and confirm the design project plan image shows the LzAOP asset)*

- **Time:** 2025-11-17 17:12 EST
- **Summary:** Swapped the design project plan image to the new Sanity CDN asset URL.
- **Root Cause:** Requested to use the provided Sanity-hosted image for the design project plan visual.
- **Changed Files:** src/data/blogPosts.ts
- **Verification:** *(not run; open /blog/remove-prototype-links-in-figma and confirm the design project plan image renders from the new Sanity URL)*

- **Time:** 2025-11-17 17:13 EST
- **Summary:** Lightened the blog article background by a shade for the content section.
- **Root Cause:** Requested a slightly lighter background for the blog content section.
- **Changed Files:** src/components/BlogArticlePage.tsx
- **Verification:** *(not run; open any blog article to confirm the background behind content is a shade lighter)* 

- **Time:** 2025-11-17 17:14 EST
- **Summary:** Increased hero grid line opacity by ~10% for more visible grid background.
- **Root Cause:** Requested a slightly stronger grid overlay on the hero background.
- **Changed Files:** src/index.css
- **Verification:** *(not run; open a hero and confirm the grid lines are ~10% more visible)* 

- **Time:** 2025-11-17 17:40 EST
- **Summary:** Restored a subtle background on sidebar “Recent articles” cards to match the requested framed styling.
- **Root Cause:** Sidebar article links had transparent backgrounds; request was to reintroduce the bg treatment.
- **Changed Files:** src/components/BlogPage.tsx
- **Verification:** *(not run; open /blog and confirm sidebar recent-article cards show a light background)* 

- **Time:** 2025-11-17 17:41 EST
- **Summary:** Updated blog list heading/copy to a general blog message instead of playbook-specific language.
- **Root Cause:** The section heading/subcopy was too playbook-specific; needed general blog wording.
- **Changed Files:** src/components/BlogPage.tsx
- **Verification:** *(not run; open /blog and confirm the secondary heading reads “Explore the BiblioKit blog” with general blog copy)*

- **Time:** 2025-11-17 17:43 EST
- **Summary:** Renamed the blog secondary heading to “Browse BiblioKit Articles” and updated the description to reference design articles and product updates.
- **Root Cause:** Needed blog-specific language highlighting design content and product updates.
- **Changed Files:** src/components/BlogPage.tsx
- **Verification:** *(not run; open /blog and confirm the heading reads “Browse BiblioKit Articles” with the new description)* 

- **Time:** 2025-11-17 17:43 EST
- **Summary:** Left-aligned the blog listing heading and description.
- **Root Cause:** The blog intro text was centered and needed alignment to the left.
- **Changed Files:** src/components/BlogPage.tsx
- **Verification:** *(not run; open /blog and confirm the heading/description are left-aligned)* 

- **Time:** 2025-11-17 17:44 EST
- **Summary:** Removed hover background/foreground changes on the main blog listing cards while keeping the card structure.
- **Root Cause:** Requested to disable hover styling on the content area for blog cards.
- **Changed Files:** src/components/BlogPage.tsx
- **Verification:** *(not run; open /blog and hover card bodies to confirm no hover background change)* 

## 2025-11-14

- **Time:** 2025-11-14 13:58 EST
- **Summary:** Re-skinned the landing hero, marquee, and product sections with the Payfast-inspired midnight gradient, adding glassmorphism, neon gradients, and inverted typography so every surface reflects the new reference theme.
- **Root Cause:** The previous light palette didn’t match Emily’s request to “take these theme colors” from the provided Payfast shot, leaving white cards, gray text, and blue CTAs across the landing experience.
- **Changed Files:** src/components/LandingHero.tsx; src/components/ProductContentSections.tsx; src/components/ClientsMarquee.tsx; src/components/ExpertQuote.tsx; src/components/StatBox.tsx; src/components/FAQSchema.tsx; src/components/ContentChunk.tsx; src/index.css
- **Verification:** *(not run; requires in-browser visual QA to confirm gradients + colors match the reference)*

- **Time:** 2025-11-13 16:22 EST
- **Summary:** Rebuilt landing product sections into the two-column showcase layout (text stack, CTA, proof row, feature cards, and framed media) so each module matches the provided reference design.
- **Root Cause:** The landing product sections still used the older alternating column cards and didn’t resemble the requested layout.
- **Changed Files:** src/components/ProductContentSections.tsx
- **Verification:** *(not run; needs in-browser check to confirm spacing + nav pills align with the reference image)*

- **Time:** 2025-11-13 22:34 EST
- **Summary:** Reverted the landing product navigation back to the stacked/sticky link list so the new showcase cards keep the original feature jump list instead of the horizontal pill row.
- **Root Cause:** Emily asked to undo the navigation style change introduced with the showcase layout refresh.
- **Changed Files:** src/components/ProductContentSections.tsx
- **Verification:** *(not run; confirm the landing feature nav renders as the original vertical list with working anchors)*

- **Time:** 2025-11-13 22:48 EST
- **Summary:** Removed the border and internal padding from the landing showcase feature cards so the modules align flush with the new reference layout while keeping the glass blur + shadow treatment.
- **Root Cause:** Emily asked to strip the framing details from the refreshed cards to better match the provided mockup.
- **Changed Files:** src/components/ProductContentSections.tsx
- **Verification:** *(not run; visually confirm each showcase card is edge-to-edge without a border or inset padding)*

- **Time:** 2025-11-13 23:02 EST
- **Summary:** Added a Resources dropdown with a Remove Prototype Link entry (Lucide icon + mobile support) and shipped the dedicated resource page with CTA + SEO metadata.
- **Root Cause:** The top nav needed a Resources menu item pointing to a new Remove Prototype Link guide.
- **Changed Files:** src/components/Header.tsx; src/components/RemovePrototypeLinkPage.tsx; src/App.tsx; src/config/routes.ts; src/lib/iconUtils.ts; src/lib/seo.ts
- **Verification:** *(not run; verify the Resources dropdown opens on desktop/mobile and the new page renders at /resources/remove-prototype-link)*

- **Time:** 2025-11-13 23:09 EST
- **Summary:** Launched the Blog page with action-focused playbooks, added routing/SEO, and surfaced the Blog link inside the footer nav.
- **Root Cause:** Emily asked to add a blog and expose it through the footer navigation.
- **Changed Files:** src/components/BlogPage.tsx; src/App.tsx; src/components/Footer.tsx; src/config/routes.ts; src/lib/seo.ts
- **Verification:** *(not run; visit /blog and confirm the footer now shows Blog + Resources links)*

## 2025-11-14

- **Time:** 2025-11-14 01:10 EST
- **Summary:** Removed the opaque fills from the landing showcase cards and highlight chips so the modules sit directly on the gradient without extra white tiles.
- **Root Cause:** Landing cards still rendered white backgrounds even after Emily asked for bare, glass-only cards.
- **Changed Files:** src/components/ProductContentSections.tsx
- **Verification:** *(not run; visually confirm the landing cards no longer have white backgrounds)*

- **Time:** 2025-11-14 06:51 EST
- **Summary:** Limited blog article hero thumbnails to 60px and added slugged article routes so every blog card links to its post detail.
- **Root Cause:** The blog grid still showed oversized hero art (once assets were added) and none of the articles were clickable.
- **Changed Files:** src/components/BlogPage.tsx; src/components/BlogArticlePage.tsx; src/App.tsx; src/config/routes.ts; src/data/blogPosts.ts; public/blog/ops-rituals-card.svg; public/blog/design-systems-card.svg; public/blog/team-enablement-card.svg
- **Verification:** *(not run; load /blog plus a slugged article page to confirm the hero thumb height + routing)*

- **Time:** 2025-11-14 07:08 EST
- **Summary:** Detached the landing product feature navigation from the constrained container so the showcase cards can span the full page width.
- **Root Cause:** Keeping the sticky navigation inside the compact container forced the entire landing product section to stay at 70% width, preventing the requested full-width product content.
- **Changed Files:** src/components/ProductContentSections.tsx
- **Verification:** *(not run; visually confirm the landing product content stretches full width while the navigation remains sticky and aligned)*

- **Time:** 2025-11-14 07:20 EST
- **Summary:** Restored the landing showcase content to the compact container while letting the feature nav break out on desktop so the sticky list sits outside without shrinking the cards.
- **Root Cause:** The previous adjustment widened the entire content area, but Emily only wanted the navigation detached from the container so the product cards kept their original alignment.
- **Changed Files:** src/components/ProductContentSections.tsx
- **Verification:** *(not run; verify on desktop that the nav pins outside the container while the content stays within the compact width)*

- **Time:** 2025-11-14 07:28 EST
- **Summary:** Shifted the landing feature nav 24px right so the sticky column sits closer to the cards without overlapping the viewport edge.
- **Root Cause:** After breaking the nav out of the container it sat too far left, creating an awkward gutter against the page edge.
- **Changed Files:** src/components/ProductContentSections.tsx
- **Verification:** *(not run; check desktop layout to confirm the nav offset aligns with the showcase column)*

- **Time:** 2025-11-14 07:33 EST
- **Summary:** Pushed the breakout feature nav an additional 24px right so the sticky links align visually with the feature grid.
- **Root Cause:** The first offset still left the nav floating too far from the cards, so the column needed another small shift to line up with the showcase media.
- **Changed Files:** src/components/ProductContentSections.tsx
- **Verification:** *(not run; visually confirm the nav sits 212px off-center and lines up with the feature cards)*

- **Time:** 2025-11-14 07:36 EST
- **Summary:** Nudged the breakout feature nav another 16px right so the sticky column perfectly hugs the showcase grid edge.
- **Root Cause:** The nav column still felt slightly detached after the previous shift, so it needed one more 16px adjustment for even spacing.
- **Changed Files:** src/components/ProductContentSections.tsx
- **Verification:** *(not run; view the landing page to confirm the nav column now aligns with the feature content edge)*

- **Time:** 2025-11-14 07:45 EST
- **Summary:** Alternated the landing showcase cards so copy/media swap sides down the page, mirroring the product page alternating rule.
- **Root Cause:** Every landing card kept the same left/right layout, conflicting with Emily’s direction that product features should alternate their media and copy alignment.
- **Changed Files:** src/components/ProductContentSections.tsx
- **Verification:** *(not run; scroll through the landing product section to confirm each card alternates direction and nav anchors still align)*

- **Time:** 2025-11-14 13:20 EST
- **Summary:** Replaced the clients marquee text placeholders with the requested SVG brand logos and taught the resolver to map tokens (e.g., “Google Workspace”, “Electronic Arts”) to the new assets.
- **Root Cause:** The marquee still rendered uppercase text chips instead of the actual client logos shown in Emily’s reference screenshot, and the resolver couldn’t translate CMS-provided company names into branded artwork.
- **Changed Files:** src/components/ClientsMarquee.tsx; src/components/clientsLogoAssets.ts; src/components/clientsLogoResolver.ts; public/clients/*.svg; package-lock.json
- **Verification:** *(not run; open the landing marquee to confirm the SVG logos display, animate, and collapse to grayscale while anchor looping still works)*

## 2025-11-16

- **Time:** 2025-11-16 11:33 EST
- **Summary:** Forced the marquee logos to render as white glyphs and slowed the scroll animation so the row matches the provided reference pacing.
- **Root Cause:** Colored SVGs kept showing their native brand hues and the marquee moved too quickly, diverging from the “monochrome, relaxed marquee” spec in Emily’s screenshot feedback.
- **Changed Files:** src/index.css
- **Verification:** *(not run; view the marquee to ensure every logo appears white with subtle transparency and confirm the loop now scrolls noticeably slower without jitter)*

- **Time:** 2025-11-16 13:05 EST
- **Summary:** Matched the landing hero gradient and grid glow to the Payfast reference, keeping the grid lines while adding the colored vertical column beams.
- **Root Cause:** The hero background still used the older glow palette and lacked the magenta, purple, and amber column lines that appear across the top of the provided screenshot.
- **Changed Files:** src/index.css; src/components/LandingHero.tsx; src/components/ProductHero.tsx
- **Verification:** *(not run; requires in-browser visual comparison to confirm the gradients and new column lines align with the screenshot)*

- **Time:** 2025-11-14 10:32 EST
- **Summary:** Scoped every landing anchor and surface class to unique IDs (landing-features/pricing/waitlist) and centralized them in a shared config so nav links, hero CTAs, and bot-rendered HTML target the correct section without selector collisions.
- **Root Cause:** Generic markup (`#features`, `section-content`, etc.) was reused by product pages and landing demos, making it unclear which surface a link should scroll to and violating Emily’s request for surface-specific IDs/classes.
- **Changed Files:** src/config/sectionAnchors.ts; src/components/Features.tsx; src/components/Pricing.tsx; src/components/Waitlist.tsx; src/components/Hero.tsx; src/components/LandingHero.tsx; src/components/ProductHero.tsx; src/components/Header.tsx; src/components/Docs.tsx; src/components/BlogArticlePage.tsx; src/components/BlogPage.tsx; src/components/RemovePrototypeLinkPage.tsx; src/components/AIRenameVariantsPage.tsx; src/demos/line-assembly-demo.tsx; netlify/edge-functions/bot-detection.ts; default-content.json; clean-content.json; correct-content.json; current-default-content.json; fixed-content.json; src/data/products.json; test-results/ai-rename-variants-feature-8b06e-om-published-content-bundle/error-context.md; AGENTS.md
- **Verification:** *(not run; requires QA pass clicking hero/buttons/nav anchors plus bot HTML snapshots to ensure each link reaches the intended section)*

## 2025-11-17

- **Time:** 2025-11-17 05:58 EST
- **Summary:** Slowed the clients marquee, removed its gradient/border wrapper, and capped the loop to 10 logos to match the latest pacing and layout request.
- **Root Cause:** The marquee still scrolled faster than desired, carried a gradient background with borders, and showed more than the allowed ten logos.
- **Changed Files:** src/components/ClientsMarquee.tsx; src/index.css; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; visually confirm the marquee scrolls noticeably slower, sits on a clean background without borders, and only cycles through up to 10 logos before repeating)*

- **Time:** 2025-11-17 06:03 EST
- **Summary:** Pinned the landing hero gradient layers to the full section height and removed their scroll-coupled translations so the background stays fixed while the hero is in view.
- **Root Cause:** The hero gradient still shifted as the page scrolled and didn’t cover the entire hero height.
- **Changed Files:** src/index.css; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; scroll the landing hero to confirm the gradient and columns stay static and cover the full hero height)*

- **Time:** 2025-11-17 06:07 EST
- **Summary:** Removed the feature highlight card chrome (padding, background, border, shadow, blur) so the chip rows sit bare on the gradient.
- **Root Cause:** The feature grid cards still rendered a bordered, blurred tile with padding even after the ask to strip the chrome.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; visually confirm the four-up feature highlights render without background, border, padding, shadow, or blur)*

- **Time:** 2025-11-17 06:07 EST
- **Summary:** Removed backgrounds, borders, shadows, and blur from the marquee logo chips to leave only the logo row on the gradient.
- **Root Cause:** Logo pills still drew a tinted background with border and shadow, conflicting with the request for bare logos.
- **Changed Files:** src/components/ClientsMarquee.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; visually confirm marquee logos render without pill backgrounds, borders, shadows, or blur)*

- **Time:** 2025-11-17 06:08 EST
- **Summary:** Made the clients marquee animate only on hover so logos stay still until interacted with.
- **Root Cause:** The marquee continued auto-scrolling instead of remaining static until hover.
- **Changed Files:** src/index.css; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; load the marquee and confirm logos are still by default and start scrolling only when hovered)*

- **Time:** 2025-11-17 06:08 EST
- **Summary:** Shortened the landing hero height by 120px so the section no longer overextends below the fold.
- **Root Cause:** The hero still consumed the extra 120px at the bottom after the background adjustments.
- **Changed Files:** src/index.css; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; check the landing hero height to confirm 120px has been removed from the bottom)*

- **Time:** 2025-11-17 06:08 EST
- **Summary:** Reduced the clients logo section offset by 48px and centered the marquee horizontally.
- **Root Cause:** The logo section sat 96px below the previous block and the marquee aligned left instead of centered.
- **Changed Files:** src/components/ClientsMarquee.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; confirm the section sits 48px higher and the logo row is centered)*

- **Time:** 2025-11-17 06:09 EST
- **Summary:** Pulled the clients logo section up by an additional 32px to tighten vertical spacing beneath the preceding block.
- **Root Cause:** The section still sat lower than desired after the first 48px reduction.
- **Changed Files:** src/components/ClientsMarquee.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; confirm the marquee section now starts 32px closer relative to the previous spacing)*

- **Time:** 2025-11-17 06:10 EST
- **Summary:** Trimmed 48px from the landing hero’s bottom padding to tighten the fold alignment.
- **Root Cause:** The hero still left extra space at the bottom even after height adjustments.
- **Changed Files:** src/index.css; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; confirm the landing hero ends 48px higher at the bottom edge)*

- **Time:** 2025-11-17 06:37 EST
- **Summary:** Removed backgrounds, borders, and shadows from landing showcase cards and their media frames so the sections sit directly on the gradient.
- **Root Cause:** Landing feature cards still rendered gradient fills, borders, and heavy shadows despite the request for bare cards.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; visually confirm landing showcase cards and media frames have no background, border, or shadow while spacing remains intact)*

- **Time:** 2025-11-17 06:39 EST
- **Summary:** Stacked the social proof headline under the star row inside landing feature cards to match the requested layout.
- **Root Cause:** The “Join Designers shipping faster with BiblioKit” line sat beside the stars instead of underneath.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; visually confirm stars sit on their own line with the headline directly beneath)*

- **Time:** 2025-11-17 06:43 EST
- **Summary:** Replaced the generic social proof copy on landing cards with product-tailored one-line metrics (e.g., “1,283 components fixed”, “10+ hours saved”).
- **Root Cause:** The cards still showed the generic “Join Designers…” text and paragraph instead of concise product-specific metrics.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; visually confirm each landing card shows a single-line metric beneath the stars tailored to the product)* 

- **Time:** 2025-11-17 06:49 EST
- **Summary:** Removed an additional 64px of bottom padding from the landing hero to further tighten the fold.
- **Root Cause:** The hero still carried extra space at the bottom after the previous trim.
- **Changed Files:** src/index.css; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; confirm the landing hero ends 64px higher than before at the bottom edge)*

- **Time:** 2025-11-17 06:56 EST
- **Summary:** Removed top and bottom padding from landing feature cards so the first card aligns with the left nav and overall vertical spacing tightens.
- **Root Cause:** Card padding kept the feature stack sitting lower than the side navigation.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; visually confirm the first card aligns with the nav top and cards have no vertical padding)* 

- **Time:** 2025-11-17 06:58 EST
- **Summary:** Removed another 32px of bottom padding from the landing hero to tighten the fold further.
- **Root Cause:** Extra space remained at the hero’s bottom edge after prior reductions.
- **Changed Files:** src/index.css; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; confirm the hero ends 32px higher and abuts the next section cleanly)*

- **Time:** 2025-11-17 06:59 EST
- **Summary:** Removed another 32px of bottom padding from the landing hero (total -176px from base clamp) to fully tighten the fold.
- **Root Cause:** A bit of extra space persisted even after previous trims.
- **Changed Files:** src/index.css; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; confirm the hero bottom edge is 32px higher and transitions cleanly)*

- **Time:** 2025-11-17 07:00 EST
- **Summary:** Removed an additional 64px of bottom padding from the landing hero (total -240px from base clamp) to eliminate remaining fold slack.
- **Root Cause:** The hero still had visible space at the bottom after prior reductions.
- **Changed Files:** src/index.css; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; confirm the hero now ends 64px higher and flows cleanly into the next section)*

- **Time:** 2025-11-17 07:04 EST
- **Summary:** Reduced the landing hero min-height and zeroed bottom padding (now clamp 496-916px, 0 bottom padding) to ensure the fold visibly tightens.
- **Root Cause:** Remaining bottom space wasn’t affected by prior padding reductions due to min-height and residual padding.
- **Changed Files:** src/index.css; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; confirm the hero sits shorter with no bottom padding and flows cleanly into the next section)*

- **Time:** 2025-11-17 07:07 EST
- **Summary:** Removed hero background color lines and switched the grid to subtle white lines at 10% opacity.
- **Root Cause:** Colored vertical beams still appeared in the hero background instead of the requested low-opacity white grid.
- **Changed Files:** src/index.css; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; visually confirm colored beams are gone and the hero shows faint white grid lines only)*

- **Time:** 2025-11-17 07:09 EST
- **Summary:** Added soft pink, peach, and light blue radial glows to the top of the hero with blurred falloff for the background.
- **Root Cause:** The top of the hero lacked the requested gentle colored glows.
- **Changed Files:** src/index.css; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; visually confirm faint pink/peach/blue glows at the top of the hero with soft blur)*

- **Time:** 2025-11-17 07:12 EST
- **Summary:** Tightened the hero glows (smaller radii, higher opacity) so the pink/peach/blue gradients read more clearly instead of blurring away.
- **Root Cause:** The new glows were too diffused and subtle after the previous pass.
- **Changed Files:** src/index.css; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; visually confirm the top glows are more apparent while still soft)* 

- **Time:** 2025-11-17 07:13 EST
- **Summary:** Increased the hero grid line opacity to 20% so the white grid is more visible while keeping the background subtle.
- **Root Cause:** The 10–12% grid opacity was too faint to notice after the color adjustments.
- **Changed Files:** src/index.css; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; visually confirm the white grid lines are clearer without overpowering the hero)* 

- **Time:** 2025-11-17 07:16 EST
- **Summary:** Swapped hero CTA buttons to a solid hot pink (shared primary class) to replace the previous gradients.
- **Root Cause:** Buttons still rendered as multicolor gradients instead of a single hot pink fill.
- **Changed Files:** src/components/heroConstants.ts; src/components/LandingHero.tsx; src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; visually confirm all hero primary buttons render as solid hot pink with no gradient)* 

- **Time:** 2025-11-17 07:18 EST
- **Summary:** Tightened hero primary button radius to 8px to match the solid hot pink style.
- **Root Cause:** Buttons still used pill corners after switching to the single-color fill.
- **Changed Files:** src/components/heroConstants.ts; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; visually confirm hero primary buttons now have 8px corners)* 

- **Time:** 2025-11-17 09:37 EST
- **Summary:** Removed the “Coming Soon” badge from Component Auditor and ensured the Blog link always appears in the top nav.
- **Root Cause:** The dropdown still showed the coming-soon badge and the Blog link was missing from the header.
- **Changed Files:** src/components/Header.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open the header and confirm Component Auditor has no badge and Blog is present in nav links)* 

- **Time:** 2025-11-17 09:48 EST
- **Summary:** Pointed the Component Auditor nav item to the Figma Community listing and marked it external.
- **Root Cause:** The header link still used the old internal route instead of the Figma plugin URL.
- **Changed Files:** src/components/Header.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; click Component Auditor in the Plugins dropdown and confirm it opens the Figma listing in a new tab)* 

- **Time:** 2025-11-17 09:52 EST
- **Summary:** Updated navigation copy to “Try Plugin for Free” and aligned the Component Auditor card CTA to the Figma listing with the same CTA label.
- **Root Cause:** The nav still said “Plugins” and the card CTA pointed to the old route with the “Learn More” label.
- **Changed Files:** src/data/products.json; src/components/Header.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; confirm the nav reads “Try Plugin for Free” and the Component Auditor card button says “Try Plugin for Free” linking to the Figma listing)* 

- **Time:** 2025-11-17 07:22 EST
- **Summary:** Added a persistent Blog link to the top nav when missing.
- **Root Cause:** The header navigation lacked a Blog entry.
- **Changed Files:** src/components/Header.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; load the header and confirm “Blog” appears in the nav links)* 

- **Time:** 2025-11-17 09:54 EST
- **Summary:** Restored the nav label to “Plugins”, kept the Component Auditor link pointing to the Figma listing, and embedded the provided before/after rename video on the AI Rename Variants card.
- **Root Cause:** The nav copy drifted to “Try Plugin for Free,” the Component Auditor CTA needed the public Figma URL, and the AI Rename card lacked the supplied video.
- **Changed Files:** src/components/Header.tsx; src/data/products.json; public/media/rename-variants-before-after-loop-380.webm; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; confirm the nav reads “Plugins,” the Component Auditor dropdown opens the Figma listing, and the AI Rename card renders the new webm video)* 

- **Time:** 2025-11-17 11:39 EST
- **Summary:** Matched the Blog pages and Remove Prototype Link resource to the landing page styling with LandingHero headers, gradient surfaces, and updated CTA copy.
- **Root Cause:** Non-landing pages still used the older white layouts and typography, breaking the consistent landing visual style Emily requested across the site.
- **Changed Files:** src/components/BlogPage.tsx; src/components/BlogArticlePage.tsx; src/components/RemovePrototypeLinkPage.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; verify the Blog list, Blog article, and Remove Prototype Link pages now render the landing-style hero/gradient surfaces and CTAs)* 

- **Time:** 2025-11-17 11:41 EST
- **Summary:** Swapped blog hero thumbnails to real-world product scenes (photos) instead of abstract illustrations so the articles feel more grounded.
- **Root Cause:** Blog posts still used illustrative SVG cards, which didn’t match the requested more appropriate imagery for the hero slots.
- **Changed Files:** src/data/blogPosts.ts; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; load blog list/article pages and confirm photos render in hero slots without illustration assets)* 

- **Time:** 2025-11-17 12:01 EST
- **Summary:** Removed the blog hero component and applied the landing hero background directly to the main blog content section so the list inherits the hero’s gradient without rendering a separate hero.
- **Root Cause:** The blog page still showed its own hero section; Emily requested removing it and reusing the hero background on the primary content block.
- **Changed Files:** src/components/BlogPage.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open /blog and confirm no hero banner renders while the first section carries the landing gradient background)* 

- **Time:** 2025-11-17 12:15 EST
- **Summary:** Removed photo-based blog hero thumbnails and restored product-relevant SVG artwork with precise alt text for each article.
- **Root Cause:** The photo placeholders didn’t fit the SaaS/design plugin positioning and felt like FPO content.
- **Changed Files:** src/data/blogPosts.ts; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; load blog list/article pages and confirm SVG artwork displays without photo thumbnails and alt text reflects the subject of each post)* 

- **Time:** 2025-11-17 12:18 EST
- **Summary:** Removed blog card hero images entirely so list and “latest drops” tiles focus on copy without FPO-style visuals.
- **Root Cause:** Image slots on blog cards still felt like filler and didn’t reflect BiblioKit’s SaaS/plugin positioning.
- **Changed Files:** src/components/BlogPage.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open /blog and confirm cards show text-only without thumbnail blocks)* 

- **Time:** 2025-11-17 12:24 EST
- **Summary:** Removed the “Latest drops” sidebar and expanded the hero-gradient blog intro to full width with a single featured article card.
- **Root Cause:** The split grid kept a right rail and separate list; Emily asked to remove “Latest drops” and make the left side span full width.
- **Changed Files:** src/components/BlogPage.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open /blog and confirm the gradient section is single-column with one featured article and no Latest Drops column)* 

- **Time:** 2025-11-17 15:53 EST
- **Summary:** Hid illustration/media blocks from product page feature cards so the sections render as text-only modules.
- **Root Cause:** Product page card sections still surfaced the illustrated media panels that Emily asked to remove.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open any product page feature section and confirm cards no longer show illustration frames)* 

- **Time:** 2025-11-17 15:54 EST
- **Summary:** Removed top padding from product page hero sections so the hero aligns snugly at the top without extra vertical spacing.
- **Root Cause:** Product hero layouts still included top padding, keeping the hero offset down the page.
- **Changed Files:** src/components/ProductHero.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open a product page and confirm the hero starts flush at the top with no extra top padding)* 

- **Time:** 2025-11-17 16:15 EST
- **Summary:** Pointed the Atlassian Design System blog post back to the original doc title and opening description so the article surfaces canonical copy.
- **Root Cause:** The blog entry metadata used rewritten marketing copy (“Boost UX…” + a shortened summary) instead of the source doc text, causing mismatch between the page and the original article.
- **Changed Files:** src/data/blogPosts.ts; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; confirm the Atlassian blog card and article hero show the “Enhancing User Experience with Atlassian Design System” title with the opening paragraph as the description)*

- **Time:** 2025-11-17 16:27 EST
- **Summary:** Set blog articles to emit `og:type=article` and attach Article JSON-LD (headline/description/image, linked to site org) for proper SEO semantics.
- **Root Cause:** Blog pages were treated as generic web pages in metadata and structured data, which weakens article discoverability and preview accuracy.
- **Changed Files:** src/lib/seo.ts; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; load any /blog/{slug} page and confirm og:type is article and JSON-LD includes an Article node with headline/description/image)*

- **Time:** 2025-11-17 16:38 EST
- **Summary:** Aligned the Remove Prototype Links blog entry metadata with the source doc by setting the title/metaTitle and excerpt/metaDescription to the original opening paragraph.
- **Root Cause:** The post still used rewritten marketing copy for its title/description, diverging from the original article text.
- **Changed Files:** src/data/blogPosts.ts; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open /blog and /blog/remove-prototype-links-in-figma to confirm the card and hero show “How to Remove Prototype Links in Figma” with the first paragraph as the summary)*

- **Time:** 2025-11-17 16:22 EST
- **Summary:** Added an auto-generated (max 3 sentences) article summary under each blog title and removed the CTA buttons from blog article pages.
- **Root Cause:** Blog articles needed inline summaries based on their content and the page still showed CTA buttons that should be removed.
- **Changed Files:** src/components/BlogArticlePage.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open any /blog/{slug} page to confirm the summary appears under the title and no CTA buttons render)*

- **Time:** 2025-11-17 16:47 EST
- **Summary:** Kept blog titles pure by moving the auto summary into the hero description (not the heading) so the title doesn’t get replaced by the summary text.
- **Root Cause:** The summary was passed as a subtitle into the hero component, which rendered it inside the heading block, making the summary appear as the title.
- **Changed Files:** src/components/BlogArticlePage.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open any /blog/{slug} page to confirm the H1 shows only the title and the summary sits beneath it)*

- **Time:** 2025-11-17 17:00 EST
- **Summary:** Removed the white background fill from the blog article content container so posts sit on the gradient without the bg overlay.
- **Root Cause:** Blog articles still rendered a bg-white/85 layer on the content wrapper, conflicting with the request to strip background color.
- **Changed Files:** src/components/BlogArticlePage.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open any blog article and confirm the content wrapper no longer has a white background fill)*

- **Time:** 2025-11-17 17:05 EST
- **Summary:** Removed the blog article hero image/illustration block so only source-doc images (when provided) appear; prevents default SVG/photo art from showing.
- **Root Cause:** Blog posts were still rendering bundled illustrations instead of limiting visuals to the original Google Doc assets.
- **Changed Files:** src/components/BlogArticlePage.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open any blog article and confirm no hero illustration renders above the content)*

- **Time:** 2025-11-17 17:28 EST
- **Summary:** Removed the border and set the article container to be fully responsive (full width on mobile, 600px min only on larger screens) while keeping the gradient background.
- **Root Cause:** Blog article wrapper still showed a border and enforced a 600px min width on all breakpoints, making the layout feel boxed and non-responsive on small screens.
- **Changed Files:** src/components/BlogArticlePage.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open any blog article on mobile/desktop to confirm no border and the container adapts width while respecting the 600px min on larger screens)*

- **Time:** 2025-11-17 16:29 EST
- **Summary:** Rewrote the blog description (under the title) for the Remove Prototype Links post into a three-sentence summary while leaving the body content unchanged.
- **Root Cause:** The under-title description needed a concise three-sentence summary rather than the full original intro paragraph.
- **Changed Files:** src/data/blogPosts.ts; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open /blog/remove-prototype-links-in-figma to confirm the summary under the title shows the new three-sentence description)*

- **Time:** 2025-11-17 16:35 EST
- **Summary:** Set blog article containers to a responsive 648px minimum width on larger screens while staying fluid on mobile.
- **Root Cause:** The article layout still used a 600px min width; needed to align to the updated 648px spec without breaking small-screen responsiveness.
- **Changed Files:** src/components/BlogArticlePage.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open any blog article and confirm the container respects a ~648px min width on desktop while shrinking on mobile)*

- **Time:** 2025-11-17 16:40 EST
- **Summary:** Added left-aligned hero descriptions for blog articles by allowing LandingHero to accept alignment and setting blog posts to left-align.
- **Root Cause:** Blog hero descriptions were centered; requirement is to left-align the under-title description on blog posts without affecting other pages.
- **Changed Files:** src/components/LandingHero.tsx; src/components/BlogArticlePage.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open any blog article and confirm the title stays as H1 with the summary left-aligned beneath it while other pages remain centered)*

- **Time:** 2025-11-17 16:34 EST
- **Summary:** Added Google Doc images into the Remove Prototype Links post, introduced an `image` content block with renders, and pointed the hero/OG image to the doc asset; kept all non-doc art removed.
- **Root Cause:** Blog posts needed to display only the source-doc visuals; images were absent after illustration removal, and the content model lacked image blocks.
- **Changed Files:** src/data/blogPosts.ts; src/components/BlogArticlePage.tsx; public/blog/remove-prototype-links/*; docs/live-debug/LIVE_DEBUG_2025-11.md; AGENTS.md
- **Verification:** *(not run; open /blog/remove-prototype-links-in-figma to confirm doc images appear in-content with captions, hero OG uses the doc image, and layout remains borderless/left-aligned)*

- **Time:** 2025-11-17 16:50 EST
- **Summary:** Removed left/right padding from blog article content container while keeping vertical padding.
- **Root Cause:** Blog article body still had horizontal padding; request was to strip side padding.
- **Changed Files:** src/components/BlogArticlePage.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open any blog article to confirm the container has no horizontal padding but retains top/bottom spacing)*

- **Time:** 2025-11-17 16:52 EST
- **Summary:** Shortened the Remove Prototype Links blog description to two sentences for the under-title summary while keeping the article body unchanged.
- **Root Cause:** The description beneath the title still used three sentences; requirement was to limit it to two.
- **Changed Files:** src/data/blogPosts.ts; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open /blog/remove-prototype-links-in-figma to confirm the summary under the title is now two sentences)*

- **Time:** 2025-11-17 16:35 EST
- **Summary:** Shortened the LandingHero bottom space by adding responsive padding (pb-16 md:pb-20) to tighten the hero footprint.
- **Root Cause:** The hero needed 64px less vertical space at the bottom to fit the updated layout spec.
- **Changed Files:** src/components/LandingHero.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open any page using LandingHero to confirm the hero is shorter at the bottom across breakpoints)*

- **Time:** 2025-11-17 16:35 EST
- **Summary:** Reduced hero height by lowering the landing hero min-height by 64px and removed the extra bottom padding override so layout shortens as requested.
- **Root Cause:** Padding utilities were overridden by the existing hero styles; the hero remained too tall at the bottom due to min-height constraints.
- **Changed Files:** src/index.css; src/components/LandingHero.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open any page using LandingHero to confirm the hero is ~64px shorter at the bottom and no extra bottom padding is applied)*

- **Time:** 2025-11-17 16:59 EST
- **Summary:** Allowed headings to specify levels (h1–h6) and set the “Plan/Review/Naming” subsections in the Figma prototype article to h4 for proper hierarchy.
- **Root Cause:** Subheadings rendered as h3; needed h4 for the specified subsections.
- **Changed Files:** src/data/blogPosts.ts; src/components/BlogArticlePage.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open /blog/remove-prototype-links-in-figma and inspect “Plan Your Interactions,” “Regularly Review Your Prototype,” and “Use Naming Conventions” render as h4)*

- **Time:** 2025-11-17 17:05 EST
- **Summary:** Bolded the lead term before the colon on all list items (ordered/unordered) so entries like “Link Manager:” render with a bold label.
- **Root Cause:** List entries displayed plain text; requirement was to bold the entry word preceding the colon.
- **Changed Files:** src/components/BlogArticlePage.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open /blog/remove-prototype-links-in-figma and confirm list items show the leading word/phrase before the colon in bold across bullets and numbered steps)*

- **Time:** 2025-11-17 17:12 EST
- **Summary:** Fixed contrast for blog content on the dark background by switching article text to white/white-80/white-60 and updating container text color.
- **Root Cause:** Content text was set to slate-900 on a dark gradient background, failing contrast requirements.
- **Changed Files:** src/components/BlogArticlePage.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open any blog article to confirm body, lists, headings, and captions render in white variants with clear contrast on the dark background)*

- **Time:** 2025-11-17 17:18 EST
- **Summary:** Increased line height for blog paragraphs and list items to improve readability on dark backgrounds.
- **Root Cause:** Content text was tight, reducing legibility on the dark theme.
- **Changed Files:** src/components/BlogArticlePage.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open any blog article to confirm paragraphs and lists use the taller line height)*

- **Time:** 2025-11-17 23:31 EST
- **Summary:** Renamed the Figma prototype links blog post to “Remove Figma Prototype Links: A Guide by BiblioKit (2025)” across title, slug content, and metaTitle.
- **Root Cause:** Requested title update to the new naming.
- **Changed Files:** src/data/blogPosts.ts; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open /blog/remove-prototype-links-in-figma to confirm the new title/meta render)* 
- **Time:** 2025-11-17 17:50 EST
- **Summary:** Removed the landing page product card callouts so the compact feature grid no longer displays the extra highlight rows.
- **Root Cause:** The landing product cards still rendered the callout grid (`mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4`) even though the page should keep the cards minimal.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open the landing page features section and confirm product cards no longer show the callout grid beneath the showcases)*

- **Time:** 2025-11-17 17:52 EST
- **Summary:** Documented override guidance in AGENTS so Emily can explicitly request alternate images (e.g., Google search) for a post despite the default “use Google Doc images” rule.
- **Root Cause:** Needed to clarify that explicit requests from Emily can override the default doc-image requirement.
- **Changed Files:** AGENTS.md; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; policy update only—no runtime impact)*

- **Time:** 2025-11-17 17:56 EST
- **Summary:** Standardized all product feature CTAs to read “Try Product For Free,” covering landing and AI Rename Variants sources.
- **Root Cause:** CTA labels mixed product-specific phrasing, and requirement is a single consistent “Try Product For Free” label across product buttons.
- **Changed Files:** src/components/ProductContentSections.tsx; src/data/products.json; src/components/AIRenameVariantsPage.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; verify landing and product feature CTAs all display “Try Product For Free” regardless of product title)*

- **Time:** 2025-11-17 18:05 EST
- **Summary:** Swapped the abstract gradient avatars in product social proof rows with person image avatars.
- **Root Cause:** Social proof used gradient circles; request was to show people instead of abstract shapes.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open any product feature section and confirm four distinct person avatars appear before the “+” badge)*

- **Time:** 2025-11-17 18:09 EST
- **Summary:** Removed horizontal padding from the media column in landing product sections so showcase media sits flush left/right.
- **Root Cause:** The landing feature media column had side padding from `p-4 sm:p-6`; requirement was to drop left/right padding on the `w-full lg:order-1` container.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; on the landing page, confirm product section media touches the column edges with only vertical padding remaining)*

- **Time:** 2025-11-17 17:55 EST
- **Summary:** Wired the rename variants product card media to play the before/after WebM video in the showcase slot.
- **Root Cause:** The rename variants feature used the video media type but lacked video rendering support in the product card component.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open the rename variants product card and confirm the `/media/rename-variants-before-after-loop-380.webm` video plays inline in the media area)*

- **Time:** 2025-11-17 18:12 EST
- **Summary:** Increased landing hero grid line opacity by ~10% for better visibility.
- **Root Cause:** The hero grid overlay was too faint at 20% opacity; requested a 10% boost.
- **Changed Files:** src/index.css; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; refresh the landing hero and confirm the grid lines are slightly more pronounced without overpowering the background)*

- **Time:** 2025-11-17 19:33 EST
- **Summary:** Restored the sitemap.xml redirect to the Netlify function so crawlers receive XML instead of the SPA HTML shell.
- **Root Cause:** `public/_redirects` lacked the `/sitemap.xml` rule, so Netlify fell through to the SPA catch-all and served `index.html`, triggering the “Sitemap is HTML” error.
- **Changed Files:** public/_redirects
- **Verification:** *(not run; after deploy, curl `https://www.bibliokit.com/sitemap.xml` and confirm a 200 response with `Content-Type: application/xml` and the URL entries instead of HTML)*

- **Time:** 2025-11-17 19:59 EST
- **Summary:** Re-enabled SSR edge rendering, aligned canonical host/assets, expanded sitemap and AI sitemap coverage, and injected JSON-LD on client navigations to restore SEO signals.
- **Root Cause:** Bots were served the SPA shell without route-specific metadata because the SSR edge function was disabled; the sitemap/AI sitemap pointed at dead URLs and missed live pages; OG/logo assets referenced in meta tags were missing; client navigations dropped structured data.
- **Changed Files:** netlify.toml; netlify/functions/sitemap.ts; public/llms.txt; public/robots.txt; public/og/og-default.svg; public/logo.svg; index.html; src/lib/seo.ts; src/components/AIRenameVariantsPage.tsx; src/components/DynamicProductPage.tsx; tests/unit/sitemap.spec.ts; tests/unit/updatePageMetadataStructuredData.spec.ts; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** `node --test tests/unit/sitemap.spec.ts tests/unit/updatePageMetadataStructuredData.spec.ts` (pass); *(post-deploy: curl key routes like `/ai-rename-variants` and `/blog/remove-prototype-links-in-figma` to confirm SSR HTML carries canonical + JSON-LD and OG assets resolve at 200)*

- **Time:** 2025-11-17 20:26 EST
- **Summary:** Swapped the landing product card avatar stack to real people photos instead of the abstract SVG circles.
- **Root Cause:** Social proof rows on product cards still showed vector placeholders; requirement is to show real human photos on product pages.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open any landing product card and confirm four distinct photo avatars appear before the “+” badge)*

- **Time:** 2025-11-17 20:34 EST
- **Summary:** Renamed all product CTA buttons to “Try Plugin For Free” so plugin terminology is consistent across landing and product pages.
- **Root Cause:** Buttons still used the older “Try Product For Free” label after the latest copy direction to call out plugins explicitly.
- **Changed Files:** src/components/ProductContentSections.tsx; src/components/AIRenameVariantsPage.tsx; src/data/products.json; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; load landing product cards and AI Rename Variants page to confirm all CTA buttons read “Try Plugin For Free” and still link correctly)*

- **Time:** 2025-11-17 20:42 EST
- **Summary:** Added 24px extra gap between content and media columns in landing product cards to give the image breathing room.
- **Root Cause:** The landing product feature grid spacing was too tight, leaving content and media crowded together.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; on landing product cards, confirm increased horizontal spacing between the text stack and the media block on large screens)*

- **Time:** 2025-11-17 20:48 EST
- **Summary:** Pointed the Plugins dropdown “AI Rename Variants” link directly to the Figma plugin listing.
- **Root Cause:** The dropdown linked to the internal product page instead of the requested Figma Community plugin URL.
- **Changed Files:** src/data/products.json; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open the header Plugins dropdown and confirm “AI Rename Variants” navigates to the Figma plugin link in a new tab/window)*

- **Time:** 2025-11-18 04:47 EST
- **Summary:** Updated landing product card CTAs to read “Try \"<Product Name>\" For Free,” inserting each product name automatically.
- **Root Cause:** Landing product cards still used the generic “Try Plugin For Free” label instead of product-specific CTA copy.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; on the landing page, confirm each product card CTA shows its product name inside quotes and links as before)*

- **Time:** 2025-11-18 04:50 EST
- **Summary:** Applied product-specific CTA labels to all product feature cards so buttons read “Try \"<Product Name>\" For Free.”
- **Root Cause:** Default product cards still used the generic plugin label instead of inserting the product name.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; check any product feature card on non-landing layouts to confirm the CTA includes the product name and links correctly)*

- **Time:** 2025-11-18 04:52 EST
- **Summary:** Fixed product card CTAs to pull each card title (e.g., "Component Auditor") so button text matches the visible card.
- **Root Cause:** CTA copy referenced the parent product title ("Your Design Toolkit, Reinvented."), causing mismatched labels on cards.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; on landing and product feature cards, confirm buttons read `Try "<Card Title>" For Free` and still link correctly)*

- **Time:** 2025-11-18 04:54 EST
- **Summary:** Removed quotation marks from product card CTAs so buttons read `Try Product Name For Free` without quotes.
- **Root Cause:** CTA labels included quotes around product names, which didn’t match the requested styling.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; reload product cards to confirm buttons show the product name without surrounding quotes and still link correctly)*

- **Time:** 2025-11-18 04:55 EST
- **Summary:** Replaced landing product card social-proof avatars with real person photos (Unsplash) instead of SVG placeholders.
- **Root Cause:** Landing page product cards still showed vector avatar placeholders; requirement is to use real people photos.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; reload landing product cards and confirm all stacked avatars show real portraits)*

- **Time:** 2025-11-18 04:57 EST
- **Summary:** Swapped all landing product card avatars to a single reliable set of Unsplash portraits to avoid broken images.
- **Root Cause:** Some remote avatar URLs failed to load, leaving blank placeholders on landing product cards.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; reload landing product cards and confirm all avatar rings show four photo portraits without broken images)*

- **Time:** 2025-11-18 05:00 EST
- **Summary:** Standardized landing product avatars to four face-cropped Unsplash portraits and added a fallback image handler to prevent broken avatar slots.
- **Root Cause:** Some remote avatar URLs failed to load, leaving missing images in the social proof stack.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; reload landing product cards and confirm all four avatar slots render faces, with no broken images even if a request fails)*

- **Time:** 2025-11-18 05:05 EST
- **Summary:** Replaced duplicate avatars with four unique Unsplash portraits per stack to ensure every landing product card shows distinct faces.
- **Root Cause:** Avatar sets reused images, leading to duplicates and occasional broken slots in the social proof row.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; reload landing product cards and confirm four distinct portraits appear with no broken images)*

- **Time:** 2025-11-18 05:12 EST
- **Summary:** Locked avatar stacks to four unique primary portraits with per-slot fallbacks to guarantee distinct faces and prevent duplicates/broken images on landing product cards.
- **Root Cause:** Remote avatar set reused images across slots and occasional load failures caused repeated fallback portraits.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; reload landing product cards and confirm four distinct faces render per stack, with no duplicates or broken images)*

- **Time:** 2025-11-18 05:19 EST
- **Summary:** Swapped avatar stack to four casual, unique portraits with distinct fallbacks per slot to eliminate duplicates and missing rightmost avatar.
- **Root Cause:** Prior portrait set reused professional shots and some failed to load, leaving duplicate or empty avatar slots.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; reload landing product cards and confirm four casual, distinct faces render; rightmost avatar no longer missing)*

- **Time:** 2025-11-18 05:25 EST
- **Summary:** Removed the trailing “+” badge and now render four photo avatars so the far-right slot always shows an image in landing product social proof.
- **Root Cause:** The avatar stack ended with a plus badge instead of a real photo, leaving the rightmost position without an image.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; reload landing product cards and confirm all four avatar slots show photos with no trailing “+” badge)*

- **Time:** 2025-11-18 05:31 EST
- **Summary:** Added a Resources dropdown link to the “Remove Prototype Links” Figma plugin alongside the existing guide link.
- **Root Cause:** Resources menu lacked a direct install link for the Remove Prototype Links plugin.
- **Changed Files:** src/components/Header.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open the header Resources dropdown and confirm a new external item points to the plugin link)*

- **Time:** 2025-11-18 05:34 EST
- **Summary:** Simplified Resources dropdown to only include the external “Remove Prototype Links” Figma plugin entry.
- **Root Cause:** The dropdown listed both the internal guide and the plugin; request was to keep only the plugin link.
- **Changed Files:** src/components/Header.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open the Resources dropdown and confirm only the plugin link remains)*

- **Time:** 2025-11-18 05:41 EST
- **Summary:** Restyled blog FAQs to match the article width and removed the card background/border so the FAQ block sits flush with the content column.
- **Root Cause:** FAQ section used a bordered card with narrower width, breaking visual alignment with article content.
- **Changed Files:** src/components/BlogArticlePage.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open any blog post with FAQs and confirm the FAQ block aligns to the content width with no card background or border)*

- **Time:** 2025-11-18 08:03 EST
- **Summary:** Added the Remove Plugin Links Figma plugin to the landing product lineup with focused bullets and CTA to the install link.
- **Root Cause:** The landing page product grid was missing the requested Remove Plugin Links plugin promotion.
- **Changed Files:** src/data/products.json; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open the landing product section and confirm the Remove Plugin Links card appears with a CTA pointing to the Figma plugin link)*

- **Time:** 2025-11-18 12:34 EST
- **Summary:** Numbered each FAQ question badge so visitors can scan and reference items by their order in the list.
- **Root Cause:** FAQs previously used a generic “Q” marker without numbering, making it harder to cite specific questions.
- **Changed Files:** src/components/FAQSchema.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open any FAQs section and confirm each question shows a numbered badge on the left)* 

- **Time:** 2025-11-18 14:19 EST
- **Summary:** Added numbered badges to blog FAQs so each question shows its index on the left.
- **Root Cause:** Blog FAQ items used plain text without numbered markers, so numbers were not visible in that context.
- **Changed Files:** src/components/BlogArticlePage.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open any blog article with FAQs and confirm each question displays a numbered badge on the left)* 

- **Time:** 2025-11-22 17:40 EST
- **Summary:** Removed avatar stacks and statistic blocks from product sections so they only show feature content and testimonials without profile imagery or stat callouts.
- **Root Cause:** Product sections were still surfacing avatars and stats that are no longer desired in the layout.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open any product page and confirm feature cards no longer show avatar rows and the stats section no longer appears above the benefits/testimonials)*

- **Time:** 2025-11-22 18:20 EST
- **Summary:** Renamed the landing product card to “BiblioClean: Remove Prototype Links & Blue Lines,” refreshed its copy and CTA, and added the new BiblioClean Figma link to the header dropdown.
- **Root Cause:** The landing card and header still referenced the older “Remove Plugin Links” name and URL, missing the updated BiblioClean messaging and install link.
- **Changed Files:** src/data/products.json; src/components/Header.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open the landing product grid to see the BiblioClean title, bullets, and CTA pointing to the new Figma link, and check the header Resources/Plugins dropdown for the external BiblioClean plugin link)*

- **Time:** 2025-11-22 18:45 EST
- **Summary:** Renamed Component Auditor to “BiblioAudit: Find Detached Instances & Design System Check,” refreshed its product bullets and CTA, and updated the Plugins dropdown with the new QA-focused copy.
- **Root Cause:** The product card and nav listing still used the old Component Auditor name and messaging instead of the updated BiblioAudit positioning and link text.
- **Changed Files:** src/data/products.json; src/components/Header.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open the landing product grid to see the BiblioAudit title, bullets, and “Install BiblioAudit” CTA, and check the header Plugins dropdown for the BiblioAudit link/description pointing to the Figma listing)*

## 2025-11-23

- **Time:** 2025-11-23 20:18:04 EST
- **Summary:** Updated the BiblioClean product card title, tagline, CTA, and description to match the OPS lane SEO + conversion copy (“The Blue Line Wiper,” “Remove Links - Free”) while keeping the install link intact.
- **Root Cause:** The card still used the prior “Remove Prototype Links & Blue Lines” naming and CTA, which didn’t match the requested OPS product copy and conversion-focused button label.
- **Changed Files:** src/data/products.json
- **Verification:** *(not run; copy-only content update)*

- **Time:** 2025-11-23 20:22:12 EST
- **Summary:** Refreshed all landing product cards and header plugin labels to the OPS SEO + conversion copy (BiblioRename, BiblioAudit, BiblioClean, BiblioTable) and CTAs (“Rename Layers,” “Run Health Check,” “Remove Links - Free,” “Fix My Table”).
- **Root Cause:** Product cards and nav still used legacy names, descriptions, and CTAs instead of the new OPS lane copy.
- **Changed Files:** src/data/products.json; src/components/Header.tsx
- **Verification:** *(not run; copy-only content update)*

- **Time:** 2025-11-23 20:31:27 EST
- **Summary:** Updated product detail CTAs and SEO copy across product data and default content (including fallbacks) to match the OPS lane naming and buttons: BiblioRename (“Rename Layers”), BiblioAudit (“Run Health Check”), BiblioClean, and BiblioTable (“Fix My Table”).
- **Root Cause:** Product detail buttons and default content files still used legacy names/CTAs, so changes weren’t reflected in all surfaces.
- **Changed Files:** src/data/products.json; default-content.json; current-default-content.json; features-default.json; clean-content.json; correct-content.json; fixed-content.json
- **Verification:** *(not run; copy-only content update)*

- **Time:** 2025-11-23 21:16:24 EST
- **Summary:** Fixed product feature cards overriding CTA labels by honoring provided button text (or product primary button) instead of forcing “Try ${name} For Free.”
- **Root Cause:** ProductContentSections hard-coded a “Try … For Free” label, ignoring the new CTA copy (e.g., “Remove Links - Free,” “Rename Layers,” “Fix My Table”).
- **Changed Files:** src/components/ProductContentSections.tsx
- **Verification:** *(not run; copy-only UI text logic change)*

- **Time:** 2025-11-23 21:58:06 EST
- **Summary:** Replaced the BiblioTable illustration with the provided table-fixer UI SVG and wired it as the product hero image.
- **Root Cause:** BiblioTable was still using the fallback illustration instead of the supplied table-fixer UI asset.
- **Changed Files:** public/media/table-fixer-ui.svg; default-content.json
- **Verification:** *(not run; copy-only asset + path update)*

- **Time:** 2025-11-23 22:08:00 EST
- **Summary:** Added the provided table-fixer UI SVG to the BiblioTable landing product card and enabled feature cards to render media so the new illustration replaces the old placeholder.
- **Root Cause:** Landing product cards ignored provided media and BiblioTable lacked a linked image, so the illustration never appeared.
- **Changed Files:** src/components/Features.tsx; src/data/products.json; default-content.json; current-default-content.json; features-default.json; clean-content.json; correct-content.json; fixed-content.json; public/media/table-fixer-ui.svg
- **Verification:** *(not run; UI content + asset wiring change)*

## 2025-11-24

- **Time:** 2025-11-24 00:50:05 EST
- **Summary:** Replaced the BiblioTable landing product card illustration with the newly provided table-fixer UI SVG.
- **Root Cause:** The card was still using the previous illustration instead of the updated asset Emily provided.
- **Changed Files:** public/media/table-fixer-ui.svg
- **Verification:** *(not run; asset swap only)*

- **Time:** 2025-11-24 00:58:44 EST
- **Summary:** Enabled landing feature cards to render static images so the BiblioTable card now shows the provided table-fixer UI art within the grid layout.
- **Root Cause:** Landing feature details stripped media data and the renderer only supported videos/custom components, so the BiblioTable showcase fell back to a placeholder instead of the supplied SVG.
- **Changed Files:** src/components/BiblioKitLanding.tsx; src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open the landing features section and confirm cards show their media, with BiblioTable displaying the table-fixer UI illustration in the grid layout)*

- **Time:** 2025-11-24 02:07:22 EST
- **Summary:** Restyled the landing hero background to a deep navy-to-indigo radial gradient inspired by the provided reference, matching the curved glow while keeping text contrast.
- **Root Cause:** The hero still used the older purple/orange gradient and needed to align with the new gradient direction from the reference image.
- **Changed Files:** src/index.css
- **Verification:** *(not run; load the hero and confirm the backdrop shows the dark navy-to-indigo radial gradient with subtle line/noise overlays, preserving readability)*

- **Time:** 2025-11-24 02:24:29 EST
- **Summary:** Converted the BiblioTable illustration SVG animations to loop continuously so the checkbox confirmations replay on a cadence.
- **Root Cause:** The SVG’s checkbox animations only ran once, leaving the graphic static after the initial playthrough.
- **Changed Files:** public/media/table-fixer-ui.svg; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open the BiblioTable card and confirm the checkboxes animate repeatedly alongside the confetti loop)*

- **Time:** 2025-11-24 04:56:05 EST
- **Summary:** Replaced the design systems blog card artwork with the new adaptive grid cells SVG.
- **Root Cause:** The design system blog posts still pointed to the old illustration instead of the updated asset provided.
- **Changed Files:** public/blog/design-systems-card.svg; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open any design systems blog card/hero and confirm it shows the adaptive grid cells illustration)*

- **Time:** 2025-11-24 05:18:52 EST
- **Summary:** Restored the design systems blog card to its original illustration and moved the adaptive grid cells SVG to the BiblioTable landing product card asset path.
- **Root Cause:** The adaptive grid SVG was mistakenly placed on the design systems card instead of the BiblioTable landing card.
- **Changed Files:** public/blog/design-systems-card.svg; public/media/table-fixer-ui.svg; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open the design systems blog card to confirm the original art is back, and view the BiblioTable landing card to see the adaptive grid animation looping)*

- **Time:** 2025-11-24 05:23:35 EST
- **Summary:** Removed the extra rounded container (and any implicit bg/border) around landing feature showcase media so the media sits flush without an added shell.
- **Root Cause:** The showcase wrapper used nested rounded containers that introduced unwanted background/border styling around the media.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; open a landing feature showcase and confirm media displays without the extra rounded wrapper background/border)*

- **Time:** 2025-11-24 05:24:56 EST
- **Summary:** Aligned the landing content background to the hero gradient so all sections share the same deep navy/indigo backdrop.
- **Root Cause:** The landing sections used a different gradient, causing a jarring shift from the hero background to the content area.
- **Changed Files:** src/index.css; docs/live-debug/LIVE_DEBUG_2025-11.md
- **Verification:** *(not run; view the landing sections to confirm the background matches the hero gradient across content blocks)*

## 2025-11-25

- **Time:** 2025-11-25 02:45:58 EST
- **Summary:** Updated the hero diamond label to display “UX” across both hero illustrations so the visual reflects the requested naming.
- **Root Cause:** The hero diamond still read “Logic,” conflicting with the intended UX labeling.
- **Changed Files:** src/components/OrigamiHeroVisual.tsx; src/components/LandingHero.tsx
- **Verification:** *(not run; copy-only label update)*

- **Time:** 2025-11-25 02:52:18 EST
- **Summary:** Updated the sticky note hero text to “Remember to create new variants!” and switched the handwriting font to Satoshi across both hero illustrations.
- **Root Cause:** Sticky note copy and handwriting styling still referenced the old “sync the assets” message and Comic Sans fallback instead of the requested text and font.
- **Changed Files:** src/components/OrigamiHeroVisual.tsx; src/components/LandingHero.tsx
- **Verification:** *(not run; copy-only text + font-family update)*

- **Time:** 2025-11-25 12:16:39 EST
- **Summary:** Renamed floating cursor labels to Nellie, Jennifer, and Emily and added a new Jose cursor animation across both hero visuals.
- **Root Cause:** Floating collaborator names were outdated and the Jose cursor animation was missing from the hero experiences.
- **Changed Files:** src/components/OrigamiHeroVisual.tsx; src/components/LandingHero.tsx
- **Verification:** *(not run; copy/animation tweaks only—view hero to confirm updated names and new Jose cursor path)*

- **Time:** 2025-11-25 12:41:14 EST
- **Summary:** Centralized hero cursor and sticky note names into a shared TSX reference so both illustrations pull from one source of truth.
- **Root Cause:** Names were duplicated across hero components, requiring multiple updates for any collaborator label changes.
- **Changed Files:** src/components/heroCursorActors.ts; src/components/OrigamiHeroVisual.tsx; src/components/LandingHero.tsx
- **Verification:** *(not run; config refactor only—open either hero to confirm all labels match the shared constants)*

- **Time:** 2025-11-25 12:55:02 EST
- **Summary:** Pointed both hero illustrations to a single shared OrigamiIllustration component to remove duplicate markup and keep future updates single-source.
- **Root Cause:** Illustration layout was duplicated across LandingHero and OrigamiHeroVisual, requiring multiple edits whenever collaborator labels or cards changed.
- **Changed Files:** src/components/OrigamiIllustration.tsx; src/components/OrigamiHeroVisual.tsx; src/components/LandingHero.tsx
- **Verification:** *(not run; structural refactor—load landing hero and standalone illustration to confirm they render identically from the shared component)*

- **Time:** 2025-11-25 13:12:27 EST
- **Summary:** Updated the shared sticky note author name to Miriam via the central heroCursorActors source so both hero illustrations stay in sync.
- **Root Cause:** Sticky author label still referenced the previous name in the shared config, requiring a single-source update.
- **Changed Files:** src/components/heroCursorActors.ts
- **Verification:** *(not run; copy-only—load either hero to confirm the sticky note shows Miriam with initial M)*

- **Time:** 2025-11-25 13:17:10 EST
- **Summary:** Added a new BiblioStart product card (Project Setup & File Scaffolding) to the landing features via the shared products content.
- **Root Cause:** The landing product grid was missing the new BiblioStart offering, so teams couldn’t discover the project setup/scaffolding workflow.
- **Changed Files:** src/data/products.json
- **Verification:** *(not run; content-only—refresh landing features to see the BiblioStart card with the new CTA)*

- **Time:** 2025-11-25 16:03:28 EST
- **Summary:** Wired BiblioStart’s product card to the provided marketing image and added the asset to public media.
- **Root Cause:** BiblioStart was missing its visual, leaving the card without the provided marketing artwork.
- **Changed Files:** src/data/products.json; public/media/BiblioStart.png
- **Verification:** *(not run; asset + path update—refresh landing features to confirm the BiblioStart card shows the new image)* 

- **Time:** 2025-11-25 16:04:47 EST
- **Summary:** Added category pills (Launched, Coming Soon, Beta) above product names and tagged each product’s category in shared content.
- **Root Cause:** Product cards lacked visible status cues, making it unclear which offerings were live, upcoming, or in beta.
- **Changed Files:** src/components/Features.tsx; src/data/products.json
- **Verification:** *(not run; UI/content change—reload landing features to see status pills atop each product card)* 

- **Time:** 2025-11-25 18:01:59 EST
- **Summary:** Added a Netlify build plugin that converts the autogenerated Emails handler to .cjs with an ESM shim to silence the esbuild CommonJS warning.
- **Root Cause:** The Netlify Emails integration generated a CommonJS function inside a `type: module` repo, triggering an esbuild warning during functions bundling.
- **Changed Files:** netlify/plugins/fix-email-cjs/index.cjs; netlify/plugins/fix-email-cjs/manifest.yml; netlify.toml
- **Verification:** `netlify deploy --build --prod` (production) now completes without the CommonJS exports warning; latest deploy ID 692631c4df0341dfcf7fa183.

- **Time:** 2025-11-25 18:03:56 EST
- **Summary:** Updated product status badges to reflect launches: BiblioAudit and UXBiblio marked Launched; BiblioStart and BiblioTable marked Coming Soon.
- **Root Cause:** Product grid statuses were outdated relative to current launch states.
- **Changed Files:** src/data/products.json
- **Verification:** *(not run; content-only—view product grid to confirm updated badge labels/colors)*

- **Time:** 2025-11-25 18:06:39 EST
- **Summary:** Replaced BiblioStart/BiblioTable buttons to scroll to a new beta waitlist section and enabled the onsite waitlist email capture.
- **Root Cause:** Product cards were sending users to blocks.bibliokit.com instead of keeping beta signup onsite with an email form.
- **Changed Files:** src/data/products.json; src/components/BiblioKitLanding.tsx
- **Verification:** *(not run; UX flow—click BiblioStart/BiblioTable buttons to confirm smooth scroll to landing waitlist form and successful email submission state)*

- **Time:** 2025-11-27 00:45:00 EST
- **Summary:** Linked every BiblioClean mention in the Remove Figma Prototype Links guide so the plugin name is clickable.
- **Root Cause:** BiblioClean references were plain text, making the plugin harder to install directly from the article.
- **Changed Files:** src/data/blogPosts.ts
- **Verification:** *(not run; content-only—open the Remove Figma Prototype Links post to confirm each BiblioClean mention is rendered as a hyperlink)*
