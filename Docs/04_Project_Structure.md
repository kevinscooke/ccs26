# Project Structure - Charlotte Car Shows

## Overview

Charlotte Car Shows is a Next.js 14 application using the App Router, deployed as a static site on Netlify. The project uses Supabase/Prisma for data management with JSON exports for build-time static generation.

## Folder Structure

```
charlottecarshows-starter/
├── app/                          # Next.js App Router pages
│   ├── (marketing)/              # Marketing pages route group
│   │   ├── (legal)/             # Legal pages (accessibility, privacy, terms)
│   │   ├── layout.tsx           # Marketing layout
│   │   ├── page.tsx             # Home page (high-value)
│   │   ├── pricing/             # Pricing page
│   │   └── resources/           # Resources page
│   ├── contact/                 # Contact page
│   ├── daily/                   # Daily events view
│   ├── dashboard/               # Dashboard (future)
│   ├── data/                    # JSON data exports (events.json, venues.json)
│   ├── events/                  # Events routes
│   │   ├── [slug]/              # Individual event detail pages
│   │   ├── charlotte-auto-show/ # Special series page (high-value)
│   │   ├── layout.tsx           # Events layout
│   │   ├── page.tsx             # Events index (high-value)
│   │   ├── page/[page]/         # Pagination
│   │   └── past/                # Past events
│   ├── guide-to-charlotte-car-shows/  # Guide page
│   ├── search/                  # Search page
│   ├── submit-event/            # Event submission
│   ├── venue/                   # Venue detail pages
│   │   └── [slug]/              # Individual venue pages
│   ├── weekly-car-show-list-charlotte/  # Weekly view (high-value)
│   ├── error.tsx                # Error boundary
│   ├── global-error.tsx         # Global error boundary
│   ├── globals.css              # Global styles + design tokens
│   ├── layout.tsx               # Root layout
│   ├── not-found.tsx            # 404 page
│   ├── robots.txt/              # Robots.txt route
│   └── sitemap.xml/             # Sitemap route
├── components/                   # React components
│   ├── ads/                     # Ad components (AdSlot, HeaderAdBar, FooterAdBar)
│   ├── event/                   # Event-specific components
│   │   ├── CalendarButtons.tsx
│   │   ├── CompactUpcomingEvents.tsx
│   │   ├── EventCard.tsx
│   │   ├── EventListCard.tsx    # Used by /events/, /weekly-car-show-list-charlotte/
│   │   ├── FeaturedEventsGrid.tsx
│   │   ├── MonthJump.tsx
│   │   ├── StickyCTA.tsx
│   │   └── UpcomingSix.tsx
│   ├── nav/                     # Navigation components
│   │   └── TopNav.tsx
│   ├── search/                  # Search components
│   │   ├── SearchBox.tsx
│   │   ├── SearchForm.tsx
│   │   └── SearchProvider.tsx
│   ├── ui/                      # UI primitives (shadcn/ui based)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── Heading.tsx
│   │   └── input.tsx
│   ├── Breadcrumbs.tsx          # Shared breadcrumb component
│   ├── Container.tsx            # Layout container
│   ├── EventCard.tsx            # Legacy event card (used by series pages)
│   ├── Footer.tsx                # Site footer
│   ├── HomeHero.tsx             # Home page hero section
│   ├── NotFoundClient.tsx       # 404 client component
│   ├── ResourceCard.tsx         # Resource card component
│   ├── WeeklyControls.client.tsx # Weekly view controls
│   ├── WeeklyList.client.tsx    # Weekly list client component
│   └── WeeklyTabs.client.tsx    # Weekly tabs
├── Docs/                        # Project documentation
│   ├── Implementation.md        # Implementation plan
│   ├── Project_Structure.md     # This file
│   ├── UI_UX_doc.md             # Design system documentation
│   └── Bug_Tracking.md          # Known issues and tracking
├── lib/                         # Utility libraries
│   ├── data.ts                  # Data loading utilities (loadEvents)
│   ├── et.ts                    # ET timezone utilities
│   ├── eventSlug.ts             # Event slug generation
│   ├── formatET.ts              # ET date formatting
│   ├── tags.ts                  # Event tags/TYPES
│   └── utils.ts                 # General utilities (cn function)
├── prisma/                      # Prisma schema and migrations
│   ├── migrations/              # Database migrations
│   └── schema.prisma            # Prisma schema
├── public/                      # Static assets
│   ├── data/                    # Public JSON data (mirrored from app/data)
│   ├── images/                  # Images
│   ├── _redirects               # Netlify redirects
│   ├── ads.txt                  # Ad inventory file
│   ├── events.json              # Public events JSON
│   ├── search-index.json        # Search index
│   └── venues.json              # Public venues JSON
├── scripts/                     # Build and utility scripts
│   ├── build-search-index.ts    # Search index generator
│   ├── export-json.mjs          # Supabase to JSON exporter
│   └── preview-sitemap.js       # Sitemap preview utility
├── styles/                      # Additional styles (currently empty)
├── types/                       # TypeScript type definitions
│   └── global.d.ts              # Global type definitions
├── .cursor/rules/               # Cursor AI rules
│   ├── arch.mdc                 # Architecture guidelines
│   ├── generate.mdc             # Code generation guidelines
│   ├── style.mdc                # Style guidelines
│   └── workflow.mdc             # Workflow guidelines
├── netlify.toml                 # Netlify configuration
├── next.config.mjs              # Next.js configuration
├── package.json                 # Dependencies and scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── PRD.md                       # Product Requirements Document
```

## File Organization Patterns

### Pages (App Router)
- **Route Groups:** Use parentheses for logical grouping without affecting URL structure
  - `(marketing)/` - Marketing pages
  - `(legal)/` - Legal pages within marketing group
- **Dynamic Routes:** Use `[slug]` for dynamic segments
- **Nested Routes:** Use folder structure for nested paths (`events/[slug]/page.tsx`)
- **Special Pages:** Use descriptive folders for special series pages (`charlotte-auto-show/`)

### Components
- **Grouped by Feature:** Components organized by feature area (`event/`, `search/`, `ads/`)
- **Shared Components:** Root-level components used across multiple pages
- **UI Primitives:** `ui/` folder for reusable UI components (shadcn/ui pattern)
- **Client Components:** Use `.client.tsx` suffix for client-only components

### Data Management
- **Source Data:** Supabase/Prisma database (production)
- **Build-Time Data:** JSON exports in `app/data/` (used during build)
- **Public Data:** Mirrored JSON in `public/data/` for client-side access
- **Search Index:** `public/search-index.json` for client-side search

### Styling
- **Global Styles:** `app/globals.css` with design tokens and Tailwind imports
- **Component Styles:** CSS modules where needed (`.module.css`)
- **Design Tokens:** CSS custom properties in `:root` in `globals.css`
- **Tailwind Config:** Custom tokens mapped in `tailwind.config.js`

## Module/Component Hierarchy

### Page Components (Server Components)
```
app/
├── layout.tsx (Root layout)
│   ├── TopNav
│   ├── HeaderAdBar
│   ├── SearchProvider
│   ├── [page content]
│   ├── FooterAdBar
│   └── Footer
├── (marketing)/page.tsx (Home)
│   ├── Container
│   ├── CompactUpcomingEvents
│   ├── FeaturedEventsGrid
│   └── SearchBox
└── events/page.tsx (Events Index)
    ├── Container
    ├── Breadcrumbs
    ├── WeeklyControls (client)
    ├── SearchBox
    └── EventListCard (multiple)
```

### Shared Components
```
components/
├── Container.tsx (Layout wrapper)
├── Breadcrumbs.tsx (Navigation breadcrumbs)
├── event/
│   └── EventListCard.tsx (Event display card)
└── ui/
    ├── button.tsx (Button variants)
    └── card.tsx (Card component)
```

### Data Flow
```
Supabase (Database)
  ↓
Prisma (ORM)
  ↓
scripts/export-json.mjs
  ↓
app/data/events.json + venues.json
  ↓
lib/data.ts (loadEvents)
  ↓
Page Components (Server Components)
  ↓
Client Components (if needed)
```

### Search Flow
```
app/data/events.json
  ↓
scripts/build-search-index.ts
  ↓
public/search-index.json
  ↓
components/search/SearchProvider.tsx
  ↓
components/search/SearchBox.tsx
  ↓
app/search/page.tsx
```

## Configuration Files

### Build & Deployment
- **netlify.toml:** Netlify deployment configuration, redirects, headers
- **next.config.mjs:** Next.js configuration (static export, image domains)
- **package.json:** Dependencies, scripts, build configuration

### Styling
- **tailwind.config.js:** Tailwind theme extension (design tokens, container)
- **postcss.config.js:** PostCSS configuration
- **app/globals.css:** Global styles, design tokens, component classes

### TypeScript
- **tsconfig.json:** TypeScript compiler options, path aliases
- **types/global.d.ts:** Global type definitions

### Database
- **prisma/schema.prisma:** Database schema definition
- **prisma/migrations/:** Database migration history

## Environment Configuration

### Environment Variables (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
DATABASE_URL=...
```

### Build Scripts (package.json)
- `dev` - Development server
- `build` - Production build (generates `out/` directory)
- `export:json` - Export Supabase data to JSON
- `build:search-index` - Generate search index

## Asset Organization

### Images
- **Location:** `public/images/`
- **Usage:** Next.js `Image` component with optimized loading
- **Naming:** Descriptive kebab-case (`hero-ccs.jpg`)

### Fonts
- **Source:** Next.js Google Fonts integration
- **Fonts:** Inter (sans-serif), Source Serif 4 (heading)
- **Configuration:** `app/layout.tsx`

### JSON Data
- **Build-time:** `app/data/events.json`, `venues.json`
- **Runtime:** `public/data/events.json`, `venues.json`
- **Search:** `public/search-index.json`

## Deployment Structure

### Build Output (`out/`)
```
out/
├── _next/                       # Next.js static assets
│   ├── static/                  # Hashed assets (CSS, JS, media)
│   └── ...
├── _redirects                   # Netlify redirects (copied)
├── index.html                   # Home page
├── events/                      # Events pages
│   ├── index.html
│   └── [slug]/
├── ...                          # Other routes
└── sitemap.xml                  # Generated sitemap
```

### Netlify Configuration
- **Build Command:** `pnpm build`
- **Publish Directory:** `out`
- **Node Version:** 20 (from netlify.toml)

## Key Architectural Decisions

### Static Generation
- **Rationale:** Fast page loads, excellent SEO, cost-effective hosting
- **Implementation:** Next.js static export with build-time data loading
- **Trade-off:** Requires rebuild for content updates (mitigated by automated builds)

### JSON Data Exports
- **Rationale:** Decouple from database for build, faster builds, reliable source
- **Implementation:** Scripted export from Supabase to JSON files
- **Trade-off:** Data must be exported before building (automated via CI)

### Client Components Separation
- **Rationale:** Minimize client bundle, improve initial load performance
- **Implementation:** Default to Server Components, opt-in to Client Components
- **Trade-off:** Some interactivity requires client components (expected)

### Design Token System
- **Rationale:** Consistent styling, easy theming, maintainable design system
- **Implementation:** CSS custom properties + Tailwind config integration
- **Trade-off:** Learning curve for token usage (mitigated by documentation)

## Development Workflow

### Local Development
1. Install dependencies: `pnpm install`
2. Set up environment: `.env.local` with Supabase credentials
3. Export data: `pnpm export:json`
4. Build search index: `pnpm build:search-index`
5. Start dev server: `pnpm dev`

### Data Updates
1. Update data in Supabase
2. Run export: `pnpm export:json`
3. Rebuild search index: `pnpm build:search-index`
4. Test locally: `pnpm dev`
5. Commit changes: JSON files should be committed

### Pre-Push Checklist
**See `Docs/Pre_Push_Checklist.md` for complete checklist.**

**Quick validation before pushing:**
```bash
pnpm lint && pnpm typecheck && pnpm validate:jsonld
```

**Required checks:**
- [ ] Lint passes (`pnpm lint`)
- [ ] Type check passes (`pnpm typecheck`)
- [ ] JSON-LD validation (`pnpm validate:jsonld`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Test JSON-LD after Netlify deploy with [Google Rich Results Test](https://search.google.com/test/rich-results)

### Deployment
1. **Before pushing:** Run pre-push checklist (see `Docs/Pre_Push_Checklist.md`)
2. Push to main branch
3. Netlify builds automatically
4. Build runs: `pnpm build:search-index`, `pnpm build`
5. Static files deployed to CDN
6. Redirects and headers applied
7. **After deploy:** Validate JSON-LD with Google Rich Results Test

## Future Structure Considerations

### Planned Additions
- **API Routes:** If dynamic functionality needed (`app/api/`)
- **Middleware:** For auth or redirects (`middleware.ts`)
- **Tests:** Testing infrastructure (`__tests__/` or `tests/`)
- **E2E Tests:** Playwright tests (`e2e/`)

### Potential Refactoring
- **Component Consolidation:** Some duplicate components (`EventCard` vs `EventListCard`)
- **Route Grouping:** More logical grouping of pages
- **Data Layer:** Potential API layer abstraction

