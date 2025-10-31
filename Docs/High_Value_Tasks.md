# High-Value Tasks Prioritization - Charlotte Car Shows

## Overview

This document identifies prioritized tasks based on PRD goals G1-G4 and analysis of high-value pages. **Active tasks are listed first for quick reference; completed tasks are at the bottom for historical context.**

**Quick Status:**
- ✅ **JSON-LD Schema Implementation** — COMPLETE
- ✅ **AutoFair 2026 Page (G4)** — COMPLETE  
- ✅ **Documentation Structure** — COMPLETE
- ⏳ **Next Priorities:** Accessibility audit, Performance optimization, Design token consistency

---

## Active Tasks (In Priority Order)

### 4. Design Token Consistency
**Priority:** Medium | **Effort:** Medium (6-8 hours) | **Impact:** Maintainability, code quality

**Tasks:**
- [ ] Audit all components for token usage
- [ ] Document preferred pattern (tokens vs Tailwind)
- [ ] Migrate mixed usage to consistent pattern
- [ ] Create migration guide

**Files Affected:**
- All component files using colors/spacing
- `app/globals.css` (verify token definitions)
- `tailwind.config.js` (verify token mapping)

---

### 5. Accessibility Audit & Fixes
**Priority:** Medium | **Effort:** Medium (4-6 hours) | **Impact:** Compliance, usability

**Tasks:**
- [ ] Run accessibility audit (axe-core, Lighthouse)
- [ ] Add ARIA labels to interactive elements
- [ ] Ensure keyboard navigation
- [ ] Test with screen readers
- [ ] Document accessibility patterns

**Files Affected:**
- High-value pages (Home, Events, Weekly, Auto Show)
- Interactive components (SearchBox, Buttons, Navigation)

---

### 6. Performance Optimization
**Priority:** Medium | **Effort:** Medium (4-6 hours) | **Impact:** User experience, SEO

**Tasks:**
- [ ] Run Lighthouse audit on high-value pages
- [ ] Optimize images (verify Next.js Image usage)
- [ ] Review bundle size
- [ ] Implement code splitting where needed
- [ ] Address Core Web Vitals issues

**Files Affected:**
- All high-value pages
- Image components
- Bundle optimization

---

### 7. Component Pattern Documentation
**Priority:** Low | **Effort:** Low (2-3 hours) | **Impact:** Developer experience

**Tasks:**
- [ ] Document component usage patterns
- [ ] Create component examples
- [ ] Standardize prop interfaces
- [ ] Consider EventCard vs EventListCard consolidation

**Files Affected:**
- Component files
- `Docs/UI_UX_doc.md` (update)

---

### 8. Advanced Filtering & Search
**Priority:** Low | **Effort:** High (8-12 hours) | **Impact:** User experience

**Tasks:**
- [ ] Enhance event filtering UI
- [ ] Add date range picker for weekly view
- [ ] Improve search relevance
- [ ] Add event categories/tags UI

**Files Affected:**
- `app/events/page.tsx`
- `app/weekly-car-show-list-charlotte/page.tsx`
- Search components

---

### 9. Testing Infrastructure
**Priority:** Low | **Effort:** High (10-16 hours) | **Impact:** Code quality, maintainability

**Tasks:**
- [ ] Set up testing framework (Jest, React Testing Library)
- [ ] Write tests for critical components
- [ ] Set up E2E testing (Playwright)
- [ ] Add to CI/CD pipeline

**Files Affected:**
- New: `__tests__/` or `tests/` directory
- CI/CD configuration
- Test utilities

---

## Recommended Implementation Order

1. **Week 3-4:**
   - Task 5: Accessibility audit & fixes — Compliance
   - Task 6: Performance optimization — User experience

2. **Week 5-6:**
   - Task 4: Design token consistency — Maintainability
   - Task 7: Component pattern documentation — Developer experience

3. **Month 2:**
   - Task 8: Advanced filtering — User experience enhancement
   - Task 9: Testing infrastructure — Code quality

---

## Success Metrics

### Short-Term (Week 3-4)
- [ ] Lighthouse accessibility score > 90 on all pages
- [ ] Performance scores > 90 on all pages
- [ ] All components use consistent design tokens
- [ ] Accessibility issues resolved

### Medium-Term (Month 2)
- [ ] Component patterns documented
- [ ] Testing infrastructure in place
- [ ] Advanced filtering implemented

---

## Completed Tasks ✅

### 1. Standardize JSON-LD Schema Implementation
**Priority:** High | **Effort:** Low (2-3 hours) | **Impact:** SEO improvement | **Status:** ✅ **COMPLETE**

**Completed Tasks:**
- [x] Add Event schema to weekly list page (`app/weekly-car-show-list-charlotte/page.tsx`) ✅
- [x] Standardize Event schema format across pages (created `lib/eventSchema.ts` helper) ✅
- [x] Enhanced `/events/` page with Event schemas in ItemList ✅
- [x] Add BreadcrumbList schema to pages with breadcrumbs ✅
- [x] Add JSON-LD to Search page ✅
- [x] Validate all JSON-LD with Google Rich Results Test ✅

**Files Affected:**
- [x] `app/weekly-car-show-list-charlotte/page.tsx` ✅
- [x] `app/events/page.tsx` (enhanced existing schema) ✅
- [x] `app/search/page.tsx` (added BreadcrumbList) ✅
- [x] Created `lib/eventSchema.ts` (standardized Event schema helper + BreadcrumbList helper) ✅
- [x] All pages with breadcrumbs now have BreadcrumbList schema ✅

**Completion Summary:**
- All 19 page.tsx files reviewed
- 18 pages with JSON-LD (Dashboard is "coming soon" - not needed)
- All event list pages include full Event schemas in ItemList
- All pages with breadcrumbs include BreadcrumbList schema
- Standardized helpers in `lib/eventSchema.ts` ensure consistency

---

### 2. Create AutoFair 2026 Page (G4)
**Priority:** High | **Effort:** Medium (4-6 hours) | **Impact:** Direct user value, high-traffic event | **Status:** ✅ **COMPLETE**

**Completed Tasks:**
- [x] Create `app/events/charlotte-autofair/page.tsx` ✅
- [x] Identify AutoFair event IDs in `app/data/events.json` ✅
  - IDs: 7fb39344-1d13-4c45-882f-82ad90aa9e6c (Thu), 3940ada8-c47a-4c41-b4c0-3a856a703b99 (Fri), be48d403-c249-4453-8453-77baf66e9954 (Sat)
- [x] Copy Charlotte Auto Show page pattern ✅
- [x] Update metadata and structured data ✅
- [x] Add to navigation (Footer and TopNav) ✅
- [x] Add sidebar with skyscraper ad (matches `/events/`) ✅

**Files Affected:**
- [x] New: `app/events/charlotte-autofair/page.tsx` ✅
- [x] Updated: `components/Footer.tsx` (added link to `/events/charlotte-autofair`) ✅
- [x] Updated: `components/nav/TopNav.tsx` (added to Charlotte Events dropdown + mobile menu) ✅
- [x] Added sidebar with AdSlot (matches `/events/` layout) ✅

**Template:** `app/events/charlotte-auto-show/page.tsx`

---

### 3. Complete Documentation Structure
**Priority:** Medium | **Effort:** Low (already done) | **Impact:** Foundation for all other work | **Status:** ✅ **COMPLETE**

**Completed:**
- [x] `Docs/Implementation.md`
- [x] `Docs/Project_Structure.md`
- [x] `Docs/UI_UX_doc.md`
- [x] `Docs/Bug_Tracking.md`
- [x] `Docs/High_Value_Tasks.md`
- [x] `Docs/Pre_Push_Checklist.md`

---

## Task Summary by Goal

### G1: Analyze High-Value Pages & Standardize Documentation
- ✅ **Completed:** All high-value pages analyzed
- ✅ **Completed:** Documentation structure created
- ⏳ **In Progress:** Standardize patterns (see Task 4, 7)

### G2: Track Pages Needing Work (CSS, SEO, etc.)
- ✅ **Completed:** Pages documented in `Docs/Bug_Tracking.md`
- ✅ **Completed:** JSON-LD implementation complete
- ⏳ **In Progress:** Fix remaining issues (see Tasks 5, 6)

### G3: Determine High-Value Tasks to Prioritize Next
- ✅ **Completed:** This document created with prioritized tasks
- ✅ **Completed:** Tasks prioritized and ordered
- **Next Steps:** Continue with accessibility and performance tasks

### G4: Copy Charlotte Auto Show Page for 2026 AutoFair
- ✅ **Completed:** AutoFair 2026 page created and live
  - Page: `/events/charlotte-autofair`
  - Navigation: Added to Footer and TopNav
  - Layout: Sidebar with skyscraper ad (matches `/events/`)
  - Complete metadata and JSON-LD structured data

---

## Notes

- **Prioritize user-facing features** (accessibility, performance) over technical debt
- **Track progress** in `Docs/Implementation.md` and update checkboxes
- **Update this document** when tasks are completed (move to Completed Tasks section)
- **Keep context at top** for easy understanding of project status
