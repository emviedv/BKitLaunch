# Live Debug Log — 2026-02

## 2026-02-05

- **Time:** 2026-02-05 (URL normalization refactor)
- **Summary:** Consolidated four separate URL normalization functions into a single shared utility to prevent future www/non-www mismatches.
- **Root Cause:** The January 2026 canonical fix (2026-01-25) updated `seo.ts`, `entry-server.tsx`, and `useSEO.ts` but missed `sitemap.ts`, which still had its own `normalizeBase()` function. Code duplication meant fixes in one place didn't propagate to others.
- **Changed Files:** src/lib/urlUtils.ts (new); src/lib/seo.ts; src/entry-server.tsx; src/hooks/useSEO.ts; netlify/functions/sitemap.ts; tests/unit/sitemap.spec.ts; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** All unit tests pass. Build succeeds.

- **Time:** 2026-02-05 (sitemap canonical URL fix)
- **Summary:** Fixed sitemap generating non-www URLs while canonical tags used www, causing 30 "Non-canonical URL" errors in Google Search Console.
- **Root Cause:** The `normalizeBase()` function in `sitemap.ts` returned `url.origin` directly from environment variables (often `https://bibliokit.com` without www), while `normalizeCanonicalBaseUrl()` in `seo.ts` always normalized to `https://www.bibliokit.com`. This mismatch meant sitemap URLs didn't match the declared canonical URLs on pages.
- **Changed Files:** netlify/functions/sitemap.ts; tests/unit/sitemap.spec.ts; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** Unit tests pass. Deploy to production and resubmit sitemap in GSC to verify all 30 errors resolve.

## 2026-02-16

- **Time:** 2026-02-16 15:51 EST
- **Summary:** Replaced the landing "Trusted by designers shipping real products in Figma" logo row with the correct in-repo brand assets and added a local Figma logo file.
- **Root Cause:** The row used external Brandfetch hotlinks, which made logo selection brittle and disconnected from the curated `/public/clients` assets used elsewhere in the product.
- **Changed Files:** src/components/ProductContentSections.tsx; public/clients/figma.svg; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Visual QA of the trusted-logo row still recommended.

- **Time:** 2026-02-16 15:55 EST
- **Summary:** Expanded the trusted-logo strip, reduced logo size by 20%, made the strip full width, and tied horizontal movement to page scroll.
- **Root Cause:** The prior row was static, limited to a small logo set, and constrained by the intro container width instead of spanning the full viewport.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Visual QA recommended to confirm scroll speed and full-width behavior on desktop/mobile.

- **Time:** 2026-02-16 15:57 EST
- **Summary:** Normalized trusted logos into consistent slots and applied an additional 20% downscale so the row reads evenly.
- **Root Cause:** Logos had inconsistent visual footprint due varying intrinsic SVG dimensions and whitespace, which made the strip look uneven.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Visual QA recommended for perceived balance across all logos.

- **Time:** 2026-02-16 15:59 EST
- **Summary:** Moved the trusted logo strip from the features section to directly under the hero primary CTA ("Explore Products"), preserving full-width, scroll-linked motion, and normalized sizing.
- **Root Cause:** Logos were placed in the downstream features section instead of the requested hero CTA location.
- **Changed Files:** src/components/LandingHero.tsx; src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Visual QA recommended to confirm spacing directly under the hero CTA.

- **Time:** 2026-02-16 17:15 EST
- **Summary:** Made the hero trusted-logo strip truly edge-to-edge and removed GitHub from the logo list.
- **Root Cause:** The strip still appeared constrained by centered content spacing and included a logo that was explicitly requested to be removed.
- **Changed Files:** src/components/LandingHero.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Visual QA recommended to confirm full-bleed width in hero.

- **Time:** 2026-02-16 17:29 EST
- **Summary:** Switched site typography to Google Sans Flex across global font loading, Tailwind font families, and hard-coded font overrides.
- **Root Cause:** The app still referenced multiple mixed families (Inter, Instrument Serif, Satoshi, and other configured stacks), so text did not render consistently in the requested typeface.
- **Changed Files:** index.html; tailwind.config.js; src/index.css; src/components/Header.tsx; src/components/OrigamiIllustration.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Visual QA recommended to confirm all text renders in Google Sans Flex.

- **Time:** 2026-02-16 17:44 EST
- **Summary:** Moved the hero CTA block closer to the title by tightening heading bottom margin and CTA top margin.
- **Root Cause:** Default hero spacing created too much vertical distance between the headline and CTA row.
- **Changed Files:** src/components/LandingHero.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Visual QA recommended to confirm final spacing preference.

- **Time:** 2026-02-16 17:45 EST
- **Summary:** Moved the hero client logo strip 80px lower by increasing its top margin.
- **Root Cause:** The client strip sat too close to the hero CTA relative to the requested position.
- **Changed Files:** src/components/LandingHero.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Visual QA recommended to confirm final vertical offset.

- **Time:** 2026-02-16 17:47 EST
- **Summary:** Added a stacked avatar row directly under the “shipping real products in Figma.” heading to increase social proof.
- **Root Cause:** The trusted heading lacked immediate human social authority cues beneath the headline.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Visual QA recommended to confirm avatar spacing/overlap on desktop and mobile.

- **Time:** 2026-02-16 17:48 EST
- **Summary:** Replaced trust-row avatars with real photo assets and added a numeric social-proof label ("1,000+ designers").
- **Root Cause:** The trust row used illustrated avatars only and lacked an explicit quantitative authority signal.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Visual QA recommended to confirm photo crop quality and number label balance.

- **Time:** 2026-02-16 17:50 EST
- **Summary:** Updated the “Get Beta Access” CTA to use the shared hero primary button class so it inherits the brand primary color.
- **Root Cause:** The CTA used a hard-coded pink background (`bg-[#f472b6]`) in the coming-soon branch, bypassing primary theme styles.
- **Changed Files:** src/components/Hero.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Visual QA recommended to confirm CTA color in the coming-soon state.

- **Time:** 2026-02-16 15:54 EST
- **Summary:** Improved landing hero startup speed by reducing home-route initialization cost and code loaded before first render.
- **Root Cause:** `App.tsx` eagerly imported all route pages into the first bundle, and the landing path duplicated published-content processing across multiple components, increasing main-thread work before the hero painted.
- **Changed Files:** src/App.tsx; src/components/BiblioKitLanding.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build` (pass). Client entry chunk dropped from 515.54 kB (`index-BxUybEnW.js`) to 343.76 kB (`index-BK55BhP3.js`), with route components split into lazy chunks.

- **Time:** 2026-02-16 17:53 EST
- **Summary:** Added staged hero headline animation in the landing hero to match the screenshot-selection motion style while preserving design-system styling.
- **Root Cause:** Landing hero text rendered statically, so it did not carry the same animated energy as the reference screenshot-selection keyframe treatment.
- **Changed Files:** src/components/LandingHero.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Visual QA recommended to confirm stagger timing and motion feel on desktop/mobile.

- **Time:** 2026-02-16 17:55 EST
- **Summary:** Applied the same staged headline animation to the Coming Soon hero so the motion appears when the site is in coming-soon mode.
- **Root Cause:** The previous animation change was limited to `LandingHero`, but the active page in coming-soon mode renders `Hero`, so users saw no headline motion there.
- **Changed Files:** src/components/Hero.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Visual QA recommended in coming-soon mode to confirm the headline animation is visible.

- **Time:** 2026-02-16 17:58 EST
- **Summary:** Updated hero client logos to auto-scroll continuously and accelerate while the user scrolls the page.
- **Root Cause:** The client list movement depended only on absolute page scroll position, so it stayed static when the page was idle and did not provide momentum behavior during active scrolling.
- **Changed Files:** src/components/LandingHero.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Visual QA recommended to tune perceived base speed and boost intensity if needed.

- **Time:** 2026-02-16 18:09 EST
- **Summary:** Reduced landing startup overhead by removing non-critical tracker work from the initial module graph and cutting repeated content-processing overhead.
- **Root Cause:** Landing boot path was doing extra non-UI work during startup: (1) LogRocket was bundled into the entry import graph, forcing an extra analytics payload on first load, (2) head trackers were injected immediately instead of waiting for idle, and (3) published content was deep-cloned repeatedly across hook consumers.
- **Changed Files:** src/entry-client.tsx; index.html; src/lib/publishedContent.ts; src/lib/debugService.ts; src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Startup import graph no longer includes analytics chunk (`dist/client/manifest.json` entry imports now only vendor + iconify). Clone benchmark confirms deep-clone overhead (~1.15ms/clone) is no longer repeated per consumer.

- **Time:** 2026-02-16 18:14 EST
- **Summary:** Reworked landing hero headline animation into a screenshot-capture sequence where a capture cursor and selection box reveal the headline text as they sweep across it, with reduced-motion fallback preserving static readability.
- **Root Cause:** The prior headline motion used generic staged fade/float keyframes, which did not communicate the intended screenshot-selection story.
- **Changed Files:** src/components/LandingHero.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Visual QA recommended to confirm timing/readability on desktop and mobile.

- **Time:** 2026-02-16 18:19 EST
- **Summary:** Adjusted screenshot-reveal interaction to follow a true top-left to bottom-right drag path for both cursor and selection box.
- **Root Cause:** The first screenshot-reveal pass still moved too horizontally and did not mirror a natural diagonal screenshot drag interaction.
- **Changed Files:** src/components/LandingHero.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Visual QA recommended to confirm diagonal drag fidelity and reveal pacing.

- **Time:** 2026-02-16 18:22 EST
- **Summary:** Changed screenshot reveal to a single unified movement across the full hero headline block instead of animating each line fragment.
- **Root Cause:** The reveal mask animation was applied to individual line spans, which created per-line motion rather than one section-level screenshot interaction.
- **Changed Files:** src/components/LandingHero.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Visual QA recommended to confirm the reveal now behaves as one continuous section-level sweep.

- **Time:** 2026-02-16 18:13 EST
- **Summary:** Updated the landing trust-row avatar stack to use people avatars instead of workspace/object photos.
- **Root Cause:** The trust-row avatar sources pointed to blog imagery that did not represent people, which conflicted with the requested people-based avatar treatment.
- **Changed Files:** src/components/ProductContentSections.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Visual QA recommended to confirm avatar styling and overlap in the landing feature intro.

- **Time:** 2026-02-16 18:23 EST
- **Summary:** Updated the landing screenshot-reveal styling to use a solid primary pink selection stroke and matching pink screenshot cursor.
- **Root Cause:** The screenshot overlay styling was still tied to `hsl(var(--primary))` (charcoal in current theme) and used a dashed border, which did not match the requested primary pink capture treatment.
- **Changed Files:** src/components/LandingHero.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Visual QA recommended to confirm stroke and cursor color consistency in the hero animation.

- **Time:** 2026-02-16 18:27 EST
- **Summary:** Smoothed the hero screenshot-reveal animation and increased selection-frame breathing room around the headline.
- **Root Cause:** The reveal animation mixed blur + segmented keyframes that introduced visible jitter, and overlay bounds were too tight to the heading block.
- **Changed Files:** src/components/LandingHero.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Visual QA recommended to confirm smoother motion and improved spacing around header text.

- **Time:** 2026-02-16 18:29 EST
- **Summary:** Converted the screenshot headline animation to a continuous forward/reverse loop and expanded frame spacing so the box/cursor interaction stays visible without reset jumps.
- **Root Cause:** The prior one-shot animation ended with a hard reset and still felt cramped around the text, which made motion feel slow/stuttery and visually tight.
- **Changed Files:** src/components/LandingHero.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Visual QA recommended to confirm loop smoothness and frame spacing on desktop/mobile.

- **Time:** 2026-02-16 18:34 EST
- **Summary:** Slowed the screenshot ping-pong loop to 5 seconds and expanded the selection frame further so it sits less tightly around hero text.
- **Root Cause:** The loop cadence was too fast and the capture bounds remained too close to the headline, creating a cramped effect.
- **Changed Files:** src/components/LandingHero.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Visual QA recommended to confirm timing and frame spacing feel.

- **Time:** 2026-02-16 18:39 EST
- **Summary:** Synced selection box/cursor movement with headline reveal, made the 5-second loop start visibly faster, and raised cursor layering to keep the screenshot cursor visible.
- **Root Cause:** The box mostly expanded from a fixed anchor instead of traveling with reveal progression, easing made early movement feel delayed, and cursor visibility was inconsistent against animated layers.
- **Changed Files:** src/components/LandingHero.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Visual QA recommended to confirm cursor visibility and motion pacing in both loop directions.

- **Time:** 2026-02-16 18:41 EST
- **Summary:** Anchored screenshot capture overlay to the actual headline bounds so the box/cursor motion follows the text block instead of the full hero content width.
- **Root Cause:** The capture wrapper was `width: 100%`, causing overlay positioning and percentages to be calculated against the entire hero content area rather than the rendered headline dimensions.
- **Changed Files:** src/components/LandingHero.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Visual QA recommended to confirm box/cursor alignment across desktop and mobile breakpoints.

- **Time:** 2026-02-16 19:17 EST
- **Summary:** Removed screenshot box drift by anchoring the selection geometry to the overlay origin and sped up the loop from 5s to 3.2s.
- **Root Cause:** Selection keyframes applied additional translate offsets on top of non-zero box anchors, causing visible positional drift from the text; 5s duration also made the interaction feel sluggish.
- **Changed Files:** src/components/LandingHero.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Visual QA recommended to confirm the box/cursor now stay aligned with the text and motion feels responsive.

## 2026-02-17

- **Time:** 2026-02-17 01:12 EST
- **Summary:** Fixed hero animation timing mismatch by changing selection animations from infinite looping to play-once-and-hold.
- **Root Cause:** The headline reveal animation used `forwards` (plays once, holds final state), but the selection box, cursor, and flash animations used `infinite alternate` (loop forever, reversing direction). After 3.2s, the headline stayed fully visible while the selection UI bounced backward, creating a visual disconnect.
- **Changed Files:** src/components/LandingHero.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run dev -- --port 5176` (pass). All four animations now complete together at 3.2s and hold their final state.

- **Time:** 2026-02-17 01:15 EST
- **Summary:** Fixed cursor animation not following text bounds by switching from transform-based to position-based animation.
- **Root Cause:** The cursor used `translate3d(100%, 100%, 0)` to animate, but CSS transform percentages are relative to **the element's own size** (the ~20px cursor icon), not the parent container. This caused the cursor to only move ~20px instead of traversing the entire headline area.
- **Changed Files:** src/components/LandingHero.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Cursor now animates using `left`/`top` properties which are relative to the containing overlay block.

- **Time:** 2026-02-17 01:18 EST
- **Summary:** Removed the hero headline selection animation entirely (box, cursor, flash overlay, and clip-path reveal).
- **Root Cause:** Animation complexity exceeded value; simpler static headline preferred.
- **Changed Files:** src/components/LandingHero.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Headline now displays immediately without animation.

- **Time:** 2026-02-17 01:22 EST
- **Summary:** Replaced horizontal scrolling logo marquee with 2 vertical columns of 4 logos each, sliding top-to-bottom in a continuous loop.
- **Root Cause:** User preference for vertical slide animation over horizontal scroll.
- **Changed Files:** src/components/LandingHero.tsx; docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** `npm run build:client` (pass). Two columns with staggered 8s vertical slide animation. Respects prefers-reduced-motion.

## 2026-02-26

- **Time:** 2026-02-26 23:20 EST
- **Summary:** Fixed site-wide 400 "Request Header Or Cookie Too Large" error on all SSR routes (/, /blog, etc.) while static assets still worked.
- **Root Cause:** Netlify CLI edge function bundling (`netlify-cli deploy --prod`) corrupted edge function state at the CDN layer (openresty). The error message was misleading—it wasn't actually about header/cookie size. Evidence: (1) clean curl requests with no cookies failed, (2) static assets worked while SSR routes failed, (3) older deploy previews suddenly started failing, (4) code hadn't changed between working and failing states.
- **Changed Files:** netlify.toml (temporarily commented out [[edge_functions]], then restored); netlify/edge-functions/ (temporarily moved to .bak, then restored); CLAUDE.md (added edge function recovery docs); AGENTS.md (added CLI deploy warning rule); docs/live-debug/LIVE_DEBUG_2026-02.md
- **Verification:** Production site at https://www.bibliokit.com returns HTTP 200 with SSR headers (`x-ssr-generated`, nonce-based CSP). All routes tested: /, /blog, /products/componentqa.
- **Fix procedure:** (1) Comment out [[edge_functions]] in netlify.toml, (2) move edge-functions/ to .bak, (3) deploy via git push (not CLI), (4) restore directory and config, (5) deploy again via git push. This clears corrupted edge function state.
- **Prevention:** Prefer `git push` + Netlify CI over `netlify-cli deploy --prod` for production deploys.
