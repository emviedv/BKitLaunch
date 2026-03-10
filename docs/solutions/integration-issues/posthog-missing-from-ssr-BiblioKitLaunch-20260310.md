---
module: BiblioKit Launch
date: 2026-03-10
problem_type: integration_issue
component: frontend_stimulus
symptoms:
  - "PostHog token not found — analytics not loading in production"
  - "PostHog init script only present in index.html SPA fallback, missing from SSR HTML template"
root_cause: config_error
resolution_type: code_fix
severity: high
tags: [posthog, ssr, analytics, edge-functions, netlify, csp]
---

# Troubleshooting: PostHog Analytics Not Loading in Production (SSR)

## Problem
PostHog product analytics token `phc_xR0jG1Uj4v7DMFULTIhDe6sr8cQTwBVOfPi88b4gbWM` was not being found in production. The PostHog init snippet existed only in `index.html` (the SPA fallback), but the SSR edge function builds its own HTML document from scratch and never serves `index.html` to real visitors.

## Environment
- Module: BiblioKit Launch (marketing site)
- Stack: React 18 + Vite + Netlify Edge Functions (SSR)
- Affected Component: `netlify/edge-functions/ssr.ts` (SSR HTML template)
- Date: 2026-03-10

## Symptoms
- PostHog dashboard showing zero or near-zero events from production visitors
- PostHog token reported as "not being found"
- `index.html` contained PostHog init script at line 281, but SSR-rendered pages never serve this file
- Hotjar and Apollo.io analytics WERE loading (they had been added to the SSR template)

## What Didn't Work

**Direct solution:** The problem was identified on first investigation by tracing where the PostHog script was injected (`index.html` only) vs. where the SSR template was built (`ssr.ts` lines 488-522).

## Solution

Added PostHog init snippet to the SSR edge function HTML template, following the same pattern already used by Hotjar and Apollo.io.

**Code changes:**

```typescript
// Before (broken): PostHog only in index.html — never served via SSR
// ssr.ts had hotjarTag and apolloTag but NO posthogTag

// After (fixed): Added posthogTag in ssr.ts after apolloTag definition
const posthogTag = isProdHost && !isAdminPath
  ? `<script nonce="${nonce}">(function(){
  var s=function(fn){if('requestIdleCallback' in window){window.requestIdleCallback(fn,{timeout:3000})}else{setTimeout(fn,1500)}};
  s(function(){try{
    // ... PostHog stub loader (same as index.html) ...
    posthog.init('phc_xR0jG1Uj4v7DMFULTIhDe6sr8cQTwBVOfPi88b4gbWM',{
      api_host:'https://us.i.posthog.com',
      person_profiles:'identified_only'
    });
  }catch(e){}});
})();</script>`
  : '';
```

**CSP header update:**

```typescript
// Before:
'Content-Security-Policy-Report-Only': `... script-src 'self' 'nonce-${nonce}' https://static.hotjar.com https://script.hotjar.com https://assets.apollo.io; ... connect-src 'self' https: https://*.hotjar.com wss://*.hotjar.com https://*.apollo.io;`

// After: Added PostHog domains
'Content-Security-Policy-Report-Only': `... script-src 'self' 'nonce-${nonce}' https://static.hotjar.com https://script.hotjar.com https://assets.apollo.io https://*-assets.i.posthog.com; ... connect-src 'self' https: https://*.hotjar.com wss://*.hotjar.com https://*.apollo.io https://us.i.posthog.com;`
```

**HTML template injection:**

```html
<!-- Added ${posthogTag} after ${apolloTag} in the <head> -->
${consentBootstrapTag}
${hotjarTag}
${apolloTag}
${posthogTag}
</head>
```

## Why This Works

1. **Root cause:** The SSR edge function (`ssr.ts`) constructs its own complete HTML document (lines 488-522) and returns it directly. It does NOT serve `index.html`. Any third-party scripts must be explicitly injected into the SSR template.

2. **Why the solution works:** By adding `posthogTag` to the SSR template with the same gating logic (`isProdHost && !isAdminPath`) and deferred loading pattern (`requestIdleCallback` with 3s timeout) used by Hotjar and Apollo, PostHog now loads for all production SSR-rendered pages.

3. **CSP was also blocking it:** Even if the script had been injected without CSP updates, the Content-Security-Policy-Report-Only header would have flagged PostHog's CDN (`*-assets.i.posthog.com`) and API host (`us.i.posthog.com`) as violations. Adding them to `script-src` and `connect-src` respectively prevents CSP interference.

## Prevention

- **When adding any new third-party analytics/tracking script:** Always add it to BOTH `index.html` (SPA fallback) AND `netlify/edge-functions/ssr.ts` (SSR template). The SSR template is the primary path for all production traffic.
- **Checklist for new scripts in this codebase:**
  1. Add inline script to `ssr.ts` HTML template with `nonce="${nonce}"` attribute
  2. Gate behind `isProdHost && !isAdminPath`
  3. Update CSP `script-src` with the script's CDN domain
  4. Update CSP `connect-src` with the script's API domain
  5. Add the same script to `index.html` for local dev / SPA fallback
- **Quick test:** After deploying, View Source on any production page and search for the token/script name. If it's missing, the SSR template is the culprit.

## Related Issues

No related issues documented yet.
