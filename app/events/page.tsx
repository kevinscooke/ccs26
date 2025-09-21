// app/events/page.tsx  (All events index - 1 column preserved)
import React from "react";
import Link from "next/link";
import GoogleAd from "@/components/ui/GoogleAd";
import type { Metadata } from "next";
import eventsData from "../data/events.json";

// Fully static page

export const metadata: Metadata = {
  title: "All Charlotte Car Shows | Charlotte Car Shows",
  description:
    "Browse all upcoming Charlotte-area car shows, Cars & Coffee, meets, cruise-ins, and track nights.",
  alternates: { canonical: "https://charlottecarshows.com/events" },
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
export default function EventsAllPage() {
  const now = new Date();
  type EventType = typeof eventsData[number];
  const events = (eventsData as EventType[])
    .filter((e: EventType) => e.status === "PUBLISHED" && new Date(e.startAt) >= now)
    .sort((a: EventType, b: EventType) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime() || a.title.localeCompare(b.title));

  // --- JSON-LD: ItemList of event detail URLs (good for discovery on list pages) ---
  // Keep it reasonable in size; cap at 100 items to avoid huge script tags.
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
  itemListElement: events.slice(0, 100).map((e: EventType, i: number) => ({
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

  const urlFor = (p: number) => (p <= 1 ? "/events" : `/events/page/${p}`);

  const monthFmt = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "America/New_York",
  });

  // track last rendered month when mapping events
  let lastMonth: string | null = null;

  return (
    <section className="max-w-5xl mx-auto px-4 space-y-8">
      {/* GoogleAd Top Slot */}
      <GoogleAd slot="1514406406" format="auto" className="mb-4" />
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-sm text-[var(--fg)]/60 mb-0 mt-[-0.5rem]">
        <ol className="flex items-center gap-2 flex-wrap">
          <li><Link href="/" className="hover:underline text-[var(--fg)]">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-[var(--fg)]/80">All Events</li>
        </ol>
      </nav>
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
        {events.slice(0, 15).map((e: EventType) => {
            const when = tfmt.format(new Date(e.startAt));
            // Sanitize venueLine to remove control chars and stray '2022'
            let venueLine = e.venue
              ? [e.venue.name, [e.venue.city, e.venue.state].filter(Boolean).join(", ")].filter(Boolean).join(" • ")
              : e.city?.name || "";
            if (venueLine) {
              venueLine = venueLine.replace(/[\u0000-\u001F\u007F]+/g, "").replace(/\b2022\b/g, "").trim();
            }

            const monthLabel = monthFmt.format(new Date(e.startAt));
            const showMonth = monthLabel !== lastMonth;
            lastMonth = monthLabel;

            return (
              <React.Fragment key={e.id}>
                {showMonth && (
                  <div className="flex items-center gap-3 my-6" key={`m-${monthLabel}`}>
                    <div className="h-px flex-1 bg-[var(--fg)]/10" />
                    <div className="text-sm uppercase tracking-wide text-[var(--fg)]/60">{monthLabel}</div>
                    <div className="h-px flex-1 bg-[var(--fg)]/10" />
                  </div>
                )}
                <article className="ccs-card group transition-all hover:shadow-lg hover:scale-[1.01]">
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

                <div className="shrink-0 flex flex-col gap-3 mt-4 md:mt-0 w-full md:w-auto">
                  <Link 
                    className="ccs-btn-primary px-5 py-2.5 group-hover:scale-105 transition-transform w-full md:w-auto" 
                    href={`/events/${e.slug}`}
                  >
                    View Details
                  </Link>
                  {e.url && (
                    <a 
                      className="ccs-btn px-5 py-2.5 w-full md:w-auto" 
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
          </React.Fragment>
        );
      })}
      </div>
      {/* Pagination Controls */}
      <nav className="flex justify-center gap-2 mt-8" aria-label="Pagination">
        <Link href="/events/page/2" className="ccs-btn px-4 py-2">Next Page</Link>
      </nav>
      {/* GoogleAd Footer Slot */}
      <GoogleAd slot="1514406406" format="auto" className="mt-8" />
    </section>
  );
}
