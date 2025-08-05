# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server on port 5176
- `npm run build` - Build TypeScript and Vite for production
- `npm run preview` - Preview production build on port 5176
- `npm run serve` - Serve production build on port 5176

### Netlify Commands
- `npm run netlify:dev` - Start Netlify dev server (includes functions)
- `npm run netlify:build` - Build using Netlify's build process

### Development Monitoring (from .cursorrules)
- `./scripts/dev-monitor.sh status` - Check development server status
- `./scripts/dev-monitor.sh monitor` - Monitor live development
- `./scripts/dev-monitor.sh restart` - Restart development server

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS (no CSS or style tags allowed per rules)
- **Routing**: Wouter for client-side routing
- **Backend**: Netlify Functions (serverless)
- **Database**: PostgreSQL via `pg` package
- **Deployment**: Netlify

### Project Structure
```
src/
├── components/           # React components (organized by feature)
│   ├── ContentEditor/   # Content editing components
│   └── [Various UI components]
├── contexts/            # React contexts (AuthContext)
├── data/               # Static data (products.json)
├── hooks/              # Custom React hooks
├── lib/                # Utilities and API clients
│   ├── contentApi.ts   # Main API client for content management
│   ├── database.ts     # Database types and API client
│   ├── debugService.ts # Debug utilities
│   └── utils.ts        # General utilities
└── main.tsx            # Entry point

netlify/
├── functions/          # Serverless functions
└── edge-functions/     # Edge functions (bot detection)
```

### Key Architecture Patterns

#### Content Management System
- **Dual Storage**: Content stored both as JSON (localStorage fallback) and in PostgreSQL database
- **Versioning**: Content has draft/published states with full version history
- **Sync System**: JSON content can be synced to structured database tables
- **Admin Interface**: Built-in content editor accessible via edit button (✏️) or `/admin` route

#### API Architecture
- **Serverless Functions**: All backend logic in `netlify/functions/`
- **CORS Handling**: All functions include proper CORS headers
- **Authentication**: Token-based auth stored in localStorage
- **Error Handling**: Standard API response format: `{ success, data?, error?, message? }`

#### Database Design
- **Content Sections**: Modular content stored by section type (hero, features, pricing, etc.)
- **Features & Pricing**: Nested structures for complex content types
- **Users Table**: For waitlist and user management
- **Connection Pooling**: Required for PostgreSQL connections

## Development Guidelines

### Code Quality (from .cursor/rules)
- **TypeScript everywhere** - All variables, props, parameters must have explicit types
- **Functional components only** - No class components
- **Named exports preferred** (except for main components)
- **Early returns** to avoid deep nesting
- **DRY principle** - Extract repeated logic into hooks/utilities

### Styling Rules
- **TailwindCSS only** - No CSS files or style tags
- Use `clsx` for conditional classes
- Semantic, accessible HTML required
- Consistent design system adherence

### Security Requirements
- **Environment variables only** for secrets (never hardcode)
- **Parameterized queries** (`$1, $2`) - never string interpolation
- **CORS headers** on all API endpoints
- **Error sanitization** - never expose stack traces to clients

### Content Management Workflow
1. Content can be edited via admin interface (`/admin`) or JSON editor
2. Changes can be saved as drafts or published immediately
3. Database sync ensures content is available in structured format
4. Fallback to localStorage when database unavailable

## Testing & Deployment

### Local Development
- Development server runs on `http://localhost:5176`
- Admin interface: `http://localhost:5176/admin`
- Functions: `http://localhost:5176/.netlify/functions/[function-name]`
- Screen session: `bibliokit-dev` for background monitoring

### Database Environment
- Uses `VITE_DATABASE_URL` for connection string
- Additional config via `VITE_DB_*` environment variables
- SSL required in production

### Deployment
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- Netlify handles function deployment automatically
- Environment variables must be configured in Netlify dashboard

## Key Files to Know

- `src/lib/contentApi.ts` - Main API client with comprehensive CRUD operations
- `src/lib/database.ts` - Database types and configuration
- `src/App.tsx` - Main routing and layout logic
- `src/components/ContentEditor.tsx` - Built-in content editing interface
- `netlify/functions/content-management.ts` - Core content API backend
- `.cursorrules` - Development standards and coding guidelines

## Common Development Tasks

### Adding New Content Types
1. Define TypeScript interfaces in `src/lib/database.ts`
2. Add database migration for new tables
3. Create CRUD functions in `netlify/functions/`
4. Add frontend editing components in `src/components/ContentEditor/`
5. Update API client in `src/lib/contentApi.ts`

### API Development
- All functions must handle OPTIONS preflight requests
- Use `netlify/functions/utils.ts` for shared utilities
- Follow the established error handling patterns
- Include proper TypeScript types for request/response

### Content Editing
- Admin interface supports real-time preview
- Content auto-saves to localStorage as backup
- Database sync happens on publish
- JSON editor provides direct content manipulation