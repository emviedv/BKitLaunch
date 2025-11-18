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
