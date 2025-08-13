## BiblioKit – Strategic Master Doc

Last updated: 2025-08-13

### 1) Site map and information architecture (IA)

- Homepage: `https://bibliokit.com`
  - Purpose: Intro to BiblioKit; broad positioning for SaaS tools and Figma plugins; hero, “Pricing Coming Soon,” email capture, footer positioning.
- Product: `https://bibliokit.com/product`
  - Purpose: Product overview (currently skeletal).
- Plugins: `https://bibliokit.com/plugins`
  - Purpose: Plugins hub (currently skeletal).
- Pricing: `https://bibliokit.com/pricing`
  - Purpose: Pricing info (currently “coming soon”).
- Sign in: `https://bibliokit.com/signin`
  - Purpose: Authentication entry.
- Get started: `https://bibliokit.com/get-started`
  - Purpose: Onboarding/registration entry.
- Admin: `https://bibliokit.com/admin`
  - Purpose: Admin app (gated/auth-only).
- Robots: `https://bibliokit.com/robots.txt`
  - Notes: Disallows `/admin`; references sitemap; major AI crawlers allowed.

Observations
- Top nav shows “Sign In” and “Get Started” linking to `#` (non-functional anchors).
- Homepage includes “Pricing Coming Soon,” email input (currently disabled), footer line: “Professional SaaS software and Figma plugins with secure API management.”
- No visible docs/blog or deep product/plugin subpages yet.

### 2) Messaging teardown

- Headline: “Everything you need to build and scale”
  - Strength: Ambitious, growth-oriented.
  - Gap: Vague—who it’s for and what it does specifically.
- Subhead: “From secure API management to comprehensive support systems, we provide all the tools you need for professional SaaS development.”
  - Strength: Names two pillars: API management, support systems.
  - Gap: No proof, no specifics, and not connected to the Figma plugin story.
- Social proof: None present (missing logos, testimonials, ratings, install counts, case studies).
- Objection handling: Absent (security/compliance, performance, pricing, SLAs, refund/trial, roadmap).
- CTAs: “Sign In”, “Get Started”
  - Gap: No task-led CTAs (e.g., “Get the Figma plugin,” “See a 60‑sec demo,” “View docs”).

What’s missing
- Specific outcomes (time saved, error reduction, consistency improvements).
- Screenshots/GIFs, quick demo, example naming rules.
- Clear plugin value vs competitors; API value vs incumbents.
- Pricing, trials, docs, changelog/roadmap.

### 3) ICPs and value propositions

- Primary ICP: Design systems teams (Lead Designers, Design Ops, Design Engineers)
  - Jobs: Enforce naming conventions, manage variants, organize files at scale, refactor quickly.
  - Pains: Manual renaming, inconsistent naming, drift across files, variant sprawl.
  - Value props:
    - AI-assisted, rule-based batch renaming of layers/variants across pages/files.
    - One-click enforcement of naming conventions; preview + safe apply/undo.
    - Cross-file diffs, rollback, and audit history for design QA.

- Secondary ICP: SaaS founders/engineering teams (PMs, Tech Leads)
  - Jobs: Ship faster with fewer ops, secure APIs, predictable onboarding.
  - Pains: Fragmented tooling, brittle API gateways, unclear pricing, compliance pressure.
  - Value props:
    - Secure, developer-friendly API building blocks (auth, rate limiting, observability).
    - Ready-to-use support workflows and admin scaffolding.
    - Clear path from prototype to production (environments, secrets, deploys).

### 4) Competitor contrast (Figma renaming/organization)

- Rename It — Batch rename layers/frames.
  - Strengths: Mature, fast, familiar syntax.
  - Weaknesses: Primarily pattern-based; limited rule sets/AI.
  - BiblioKit wins with: Rules + AI suggestions, cross-file scope, dry-run diffs.

- Variants Manager — Variant/property renaming and rules.
  - Strengths: Focused on variants; enforces naming.
  - Weaknesses: Narrow scope, less holistic file organization.
  - BiblioKit wins with: Unified layer + variant rules in one pass.

- Similayer — Select similar layers to act on.
  - Strengths: Powerful selection pre-step for batch actions.
  - Weaknesses: Needs a renamer to complete the job.
  - BiblioKit wins with: Combined selection + rename in a single flow.

- Autoname/AI Rename Layers — AI-based naming.
  - Strengths: Fast, content-aware.
  - Weaknesses: Inconsistent outputs without guardrails.
  - BiblioKit wins with: AI plus strict rule guardrails and review diffs.

- Design System Organizer/Component utilities — Library-wide organization.
  - Strengths: Bulk library operations.
  - Weaknesses: Less focus on deep renaming workflows.
  - BiblioKit wins with: One pass to organize + rename + protect references.

Risks
- If BiblioKit is slower than incumbents or lacks syntax/power features for power users.
- If variant features are shallow relative to specialist tools.

### 5) Copy rewrite

Homepage hero (3 options)
- Option A
  - Headline: Rename variants and layers. Enforce consistency. Ship faster.
  - Subhead: AI + rules to tame design sprawl—batch rename layers, enforce variant naming, and keep files clean at scale.
  - CTAs: Get the Figma plugin • See a 60‑sec demo

- Option B
  - Headline: Your design system, consistently named—across every file.
  - Subhead: Define rules once. Preview diffs. Apply safely across pages, files, and libraries.
  - CTAs: Try it free • View naming rule templates

- Option C
  - Headline: Stop manual renaming. Start consistent design.
  - Subhead: Bulk rename layers and variants with AI assist and guardrails that prevent breaking changes.
  - CTAs: Get started • See how it works

Problem/solution
- Problem: Manual renaming kills velocity and consistency. Variant sprawl and ad‑hoc naming make design handoff brittle.
- Solution: BiblioKit applies AI + rule-based renaming across layers and variants. Preview diffs, fix at scale, and lock in your naming standards.

Feature bullets
- Rule-based engine: Create, save, and share naming rules with your team.
- AI suggestions with guardrails: Speed up drafts; you stay in control.
- Cross-file scope: Batch updates across pages and files with safe apply + undo.
- Variant discipline: Enforce property/option names and casing at scale.
- Preview diffs: See changes and conflicts before committing.
- Team-ready: Templates, versioned rules, and audit history.

CTA copy
- Get the plugin • Try it free • See a 60‑sec demo • Browse rule templates

Product page (Figma plugin: “AI Rename Variants & Layers”)
- Outcome-led headline: Enforce naming standards across your design system—without the busywork.
- Benefits
  - Kill manual renaming; apply rules in minutes, not hours.
  - Reduce regressions with preview diffs and safe rollback.
  - Keep teams aligned with shared rule templates.
- Feature list
  - Rule builder with presets (casing, tokens, separators, order).
  - AI-assisted suggestions with review/accept flow.
  - Variant property/option rename with validation.
  - Cross-file and cross-page batch scope.
  - Conflict detection and undo.
  - Export/import rules; team libraries.
- FAQ
  - Does it work on large files? Yes—streamed operations with progress and undo.
  - Can we customize rules? Fully—save presets per project/team.
  - How do AI suggestions work? Propose names; you review and approve.
  - Will it break component instances? References respected; conflicts flagged.
  - Can I revert changes? Yes—single-action undo and history.
- Trust
  - “Teams cut renaming time by 80%+” (fill with logos/case studies when ready).
  - Privacy-first: runs within Figma; no design data retained.
- Pricing CTA
  - Try it free • Pro from $X/editor/month • Team from $Y/mo (volume)

### 6) SEO plan

Target keywords (12)
- figma batch rename
- figma variant renaming
- figma naming conventions
- figma layer organization
- design system naming rules
- figma plugin rename layers
- figma plugin variant manager
- design system governance figma
- enforce design naming
- batch refactor figma
- figma ai rename
- figma design ops tools

Blog ideas (6)
- A practical guide to naming conventions in Figma
- Batch-renaming layers: patterns, pitfalls, and speed tricks
- Variant sprawl: how to prevent it and fix it
- Auditing design systems: a step-by-step renaming playbook
- AI in design ops: when to trust it—and how to guardrail it
- Case study: cutting a day of renaming to 15 minutes

Site FAQs (10)
- What does the plugin rename? Layers, components, variants, and properties with rule control.
- Can I preview changes? Yes—side-by-side diffs with conflicts flagged before apply.
- Does it support multiple files? Yes—select scope across pages/files.
- How are rules shared? Save to team libraries and reuse via templates.
- Is AI required? No—AI is optional; rules work standalone.
- Will renaming break instances? We respect references and warn before risky changes.
- Can I undo? Yes—single-action undo plus history.
- Does it support casing and tokens? Yes—camel, Pascal, kebab, snake, custom tokens/separators.
- Security and privacy? Runs within Figma; no persistent storage of design content.
- Pricing/trial? Free trial available; simple per-editor plans.

### 7) Conversion fixes and A/B ideas

Top 10 changes with expected impact and sample variants
- Replace vague hero with outcome-led copy (Impact: High)
  - A: “Everything you need to build and scale”
  - B: “Rename variants and layers. Enforce consistency. Ship faster.”
- Task-led CTAs by audience (High)
  - A: “Get Started”
  - B: “Get the Figma plugin” • “See a 60‑sec demo”
- Add a 60–90s product demo video above the fold (High)
  - A: Static hero
  - B: Inline demo (rule build → preview → apply)
- Publish “Rules gallery” templates (High)
  - A: None
  - B: Downloadable presets for common components (Buttons, Inputs, Lists)
- Add social proof and metrics (High)
  - A: None
  - B: Logos, quotes, “Saved 6h/week per designer,” ratings
- Ship pricing with clear free trial (High)
  - A: “Pricing coming soon”
  - B: Free, Pro, Team tiers; start free
- Make email capture active with value (Medium)
  - A: Disabled input
  - B: “Get rule templates + early access,” instant download
- Create Plugins hub with deep product pages (Medium)
  - A: Placeholder
  - B: Feature pages with GIFs, FAQs, changelog
- Segment nav: Designers vs Developers (Medium)
  - A: Generic nav
  - B: “For Designers,” “For Teams,” “Docs,” “Pricing,” “Plugins”
- Add “Try on a sample file” sandbox (Medium)
  - A: No try-before-use
  - B: Interactive sample or shared demo file link

— End of document —


