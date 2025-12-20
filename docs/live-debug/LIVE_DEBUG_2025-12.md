# Live Debug Log — 2025-12

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
