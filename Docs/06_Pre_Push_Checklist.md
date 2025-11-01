# Pre-Push Checklist — Charlotte Car Shows

Use this checklist before pushing to main/Netlify to ensure code quality, SEO compliance, and deployment readiness.

## Quick Validation

Run this command to check everything:
```bash
pnpm lint && pnpm typecheck && pnpm validate:jsonld
```

## Required Checks ✅

### 1. Code Quality
- [ ] Run `pnpm lint` — no linting errors
- [ ] Run `pnpm typecheck` — no TypeScript errors
- [ ] Fix all warnings (don't ignore unless documented)

### 2. JSON-LD Schema Validation
- [ ] Run `pnpm validate:jsonld` — review all pages with JSON-LD schemas
- [ ] After deploying to Netlify, test URLs with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Verify no schema errors in Google's tool
- [ ] Check that BreadcrumbList schemas are detected
- [ ] Verify Event/ItemList schemas appear correctly

**Pages with JSON-LD to validate:**
- Home (Organization + WebSite)
- Events Index (ItemList + BreadcrumbList)
- Events Pagination (ItemList + BreadcrumbList)
- Past Events (ItemList + BreadcrumbList)
- Event Detail Pages (Event + BreadcrumbList)
- Charlotte Auto Show (ItemList + BreadcrumbList)
- Weekly List (ItemList + BreadcrumbList)
- Venue Pages (Place + ItemList + BreadcrumbList)
- Guide (Article + BreadcrumbList)
- Marketing Pages (BreadcrumbList)
- Legal Pages (BreadcrumbList)

**Quick Test URLs (after Netlify deploy):**
```bash
# Get list of URLs to test
pnpm validate:jsonld

# Then test each URL:
# https://search.google.com/test/rich-results?url=YOUR_URL
```

### 3. Build Verification
- [ ] Run `pnpm build` — build succeeds without errors
- [ ] Check build output for warnings
- [ ] Verify static export generates correctly (`out/` directory)
- [ ] Ensure `public/_redirects` is copied to `out/` (handled by postbuild script)

### 4. Data & Search Index
- [ ] Run `pnpm export:json` — if data changed in Supabase
- [ ] Run `pnpm build:search-index` — if events data changed
- [ ] Commit updated JSON files if data exports changed

### 5. SEO Metadata
- [ ] All pages have complete `Metadata` object:
  - `title` (with site name)
  - `description`
  - `alternates.canonical` (absolute URL)
  - `openGraph` (title, description, url, type, images)
  - `twitter` (card, title, description, images)

### 6. Component Usage
- [ ] All pages use `Container` component
- [ ] Pages with navigation use `Breadcrumbs` component
- [ ] Breadcrumbs have corresponding JSON-LD BreadcrumbList schema
- [ ] Event pages use `EventListCard` or `EventCard` appropriately

### 7. Responsive Design
- [ ] Test on mobile viewport (375px width)
- [ ] Test on tablet viewport (768px width)
- [ ] Test on desktop viewport (1280px width)
- [ ] Verify layout doesn't break at breakpoints

### 8. Accessibility
- [ ] Keyboard navigation works (Tab through interactive elements)
- [ ] Images have `alt` text
- [ ] ARIA labels present where needed (`aria-label`, `aria-current`)
- [ ] Semantic HTML used (nav, main, aside, section, article)

## Optional Checks (Before Major Releases)

### 9. Performance
- [ ] Run Lighthouse audit locally (`pnpm dev`, then Lighthouse in Chrome)
- [ ] Check Core Web Vitals:
  - LCP < 2.5s
  - CLS < 0.1
  - INP < 200ms (if applicable)
- [ ] Verify images use Next.js `Image` component with optimization

### 10. Browser Testing
- [ ] Test in Chrome (latest)
- [ ] Test in Safari (latest)
- [ ] Test in Firefox (latest)
- [ ] Check for console errors

### 11. Netlify Deployment
- [ ] Push to main triggers Netlify build
- [ ] Build completes successfully
- [ ] Preview URL works correctly
- [ ] Production deploy succeeds (if deploying to production)

## Post-Deploy Validation

After pushing to Netlify:

1. **JSON-LD Validation:**
   ```bash
   # Get URLs to test
   pnpm validate:jsonld
   
   # Test each URL with Google Rich Results Test:
   # https://search.google.com/test/rich-results?url=YOUR_URL
   ```

2. **Smoke Testing:**
   - [ ] Home page loads correctly
   - [ ] Events page loads and displays events
   - [ ] Search functionality works
   - [ ] Navigation breadcrumbs work
   - [ ] Links don't 404

3. **SEO Verification:**
   - [ ] Canonical URLs are correct
   - [ ] Open Graph previews work (test with [Open Graph Debugger](https://www.opengraph.xyz/))
   - [ ] JSON-LD schemas validate in Google Rich Results Test

## Troubleshooting

### JSON-LD Validation Fails
- Check that schemas are properly escaped in JSX (`dangerouslySetInnerHTML`)
- Verify `@context` is `https://schema.org`
- Ensure required fields are present for each schema type
- Use `lib/eventSchema.ts` helpers for consistent schemas

### Build Fails
- Check TypeScript errors: `pnpm typecheck`
- Verify all imports resolve correctly
- Check for missing dependencies
- Review Next.js build output for specific errors

### Deployment Fails on Netlify
- Check Netlify build logs for errors
- Verify Node version matches (20.x)
- Ensure environment variables are set in Netlify
- Check build command: `pnpm build`
- Verify publish directory: `out`

## Quick Reference

**Common Commands:**
```bash
# Validate JSON-LD schemas
pnpm validate:jsonld

# Lint code
pnpm lint

# Type check
pnpm typecheck

# Build locally
pnpm build

# Export data from Supabase
pnpm export:json

# Build search index
pnpm build:search-index

# Start dev server
pnpm dev
```

**Test Tools:**
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Open Graph Debugger](https://www.opengraph.xyz/)
- [Schema.org Validator](https://validator.schema.org/)

## Notes

- Always run `pnpm validate:jsonld` before pushing JSON-LD schema changes
- Commit data exports if Supabase data changed
- Test JSON-LD after deploying to Netlify (Google needs live URLs)
- Keep this checklist updated as new validation steps are added

