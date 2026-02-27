# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Core Development
npm run dev              # Start dev server (port 9990)
npm run build            # Build for production (client + server SSR)
npm run preview          # Preview production build

# Testing
npm run test:unit        # Run Jest unit tests
npm run test:e2e         # Run Playwright e2e tests

# Netlify
npm run netlify:dev      # Start Netlify dev server with functions
npx netlify-cli deploy --prod --dir=dist/client  # Deploy to production

# Utilities
npm run email:waitlist   # Pull waitlist signups from database
```

## Architecture Overview

**Stack**: React 18 + TypeScript + Vite + TailwindCSS + Wouter (routing) + Netlify Functions + PostgreSQL

### Key Directories
- `src/components/` - React components (product pages like `ComponentQAPage.tsx`, `FixTablePage.tsx`)
- `src/data/` - Static data (`products.json`, `blogPosts.ts`, `pageFaqs.ts`)
- `src/lib/` - Utilities (`seo.ts`, `contentApi.ts`, `database.ts`)
- `netlify/functions/` - Serverless API endpoints
- `netlify/edge-functions/` - Edge functions (bot detection for SEO)

### Content System
- **Dual storage**: JSON files + PostgreSQL database with localStorage fallback
- **Versioning**: Content has draft/published states
- **Admin interface**: `/admin` route for content editing
- **SEO metadata**: Defined in `src/lib/seo.ts` with structured data schemas

### Product Pages Pattern
Product pages follow this structure: Hero → Problem Agitation → Quick Proof → How It Works (3 steps) → Features (alternating layout) → Use Cases → CTA → FAQ → Final CTA. Use dedicated page components (e.g., `BiblioCleanPage.tsx`) rather than dynamic routing.

### Blog Posts
- Links must use Markdown format `[text](url)` - the `renderTextWithLinks` function does NOT parse HTML `<a>` tags
- Register image dimensions in `src/lib/imageDimensions.ts` to prevent CLS
- Add new posts to `BLOG_POSTS` array in `src/data/blogPosts.ts`
- For tutorials, also add slug to `TUTORIAL_POST_SLUGS` in `TutorialsPage.tsx`
- First in-article image uses `loading="eager"`, rest use `lazy`

### New Page Checklist
1. Add route in `src/App.tsx`
2. Add SEO metadata in `src/lib/seo.ts`
3. Verify sitemap includes the path
4. Register any images in `src/lib/imageDimensions.ts`

## Critical Rules

### Deployment
- **DO NOT push to GitHub or deploy to Netlify until explicitly instructed** - always wait for user confirmation
- **Publish directory is `dist/client`** (not `dist`) - missing this breaks asset loading
- Verify the live site loads after every deployment (no blank screens)
- **Prefer `git push` + CI over `netlify-cli deploy --prod`** - CLI deploys can corrupt edge function state at the CDN layer, causing site-wide 400 errors

### Edge Function 400 Error Recovery
If the production site returns "400 Bad Request - Request Header Or Cookie Too Large" on all SSR routes (but static assets work):

1. **Confirm symptoms**: Static files (favicon.ico, robots.txt) return 200; HTML routes (/, /blog) return 400
2. **Temporarily disable edge functions** in `netlify.toml`:
   ```toml
   # [[edge_functions]]
   #   path = "/*"
   #   function = "ssr"
   ```
3. **Move edge-functions directory**: `mv netlify/edge-functions netlify/edge-functions.bak`
4. **Deploy without edge functions**: `git add . && git commit -m "Disable edge functions" && git push`
5. **Wait for CI build to complete** and verify site loads (will be client-side only)
6. **Restore edge functions**: `mv netlify/edge-functions.bak netlify/edge-functions` and uncomment config
7. **Deploy with edge functions**: `git add . && git commit -m "Re-enable edge functions" && git push`
8. **Verify SSR works**: Check response headers for `x-ssr-generated` or CSP nonce headers

Root cause: Netlify CLI edge function bundling can corrupt site-specific edge function state at the CDN layer (openresty). The disable/deploy/re-enable cycle clears corrupted state.

### SEO Requirements
- Meta descriptions: unique per page, under 155 characters
- Title format: `[Keyword] | [Brand]` - keyword first, under 60 chars
- Every new page must be added to `src/lib/seo.ts` and sitemap
- SoftwareApplication schema requires `image` and `operatingSystem`
- Blog posts must be added to `src/data/blogPosts.ts` for sitemap inclusion

### Code Standards
- **TailwindCSS only** - no CSS files or style tags
- **TypeScript everywhere** - explicit types on all parameters
- **Functional components only** - no class components
- **Parameterized SQL queries** (`$1, $2`) - never string interpolation
- HTML class names must be specific (e.g., `ai-rename-hero-cta` not `cta`)

### Bug Fix Protocol
When fixing any bug, **always search the entire codebase** for similar patterns:
1. **Grep for the bug pattern** - Find ALL instances of the problematic code, not just the one reported
2. **Check related files** - If fixing URL handling in `seo.ts`, also check `sitemap.ts`, `entry-server.tsx`, hooks, etc.
3. **Consolidate duplicates** - If the same logic exists in multiple places, extract to a shared utility (see `src/lib/urlUtils.ts` as example)
4. **Verify all instances** - Run tests that cover ALL locations, not just the one you found first

Example: The www/non-www canonical URL bug was "fixed" in Jan 2026 but recurred in Feb 2026 because `sitemap.ts` was missed. Four files had URL normalization logic; only three were updated.

### Content Voice
- Target audience: designers, developers, and marketers
- Voice: "Relatable Pro" - empathetic, conversational, names the pain
- Action/benefit-driven copy (e.g., "Work x10,000 faster")
- No em dashes in customer-facing copy
- Plugin names in blog posts must hyperlink to Figma Community listings

## Product Roster

| Product | Description |
|---------|-------------|
| RenameVariantsAI | AI-assisted batch variant/property renamer |
| ComponentQA | Design system audits, detached instance detection |
| BiblioClean | Safely removes prototype links |
| FixTable | Normalizes auto-layout table structures |
| StateBuilder | Auto-generates interaction states |
| OrganizeFile | File scaffolding and project setup |

## Key Files

- `src/App.tsx` - Main routing (uses Wouter)
- `src/lib/seo.ts` - All SEO metadata and structured data
- `src/data/products.json` - Product content and feature data
- `src/data/blogPosts.ts` - Blog content (add new posts here)
- `netlify/edge-functions/bot-detection.ts` - SSR for crawlers
- `AGENTS.md` - Detailed business rules and coding guidelines

## Debug Logging

Every bug fix must be recorded in `docs/live-debug/LIVE_DEBUG_YYYY-MM.md` with: date/time, summary, root cause, changed files, and verification steps.
