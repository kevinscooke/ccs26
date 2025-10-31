# Bug Tracking & Page Issues - Charlotte Car Shows

## Overview

This document tracks pages and components that need work (CSS, SEO, accessibility, performance, etc.) based on the PRD goals G1 and G2.

## High-Value Pages Status

### Home Page (`app/(marketing)/page.tsx`)
**Status:** ✅ Generally Good
**Issues:**
- [ ] JSON-LD schema: WebSite and Organization present, but Event schema could be added for featured events
- [ ] Featured Events section is commented out (lines 212-241) - may need re-enabling or removal
- [ ] Accessibility: Hero image alt text is good, but button links may need `aria-label` for context
- [ ] Performance: Large hero image (480px min-height) could benefit from lazy loading if below fold

**SEO Status:** ✅ Good
- Metadata complete (title, description, Open Graph, Twitter)
- Canonical URL present
- JSON-LD for Organization and WebSite

**CSS Status:** ✅ Good
- Design tokens used appropriately
- Responsive layout works well

---

### Events Index (`app/events/page.tsx`)
**Status:** ✅ Good
**Issues:**
- [x] JSON-LD ItemList now includes Event schema for each event ✅
- [ ] Search box could have better keyboard navigation labels
- [ ] Month separators are visually good but could use `aria-label` for screen readers
- [ ] Pagination links could use `aria-label` for better accessibility

**SEO Status:** ✅ Good
- Metadata complete
- Canonical URL present
- JSON-LD ItemList with Event schemas (standardized) ✅

**CSS Status:** ✅ Good
- Consistent use of components
- Responsive layout

---

### Weekly List (`app/weekly-car-show-list-charlotte/page.tsx`)
**Status:** ✅ Good
**Issues:**
- [x] JSON-LD schema added with Event schemas embedded in ItemList ✅
- [ ] Empty state message is good but could be more descriptive
- [ ] Week range display could use `aria-label` for screen readers
- [ ] Day separators could use `aria-label`

**SEO Status:** ✅ Good
- Metadata complete
- Canonical URL present
- JSON-LD ItemList with Event schemas added ✅

**CSS Status:** ✅ Good
- Consistent with events index
- Responsive layout

---

### Charlotte Auto Show (`app/events/charlotte-auto-show/page.tsx`)
**Status:** ✅ Excellent (Recent UX/SEO improvements applied)
**Recent Improvements:**
- ✅ UX reorganization: Quick Info → Schedule → Extended About
- ✅ SEO copywriting: Removed duplicate content, enhanced unique value props
- ✅ Brand guidelines: Icons, typography matching EventListCard
- ✅ Mobile optimization: Sidebar ads hidden, better content flow
- ✅ Uses EventListCard component consistently ✅

**SEO Status:** ✅ Excellent
- Metadata complete and optimized
- JSON-LD ItemList with full Event schemas ✅
- BreadcrumbList schema ✅
- No duplicate content ✅

**CSS Status:** ✅ Excellent
- All Tailwind utilities (no `.ccs-*` classes) ✅
- Consistent with brand guidelines ✅
- Responsive layout optimized ✅

---

## CSS & Design Token Issues

### Design Token & Tailwind Migration
**Status:** ✅ Complete (All `.ccs-*` classes migrated to Tailwind)
**Completed:**
- ✅ All `.ccs-card` instances migrated to Tailwind utilities
- ✅ All `.ccs-btn`/`.ccs-btn-primary` instances migrated to Tailwind utilities
- ✅ All `.ccs-badge` instances migrated to Tailwind utilities
- ✅ Removed utility class definitions from `app/globals.css`
- ✅ Removed utility class overrides from `components/Weekly.module.css`

**Current Pattern:**
- **Preferred:** Tailwind utilities with token-mapped colors (`bg-brand-600`, `text-gray-800`)
- **Design Tokens:** Brand colors (brand-*) and neutral grays (gray-*) mapped in Tailwind config
- **Usage:** Tailwind utilities for all components, design tokens via Tailwind config (not CSS custom properties)

---

## SEO Issues

### JSON-LD Schema Implementation
**Status:** ✅ Complete
**Current State:**
- Home page: Organization + WebSite ✅
- Events index: ItemList + BreadcrumbList + Event schemas ✅
- Weekly list: ItemList + BreadcrumbList + Event schemas ✅
- Event detail pages: Event + BreadcrumbList ✅
- Event pagination: ItemList + BreadcrumbList + Event schemas ✅
- Past events: ItemList + BreadcrumbList + Event schemas ✅
- Charlotte Auto Show: ItemList + BreadcrumbList ✅
- Charlotte AutoFair: ItemList + BreadcrumbList ✅
- Venue pages: Place + ItemList + BreadcrumbList ✅
- Guide: Article + BreadcrumbList ✅
- Search: BreadcrumbList ✅
- All marketing/legal pages: BreadcrumbList ✅
- Dashboard: Coming soon page (no JSON-LD needed) ✅

**Completed:**
- [x] Added Event schema to weekly list ✅
- [x] Standardized Event schema format across pages (via `lib/eventSchema.ts`) ✅
- [x] Added BreadcrumbList schema to all pages with breadcrumbs ✅
- [x] Enhanced all event list pages with Event schemas in ItemList ✅

### Metadata Completeness
**Status:** ✅ Generally Good
**Minor Issues:**
- [ ] Some pages may benefit from additional Open Graph images
- [ ] Twitter card images could be standardized

### Canonical URLs
**Status:** ✅ Good
- All pages have canonical URLs
- Use absolute URLs correctly

---

## Accessibility Issues

### ARIA Labels
**Issue:** Some interactive elements lack proper ARIA labels
**Affected Areas:**
- [ ] Search boxes could have better labels
- [ ] Button links (with `<a>` inside `<Button>`) may need `aria-label`
- [ ] Month/day separators could use `aria-label` for screen readers
- [ ] Ad slots could have better labels (if needed)

### Keyboard Navigation
**Status:** ✅ Generally Good
**Minor Issues:**
- [ ] Focus states are defined but could be tested more thoroughly
- [ ] Skip links may be beneficial for main content

### Color Contrast
**Status:** ✅ Good
- Primary text (`--fg`) on background (`--bg`) has high contrast
- Secondary text with opacity maintains readability

---

## Performance Issues

### Image Optimization
**Status:** ✅ Good (uses Next.js Image component)
**Potential Improvements:**
- [ ] Hero image on home page is large - consider responsive sizing
- [ ] Event images (if added) should use Next.js Image component
- [ ] Consider lazy loading for below-fold images

### Bundle Size
**Status:** ✅ Generally Good
**Potential Improvements:**
- [ ] Audit bundle size (run `pnpm build` and check)
- [ ] Consider code splitting for client components
- [ ] Review dynamic imports (AdSlot is already dynamic ✅)

### Core Web Vitals
**Status:** ⚠️ Needs Testing
**Recommendation:**
- [ ] Run Lighthouse audit on high-value pages
- [ ] Test LCP (Largest Contentful Paint)
- [ ] Test CLS (Cumulative Layout Shift)
- [ ] Test FID (First Input Delay) / INP (Interaction to Next Paint)

---

## Component Issues

### Component Reuse
**Issue:** Some duplicate components (`EventCard` vs `EventListCard`)
**Files:**
- `components/EventCard.tsx` (used by series pages)
- `components/event/EventListCard.tsx` (used by list pages)

**Recommendation:**
- [ ] Consider consolidating or document usage patterns
- [ ] Ensure consistent props interface

### Client Component Patterns
**Status:** ✅ Good
- AdSlot uses dynamic import with `ssr: false` ✅
- Client components properly marked with `'use client'`

---

## Priority Issues Summary

### High Priority
1. **JSON-LD Schema:** Add Event schema to weekly list
2. **Accessibility:** Add ARIA labels to interactive elements
3. **Performance:** Run Lighthouse audit and address issues

### Medium Priority
4. **Design Token Consistency:** Standardize usage patterns
5. **Component Patterns:** Document and standardize component usage
6. **SEO Enhancement:** Add BreadcrumbList schema

### Low Priority
7. **Featured Events:** Decide on home page Featured Events section
8. **Component Consolidation:** Consider EventCard vs EventListCard consolidation
9. **Bundle Size:** Audit and optimize if needed

---

## Testing Recommendations

### Automated Testing
- [ ] Set up Lighthouse CI for performance monitoring
- [ ] Add accessibility testing (axe-core)
- [ ] Add SEO testing (structured data validation)

### Manual Testing
- [ ] Test keyboard navigation on all pages
- [ ] Test with screen reader (VoiceOver, NVDA)
- [ ] Test on mobile devices (iOS, Android)
- [ ] Test on various screen sizes

---

## Tracking Status

**Last Updated:** [Date of last update]
**Next Review:** [Date for next review]

**Pages Reviewed:**
- ✅ Home (`app/(marketing)/page.tsx`)
- ✅ Events Index (`app/events/page.tsx`)
- ✅ Weekly List (`app/weekly-car-show-list-charlotte/page.tsx`)
- ✅ Charlotte Auto Show (`app/events/charlotte-auto-show/page.tsx`) - Recent UX/SEO improvements ✅
- ✅ Charlotte AutoFair (`app/events/charlotte-autofair/page.tsx`) - Recent UX/SEO improvements ✅

**Next Pages to Review:**
- [x] Event Detail (`app/events/[slug]/page.tsx`) ✅
- [x] Venue Detail (`app/venue/[slug]/page.tsx`) ✅
- [x] Search (`app/search/page.tsx`) ✅ (Added BreadcrumbList JSON-LD, metadata, Container, Breadcrumbs)
- [x] Contact (`app/contact/page.tsx`) ✅
- [x] Submit Event (`app/submit-event/page.tsx`) ✅
- [x] Daily (`app/daily/page.tsx`) ✅ (Removed - redirects to /events/)
- [x] Dashboard (`app/dashboard/page.tsx`) ✅ (Coming soon page - no JSON-LD needed)

