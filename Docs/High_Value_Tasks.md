# High-Value Tasks Prioritization - Charlotte Car Shows

## Overview

This document identifies prioritized tasks based on PRD goals G1-G4 and analysis of high-value pages. **Active tasks are listed first for quick reference; completed tasks are at the bottom for historical context.**

**Quick Status:**
- ✅ **JSON-LD Schema Implementation** — COMPLETE
- ✅ **AutoFair 2026 Page (G4)** — COMPLETE  
- ✅ **Documentation Structure** — COMPLETE
- ✅ **Event Component Standardization & Tailwind Migration** — COMPLETE
- ✅ **Auto Show & AutoFair Pages UX/SEO Improvements** — COMPLETE (Recent)
- ✅ **Venues Index Page** — COMPLETE (Today)
- ✅ **Accessibility Audit (Automated Checks)** — COMPLETE (Today)
  - Automated checks complete, issues fixed, ready for manual testing
- 🔥 **High Priority (G5):** Fix Weekly Events Auto-Update Workflow — Sunday night scheduling issue
- ⏳ **Next Priorities:** Browser-based accessibility audits (tomorrow), Performance optimization

---

## Active Tasks (In Priority Order)

### G5: Fix Weekly Events Auto-Update Workflow
**Priority:** High | **Effort:** Low (1-2 hours) | **Impact:** Operational reliability, user experience

**Problem:**
- Current GitHub workflow runs Monday 04:05 UTC (Monday morning ET)
- Should run Sunday night to prepare for new week
- Not reliably triggering weekly updates
- Better automation approach needed

**Tasks:**
- [ ] Review current workflow (`.github/workflows/update-events-and-deploy.yml`)
- [ ] Update cron schedule to run Sunday night ET (23:00 ET Sunday = Monday 04:00 UTC during DST, 05:00 UTC during EST)
- [ ] Consider alternative approaches:
  - [ ] On-demand rebuilds via webhook from Supabase
  - [ ] Netlify scheduled functions
  - [ ] Manual trigger + better monitoring
- [ ] Add workflow monitoring/alerting for failures
- [ ] Test workflow execution and verify weekly updates
- [ ] Document the automation approach

**Files Affected:**
- `.github/workflows/update-events-and-deploy.yml`
- `scripts/export-json.mjs` (verify it works correctly)
- Consider adding workflow status checks

**Alternative Approaches:**
1. **Webhook from Supabase** - Trigger rebuild when data changes (best for real-time)
2. **Netlify Scheduled Functions** - Run on Netlify's infrastructure (simpler than GitHub Actions)
3. **Improved GitHub Actions** - Better cron timing, error handling, notifications
4. **Hybrid Approach** - Scheduled + on-demand triggers

---

### 4. Standardize Event Components & Migrate to Tailwind
**Priority:** Medium | **Effort:** Medium (6-8 hours) | **Impact:** Maintainability, code quality | **Status:** ✅ **COMPLETE**

**Recommendation:** **EventListCard component IS the standard** (EventCard consolidated into EventListCard)

**Component Usage Pattern:**
- **EventListCard** - Used site-wide: `/events/`, `/events/page/[page]/`, `/events/past/`, `/weekly-car-show-list-charlotte/`, `/search/`, `/events/charlotte-auto-show/`, `/events/charlotte-autofair/`, `/venue/[slug]/` ✅
- **`.ccs-card`** - **REMOVED** - All instances migrated to Tailwind utilities ✅
- **`.ccs-btn`/`.ccs-btn-primary`** - **REMOVED** - All instances migrated to Tailwind utilities ✅

**Completed Tasks:**
- [x] Consolidated EventCard into EventListCard (enhanced EventListCard to handle optional slug, multiple description fields, tags) ✅
- [x] Deleted EventCard components (`components/event/EventCard.tsx`, `components/EventCard.tsx`) ✅
- [x] Migrated EventListCard from `.ccs-card` to Tailwind utilities ✅
- [x] Migrated EventListCard buttons from `.ccs-btn`/`.ccs-btn-primary` to Tailwind utilities ✅
- [x] Replaced all `.ccs-card` instances in non-component contexts (empty states, info cards, pages) ✅
- [x] Replaced all `.ccs-btn`/`.ccs-btn-primary` instances across all pages and components ✅
- [x] Replaced `.ccs-badge` with Tailwind utilities ✅
- [x] Removed unused shadcn components (Dialog, DropdownMenu, Button) ✅
- [x] Cleaned up `app/globals.css` (removed `.ccs-card`, `.ccs-btn`, `.ccs-btn-primary`, `.ccs-badge` definitions) ✅
- [x] Cleaned up `components/Weekly.module.css` (removed `.ccs-card` override) ✅
- [x] Design tokens remain in Tailwind config (brand-*, gray-*) ✅

**Files Modified:**
- ✅ `components/event/EventListCard.tsx` (migrated to Tailwind, enhanced to handle optional cases)
- ✅ All pages using EventCard → replaced with EventListCard
- ✅ All pages using `.ccs-card` → replaced with Tailwind utilities
- ✅ All pages using `.ccs-btn`/`.ccs-btn-primary` → replaced with Tailwind utilities
- ✅ `components/nav/TopNav.tsx` (buttons migrated to Tailwind)
- ✅ `components/event/UpcomingSix.tsx` (card and button migrated to Tailwind)
- ✅ `app/globals.css` (removed utility class definitions)
- ✅ `components/Weekly.module.css` (removed `.ccs-card` override)
- ✅ Deleted: `components/ui/dialog.tsx`, `components/ui/dropdown-menu.tsx`, `components/ui/button.tsx`
- ✅ Deleted: `components/event/EventCard.tsx`, `components/EventCard.tsx`

**Result:**
- ✅ All `.ccs-card`, `.ccs-btn`, `.ccs-btn-primary`, `.ccs-badge` classes removed from codebase
- ✅ All styling now uses Tailwind utilities directly
- ✅ Single event component standard: `EventListCard` (used everywhere)
- ✅ Cleaner, more maintainable codebase

---

### 5. Auto Show & AutoFair Pages UX/SEO Improvements
**Priority:** Medium | **Effort:** Medium (4-5 hours) | **Impact:** User experience, SEO | **Status:** ✅ **COMPLETE**

**Completed Tasks:**
- [x] Reorganized page layout: Quick Info card → Schedule → Extended About ✅
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

### 6. Accessibility Audit & Fixes
**Priority:** Medium | **Effort:** Medium (4-6 hours) | **Impact:** Compliance, usability | **Status:** ✅ **COMPLETE** (Subtasks 2-3: ARIA labels & keyboard navigation)

**Completed Tasks:**
- [x] Add ARIA labels to interactive elements ✅
  - CalendarButtons: Added aria-labels for "Add to Google" and "Download .ics"
  - EventListCard: Added aria-labels for "View Details" and "Official Site" buttons
  - Pagination links: Added descriptive aria-labels (e.g., "Go to page 2", "View previous events")
  - Month separators: Added role="separator" with aria-label for screen readers
  - SearchBox: Added comprehensive ARIA labels for results listbox items
  - TopNav: Already had aria-expanded on mobile menu button ✅
- [x] Ensure keyboard navigation ✅
  - SearchBox: Full keyboard navigation with arrow keys (Up/Down), Enter to select, Escape to close
  - All interactive elements: Focus states visible with `focus:ring-2 focus:ring-brand-500/30`
  - CalendarButtons: Added focus states
  - EventListCard buttons: Already had focus states ✅

**Files Modified:**
- ✅ `components/event/CalendarButtons.tsx` (ARIA labels, focus states)
- ✅ `components/event/EventListCard.tsx` (ARIA labels for action buttons)
- ✅ `components/search/SearchBox.tsx` (ARIA labels, keyboard navigation with arrow keys)
- ✅ `app/events/page.tsx` (month separators, pagination aria-labels)
- ✅ `app/events/page/[page]/page.tsx` (month separators, pagination aria-labels)
- ✅ `app/events/past/page.tsx` (pagination aria-labels)

**Remaining Tasks (In Progress):**
- [x] Run accessibility audit (automated checks) - ✅ **COMPLETE**
  - Created `Docs/Accessibility_Audit.md` with audit checklist
  - Created `Docs/Accessibility_Audit_Summary.md` for quick reference
  - Created `scripts/accessibility-audit.md` step-by-step guide
  - Created `scripts/check-accessibility.sh` automated check script
  - Fixed empty alt text on event images ✅
  - Fixed form inputs without explicit id/htmlFor associations ✅
  - Fixed links with incomplete rel attributes ✅
  - **Next:** Manual testing and browser-based audits (Lighthouse, axe DevTools) - Scheduled for tomorrow
- [ ] Test with screen readers - Next step (after browser audits)
- [ ] Document accessibility patterns - After audit completion

---

### 7. Performance Optimization
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

### 8. Component Pattern Documentation
**Priority:** Low | **Effort:** Low (1-2 hours) | **Impact:** Developer experience

**Tasks:**
- [ ] Document component usage patterns (EventListCard is now the standard)
- [ ] Create component examples
- [ ] Standardize prop interfaces
- [x] EventCard vs EventListCard consolidation ✅ **COMPLETE** (consolidated into EventListCard)

**Files Affected:**
- Component files
- `Docs/UI_UX_doc.md` (update)
- `.cursor/rules/patterns.mdc` (update to reflect EventListCard as standard)

---

### 9. Advanced Filtering & Search
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

### 10. Testing Infrastructure
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

1. **Immediate (Next Sprint):**
   - G5: Fix GitHub workflow for weekly events — Operational reliability
   - Task 6: Accessibility audit & fixes — Compliance
   - Task 7: Performance optimization — User experience

2. **Short-term (Next Month):**
   - Task 8: Component pattern documentation — Developer experience
   - Testing infrastructure setup — Code quality foundation

3. **Medium-term (Month 2+):**
   - Task 9: Advanced filtering — User experience enhancement
   - Advanced features and enhancements

---

## Success Metrics

### Short-Term (Next Sprint)
- [ ] GitHub workflow fixed and tested (G5)
- [ ] Lighthouse accessibility score > 90 on all pages
- [ ] Performance scores > 90 on all pages
- [ ] Accessibility issues resolved

### Medium-Term (Month 2)
- [ ] Component patterns documented
- [ ] Testing infrastructure in place
- [ ] Advanced filtering implemented (if prioritized)

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

### 4. Event Component Standardization & Tailwind Migration
**Priority:** Medium | **Effort:** Medium (6-8 hours) | **Impact:** Maintainability, code quality | **Status:** ✅ **COMPLETE**

**Summary:**
- Consolidated EventCard into EventListCard (single component standard)
- Migrated all `.ccs-card`, `.ccs-btn`, `.ccs-btn-primary`, `.ccs-badge` to Tailwind utilities
- Removed unused shadcn components (Dialog, DropdownMenu, Button)
- Cleaned up CSS files (`globals.css`, `Weekly.module.css`)

**Key Changes:**
- ✅ Enhanced EventListCard to handle optional slug, multiple description fields, tags
- ✅ Replaced all EventCard usages with EventListCard
- ✅ All buttons now use Tailwind utilities (consistent `bg-brand-600` for primary, `bg-gray-100` for secondary)
- ✅ All cards now use Tailwind utilities (`bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow`)
- ✅ Removed 69+ instances of `.ccs-*` utility classes across 25+ files

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
- **Next Steps:** Continue with G5 (workflow fix), accessibility and performance tasks

### G5: Fix GitHub Workflow for Weekly Events Auto-Update
- 🔥 **Active:** Workflow not running reliably on Sunday night
- **Issue:** Current schedule runs Monday morning, should run Sunday night
- **Approach:** Review cron timing, consider better automation (webhooks, Netlify functions)
- **See Task:** G5: Fix Weekly Events Auto-Update Workflow

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
