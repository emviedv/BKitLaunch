# Programmatic SEO Plan for BiblioKit

## Problem Statement

BiblioKit only ranks for 2 keywords despite having 6 Figma plugins and 18 blog posts. This is because all content is hand-crafted—there are no programmatic pages targeting search patterns at scale.

**Current indexed pages: ~40**
**Target after implementation: 200+**

---

## Diagnosis: Why Only 2 Keywords?

1. **No keyword pattern pages** - Missing programmatic content for repeating search patterns
2. **Single-intent pages** - Each plugin page only targets 1-2 keywords
3. **No comparison content** - Users searching "[tool] vs [alternative]" don't find you
4. **No use-case pages** - Users searching "how to [task] in Figma" don't find you
5. **No persona targeting** - Users searching "Figma plugin for [role]" don't find you

---

## Programmatic SEO Strategy

### Phase 1: Use Case Pages (50+ pages)
**Search pattern:** "how to [action] in Figma"

| Plugin | Use Case Pages to Create |
|--------|-------------------------|
| RenameVariantsAI | `batch-rename-figma-layers`, `standardize-variant-names`, `fix-component-naming`, `rename-layers-before-handoff`, `enforce-naming-conventions` |
| ComponentQA | `find-detached-instances`, `audit-design-system`, `validate-design-tokens`, `check-component-health`, `qa-before-handoff` |
| BiblioClean | `remove-prototype-links`, `clean-figma-file`, `clear-blue-lines`, `prepare-file-for-handoff` |
| StateBuilder | `generate-component-states`, `create-hover-states`, `document-component-specs`, `build-state-matrix` |
| FixTable | `fix-figma-tables`, `normalize-column-widths`, `add-zebra-striping`, `align-table-cells` |
| OrganizeFile | `organize-figma-file`, `create-file-structure`, `add-cover-page`, `scaffold-project` |

**URL structure:** `/use-cases/[use-case-slug]`

**Template structure:**
```
Hero: Problem statement + CTA
Step-by-step: How the plugin solves it
Before/After: Visual comparison
Related use cases: Internal links
FAQ: 3-5 questions
CTA: Install plugin
```

### Phase 2: Comparison Pages (20+ pages)
**Search pattern:** "[product] vs [alternative]"

| Comparison Type | Pages |
|-----------------|-------|
| Manual vs Automated | `rename-variants-vs-manual-renaming`, `componentqa-vs-manual-audit` |
| BiblioKit vs Competitors | `componentqa-vs-design-lint`, `biblioclean-vs-figma-native` |
| Feature comparisons | `ai-rename-vs-find-replace`, `bulk-rename-vs-single-rename` |

**URL structure:** `/compare/[comparison-slug]`

**Template structure:**
```
Hero: Quick verdict + winner
Feature comparison table
Detailed breakdown
Pricing comparison (if applicable)
Verdict: When to use each
FAQ
```

### Phase 3: Persona Pages (10+ pages)
**Search pattern:** "Figma plugin for [role/team]"

| Persona | Page Slug |
|---------|-----------|
| Design System Managers | `for-design-system-managers` |
| DesignOps Teams | `for-designops-teams` |
| Solo Designers | `for-solo-designers` |
| Enterprise Teams | `for-enterprise-design-teams` |
| Agencies | `for-design-agencies` |
| Developers | `for-developers` |
| Product Managers | `for-product-managers` |

**URL structure:** `/for/[persona-slug]`

**Template structure:**
```
Hero: Pain points for this persona
Recommended plugins: Curated stack
Workflow example: Day-in-the-life
Testimonial (if available)
Getting started guide
```

### Phase 4: Glossary/Definition Pages (30+ pages)
**Search pattern:** "what is [term]"

| Term Category | Example Pages |
|---------------|---------------|
| Figma concepts | `what-is-detached-instance`, `what-is-variant-property`, `what-is-auto-layout` |
| Design ops | `what-is-design-system-audit`, `what-is-design-handoff`, `what-is-design-ops` |
| BiblioKit terms | `what-is-biblioclean`, `what-is-componentqa` |

**URL structure:** `/glossary/[term-slug]`

**Template structure:**
```
Definition: Clear, concise answer
Context: When/why it matters
Example: Visual demonstration
Related terms: Internal links
How BiblioKit helps: Soft CTA
```

---

## Implementation Plan

### Data Structure

Create `/src/data/programmaticContent.ts`:

```typescript
export type UseCasePage = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  plugin: 'rename-variants' | 'componentqa' | 'biblioclean' | 'statebuilder' | 'fixtable' | 'organizefile';
  problem: string;
  solution: string;
  steps: { title: string; description: string }[];
  beforeAfter?: { before: string; after: string };
  faqs: { question: string; answer: string }[];
  relatedUseCases: string[];
};

export type ComparisonPage = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  optionA: { name: string; pros: string[]; cons: string[] };
  optionB: { name: string; pros: string[]; cons: string[] };
  featureTable: { feature: string; optionA: string; optionB: string }[];
  verdict: string;
  faqs: { question: string; answer: string }[];
};

export type PersonaPage = {
  slug: string;
  persona: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  painPoints: string[];
  recommendedPlugins: string[];
  workflow: { step: number; action: string; plugin?: string }[];
  faqs: { question: string; answer: string }[];
};

export type GlossaryPage = {
  slug: string;
  term: string;
  definition: string;
  metaTitle: string;
  metaDescription: string;
  context: string;
  relatedTerms: string[];
  pluginCta?: { plugin: string; text: string };
};
```

### Routing Updates

Add to `src/App.tsx`:
```typescript
// Programmatic SEO routes
<Route path="/use-cases/:slug" component={UseCasePage} />
<Route path="/compare/:slug" component={ComparisonPage} />
<Route path="/for/:slug" component={PersonaPage} />
<Route path="/glossary/:slug" component={GlossaryPage} />
```

### SEO Updates

Add to `src/lib/seo.ts`:
- Dynamic metadata generation for each programmatic page type
- Structured data (FAQPage, HowTo, Comparison schema)

### Sitemap Updates

Add to `netlify/functions/sitemap.ts`:
- Loop through all programmatic content arrays
- Generate entries for each page type

---

## Content Priority Matrix

| Page Type | Volume | Effort | SEO Value | Priority |
|-----------|--------|--------|-----------|----------|
| Use Cases | 50+ | Medium | High | 1 (Start here) |
| Comparisons | 20+ | Medium | Very High | 2 |
| Glossary | 30+ | Low | Medium | 3 |
| Personas | 10 | Low | High | 4 |

---

## Internal Linking Architecture

```
Homepage
├── /products (hub)
│   └── /figma-component-variant-renamer
│       ├── /use-cases/batch-rename-figma-layers (spoke)
│       ├── /use-cases/standardize-variant-names (spoke)
│       └── /compare/rename-variants-vs-manual (spoke)
│
├── /for (hub)
│   ├── /for/design-system-managers
│   └── /for/designops-teams
│
├── /glossary (hub)
│   ├── /glossary/what-is-detached-instance
│   └── /glossary/what-is-design-system-audit
│
└── /blog (existing)
    └── Internal links to use cases & glossary
```

**Cross-linking rules:**
1. Every use-case page links to 3 related use cases
2. Every plugin page links to its top 3 use cases
3. Blog posts link to relevant glossary terms
4. Glossary pages link to related plugins
5. Persona pages link to all relevant use cases

---

## Quick Wins (This Week)

### 1. Create 5 High-Intent Use Case Pages

| Slug | Target Keyword | Est. Monthly Searches |
|------|----------------|----------------------|
| `batch-rename-figma-layers` | "batch rename figma layers" | 200-500 |
| `find-detached-instances-figma` | "find detached instances figma" | 100-300 |
| `remove-prototype-links-figma` | "remove prototype links figma" | 100-200 |
| `figma-design-system-audit` | "figma design system audit" | 200-400 |
| `fix-figma-table-alignment` | "fix figma table" | 50-150 |

### 2. Create 3 Comparison Pages

| Slug | Target Keyword |
|------|----------------|
| `componentqa-vs-manual-audit` | "figma design audit tool" |
| `ai-rename-vs-find-replace` | "figma batch rename" |
| `biblioclean-vs-manual-cleanup` | "clean figma file" |

### 3. Add Internal Links to Existing Pages

- Update all 6 plugin pages with "Use Cases" section
- Add glossary term links to blog posts
- Create hub pages for `/use-cases` and `/glossary`

---

## Success Metrics

| Metric | Current | 3 Month Target | 6 Month Target |
|--------|---------|----------------|----------------|
| Indexed Pages | ~40 | 100+ | 200+ |
| Ranking Keywords | 2 | 50+ | 150+ |
| Organic Traffic | ? | +200% | +500% |
| Top 10 Rankings | 0-2 | 10+ | 30+ |

---

## Technical Checklist

- [ ] Create `programmaticContent.ts` data file
- [ ] Build reusable page templates (UseCasePage, ComparisonPage, etc.)
- [ ] Add routes to App.tsx
- [ ] Update SEO metadata generation
- [ ] Update sitemap function
- [ ] Add structured data (FAQPage, HowTo schemas)
- [ ] Implement internal linking components
- [ ] Create hub pages (/use-cases, /glossary, /for)
- [ ] Add breadcrumbs to programmatic pages

---

## Next Steps

1. **Approve this plan** - Review and adjust priorities
2. **Start with 5 use case pages** - Highest ROI, medium effort
3. **Build reusable templates** - One-time investment, scales infinitely
4. **Monitor GSC** - Track indexation and rankings weekly
