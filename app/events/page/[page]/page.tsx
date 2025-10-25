import React from "react";
import Link from "next/link";
// GoogleAd removed
import eventsData from "../../../data/events.json";
import EventListCard from "@/components/event/EventListCard";

const PAGE_SIZE = 15;

export function generateStaticParams() {
  // Generate page params for pages 2..N (page 1 is /events)
  const now = new Date();
  type EventType = typeof eventsData[number];
  const events = (eventsData as EventType[])
    .filter((e: EventType) => e.status === "PUBLISHED" && new Date(e.startAt) >= now)
    .sort((a: EventType, b: EventType) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime() || a.title.localeCompare(b.title));

  const totalPages = Math.ceil(events.length / PAGE_SIZE);
  const pages: Array<{ page: string }> = [];
  for (let i = 2; i <= totalPages; i++) {
    pages.push({ page: String(i) });
  }
  return pages;
}

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
    <section className="w-full px-4 md:px-12 max-w-7xl mx-auto space-y-12 py-6">
      {/* Top ad intentionally removed to avoid reserved space above hero */}
      <nav aria-label="Breadcrumb" className="text-sm text-[var(--fg)]/60 mb-0">
        <ol className="flex items-center gap-2 flex-wrap">
          <li><Link href="/" className="hover:underline text-[var(--fg)]">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-[var(--fg)]/80">All Events</li>
        </ol>
      </nav>
  <header className="text-center space-y-2 mt-1">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--fg)]" style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}>
          All Charlotte Car Shows
        </h1>
        <p className="text-xl text-[var(--fg)]/70 max-w-2xl mx-auto">
          Browse upcoming Cars &amp; Coffee, meets, cruise-ins, and automotive events across the Charlotte area.
        </p>
      </header>
      <div className="space-y-6">
        {paginatedEvents.map((e: EventType) => (
          <EventListCard key={e.id} e={e} />
        ))}
      </div>
      {/* Pagination Controls */}
      <nav className="flex justify-center gap-2 mt-8" aria-label="Pagination">
        {pageNum > 1 && (
          <Link href={pageNum === 2 ? "/events/" : `/events/page/${pageNum - 1}/`} className="ccs-btn px-4 py-2">Previous</Link>
        )}
  <Link href="/events/past/" className="ccs-btn px-4 py-2">Previous events</Link>
        {Array.from({ length: totalPages }, (_, i) => (
          <Link
            key={i + 1}
            href={i === 0 ? "/events/" : `/events/page/${i + 1}/`}
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
