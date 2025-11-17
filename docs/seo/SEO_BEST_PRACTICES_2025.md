# BiblioKit SEO Playbook 2025

## Why this matters
- Search and GenAI surfaces now blend together, so structured data, crawl directives, and experience signals must stay aligned.
- 2025 ranking systems emphasise first-hand authority (E-E-A-T) and fast, trustworthy answers for SGE snapshots.

## 2025 Pillars we support
- Structured data graph across Organization, WebSite, WebApplication, Product, CollectionPage, BreadcrumbList, and ImageObject nodes with consistent `@id` references.
- Unified crawler directives: `robots`, `googlebot`, and `bingbot` all permit indexing with enhanced preview allowances.
- Canonical and OG/Twitter cards align so shared links and zero-click responses stay on-brand.
- AI-first sitemap (`public/llms.txt`) and IndexNow endpoint advertise fresh content to LLMs and search crawlers.

## Implementation notes (Oct 2025)
- `src/lib/seo.ts` centralises metadata, merges dynamic page content, and emits a single JSON-LD graph server-side and client-side.
- Playwright smoke test protects critical tags (`robots`, `googlebot`, `bingbot`, OG alt text, JSON-LD graph).
- Static `index.html` mirrors SSR defaults so crawlers without JS still receive the full metadata envelope.
- `public/llms.txt` highlights canonical URLs and the schema stack that AI crawlers can expect.

## Maintenance checklist
- When adding a route, extend `routeMetadata` and ensure `structuredData` entries include stable `@id` values.
- For new product content, surface pricing/testimonial facts in the content API so the Product schema can expand without hard-coding.
- Run `npm run test:e2e` after SEO-affecting changes to validate metadata and structured data retention.
- Periodically validate pages with Google Rich Results Test and Bing URL Inspection to confirm schema stays compliant.

## Long-term viability watch
- Avoid duplicating schema fragments in components; always funnel through `generateMetadata` to keep the consolidated graph accurate.
- Guard against stale social handles or pricing values—prefer deriving from content data or ENV-managed values rather than inline literals.
- When adding marketing scripts, check that they respect the analytics consent bootstrap to keep performance and privacy in balance.
