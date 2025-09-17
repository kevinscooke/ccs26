# CharlotteCarShows (Next.js + Prisma + Netlify)

Lean starter for v4:
- Next.js App Router (SSR/SSG/ISR)
- Prisma + Postgres
- Netlify (plugin-nextjs, scheduled function)
- Minimal events schema + ISR tagging

## Quick start

```bash
pnpm i
cp .env.example .env
# Fill DATABASE_URL with your Neon/Supabase connection string
pnpm prisma:generate
pnpm prisma:migrate
pnpm seed
pnpm dev
```

Visit http://localhost:3000

## Import legacy events
Prepare `events.csv` with headers:
`citySlug,title,slug,description,startAt,endAt,url,isFeatured`

```bash
pnpm import:csv events.csv
```

## Deploy to Netlify
- Push to GitHub
- New site → pick repo
- Build command: `pnpm build`
- Publish dir: `.next`
- Add env vars (DATABASE_URL, NEXT_PUBLIC_SITE_URL, etc.)

## Cost-savvy defaults
- ISR list pages: 10 min
- Detail pages: 24h
- Revalidate on publish/feature via `/api/revalidate`
- One scheduled weekly digest function
- Keep API routes minimal (submission, webhook, revalidate)
