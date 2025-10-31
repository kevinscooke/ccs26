# Accessibility Audit Guide

## Quick Start

### 1. Run Lighthouse Audit (Recommended First Step)

```bash
# Start dev server
pnpm dev

# In Chrome:
# 1. Open http://localhost:3000
# 2. Open DevTools (F12)
# 3. Go to Lighthouse tab
# 4. Select "Accessibility" category
# 5. Click "Analyze page load"
# 6. Review results and note issues
```

### 2. Install axe DevTools Browser Extension

1. Install from [Chrome Web Store](https://chrome.google.com/webstore/detail/axe-devtools-web-accessibility/lhdoppojpmngadmnindnejefpokejbdd) or [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/axe-devtools/)
2. Open your page
3. Click axe icon in toolbar
4. Click "Scan entire page"
5. Review issues

### 3. Use WAVE Browser Extension

1. Install [WAVE Extension](https://wave.webaim.org/extension/)
2. Navigate to page
3. Click WAVE icon
4. Review errors, alerts, and features

### 4. Manual Keyboard Testing

1. Tab through entire page
2. Check:
   - Can reach all interactive elements?
   - Focus indicators visible?
   - Tab order logical?
   - Enter/Space activate buttons?
   - Escape closes dropdowns/modals?
   - Arrow keys work in lists/search?

### 5. Screen Reader Testing

#### VoiceOver (Mac)
1. Enable: System Preferences → Accessibility → VoiceOver (Cmd+F5)
2. Navigate page with VO commands
3. Check:
   - Page title announced?
   - Headings read correctly?
   - Links have context?
   - Images have alt text?
   - Forms are navigable?

#### NVDA (Windows - Free)
1. Download from [nvaccess.org](https://www.nvaccess.org/)
2. Navigate page
3. Use screen reader commands

## Pages to Test

### High Priority
- [ ] `/` (Home)
- [ ] `/events/` (All events)
- [ ] `/events/[slug]/` (Event detail)
- [ ] `/venue/[slug]/` (Venue detail)
- [ ] `/venues/` (Venues index)
- [ ] `/weekly-car-show-list-charlotte/` (Weekly list)
- [ ] `/search/` (Search results)

### Medium Priority
- [ ] `/events/charlotte-auto-show/` (Auto Show)
- [ ] `/events/charlotte-autofair/` (AutoFair)
- [ ] `/guide-to-charlotte-car-shows/` (Guide)
- [ ] `/resources/` (Resources)
- [ ] `/contact/` (Contact)
- [ ] `/submit-event/` (Submit event)

### Lower Priority
- [ ] `/pricing/` (Pricing)
- [ ] `/terms/` (Terms)
- [ ] `/privacy/` (Privacy)
- [ ] `/accessibility/` (Accessibility page)

## Common Issues to Check

### Images
```bash
# Check for images without alt text
grep -r 'alt=""' app/
grep -r 'alt={' app/ | grep '""'

# Check Next.js Image components
grep -r 'Image' app/ | grep -v 'alt'
```

### Headings
```bash
# Check heading hierarchy
grep -r '<h[1-6]' app/
```

### Links
```bash
# Check for links without accessible text
grep -r '<Link' app/ | grep -v 'aria-label'
grep -r '<a' app/ | grep -v 'aria-label'
```

### Forms
```bash
# Check for inputs without labels
grep -r '<input' app/
grep -r '<textarea' app/
grep -r '<select' app/
```

## Automated Checks

### ESLint with accessibility plugin
```bash
# Install eslint-plugin-jsx-a11y
pnpm add -D eslint-plugin-jsx-a11y

# Add to .eslintrc.json
# Run: pnpm lint
```

### Check color contrast
- Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Or browser DevTools → Elements → Computed → Check contrast

## Reporting Issues

Document findings in `Docs/Accessibility_Audit.md` with:
- Issue description
- Page/component affected
- Severity (P0/P1/P2/P3)
- Steps to reproduce
- Recommended fix
- WCAG criterion violated

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Lighthouse Accessibility Audit](https://developer.chrome.com/docs/lighthouse/accessibility/)
- [axe DevTools Documentation](https://www.deque.com/axe/devtools/)
- [WAVE Documentation](https://wave.webaim.org/)

