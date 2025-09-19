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
    <section className="max-w-5xl mx-auto px-4 space-y-8">
      {/* JSON-LD in body is fine with the App Router */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />

      <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--fg)]" 
            style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}>
          All Charlotte Car Shows
        </h1>
        <p className="text-xl text-[var(--fg)]/70 max-w-2xl mx-auto">
          Browse upcoming Cars &amp; Coffee, meets, cruise-ins, and automotive events across the Charlotte area.
        </p>
      </header>

      <div className="space-y-6">
        {events.map((e) => {
          const when = tfmt.format(new Date(e.startAt));
          const venueLine = e.venue
            ? [e.venue.name, [e.venue.city, e.venue.state].filter(Boolean).join(", ")].filter(Boolean).join(" • ")
            : e.city?.name || "";

          return (
            <article key={e.id} className="ccs-card group transition-all hover:shadow-lg hover:scale-[1.01]">
              <div className="flex items-start justify-between gap-6">
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
                    <p className="text-sm md:text-base text-[var(--fg)]/70 leading-relaxed">
                      {truncate(e.description)}
                    </p>
                  )}
                </div>

                <div className="shrink-0 flex flex-col gap-3">
                  <Link 
                    className="ccs-btn-primary px-5 py-2.5 group-hover:scale-105 transition-transform" 
                    href={`/events/${e.slug}`}
                  >
                    View Details
                  </Link>
                  {e.url && (
                    <a 
                      className="ccs-btn px-5 py-2.5" 
                      href={e.url} 
                      target="_blank" 
                      rel="noreferrer"
                    >
                      Official Site
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}

        {!events.length && (
          <div className="ccs-card text-center py-12">
            <p className="text-lg text-[var(--fg)]/70">No upcoming events yet—check back soon.</p>
          </div>
        )}
      </div>
    </section>
  );
}
