# Accessibility Audit - Charlotte Car Shows

**Date:** Current  
**Target:** WCAG 2.1 AA Compliance  
**Status:** In Progress

## Audit Tools

### Recommended Tools
1. **Lighthouse** (Chrome DevTools)
   - Run: Chrome DevTools → Lighthouse → Accessibility tab
   - Target: 90+ score

2. **axe DevTools** (Browser Extension)
   - Install: [axe DevTools Extension](https://www.deque.com/axe/devtools/)
   - Run: Browser extension → Scan page

3. **WAVE** (Web Accessibility Evaluation Tool)
   - Online: https://wave.webaim.org/
   - Browser extension available

4. **Manual Testing**
   - Keyboard navigation (Tab, Enter, Escape, Arrow keys)
   - Screen reader testing (NVDA, JAWS, VoiceOver)

## Common Issues Checklist

### Images
- [ ] All images have descriptive `alt` text
- [ ] Decorative images use `alt=""` or `aria-hidden="true"`
- [ ] Images with text include the text in alt attribute
- [ ] Background images with meaning have text alternatives

### Headings
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] One h1 per page
- [ ] Headings don't skip levels
- [ ] Heading text is descriptive

### Links & Buttons
- [ ] All links have descriptive text
- [ ] Links that open in new tab have `rel="noopener noreferrer"`
- [ ] Button elements have accessible names
- [ ] Icon-only buttons have aria-labels
- [ ] Links are keyboard accessible

### Forms
- [ ] All form inputs have labels
- [ ] Labels are properly associated with inputs (`htmlFor`/`id`)
- [ ] Required fields are marked
- [ ] Error messages are accessible
- [ ] Form validation is announced

### Color & Contrast
- [ ] Text meets WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
- [ ] Color is not the only means of conveying information
- [ ] Focus indicators are visible
- [ ] Links are distinguishable from regular text

### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus order matches visual order
- [ ] Keyboard shortcuts don't conflict with screen readers
- [ ] Skip links available for main content

### ARIA
- [ ] ARIA labels used appropriately
- [ ] ARIA roles used correctly
- [ ] ARIA live regions for dynamic content
- [ ] No redundant ARIA attributes

### Semantic HTML
- [ ] Proper use of semantic elements (`<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>`)
- [ ] Lists use proper list elements (`<ul>`, `<ol>`, `<li>`)
- [ ] Tables use proper table markup
- [ ] Landmarks used correctly

## Issues Found

### Critical (P0)
None identified.

### High Priority (P1)
- [x] **Empty alt text on event images** - `app/events/[slug]/page.tsx` line 320: `<Image alt="" />` - ✅ **FIXED**: Added descriptive alt text based on event title
- [x] **Form inputs without explicit id/htmlFor** - `app/contact/page.tsx` and `app/submit-event/page.tsx` - ✅ **FIXED**: Added htmlFor attributes and input ids for proper label association

### Medium Priority (P2)
- [x] **Links with target="_blank" using rel="noreferrer" instead of "noopener noreferrer"** - `components/event/EventListCard.tsx` - ✅ **FIXED**: Changed to `rel="noopener noreferrer"` for better security
- [ ] **Skip link** - Consider adding skip-to-main-content link
- [ ] **Heading hierarchy** - Review all pages for proper h1-h6 hierarchy (automated check found 23 h1, 45 h2, 24 h3 - verify one h1 per page)

### Low Priority (P3)
- [ ] **Ad slots** - Verify ad slots have appropriate ARIA labels (already have `aria-label="Advertisement"`)
- [ ] **Form on pricing page** - PayPal form has `target="_blank"` on form element (acceptable for payment forms)
- [ ] **Buttons without visible text** - Manual review needed: 4 buttons flagged (likely have visible text, verify)
- [ ] **Color contrast** - Run contrast checker on all text combinations

## Testing Checklist

### Keyboard Testing
- [ ] Navigate entire page with Tab key
- [ ] All interactive elements receive focus
- [ ] Focus indicators are visible
- [ ] Dropdown menus are keyboard accessible
- [ ] Search box keyboard navigation works (Arrow keys, Enter, Escape)
- [ ] Modal dialogs (if any) are keyboard accessible

### Screen Reader Testing
- [ ] Page title announced correctly
- [ ] Headings announced correctly
- [ ] Links announced with context
- [ ] Images announced with alt text
- [ ] Form labels announced
- [ ] Dynamic content announced (search results, etc.)

### Color Contrast Testing
- [ ] Run contrast checker on all text
- [ ] Check focus indicators
- [ ] Verify color isn't only means of conveying info

## Remediation Plan

### Immediate Fixes
1. Fix empty alt text on event images
2. Add descriptive alt text where missing
3. Verify all interactive elements have accessible names

### Short-term Improvements
1. Add skip link to main content
2. Review and fix heading hierarchy
3. Test with screen readers
4. Run full Lighthouse audit on all pages

### Long-term Enhancements
1. Continuous monitoring with Lighthouse CI
2. Automated accessibility testing in CI/CD
3. User testing with assistive technologies
4. Regular accessibility reviews

## Resources
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Lighthouse Accessibility Audit](https://developer.chrome.com/docs/lighthouse/accessibility/)
- [axe DevTools Documentation](https://www.deque.com/axe/devtools/)

## Automated Check Results ✅

### Script: `scripts/check-accessibility.sh`

**Run Date:** Current  
**Status:** Complete ✅

**Results:**
- ✅ **Images:** No empty alt text found
- ✅ **Links:** No empty links found  
- ✅ **Links with target="_blank":** 5 found - All verified to have `rel` attributes (grep false positive - attributes on different lines)
- ✅ **Focus states:** 50 focus state declarations found
- ✅ **ARIA attributes:** 39 aria-label, 16 role attributes found
- ✅ **Form inputs:** 16 input fields - **FIXED**: Added htmlFor/id associations to all forms
- ⚠️ **Buttons:** 4 flagged - Manual review needed (likely have visible text)
- ⚠️ **Headings:** 23 h1, 45 h2, 24 h3 - Manual review needed for hierarchy

### Issues Fixed ✅
- ✅ Empty alt text on event images - `app/events/[slug]/page.tsx`
- ✅ Form inputs without explicit id/htmlFor associations - `app/contact/page.tsx`, `app/submit-event/page.tsx`
- ✅ Links with incomplete rel attributes - `components/event/EventListCard.tsx` (changed to `rel="noopener noreferrer"`)

### Next Steps (Scheduled for Tomorrow)
- [ ] Run Lighthouse accessibility audit on high-priority pages
- [ ] Install and run axe DevTools browser extension
- [ ] Verify one h1 per page (23 h1 found - check for duplicates)
- [ ] Test all buttons have visible text or aria-label
- [ ] Test keyboard navigation manually
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Check color contrast ratios

## Notes
- ARIA labels and keyboard navigation improvements were completed in previous work
- Focus states are implemented across all interactive elements
- Month separators have proper ARIA labels
- Pagination links have descriptive ARIA labels
- Form inputs now have proper label associations with htmlFor/id

