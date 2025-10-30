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
**Status:** ✅ Good (Template for G4)
**Issues:**
- [ ] JSON-LD ItemList is good, but individual Event schemas could be more detailed
- [ ] Map embed could have better accessibility (title attribute is good)
- [ ] Event cards could use consistent component (EventCard vs EventListCard)
- [ ] Past years section could use pagination if list grows

**SEO Status:** ✅ Good
- Metadata complete
- JSON-LD ItemList for events

**CSS Status:** ✅ Good
- Consistent styling
- Responsive layout

---

## CSS & Design Token Issues

### Mixed Usage Patterns
**Issue:** Some components use design tokens (CSS classes like `.ccs-card`), others use Tailwind directly
**Affected Files:**
- Most pages use mix of both patterns
- Some components prefer Tailwind, others prefer CSS classes

**Recommendation:**
- [ ] Audit all components for consistent token usage
- [ ] Document preferred pattern (design tokens vs Tailwind)
- [ ] Create migration guide for mixed usage

### Design Token Consistency
**Issue:** Design tokens exist but usage is inconsistent
**Current State:**
- Design tokens defined in `app/globals.css`
- Tailwind config maps tokens
- Some components use tokens, others use Tailwind directly

**Recommendation:**
- [ ] Standardize on design tokens for brand colors
- [ ] Use Tailwind utilities for spacing and layout
- [ ] Document preferred patterns

---

## SEO Issues

### JSON-LD Schema Implementation
**Issue:** JSON-LD schema varies across pages
**Current State:**
- Home page: Organization + WebSite ✅
- Events index: ItemList ✅
- Weekly list: Missing schema ⚠️
- Charlotte Auto Show: ItemList ✅

**Recommendation:**
- [ ] Add Event schema to weekly list
- [ ] Add Event schema to featured events on home page
- [ ] Standardize Event schema format across pages
- [ ] Add BreadcrumbList schema to pages with breadcrumbs

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
- ✅ Charlotte Auto Show (`app/events/charlotte-auto-show/page.tsx`)

**Next Pages to Review:**
- [ ] Event Detail (`app/events/[slug]/page.tsx`)
- [ ] Venue Detail (`app/venue/[slug]/page.tsx`)
- [ ] Search (`app/search/page.tsx`)
- [ ] Contact (`app/contact/page.tsx`)
- [ ] Submit Event (`app/submit-event/page.tsx`)

