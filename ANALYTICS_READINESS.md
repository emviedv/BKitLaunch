### BiblioKit Analytics Readiness and Plan

This document captures the current state of network/CORS permissions, existing serverless endpoints that could support analytics, any present telemetry hooks, and a proposed path to add privacy-safe, server-side product analytics visible in the admin.

---

## Current Telemetry/Tracking

- Hotjar (consent-gated, public pages only)
  - Client loader in `src/entry-client.tsx` and Edge SSR injection in `netlify/edge-functions/ssr.ts` behind consent and non-admin paths.
  - CSP is sent as Report-Only (Edge) and allows Hotjar domains; can be enforced later.
- Debug logging utility
  - `src/lib/debugService.ts` provides structured console logging for development; no network transmission or persistence.
- No GA/Plausible/PostHog/Mixpanel/etc. present.

Implication: There is no first-party analytics storage or aggregation yet. All current tracking is either dev-console only or optional Hotjar behavior recordings.

---

## Network Permissions and Security Posture

- CORS wrapper for all Netlify functions
  - Implemented in `netlify/functions/utils.ts` via `withCors(handler)`.
  - Allowed origins come from `ALLOWED_ORIGINS` env var (comma-separated) plus localhost dev origins.
  - Handles OPTIONS preflight automatically; responses include
    - `Access-Control-Allow-Origin` (when origin is allowlisted)
    - `Access-Control-Allow-Credentials: true`
    - `Vary: Origin`
    - JSON APIs default to `Cache-Control: no-cache, no-store, must-revalidate`.
- Security headers (static) in `netlify.toml`
  - HSTS, frame/sniffing protections, Referrer-Policy, Permissions-Policy, COOP/CORP.
  - CSP is delegated to Edge SSR as Report-Only with a per-request nonce.
- Edge SSR CSP (Report-Only)
  - In `netlify/edge-functions/ssr.ts`, sets `Content-Security-Policy-Report-Only` allowing `'self'` plus Hotjar sources; includes `connect-src 'self' https:` which covers Netlify Functions calls.

Notes
- `netlify/functions/db-tables.ts` includes a legacy `'*'` CORS header internally, but the `withCors` wrapper will still attach the dynamic origin header. Prefer using only the shared wrapper going forward.

---

## Existing Serverless Endpoints (inventory)

Base path: `/.netlify/functions/{name}`

- admin-auth (POST)
  - Cookie-based JWT login using `ADMIN_EMAIL/ADMIN_PASSWORD`; sets `HttpOnly` cookie.
- me (GET)
  - Returns `{ authenticated, user }` based on cookie JWT.
- logout (POST)
  - Clears auth cookie.
- content-management (GET/POST/PUT/DELETE)
  - GET `?action=current` is public (published content only). Other methods use a legacy Bearer token check (`verifyToken`).
- content-sections (GET public; POST/PUT/DELETE auth required)
  - Manages section content plus nested sub-resources: `navigation-items`, `footer-link-groups`, `footer-links`.
- features (GET public; POST/PUT/DELETE auth required)
- pricing-plans (GET public; POST/PUT/DELETE auth required)
- pages (GET public; POST/PUT/DELETE auth required)
- contact-info (GET public; POST/PUT/DELETE auth required)
- waitlist (POST public; GET auth required)
  - Persists `waitlist_signups` (email, optional name/source). Rate-limited by IP hash using `IP_HASH_SECRET`.
- users (GET public; POST auth required)
  - Returns all rows on GET; review before production if privacy-sensitive.
- llm-content (GET public; POST/PUT auth required)
- db-test (GET public)
- db-tables (GET public)
- indexnow (POST)

Observations relevant to analytics
- Database access is standardized via `createDbClient()`; Postgres is ready for additional tables.
- Several GET endpoints are public and could expose aggregate analytics safely (counts, trends) if we add such endpoints.
- No event-level analytics storage exists yet.

---

## What We Can Reuse Today

- Waitlist data can provide basic metrics (total signups, signups per day). Exposed via `waitlist` GET (auth required) and already used in Admin.
- Content versions/tables are not analytics but indicate publishing activity timestamps.

---

## Proposed Server-side Analytics (future-ready)

Goal: Add privacy-safe, first-party analytics for product pages and CTAs, viewable in the Admin’s Analytics tab, without third-party trackers.

Data model (PostgreSQL)
- `analytics_events` table (minimal PII):
  - `id SERIAL PRIMARY KEY`
  - `event_type VARCHAR(64) NOT NULL` (e.g., `product_view`, `cta_click`, `waitlist_submitted`)
  - `product_slug VARCHAR(150)` (optional)
  - `page VARCHAR(255)` (optional)
  - `source VARCHAR(100)` (optional campaign/source tag)
  - `meta JSONB` (arbitrary details, e.g., variant, device)
  - `user_id VARCHAR(128)` (optional, if you ever pass it; avoid PII by default)
  - `ip_hash VARCHAR(128)` (optional, for rate limiting only; derive using `IP_HASH_SECRET`)
  - `user_agent TEXT` (optional)
  - `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

Endpoints (Netlify Function `analytics`)
- `POST /.netlify/functions/analytics/track`
  - Body: `{ event_type, product_slug?, page?, source?, meta? }`
  - CORS: allow only `ALLOWED_ORIGINS` + localhost dev; use `withCors`.
  - Anti-abuse: soft rate limit by `ip_hash` like `waitlist`.
  - No cookies or PII required; send only if user provided consent.
- `GET /.netlify/functions/analytics/summary?product={slug}&days=30`
  - Returns total events by type and simple ratios for the interval (public, aggregated only).
- `GET /.netlify/functions/analytics/daily?product={slug}&days=30`
  - Returns daily buckets by `event_type` for charts (public, aggregated only).

Admin integration (future)
- Extend the existing Admin “Analytics” tab to call the summary/daily endpoints and render cards/charts.
- Add small helpers in `src/lib/contentApi.ts` to fetch these endpoints.

Client instrumentation (future, consent-aware)
- On product pages, send `product_view` once per load (debounced) when consent is granted.
- On CTA clicks (e.g., “Join Waitlist”), send `cta_click` before navigation. `waitlist_submitted` can be inferred server-side from the `waitlist` endpoint.
- Do not track on `/admin` routes.

Privacy & security
- No PII; only optional `user_id` if explicitly provided, or keep null.
- Use `IP_HASH_SECRET` for any IP-derived rate limiting; store only the hash.
- Keep endpoints aggregated for reads; only POST writes raw events.
- Honor consent before sending client events; keep Hotjar gating as-is.

Environment variables
- `ALLOWED_ORIGINS`: `https://bibliokit.com,https://app.bibliokit.com` (example)
- `IP_HASH_SECRET`: random 32+ byte secret for hashing IPs
- `JWT_SECRET`: already required for admin

Example payloads
```json
// POST /.netlify/functions/analytics/track
{
  "event_type": "product_view",
  "product_slug": "blocks",
  "page": "/product/blocks",
  "source": "organic",
  "meta": { "variant": "A" }
}
```

---

## Next Steps Checklist

- Create `netlify/functions/analytics.ts` implementing the endpoints above using the shared utilities (`withCors`, `createDbClient`, `sendJSON`).
- Add table creation/migration for `analytics_events` similar to how other functions initialize tables.
- Update `AdminDashboard` “Analytics” tab to fetch and visualize data.
- Add `ALLOWED_ORIGINS` and `IP_HASH_SECRET` in the environment.
- Optionally enforce CSP instead of Report-Only once verified.

---

## Appendix: Key References in Code

- CORS and auth utilities: `netlify/functions/utils.ts`
- Edge SSR & CSP (Report-Only): `netlify/edge-functions/ssr.ts`
- Consent-gated Hotjar loader: `src/entry-client.tsx`
- Admin Analytics tab placeholder: `src/components/AdminDashboard.tsx`
- DB usage patterns and table initialization examples:
  - `netlify/functions/waitlist.ts`
  - `netlify/functions/content-sections.ts`
  - `netlify/functions/pages.ts`


