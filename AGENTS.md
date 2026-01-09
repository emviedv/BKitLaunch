# Agent Guidelines

## Debug Log Policy
- Every bug discovered and every fix applied must be recorded in a product debug log. Include: date/time, concise summary, root cause, changed files/commits, and verification steps. Prefer `docs/live-debug/LIVE_DEBUG_YYYY-MM.md` (or `docs/debug-log.md` if no monthly log exists).

## Rule Codification & Conversation Clarity
- When Emily notes that something “should have been done” a certain way, capture that guidance here as a concise rule (add a brief example when useful).
- When creating a commit, always add the update to `AGENTS.md` to keep rules current.
- Products are built for designers, developers, and marketers—keep language inclusive of all three.
- Always use designer, developer, and marketing vocabulary in customer-facing copy (e.g., design systems, handoff, implementation, launch, campaigns).
- IndexNow submissions should include the full sitemap URL list (blog + product pages), not just top-level URLs.
- Netlify IndexNow deploy plugin should submit the full sitemap URL list (fetch `/sitemap.xml` and include every `<loc>` URL), not only the sitemap URL itself.
- Blog posts must be added to `BLOG_POSTS` so sitemap.xml auto-includes `/blog/{slug}` entries (e.g., add the slug in `src/data/blogPosts.ts`).
- Blog post excerpts and meta descriptions must be punchy, benefit-driven, and post-specific (e.g., "Build scannable Figma tables fast with Auto Layout patterns that stay intact.").
- Blog post descriptions should focus on the post topic benefits, do not force the "designers, developers, and marketers" phrase unless it is genuinely relevant.
- Success feedback surfaces must cap padding at 20px (e.g., waitlist success message stays tight with `p-5`).
- When applying a specific rule from this file, explicitly mention it in the conversation for clarity (e.g., “Applying Debug Log Policy” or “Following Commit Guidelines”).
- Use action/benefit-driven marketing copy (e.g., “Work x10,000 faster.”) whenever writing or updating customer-facing text.
- Keep CTA and product messaging designer/team-first—avoid stakeholder-targeted language. Default to “Join Designers shipping faster with BiblioKit” plus “Drop your email to jump the line for our next Figma plugins in beta” when updating shared copy.
- Never use em dashes in customer-facing copy; use commas or short sentences instead.
- When Emily requests a specific change, do not expand the scope or add extra copy/behavior beyond the exact ask (e.g., no bonus marketing lines unless explicitly requested).
- ComponentQA does not fix errors; describe it as surfacing issues or audits, not auto-fixing them (e.g., "deep scan, full audit" instead of "auto-fix").
- When Emily explicitly asks to commit all changes, include untracked assets as requested (e.g., `tmp/searchatlas-crops/`).
- BiblioRename titles must keep the product name as just "BiblioRename" (e.g., "Batch Rename Layers with AI (BiblioRename)", not "BiblioRename: ...").
- When Emily provides blog copy (e.g., Google Doc content), import it verbatim without edits or extra lines; keep the published post text exactly as supplied.
- Default voice: “Relatable Pro” (in-the-trenches expert) tone—high empathy “we” POV, conversational contractions/fragments, visceral language that names the pain, and insider specifics that show lived expertise; skip corporate polish and keep it human.
- Footer descriptions should be short, action/benefit-driven, and inclusive of designers, developers, and marketers.
- Always add the images provided in the source Google Doc when publishing any blog post; if assets aren’t available locally, request them instead of skipping media. If Emily explicitly requests replacements (e.g., from Google search), follow her direction for that post while noting the override.
- When publishing blog posts, verify every image asset path resolves and ensure URLs are formatted as hyperlinks.
- Landing page product sections get the horizontal feature nav; individual product pages keep their original layout (e.g., enable nav in `BiblioKitLanding`, leave `AIRenameVariantsPage` without it).
- Product pages alternate feature cards so media and copy swap sides down the page (e.g., AI Rename Variants features grid now alternates by default).
- When padding, gaps, or similar layout styling is applied to one product page’s features section, mirror those adjustments across all product pages—but confirm the approach with Emily before rolling it out globally.
- Pillar and hub pages should match the Learn page spacing format for the first content section (e.g., use `section-content pb-20 mt-8`).
- Pillar and hub page sections should include a "See All" link under the title/description, matching the Learn page format.
- HTML classes and IDs must be specific to the surface they belong to—no generic names like `button` or `section`. Prefer `ai-rename-hero-cta` over `cta` so styles stay scoped and readable.
- Bridge is an internal tool; avoid referencing it in customer-facing copy unless explicitly approved.
- Operational reminder: periodically pull waitlist signups locally with `npm run email:waitlist` (uses `DATABASE_URL` or .env/.env.local) to review beta interest.
- Keep React bundled with its vendor dependencies—do not isolate React (or scheduler) into a separate manual chunk, as circular imports can break hooks (`useState` undefined).
- After any change and deployment, explicitly verify the live production site loads (no blank/black screens) before handing off.
- When making infrastructure changes (DNS, hosting, domain config), always check for dependent services that could break (e.g., email MX records, SPF/DKIM/DMARC, third-party integrations). DNS changes for websites can silently break email delivery if MX records are missing or overwritten.
- When linking to live Figma Community assets, grab the official URLs from https://www.figma.com/@bibliokit (use product-specific plugin/file links, not generic waits or betas).
- In blog posts, hyperlink plugin names to their official Figma Community listings (e.g., `[ComponentQA](https://www.figma.com/community/plugin/1564328602359376130/componentqa-find-detached-instances-design-system-check)`).
- Avoid bare Figma plugin ID URLs; always use the full listing slug (e.g., `https://www.figma.com/community/plugin/1564328602359376130/componentqa-find-detached-instances-design-system-check`).
- Blog posts should render H2s larger than H3s to keep heading hierarchy visually distinct.
- Blog posts typically do not include FAQs; do not add FAQ sections unless explicitly requested.
- FAQs across the site should use the pink numbered bubble on the left for consistent styling.
- Search Console sitemap submit (BiblioKit): use service account `search-console-submitter@bibliokit.iam.gserviceaccount.com` with key at `/tmp/search-console-submitter-key.json` (create if missing), scope `https://www.googleapis.com/auth/webmasters`, and submit `https://www.bibliokit.com/sitemap.xml` to `sc-domain:bibliokit.com` via the Search Console API.
- Apply current SEO best practices (keep guidance refreshed for 2026): meaningful alt text on all images, clean descriptive URLs/slugs, accurate meta titles/descriptions, structured headings, and up-to-date sitemap/robots handling where relevant.
- For marketing/blog images, set explicit width/height and eager-load the first in-article image to reduce CLS/LCP; lazy-load the rest.
- Netlify CLI deploys must publish `dist/client` (not `dist`) to avoid missing `/assets/*` bundles.
- Keep `SoftwareApplication` schema for product pages, but omit `aggregateRating` and `review` unless we have verified, current rating data.
- Organization schema must include `logo` and `sameAs` with `https://www.figma.com/@bibliokit`; do not use the `industry` property because Schema.org does not recognize it.
- SoftwareApplication schema must include `image` and `operatingSystem` for rich results.
- Meta descriptions must be unique per page and stay under 155 characters (e.g., 120–150 chars) to avoid SERP truncation.
- Ensure every sitemap URL has at least one crawlable internal link (e.g., resources detail pages must be linked from nav or related content).
- Always check for SEO issues when adding new pages or changing URLs: verify sitemap includes the new/updated paths, confirm canonicalizeSlug mappings in sitemap.ts match route paths, and ensure meta titles/descriptions are set in seo.ts.
- Homepage SEO strategy: define the category ("Workflow Automation") before the brand. Page title: `Figma Workflow Automation & Design System Tools | BiblioKit`. Meta description: `BiblioKit is the Workflow OS for Figma. Automate DesignOps with an all-in-one suite for auditing systems, renaming variants, and fixing design drift.`
- ComponentQA SEO strategy: target the "Audit" and "QA" keywords. Page title: `Figma Design Audit Plugin & QA Tool - ComponentQA`. Meta description: `Automate Figma QA and Design System Audits. Instantly find detached instances, validate token usage, and fix design drift before developer handoff.`
- BiblioRename SEO strategy: be specific about components/variants so people know it is not for layers. Page title: `Batch Rename Figma Components & Variants | BiblioRename`. Meta description: `The bulk renamer for Figma Component Sets & Variants. Standardize properties, fix taxonomy errors, and clean up component logic without breaking instances.`
- BiblioClean SEO strategy: target the prototype links pain point. Page title: `Remove Figma Prototype Links & Clean Files | BiblioClean`. Meta description: `Instantly remove 100s of broken prototype links in one click. Clean up your Figma file layers to reduce lag and ensure a smooth developer handoff.`
- BiblioStart SEO strategy: target file organization. Page title: `Figma File Organizer & Project Scaffolding Tool | BiblioStart`. Meta description: `Stop setting up Figma files manually. Generate standardized project scaffolding, cover pages, and section templates instantly with BiblioStart.`
- Resources/Guides SEO strategy: target playbooks. Page title: `Design System Guides, Playbooks & Checklists | BiblioKit`. Meta description: `Free Figma playbooks and Design System guides. Master file organization, automated auditing, and design handoff with our implementation checklists.`
- Title rule: lead with the search keyword and put the brand name last.
- Title rule: separate keyword and brand with a pipe (`|`) or dash (`-`).
- Title rule: keep titles under 60 characters when possible.
- When trimming meta descriptions, keep the action/benefit-driven tone and include designers, developers, and marketers when feasible.
- Typography tracking rules: text under 40px keeps tracking at 0; text 40–70px uses -1% tracking; text over 70px uses -2% to -4% tracking (tighter spacing for larger display type).
- Product pages must follow the ComponentQAPage format: Hero, Problem Agitation, Quick Proof, How It Works (3 steps), Features (alternating layout), Use Cases, CTA, FAQ, Final CTA. Use dedicated page components (e.g., BiblioCleanPage.tsx) instead of DynamicProductPage for this structure.
- Product page Final CTA sections must include: (1) a bold title, (2) a description paragraph explaining the product benefit, (3) the primary CTA button, and (4) a cross-reference text link to a complementary product (e.g., "Want to audit your file for errors? Check out ComponentQA"). Use the product's accent color for the cross-reference link (e.g., `text-cyan-400` for ComponentQA, `text-blue-400` for BiblioClean, `text-violet-400` for OrganizeFile, `text-purple-400` for BiblioRename, `text-emerald-400` for StateBuilder).

## Business Information
- Business Description — BiblioKit provides a suite of Figma plugins designed to accelerate the design process and improve product development workflows. The company focuses on enhancing speed, structure, and creativity for designers working within the Figma environment. BiblioKit offers tools that automate repetitive tasks, standardize design elements, and streamline project setup. These plugins address common pain points in design workflows, such as manual renaming, design system auditing, prototype link management, and table normalization. By automating these processes, BiblioKit enables designers to focus on higher-level creative and strategic tasks. The company operates as a digital service provider, offering its plugins directly to Figma users. BiblioKit targets design teams and individual designers seeking to optimize their Figma workflows and improve overall design efficiency. The company's plugins are actively used by designers shipping real products, indicating a focus on practical, production-ready solutions.
- Central Entity — Figma Design Plugins.
- Source Context — Offering a suite of Figma plugins designed to enhance design workflows and improve efficiency for UX/UI designers and product teams.
- Target Audience — BiblioKit targets designers and design teams who use Figma for product design and development. The primary customer segments include UX/UI designers, product designers, and design system managers. These individuals and teams are focused on improving their design workflows, increasing efficiency, and maintaining design consistency. The target audience is likely tech-savvy and comfortable using design tools and plugins. BiblioKit caters to both individual designers and larger design teams within organizations of various sizes. The company's plugins are designed to address the pain points of designers working on complex projects and design systems.
- Monetization — BiblioKit generates revenue through direct sales of its Figma plugins. The company likely employs a freemium or tiered pricing model, offering basic functionality for free and charging for advanced features or usage. Given the focus on design teams, BiblioKit likely offers subscription plans tailored to different team sizes and usage needs. The business model is B2B, targeting designers and design teams within organizations. The company also generates revenue through UXBiblio, which likely operates on a subscription basis, providing access to a curated library of UX patterns and resources.
- Central Search Intent — Optimize Figma Workflows.

## Product Roster
- ComponentQA — Figma plugin that automates component consistency checks, token validation, and remediation reports; severity scoring; deep-selection scanning for rapid fixes.
- BiblioClean — Safely strips prototype links with dry-run preview; selective rules (nav/external links, variants, keep-cover); component/library warnings; per-batch undo and audit export.
- BiblioRename — AI-assisted variant/property renamer; enforces taxonomy conventions; batch rename with override safety; prompt-tuned for design systems.
- UXBiblio Chrome Extension — Manifest V3 extension to capture UI flows, run instant AI audits, tag friction with citations, and sync structured evidence to BiblioUX boards.
- StateBuilder — Auto-generates interaction states (hover/focus/error) and developer doc cards to keep specs consistent without manual redlines.
- BiblioScale — Adaptive campaign generator that turns a master frame into channel-ready outputs (TikTok/Story/Feed) with quality guardrails.
- BiblioUX (Figma Plugin) — In-canvas heuristic/accessibility/psych feedback on selected frames with citation-backed action steps.
- BiblioMotion — WebGL shaders/animated backgrounds that render live in Figma to add motion to static prototypes.
- BiblioTable — Control surface for Figma auto layout; restores predictable collapse/hover behavior; improves structural hygiene for tables.
- BiblioStart — Generates standardized file scaffolding (Cover, Handoff, Sandbox) for consistent project setup.
- BiblioAttach — Rebuilds “dumb groups” into healthy components; swaps detached structures for reusable instances.
- Biblio Automate — Record/replay Figma cleanup/ops routines as reusable templates (backlog).
- BiblioBlocks — Component usage analytics across libraries/code to show adoption/duplication/ROI (backlog).
- BiblioConvert — Streaming XD→Figma migrations with progress visibility and reconciliation safety (backlog).
- BiblioGrid — 8pt grid widget (GridMaster) PRD; details TBD (backlog).

## Long-Term Viability Check
- Highlight proposals that trade sustainable architecture, maintainability, or strategic fit for short-term gains. Document the risk and propose a durable alternative before implementation.

## Reference Links
- AI Rename Variants plugin Figma store listing: https://www.figma.com/community/plugin/1523817290746945616/batch-rename-variants-properties-ai-assisted

## Updates
- 2026-01-06 EST: Added infrastructure edge-case rule after DNS changes broke email (missing MX records).
- 2026-01-06 00:26 EST: Replaced the BiblioAudit problem-section screenshot with the structural health dashboard image.
- 2026-01-05 19:11 EST: Removed cross-product CTA helper copy on product pages and logged the debug entry.
- 2025-12-28 02:17 EST: Fixed 410 redirect rules to include a destination path.
- 2025-12-28 02:15 EST: Restored UXBiblio top-nav link as an external URL.
- 2025-12-27 23:58 EST: Logged header dropdown and Learn/Design Ops layout updates before committing.
- 2025-12-27 09:46 EST: Pointed product callout links to the official Figma Community listings.
- 2025-12-27 03:36 EST: Updated landing hero description width, header dropdown labels, and plugin icon mapping.
