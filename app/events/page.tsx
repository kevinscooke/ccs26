// app/events/page.tsx  (All events index - 1 column preserved)
import Link from "next/link";
import type { Metadata } from "next";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 300; // 5 min

export const metadata: Metadata = {
  title: "All Charlotte Car Shows | Charlotte Car Shows",
  description:
    "Browse all upcoming Charlotte-area car shows, Cars & Coffee, meets, cruise-ins, and track nights.",
  alternates: {
    canonical: "https://charlottecarshows.com/events",
  },
  openGraph: {
    type: "website",
    title: "All Charlotte Car Shows",
    description:
      "All upcoming Charlotte-area car shows, Cars & Coffee, meets, cruise-ins, and track nights.",
    url: "https://charlottecarshows.com/events",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Charlotte Car Shows",
    description:
      "All upcoming Charlotte-area car shows, Cars & Coffee, meets, cruise-ins, and track nights.",
  },
};

export default async function EventsAllPage() {
  const prisma = await getPrisma();
  const now = new Date();

  const events = await prisma.event.findMany({
    where: { status: "PUBLISHED", startAt: { gte: now } },
    orderBy: [{ startAt: "asc" }, { title: "asc" }],
    include: { venue: true, city: true },
    take: 500,
  });

  // --- JSON-LD: ItemList of event detail URLs (good for discovery on list pages) ---
  // Keep it reasonable in size; cap at 100 items to avoid huge script tags.
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: events.slice(0, 100).map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://charlottecarshows.com/events/${e.slug}`,
      name: e.title,
    })),
  };

  const tfmt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/New_York",
  });

  const truncate = (s?: string | null, n = 220) =>
    !s ? "" : s.length <= n ? s : s.slice(0, n).replace(/\s+\S*$/, "") + "…";

  return (
    <section className="space-y-6">
      {/* JSON-LD in body is fine with the App Router */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />

      <header className="ccs-card">
        <h1 className="text-3xl font-semibold tracking-tight">All Charlotte Car Shows</h1>
        <p className="mt-2 text-zinc-300">
          Upcoming Cars &amp; Coffee, meets, cruise-ins, and more across the Charlotte area.
        </p>
      </header>

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
                  <h2 className="text-lg font-semibold leading-snug">
                    <Link href={`/events/${e.slug}`} className="hover:underline">
                      {e.title}
                    </Link>
                  </h2>

                  <p className="mt-1 text-sm text-zinc-400">
                    {when}
                    {venueLine ? ` • ${venueLine}` : ""}
                    {e.isFeatured && <span className="ml-2 ccs-badge">Featured</span>}
                  </p>

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
          <div className="ccs-card text-zinc-3 00">No upcoming events yet—check back soon.</div>
        )}
      </div>
    </section>
  );
}
