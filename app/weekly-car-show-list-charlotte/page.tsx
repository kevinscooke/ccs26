import Link from "next/link";
import { prisma } from "@/lib/db";

/** ---------- ET week helpers (no extra deps) ---------- */
function nowInET() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
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
  // endExclusive is next Monday 00:00; show previous day (Sunday)
  const endShown = new Date(endExclusive);
  endShown.setDate(endShown.getDate() - 1);
  return `${fmt.format(start)} – ${fmt.format(endShown)}`;
}

function truncate(s: string | null | undefined, n = 180) {
  if (!s) return "";
  return s.length <= n ? s : s.slice(0, n).replace(/\s+\S*$/, "") + "…";
}

/** ---------- Config ---------- */
const PAGE_SIZE = 10;

export const revalidate = 300; // 5 min

export default async function EventsPage({
  searchParams,
}: {
  searchParams?: { [k: string]: string | string[] | undefined };
}) {
  // week offset from current week; integer (… -1 = last week, 0 = current, 1 = next …)
  const weekOffset = Number(Array.isArray(searchParams?.w) ? searchParams!.w[0] : searchParams?.w ?? "0") || 0;
  // page within the selected week (1-based)
  const page = Math.max(1, Number(Array.isArray(searchParams?.p) ? searchParams!.p[0] : searchParams?.p ?? "1") || 1);

  // Compute ET week range for the requested offset
  const nowEt = nowInET();
  const base = addWeeks(nowEt, weekOffset);
  const weekStartEt = startOfWeekET(base); // Monday 00:00 ET
  const weekEndEt = endOfWeekET(base);     // next Monday 00:00 ET (exclusive)

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

  /** Build URLs preserving w/p params */
  const urlFor = (w: number, p: number) => {
    const u = new URLSearchParams();
    if (w) u.set("w", String(w));
    if (p > 1) u.set("p", String(p));
    const q = u.toString();
    return q ? `/events?${q}` : "/events";
  };

  const headingRange = formatRangeET(weekStartEt, weekEndEt);

  const tfmt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/New_York",
  });

  return (
    <section className="space-y-6">
      {/* Header + week navigation */}
      <header className="ccs-card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Charlotte Events</h1>
            <p className="mt-1 text-sm text-zinc-400">Week of {headingRange} (Mon–Sun, ET)</p>
          </div>
          <div className="flex items-center gap-2">
            <Link className="ccs-btn" href={urlFor(weekOffset - 1, 1)} aria-label="Previous week">
              ‹ Prev Week
            </Link>
            <Link className="ccs-btn" href="/events" aria-label="Current week">
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
            <article key={e.id} className="ccs-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {/* Clickable title */}
                  <h2 className="text-lg font-semibold leading-snug">
                    <Link href={`/events/${e.slug}`} className="hover:underline">
                      {e.title}
                    </Link>
                  </h2>

                  {/* When + venue */}
                  <p className="mt-1 text-sm text-zinc-400">
                    {when}
                    {venueLine ? ` • ${venueLine}` : ""}
                    {e.isFeatured && <span className="ml-2 ccs-badge">Featured</span>}
                  </p>

                  {/* Description (truncated) */}
                  {e.description && (
                    <p className="mt-3 text-zinc-300">{truncate(e.description, 220)}</p>
                  )}
                </div>

                <div className="shrink-0 flex flex-col gap-2">
                  <Link className="ccs-btn" href={`/events/${e.slug}`}>Details</Link>
                  {e.url && (
                    <a className="ccs-btn" href={e.url} target="_blank" rel="noreferrer">Official</a>
                  )}
                </div>
              </div>
            </article>
          );
        })}

        {!events.length && (
          <div className="ccs-card text-zinc-300">
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
                ‹ Prev Page
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
                Next Page ›
              </Link>
            ) : (
              <span className="text-zinc-600">End</span>
            )}
          </div>
        </nav>
      )}
    </section>
  );
}
