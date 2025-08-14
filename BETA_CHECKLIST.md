# Beta P0 Checklist (Visitors-only)

Status legend: [ ] todo, [x] done, [-] n/a

## 1) SSR content and graceful empty states
- [x] Create shared empty content util `src/lib/defaultContent.ts`
- [x] Use empty content in SSR fallback (`src/entry-server.tsx`)
- [x] Use empty content in client hook (`src/hooks/usePublishedContent.ts`)
- [x] Hide `Hero` when content is empty (`src/components/Hero.tsx`)
- [x] Hide `Features` when no heading/items (`src/components/Features.tsx`)
- [x] Hide `Pricing` when empty; neutral coming-soon copy (`src/components/Pricing.tsx`)

## 2) Forms: waitlist + contact
- [ ] Validate shapes server-side; sanitize inputs
- [ ] Honeypot + basic rate limit
- [ ] Clear success/error feedback and ARIA live regions

## 3) SEO baseline
- [ ] Ensure `useSEO` applies tags on client navigation
- [ ] Validate `sitemap.ts` and `indexnow.ts`
- [ ] Structured data present where applicable

## 4) Analytics and consent (visitors-only)
- [ ] GA4 + Hotjar gated by consent; no admin pages tracking
- [ ] Track page views and form submits only

## 5) Performance and caching
- [ ] DB pooling and prod SSL verified
- [ ] CDN cache strategy and ETags for JSON
- [ ] Lazy-load images; bundle split OK

## 6) Accessibility
- [ ] Focus states, labels, keyboard interactivity
- [ ] Headings order; aria-* on feedback

## 7) Security and privacy
- [ ] Strict CORS in functions
- [ ] Input validation and parameterized SQL
- [ ] No PII in logs; redaction where needed

## 8) Observability
- [ ] Structured logs
- [ ] `health.ts` uptime check + tiny status page


