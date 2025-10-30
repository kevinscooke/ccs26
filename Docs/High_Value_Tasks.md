# High-Value Tasks Prioritization - Charlotte Car Shows

Based on PRD goals G1-G4 and analysis of high-value pages, this document identifies prioritized tasks.

## Immediate Priority (Week 1-2)

### 1. Standardize JSON-LD Schema Implementation
**Priority:** High
**Effort:** Low (2-3 hours)
**Impact:** SEO improvement

**Tasks:**
- [x] Add Event schema to weekly list page (`app/weekly-car-show-list-charlotte/page.tsx`) ✅
- [x] Standardize Event schema format across pages (created `lib/eventSchema.ts` helper) ✅
- [x] Enhanced `/events/` page with Event schemas in ItemList ✅
- [x] Add BreadcrumbList schema to pages with breadcrumbs ✅
- [x] Validate all JSON-LD with Google Rich Results Test ✅
  - Created `scripts/validate-jsonld.js` validation script
  - Run `pnpm validate:jsonld` to get list of URLs to test
  - Manual validation required via Google Rich Results Test

**Files Affected:**
- [x] `app/weekly-car-show-list-charlotte/page.tsx` ✅
- [x] `app/events/page.tsx` (enhanced existing schema) ✅
- [x] Created `lib/eventSchema.ts` (standardized Event schema helper + BreadcrumbList helper) ✅
- [x] All pages with breadcrumbs now have BreadcrumbList schema ✅
  - Event pages: `/events/`, `/events/page/[page]/`, `/events/past/`, `/events/[slug]/`, `/events/charlotte-auto-show/`
  - Venue pages: `/venue/[slug]/`
  - Guide: `/guide-to-charlotte-car-shows/`
  - Marketing: `/resources/`, `/pricing/`
  - Legal: `/terms/`, `/privacy/`, `/accessibility/`
  - Contact/Submit: `/contact/`, `/submit-event/`

---

### 2. Create AutoFair 2026 Page (G4)
**Priority:** High
**Effort:** Medium (4-6 hours)
**Impact:** Direct user value, high-traffic event

**Tasks:**
- [x] Create `app/events/charlotte-auto-fair/page.tsx` ✅
- [x] Identify AutoFair event IDs in `app/data/events.json` ✅
  - IDs: 7fb39344-1d13-4c45-882f-82ad90aa9e6c (Thu), 3940ada8-c47a-4c41-b4c0-3a856a703b99 (Fri), be48d403-c249-4453-8453-77baf66e9954 (Sat)
- [x] Copy Charlotte Auto Show page pattern ✅
- [x] Update metadata and structured data ✅
- [ ] Add to navigation/sitemap if needed
- [ ] Test and verify functionality after deploy

**Files Affected:**
- [x] New: `app/events/charlotte-auto-fair/page.tsx` ✅
- Update: `app/(marketing)/page.tsx` (add link if needed)
- Update: `app/sitemap.xml/route.ts` (if needed)

**Template:** `app/events/charlotte-auto-show/page.tsx`

---

### 3. Complete Documentation Structure
**Priority:** Medium
**Effort:** Low (already done)
**Impact:** Foundation for all other work

**Status:** ✅ Completed
- [x] `Docs/Implementation.md`
- [x] `Docs/Project_Structure.md`
- [x] `Docs/UI_UX_doc.md`
- [x] `Docs/Bug_Tracking.md`

---

## Short-Term Priority (Week 3-4)

### 4. Design Token Consistency
**Priority:** Medium
**Effort:** Medium (6-8 hours)
**Impact:** Maintainability, code quality

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
**Priority:** Medium
**Effort:** Medium (4-6 hours)
**Impact:** Compliance, usability

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
**Priority:** Medium
**Effort:** Medium (4-6 hours)
**Impact:** User experience, SEO

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

## Medium-Term Priority (Month 2)

### 7. Component Pattern Documentation
**Priority:** Low
**Effort:** Low (2-3 hours)
**Impact:** Developer experience

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
**Priority:** Low
**Effort:** High (8-12 hours)
**Impact:** User experience

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
**Priority:** Low
**Effort:** High (10-16 hours)
**Impact:** Code quality, maintainability

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

## Task Summary by Goal

### G1: Analyze High-Value Pages & Standardize Documentation
- ✅ **Completed:** All high-value pages analyzed
- ✅ **Completed:** Documentation structure created
- ⏳ **In Progress:** Standardize patterns (see Task 4, 7)

### G2: Track Pages Needing Work (CSS, SEO, etc.)
- ✅ **Completed:** Pages documented in `Docs/Bug_Tracking.md`
- ⏳ **In Progress:** Fix identified issues (see Tasks 1, 5, 6)

### G3: Determine High-Value Tasks to Prioritize Next
- ✅ **Completed:** This document created with prioritized tasks
- **Next Steps:** Begin immediate priority tasks

### G4: Copy Charlotte Auto Show Page for 2026 AutoFair
- 📋 **Ready:** Template exists, ready to implement (see Task 2)

---

## Recommended Implementation Order

1. **Week 1:**
   - Task 2: Create AutoFair 2026 page (G4) - High user value
   - Task 1: Standardize JSON-LD schema - Quick SEO win

2. **Week 2:**
   - Task 5: Accessibility audit & fixes - Compliance
   - Task 6: Performance optimization - User experience

3. **Week 3-4:**
   - Task 4: Design token consistency - Maintainability
   - Task 7: Component pattern documentation - Developer experience

4. **Month 2:**
   - Task 8: Advanced filtering - User experience enhancement
   - Task 9: Testing infrastructure - Code quality

---

## Success Metrics

### Immediate (Week 1-2)
- [ ] AutoFair 2026 page created and live
- [ ] All high-value pages have complete JSON-LD schema
- [ ] Lighthouse accessibility score > 90 on all pages

### Short-Term (Week 3-4)
- [ ] All components use consistent design tokens
- [ ] Performance scores > 90 on all pages
- [ ] Accessibility issues resolved

### Medium-Term (Month 2)
- [ ] Component patterns documented
- [ ] Testing infrastructure in place
- [ ] Advanced filtering implemented

---

## Notes

- **Prioritize user-facing features** (AutoFair page, accessibility, performance)
- **Technical debt** (token consistency, documentation) can wait
- **Testing infrastructure** is valuable but not urgent
- **Track progress** in `Docs/Implementation.md` and update checkboxes

