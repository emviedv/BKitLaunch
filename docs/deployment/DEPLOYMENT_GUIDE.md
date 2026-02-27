# BiblioKit Deployment Guide

Complete deployment guide for BiblioKit with Netlify, SSR edge functions, and PostgreSQL database integration.

## Overview

BiblioKit uses a hybrid SSR/SPA architecture:
- **Edge Functions**: Server-side rendering for SEO and AI crawlers
- **React SPA**: Interactive client-side experience for users
- **Netlify Functions**: Serverless API endpoints
- **PostgreSQL**: Content persistence via Neon database

### Build Output Structure
```
dist/
├── client/           # SPA assets for browser (PUBLISH DIRECTORY)
│   ├── index.html   # Client template
│   ├── assets/      # CSS/JS bundles
│   └── .vite/       # Build manifests
└── entry-server.js  # SSR module
```

## Prerequisites

1. **Netlify Account**: [netlify.com](https://netlify.com)
2. **GitHub Repository**: Code in a Git repository
3. **PostgreSQL Database**: Neon database configured
4. **Node.js 18+**: Required for builds

## Environment Variables

Configure these in Netlify Dashboard > Site Settings > Environment Variables:

### Required
```bash
# Admin Authentication
ADMIN_EMAIL=your-email@domain.com
ADMIN_PASSWORD=your-secure-password

# Security
JWT_SECRET=<at_least_32_chars_secret>
IP_HASH_SECRET=<random_secret_for_ip_hashing>
ALLOWED_ORIGINS=https://bibliokit.com,https://www.bibliokit.com
```

### Database (for content persistence)
```bash
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
VITE_DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
VITE_DB_HOST=<host>
VITE_DB_NAME=<db>
VITE_DB_USER=<user>
VITE_DB_PASSWORD=<password>
VITE_DB_PORT=5432
VITE_DB_SSL=true
```

**Security Note**: Never commit credentials. Rotate any credentials that were previously exposed.

## Deployment Methods

### Method 1: Git Integration (Recommended)

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Netlify automatically builds and deploys from the connected GitHub repository. Build settings are configured in `netlify.toml`.

### Method 2: Manual Deploy

```bash
npm install
npm run build
# Drag dist/client/ folder to Netlify's deploy interface
```

### Method 3: Netlify CLI

```bash
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod --dir=dist/client
```

**Warning**: CLI deploys can corrupt edge function state. If you encounter 400 errors after a CLI deploy, see the "Edge Function Recovery" section below.

## Build Configuration

The `netlify.toml` configures:
- **Build Command**: `npm run build`
- **Publish Directory**: `dist/client` (NOT `dist`)
- **Functions Directory**: `netlify/functions`
- **Edge Functions**: `netlify/edge-functions`

```toml
[build]
  publish = "dist/client"
  command = "npm run build"
  edge_functions = "netlify/edge-functions"

[[edge_functions]]
  path = "/*"
  function = "ssr"
```

## Post-Deployment Verification

### 1. Basic Site Check
- Visit your live site URL
- Verify pages load without blank screens
- Check browser console for errors

### 2. SSR Verification
```bash
# Test that SSR is working (should return full HTML, not empty shell)
curl -H "User-Agent: Googlebot" https://your-domain.com/
```

### 3. Admin System Test
1. Visit `/admin`
2. Login with your ADMIN_EMAIL and ADMIN_PASSWORD
3. Verify content editor appears
4. Test version history and settings tabs

### 4. API Endpoints
- `/.netlify/functions/content-management` - Should return JSON, not HTML
- `/api/db-test` - Test database connectivity

### 5. SEO Validation
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)

## Troubleshooting

### Blank Site After Deploy
1. Check browser console for errors
2. Verify build completed successfully
3. Test locally with `npm run preview`
4. Confirm publish directory is `dist/client`, not `dist`

### API Calls Return HTML Instead of JSON
The SPA fallback may be intercepting function requests. The `netlify.toml` includes a redirect rule to prevent this:
```toml
[[redirects]]
  from = "/.netlify/functions/*"
  to = "/.netlify/functions/:splat"
  status = 200
  force = true
```
This rule must come BEFORE the SPA catch-all redirect.

### Can't Login to Admin
1. Verify ADMIN_EMAIL and ADMIN_PASSWORD are set in Netlify
2. Redeploy after adding environment variables
3. Check Netlify function logs for admin-auth errors
4. Clear browser cache and try incognito window

### Database Connection Fails
- Verify DATABASE_URL is correct
- Ensure Neon database is active
- Check SSL is enabled (`?sslmode=require`)
- System falls back to localStorage if database unavailable

## Edge Function 400 Error Recovery

If the production site returns "400 Bad Request - Request Header Or Cookie Too Large" on all SSR routes:

**Symptoms**: Static files (favicon.ico, robots.txt) return 200; HTML routes (/, /blog) return 400.

**Recovery Steps**:
1. Temporarily disable edge functions in `netlify.toml`:
   ```toml
   # [[edge_functions]]
   #   path = "/*"
   #   function = "ssr"
   ```
2. Move edge-functions directory: `mv netlify/edge-functions netlify/edge-functions.bak`
3. Deploy without edge functions: `git push`
4. Wait for CI build to complete and verify site loads
5. Restore edge functions: `mv netlify/edge-functions.bak netlify/edge-functions` and uncomment config
6. Deploy with edge functions: `git push`
7. Verify SSR works by checking response headers

**Root Cause**: Netlify CLI edge function bundling can corrupt site-specific edge function state at the CDN layer. The disable/deploy/re-enable cycle clears corrupted state.

**Prevention**: Prefer `git push` + CI over `netlify-cli deploy --prod`.

## Bot Detection & AI Crawler Support

The edge function at `netlify/edge-functions/bot-detection.ts` serves static HTML to AI crawlers:

### Detected Crawlers
GPTBot, PerplexityBot, ClaudeBot, ChatGPT-User, Googlebot, Bingbot, facebookexternalhit

### Testing Bot Detection
```bash
# Test as GPTBot (should return full HTML)
curl -H "User-Agent: GPTBot/1.0" https://your-domain.com/

# Test as regular user (should return SPA)
curl https://your-domain.com/
```

### Response Headers for Bots
```
content-type: text/html
cache-control: public, max-age=3600
x-served-by: bot-detection-edge-function
```

## Rollback Plan

If issues arise:
- **Edge Function Failure**: Automatic SPA fallback
- **SSR Bundle Issues**: Client-side rendering continues
- **Content API Issues**: Static/localStorage fallbacks

The system is designed for zero-downtime deployment and graceful degradation.

## Quick Reference

| Task | Command |
|------|---------|
| Build | `npm run build` |
| Preview locally | `npm run preview` |
| Deploy via Git | `git push origin main` |
| Deploy via CLI | `netlify deploy --prod --dir=dist/client` |
| Dev server | `npm run dev` |
| Netlify dev | `npm run netlify:dev` |
