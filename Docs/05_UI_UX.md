# UI/UX Documentation - Charlotte Car Shows

## Design System Overview

Charlotte Car Shows uses a light, clean design system with a focus on readability and accessibility. The design emphasizes content over decoration, with a simple color palette and consistent spacing.

## Color Palette

### Brand Colors (Green)
```css
--brand-50:  #f2fbf6;  /* Lightest */
--brand-100: #d9f3e6;
--brand-200: #b2e7cc;
--brand-300: #85d9b0;
--brand-400: #4ecb94;
--brand-500: #22b573;  /* Primary brand color */
--brand-600: #18935c;
--brand-700: #117348;
--brand-800: #0d5737;
--brand-900: #093f28;  /* Darkest */
```

**Usage:**
- Primary actions: `brand-600` / `brand-700` (hover)
- Links: `brand-700`
- Focus states: `brand-500` with opacity

### Neutral Grays
```css
--gray-50:  #f8fafc;  /* Lightest */
--gray-100: #f1f5f9;
--gray-200: #e2e8f0;
--gray-300: #cbd5e1;
--gray-400: #94a3b8;
--gray-500: #64748b;
--gray-600: #475569;
--gray-700: #334155;
--gray-800: #1f2937;  /* Primary text */
--gray-900: #0b1220;  /* Darkest */
```

**Usage:**
- Background: `--bg: #faf9f7` (warm off-white)
- Text: `--fg: #1f2937` (gray-800)
- Borders: `gray-200`, `gray-300`
- Secondary text: `gray-600`, `gray-700` with opacity (`/70`, `/60`)

## Typography

### Font Families

**Headings:** Source Serif 4 (via `--font-heading`)
- Used for: H1, H2, H3, hero text
- Style: Serif, elegant, readable
- Applied: `font-heading` class or `font-family: var(--font-heading)`

**Body:** Inter (via `--font-sans`)
- Used for: Body text, UI elements, buttons
- Style: Sans-serif, modern, highly readable
- Applied: Default or `font-sans` class

### Font Sizes & Hierarchy

```css
/* Headings */
h1: 3xl (30px) → 4xl (36px) → 5xl (48px) [lg breakpoint]
h2: 2xl (24px) → 3xl (30px) → 4xl (36px) [lg breakpoint]
h3: xl (20px) → 2xl (24px)

/* Body */
Base: text-base (16px) → text-[17px] (17px) [lg breakpoint]
Small: text-sm (14px)
Tiny: text-xs (12px)
```

### Line Height & Spacing
- **Body text:** `leading-7` (28px) for readability
- **Headings:** `leading-tight` for compact headings
- **Paragraphs:** `space-y-2` to `space-y-4` between paragraphs

## Spacing System

### Design Token Spacing
```css
--space-1: .375rem;   /* 6px */
--space-2: .625rem;   /* 10px */
--space-3: .875rem;   /* 14px */
--space-4: 1.125rem;  /* 18px */
--space-5: 1.5rem;    /* 24px */
--space-6: 2rem;       /* 32px */
```

### Tailwind Spacing (Preferred)
- Use Tailwind spacing scale: `p-4`, `gap-6`, `space-y-8`
- Common patterns:
  - **Container padding:** `px-4` (mobile) → `px-6` (desktop)
  - **Section spacing:** `space-y-8` → `space-y-10` (lg)
  - **Card padding:** `p-4` → `p-5` (md)

## Border Radius

```css
--radius-sm: .5rem;    /* 8px */
--radius-md: .75rem;   /* 12px */
--radius-lg: 1rem;     /* 16px */
--radius-xl: 1.25rem;  /* 20px - Standard */
--radius-2xl: 1.5rem;  /* 24px */
```

**Usage:**
- **Cards:** `rounded-2xl` (24px)
- **Buttons:** `rounded-xl` (20px) or `rounded-md` (12px)
- **Badges:** `rounded-full`

## Shadows

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,.06);
--shadow-md: 0 6px 16px rgba(0,0,0,.08);  /* Standard */
--shadow-lg: 0 12px 32px rgba(0,0,0,.12);
```

**Usage:**
- **Cards:** `shadow` (default Tailwind, matches `--shadow-md`)
- **Elevated elements:** `shadow-lg`
- **Subtle elements:** `shadow-sm`

## Component Patterns

### Cards

**CSS Class:** `.ccs-card`
```css
.ccs-card {
  @apply bg-white text-zinc-800 border border-zinc-200 rounded-2xl p-4 md:p-5 shadow;
}
```

**Usage:**
- Content cards, feature sections, info boxes
- Consistent padding, border, and shadow

**Variants:**
- Default: White background, gray border
- Interactive: Add hover states for clickable cards

### Buttons

**Primary Button (Green):**
- Default: `bg-brand-600` or `bg-green-600`
- Hover: `bg-brand-700` or `hover:bg-green-700`
- Text: White
- Focus: Ring with brand color

**Secondary Button (Gray):**
- CSS Class: `.ccs-btn`
- Default: `bg-zinc-100` with `border-zinc-200`
- Hover: `bg-zinc-200`
- Text: `text-zinc-800`

**Shadcn Button Component:**
- Use `Button` from `@/components/ui/button`
- Variants: `default` (green), `secondary` (gray), `outline`, `ghost`
- Sizes: `sm`, `default`, `lg`

### Badges

**CSS Class:** `.ccs-badge`
```css
.ccs-badge {
  @apply inline-flex items-center rounded-full
         bg-zinc-100 text-zinc-700
         border border-zinc-200
         px-2.5 py-1 text-xs font-medium;
}
```

**Usage:**
- Tags, labels, status indicators
- Pill-shaped, subtle styling

## Layout Patterns

### Container

**Component:** `Container` from `@/components/Container`
- Max width: `xl: 1120px`, `lg: 960px`
- Padding: `px-4` (responsive)
- Centers content

### Grid Layouts

**Two-Column (Events, Weekly):**
```tsx
<div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
  <main className="lg:col-span-8">
    {/* Main content */}
  </main>
  <aside className="lg:col-span-4 lg:sticky lg:top-24">
    {/* Sidebar */}
  </aside>
</div>
```

**Three-Column (Features):**
```tsx
<div className="grid gap-8 md:grid-cols-3">
  {/* Feature cards */}
</div>
```

### Sticky Sidebars
- **Desktop:** `lg:sticky lg:top-24`
- **Usage:** Ad slots, navigation, filters

## Responsive Design

### Breakpoints (Tailwind Defaults)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Mobile-First Approach
- Default styles are mobile
- Use breakpoint prefixes for larger screens: `md:`, `lg:`, `xl:`
- Example: `text-3xl lg:text-5xl`

### Common Patterns
- **Typography:** Smaller on mobile, larger on desktop
- **Spacing:** Tighter on mobile, more generous on desktop
- **Grids:** Single column on mobile, multi-column on desktop
- **Padding:** Less on mobile (`p-4`), more on desktop (`md:p-5`, `lg:p-6`)

## User Experience Flows

### Home Page Flow
1. **Hero Section:** Large title, value proposition, CTA buttons
2. **Compact Upcoming Events:** Sidebar with next 6 events
3. **Search Box:** Quick search access
4. **Featured Events:** (Currently commented out, can be re-enabled)
5. **Value Props:** Three-column feature grid
6. **Featured Locations:** Two-column info cards
7. **Guide Promo:** Single card CTA
8. **Community Section:** Social links

### Events List Flow
1. **Breadcrumbs:** Navigation context
2. **Header:** Title, description
3. **Search:** Quick search box
4. **Controls:** Weekly controls (List/Week/Day toggle)
5. **Event Cards:** Chronological list with month separators
6. **Pagination:** Previous/Next links
7. **Sidebar:** Ad slot (desktop only)

### Event Detail Flow
1. **Breadcrumbs:** Back to events list
2. **Event Card:** Full event information
3. **Action Buttons:** View Details, Official Site (if available)
4. **Related Content:** Venue info, related events

### Weekly View Flow
1. **Week Range:** Display current week (e.g., "May 12–18")
2. **Day Groups:** Events grouped by day (Sunday–Saturday)
3. **Day Headers:** Visual separators for each day
4. **Event Cards:** Same as list view
5. **Empty State:** Message if no events for week

## Accessibility Standards

### Color Contrast
- **Text on Background:** Minimum WCAG AA (4.5:1)
- **Primary Text:** `--fg: #1f2937` on `--bg: #faf9f7` = High contrast
- **Secondary Text:** Use opacity (`/70`, `/60`) for reduced emphasis

### Focus States
```css
:focus-visible {
  outline: 2px solid var(--brand-500);
  outline-offset: 2px;
}
```
- **Buttons:** Ring with brand color on focus
- **Links:** Underline or color change

### ARIA Labels
- **Navigation:** Use `<nav>` with `aria-label`
- **Breadcrumbs:** `<nav aria-label="Breadcrumb">`
- **Buttons:** Descriptive text or `aria-label`
- **Images:** Always include `alt` text

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Logical tab order
- Skip links for main content (if implemented)

## Component Library

### Event Components

**EventListCard**
- **Location:** `components/event/EventListCard.tsx`
- **Usage:** List views, weekly views
- **Props:** `e` (event object)
- **Features:** Date, title, venue, location, actions

**EventCard**
- **Location:** `components/EventCard.tsx`
- **Usage:** Detail pages, series pages
- **Props:** `e` (event object)
- **Features:** Full event details

**CompactUpcomingEvents**
- **Location:** `components/event/CompactUpcomingEvents.tsx`
- **Usage:** Home page sidebar
- **Features:** Next 6 events, compact display

### Navigation Components

**TopNav**
- **Location:** `components/nav/TopNav.tsx`
- **Usage:** Site-wide navigation
- **Features:** Links, mobile menu (if implemented)

**Breadcrumbs**
- **Location:** `components/Breadcrumbs.tsx`
- **Usage:** Page navigation context
- **Props:** `items` (array of `{label, href, current?}`)

### Search Components

**SearchBox**
- **Location:** `components/search/SearchBox.tsx`
- **Usage:** Home page, events pages
- **Features:** Quick search input, integrated with SearchProvider

**SearchProvider**
- **Location:** `components/search/SearchProvider.tsx`
- **Usage:** Root layout (wraps app)
- **Features:** Search context, index loading

## Design Guidelines

### Content Hierarchy
1. **Primary:** H1, hero text, main CTAs
2. **Secondary:** H2, section headers, feature descriptions
3. **Tertiary:** H3, card titles, metadata
4. **Body:** Paragraph text, descriptions
5. **Meta:** Small text, timestamps, tags

### Visual Hierarchy
- **Size:** Larger = more important
- **Color:** Darker = more important (text)
- **Spacing:** More space = more emphasis
- **Weight:** Bold for headings and emphasis

### Consistency Rules
- **Cards:** Always use `.ccs-card` or consistent padding/border
- **Buttons:** Use `Button` component or `.ccs-btn` / `.ccs-btn-primary`
- **Spacing:** Use Tailwind spacing scale consistently
- **Typography:** Use heading classes, not arbitrary sizes

## Responsive Images

### Next.js Image Component
```tsx
<Image
  src="/images/hero-ccs.jpg"
  alt="Descriptive text"
  fill
  priority
  loading="eager"
  className="object-cover"
  sizes="(min-width: 1280px) 45vw, (min-width: 1024px) 55vw, 100vw"
/>
```

**Guidelines:**
- Always include `alt` text
- Use `priority` for above-the-fold images
- Use `fill` with `object-cover` for hero images
- Specify `sizes` for responsive loading

## Current Design State

### Strengths
- Clean, readable design
- Consistent spacing and typography
- Good use of design tokens
- Responsive layouts

### Areas for Improvement
- **Mixed Patterns:** Some components use CSS classes, others use Tailwind directly
- **Token Consistency:** Need to standardize usage of design tokens vs. Tailwind
- **Component Reuse:** Some duplicate components (EventCard vs EventListCard)
- **Accessibility:** Needs full audit and improvements

### Planned Enhancements
- Standardize component patterns
- Complete accessibility audit
- Improve mobile experience
- Add dark mode support (future consideration)

