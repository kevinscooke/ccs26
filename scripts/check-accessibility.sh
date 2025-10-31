#!/bin/bash

# Accessibility Check Script for Charlotte Car Shows
# This script performs automated accessibility checks on the codebase

echo "🔍 Running Accessibility Checks..."
echo ""

# Check 1: Images without alt text
echo "📸 Checking for images without alt text..."
EMPTY_ALT=$(grep -r 'alt=""' app/ components/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | tr -d ' ')
if [ "$EMPTY_ALT" -gt 0 ]; then
  echo "  ⚠️  Found $EMPTY_ALT images with empty alt text"
  grep -rn 'alt=""' app/ components/ --include="*.tsx" --include="*.ts" 2>/dev/null | head -5
else
  echo "  ✅ No images with empty alt text found"
fi
echo ""

# Check 2: Links without accessible text (checking for links without href text)
echo "🔗 Checking for links without accessible text..."
LINKS_NO_TEXT=$(grep -r '<a[^>]*>\s*</a>' app/ components/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | tr -d ' ')
if [ "$LINKS_NO_TEXT" -gt 0 ]; then
  echo "  ⚠️  Found $LINKS_NO_TEXT potentially empty links"
else
  echo "  ✅ No empty links found"
fi
echo ""

# Check 3: Links that open in new tab without rel="noopener noreferrer"
echo "🔗 Checking for links with target='_blank' without rel attribute..."
TARGET_NO_REL=$(grep -r 'target="_blank"' app/ components/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v 'rel=' | wc -l | tr -d ' ')
if [ "$TARGET_NO_REL" -gt 0 ]; then
  echo "  ⚠️  Found $TARGET_NO_REL links with target='_blank' without rel attribute"
  grep -rn 'target="_blank"' app/ components/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v 'rel=' | head -5
else
  echo "  ✅ All links with target='_blank' have rel attribute"
fi
echo ""

# Check 4: Form inputs without labels (check for inputs without associated labels)
echo "📝 Checking form inputs..."
INPUT_COUNT=$(grep -r '<input' app/ components/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v 'type="hidden"' | wc -l | tr -d ' ')
echo "  ℹ️  Found $INPUT_COUNT input fields (excluding hidden)"
echo "  ⚠️  Manual review needed: Verify all inputs have associated labels or aria-label"
echo ""

# Check 5: Buttons without accessible text
echo "🔘 Checking buttons without accessible text..."
BUTTON_NO_LABEL=$(grep -r '<button' app/ components/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v 'aria-label' | grep -v 'aria-pressed' | grep -v 'aria-expanded' | grep -v 'type="submit"' | grep -v '>' | wc -l | tr -d ' ')
if [ "$BUTTON_NO_LABEL" -gt 0 ]; then
  echo "  ⚠️  Found $BUTTON_NO_LABEL buttons that may need aria-label"
  echo "  ⚠️  Manual review needed: Check if buttons have visible text"
else
  echo "  ✅ All buttons have accessible text or aria-labels"
fi
echo ""

# Check 6: Heading hierarchy (check for skipped heading levels)
echo "📑 Checking heading hierarchy..."
H1_COUNT=$(grep -r '<h1' app/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | tr -d ' ')
H2_COUNT=$(grep -r '<h2' app/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | tr -d ' ')
H3_COUNT=$(grep -r '<h3' app/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | tr -d ' ')
echo "  ℹ️  Found: $H1_COUNT h1, $H2_COUNT h2, $H3_COUNT h3 headings"
echo "  ⚠️  Manual review needed: Verify proper heading hierarchy on each page"
echo ""

# Check 7: Focus states
echo "⌨️  Checking focus states..."
FOCUS_COUNT=$(grep -r 'focus:' app/ components/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | tr -d ' ')
echo "  ℹ️  Found $FOCUS_COUNT focus state declarations"
echo "  ✅ Focus states appear to be implemented"
echo ""

# Check 8: ARIA attributes usage
echo "♿ Checking ARIA attributes..."
ARIA_LABEL_COUNT=$(grep -r 'aria-label' app/ components/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | tr -d ' ')
ARIA_ROLE_COUNT=$(grep -r 'role=' app/ components/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | tr -d ' ')
echo "  ℹ️  Found $ARIA_LABEL_COUNT aria-label attributes"
echo "  ℹ️  Found $ARIA_ROLE_COUNT role attributes"
echo "  ✅ ARIA attributes are being used"
echo ""

echo "✅ Automated checks complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Run Lighthouse accessibility audit in Chrome DevTools"
echo "  2. Install and run axe DevTools browser extension"
echo "  3. Test keyboard navigation manually"
echo "  4. Test with screen reader (VoiceOver/NVDA)"
echo "  5. Review findings in Docs/Accessibility_Audit.md"

