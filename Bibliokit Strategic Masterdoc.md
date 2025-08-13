# Bibliokit Strategic Masterdoc

This document captures near-term pricing and packaging experiments for Bibliokit plugins (e.g., Rename Variants, SEO Pack, FAQ/Schema, Bulk Rewrite), plus the free trial, credit model for heavy sessions, and a Designer Team bundle. All figures are explicit to enable clean measurement and iteration.

## Pricing Experiments

### Experiment 1: Bundle "AI Plugin Suite" + hard-gate bulk actions
- Hypothesis: Bundling all plugins and gating bulk/automation to the suite increases free->paid conversion and ARPU.
- Plan names + value fences (Test)
  - Free: 150 credits/mo; 2 projects; single-run actions only; 5 exports/day; no bulk; no API; watermark on exports.
  - Creator ($19/mo): 600 credits/mo; 5 projects; choose any 1 plugin; single-run + small batch (up to 50 items/session); 15 exports/day; no API.
  - Pro Suite ($39/mo): 3,000 credits/mo; all plugins; bulk up to 2,000 items/session; 40 exports/day; API dev key; 2 seats.
  - Team ($99/mo): 10,000 credits/mo; all plugins; bulk up to 10,000 items/session; 100 exports/day; API; 5 seats; priority support.
- Primary success metrics: +20% lift in free->paid conversion vs control; +12% ARPU; Suite attach rate >= 35% of new paid.
- Guardrails: Monthly churn <= baseline +2pp; gross margin >= 75%; support tickets <= 8/100 paying users/mo; refund rate <= 3%.
- Rollout & length: 50/50 A/B vs current pricing for 21 days; >=400 new signups/arm; ramp 10%->50%->100% exposure; variant logs on paywall and gating screens.

### Experiment 2: Per-plugin micro-subscription vs Suite anchor
- Hypothesis: Low-friction $6-$9 per-plugin unlock grows revenue from low-intent users without cannibalizing Suite.
- Arms
  - A (Micro + Suite): Per-plugin $9/mo each (unlimited single/batch up to 200 items/session for that plugin); Pro Suite $29/mo (all plugins, bulk up to 2,000 items); Team $99/mo.
  - B (Suite-only anchor): No micro; Pro Suite $39/mo; Team $99/mo.
- Value fences
  - Micro: 1 plugin only; 400 credits/mo; no API; 1 seat; small batch cap (200 items/session); 15 exports/day.
  - Suite: all plugins; higher credits and bulk; API; multi-seat.
- Primary success metrics: Total paid conversion +15% (A vs B); net revenue/visitor +10%.
- Cannibalization rule: Suite take-rate in A not < B by >20% relative.
- Guardrails: LTV/CAC >= 3; average COGS/user within +/-10% of baseline; NPS not down >3 points.
- Rollout & length: 28-day test; 40/40/20 split (A/B/control) if traffic allows; paywall layout emphasizes Suite savings in A.

### Experiment 3: "Plugin Pass" credits-only plan alongside tiers
- Hypothesis: A contract-free, credits-only "Plugin Pass" captures high-variance/heavy sessions without increasing churn.
- Plans (Test)
  - Plugin Pass (credits-only): $10/1,000 credits; $45/5,000; $160/20,000; rollover 60 days; no seats; all plugins; bulk allowed but credit-priced; no API.
  - Tiers unchanged (use Experiment 1 or current as baseline).
- Value fences
  - Credit burn map: AI Rewrite (single) 2 credits; SEO Pack (Title/Meta/FAQ/Schema) 10 credits; Bulk Rename 100 items = 25 credits; Heavy compute minute = 5 credits; Export = 1 credit.
  - Hard cap alerting + soft auto top-up toggle ($10 increments).
- Primary success metrics: Incremental revenue/user +8%; paid conversion from heavy sessions +20% relative; heavy-session refunds <= 2%.
- Guardrails: Margin >= 75%; top 5% users' monthly spend <= $300 unless explicit opt-in; support tickets <= 6/100 paid.
- Rollout & length: 3-week holdout; 50% see Plugin Pass at paywall and when hitting "bulk" friction points; price sensitivity mini-test ($10 vs $12 anchor).

## One-click Free Trial (no card)
- Limits
  - Duration: 7 days.
  - Credits: 200 base (+50 on email verification).
  - Projects: 2; Seats: 1; Exports: 10/day; No API; watermark on exports; single-run + small batch (<=50 items/session).
  - Rate limits: 15 requests/min; 200/day.
- Flow: "Continue with Google/GitHub/Apple" -> instant workspace -> guided bulk demo using trial credits.
- Success metrics: Trial->paid >= 12%; time-to-value <= 3 minutes; <= $0.06 COGS per trialist.
- Guardrails: Abuse detection; geo/risk throttling; auto-suspension at 250 credits; clear upgrade CTAs and spend transparency.

## Credit-based Model for Heavy Sessions
- Pricing: $10/1,000 credits; $45/5,000; $160/20,000; enterprise prepaid >=100k credits with 15-25% discount.
- Burn rules
  - Single actions: 2-10 credits each (per plugin as above).
  - Bulk: 25 credits per 100 items processed.
  - Heavy compute: 5 credits/min for streaming/long-running jobs.
  - Export: 1 credit per export.
- Controls: Session cap 30 minutes or 150 credits (whichever first) with "resume (cost estimate)" prompt; per-workspace default monthly spend cap $100; email/SaaS alerts at 50/80/100%.
- UX: Always show estimated credits before run; post-action receipt; auto top-up toggle; granular logs by project and user.
- When to show: On hitting bulk gates; during long LLM sessions; when monthly tier credits are exhausted mid-cycle.

## "Designer Team" Bundle
- Who it's for: Design/brand teams and small agencies shipping multiple product pages weekly.
- Price: $199/mo (annual: $159/mo) includes 5 seats, 30,000 credits; extra seat $25/mo; +20k credits add-on $150.
- What's included
  - All plugins + bulk up to 25,000 items/session; API; SSO (Google/Okta); role permissions; shared brand library (voice, tone, glossary); version history; approvals; Slack notifications; priority chat support (4-hour SLA); white-label exports; 10 projects; 10 brand profiles.
- Messaging
  - "Ship on-brand pages in hours, not days."
  - "One suite for naming, copy, SEO, and schema—built for teams."
  - "Bulk-safe, audit-ready, and brand-consistent out of the box."
- Launch: Landing hero vs "Pro Suite" with value table; ROI calculator (hours saved/week); case study; "Start 7-day one-click trial" CTA prefilled with a sample project.

## Rollout Sequencing Suggestion
- Week 1-3: Run Experiment 1 + Free Trial.
- Week 4-7: Introduce Plugin Pass (Experiment 3) where bulk/long sessions trigger.
- Week 8: Launch Designer Team bundle; then run Experiment 2 to optimize micro vs suite mix.

---
Notes
- "Plugins" refer to AI content tools like Rename Variants, SEO Pack, FAQ/Schema, Bulk Rewrite, etc. Adjust fences/credits if plugin definitions change.
- All experiments require attribution tagging on paywall, trial, and gating screens; log exposure, clicks, checkout intent, purchase, refunds, and support contacts by variant.
