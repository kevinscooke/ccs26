# Charlotte Car Shows – Dev Notes

Quick start
- Prereqs: Node 18+, pnpm
- Install: pnpm install
- Dev server: pnpm dev (http://localhost:3000)
- Build: pnpm build, Start: pnpm start

Environment
- .env.local must include:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY

Data: export JSON (events.json + venues.json)
- Script: scripts/export-json.mjs (uses Supabase RPC: export_events_extended, export_venues)
- Adds events[].venueslug from venue_id → venues.slug
- Write locations: app/data/*.json (source for pages)

Run export
- pnpm export:json
- Or: node scripts/export-json.mjs
- Verify: app/data/events.json contains "venueslug"

Search index (search.json)
- Keep it small and derived from events.json (title, slug, date, venue text).
- Place in public/search.json for static fetch.
- Tip: regenerate whenever you export events.
+Build search index
+- pnpm build:search-index
+- Output: public/search-index.json

Project structure (high-level)
- app/
  - events/           Pages and routes for events
  - events/[slug]/    Event detail (links venue via events[].venueslug)
  - events/page/[n]/  Pagination
  - events/past/      Past events (same layout as /events/)
- components/
  - event/EventListCard.tsx  Shared list-card for events
  - ads/AdSlot.tsx           Client-only ad slot (dynamic import, ssr: false)
- app/data/
  - events.json, venues.json (exported data)

UI conventions
- Shared event card: components/event/EventListCard
  - Used by /events/, /events/page/[n]/, /events/past/
  - Location always on its own line
  - Buttons: “View Details” (primary), “Official Site” (when valid URL)
- Colors/typography: use Tailwind + tokens (global.css)
  - text-[var(--fg)] with opacity for hierarchy (e.g., /70, /55)
  - font-serif via next/font variable if configured
- Ads: desktop skyscraper uses <AdSlot ssr={false}> in the sidebar

Linking rules
- Venue link on event detail uses events[].venueslug only.
  - href: /venue/${venueslug}/
  - If venueslug is missing, render plain text (no fallbacks, no slugify).
- Don’t link venue inside the list card (keep it text-only there).

Server vs client components (Next.js)
- Pages that export metadata must be server components (no "use client").
- Keep client-only pieces (AdSlot, CalendarButtons, StickyCTA) as dynamic imports with ssr: false.

Common gotchas
- “You are attempting to export metadata from a component marked with use client”:
  - Remove "use client" from the page, or move metadata to the segment’s layout.
- If styling or types in VS Code look “red”:
  - Cmd+Shift+P → “TypeScript: Restart TS server”.
- Location stacking:
  - The card’s meta uses two block rows (date/time, then location) to avoid wrap issues.

Tips & rules
- Don’t remove features. Prefer small, focused changes.
- Commit early/often; write clear messages.
- Discard WIP changes:
  - git reset --hard HEAD
  - git clean -fd (removes untracked files)
  - Restore a single file: git checkout -- path/to/file
- If a page looks different, confirm it imports EventListCard and not an older card.
- Venue 404s? Verify venueslug exists in events.json and your route base is /venue/.

Useful commands
- Start dev: pnpm dev
- Export data: pnpm export:json (or node scripts/export-json.mjs)
- Type-check: pnpm typecheck (if configured)
- Lint: pnpm lint (if configured)

Release checklist
- pnpm export:json (ensures venueslug is up-to-date)
- Rebuild search.json (if used)
- pnpm build → pnpm start smoke test
- Check /events/, /events/past/, /events/page/2/, and an event detail page for:
  - Correct card + buttons
  - Location on its own line
  - Venue link works (via venueslug)
  - Ads rendering on desktop
