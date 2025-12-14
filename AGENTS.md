# Agent Guidelines

## Debug Log Policy
- Every bug discovered and every fix applied must be recorded in a product debug log. Include: date/time, concise summary, root cause, changed files/commits, and verification steps. Prefer `docs/live-debug/LIVE_DEBUG_YYYY-MM.md` (or `docs/debug-log.md` if no monthly log exists).

## Rule Codification & Conversation Clarity
- When Emily notes that something “should have been done” a certain way, capture that guidance here as a concise rule (add a brief example when useful).
- Products are built for designers, developers, and marketers—keep language inclusive of all three.
- Success feedback surfaces must cap padding at 20px (e.g., waitlist success message stays tight with `p-5`).
- When applying a specific rule from this file, explicitly mention it in the conversation for clarity (e.g., “Applying Debug Log Policy” or “Following Commit Guidelines”).
- Use action/benefit-driven marketing copy (e.g., “Work x10,000 faster.”) whenever writing or updating customer-facing text.
- Keep CTA and product messaging designer/team-first—avoid stakeholder-targeted language. Default to “Join Designers shipping faster with BiblioKit” plus “Set up a shared workspace…10x faster.” when updating shared copy.
- When Emily requests a specific change, do not expand the scope or add extra copy/behavior beyond the exact ask (e.g., no bonus marketing lines unless explicitly requested).
- When Emily provides blog copy (e.g., Google Doc content), import it verbatim without edits or extra lines; keep the published post text exactly as supplied.
- Default voice: “Relatable Pro” (in-the-trenches expert) tone—high empathy “we” POV, conversational contractions/fragments, visceral language that names the pain, and insider specifics that show lived expertise; skip corporate polish and keep it human.
- Always add the images provided in the source Google Doc when publishing any blog post; if assets aren’t available locally, request them instead of skipping media. If Emily explicitly requests replacements (e.g., from Google search), follow her direction for that post while noting the override.
- Landing page product sections get the horizontal feature nav; individual product pages keep their original layout (e.g., enable nav in `BiblioKitLanding`, leave `AIRenameVariantsPage` without it).
- Product pages alternate feature cards so media and copy swap sides down the page (e.g., AI Rename Variants features grid now alternates by default).
- When padding, gaps, or similar layout styling is applied to one product page’s features section, mirror those adjustments across all product pages—but confirm the approach with Emily before rolling it out globally.
- HTML classes and IDs must be specific to the surface they belong to—no generic names like `button` or `section`. Prefer `ai-rename-hero-cta` over `cta` so styles stay scoped and readable.
- Bridge is an internal tool; avoid referencing it in customer-facing copy unless explicitly approved.
- Operational reminder: periodically pull waitlist signups locally with `npm run email:waitlist` (uses `DATABASE_URL` or .env/.env.local) to review beta interest.
- Apply current SEO best practices (keep guidance refreshed for 2025): meaningful alt text on all images, clean descriptive URLs/slugs, accurate meta titles/descriptions, structured headings, and up-to-date sitemap/robots handling where relevant.

## Product Roster
- BiblioAudit — Figma plugin that automates component consistency checks, token validation, and remediation reports; severity scoring; deep-selection scanning for rapid fixes.
- BiblioClean — Safely strips prototype links with dry-run preview; selective rules (nav/external links, variants, keep-cover); component/library warnings; per-batch undo and audit export.
- BiblioRename — AI-assisted variant/property renamer; enforces taxonomy conventions; batch rename with override safety; prompt-tuned for design systems.
- UXBiblio Chrome Extension — Manifest V3 extension to capture UI flows, run instant AI audits, tag friction with citations, and sync structured evidence to BiblioUX boards.
- BiblioStates — Auto-generates interaction states (hover/focus/error) and developer doc cards to keep specs consistent without manual redlines.
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
