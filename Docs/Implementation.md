# Implementation Plan for Charlotte Car Shows

## Executive Summary

Charlotte Car Shows is a Next.js-based static site deployed on Netlify, using Supabase/Prisma for data management. The site migrated from WordPress in 2024 and serves as the premier destination for Charlotte Metro car show listings, events, and automotive community resources.

**Tech Stack:**
- **Frontend:** Next.js 14.2.5 (App Router), React 18.3.1, TypeScript
- **Styling:** Tailwind CSS 3.4.13 with custom design tokens
- **Database:** Supabase (PostgreSQL) with Prisma ORM
- **Deployment:** Netlify (static export)
- **Data:** JSON exports from Supabase (`app/data/events.json`, `venues.json`)
- **Search:** Client-side search index (`public/search-index.json`)

## PRD Goals Analysis

Based on PRD.md, we have four primary goals:

### G1: Analyze High-Value Pages & Standardize Documentation
**Target Pages:**
- Home (`app/(marketing)/page.tsx`) ✅ Analyzed
- Events Index (`app/events/page.tsx`) ✅ Analyzed
- Weekly List (`app/weekly-car-show-list-charlotte/page.tsx`) ✅ Analyzed
- Charlotte Auto Show (`app/events/charlotte-auto-show/page.tsx`) ✅ Analyzed

**Findings:**
- Consistent use of `Container`, `Breadcrumbs`, `EventListCard` components
- SEO metadata patterns are consistent across pages
- JSON-LD structured data implementation varies
- Design token usage is mixed (some use CSS classes, some use Tailwind utilities)
- Ad integration patterns are consistent

### G2: Track Pages Needing Work (CSS, SEO, etc.)
**Pages Requiring Attention:**
- [ ] Review and standardize JSON-LD implementation across all pages
- [ ] Ensure consistent use of design tokens (avoid mixing `ccs-card` with Tailwind classes)
- [ ] Audit accessibility (ARIA labels, keyboard navigation)
- [ ] Verify canonical URLs and Open Graph metadata completeness
- [ ] Check mobile responsiveness on all high-value pages
- [ ] Review performance metrics (LCP, CLS, FID)

### G3: Determine High-Value Tasks to Prioritize Next
**Recommended Priority:**
1. **Standardize component patterns** (high impact, medium effort)
2. **Complete JSON-LD schema markup** (SEO impact, low effort)
3. **Create AutoFair 2026 page** (G4, high value for users)
4. **Performance optimization** (Core Web Vitals)
5. **Accessibility audit and fixes**

### G4: Copy Charlotte Auto Show Page for 2026 AutoFair
**Status:** ✅ Complete
- Template pattern exists in `app/events/charlotte-auto-show/page.tsx`
- Created: `app/events/charlotte-autofair/page.tsx` ✅
- Pattern uses event filtering by ID/slug and year-based organization (2026 events)
- Added to Footer and TopNav navigation ✅
- Added sidebar with skyscraper ad (matches `/events/` layout) ✅
- Metadata and structured data (JSON-LD) complete ✅

## Feature Analysis

### Identified Features:

1. **Event Listings System**
   - Dynamic event loading from JSON export
   - Filtering by date, status, featured
   - Pagination support
   - Past events archive

2. **Search Functionality**
   - Client-side search via `SearchBox` component
   - Search index generation (`scripts/build-search-index.ts`)
   - Search provider context

3. **SEO & Structured Data**
   - Metadata per page (title, description, Open Graph, Twitter)
   - JSON-LD schema (Organization, WebSite, Event, ItemList)
   - Canonical URLs
   - Sitemap generation

4. **Weekly View**
   - Week-based filtering (Sunday-Saturday)
   - Day-grouped event display
   - Weekly controls for navigation

5. **Event Series Pages**
   - Special pages for recurring events (Charlotte Auto Show)
   - Year-based filtering and organization
   - Past years archive

6. **Ad Integration**
   - Dynamic AdSlot component (SSR disabled)
   - Responsive ad sizes
   - Header/Footer ad bars

7. **Responsive Design**
   - Mobile-first approach
   - Grid layouts for desktop/tablet
   - Sticky sidebars on desktop

### Feature Categorization:

**Must-Have Features:**
- Event listings and detail pages
- Search functionality
- SEO optimization
- Mobile responsiveness
- Basic ad integration

**Should-Have Features:**
- Weekly view
- Event series pages
- Advanced filtering
- Performance optimization
- Accessibility compliance

**Nice-to-Have Features:**
- Advanced search filters
- User accounts/submissions
- Social sharing enhancements
- Analytics dashboard

## Recommended Tech Stack (Current Stack Confirmed)

### Frontend:
- **Framework:** Next.js 14.2.5 - Proven for static export, excellent SEO, App Router for modern React patterns
- **Documentation:** https://nextjs.org/docs

### Styling:
- **Framework:** Tailwind CSS 3.4.13 - Utility-first, design token integration
- **Documentation:** https://tailwindcss.com/docs

### Database:
- **Database:** Supabase (PostgreSQL) - Serverless, real-time capabilities, Prisma integration
- **Documentation:** https://supabase.com/docs

### Deployment:
- **Platform:** Netlify - Optimized for Next.js static exports
- **Documentation:** https://docs.netlify.com/

### Additional Tools:
- **ORM:** Prisma - Type-safe database access
- **Documentation:** https://www.prisma.io/docs
- **Search:** Client-side index (custom implementation)
- **Ads:** Google AdSense (via AdSlot component)

## Implementation Stages

### Stage 1: Foundation & Standardization ✅ (In Progress)

#### 1.1 Documentation Structure
- [x] Create `Docs/Implementation.md` (this file)
- [ ] Complete `Docs/Project_Structure.md` with current architecture
- [ ] Complete `Docs/UI_UX_doc.md` with design system
- [ ] Update `Docs/Bug_Tracking.md` with identified issues

#### 1.2 Cursor Rules Enhancement
- [ ] Enhance `.cursor/rules/arch.mdc` with project-specific architecture guidelines
- [ ] Update `.cursor/rules/style.mdc` with design token usage
- [ ] Add `.cursor/rules/seo.mdc` for SEO best practices
- [ ] Create `.cursor/rules/patterns.mdc` for component patterns

#### 1.3 Component Pattern Standardization
- [ ] Document component usage patterns (Container, Breadcrumbs, EventListCard)
- [ ] Create component pattern examples
- [ ] Standardize prop interfaces

**Time Estimate:** 2-3 days
**Dependencies:** None

### Stage 2: Core Features Enhancement

#### 2.1 SEO & Structured Data Standardization
- [ ] Audit all pages for complete metadata
- [ ] Standardize JSON-LD implementation
- [ ] Ensure canonical URLs are consistent
- [ ] Verify Open Graph images for all pages

#### 2.2 Design Token Consistency
- [ ] Audit CSS class usage vs design tokens
- [ ] Create migration guide for mixed usage
- [ ] Update components to prefer design tokens
- [ ] Document token usage patterns

#### 2.3 Performance Optimization
- [ ] Run Lighthouse audits on high-value pages
- [ ] Optimize image loading (next/image usage audit)
- [ ] Review bundle size
- [ ] Implement code splitting where needed

**Time Estimate:** 3-5 days
**Dependencies:** Stage 1 completion

### Stage 3: Advanced Features

#### 3.1 AutoFair 2026 Page (G4)
- [x] Create `app/events/charlotte-autofair/page.tsx` ✅
- [x] Identify AutoFair event IDs in events.json ✅
  - IDs: 7fb39344-1d13-4c45-882f-82ad90aa9e6c (Thu), 3940ada8-c47a-4c41-b4c0-3a856a703b99 (Fri), be48d403-c249-4453-8453-77baf66e9954 (Sat)
- [x] Copy Charlotte Auto Show page pattern ✅
- [x] Update metadata and structured data ✅
- [x] Add to navigation (Footer and TopNav) ✅
- [x] Add sidebar with skyscraper ad (matches `/events/`) ✅
- [ ] Test and verify functionality after deploy

#### 3.2 Accessibility Improvements
- [ ] Run accessibility audit (axe, Lighthouse)
- [ ] Fix ARIA label issues
- [ ] Ensure keyboard navigation
- [ ] Test with screen readers
- [ ] Document accessibility patterns

#### 3.3 Advanced Event Features
- [ ] Enhance event filtering UI
- [ ] Add date range picker for weekly view
- [ ] Improve search relevance
- [ ] Add event categories/tags UI

**Time Estimate:** 5-7 days
**Dependencies:** Stage 2 completion

### Stage 4: Polish & Optimization

#### 4.1 Testing & Quality Assurance
- [ ] Write tests for critical components
- [ ] End-to-end testing for key user flows
- [ ] Cross-browser testing
- [ ] Mobile device testing

#### 4.2 Documentation Finalization
- [ ] Complete all Docs files
- [ ] Create component usage examples
- [ ] Document deployment process
- [ ] Create contributor guidelines

#### 4.3 Monitoring & Analytics
- [ ] Set up error tracking
- [ ] Implement analytics (if not already)
- [ ] Monitor Core Web Vitals
- [ ] Track conversion metrics

**Time Estimate:** 3-4 days
**Dependencies:** Stage 3 completion

## High-Value Tasks Prioritization

### Immediate (Week 1-2):
1. **Complete documentation structure** - Foundation for all other work
2. **Standardize JSON-LD schema** - Quick SEO win
3. **Create AutoFair 2026 page** - Direct user value (G4)

### Short-term (Week 3-4):
4. **Design token consistency** - Improves maintainability
5. **Performance audit** - User experience improvement
6. **Accessibility fixes** - Compliance and usability

### Medium-term (Month 2):
7. **Component pattern documentation** - Developer experience
8. **Advanced filtering** - User experience enhancement
9. **Testing infrastructure** - Code quality

## Decisions & Patterns

### Design Token Usage
- **Preferred:** Use CSS custom properties (`var(--brand-500)`, `var(--fg)`)
- **Fallback:** Tailwind utilities when tokens aren't available
- **Avoid:** Hard-coded colors or mixing patterns inconsistently

### Component Patterns
- **Containers:** Always use `Container` component for page wrappers
- **Breadcrumbs:** Use `Breadcrumbs` component for navigation context
- **Event Cards:** Use `EventListCard` for list views, `EventCard` for detail views
- **Metadata:** Always include complete metadata object per page

### SEO Patterns
- **Canonical URLs:** Always include, use absolute URLs
- **Open Graph:** Include title, description, image, URL for all pages
- **JSON-LD:** Include relevant schema (Event, Organization, ItemList) as appropriate
- **Structured Data:** Validate with Google Rich Results Test

### Data Loading
- **Runtime:** Use `loadEvents()` for dynamic data
- **Static:** Export to JSON for build-time generation
- **Search Index:** Generate on build via `build:search-index` script

## Resources & References

### Official Documentation:
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Netlify Documentation](https://docs.netlify.com/)

### SEO & Performance:
- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Web.dev Performance](https://web.dev/performance)
- [Web.dev Accessibility](https://web.dev/accessibility)

### Testing Tools:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

## Timeline Summary

- **Week 1:** Documentation setup, cursor rules enhancement, initial audits
- **Week 2:** AutoFair 2026 page, SEO standardization
- **Week 3-4:** Design token consistency, performance optimization
- **Month 2:** Advanced features, accessibility, testing

**Total Estimated Time:** 6-8 weeks (assuming part-time development)

## Next Steps

1. Review and approve this implementation plan
2. Begin Stage 1: Foundation & Standardization
3. Set up tracking for progress on each checkbox
4. Schedule regular reviews of high-value pages

