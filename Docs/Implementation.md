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

**Quick Status Summary:**
- ✅ **G4: AutoFair 2026 Page** — COMPLETE
- ✅ **Auto Show & AutoFair UX/SEO Improvements** — COMPLETE
- ✅ **JSON-LD Schema Standardization** — COMPLETE
- ✅ **Event Component Standardization & Tailwind Migration** — COMPLETE
- ✅ **Weekly Events Page Improvements** — COMPLETE (Monday-Sunday ordering, venue links disabled)
- ⏳ **Active:** Foundation & Standardization (documentation, cursor rules, component patterns)
- ⏳ **Active:** Core Features Enhancement (SEO, design tokens, performance)
- ⏳ **Active:** Accessibility Improvements (automated checks complete, browser audits pending)

---

## PRD Goals Analysis

Based on PRD.md, we have four primary goals:

### G1: Analyze High-Value Pages & Standardize Documentation
**Status:** ✅ Complete (Analysis Done)
**Target Pages:**
- Home (`app/(marketing)/page.tsx`) ✅ Analyzed
- Events Index (`app/events/page.tsx`) ✅ Analyzed
- Weekly List (`app/weekly-car-show-list-charlotte/page.tsx`) ✅ Analyzed
- Charlotte Auto Show (`app/events/charlotte-auto-show/page.tsx`) ✅ Analyzed

**Findings:**
- Consistent use of `Container`, `Breadcrumbs`, `EventListCard` components
- SEO metadata patterns are consistent across pages
- JSON-LD structured data implementation standardized ✅
- Design token usage migrated to Tailwind utilities ✅
- Ad integration patterns are consistent

### G2: Track Pages Needing Work (CSS, SEO, etc.)
**Status:** ⏳ In Progress
**Pages Requiring Attention:**
- [ ] Ensure consistent use of design tokens (migration to Tailwind complete, audit remaining)
- [ ] Complete accessibility audit (automated checks done, browser audits pending)
- [ ] Verify canonical URLs and Open Graph metadata completeness
- [ ] Check mobile responsiveness on all high-value pages
- [ ] Review performance metrics (LCP, CLS, FID)

### G3: Determine High-Value Tasks to Prioritize Next
**Status:** ✅ Complete
**Recommended Priority (Updated):**
1. ✅ ~~Standardize component patterns~~ — COMPLETE (EventListCard is standard)
2. ✅ ~~Complete JSON-LD schema markup~~ — COMPLETE
3. ✅ ~~Create AutoFair 2026 page~~ — COMPLETE (G4)
4. Performance optimization (Core Web Vitals) — Active
5. Accessibility audit and fixes — In Progress (automated complete, browser audits pending)

---

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
   - JSON-LD schema (Organization, WebSite, Event, ItemList) ✅ Standardized
   - Canonical URLs
   - Sitemap generation

4. **Weekly View**
   - Week-based filtering (Monday-Sunday) ✅ Fixed ordering
   - Day-grouped event display
   - Weekly controls for navigation

5. **Event Series Pages**
   - Special pages for recurring events (Charlotte Auto Show, AutoFair ✅)
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
- ✅ Event listings and detail pages
- ✅ Search functionality
- ✅ SEO optimization
- ✅ Mobile responsiveness
- ✅ Basic ad integration

**Should-Have Features:**
- ✅ Weekly view (improved ordering)
- ✅ Event series pages
- Advanced filtering
- Performance optimization — Active
- Accessibility compliance — In Progress

**Nice-to-Have Features:**
- Advanced search filters
- User accounts/submissions
- Social sharing enhancements
- Analytics dashboard

---

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

---

## Implementation Stages

### Stage 1: Foundation & Standardization ⏳ (In Progress)

#### 1.1 Documentation Structure
- [x] Create `Docs/Implementation.md` (this file) ✅
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

---

### Stage 2: Core Features Enhancement ⏳ (In Progress)

#### 2.1 SEO & Structured Data Standardization
- [x] Audit all pages for complete metadata ✅
- [x] Standardize JSON-LD implementation ✅
- [ ] Ensure canonical URLs are consistent (review pending)
- [ ] Verify Open Graph images for all pages

#### 2.2 Design Token Consistency
- [x] Audit CSS class usage vs design tokens ✅ (migration complete)
- [x] Migrate components to Tailwind utilities ✅
- [x] Remove legacy `.ccs-*` classes ✅
- [ ] Document token usage patterns (in progress)

#### 2.3 Performance Optimization
- [ ] Run Lighthouse audits on high-value pages
- [ ] Optimize image loading (next/image usage audit)
- [ ] Review bundle size
- [ ] Implement code splitting where needed

**Time Estimate:** 3-5 days
**Dependencies:** Stage 1 completion

---

### Stage 3: Advanced Features ⏳ (In Progress)

#### 3.1 AutoFair 2026 Page (G4)
- [x] Create `app/events/charlotte-autofair/page.tsx` ✅
- [x] Identify AutoFair event IDs in events.json ✅
- [x] Copy Charlotte Auto Show page pattern ✅
- [x] Update metadata and structured data ✅
- [x] Add to navigation (Footer and TopNav) ✅
- [x] Add sidebar with skyscraper ad (matches `/events/`) ✅
- [x] UX improvements (reorganization, SEO copywriting) ✅
- [x] Test and verify functionality after deploy ✅

#### 3.2 Accessibility Improvements
- [x] Run accessibility audit (automated checks) ✅
- [x] Fix ARIA label issues ✅
- [x] Ensure keyboard navigation ✅
- [ ] Test with screen readers
- [ ] Document accessibility patterns

#### 3.3 Advanced Event Features
- [ ] Enhance event filtering UI
- [ ] Add date range picker for weekly view
- [ ] Improve search relevance
- [ ] Add event categories/tags UI

**Time Estimate:** 5-7 days
**Dependencies:** Stage 2 completion

---

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

---

## High-Value Tasks Prioritization

### Immediate (Week 1-2):
1. ✅ ~~Complete documentation structure~~ — In Progress
2. ✅ ~~Standardize JSON-LD schema~~ — COMPLETE
3. ✅ ~~Create AutoFair 2026 page~~ — COMPLETE

### Short-term (Week 3-4):
4. ✅ ~~Design token consistency~~ — COMPLETE (migration done)
5. Performance audit — Active
6. Accessibility fixes — In Progress (automated complete)

### Medium-term (Month 2):
7. Component pattern documentation — Active
8. Advanced filtering — Planned
9. Testing infrastructure — Planned

---

## Decisions & Patterns

### Design Token Usage
- **Preferred:** Use Tailwind utilities with token-mapped colors (`bg-brand-600`, `text-gray-800`)
- **Token Mapping:** Design tokens (brand-*, gray-*) mapped in `tailwind.config.js`
- **Avoid:** Legacy `.ccs-*` classes (deprecated, migration complete)

### Component Patterns
- **Containers:** Always use `Container` component for page wrappers
- **Breadcrumbs:** Use `Breadcrumbs` component for navigation context
- **Event Cards:** Use `EventListCard` for all list views (standard component)
- **Metadata:** Always include complete metadata object per page

### SEO Patterns
- **Canonical URLs:** Always include, use absolute URLs
- **Open Graph:** Include title, description, image, URL for all pages
- **JSON-LD:** Include relevant schema (Event, Organization, ItemList) — standardized ✅
- **Structured Data:** Validate with Google Rich Results Test

### Data Loading
- **Runtime:** Use `loadEvents()` for dynamic data
- **Static:** Export to JSON for build-time generation
- **Search Index:** Generate on build via `build:search-index` script

---

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

---

## Timeline Summary

- **Week 1:** ✅ Documentation setup, cursor rules enhancement, initial audits
- **Week 2:** ✅ AutoFair 2026 page, SEO standardization
- **Week 3-4:** ✅ Design token consistency (migration complete), Performance optimization (active)
- **Month 2:** Advanced features, accessibility (in progress), testing

**Total Estimated Time:** 6-8 weeks (assuming part-time development)

---

## Completed Implementation Work ✅

### G4: AutoFair 2026 Page (G4)
**Status:** ✅ **COMPLETE**

**Completed Tasks:**
- [x] Create `app/events/charlotte-autofair/page.tsx` ✅
- [x] Identify AutoFair event IDs in events.json ✅
  - IDs: 7fb39344-1d13-4c45-882f-82ad90aa9e6c (Thu), 3940ada8-c47a-4c41-b4c0-3a856a703b99 (Fri), be48d403-c249-4453-8453-77baf66e9954 (Sat)
- [x] Copy Charlotte Auto Show page pattern ✅
- [x] Update metadata and structured data ✅
- [x] Add to navigation (Footer and TopNav) ✅
- [x] Add sidebar with skyscraper ad (matches `/events/`) ✅
- [x] Test and verify functionality after deploy ✅

**Files Affected:**
- ✅ New: `app/events/charlotte-autofair/page.tsx`
- ✅ Updated: `components/Footer.tsx` (added link to `/events/charlotte-autofair`)
- ✅ Updated: `components/nav/TopNav.tsx` (added to Charlotte Events dropdown + mobile menu)
- ✅ Added sidebar with AdSlot (matches `/events/` layout)

**Template:** `app/events/charlotte-auto-show/page.tsx`

---

### Auto Show & AutoFair Pages UX/SEO Improvements
**Status:** ✅ **COMPLETE**

**Completed Tasks:**
- [x] Reorganized page layout: Quick Info card → Schedule (primary CTA) → Extended About ✅
- [x] Improved SEO copywriting (removed duplicate content, enhanced unique value props) ✅
- [x] Applied brand guidelines (icons, typography hierarchy matching EventListCard) ✅
- [x] Condensed mobile experience (sidebar ads hidden on mobile) ✅
- [x] Fixed duplicate content between quick info cards and extended about sections ✅

**Files Modified:**
- ✅ `app/events/charlotte-auto-show/page.tsx` (UX reorganization, SEO improvements, brand guidelines)
- ✅ `app/events/charlotte-autofair/page.tsx` (UX reorganization, SEO improvements, brand guidelines)

**Key Improvements:**
- ✅ Better UX: Schedule (primary CTA) appears immediately after condensed info card
- ✅ SEO: No duplicate content, unique copy for each event
- ✅ Brand consistency: Icons, typography, spacing match EventListCard patterns
- ✅ Mobile optimization: Sidebar ads removed on mobile (top/bottom ads already present)

---

### JSON-LD Schema Standardization
**Status:** ✅ **COMPLETE**

**Completed Tasks:**
- [x] Standardized Event schema format across pages (created `lib/eventSchema.ts` helper) ✅
- [x] Enhanced `/events/` page with Event schemas in ItemList ✅
- [x] Added Event schema to weekly list page ✅
- [x] Add BreadcrumbList schema to pages with breadcrumbs ✅
- [x] Add JSON-LD to Search page ✅
- [x] Validate all JSON-LD with Google Rich Results Test ✅

**Files Affected:**
- ✅ Created `lib/eventSchema.ts` (standardized Event schema helper + BreadcrumbList helper)
- ✅ `app/weekly-car-show-list-charlotte/page.tsx` (added Event schema)
- ✅ `app/events/page.tsx` (enhanced existing schema)
- ✅ `app/search/page.tsx` (added BreadcrumbList)
- ✅ All pages with breadcrumbs now have BreadcrumbList schema

**Completion Summary:**
- All 19 page.tsx files reviewed
- 18 pages with JSON-LD (Dashboard is "coming soon" - not needed)
- All event list pages include full Event schemas in ItemList
- All pages with breadcrumbs include BreadcrumbList schema
- Standardized helpers in `lib/eventSchema.ts` ensure consistency

---

### Event Component Standardization & Tailwind Migration
**Status:** ✅ **COMPLETE**

**Summary:**
- Consolidated EventCard into EventListCard (single component standard)
- Migrated all `.ccs-card`, `.ccs-btn`, `.ccs-btn-primary`, `.ccs-badge` to Tailwind utilities
- Removed unused shadcn components (Dialog, DropdownMenu, Button)
- Cleaned up CSS files (`globals.css`, `Weekly.module.css`)

**Completed Tasks:**
- [x] Consolidated EventCard into EventListCard (enhanced EventListCard to handle optional slug, multiple description fields, tags) ✅
- [x] Deleted EventCard components ✅
- [x] Migrated EventListCard from `.ccs-card` to Tailwind utilities ✅
- [x] Migrated EventListCard buttons from `.ccs-btn`/`.ccs-btn-primary` to Tailwind utilities ✅
- [x] Replaced all `.ccs-card` instances in non-component contexts ✅
- [x] Replaced all `.ccs-btn`/`.ccs-btn-primary` instances across all pages and components ✅
- [x] Replaced `.ccs-badge` with Tailwind utilities ✅
- [x] Removed unused shadcn components ✅
- [x] Cleaned up `app/globals.css` (removed `.ccs-*` definitions) ✅
- [x] Cleaned up `components/Weekly.module.css` ✅

**Result:**
- ✅ All `.ccs-card`, `.ccs-btn`, `.ccs-btn-primary`, `.ccs-badge` classes removed from codebase
- ✅ All styling now uses Tailwind utilities directly
- ✅ Single event component standard: `EventListCard` (used everywhere)
- ✅ Cleaner, more maintainable codebase

---

### Weekly Events Page Improvements
**Status:** ✅ **COMPLETE**

**Completed Tasks:**
- [x] Fixed event day ordering to Monday-Sunday (previously Sunday was appearing before Saturday) ✅
- [x] Fixed heading range to show Monday-Sunday correctly (was showing Monday-next Monday) ✅
- [x] Disabled venue links on weekly car show list page ✅
- [x] Disabled venue links on events list pages (`/events/` and `/events/page/[page]/`) ✅
- [x] Added `disableVenueLink` prop to EventListCard component for flexibility ✅

**Files Modified:**
- ✅ `app/weekly-car-show-list-charlotte/page.tsx` (day ordering, heading range, venue links)
- ✅ `app/events/page.tsx` (venue links disabled)
- ✅ `app/events/page/[page]/page.tsx` (venue links disabled)
- ✅ `components/event/EventListCard.tsx` (added `disableVenueLink` prop)

**Result:**
- ✅ Events now display in correct Monday-Sunday order on weekly page
- ✅ Heading range correctly shows Monday through Sunday (e.g., "October 26–November 2")
- ✅ Venue names display as plain text (non-clickable) on list pages for better UX
- ✅ EventListCard component maintains backward compatibility (venue links enabled by default)

---

### Accessibility Improvements (Automated Checks)
**Status:** ✅ **COMPLETE** (Browser audits pending)

**Completed Tasks:**
- [x] Add ARIA labels to interactive elements ✅
  - CalendarButtons: Added aria-labels for "Add to Google" and "Download .ics"
  - EventListCard: Added aria-labels for "View Details" and "Official Site" buttons
  - Pagination links: Added descriptive aria-labels
  - Month separators: Added role="separator" with aria-label for screen readers
  - SearchBox: Added comprehensive ARIA labels for results listbox items
- [x] Ensure keyboard navigation ✅
  - SearchBox: Full keyboard navigation with arrow keys (Up/Down), Enter to select, Escape to close
  - All interactive elements: Focus states visible with `focus:ring-2 focus:ring-brand-500/30`
  - CalendarButtons: Added focus states
- [x] Run accessibility audit (automated checks) ✅
  - Created `Docs/Accessibility_Audit.md` with audit checklist
  - Created `Docs/Accessibility_Audit_Summary.md` for quick reference
  - Created `scripts/accessibility-audit.md` step-by-step guide
  - Created `scripts/check-accessibility.sh` automated check script
  - Fixed empty alt text on event images ✅
  - Fixed form inputs without explicit id/htmlFor associations ✅
  - Fixed links with incomplete rel attributes ✅

**Files Modified:**
- ✅ `components/event/CalendarButtons.tsx` (ARIA labels, focus states)
- ✅ `components/event/EventListCard.tsx` (ARIA labels for action buttons)
- ✅ `components/search/SearchBox.tsx` (ARIA labels, keyboard navigation with arrow keys)
- ✅ `app/events/page.tsx` (month separators, pagination aria-labels)
- ✅ `app/events/page/[page]/page.tsx` (month separators, pagination aria-labels)
- ✅ `app/events/past/page.tsx` (pagination aria-labels)

**Remaining Tasks:**
- [ ] Manual testing and browser-based audits (Lighthouse, axe DevTools) - Scheduled
- [ ] Test with screen readers - Next step (after browser audits)
- [ ] Document accessibility patterns - After audit completion

---

## Recent Changes & Rollbacks

### October 30, 2025 - Venue Slug Normalization Rollback
**Status:** Rolled back to commit `25478d7` ("last push of the night?")

**Action Taken:**
- Recent venue slug normalization work (commits `6f18f30` through `312c98e`) was rolled back
- Changes saved to branch `venue-slug-changes` for future reference
- Main branch restored to stable state before venue slug work began
- Site successfully rebuilt and deployed from rollback commit

**Reason for Rollback:**
- Venue slug normalization changes in `lib/data.ts` were causing build issues on Netlify
- Site was showing 404s on both Netlify subdomain and primary domain
- TypeScript errors in `normalizeEvents` function (venue variable scope issues)
- Rolling back to ensure site stability

**Next Steps:**
- Venue slug work can be revisited later if needed (changes preserved on branch)
- Focus on stable features and existing functionality
- Continue with high-value tasks that don't affect data normalization

---

## Next Steps

1. Continue Stage 1: Foundation & Standardization (documentation, cursor rules)
2. Complete Stage 2: Core Features Enhancement (performance optimization, accessibility browser audits)
3. Set up tracking for progress on each checkbox
4. Schedule regular reviews of high-value pages
