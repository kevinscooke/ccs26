import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Charlotte Weekly Car Show List | Charlotte Car Shows",
  description:
    "See the complete weekly schedule of Charlotte-area car shows, Cars & Coffee, cruise-ins, and meets. Updated every week with the latest events, venues, and details for car enthusiasts in Charlotte, NC.",
  openGraph: {
    title: "Charlotte Weekly Car Show List",
    description:
      "Discover all upcoming Charlotte car shows, meets, and cruise-ins for this week. Find event times, locations, and details for the Charlotte, NC area.",
    url: "https://charlottecarshows.com/weekly-car-show-list-charlotte",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Charlotte Weekly Car Show List",
    description:
      "See this week's Charlotte car shows, meets, and cruise-ins. Updated weekly for car enthusiasts in Charlotte, NC.",
  },
};
// app/weekly-car-show-list-charlotte/page.tsx
import Link from "next/link";
import GoogleAd from "@/components/ui/GoogleAd";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-static";
export const revalidate = 604800; // 1 week ISR for weekly car show list

/** ---------- ET week helpers (no extra deps) ---------- */
function nowInET() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
  );
}
// Monday (0) .. Sunday (6)
function startOfWeekET(d: Date) {
  const et = nowInET(); // normalize to ET clock for the given date
  et.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
  const day = et.getDay(); // 0..6 (Sun..Sat)
  const diffToMonday = (day + 6) % 7; // Sun=>6, Mon=>0, Tue=>1, ...
  et.setDate(et.getDate() - diffToMonday);
  et.setHours(0, 0, 0, 0);
  return et;
}
function endOfWeekET(d: Date) {
  const start = startOfWeekET(d);
  const end = new Date(start);
  end.setDate(end.getDate() + 7); // exclusive upper bound (next Monday 00:00 ET)
  return end;
}
function addWeeks(d: Date, w: number) {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + w * 7);
  return nd;
}
function formatRangeET(start: Date, endExclusive: Date) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "America/New_York",
  });
  const endShown = new Date(endExclusive);
  endShown.setDate(endShown.getDate() - 1);
  return `${fmt.format(start)} – ${fmt.format(endShown)}`;
}
function truncate(s?: string | null, n = 180) {
  if (!s) return "";
  return s.length <= n ? s : s.slice(0, n).replace(/\s+\S*$/, "") + "…";
}

/** ---------- Config ---------- */
const PAGE_SIZE = 10;

export default async function WeeklyCarShowListPage({
  searchParams,
}: {
  searchParams?: { [k: string]: string | string[] | undefined };
}) {
  const prisma = await getPrisma();

  // week offset from current week; integer (… -1 = last week, 0 = current, 1 = next …)
  const weekOffset = Number(
    Array.isArray(searchParams?.w) ? searchParams!.w[0] : searchParams?.w ?? "0"
  ) || 0;

  // page within the selected week (1-based)
  const page = Math.max(
    1,
    Number(
      Array.isArray(searchParams?.p) ? searchParams!.p[0] : searchParams?.p ?? "1"
    ) || 1
  );

  // Compute ET week range for the requested offset
  const nowEt = nowInET();
  const base = addWeeks(nowEt, weekOffset);
  const weekStartEt = startOfWeekET(base); // Monday 00:00 ET
  const weekEndEt = endOfWeekET(base); // next Monday 00:00 ET (exclusive)

  // Count events in this week (PUBLISHED)
  const where = {
    status: "PUBLISHED" as const,
    startAt: {
      gte: weekStartEt,
      lt: weekEndEt,
    },
  };

  const totalInWeek = await prisma.event.count({ where });

  // Pagination inside the week
  const skip = (page - 1) * PAGE_SIZE;
  const events = await prisma.event.findMany({
    where,
    orderBy: [{ startAt: "asc" }, { title: "asc" }],
    include: { venue: true, city: true },
    skip,
    take: PAGE_SIZE,
  });

  const totalPages = Math.max(1, Math.ceil(totalInWeek / PAGE_SIZE));

  /** Build URLs preserving w/p params for THIS page */
  const urlFor = (w: number, p: number) => {
    const u = new URLSearchParams();
    if (w) u.set("w", String(w));
    if (p > 1) u.set("p", String(p));
    const q = u.toString();
    return q ? `/weekly-car-show-list-charlotte?${q}` : "/weekly-car-show-list-charlotte";
  };

  const headingRange = formatRangeET(weekStartEt, weekEndEt);

  const tfmt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/New_York",
  });

  // JSON-LD for the current week's events as an ItemList
  const weekItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: events.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://charlottecarshows.com/events/${e.slug}`,
      name: e.title,
    })),
  };

  return (
    <section className="space-y-6">
      {/* GoogleAd Top Slot */}
      <GoogleAd slot="1514406406" format="auto" className="mb-8" />
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-sm text-[var(--fg)]/60 mb-2">
        <ol className="flex items-center gap-2 flex-wrap">
          <li><Link href="/" className="hover:underline text-[var(--fg)]">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/events" className="hover:underline text-[var(--fg)]">All Events</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-[var(--fg)]/80">Weekly Charlotte Car Shows</li>
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(weekItemList) }}
      />
      {/* Header + week navigation */}
      <header className="ccs-card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--fg)]" style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}>
              Weekly Charlotte Car Shows
            </h1>
            <p className="mt-1 text-base text-[var(--fg)]/60">
              Week of {headingRange} <span className="text-[var(--fg)]/40">(Mon–Sun, ET)</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link className="ccs-btn" href={urlFor(weekOffset - 1, 1)} aria-label="Previous week">
              ‹ Prev Week
            </Link>
            <Link className="ccs-btn-primary" href={urlFor(0, 1)} aria-label="This week">
              This Week
            </Link>
            <Link className="ccs-btn" href={urlFor(weekOffset + 1, 1)} aria-label="Next week">
              Next Week ›
            </Link>
          </div>
        </div>
      </header>

      {/* List (1 column) */}
      <div className="space-y-4">
        {events.map((e) => {
          const when = tfmt.format(new Date(e.startAt));
          const venueLine = e.venue
            ? [e.venue.name, [e.venue.city, e.venue.state].filter(Boolean).join(", ")].filter(Boolean).join(" • ")
            : e.city?.name || "";

          return (
            <article key={e.id} className="ccs-card group transition-all hover:shadow-lg hover:scale-[1.01]">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6">
                <div className="min-w-0 space-y-3">
                  <div>
                    <div className="flex items-start gap-3 flex-wrap">
                      <h2 className="text-xl font-semibold text-[var(--fg)]">
                        <Link href={`/events/${e.slug}`} className="hover:text-green-600 transition-colors">
                          {e.title}
                        </Link>
                      </h2>
                      {e.isFeatured && (
                        <span className="ccs-badge">Featured</span>
                      )}
                    </div>
                    <div className="mt-2 border-t border-[var(--fg)]/10" />
                    {/* When + venue (stack on mobile) */}
                    <p className="mt-2 pt-2 text-base text-[var(--fg)]/60 flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                      <span className="inline-flex items-center gap-2">
                        <svg className="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="whitespace-nowrap">{when}</span>
                      </span>
                      {venueLine && (
                        <span className="inline-flex items-center gap-2">
                          <span className="hidden md:inline text-[var(--fg)]/40">•</span>
                          <svg className="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{venueLine}</span>
                        </span>
                      )}
                    </p>
                  </div>

                  {e.description && (
                    <p className="text-sm md:text-base text-[var(--fg)]/70 leading-relaxed">{truncate(e.description, 220)}</p>
                  )}
                </div>

                <div className="shrink-0 flex flex-col gap-3 mt-4 md:mt-0 w-full md:w-auto">
                  <Link className="ccs-btn-primary px-5 py-2.5 group-hover:scale-105 transition-transform w-full md:w-auto" href={`/events/${e.slug}`}>
                    View Details
                  </Link>
                  {e.url && (
                    <a className="ccs-btn px-5 py-2.5 w-full md:w-auto" href={e.url} target="_blank" rel="noreferrer">
                      Official Site
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}

        {!events.length && (
          <div className="ccs-card text-[var(--fg)]/70">
            No events in this week. Try the next or previous week.
          </div>
        )}
      </div>

      {/* Page pager (inside current week, only if more than PAGE_SIZE) */}
      {totalPages > 1 && (
        <nav className="ccs-card flex items-center justify-between text-sm">
          <div>
            {page > 1 ? (
              <Link className="ccs-btn" href={urlFor(weekOffset, page - 1)} aria-label="Previous page">
                9 Prev Page
              </Link>
            ) : (
              <span className="text-zinc-600">Start</span>
            )}
          </div>
          <div className="text-zinc-300">
            Page {page} of {totalPages}
          </div>
          <div>
            {page < totalPages ? (
              <Link className="ccs-btn" href={urlFor(weekOffset, page + 1)} aria-label="Next page">
                Next Page a
              </Link>
            ) : (
              <span className="text-zinc-600">End</span>
            )}
          </div>
        </nav>
      )}
      {/* GoogleAd Footer Slot */}
      <GoogleAd slot="1514406406" format="auto" className="mt-8" />
    </section>
  );
}
