# Live Debug Log — 2025-12

## 2025-12-26

- **Time:** 2025-12-26 23:16 EST
- **Summary:** Added Organization logo data and SoftwareApplication image fields for rich result validation.
- **Root Cause:** The Organization schema on the About page lacked a logo, and SoftwareApplication entries were missing image URLs.
- **Changed Files:** docs/live-debug/LIVE_DEBUG_2025-12.md; netlify/edge-functions/bot-detection.ts; src/lib/seo.ts; src/lib/useSchema.ts
- **Verification:** Not run (structured data update only).

- **Time:** 2025-12-26 23:10 EST
- **Summary:** Added the official Figma Community profile to Organization `sameAs` links.
- **Root Cause:** The `sameAs` list lacked the Figma Community profile, reducing entity authority signals.
- **Changed Files:** docs/live-debug/LIVE_DEBUG_2025-12.md; src/lib/seo.ts
- **Verification:** Not run (structured data update only).

- **Time:** 2025-12-26 22:58 EST
- **Summary:** Restored the Organization `industry` field and set it to "Software Application."
- **Root Cause:** The industry field was removed while resolving schema warnings, but the requirement is to keep it for Organization metadata.
- **Changed Files:** docs/live-debug/LIVE_DEBUG_2025-12.md; src/lib/seo.ts
- **Verification:** Not run (structured data update only).

- **Time:** 2025-12-26 21:24 EST
- **Summary:** Removed the Google Doc link from the Docs resources list.
- **Root Cause:** The link was added to the site instead of updating the source document directly.
- **Changed Files:** docs/live-debug/LIVE_DEBUG_2025-12.md; src/components/Docs.tsx
- **Verification:** Not run (content change only).

- **Time:** 2025-12-26 18:22 EST
- **Summary:** Removed unsupported `industry` fields from structured data while keeping SoftwareApplication schemas.
- **Root Cause:** `industry` is not recognized by Schema.org in validators, so it raised warnings in Organization JSON-LD.
- **Changed Files:** docs/live-debug/LIVE_DEBUG_2025-12.md; src/lib/seo.ts
- **Verification:** Not run (structured data update only).

- **Time:** 2025-12-26 18:12 EST
- **Summary:** Set product page hero description max-widths to 60%.
- **Root Cause:** Product hero descriptions were still capped at max-w-3xl instead of the 60% width spec.
- **Changed Files:** docs/live-debug/LIVE_DEBUG_2025-12.md; src/components/AIRenameVariantsPage.tsx; src/components/BiblioAuditPage.tsx; src/components/BiblioCleanPage.tsx; src/components/BiblioTablePage.tsx; src/components/ProductHero.tsx
- **Verification:** Not run (layout update only).

- **Time:** 2025-12-26 17:50 EST
- **Summary:** Restored SoftwareApplication schema while removing rating fields.
- **Root Cause:** The prior fix removed SoftwareApplication entirely, but the requirement is to keep it without aggregate rating fields.
- **Changed Files:** AGENTS.md; netlify/edge-functions/bot-detection.ts; src/lib/useSchema.ts; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (structured data update only).

- **Time:** 2025-12-26 17:48 EST
- **Summary:** Removed SoftwareApplication schema and aggregateRating placeholders to avoid missing rating/review warnings.
- **Root Cause:** Bot fallback markup and the product schema helper still referenced SoftwareApplication or placeholder ratings, which triggered missing rating/review warnings.
- **Changed Files:** AGENTS.md; netlify/edge-functions/bot-detection.ts; src/lib/useSchema.ts; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (structured data update only).

- **Time:** 2025-12-26 02:59 EST
- **Summary:** Updated the BiblioAudit hero scan label to remove the auto-fix claim.
- **Root Cause:** The scan label implied BiblioAudit fixes errors, but it only surfaces issues for review.
- **Changed Files:** AGENTS.md; src/components/BiblioAuditPage.tsx; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (copy update only).

- **Time:** 2025-12-26 03:00 EST
- **Summary:** Removed padding/borders from header dropdown selections and swapped plugin dropdown icons to the official plugin icons.
- **Root Cause:** The dropdown items were styled like bordered cards with extra padding and generic icon glyphs, which didn't match the desired plugin icon presentation.
- **Changed Files:** src/components/Header.tsx; public/media/icons/biblio-rename-icon.png; public/media/icons/biblio-clean-icon.png; public/media/icons/biblio-audit-icon.png; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (UI update only).

## 2025-12-23

- **Time:** 2025-12-23 02:49 EST
- **Summary:** Restored H2/H3 hierarchy in six blog posts flagged for heading order issues.
- **Root Cause:** Several blog posts used default heading levels (H3) for top-level sections, creating an H1-to-H3 jump that audits flagged.
- **Changed Files:** AGENTS.md; src/data/blogPosts.ts; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (content hierarchy update only).

- **Time:** 2025-12-23 02:45 EST
- **Summary:** Added semantic wrappers for the UXBiblio page hero/body to raise semantic HTML usage.
- **Root Cause:** The UXBiblio page lacked a top-level semantic wrapper around its hero/content, which reduced the semantic element ratio in audits.
- **Changed Files:** src/components/ProductHero.tsx; src/components/DynamicProductPage.tsx; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (markup update only).

- **Time:** 2025-12-23 02:37 EST
- **Summary:** Forced HTTPS canonicals for bibliokit.com and added HTTP-to-HTTPS redirects so the homepage no longer exposes a non-secure version.
- **Root Cause:** The SEO base URL mirrored the request protocol and the deploy redirects file lacked explicit HTTP-to-HTTPS rules, so the HTTP homepage could resolve without a secure canonical.
- **Changed Files:** src/lib/seo.ts; public/_redirects; _redirects; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (redirect/canonical update only).

- **Time:** 2025-12-23 01:06 EST
- **Summary:** Updated page title tags to match the SearchAtlas suggestions across core pages and selected blog posts.
- **Root Cause:** Title metadata still used older naming conventions, so the SearchAtlas recommendations were not reflected in the page titles.
- **Changed Files:** src/lib/seo.ts; src/data/blogPosts.ts; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (metadata update only).

- **Time:** 2025-12-23 00:28 EST
- **Summary:** Redirected the legacy `/ai-rename-variants` URL to `/biblio-rename` and canonicalized the legacy path to prevent duplicate content.
- **Root Cause:** The Edge SSR path served a 200 response for `/ai-rename-variants` with a self-referencing canonical, so search engines saw two identical pages even though a Netlify redirect existed.
- **Changed Files:** netlify/edge-functions/ssr.ts; src/lib/seo.ts; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (redirect/canonical update only).

## 2025-12-22

- **Time:** 2025-12-22 23:45 EST
- **Summary:** Found horizontal overflow on mobile for the `/resources/remove-prototype-link` hero content.
- **Root Cause:** The hero overlay uses fixed/absolute text with `whitespace-nowrap`, so the headline spans beyond the mobile viewport.
- **Changed Files:** docs/live-debug/LIVE_DEBUG_2025-12.md (log only)
- **Verification:** Playwright mobile sweep (iPhone 12 viewport) flagged horizontal scroll on `/resources/remove-prototype-link`.

- **Time:** 2025-12-22 23:45 EST
- **Summary:** Found horizontal overflow on mobile for the `/docs` CTAs.
- **Root Cause:** The two large CTA buttons render in a single row (`flex` + `gap-4`) without a small-screen stack, pushing the row beyond the viewport.
- **Changed Files:** docs/live-debug/LIVE_DEBUG_2025-12.md (log only)
- **Verification:** Playwright mobile sweep (iPhone 12 viewport) flagged horizontal scroll on `/docs`.

- **Time:** 2025-12-22 00:42 EST
- **Summary:** Restored the long BiblioRename card body copy and switched landing feature H3s to the descriptive title phrase (e.g., “Remove Prototype Links Safely”).
- **Root Cause:** The landing feature card H3s still showed product names, and the BiblioRename body text was replaced by the short description.
- **Changed Files:** src/components/Features.tsx; src/data/products.json; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (copy/layout update only).

- **Time:** 2025-12-22 00:41 EST
- **Summary:** Prevented horizontal body overflow that created extra space to the right.
- **Root Cause:** Decorative elements extended beyond the viewport width, allowing the document to scroll horizontally.
- **Changed Files:** src/index.css; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (layout containment update only).

- **Time:** 2025-12-22 00:32 EST
- **Summary:** Set the landing product card H3s to use plugin descriptions and corrected the BiblioRename feature description/title split.
- **Root Cause:** The product section H3s were bound to feature titles instead of descriptions, and the BiblioRename description lived in the title string.
- **Changed Files:** src/components/Features.tsx; src/data/products.json; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (copy/layout update only).

## 2025-12-21

- **Time:** 2025-12-21 22:08 EST
- **Summary:** Added a Miriam cursor label to the hero overlays alongside the existing named cursors.
- **Root Cause:** The hero cursor set did not include Miriam, even though other named cursors (e.g., Jennifer) were shown.
- **Changed Files:** src/components/heroCursorActors.ts; src/components/LandingHero.tsx; src/components/OrigamiIllustration.tsx; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (UI update only).

- **Time:** 2025-12-21 22:12 EST
- **Summary:** Lowered the hero cursor overlay layer so cursors render behind the hero text and description.
- **Root Cause:** The cursor overlay used a higher z-index than the hero content, causing it to sit above the text.
- **Changed Files:** src/components/LandingHero.tsx; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (UI layering update only).

- **Time:** 2025-12-21 22:16 EST
- **Summary:** Styled the word "faster" in the hero headline with Instrument Serif (400 italic).
- **Root Cause:** The hero headline did not apply the specified font styling to the word "faster."
- **Changed Files:** index.html; src/components/LandingHero.tsx; src/index.css; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (typography update only).

- **Time:** 2025-12-21 22:21 EST
- **Summary:** Increased the hero "faster" word size by 12px.
- **Root Cause:** The hero "faster" word size was not 12px larger as requested.
- **Changed Files:** src/index.css; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (typography update only).

- **Time:** 2025-12-21 22:25 EST
- **Summary:** Styled the hero "products" word with Instrument Serif and the same size as "faster."
- **Root Cause:** The hero headline only applied the Instrument Serif styling to "faster," leaving "products" unstyled.
- **Changed Files:** src/components/LandingHero.tsx; src/index.css; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (typography update only).

- **Time:** 2025-12-21 23:44 EST
- **Summary:** Styled "real products" in the features title with Instrument Serif and the same size as the hero accent words.
- **Root Cause:** The features title did not apply the Instrument Serif styling to the "real products" phrase.
- **Changed Files:** src/components/ProductContentSections.tsx; src/index.css; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (typography update only).

- **Time:** 2025-12-21 23:47 EST
- **Summary:** Anchored the landing product features section so the "Explore Figma plugins" CTA scrolls to it.
- **Root Cause:** The hero CTA linked to `#landing-features`, but the landing product features section lacked that anchor ID.
- **Changed Files:** src/components/ProductFeaturesSection.tsx; src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (scroll anchor update only).

## 2025-12-20

- **Time:** 2025-12-20 16:41 EST
- **Summary:** Noted the Atlassian Design System blog URL shows the draft-only fallback instead of an article because the slug isn’t registered.
- **Root Cause:** The `boost-ux-with-atlassian-design-system` content and FAQs exist as `atlassianDesignSystemContent`/`atlassianDesignSystemFaqs`, but the slug is never added to `BLOG_POSTS`, so the router can’t find it and renders the missing-post state.
- **Changed Files:** docs/live-debug/LIVE_DEBUG_2025-12.md (log only)
- **Verification:** Loaded `/blog/boost-ux-with-atlassian-design-system` (draft-only message) and reviewed `src/data/blogPosts.ts` to confirm the slug is absent from `BLOG_POSTS`.

- **Time:** 2025-12-20 16:44 EST
- **Summary:** Removed the unpublished Atlassian Design System blog URLs from the AI sitemap list so crawlers and AI references stop sharing the draft-only page.
- **Root Cause:** `public/llms.txt` listed `/blog/boost-ux-with-atlassian-design-system` and its anchor even though the slug isn’t registered in `BLOG_POSTS`, causing visitors to hit the missing-post fallback.
- **Changed Files:** public/llms.txt; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Confirmed the two Atlassian URLs no longer appear in `public/llms.txt`.

- **Time:** 2025-12-20 17:12 EST
- **Summary:** Redirected the unpublished Atlassian Design System blog path to `/blog` so the draft-only fallback page is no longer reachable.
- **Root Cause:** The slug isn’t registered in `BLOG_POSTS`, so hitting `/blog/boost-ux-with-atlassian-design-system` rendered the missing-post state instead of routing users elsewhere.
- **Changed Files:** public/_redirects; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (redirect rule only; confirm Netlify picks up `/blog/boost-ux-with-atlassian-design-system -> /blog`).

- **Time:** 2025-12-20 17:18 EST
- **Summary:** Replaced the “shared workspace” waitlist/SEO copy with beta-line messaging (“Drop your email to jump the line for our next Figma plugins in beta”) across waitlist UI, hero meta, LLMS text, and resource CTA.
- **Root Cause:** Shared-workspace wording felt off for the waitlist CTA; requested to swap to beta queue language.
- **Changed Files:** src/data/products.json; src/lib/seo.ts; public/llms.txt; src/components/RemovePrototypeLinkPage.tsx; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (copy/meta update only).

- **Time:** 2025-12-20 17:19 EST
- **Summary:** Rewrote Resources page intros to focus on free prototype cleanup resources and accurate plugin workflows (not just “fixes”).
- **Root Cause:** The “All plugins” description implied everything was a fix, and the free resources intro pitched BiblioClean instead of simply highlighting the free assets.
- **Changed Files:** src/components/ResourcesPage.tsx; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (copy update only).

- **Time:** 2025-12-20 20:02 EST
- **Summary:** Tightened waitlist copy to only say “Drop your email to jump the line for our next Figma plugins in beta.”
- **Root Cause:** Waitlist description still included BiblioStart/BiblioTable wording instead of the concise beta-line CTA requested.
- **Changed Files:** src/data/products.json; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (copy update only).

- **Time:** 2025-12-20 20:03 EST
- **Summary:** Linked BiblioTable mentions in the table design blog so the plugin name points to /biblio-table instead of plain text.
- **Root Cause:** The “Find it here” sentences rendered as plain text because no URL was provided for BiblioTable.
- **Changed Files:** src/data/blogPosts.ts; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (content/link update only).

- **Time:** 2025-12-20 20:21 EST
- **Summary:** Added a /biblio-table link to the earlier “Pro Tip: Use BiblioTable” paragraph in the table design blog so the product mention is clickable.
- **Root Cause:** The initial BiblioTable callout used the homepage URL in parentheses, leaving the product name as plain text without an internal link.
- **Changed Files:** src/data/blogPosts.ts; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (content/link update only).

- **Time:** 2025-12-20 20:12 EST
- **Summary:** Updated BiblioTable page CTAs to “FIX YOUR TABLES” and linked to the Figma Community profile; removed beta phrasing and noted the live install in the FAQ. Added a reminder in AGENTS.md to pull community links from figma.com/@bibliokit.
- **Root Cause:** CTA still pointed to the waitlist with beta copy; need to drive installs from the Figma Community listing.
- **Changed Files:** src/components/BiblioTablePage.tsx; AGENTS.md; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (copy/link update only; verify CTAs now link out to Figma Community).

- **Time:** 2025-12-20 20:23 EST
- **Summary:** Wired BiblioTable hero CTAs to the exact Figma Community plugin URL instead of the profile.
- **Root Cause:** CTA still used the profile fallback; needed to point directly to the plugin listing.
- **Changed Files:** src/components/BiblioTablePage.tsx; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (link update only; verify CTAs open the BiblioTable plugin page).

- **Time:** 2025-12-20 20:15 EST
- **Summary:** Pointed the BiblioAudit hero CTA to the live Figma Community plugin page instead of the older component-auditor URL.
- **Root Cause:** CTA link used the legacy slug; needed to route directly to the current BiblioAudit plugin listing.
- **Changed Files:** src/components/BiblioAuditPage.tsx; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (link update only; confirm CTA opens the BiblioAudit plugin page).

- **Time:** 2025-12-20 15:14 EST
- **Summary:** Fixed the blank/black production page by removing the React-only manual chunk that created a circular dependency and left `useState` undefined at runtime.
- **Root Cause:** Manual chunking split React into its own chunk while vendor code still imported React, and React’s chunk imported the vendor chunk for side effects, forming a circular dependency that broke React hooks on load.
- **Changed Files:** vite.config.ts; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** `npm run build` (bundle rebuilt without the circular React/Vendor chunk; no runtime bundling errors during build).

- **Time:** 2025-12-20 15:13 EST
- **Summary:** Added the `/resources` page with free BiblioClean resources and an all-plugins section, plus routing, SEO metadata, and sitemap entry.
- **Root Cause:** The `/resources` route pointed to a missing page, leaving a 404 instead of a resource index.
- **Changed Files:** src/components/ResourcesPage.tsx; src/App.tsx; src/lib/seo.ts; netlify/functions/sitemap.ts; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (UI/SEO update).

- **Time:** 2025-12-20 14:54 EST
- **Summary:** Matched the internal linking anchor text to the requested phrases so the linking tool can detect all eight suggestions.
- **Root Cause:** Links existed but used different anchor text than the suggestion list, so they were still marked as not deployed.
- **Changed Files:** src/data/blogPosts.ts; src/components/BiblioAuditPage.tsx; src/components/BiblioCleanPage.tsx; src/components/RemovePrototypeLinkPage.tsx; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (copy update only; confirm the eight suggestions now show as deployed).

- **Time:** 2025-12-20 03:29 EST
- **Summary:** Removed the CSS minifier warning by replacing the invalid `.border-b*` selector and split the client bundle into smaller chunks with manual Rollup chunking.
- **Root Cause:** A custom `:is(...)` selector in `src/index.css` produced an invalid `.border-b*` selector at build time, and the client bundle was shipped as a single large chunk.
- **Changed Files:** src/index.css; vite.config.ts; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** `npm run build` (warning gone; client chunks now split under the 500 kB threshold).

- **Time:** 2025-12-20 03:11 EST
- **Summary:** Marked BiblioTable as launched so the landing feature badge no longer shows Coming Soon.
- **Root Cause:** BiblioTable’s feature card still had the Coming Soon badge/category after launch.
- **Changed Files:** src/data/products.json; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (copy update only; confirm the BiblioTable badge shows “Launched”).

- **Time:** 2025-12-20 03:11 EST
- **Summary:** Reverted the BiblioRename landing feature title so the product name stays as "BiblioRename" in the title string.
- **Root Cause:** The previous update appended the Otto tagline inside the product name, which violated the expected naming format.
- **Changed Files:** src/data/products.json; AGENTS.md; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (copy update only; confirm the BiblioRename feature title renders with just "BiblioRename").

- **Time:** 2025-12-20 03:07 EST
- **Summary:** Updated the specified H2 headings for BiblioRename and the BiblioAudit/BiblioClean/BiblioRename/BiblioTable “See it in action” sections.
- **Root Cause:** Product and section H2s were still using the shorter placeholder copy instead of the approved descriptive headings.
- **Changed Files:** src/data/products.json; src/components/BiblioAuditPage.tsx; src/components/BiblioCleanPage.tsx; src/components/AIRenameVariantsPage.tsx; src/components/BiblioTablePage.tsx; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (copy update only; review H2s on the landing features card and the four product pages).

- **Time:** 2025-12-20 02:54 EST
- **Summary:** Updated Twitter titles for BiblioAudit and three blog posts to match the approved short-form share copy.
- **Root Cause:** Twitter title metadata still used the original page titles, so the requested social snippets were not applied.
- **Changed Files:** src/lib/seo.ts; src/data/blogPosts.ts; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (metadata change only; confirm `twitter:title` on `/biblio-audit`, `/blog/effortless-table-design-auto-layout`, `/blog/ui-component-states-guide`, and `/blog/mastering-design-system-guidelines`).

- **Time:** 2025-12-20 02:51 EST
- **Summary:** Added the requested internal links between the BiblioAudit/BiblioClean pages, the detached/prototype blog guides, and the prototype link resource so those pages cross-reference each other.
- **Root Cause:** The suggested internal links were never added, leaving key product, blog, and resource pages without crawlable cross-links.
- **Changed Files:** src/lib/renderTextWithLinks.tsx; src/data/blogPosts.ts; src/components/BiblioAuditPage.tsx; src/components/BiblioCleanPage.tsx; src/components/RemovePrototypeLinkPage.tsx; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (content/link updates only; confirm the new links render on `/biblio-audit`, `/biblio-clean`, `/resources/remove-prototype-link`, `/blog/fix-detached-instances-figma`, and `/blog/remove-prototype-links-in-figma`).

- **Time:** 2025-12-20 02:45 EST
- **Summary:** Found `/resources` linked in the UI but missing a route, so it falls through to the 404 page.
- **Root Cause:** `ROUTE_PATHS.RESOURCES` is defined and linked in the header/footer, but no matching `<Route>` exists in the app router.
- **Changed Files:** docs/live-debug/LIVE_DEBUG_2025-12.md (log only)
- **Verification:** Not run (code review only; `/resources` absent from `src/App.tsx` routes).

## 2025-12-19

- **Time:** 2025-12-19 20:33 EST
- **Summary:** Normalized sitemap URL paths by removing trailing slashes and aligned the sitemap base URL with SEO normalization; updated the sitemap test to expect canonical `/biblio-rename`.
- **Root Cause:** Sitemap URLs could include trailing slashes or use an unnormalized base URL, causing mismatches with canonical SEO URLs and redirecting paths.
- **Changed Files:** netlify/functions/sitemap.ts; tests/unit/sitemap.spec.ts
- **Verification:** Not run (not requested).

## 2025-12-14

- **Time:** 2025-12-14 09:24 EST
- **Summary:** Adjusted the hero H1 second line to “Ship better products” while keeping the enforced line break after “Design faster in Figma.” for the two-line layout.
- **Root Cause:** The prior H1 ending “Ship cleaner design systems” didn’t match the requested copy.
- **Changed Files:** src/data/products.json
- **Verification:** Not run (copy change only; confirm hero H1 shows updated second line).

- **Time:** 2025-12-14 09:24 EST
- **Summary:** Forced each hero H1 line to stay on a single line by adding `whitespace-nowrap` to the hero headline spans so the two-line layout doesn’t wrap into four lines on narrow viewports.
- **Root Cause:** Long lines were wrapping inside each span, causing the intended two-line H1 to break into four lines.
- **Changed Files:** src/components/LandingHero.tsx
- **Verification:** Not run (CSS change; preview hero to confirm two-line H1 holds without wrapping).

- **Time:** 2025-12-14 09:27 EST
- **Summary:** Added confetti firing on hover, focus, and click for the “View Products” CTA so the hero animates when selected as well as hovered.
- **Root Cause:** Confetti only triggered on hover; selecting the CTA via click or keyboard focus didn’t show the animation.
- **Changed Files:** src/components/LandingHero.tsx
- **Verification:** Not run (UI change; preview CTA hover/focus/click to confirm confetti).

- **Time:** 2025-12-14 09:29 EST
- **Summary:** Ensured the “View Products” CTA scrolls to the features section on click (even with anchor links) and made confetti fire on pointer enter as well as hover/focus to catch all input types.
- **Root Cause:** Confetti sometimes failed on hover-only handlers, and anchor clicks weren’t consistently triggering the scroll-to-features behavior.
- **Changed Files:** src/components/LandingHero.tsx
- **Verification:** Not run (UI change; preview CTA hover/focus/pointer enter and click to confirm confetti plus smooth scroll).

- **Time:** 2025-12-14 09:53 EST
- **Summary:** Added 32px top padding to the landing features section container to match spacing guidance.
- **Root Cause:** The `section-content` wrapper had no top padding, crowding the intro block against surrounding elements.
- **Changed Files:** src/components/ProductFeaturesSection.tsx
- **Verification:** Not run (layout spacing change; preview features section to confirm padding).

- **Time:** 2025-12-14 09:55 EST
- **Summary:** Increased landing features container top padding to 4rem (64px) for the requested spacing.
- **Root Cause:** The previous 32px padding still left the intro too tight against surrounding elements.
- **Changed Files:** src/components/ProductFeaturesSection.tsx
- **Verification:** Not run (layout spacing change; preview features section to confirm 4rem padding).

- **Time:** 2025-12-14 10:00 EST
- **Summary:** Gave landing feature text cards a white background with 16px padding and switched copy to dark text for better readability.
- **Root Cause:** Feature cards sat on a transparent/dark background with white text, clashing with the requested white card styling.
- **Changed Files:** src/components/ProductFeaturesSection.tsx
- **Verification:** Not run (UI styling change; preview product cards to confirm white bg, 16px padding, and black text).

- **Time:** 2025-12-14 10:01 EST
- **Summary:** Ensured product feature cards render on a white background with dark text and 16px padding by applying bg-white/p-4 shadow styles at the article level and resetting text colors.
- **Root Cause:** Parent article still carried dark text defaults, so the new white cards didn’t appear white or readable.
- **Changed Files:** src/components/ProductFeaturesSection.tsx
- **Verification:** Not run (UI styling change; preview feature cards to confirm white background and dark text).

- **Time:** 2025-12-14 10:03 EST
- **Summary:** Forced both landing and default feature cards to use a white background, dark text, 16px padding, and 4px radius by setting styles on the article wrappers (and removing extra nested card backgrounds).
- **Root Cause:** The landing feature cards still pulled the old transparent/dark styling and rounded-4xl radius, so the white background wasn’t visible.
- **Changed Files:** src/components/ProductFeaturesSection.tsx
- **Verification:** Not run (UI styling change; preview feature cards to confirm white bg, 4px radius, dark text).

- **Time:** 2025-12-14 13:07 EST
- **Summary:** Hard-set feature cards to a white background (inline style) to prevent dark theme overrides while keeping 4px radius, padding, and dark text.
- **Root Cause:** Dark mode overrides kept tinting the cards; class-only bg-white wasn’t enough.
- **Changed Files:** src/components/ProductFeaturesSection.tsx
- **Verification:** Not run (UI styling change; preview cards in dark mode to confirm white background).

- **Time:** 2025-12-14 13:09 EST
- **Summary:** Switched the products/features section to a 3-column grid on landing, stacking each card’s content vertically and keeping white cards with dark text.
- **Root Cause:** Products were still laid out as single-column alternating blocks; requested a 3-column product section layout.
- **Changed Files:** src/components/ProductFeaturesSection.tsx
- **Verification:** Not run (layout change; preview landing products to confirm 3-column grid and white cards).

- **Time:** 2025-12-14 13:09 EST
- **Summary:** Moved feature card media to the top of each card so images lead the content stack above titles/descriptions.
- **Root Cause:** Media appeared below text in the new 3-column layout; request was to place hero images at the top of the card.
- **Changed Files:** src/components/ProductFeaturesSection.tsx
- **Verification:** Not run (layout change; preview cards to confirm media at the top).

- **Time:** 2025-12-14 13:11 EST
- **Summary:** Removed explicit white backgrounds from feature cards while keeping borders, radius, shadow, and dark text to match the requested styling.
- **Root Cause:** Cards still had forced white backgrounds after moving media; request was to drop the bg color.
- **Changed Files:** src/components/ProductFeaturesSection.tsx
- **Verification:** Not run (UI styling change; preview cards to confirm no solid bg color).

- **Time:** 2025-12-14 13:12 EST
- **Summary:** Switched product feature card text to white (with white/80 body and bullets) so it’s readable without a forced background.
- **Root Cause:** After removing the white card background, text remained dark and hard to read on the dark section.
- **Changed Files:** src/components/ProductFeaturesSection.tsx
- **Verification:** Not run (UI styling change; preview cards to confirm white text on dark backdrop).

- **Time:** 2025-12-14 13:13 EST
- **Summary:** Converted the landing product cards to a masonry layout using CSS columns (1/2/3) with break-inside guards so cards stack fluidly.
- **Root Cause:** Cards were in a rigid grid; requested a masonry-style layout for the products section.
- **Changed Files:** src/components/ProductFeaturesSection.tsx
- **Verification:** Not run (layout change; preview the products section to confirm masonry stacking).

- **Time:** 2025-12-14 13:20 EST
- **Summary:** Upgraded CTA copy to be more action-driven: hero primary button now reads “Explore Figma plugins,” and product card fallbacks use “See how it works” instead of “View Product.”
- **Root Cause:** CTAs used generic labels that weren’t benefit-forward.
- **Changed Files:** src/data/products.json; src/components/ProductFeaturesSection.tsx
- **Verification:** Not run (copy change; preview hero CTA and product cards to confirm updated labels).

- **Time:** 2025-12-14 13:24 EST
- **Summary:** Refreshed product feature CTA labels to be action/benefit-driven (e.g., “Standardize names with AI,” “Audit my file now,” “Clean prototype links,” “Generate my starter kit,” “Fix this table,” “Browse UX patterns”).
- **Root Cause:** Product section buttons still used generic labels like “Rename Layers” and “Learn More.”
- **Changed Files:** src/data/products.json
- **Verification:** Not run (copy change; preview product cards to confirm updated CTA text).

- **Time:** 2025-12-14 09:26 EST
- **Summary:** Centered the hero paragraph by flex-aligning the text block to the middle and applying text-center for non-left aligned layouts.
- **Root Cause:** The hero paragraph sat left-aligned when the headline was forced into two lines.
- **Changed Files:** src/components/LandingHero.tsx
- **Verification:** Not run (CSS change; preview hero to confirm centered paragraph).

- **Time:** 2025-12-14 09:22 EST
- **Summary:** Forced the hero H1 to render in two lines by keeping the explicit line break between “Design faster in Figma.” and “Ship cleaner design systems”.
- **Root Cause:** H1 needed a guaranteed two-line layout to match the requested presentation.
- **Changed Files:** src/data/products.json
- **Verification:** Not run (copy change only; confirm hero H1 shows as two lines).

- **Time:** 2025-12-14 09:19 EST
- **Summary:** Tweaked the hero subhead to “The Studio Figma plugin suite for designers who care about speed, structure and creativity.” to keep Figma + Design Systems context while matching the requested wording and single-line flow.
- **Root Cause:** The prior subhead lacked the explicit “Figma” callout and used a line break that split the sentence.
- **Changed Files:** src/data/products.json
- **Verification:** Not run (copy change only; confirm hero renders updated subhead).

- **Time:** 2025-12-14 09:18 EST
- **Summary:** Rephrased the homepage H1 to “Design faster in Figma. Ship cleaner design systems.” so it keeps the original promise while surfacing Figma + Design Systems for SEO clarity.
- **Root Cause:** The prior H1 used new wording (“Figma runs faster. Design Systems stay clean.”) that deviated from the core “Design faster, Ship cleaner” positioning.
- **Changed Files:** src/data/products.json
- **Verification:** Not run (copy change only; verify hero renders with the updated H1).

- **Time:** 2025-12-14 09:11 EST
- **Summary:** Set the homepage title tag to “BiblioKit - Suite of Figma Plugins & DesignOps Tools” and rewrote the hero H1 to explicitly call out Figma and Design Systems.
- **Root Cause:** The title pulled the hero text and never mentioned Figma or design systems, making the site look like generic library software to crawlers.
- **Changed Files:** src/lib/seo.ts; index.html; src/data/products.json
- **Verification:** Not run (copy/SEO change only; verify head tags and hero heading in the browser build).

- **Time:** 2025-12-14 02:36 EST
- **Summary:** Updated the Design System Guidelines blog to match the provided Google Doc with new copy, refreshed metadata, and the supplied hero image.
- **Root Cause:** The page content and hero art were outdated relative to the latest doc, leaving readers with stale guidance and missing media alignment.
- **Changed Files:** src/data/blogPosts.ts; public/blog/design-system-guidelines/design-system-guidelines-hero.png
- **Verification:** Not run (content update only; visual check /blog/mastering-design-system-guidelines recommended).

- **Time:** 2025-12-14 02:29 EST
- **Summary:** Kept the featured blog title visible on hover by shifting the gradient/text-clip styling onto the link itself and adding consistent hover/focus treatment.
- **Root Cause:** The gradient lived on the parent heading while the anchor inherited transparent text and only an opacity hover, so the link lost its fill on hover and the title disappeared.
- **Changed Files:** src/components/BlogPage.tsx
- **Verification:** Manual code review; dev server could not start in the sandbox environment (EPERM binding port 9990), so visual verification is pending.

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

## 2025-12-10

- **Time:** 2025-12-10 09:29 EST
- **Summary:** Restored product feature sections to include alternating media slots with placeholders that show even when assets are missing, and refreshed the placeholder stroke to sit four shades lighter than the dark frame.
- **Root Cause:** `hideFeatureIllustrations` defaulted to true on product pages, so features rendered text-only and never surfaced the media column; the old placeholder frame was too small and used a flat stroke that blended into the background.
- **Changed Files:** src/components/ProductContentSections.tsx
- **Verification:** Manual code review confirming `computeFeatureLayout` now renders media columns with `showcase` sizing, placeholder frames carry slate-400 strokes against the dark backdrop, and feature bullet lists use readable body text; no automated tests run for this change.

## 2025-12-10

- **Time:** 2025-12-10 09:33 EST
- **Summary:** Matched product media containers to their image/video height and standardized all media and placeholder corners to 12px for consistent card edges.
- **Root Cause:** Media wrappers carried fixed min-heights and larger radii (22–30px), causing empty space around assets and uneven rounding across real images and placeholders.
- **Changed Files:** src/components/ProductContentSections.tsx
- **Verification:** Manual inspection of renderDetailMedia to confirm inline-flex wrappers use `w-full h-auto` media, max widths only, and 12px rounding across image, video, and placeholder frames; no automated tests run for this change.

## 2025-12-10

- **Time:** 2025-12-10 09:50 EST
- **Summary:** Replaced product card images with the latest marketing assets (BiblioRename, BiblioAudit, BiblioClean, BiblioTable, BiblioStart) and switched feature media to local `/media` paths with descriptive alt text.
- **Root Cause:** Landing feature cards were still pulling remote Figma thumbnails or older art instead of the updated marketing renders provided in the Internal Tools & Folders directory.
- **Changed Files:** src/data/products.json; public/media/BiblioRename.png; public/media/BiblioAudit.png; public/media/BiblioClean.png; public/media/BiblioTable.png; public/media/BiblioStart.png
- **Verification:** Manual check that new assets exist under `public/media` and product feature media now reference the local files with updated alt copy; no automated tests run.

## 2025-12-10

- **Time:** 2025-12-10 09:21 EST
- **Summary:** Rebranded the AI rename product page to BiblioRename and made hero callouts clickable links to the BiblioRename plugin so visitors can install directly from the page.
- **Root Cause:** Hero callouts rendered as plain text sourced from benefits and the route metadata still used the legacy “AI Rename Variants” name, leaving the page unlinked and misbranded.
- **Changed Files:** src/components/AIRenameVariantsPage.tsx; src/lib/seo.ts; src/components/Docs.tsx; src/components/aiRenameVariantsCopy.ts; src/components/ProductHero.tsx; src/data/products.json
- **Verification:** Searched the codebase for “AI Rename Variants” to ensure user-facing naming now reads “BiblioRename”; verified callout data carries the Figma plugin URL and ProductHero renders callouts as anchors with external target handling.

## 2025-12-10

- **Time:** 2025-12-10 11:21 EST
- **Summary:** Reframed the homepage H1/H2 hierarchy around jobs-to-be-done so Google surfaces solution-focused headings instead of product-name lists.
- **Root Cause:** Hero and feature headings used product names (“Launched. BiblioRename…”) which Google picked up as a laundry list instead of the underlying design-ops outcomes.
- **Changed Files:** src/data/products.json; src/components/ProductContentSections.tsx
- **Verification:** Manual review of homepage markup confirming H1 now reads “The All-in-One Figma Plugin Suite for Design Ops” and feature headings render as H2 job statements (e.g., “Automate Design System Audits (BiblioAudit)”).

## 2025-12-10

- **Time:** 2025-12-10 11:25 EST
- **Summary:** Added SoftwareApplication JSON-LD (OS “Figma (Web/Desktop)”, $29/mo offer, plugin rating) to the global head so Google can render rich snippets with price and stars.
- **Root Cause:** Homepage lacked SoftwareApplication schema and rating/price signals, blocking rich snippet eligibility for plugin searches.
- **Changed Files:** src/lib/seo.ts
- **Verification:** Manual serialization check ensuring structured data includes SoftwareApplication with aggregateRating and Offer when generateStructuredData runs.

## 2025-12-10

- **Time:** 2025-12-10 12:15 EST
- **Summary:** Increased landing hero grid line visibility by ~40% while keeping the warmed off-black backdrop.
- **Root Cause:** Grid lines remained too faint against the softened hero background.
- **Changed Files:** src/index.css
- **Verification:** Not run (visual pass recommended on the landing hero to confirm line contrast).

## 2025-12-10

- **Time:** 2025-12-10 12:05 EST
- **Summary:** Warmed the off-black theme and softened the landing hero background while making grid lines more visible.
- **Root Cause:** The prior palette skewed cool/blue, and grid lines were too faint against the darker hero backdrop.
- **Changed Files:** src/index.css
- **Verification:** Not run (visual pass recommended on landing hero to confirm warmer tone and clearer grid lines).

## 2025-12-10

- **Time:** 2025-12-10 11:30 EST
- **Summary:** Pivoted homepage SEO signals and hero copy to utility/action keywords (clean files, resize frames, audit systems, rename layers) to match urgent plugin intent.
- **Root Cause:** Title/description and hero text emphasized generic speed claims, missing high-intent utility phrases like “clean Figma files” and “design system audit.”
- **Changed Files:** src/lib/seo.ts; src/data/products.json
- **Verification:** Manual review of generated metadata shows updated title/description/keywords; hero description now lists the action-oriented utilities.

## 2025-12-10

- **Time:** 2025-12-10 11:35 EST
- **Summary:** Removed Offer pricing from SoftwareApplication JSON-LD so schema only exposes the plugin rating without pricing.
- **Root Cause:** Pricing in structured data was no longer desired for search snippets.
- **Changed Files:** src/lib/seo.ts
- **Verification:** Manual serialization check confirms SoftwareApplication JSON-LD omits the Offer block while keeping aggregateRating.

## 2025-12-10

- **Time:** 2025-12-10 11:37 EST
- **Summary:** Updated homepage SEO title to “BiblioKit | The All-in-One Figma Design Ops Suite (Audit, Clean, Scale)” to reinforce design ops positioning while preserving utility keywords.
- **Root Cause:** Previous title emphasized utility phrases but missed the explicit “All-in-One … Suite” framing requested.
- **Changed Files:** src/lib/seo.ts
- **Verification:** Manual review of routeMetadata/defaultMetadata shows the new title applied to homepage OG/title tags.

## 2025-12-10

- **Time:** 2025-12-10 11:45 EST
- **Summary:** Replaced homepage meta and hero description with “Replace your fragmented plugin stack…” messaging to highlight Predictive Heatmaps, Audits, AI Renaming, and Batch Scaling in one subscription.
- **Root Cause:** Prior description emphasized utility tasks but didn’t speak to consolidating the plugin stack or the new value pillars.
- **Changed Files:** src/lib/seo.ts; src/data/products.json
- **Verification:** Manual review confirming defaultMetadata and homepage route descriptions match the new copy; hero description on landing reflects the same message.

## 2025-12-10

- **Time:** 2025-12-10 11:48 EST
- **Summary:** Expanded homepage SEO keywords to include predictive eye tracking, attention heatmaps, bulk ad resizing, governance, and design ops automation queries.
- **Root Cause:** Keyword set lacked emerging utility phrases tied to heatmaps and bulk resizing; adding them aligns metadata with user-requested terms.
- **Changed Files:** src/lib/seo.ts
- **Verification:** Manual metadata check confirms updated keywords string for default and homepage route entries.

## 2025-12-10

- **Time:** 2025-12-10 11:52 EST
- **Summary:** Softened the landing feature section gradient so the page bottom no longer collapses to off-black; added layered radial glows and a lighter terminal color stop.
- **Root Cause:** The product feature sections used a dark linear gradient that descended to near-black at the bottom, making the page feel heavy.
- **Changed Files:** src/index.css
- **Verification:** Manual style review confirming `.landing-sections-gradient` now ends at a lighter #120f24 stop with radial highlights instead of a solid off-black fade.

## 2025-12-10

- **Time:** 2025-12-10 11:56 EST
- **Summary:** Standardized all buttons to 6px corner radius via the shared Button component for consistent UI rounding.
- **Root Cause:** Button variants inherited default Tailwind rounding and larger radii in some sizes; requirement is fixed 6px corners everywhere.
- **Changed Files:** src/components/ui/button.tsx
- **Verification:** Manual code review of `buttonVariants` showing base/size classes now use `rounded-[6px]`.

## 2025-12-10

- **Time:** 2025-12-10 12:00 EST
- **Summary:** Restored subtle grid lines on landing feature sections while keeping the lighter gradient base to avoid the off-black fade.
- **Root Cause:** Previous gradient update replaced the background stack and dropped the grid-line layers, removing the visual structure.
- **Changed Files:** src/index.css
- **Verification:** Manual style check confirming `.landing-sections-gradient` now layers grid line linear gradients above the softened radial/linear background.

## 2025-12-10

- **Time:** 2025-12-10 12:08 EST
- **Summary:** Split feature headings into job statements plus standalone product names (now 32px) without parentheses, positioned above descriptions on landing and product sections.
- **Root Cause:** Titles contained product names in parentheses and lacked a dedicated product label, reducing clarity and visual hierarchy.
- **Changed Files:** src/components/ProductContentSections.tsx
- **Verification:** Manual review showing headlines exclude parentheses, with product names rendered as separate 32px lines above descriptions across both landing and default feature layouts.

## 2025-12-10

- **Time:** 2025-12-10 12:14 EST
- **Summary:** Applied the softened gradient + grid overlay treatment to the hero background to match product sections and avoid an off-black bottom fade.
- **Root Cause:** Hero background stayed darker and lacked the refreshed grid treatment used on feature sections.
- **Changed Files:** src/index.css
- **Verification:** Manual style check confirming hero now layers grid lines over the lighter gradient with a #120f24 terminal stop.

## 2025-12-10

- **Time:** 2025-12-10 12:20 EST
- **Summary:** Neutralized hero and section gradients to a more off-black palette while keeping grid overlays, reducing purple tint in the base colors.
- **Root Cause:** Prior gradients leaned purple; request was for a neutral off-black finish on hero and feature backgrounds.
- **Changed Files:** src/index.css
- **Verification:** Manual style review confirming hero and section gradients use neutral #0b0d11–#0c0c0f stops with retained grid lines.

## 2025-12-10

- **Time:** 2025-12-10 12:28 EST
- **Summary:** Simplified hero and section backgrounds to fewer neutral layers: kept grid overlays, trimmed extra radials, and standardized to off-black stops without colored tints.
- **Root Cause:** Backgrounds were still busy and subtly tinted; request was to keep them neutral off-black and less complex.
- **Changed Files:** src/index.css
- **Verification:** Manual style check shows single neutral radial plus neutral linear gradient with grid overlays for both hero and feature sections.

## 2025-12-10

- **Time:** 2025-12-10 12:34 EST
- **Summary:** Matched footer and waitlist email styling to the neutral off-black background with subtle grid-ready gradients, dark inputs, and light text.
- **Root Cause:** Footer was transparent and the waitlist input used a light theme, clashing with the new dark landing backgrounds.
- **Changed Files:** src/components/Footer.tsx; src/components/Waitlist.tsx; src/index.css
- **Verification:** Manual style review confirming footer now uses the neutral gradient and waitlist input adopts dark fill/borders with light placeholder/text.

## 2025-12-10

- **Time:** 2025-12-10 12:40 EST
- **Summary:** Styled “Get Beta Access” hero CTA to pink and constrained waitlist email input to 320px max width for consistent sizing.
- **Root Cause:** Beta CTA was default colored and email field stretched too wide on large screens.
- **Changed Files:** src/components/Hero.tsx; src/components/Waitlist.tsx
- **Verification:** Manual check confirming pink hero CTA and constrained email input width.

## 2025-12-10

- **Time:** 2025-12-10 12:48 EST
- **Summary:** Removed the black overlay on the hero and aligned its background to the product section style (neutral off-black gradient with grid), disabling extra overlay layers.
- **Root Cause:** Hero retained a dark overlay/contrast layer that made it heavier than product sections; request was to match section styling.
- **Changed Files:** src/components/LandingHero.tsx; src/index.css
- **Verification:** Manual style review confirming hero uses the same neutral gradient/grid treatment and no longer applies the black overlay/contrast layers.

## 2025-12-10

- **Time:** 2025-12-10 12:52 EST
- **Summary:** Removed the extra column grid overlay from the hero to eliminate doubled grid lines and match the product section treatment.
- **Root Cause:** The hero stacked both background grid lines and the column-lines overlay, creating a double-grid effect despite the neutral gradient simplification.
- **Changed Files:** src/components/LandingHero.tsx
- **Verification:** Manual check confirming only the background grid remains on the hero (no column-lines overlay).

## 2025-12-10

- **Time:** 2025-12-10 12:55 EST
- **Summary:** Removed the bottom gradient overlay from the hero so the background matches the product sections without extra dark fades.
- **Root Cause:** A lingering bottom fade overlay kept the hero darker than the aligned section treatment.
- **Changed Files:** src/components/LandingHero.tsx
- **Verification:** Manual review confirming the bottom gradient div no longer carries a background.

## 2025-12-10

- **Time:** 2025-12-10 13:00 EST
- **Summary:** Simplified hero and section backgrounds further by removing grid overlay layers; now only neutral radial + linear gradients remain to eliminate stripe artifacts.
- **Root Cause:** Residual grid overlays were still visible as stripes over the backgrounds; request was to remove them for a clean neutral base.
- **Changed Files:** src/index.css
- **Verification:** Manual check confirming hero/section backgrounds no longer render grid lines or overlays—only neutral gradients remain.

## 2025-12-10

- **Time:** 2025-12-10 13:05 EST
- **Summary:** Restored a single subtle grid overlay on hero and product sections while keeping the neutral gradients, ensuring no double overlays or stripe artifacts.
- **Root Cause:** Removing all grid overlays made the backgrounds feel flat; request was to undo and keep one grid layer without extra shading.
- **Changed Files:** src/index.css
- **Verification:** Manual style review confirms one set of 140px grid lines atop neutral gradients for hero and sections, with no additional contrast overlays.

## 2025-12-10

- **Time:** 2025-12-10 12:20 EST
- **Summary:** Matched the landing hero background to the product sections by gating the column grid and subtle dark veil behind an explicit landing prop.
- **Root Cause:** The hero only rendered the base gradient/noise while sections added column lines and a 10% overlay, so the transition felt like two different surfaces.
- **Changed Files:** src/components/LandingHero.tsx; src/components/BiblioKitLanding.tsx
- **Verification:** Manual review confirming the homepage hero now shows the same grid and overlay treatment as the feature sections when `matchProductSectionBackground` is enabled.

## 2025-12-10

- **Time:** 2025-12-10 12:32 EST
- **Summary:** Removed the extra hero grid overlay and dark veil to eliminate double lines and stray color tints while keeping the base gradient consistent with product sections.
- **Root Cause:** Enabling the matching prop stacked an additional column grid and overlay on top of the hero’s built-in grid background, creating double lines and color shifts.
- **Changed Files:** src/components/LandingHero.tsx; src/components/BiblioKitLanding.tsx
- **Verification:** Manual review to confirm the hero now renders a single grid layer (from the base gradient only) with no added overlay.

## 2025-12-10

- **Time:** 2025-12-10 18:53 EST
- **Summary:** Removed the product hero’s right-side illustration and shifted product feature sections onto the landing gradient palette so the hero and sections share the same dark surface as the main landing page.
- **Root Cause:** Product pages still rendered a standalone media column in the hero and kept a light feature-section background, causing mismatched colors and surface treatments versus the landing experience.
- **Changed Files:** src/components/ProductHero.tsx; src/components/ProductContentSections.tsx; src/components/DynamicProductPage.tsx; src/components/AIRenameVariantsPage.tsx
- **Verification:** Not run (visual pass recommended to confirm the hero is text-only and feature sections use the landing gradient on product pages).

## 2025-12-10

- **Time:** 2025-12-10 19:00 EST
- **Summary:** Removed the extra hero column grid and bottom gradient fade on product pages so the hero surface matches the landing hero without double lines or added overlays.
- **Root Cause:** ProductHero still injected an additional column grid layer and a bottom gradient fade, creating a darker, over-lined surface compared to the landing hero.
- **Changed Files:** src/components/ProductHero.tsx
- **Verification:** Not run (visual check that product hero shows a single grid/gradient treatment matching the landing hero).

## 2025-12-10

- **Time:** 2025-12-10 19:26 EST
- **Summary:** Updated FAQ headings to use the current product name (e.g., “Quick answers to common questions about BiblioRename”) instead of the generic AI tools label.
- **Root Cause:** The FAQ block hardcoded “our AI-powered tools,” so product pages and landing surfaces didn’t reflect the specific plugin name in FAQ intros.
- **Changed Files:** src/components/FAQSchema.tsx; src/components/ProductContentSections.tsx
- **Verification:** Not run (visual check FAQ header shows the active product name).

## 2025-12-10

- **Time:** 2025-12-10 19:26 EST
- **Summary:** Switched FAQ question numbers to the brand pink so the numbering matches the primary CTA color instead of the prior multi-color gradient.
- **Root Cause:** FAQ numbering chip used a mixed gradient that didn’t align with the brand pink palette requested for callouts/CTAs.
- **Changed Files:** src/components/FAQSchema.tsx
- **Verification:** Not run (visual check FAQ number chips render in pink).

## 2025-12-10

- **Time:** 2025-12-10 19:30 EST
- **Summary:** Restyled the header dropdowns to match the new dark/pink palette and moved the X/Twitter link out of the header into the footer social block.
- **Root Cause:** Header menus still used the old slate gradient and kept a top-bar X icon that should live in the footer; the palette no longer matched the updated landing colors.
- **Changed Files:** src/components/Header.tsx; src/components/Footer.tsx
- **Verification:** Not run (visual check header dropdown uses dark/pink styling and footer shows the X link while the header no longer does).

## 2025-12-10

- **Time:** 2025-12-10 19:33 EST
- **Summary:** Updated blog listing and article pages to use the new dark gradient backgrounds, removed extra grid overlays from blog heroes, and aligned blog FAQ chips/nav cards to the brand pink palette.
- **Root Cause:** Blog pages still used the old backgrounds and grid overlays, creating a mismatch with the refreshed landing/product surfaces and inconsistent FAQ/card styling.
- **Changed Files:** src/components/BlogPage.tsx; src/components/BlogArticlePage.tsx; src/index.css
- **Verification:** Not run (visual check blog hero shows single grid layer, sections use landing gradient, and FAQ chips/nav cards match the pink palette).

## 2025-12-10

- **Time:** 2025-12-10 19:36 EST
- **Summary:** Synced the blog header bar to the hero background with the new dark gradient/blur so the top nav matches the blog hero surface.
- **Root Cause:** The blog header stayed transparent over the updated hero, breaking the unified background treatment.
- **Changed Files:** src/components/Header.tsx
- **Verification:** Not run (visual check blog nav uses the same dark gradient/blur as the hero).

## 2025-12-10

- **Time:** 2025-12-10 19:37 EST
- **Summary:** Added extra breathing room in landing product sections: +24px between media and copy columns and +16px vertical spacing between feature rows.
- **Root Cause:** Landing product features felt tight after the palette changes; spacing needed to match the updated layout rhythm.
- **Changed Files:** src/components/ProductContentSections.tsx
- **Verification:** Not run (visual check spacing between media/copy and between feature rows on the landing product section).

## 2025-12-10

- **Time:** 2025-12-10 19:42 EST
- **Summary:** Synced the blog header bar to the hero background using the same landing-style gradient grid so the top nav surface matches the blog hero colors.
- **Root Cause:** The blog header still used a different background than the hero, creating a visible mismatch at the top of blog pages.
- **Changed Files:** src/components/Header.tsx; src/index.css
- **Verification:** Not run (visual check blog header shares the hero gradient/grid).

## 2025-12-10

- **Time:** 2025-12-10 21:38 EST
- **Summary:** Removed the fourth BiblioRename feature section so the product page shows only the three current blocks.
- **Root Cause:** The Section 4 content is no longer part of the approved BiblioRename lineup but persisted in both the static content JSON and the fallback component copy.
- **Changed Files:** src/components/AIRenameVariantsPage.tsx; src/data/products.json
- **Verification:** Not run (manual check BiblioRename page shows three feature sections and no "Keep every team in sync" block).

- **Time:** 2025-12-10 21:44 EST
- **Summary:** Trimmed the BiblioRename hero callouts to remove the developer-handoff and cross-team governance lines, leaving only the install CTA.
- **Root Cause:** The hero still surfaced callout bullets that are no longer part of the approved messaging for the BiblioRename hero.
- **Changed Files:** src/components/AIRenameVariantsPage.tsx; src/data/products.json
- **Verification:** Not run (manual check hero callouts show only the install link).

- **Time:** 2025-12-10 21:57 EST
- **Summary:** Restored default hero padding on BiblioRename by removing the no-padding overrides so it matches other product pages.
- **Root Cause:** The hero had custom padding overrides (`withBottomPadding={false}`, `containerPaddingOverride="px-0 md:px-0"`) that left the layout edge-to-edge instead of the standard container gutters.
- **Changed Files:** src/components/AIRenameVariantsPage.tsx
- **Verification:** Not run (manual check hero horizontal gutters and bottom spacing align with other product pages).

- **Time:** 2025-12-10 21:58 EST
- **Summary:** Rebuilt the product hero layout into a 5-column grid with 24px gutters and placed the content in the leftmost two columns for consistent alignment.
- **Root Cause:** The hero used a single-column flex layout, preventing the requested 5-column structure and left-span content placement.
- **Changed Files:** src/components/ProductHero.tsx
- **Verification:** Not run (manual check hero shows 5-column grid with content spanning the first two columns and 24px horizontal gutter).

- **Time:** 2025-12-10 22:00 EST
- **Summary:** Set product hero callout links to the brand pink color so hero hyperlinks align with the pink CTA palette.
- **Root Cause:** Hero callout links inherited white text, missing the brand pink styling requested for hyperlinks.
- **Changed Files:** src/components/ProductHero.tsx
- **Verification:** Not run (visual check hero callout links render in pink with hover to white).

- **Time:** 2025-12-10 22:04 EST
- **Summary:** Removed hero callout bullets/links on product pages by disabling callout rendering in ProductHero.
- **Root Cause:** Product heroes still rendered callout bullets; requirement is to show no bullets/links on product page heroes.
- **Changed Files:** src/components/ProductHero.tsx
- **Verification:** Not run (manual check product heroes show no callout bullets/links).

- **Time:** 2025-12-10 22:05 EST
- **Summary:** Updated the BiblioRename hero description to highlight AI-driven semantic renaming without manual rules.
- **Root Cause:** The hero description still used the older standardization copy instead of the requested AI visual-hierarchy messaging.
- **Changed Files:** src/components/AIRenameVariantsPage.tsx; src/data/products.json
- **Verification:** Not run (manual check BiblioRename hero shows the new description text).

- **Time:** 2025-12-10 22:07 EST
- **Summary:** Widened the product hero content span to 3 columns within the 5-column grid for better balance.
- **Root Cause:** Content was limited to 2 columns in the 5-column layout, leaving extra whitespace to the right of the hero content.
- **Changed Files:** src/components/ProductHero.tsx
- **Verification:** Not run (visual check product hero content spans 3 of 5 columns).

- **Time:** 2025-12-10 22:08 EST
- **Summary:** Reworked the product hero grid to 12 columns with a 4-column content span for clearer alignment.
- **Root Cause:** The 5-column grid left content sizing awkward; requirement is a 12-column layout with content across 4 columns.
- **Changed Files:** src/components/ProductHero.tsx
- **Verification:** Not run (visual check product hero content spans 4 of 12 columns).

- **Time:** 2025-12-10 22:10 EST
- **Summary:** Added newline rendering for hero descriptions and updated BiblioRename copy so “Turn Frame 422…” starts on its own line.
- **Root Cause:** Hero descriptions collapsed newlines, preventing the requested line break before “Turn Frame 422…”.
- **Changed Files:** src/components/ProductHero.tsx; src/components/AIRenameVariantsPage.tsx; src/data/products.json
- **Verification:** Not run (manual check BiblioRename hero shows the line break before “Turn Frame 422…”).

- **Time:** 2025-12-10 22:14 EST
- **Summary:** Updated BiblioRename hero CTA to “Start Renaming” with a leading arrow icon and ensured the primary button renders the icon before text.
- **Root Cause:** Hero CTA still used the old label and placed the icon after the text, conflicting with the requested CTA copy and ordering.
- **Changed Files:** src/components/ProductHero.tsx; src/components/AIRenameVariantsPage.tsx; src/data/products.json
- **Verification:** Not run (manual check BiblioRename hero button shows leading arrow icon and “Start Renaming” text).

- **Time:** 2025-12-10 23:16 EST
- **Summary:** Centered the product hero content within the 12-column grid by starting the 4-column span at column 5 for balanced whitespace.
- **Root Cause:** Content sat at the far left of the 12-column grid, leaving heavy empty space on the right and an imbalanced hero.
- **Changed Files:** src/components/ProductHero.tsx
- **Verification:** Not run (visual check hero content centers within the 12-column grid with even side space).

- **Time:** 2025-12-10 23:18 EST
- **Summary:** Reverted hero centering and increased vertical spacing inside the hero content stack for better balance.
- **Root Cause:** Centering the content block didn’t address the real issue—tight spacing between hero elements—so the content now stays in its original grid position with added internal gap.
- **Changed Files:** src/components/ProductHero.tsx
- **Verification:** Not run (visual check hero content is left-aligned within the grid and has looser spacing between elements).

- **Time:** 2025-12-10 23:20 EST
- **Summary:** Added 16px more spacing between the product hero badge and title by increasing the vertical gap in the title wrapper.
- **Root Cause:** Badge and product name were too tight; needed extra separation for readability.
- **Changed Files:** src/components/ProductHero.tsx
- **Verification:** Not run (visual check badge-to-title gap increased by ~16px).

- **Time:** 2025-12-10 23:21 EST
- **Summary:** Added another ~22px of spacing between the badge and title in the product hero by further increasing the title wrapper gap.
- **Root Cause:** Additional separation was requested to further loosen the badge-to-title spacing.
- **Changed Files:** src/components/ProductHero.tsx
- **Verification:** Not run (visual check shows larger badge-to-title gap).

- **Time:** 2025-12-10 23:22 EST
- **Summary:** Pulled the hero description 16px closer to the title for tighter hierarchy.
- **Root Cause:** The description sat too far below the title after prior spacing changes; needed a closer relationship to the headline.
- **Changed Files:** src/components/ProductHero.tsx
- **Verification:** Not run (visual check description sits ~16px closer to the title).

- **Time:** 2025-12-10 23:23 EST
- **Summary:** Moved the hero CTA 12px closer to the description by reducing the top margin on the CTA wrapper.
- **Root Cause:** CTA sat too far below the description after spacing tweaks; needed tighter vertical rhythm.
- **Changed Files:** src/components/ProductHero.tsx
- **Verification:** Not run (visual check CTA sits ~12px closer to the description).

- **Time:** 2025-12-10 23:24 EST
- **Summary:** Pulled the hero CTA another ~12px closer to the description by removing the remaining top margin.
- **Root Cause:** Additional tightening requested after the initial CTA spacing reduction.
- **Changed Files:** src/components/ProductHero.tsx
- **Verification:** Not run (visual check CTA is closer to the description with no top margin).

## 2025-12-11

- **Time:** 2025-12-11 15:30 EST
- **Summary:** Opened AI crawl gates (Perplexity/Claude in robots), refreshed llms.txt to 50+ priority URLs, added a Netlify post-deploy IndexNow ping, removed the demo key fallback, and surfaced visible “Updated YYYY-MM-DD” stamps on articles, BiblioRename, and the prototype cleanup resource.
- **Root Cause:** AI readiness gaps: Perplexity/Claude weren’t allowed in robots.txt, llms.txt was stale with only five URLs, IndexNow required manual runs and could silently fall back to a demo key, and pages lacked visible freshness signals for LLM snippets.
- **Changed Files:** public/robots.txt; public/llms.txt; netlify/plugins/indexnow-notify/index.js; netlify.toml; netlify/functions/indexnow.ts; src/components/BlogArticlePage.tsx; src/components/RemovePrototypeLinkPage.tsx; src/components/ProductHero.tsx; src/components/AIRenameVariantsPage.tsx
- **Verification:** Manual review—robots.txt now lists GPTBot/PerplexityBot/ClaudeBot; llms.txt lists 50+ prioritized URLs dated 2025-12-11 with one-line summaries; IndexNow function errors without a real key and plugin added to Netlify onSuccess; blog/resource/product pages render “Updated 2025-12-11” badges in the UI.

- **Time:** 2025-12-11 13:40 EST
- **Summary:** Removed feature descriptions from product pages so feature cards show only titles and bullet lists (landing layout still keeps descriptions).
- **Root Cause:** Product page feature cards still rendered body descriptions; request was to drop descriptions on product pages while preserving landing copy.
- **Changed Files:** src/components/ProductContentSections.tsx
- **Verification:** Not run (manual check product page feature cards omit description text; landing feature sections unchanged).

- **Time:** 2025-12-11 10:15 EST
- **Summary:** Added a canonical `/biblio-rename` product route with redirects, sitemap/SEO updates, and bot/static handling while keeping the legacy `/ai-rename-variants` URL as an alias.
- **Root Cause:** BiblioRename still lived on the older `/ai-rename-variants` path, which wasn’t a best-practice URL and left SEO/sitemap data pointing at the outdated slug.
- **Changed Files:** src/config/routes.ts; src/App.tsx; src/components/AIRenameVariantsPage.tsx; src/lib/seo.ts; netlify/functions/sitemap.ts; netlify/edge-functions/bot-detection.ts; _redirects; public/llms.txt; features-default.json; default-content.json; clean-content.json; correct-content.json; current-default-content.json; fixed-content.json; src/data/products.json; src/components/Docs.tsx; src/components/Footer.tsx; tests/e2e/biblio-rename-features.spec.ts
- **Verification:** Not run (manual routing/URL check recommended for `/biblio-rename` and legacy redirect).

- **Time:** 2025-12-11 10:28 EST
- **Summary:** Trimmed the BiblioRename FAQ to the top three questions by removing the last two entries from the page and product data.
- **Root Cause:** FAQ included redundant Q4/Q5 that needed to be removed for clarity.
- **Changed Files:** src/components/AIRenameVariantsPage.tsx; src/data/products.json
- **Verification:** Not run (manual check BiblioRename FAQ shows 3 questions).

- **Time:** 2025-12-11 10:34 EST
- **Summary:** Removed the “Built for safe iteration” feature block from BiblioRename so the page and static content only show the remaining feature cards.
- **Root Cause:** The safe-iteration section was no longer needed in the BiblioRename feature lineup.
- **Changed Files:** src/components/AIRenameVariantsPage.tsx; src/data/products.json
- **Verification:** Not run (manual check BiblioRename page features exclude the safe-iteration card).

- **Time:** 2025-12-11 10:39 EST
- **Summary:** Replaced the BiblioRename “Bulk renaming made effortless” video with an FPO blueprint illustration so the section no longer embeds a video asset.
- **Root Cause:** The bulk renaming feature should show a static FPO illustration instead of the previous looping video.
- **Changed Files:** src/components/AIRenameVariantsPage.tsx; src/data/products.json
- **Verification:** Not run (manual check BiblioRename bulk renaming feature shows the FPO blueprint illustration instead of the video).

- **Time:** 2025-12-11 10:44 EST
- **Summary:** Fixed the BiblioRename feature layout crash by switching the placeholder blueprint theme to a supported value (ink) after the video removal introduced an unsupported theme key.
- **Root Cause:** The new blueprint config used a non-existent `slate` theme, causing the UI to break when rendering the feature.
- **Changed Files:** src/components/AIRenameVariantsPage.tsx; src/data/products.json
- **Verification:** `npm run build` (pass).

## 2025-12-12

- **Time:** 2025-12-12 02:05 EST
- **Summary:** Removed the glassmorphism background on header dropdowns; now uses a solid dark surface with the existing border/shadow depth.
- **Root Cause:** Dropdown panels kept a translucent gradient with backdrop blur, creating the glass look that needed to be removed.
- **Changed Files:** src/components/Header.tsx
- **Verification:** Not run (visual check header dropdown surface is opaque dark with no blur).

- **Time:** 2025-12-12 02:10 EST
- **Summary:** Reverted BiblioRename hero copy to the earlier version by removing the highlight/badge/callouts and restoring the older CTA/description so the hero matches the pre-layout-change content.
- **Root Cause:** Hero still reflected the newer layout copy; request was to return to the previous version.
- **Changed Files:** src/data/products.json
- **Verification:** Not run (visual check hero shows “Stop renaming manually…” with “Rename Layers” CTA and no highlight badge).

- **Time:** 2025-12-12 07:15 EST
- **Summary:** Restored the Figma plugin badge on BiblioRename hero and removed the last-updated chip to match the requested badge-only state.
- **Root Cause:** Latest revert dropped the badge and left an updated date; requirement is badge visible, no updated chip.
- **Changed Files:** src/data/products.json
- **Verification:** Not run (visual check hero shows the Figma Plugin badge and no “Updated …” chip).

## 2025-12-13

- **Time:** 2025-12-13 23:45 EST
- **Summary:** Added the missing hero image to the Design System Guidelines blog content so the page no longer renders without media.
- **Root Cause:** The article had only text and captions; no image block referenced the existing hero asset, leaving the page image-less.
- **Changed Files:** src/data/blogPosts.ts
- **Verification:** Not run (visual check /blog/mastering-design-system-guidelines shows the hero image).

## 2025-12-14

- **Time:** 2025-12-14 02:03 EST
- **Summary:** Added image blocks for all missing captions in the Design System Guidelines article so each referenced visual renders instead of showing empty space.
- **Root Cause:** The post only had caption text; no image blocks referenced existing art, leaving multiple sections without visuals.
- **Changed Files:** src/data/blogPosts.ts
- **Verification:** Not run (visual check /blog/mastering-design-system-guidelines displays images for audit, principles, library, and documentation sections).

- **Time:** 2025-12-14 02:06 EST
- **Summary:** Added the missing image for the “Google sign” section in the Design System Guidelines article to eliminate the blank caption.
- **Root Cause:** That section still used a caption-only block with no image source, so the page showed empty space where the visual should be.
- **Changed Files:** src/data/blogPosts.ts
- **Verification:** Not run (visual check /blog/mastering-design-system-guidelines shows the Google sign image).

## 2025-12-14

- **Time:** 2025-12-14 08:45 EST
- **Summary:** Made all blog image captions render in italics and added explicit captions for the newly added design system and component state images pulled from the source docs.
- **Root Cause:** Figcaptions were plain text and the imported doc images lacked explicit captions, so image notes displayed unstyled alt text instead of italicized captions.
- **Changed Files:** src/components/BlogArticlePage.tsx; src/data/blogPosts.ts; public/blog/design-system-guidelines/hero-1.jpg; public/blog/design-system-guidelines/hero-2.jpg; public/blog/ui-component-states/hero-watercolor.png; public/blog/ui-component-states/dashboard-dark.png; public/blog/ui-component-states/desk-ui-library.jpg
- **Verification:** Not run (visual check blog posts to confirm italicized captions and image placement).

- **Time:** 2025-12-14 08:46 EST
- **Summary:** Set blog hero images to use the first images from each source doc for the design guidelines and component states posts.
- **Root Cause:** Hero images still pointed to older assets instead of the first doc-provided visuals, so page headers did not reflect the imported media.
- **Changed Files:** src/data/blogPosts.ts
- **Verification:** Not run (visual check hero images on both blog posts).

- **Time:** 2025-12-14 01:11 EST
- **Summary:** Centered the landing features section midline across the whole section and added a default export to Docs so the App route import resolves; build now succeeds.
- **Root Cause:** The white line was positioned relative to the intro block instead of the full features section, leaving it offset; Docs only provided a named export while App imported it as a default, which caused the esbuild failure.
- **Changed Files:** src/components/ProductFeaturesSection.tsx; src/components/Docs.tsx
- **Verification:** npm run build (pass).

- **Time:** 2025-12-14 02:24 EST
- **Summary:** Added Jest + Testing Library harness and ProductContentSections characterization/contract tests; aligned Jest to v29 with vm-modules flag so import.meta-based env checks parse correctly.
- **Root Cause:** Direct `npx jest --runInBand` failed on `import.meta` inside ProductContentSections; ts-jest needed the ESM preset plus Node’s vm-modules flag to execute components compiled with bundler-style env reads.
- **Changed Files:** package.json; jest.config.cjs; tsconfig.jest.json; jest.setup.ts; test/jest/styleMock.js; client/src/__tests__/unit/ProductContentSections.spec.tsx
- **Verification:** npm run test:unit -- client/src/__tests__/unit/ProductContentSections.spec.tsx (passes with NODE_OPTIONS=--experimental-vm-modules)

- **Time:** 2025-12-14 01:10 EST
- **Summary:** Fixed the docs route import so builds succeed and the UI Component States blog slug ships in the bundle, restoring the /blog/ui-component-states-guide page locally.
- **Root Cause:** `src/components/Docs.tsx` only exported a named component; App.tsx imported a default, causing Vite build failure and leaving the new blog slug out of the last build.
- **Changed Files:** src/components/Docs.tsx
- **Verification:** npm run build (passes; dist/client/blog now includes ui-component-states assets)

- **Time:** 2025-12-14 04:18 EST
- **Summary:** Realigned the landing features midline so the white stroke sits behind the intro title instead of halfway down the section.
- **Root Cause:** The horizontal accent line was anchored to the full features section height, so it landed far below the intro headline.
- **Changed Files:** src/components/ProductFeaturesSection.tsx
- **Verification:** Not run (CSS-only positioning change; needs visual check on landing hero/features header).

- **Time:** 2025-12-14 08:01 EST
- **Summary:** Restored the Unicorn embed behind the features title block by nesting the accent line inside the intro container and layering the heading above it.
- **Root Cause:** Moving the line into a separate wrapper put it on top of the intro container, obscuring the embedded canvas background.
- **Changed Files:** src/components/ProductContentSections.tsx; src/components/ProductFeaturesSection.tsx
- **Verification:** Not run (visual check embed renders behind the title).

- **Time:** 2025-12-14 08:10 EST
- **Summary:** Made the landing features accent line full-width and placed it behind the Unicorn embed (line z-0, canvas z-10, heading z-20) so the background stays visible.
- **Root Cause:** The line sat above the embed and within the constrained container, hiding the canvas and stopping at ~85vw.
- **Changed Files:** src/components/ProductContentSections.tsx
- **Verification:** Not run (visual check line spans viewport behind the embed).

- **Time:** 2025-12-14 09:27 EST
- **Summary:** Added landing logo marquee diagnostics and specific class hooks to capture sizing because the client logos appear broken on the features section.
- **Root Cause:** The marquee renders semi-transparent (`text-white/40`) inline logos on the `landing-sections-gradient` grid background, so the 1px grid bleeds through the glyphs and makes the marks look fragmented.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** npm run build:client (pass; visual check still needed with debug logs on).

- **Time:** 2025-12-14 09:39 EST
- **Summary:** Fixed landing marquee bleed by raising logo opacity, masking the grid behind the marquee, reducing duplicate loops to two, and adding sizing caps for inline logos.
- **Root Cause:** Low-opacity logos on top of the landing grid let grid lines show through, fragmenting the marks; four duplicated logo sets also sat static when motion was reduced.
- **Changed Files:** src/components/ProductContentSections.tsx; src/index.css; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** npm run build:client (pass; visual check recommended).

- **Time:** 2025-12-14 09:45 EST
- **Summary:** Resolved React key warning in ProductContentSections by keying the features block, keeping the landing render clean in dev tools.
- **Root Cause:** ProductFeaturesSection was rendered inside a mapped block without a stable key, triggering React’s list key warning.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** npm run build:client (pass).

- **Time:** 2025-12-14 09:53 EST
- **Summary:** Removed the landing logo marquee strip (kept the section title) and suppressed marquee debug logging when the strip is absent.
- **Root Cause:** Logos still looked broken; removing the strip avoids the bleed entirely while preserving the section header.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** npm run build:client (pass; visual check to confirm strip is gone).

- **Time:** 2025-12-14 13:47 EST
- **Summary:** Unblocked Netlify deploy by adding the missing manifest for the IndexNow notify plugin so Netlify Build recognizes the custom plugin.
- **Root Cause:** The local `indexnow-notify` build plugin lacked a `manifest.yml`, which Netlify 35 now requires for custom plugins, causing deploy to fail at config resolution.
- **Changed Files:** netlify/plugins/indexnow-notify/manifest.yml
- **Verification:** netlify deploy --prod --build (pass).

- **Time:** 2025-12-14 13:50 EST
- **Summary:** Converted the IndexNow plugin to ESM and removed the stray `name` export so it loads under the repo-wide `"type": "module"` setting without triggering invalid-event errors.
- **Root Cause:** The plugin still used CommonJS `require` and exported `name`, which Netlify 35 treated as an event handler under ESM, throwing “Invalid event 'name'.”
- **Changed Files:** netlify/plugins/indexnow-notify/index.js
- **Verification:** netlify deploy --prod --build (pass; deploy live at https://www.bibliokit.com).

- **Time:** 2025-12-14 14:02 EST
- **Summary:** Restored the `/admin` route with a guarded placeholder screen so the URL no longer 404s on production; links offer a return to the site or a mailto to request credentials.
- **Root Cause:** The SPA routing table lacked an `/admin` entry after the CMS stack was stripped, so Netlify SSR fell through to the 404 component.
- **Changed Files:** src/config/routes.ts; src/App.tsx; src/components/AdminPage.tsx
- **Verification:** npm run build

- **Time:** 2025-12-14 14:10 EST
- **Summary:** Simplified the `/admin` placeholder to remove CMS instructions and only direct visitors back to the homepage.
- **Root Cause:** The interim admin screen had extra guidance and mailto links, but the request was to avoid details and just route users home.
- **Changed Files:** src/components/AdminPage.tsx
- **Verification:** Not run (UI copy-only change; build previously passing).

- **Time:** 2025-12-14 14:15 EST
- **Summary:** Removed pricing and guide/playbook references from the AI Rename CTA block, keeping the section focused on the free-credit kickoff CTA.
- **Root Cause:** The hero CTA still showed pricing and a Team Rollout Guide despite the request to drop pricing and guides/playbooks for products.
- **Changed Files:** src/components/AIRenameVariantsPage.tsx
- **Verification:** npm run build (pass).

- **Time:** 2025-12-14 14:18 EST
- **Summary:** Made the AI Rename CTA headline more action/benefit-driven while keeping the 8 free credits offer.
- **Root Cause:** The prior CTA line was descriptive but not strongly action/benefit oriented.
- **Changed Files:** src/components/AIRenameVariantsPage.tsx
- **Verification:** Not run (copy-only change; deploy build will run).

- **Time:** 2025-12-14 14:20 EST
- **Summary:** Reframed the “Admin Ready” callout to emphasize privacy-first handling (SSO, least-privilege, no exports, explicit approval before writes).
- **Root Cause:** The previous admin blurb highlighted billing and guides instead of privacy safeguards.
- **Changed Files:** src/components/AIRenameVariantsPage.tsx
- **Verification:** Not run (copy-only change; deploy build will run).

- **Time:** 2025-12-14 14:29 EST
- **Summary:** Renamed the AI Rename FAQ header from “Common questions” to “FAQ” per the request.
- **Root Cause:** The FAQ section heading didn’t match the desired label.
- **Changed Files:** src/components/AIRenameVariantsPage.tsx
- **Verification:** Not run (copy-only change; deploy build will run).

- **Time:** 2025-12-14 14:31 EST
- **Summary:** Numbered the AI Rename FAQ items and kept the “FAQ” heading visible to improve clarity and SEO structure.
- **Root Cause:** FAQ list was unnumbered and requested to be more explicit for SEO.
- **Changed Files:** src/components/AIRenameVariantsPage.tsx
- **Verification:** Not run (markup-only change; deploy build will run).

- **Time:** 2025-12-19 20:45 EST
- **Summary:** Logged orphaned sitemap URLs for core product pages and two blog articles from the 2025-12-20 sitemap report.
- **Root Cause:** Pages are present in the sitemap but not discovered via internal link crawl (likely missing crawlable links or JS-only navigation paths).
- **Changed Files:** docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (analysis-only; fixes pending).

- **Time:** 2025-12-19 21:08 EST
- **Summary:** Added crawlable bot HTML for product and blog routes, plus consistent internal links and metadata, to resolve orphaned sitemap URLs.
- **Root Cause:** Bot-rendered HTML only linked to `/biblio-rename` and returned generic content for other sitemap URLs, so crawlers flagged product/blog pages as orphaned.
- **Changed Files:** netlify/edge-functions/bot-detection.ts; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (recommend re-crawl or fetch bot HTML for `/`, `/blog`, and product routes).

- **Time:** 2025-12-19 22:46 EST
- **Summary:** Shortened the fallback meta description and aligned homepage SSR metadata to the designer/developer/marketer-inclusive 10x faster copy so descriptions stay under 160 characters.
- **Root Cause:** The SEO crawl read SPA fallback `index.html` metadata (188 characters) instead of route-specific SSR output, so every route inherited the same overlong description.
- **Changed Files:** index.html; src/lib/seo.ts; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (recommend re-crawl or check a production response for `X-SSR-Generated` and confirm meta description length).

- **Time:** 2025-12-19 23:28 EST
- **Summary:** Kept SSR active when the asset manifest fails by extracting JS/CSS tags from `/index.html`, and added an `X-SSR-Assets` header for quick verification.
- **Root Cause:** The Edge SSR handler returned the SPA fallback if it could not fetch `manifest.json`, causing crawlers to see generic meta descriptions across routes.
- **Changed Files:** netlify/edge-functions/ssr.ts; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (recommend hitting a route in production and checking `X-SSR-Assets` plus route-specific meta tags).

- **Time:** 2025-12-19 23:54 EST
- **Summary:** Verified production HTML is still serving SPA fallback (no `__SSR_DATA__` or `X-SSR-Generated`), so routes inherit the same long meta description in live responses.
- **Root Cause:** The SSR edge handler appears to be skipping or failing in production and returning `context.next()` instead of SSR output; edge function logs required to isolate the exact failure.
- **Changed Files:** docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** curl GET `/`, `/biblio-rename`, and `/blog/fix-detached-instances-figma` (all missing SSR markers and sharing the generic meta description).

- **Time:** 2025-12-19 23:59 EST
- **Summary:** After deploying the SSR fallback update, production still returns the SPA shell (no SSR markers), so meta descriptions remain shared (now shorter, but still not page-specific).
- **Root Cause:** SSR edge execution is still bypassed or failing at runtime; edge function logs are needed to pinpoint the error path.
- **Changed Files:** docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** curl GET the latest deploy URL `/`, `/biblio-rename`, and `/blog/fix-detached-instances-figma` (no `__SSR_DATA__` or `X-SSR-Generated`; shared meta description).

- **Time:** 2025-12-20 00:10 EST
- **Summary:** Fixed SSR crashes by bundling `@iconify/react` into the SSR bundle so it shares the same React instance and avoids the invalid hook call during server render.
- **Root Cause:** The SSR bundle inlined React (via `ssr.noExternal`) while `@iconify/react` was external, so it loaded a separate React instance and threw `Invalid hook call` during SSR, triggering the SPA fallback.
- **Changed Files:** vite.config.ts; dist/server/entry-server.js; dist/server/manifest.json; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Local SSR harness with `npx tsx /tmp/ssr-local-test.mts` now returns `X-SSR-Generated: true` and route-specific meta descriptions for `/`, `/biblio-rename`, and `/blog/fix-detached-instances-figma`.

- **Time:** 2025-12-20 00:14 EST
- **Summary:** Production SSR is now serving on the primary domain with route-specific metadata and SSR headers after the updated edge function deployment.
- **Root Cause:** Previous deploys still fell back to the SPA shell; the current deployment ships the SSR bundle that avoids the `@iconify/react` hook mismatch.
- **Changed Files:** docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** curl GET `https://www.bibliokit.com/`, `/biblio-rename`, and `/blog/fix-detached-instances-figma` now return `X-SSR-Generated: true`, `X-SSR-Assets: manifest`, and unique meta descriptions.

- **Time:** 2025-12-20 00:30 EST
- **Summary:** Allowed SSR on Netlify deploy previews by adding `*.netlify.app` to `ALLOWED_ORIGINS` in production runtime settings.
- **Root Cause:** Deploy preview hosts were rejected by the SSR allowlist, so Edge SSR returned the SPA shell instead of server-rendered HTML.
- **Changed Files:** docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** curl GET `https://69463082e7b5a4d2072f8949--bkitlaunch.netlify.app/` and `/blog/fix-detached-instances-figma` now return `X-SSR-Generated: true`; `/biblio-rename` returns SSR when requested with a cache-busting query string.

- **Time:** 2025-12-20 01:24 EST
- **Summary:** Shortened meta descriptions for `/biblio-rename` and two blog posts to keep snippets under 155 characters.
- **Root Cause:** The BiblioRename route metadata and two blog `metaDescription` fields exceeded 160 characters and were getting clamped in crawl output.
- **Changed Files:** src/lib/seo.ts; src/data/blogPosts.ts; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run yet (pending re-crawl after deployment to confirm meta description lengths).

- **Time:** 2025-12-20 01:28 EST
- **Summary:** Logged the orphaned `/resources/remove-prototype-link` page and low inbound links for specific blog posts from the latest internal link audit.
- **Root Cause:** The resource detail page is only listed in the sitemap and not linked from content or navigation; some blog posts are only referenced from the blog index and one related post.
- **Changed Files:** docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Internal link crawl saved to `/tmp/bibliokit-seo-crawl.csv` and `/tmp/bibliokit-seo-crawl.json`.

- **Time:** 2025-12-20 02:07 EST
- **Summary:** Added a resource link to `/resources/remove-prototype-link` in the header dropdown and rotated blog related posts to improve internal link coverage.
- **Root Cause:** The resource detail page was orphaned, and the related-posts list always used the same first three posts, leaving newer posts under-linked.
- **Changed Files:** src/components/Header.tsx; src/components/BlogArticlePage.tsx; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (recommend re-crawl to confirm inbound link improvements).

- **Time:** 2025-12-20 02:41 EST
- **Summary:** Shortened the meta description for the design system guidelines blog post to keep snippets under 155 characters.
- **Root Cause:** The description exceeded 155 characters, causing truncation in crawl output.
- **Changed Files:** src/data/blogPosts.ts; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run yet (pending deploy + re-crawl).

- **Time:** 2025-12-20 23:58 EST
- **Summary:** Linked the BiblioTable callout in the Auto Layout Wrap section to the official Figma Community plugin URL.
- **Root Cause:** The BiblioTable callout pointed to the internal `/biblio-table` page instead of the plugin listing.
- **Changed Files:** src/data/blogPosts.ts; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (link update only).

- **Time:** 2025-12-21 00:00 EST
- **Summary:** Hyperlinked the BiblioAudit and BiblioStates plugin names in the routines-for-checks blog section to their Figma Community listings.
- **Root Cause:** The plugin references used plain text names with parenthetical URLs instead of hyperlinking the plugin names.
- **Changed Files:** src/data/blogPosts.ts; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (link update only).

- **Time:** 2025-12-21 00:06 EST
- **Summary:** Swept blog posts to hyperlink plugin names to the official Figma Community listings (BiblioAudit, BiblioStates, BiblioTable, BiblioClean).
- **Root Cause:** Several blog mentions still used plain text or internal product links instead of direct plugin listing hyperlinks.
- **Changed Files:** src/data/blogPosts.ts; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (link updates only).

- **Time:** 2025-12-21 00:43 EST
- **Summary:** Differentiated blog H2 and H3 typography so heading hierarchy is visually distinct in blog articles.
- **Root Cause:** Blog heading rendering applied the same size class to every heading level.
- **Changed Files:** src/components/BlogArticlePage.tsx; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (visual check pending).

- **Time:** 2025-12-21 01:00 EST
- **Summary:** Standardized FAQ styling sitewide to use the pink numbered bubble layout for blog, product, and landing FAQ sections.
- **Root Cause:** FAQ sections were implemented with multiple markup styles (ordered lists, card layouts), leading to inconsistent visuals.
- **Changed Files:** src/components/FAQList.tsx; src/components/BlogArticlePage.tsx; src/components/FAQSchema.tsx; src/components/BiblioAuditPage.tsx; src/components/BiblioCleanPage.tsx; src/components/BiblioTablePage.tsx; src/components/AIRenameVariantsPage.tsx; AGENTS.md; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (visual check pending).

- **Time:** 2025-12-21 01:54 EST
- **Summary:** Updated page and blog meta descriptions to the OTTO-recommended format for the homepage, resources, products, and key blog posts.
- **Root Cause:** Several meta descriptions still used older short copy and did not follow the new OTTO-style format from the audit.
- **Changed Files:** src/lib/seo.ts; src/components/BiblioAuditPage.tsx; src/components/BiblioCleanPage.tsx; src/components/BiblioTablePage.tsx; src/data/blogPosts.ts; AGENTS.md; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (meta description updates only).

- **Time:** 2025-12-21 21:56 EST
- **Summary:** Restored the Effortless Table Design in Figma blog images from the source Google Doc so inline screenshots render on the site.
- **Root Cause:** The blog image assets were only present locally and never committed, so production lacked `/blog/effortless-table-design-figma` files.
- **Changed Files:** public/blog/effortless-table-design-figma/table-status-hero.png; public/blog/effortless-table-design-figma/table-cell-component-active.png; public/blog/effortless-table-design-figma/table-row-component.png; public/blog/effortless-table-design-figma/table-component-grid.png; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Compared Google Doc export hashes to local assets; confirmed the files exist on disk (deploy still needed).

- **Time:** 2025-12-22 01:07 EST
- **Summary:** Noted that the Netlify IndexNow deploy plugin submits only top-level URLs instead of the full sitemap list.
- **Root Cause:** `netlify/plugins/indexnow-notify/index.js` builds a fixed `urlList` (origin/llms/robots/sitemap) rather than pulling sitemap URLs.
- **Changed Files:** None.
- **Verification:** Reviewed `netlify/plugins/indexnow-notify/index.js` payload construction against the full sitemap requirement.

- **Time:** 2025-12-22 01:12 EST
- **Summary:** Updated the Netlify IndexNow deploy plugin to include the full sitemap URL list in submissions.
- **Root Cause:** The deploy plugin never fetched sitemap URLs, so IndexNow received only top-level endpoints.
- **Changed Files:** netlify/plugins/indexnow-notify/index.js; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (requires Netlify deploy run).

## 2025-12-23

- **Time:** 2025-12-23 00:57 EST
- **Summary:** Refined SEO metadata to prevent duplicate titles/descriptions, added noindex handling for legacy/missing blog slugs, and refreshed blog meta titles/descriptions to resolve H1/title duplication.
- **Root Cause:** Legacy and missing-blog routes reused blog metadata, and several posts used identical H1/meta titles, triggering duplicate-title/description flags.
- **Changed Files:** src/lib/seo.ts; src/data/blogPosts.ts
- **Verification:** Not run (manual review recommended for /ai-rename-variants, missing blog slugs, and updated blog meta tags).

- **Time:** 2025-12-23 00:57 EST
- **Summary:** Corrected structured data defaults with numeric rating fields, canonical www IDs, and aligned fallback index.html metadata/JSON-LD with SSR defaults.
- **Root Cause:** JSON-LD used string rating values and mixed non-www IDs in fallback markup, increasing schema validation errors.
- **Changed Files:** src/lib/seo.ts; index.html
- **Verification:** Not run (run Rich Results Test or schema validator on homepage and blog pages).

- **Time:** 2025-12-23 00:57 EST
- **Summary:** Rebuilt llms.txt with canonical URLs and added a public redirect for the legacy /ai-rename-variants path.
- **Root Cause:** llms.txt included fragments/legacy URLs and the production redirects file lacked the legacy slug redirect.
- **Changed Files:** public/llms.txt; public/_redirects
- **Verification:** Not run (curl /llms.txt and /ai-rename-variants after deploy).

- **Time:** 2025-12-23 02:11 EST
- **Summary:** Expanded on-page copy on landing, product, resources, and blog listing pages, surfaced features section descriptions, and added semantic hero labeling to improve text-to-HTML ratio and semantic structure.
- **Root Cause:** SEO export flagged low text/HTML ratio and low semantic HTML usage across core pages.
- **Changed Files:** src/components/ProductContentSections.tsx; src/data/products.json; src/components/BiblioAuditPage.tsx; src/components/AIRenameVariantsPage.tsx; src/components/BlogPage.tsx; src/components/ResourcesPage.tsx; src/components/RemovePrototypeLinkPage.tsx; src/components/ProductHero.tsx; src/components/DynamicProductPage.tsx; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (spot-check updated copy on landing, product, resources, blog pages; re-crawl after deploy).

- **Time:** 2025-12-23 02:42 EST
- **Summary:** Added required offers data to the SoftwareApplication JSON-LD so structured data validation stops flagging missing offers.
- **Root Cause:** The global SoftwareApplication schema omitted offers, triggering a validation error across pages that include it.
- **Changed Files:** src/lib/seo.ts; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (re-check in the structured data validator after deploy).

- **Time:** 2025-12-23 02:49 EST
- **Summary:** Added explicit image dimensions and eager loading for first blog images, plus updated hero glyph animation to avoid non-composited effects.
- **Root Cause:** Blog/marketing images rendered without width/height attributes and the first blog image was lazy-loaded; the hero glyph animation used animated drop shadows.
- **Changed Files:** src/lib/imageDimensions.ts; src/components/BlogPage.tsx; src/components/BlogArticlePage.tsx; src/components/Features.tsx; src/components/ProductFeatureMedia.tsx; src/components/AIRenameVariantsPage.tsx; src/components/BiblioCleanPage.tsx; src/components/BiblioAuditPage.tsx; src/components/BiblioTablePage.tsx; src/components/ClientsMarquee.tsx; src/index.css; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (re-run SEMrush Site Audit or Lighthouse after deploy).

- **Time:** 2025-12-23 22:24 EST
- **Summary:** Deployment served 404s for hashed JS assets after publishing the wrong directory; redeploying with `dist/client` restores assets.
- **Root Cause:** Manual Netlify CLI deploy used `--dir=dist` instead of the configured `dist/client`, so `/assets/*` files were missing.
- **Changed Files:** None (deploy configuration / publish path only).
- **Verification:** `curl -I https://www.bibliokit.com` (HTTP 200); `curl -I https://www.bibliokit.com/assets/index-CjyO82I0.js` (HTTP 200).

- **Time:** 2025-12-23 22:49 EST
- **Summary:** Center-aligned the landing features intro copy to match the centered headline.
- **Root Cause:** The description paragraph used a max width without centered alignment, so it rendered left-biased under the centered title.
- **Changed Files:** src/components/ProductContentSections.tsx
- **Verification:** Not run (visual check needed on the landing features intro).

- **Time:** 2025-12-23 23:00 EST
- **Summary:** Removed aggregateRating from SoftwareApplication structured data to clear the missing rating/review requirement warning.
- **Root Cause:** The homepage SoftwareApplication schema included aggregateRating, which triggered a required-field warning in structured data validation.
- **Changed Files:** src/lib/seo.ts; index.html; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (re-check Rich Results/Schema validator on the homepage after deploy).

## 2025-12-24

- **Time:** 2025-12-24 00:30 EST
- **Summary:** Removed SoftwareApplication JSON-LD to stop aggregateRating/review errors across the site.
- **Root Cause:** SoftwareApplication structured data without aggregateRating/review triggered invalid structured data warnings in audits.
- **Changed Files:** src/lib/seo.ts; index.html; AGENTS.md; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (re-check structured data validator after deploy).

- **Time:** 2025-12-24 01:08 EST
- **Summary:** Updated Component Auditor Toolkit links to the official BiblioAudit Figma listing to replace the bare plugin ID URL flagged by the 403 crawl.
- **Root Cause:** The design-dev-gap-2026 blog content linked to the plugin ID without the official listing slug, which triggered the 403 external-resource report.
- **Changed Files:** src/data/blogPosts.ts; docs/live-debug/LIVE_DEBUG_2025-12.md
- **Verification:** Not run (click the updated blog links after deploy).
