# Testing Checklist - Tailwind Migration & Component Standardization

**Date:** Current  
**Scope:** Event component consolidation, `.ccs-*` class removal, Tailwind migration

---

## Critical Pages to Test

### Event List Pages (Using EventListCard)
- [ ] **`/events/`** - Main events list page
  - Verify: EventListCard displays correctly
  - Verify: Pagination buttons styled with Tailwind
  - Verify: Empty states display correctly
  - Verify: Responsive layout (mobile/desktop)
  
- [ ] **`/events/page/2/`** - Paginated events
  - Verify: EventListCard displays correctly
  - Verify: Page number buttons (active state uses `bg-brand-600`)
  - Verify: Previous/Next navigation buttons
  
- [ ] **`/events/past/`** - Past events page
  - Verify: EventListCard displays correctly
  - Verify: Navigation buttons styled correctly
  
- [ ] **`/weekly-car-show-list-charlotte/`** - Weekly events
  - Verify: EventListCard displays correctly
  - Verify: Empty state message styled correctly
  
- [ ] **`/search/`** - Search results
  - Verify: SearchResults component displays EventListCard correctly
  - Verify: Empty states display correctly

### Event Detail Pages
- [ ] **`/events/[slug]/`** - Individual event page
  - Verify: Location section card styled with Tailwind
  - Verify: Event details sidebar card styled with Tailwind
  - Verify: Prev/Next navigation buttons styled correctly

### Series Pages (Now Using EventListCard)
- [ ] **`/events/charlotte-auto-show/`** - Auto Show page
  - Verify: EventListCard displays for all events
  - Verify: About section cards styled with Tailwind
  - Verify: Map sidebar card styled with Tailwind
  - Verify: "Official Site" and "Get Directions" buttons styled correctly
  
- [ ] **`/events/charlotte-autofair/`** - AutoFair page
  - Verify: EventListCard displays for all events
  - Verify: About section cards styled with Tailwind
  - Verify: Map sidebar card styled with Tailwind
  - Verify: Buttons styled correctly

### Venue Pages
- [ ] **`/venue/[slug]/`** - Venue detail page
  - Verify: EventListCard displays for upcoming events
  - Verify: EventListCard displays for past events
  - Verify: Empty state message styled correctly
  - Verify: Location sidebar card styled with Tailwind

### Navigation & UI Components
- [ ] **Home page (`/`)** - Marketing homepage
  - Verify: All feature cards styled with Tailwind
  - Verify: All buttons styled correctly (primary/secondary)
  - Verify: Guide promo section styled correctly
  - Verify: Community section styled correctly
  
- [ ] **TopNav component** - Header navigation
  - Verify: Desktop dropdown buttons styled correctly
  - Verify: Mobile menu buttons styled correctly
  - Verify: Pricing/Contact links styled correctly
  - Verify: Mobile menu toggle button styled correctly

### Marketing & Content Pages
- [ ] **`/resources/`** - Resources page
  - Verify: All resource cards styled with Tailwind
  - Verify: "Visit Website" buttons styled correctly
  
- [ ] **`/pricing/`** - Pricing page
  - Verify: All pricing tier cards styled with Tailwind
  - Verify: Pricing buttons styled correctly (Free vs Featured)
  - Verify: FAQ cards styled correctly
  - Verify: Info section cards styled correctly
  
- [ ] **`/contact/`** - Contact page
  - Verify: Contact form section card styled with Tailwind
  - Verify: "Send Message" button styled correctly
  - Verify: "Submit Your Event" button styled correctly
  - Verify: Ad sidebar card styled correctly
  
- [ ] **`/submit-event/`** - Submit event page
  - Verify: Form container card styled with Tailwind
  - Verify: "Submit Event" button styled correctly
  
- [ ] **`/guide-to-charlotte-car-shows/`** - Guide page
  - Verify: All section cards styled with Tailwind
  - Verify: Mobile ToC card styled correctly
  - Verify: Desktop sidebar ToC card styled correctly

### Error Pages
- [ ] **`/404` or `/not-found`** - Not found page
  - Verify: Buttons styled correctly (primary/secondary)
  - Verify: UpcomingSix component displays correctly
  
- [ ] **Error page** - Error boundary
  - Verify: "Try again" button styled correctly (primary brand button)

### Components
- [ ] **UpcomingSix component** - Home page featured events
  - Verify: Event cards styled with Tailwind
  - Verify: "Details" buttons styled correctly

---

## Visual Regression Checklist

### Button Styles
- [ ] Primary buttons: `bg-brand-600 text-white hover:bg-brand-700` (green)
- [ ] Secondary buttons: `bg-gray-100 text-gray-900 hover:bg-gray-200` (gray)
- [ ] Buttons have consistent padding, rounded corners, font weight
- [ ] Buttons have proper focus states (ring)

### Card Styles
- [ ] All cards: `bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow`
- [ ] Cards have consistent spacing
- [ ] Cards have proper shadows
- [ ] Responsive padding (mobile vs desktop)

### EventListCard Component
- [ ] Displays title, date, time, venue correctly
- [ ] "View Details" button (primary brand button) displays correctly
- [ ] "Official Site" button (secondary gray button) displays when URL available
- [ ] Tags display with Tailwind badge styling
- [ ] Featured event indicator displays correctly
- [ ] Responsive layout (mobile/desktop)
- [ ] Hover effects work correctly

### Empty States
- [ ] Empty state messages styled correctly
- [ ] Consistent with card styling

---

## Responsive Testing

Test all pages on:
- [ ] Mobile viewport (375px)
- [ ] Tablet viewport (768px)
- [ ] Desktop viewport (1024px+)

Verify:
- [ ] Cards maintain proper padding at all breakpoints
- [ ] Buttons are appropriately sized for touch targets
- [ ] Grid layouts work correctly
- [ ] Sidebar ads display correctly

---

## Browser Testing

Test in:
- [ ] Chrome/Edge (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## Functional Testing

### EventListCard
- [ ] Clicking event title navigates to event detail page
- [ ] Clicking venue link navigates to venue page (when available)
- [ ] "View Details" button navigates to event detail page
- [ ] "Official Site" button opens in new tab (when available)
- [ ] Tags display correctly (when available)
- [ ] Featured badge displays for featured events

### Navigation
- [ ] All TopNav links work correctly
- [ ] Mobile menu opens/closes correctly
- [ ] Dropdown menus work correctly
- [ ] All buttons respond to clicks

### Forms
- [ ] Contact form buttons styled correctly
- [ ] Submit event form buttons styled correctly

---

## Performance Check

- [ ] No console errors
- [ ] CSS bundle size hasn't increased significantly
- [ ] Page load times remain fast
- [ ] No layout shifts (CLS)

---

## Notes

**What Changed:**
- All `.ccs-card` instances → Tailwind utilities
- All `.ccs-btn` instances → Tailwind utilities
- All `.ccs-btn-primary` instances → Tailwind utilities
- All `.ccs-badge` instances → Tailwind utilities
- EventCard component → EventListCard component
- Removed shadcn components (Button, Dialog, DropdownMenu)

**Expected Result:**
- Visual appearance should be identical or improved
- All buttons and cards now use Tailwind utilities
- More consistent styling across pages
- Cleaner codebase (no `.ccs-*` utility classes)

**Known Issues:**
- None identified yet (report any issues found during testing)

