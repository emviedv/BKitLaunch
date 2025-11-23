# Accessibility Phase 1 Audit – November 19, 2025

## Scope & Sources
- Landing stack: `src/components/BiblioKitLanding.tsx`, `Header.tsx`, `LandingHero.tsx`, `ClientsMarquee.tsx`, `ProductContentSections.tsx`, `Footer.tsx`
- Product routes: `AIRenameVariantsPage.tsx`, `DynamicProductPage.tsx` (`ProductHero.tsx` + `ProductContentSections.tsx`), `RemovePrototypeLinkPage.tsx`
- Blog: `BlogPage.tsx`, `BlogArticlePage.tsx`
- Waitlist + FAQs: `Waitlist.tsx`, `FAQSchema.tsx`

## Surface Catalog

### Landing Experience
**Heading levels**
- `Header` renders a logo as `<h1>` inside the global `<header>` even while `LandingHero` also exposes an `<h1>`, creating a double-h1 pattern on every view.
- `LandingHero` (`section[aria-labelledby=landing-hero-heading]`) contains a single `<h1>` plus optional body copy.
- `ClientsMarquee` exposes only a `<p>` for “Trusted by…” and no semantic heading.
- `ProductContentSections` blocks include: section label `<p>` + `<h2>` for “Features”, card-level `<h3>` headings, and later `<h2>` instances for benefits/testimonials/FAQs (rendered through `ContentChunk` and `FAQSchema`).
- `Footer` omits headings entirely (only inline text and anchors).

**Region landmarks**
- Global `<header>` + `<main>` + `<footer>` are present via `LandingLayout`, but inner sections (marquee, expert quote, statistic, benefits, testimonials, FAQ) do not expose `aria-labelledby` or IDs for skip links.
- Feature nav renders a nested `<nav>` + `<ul>/<li>` correctly, yet other navigation clusters (footer links) are not inside list semantics.

**Interactive controls**
- Header: mobile menu toggle button (aria-expanded), sign-in button, CTA buttons, dropdown toggle buttons (lack aria-expanded), resource dropdown links.
- Hero: primary/secondary CTA `<Button>` instances plus anchor wrappers.
- Features/tests: “Try X For Free” buttons inside every feature card, nav quick links, avatar-only icons (purely decorative, `aria-hidden`).
- Footer: two inline links (Resources, Blog) without list semantics.

### Product Pages
**Shared template (ProductHero + ProductContentSections)**
- `ProductHero` renders an unlabelled `<section>` with `<h1>` but no `aria-labelledby`. Any sub-feature callouts rely on `<p>` tags.
- Product CTA row contains `Button` controls for primary/secondary actions and optional icon glyph toggles (icons marked `aria-hidden`).
- Downstream sections reuse the same `ProductContentSections` component described above.

**AI Rename Variants**
- Adds additional `<section>` clusters for persona pains, transformation steps, feature groups, testimonials, pricing grid, FAQ schema, etc. Headings cascade from `<h2>` (“Clean up prototypes…” etc.) down to `<h3>`/`<p>`.
- UI controls include hero install CTA, secondary “See workflow” button, inline `Button asChild` wrappers on feature cards and pricing cards, plus FAQ schema accordion-style layout (static blocks, no toggles).

**DynamicProductPage (BiblioAudit & UXBiblio)**
- Shares the same hero + sections layout; hero `<section>` lacks programmatic label, sections lack `aria-labelledby`.
- Waitlist visibility toggle drives `Waitlist.tsx` insertion but does not alter semantics.

**Remove Prototype Link Page**
- Uses `LandingHero` (proper `aria-labelledby`) followed by two `<section>` blocks:
  - `#prototype-cleanup` with `<h2>` headings for both copy and live preview columns.
  - Highlight grid uses `<h2>` (“Give every cleanup step a fast lane”) plus `<p>` subcopy.
- Interactive controls: hero CTAs (“Join Designers…” anchor), final CTA button reinserting waitlist messaging, list items with purely decorative bullets.

### Blog Surfaces
**Blog index (`BlogPage.tsx`)**
- Hero section (#blog-latest) contains `<h1>` for the featured article and `<p>` for metadata; aside uses `<p>` labels.
- Secondary section uses `<h2>` (“Browse BiblioKit Articles”) followed by card-level `<h3>` headings.
- Regions are raw `<section>` blocks without `aria-labelledby`; no `<main>` wrapper beyond the app-level main.
- Interactive controls: featured CTA anchor, card anchors with `aria-label`, recent article list anchors.

**Blog article detail (`BlogArticlePage.tsx`)**
- Reuses `LandingHero` for the article hero (`<section aria-labelledby=landing-hero-heading>`), then wraps content in `<article>` with nested dynamic headings (blocks default to `<h3>` but can emit `<h2>` etc. based on content data).
- FAQ section uses `<section>` + repeated `<h3>` per Q/A.
- Navigation clusters (“Next & previous”, “Related articles”) rely on `<section>` elements without nav roles.
- Controls: next/previous anchor cards, related article anchors, hero CTAs for not-found state, inline highlight links.

### Waitlist (`Waitlist.tsx`)
- Renders `<section id=landing-waitlist>`; main heading is `<h2>` but section lacks `aria-labelledby`.
- Form controls: labeled email `<input>` (sr-only label + `aria-describedby`), submit `<Button>`, validation alert `role="alert"`, success `role="status"`.
- No additional navigation/landmark markup beyond the section wrapper.

### FAQ Blocks (`FAQSchema.tsx`)
- Outputs a `<div>` with static copy: `<p>` label, `<h2>` heading, `<h3>` per FAQ.
- JSON-LD injection runs via `useSchema`.
- Lacks outer `<section>` semantics and any `aria-labelledby` hook, so upstream sections referencing FAQs rely on surrounding wrappers (e.g., `ProductContentSections`).

## Missing Programmatic Labels & Semantic Gaps
| Area | Issue | Impact |
| --- | --- | --- |
| Header (`Header.tsx`) | Desktop dropdown toggle `button` only sets `aria-haspopup` but never updates `aria-expanded` nor references a controlled menu. Logo uses `<h1>` everywhere. | Screen readers cannot detect menu state; multiple `<h1>` elements appear before main content. |
| Footer (`Footer.tsx`) | Footer nav links sit directly under `<nav>` without `<ul>/<li>` structure or `aria-label`. | Violates Phase 2 nav pattern, reduces semantics for assistive tech. |
| Product hero sections (`ProductHero.tsx`) | `<section>` lacks `aria-labelledby`; hero heading has no `id` for referencing. | Landmarks cannot be discovered via heading references, hurting skip/outline flows. |
| Product sub-sections (`ProductContentSections.tsx`) | Expert quote, statistic, benefits, testimonials, and FAQ sections use naked `<section>` elements with no IDs/`aria-labelledby`. Expert/statistic blocks also lack visible headings. | Regions are invisible to assistive navigation and fail the “section must have a heading” convention Emily requested. |
| Clients marquee (`ClientsMarquee.tsx`) | Section lacks a proper heading element and `aria-labelledby`. | Screen reader users only hear “section” with no description. |
| Blog list + article nav (`BlogPage.tsx`, `BlogArticlePage.tsx`) | Sections rely solely on visual styling; there is no `aria-labelledby` or `role="navigation"` for “Next & previous”/“Related articles”. | Difficult to jump between content regions or identify that link sets behave like navigation. |
| Waitlist (`Waitlist.tsx`) | Section lacks `aria-labelledby` even though `<h2>` is present. | VoiceOver will announce a generic “section” rather than “Join Designers…” when moving by landmark. |
| FAQ schema component (`FAQSchema.tsx`) | Top wrapper is a `<div>`; no section semantics or labelledby hooking, repeated `<h3>` headings have no container heading targeting. | Cannot deep link or reference FAQ region programmatically. |

## Priority Fix Queue (Hero/Nav/CTA First)
1. **Header + Footer landmarks** – move the header logo to a `<div>`/`<span>` with `aria-label` or downgrade to `<p>`, add `aria-expanded` on dropdown buttons, and wrap footer links in `<nav aria-label="Footer">` + `<ul>`. High visibility (site-wide) and affects every navigation interaction.
2. **Hero sections (`LandingHero`, `ProductHero`, Blog hero)** – ensure every hero `<section>` includes `aria-labelledby` pointing to its `<h1>` and unique IDs so primary CTAs reference a labelled region. This is the first content block on every surface.
3. **Primary CTA clusters in `ProductContentSections`** – add `aria-labelledby`/IDs to each `<section>` (“Features”, “Benefits”, “Testimonials”, “FAQs”) and insert hidden headings for statistic/expert sections. These CTA rows drive conversions and appear above the fold on product pages.
4. **Blog navigation sections** – convert “Next & previous” and “Related articles” into `<nav>` regions with descriptive labels so readers can find adjacent stories quickly.
5. **Waitlist + FAQ components** – wrap both in `<section role="region" aria-labelledby="...">` and expose IDs to satisfy the “Sections must expose aria-labelledby” rule before we wire linting/automation in Phase 3.
