import React from "react";
import Link from "next/link";
import eventsData from "../../data/events.json";

const PAGE_SIZE = 15;

export default function EventsPage({ params }: { params: { page: string } }) {
  const now = new Date();
  const pageNum = Math.max(1, parseInt(params.page, 10) || 1);
  type EventType = typeof eventsData[number];
  const events = (eventsData as EventType[])
    .filter((e: EventType) => e.status === "PUBLISHED" && new Date(e.startAt) >= now)
    .sort((a: EventType, b: EventType) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime() || a.title.localeCompare(b.title));

  const start = (pageNum - 1) * PAGE_SIZE;
  const paginatedEvents = events.slice(start, start + PAGE_SIZE);
  const totalPages = Math.ceil(events.length / PAGE_SIZE);

  return (
    <section className="max-w-7xl mx-auto px-2 md:px-6 space-y-8">
      <nav aria-label="Breadcrumb" className="text-sm text-[var(--fg)]/60 mb-0 mt-[-0.5rem]">
        <ol className="flex items-center gap-2 flex-wrap">
          <li><Link href="/" className="hover:underline text-[var(--fg)]">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-[var(--fg)]/80">All Events</li>
        </ol>
      </nav>
      <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--fg)]" style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}>
          All Charlotte Car Shows
        </h1>
        <p className="text-xl text-[var(--fg)]/70 max-w-2xl mx-auto">
          Browse upcoming Cars &amp; Coffee, meets, cruise-ins, and automotive events across the Charlotte area.
        </p>
      </header>
      <div className="space-y-6">
        {paginatedEvents.map((e: EventType) => (
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
                  <p className="mt-2 pt-2 text-base text-[var(--fg)]/60 flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                    <span className="inline-flex items-center gap-2">
                      <svg className="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="whitespace-nowrap">{new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "America/New_York" }).format(new Date(e.startAt))}</span>
                    </span>
                    {e.venue && (
                      <span className="inline-flex items-center gap-2">
                        <span className="hidden md:inline text-[var(--fg)]/40">•</span>
                        <svg className="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{e.venue.name} • {[e.venue.city, e.venue.state].filter(Boolean).join(", ")}</span>
                      </span>
                    )}
                  </p>
                </div>
                {e.description && (
                  <p className="text-sm md:text-base text-[var(--fg)]/70 leading-relaxed">
                    {e.description.length > 220 ? e.description.slice(0, 220).replace(/\s+\S*$/, "") + "…" : e.description}
                  </p>
                )}
              </div>
              <div className="shrink-0 flex flex-col gap-3 mt-4 md:mt-0 w-full md:w-auto">
                <Link className="ccs-btn-primary px-5 py-2.5 group-hover:scale-105 transition-transform w-full md:w-auto" href={`/events/${e.slug}`}>View Details</Link>
                {e.url && (
                  <a className="ccs-btn px-5 py-2.5 w-full md:w-auto" href={e.url} target="_blank" rel="noreferrer">Official Site</a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
  {/* Pagination Controls */}
      <nav className="flex justify-center gap-2 mt-8" aria-label="Pagination">
        {pageNum > 1 && (
          <Link href={pageNum === 2 ? "/events/" : `/events/page/${pageNum - 1}/`} className="ccs-btn px-4 py-2">Previous</Link>
        )}
        {Array.from({ length: totalPages }, (_, i) => (
          <Link
            key={i + 1}
            href={i === 0 ? "/events" : `/events/page/${i + 1}`}
            className={`ccs-btn px-4 py-2${i + 1 === pageNum ? " ccs-btn-primary" : ""}`}
            aria-current={i + 1 === pageNum ? "page" : undefined}
          >
            {i + 1}
          </Link>
        ))}
        {pageNum < totalPages && (
          <Link href={`/events/page/${pageNum + 1}`} className="ccs-btn px-4 py-2">Next</Link>
        )}
      </nav>
    </section>
  );
}
