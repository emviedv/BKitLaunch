# Agent Guidelines

## Debug Log Policy
- Every bug discovered and every fix applied must be recorded in a product debug log. Include: date/time, concise summary, root cause, changed files/commits, and verification steps. Prefer `docs/live-debug/LIVE_DEBUG_YYYY-MM.md` (or `docs/debug-log.md` if no monthly log exists).

## Rule Codification & Conversation Clarity
- When Emily notes that something “should have been done” a certain way, capture that guidance here as a concise rule (add a brief example when useful).
- Success feedback surfaces must cap padding at 20px (e.g., waitlist success message stays tight with `p-5`).
- When applying a specific rule from this file, explicitly mention it in the conversation for clarity (e.g., “Applying Debug Log Policy” or “Following Commit Guidelines”).
- Use action/benefit-driven marketing copy (e.g., “Work x10,000 faster.”) whenever writing or updating customer-facing text.
- Keep CTA and product messaging designer/team-first—avoid stakeholder-targeted language. Default to “Join Designers shipping faster with BiblioKit” plus “Set up a shared workspace…10x faster.” when updating shared copy.
- When Emily requests a specific change, do not expand the scope or add extra copy/behavior beyond the exact ask (e.g., no bonus marketing lines unless explicitly requested).
- Always add the images provided in the source Google Doc when publishing any blog post; if assets aren’t available locally, request them instead of skipping media. If Emily explicitly requests replacements (e.g., from Google search), follow her direction for that post while noting the override.
- Landing page product sections get the horizontal feature nav; individual product pages keep their original layout (e.g., enable nav in `BiblioKitLanding`, leave `AIRenameVariantsPage` without it).
- Product pages alternate feature cards so media and copy swap sides down the page (e.g., AI Rename Variants features grid now alternates by default).
- When padding, gaps, or similar layout styling is applied to one product page’s features section, mirror those adjustments across all product pages—but confirm the approach with Emily before rolling it out globally.
- HTML classes and IDs must be specific to the surface they belong to—no generic names like `button` or `section`. Prefer `ai-rename-hero-cta` over `cta` so styles stay scoped and readable.

## Long-Term Viability Check
- Highlight proposals that trade sustainable architecture, maintainability, or strategic fit for short-term gains. Document the risk and propose a durable alternative before implementation.

## Reference Links
- AI Rename Variants plugin Figma store listing: https://www.figma.com/community/plugin/1523817290746945616/batch-rename-variants-properties-ai-assisted
