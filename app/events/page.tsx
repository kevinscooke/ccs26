import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const revalidate = 300; // 5 min

export const metadata: Metadata = {
  title: "All Charlotte Car Shows | Charlotte Car Shows",
  description:
    "Browse all upcoming Charlotte-area car shows, Cars & Coffee, meets, cruise-ins, and track nights.",
};

export default async function EventsAllPage() {
  // Show all future published events (adjust take/remove if you want server-side pagination later)
  const now = new Date();
  const events = await prisma.event.findMany({
    where: { status: "PUBLISHED", startAt: { gte: now } },
    orderBy: [{ startAt: "asc" }, { title: "asc" }],
    include: { venue: true, city: true },
    take: 500,
  });

  const tfmt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/New_York",
  });

  const truncate = (s?: string | null, n = 220) =>
    !s ? "" : s.length <= n ? s : s.slice(0, n).replace(/\s+\S*$/, "") + "…";

  return (
    <section className="space-y-6">
      <header className="ccs-card">
        <h1 className="text-3xl font-semibold tracking-tight">All Charlotte Car Shows</h1>
        <p className="mt-2 text-zinc-300">
          Upcoming Cars &amp; Coffee, meets, cruise-ins, and more across the Charlotte area.
        </p>
      </header>

      {/* 1-column list */}
      <div className="space-y-4">
        {events.map((e) => {
          const when = tfmt.format(new Date(e.startAt));
          const venueLine = e.venue
            ? [e.venue.name, [e.venue.city, e.venue.state].filter(Boolean).join(", ")].filter(Boolean).join(" • ")
            : e.city?.name || "";

          return (
            <article key={e.id} className="ccs-card transition hover:shadow-lg">
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

                  {/* Description */}
                  {e.description && <p className="mt-3 text-zinc-300">{truncate(e.description)}</p>}
                </div>

                <div className="shrink-0 flex flex-col gap-2">
                  <Link className="ccs-btn" href={`/events/${e.slug}`}>
                    Details
                  </Link>
                  {e.url && (
                    <a className="ccs-btn" href={e.url} target="_blank" rel="noreferrer">
                      Official
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}

        {!events.length && (
          <div className="ccs-card text-zinc-300">No upcoming events yet—check back soon.</div>
        )}
      </div>
    </section>
  );
}
