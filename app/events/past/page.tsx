"use client";

import Link from "next/link";
import { useMemo, useEffect, useState } from "react";
import EventCard from "@/components/EventCard";
import eventsData from "@/app/data/events.json";

const PAGE_SIZE = 15;

export default function PastEventsPage() {
  // Read ?page= on the client only to avoid prerender errors
  const [page, setPage] = useState(1);
  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const p = parseInt(sp.get("page") ?? "1", 10);
      if (!Number.isNaN(p) && p > 0) setPage(p);
    } catch {
      // no-op
    }
  }, []);

  // Use ET for consistent cutoff
  const nowET = useMemo(
    () => new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" })),
    []
  );

  type EventType = (typeof eventsData)[number];
  const pastEvents = useMemo(() => {
    return (eventsData as EventType[])
      .filter((e) => new Date(e.startAt) < nowET)
      .sort(
        (a, b) =>
          new Date(b.startAt).getTime() - new Date(a.startAt).getTime() ||
          a.title.localeCompare(b.title)
      );
  }, [nowET]);

  const totalPages = Math.max(1, Math.ceil(pastEvents.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const items = pastEvents.slice(start, start + PAGE_SIZE);
  const nextHref = page < totalPages ? `/events/past/?page=${page + 1}` : null;

  return (
    <section className="container max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Top bar: breadcrumbs (left) + List/Week/Day toggle (right) */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[var(--fg)]/70">
          <ol className="flex items-center gap-1">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li className="px-1">/</li>
            <li><Link href="/events/" className="hover:underline">Events</Link></li>
            <li className="px-1">/</li>
            <li aria-current="page" className="font-medium text-[var(--fg)]">Past</li>
          </ol>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/events/" className="ccs-btn px-3 py-1.5" aria-current="page">List</Link>
          <Link
            href="/weekly-car-show-list-charlotte/"
            className="ccs-btn px-3 py-1.5"
          >
            Week
          </Link>
          <Link
            href="/daily/"
            className="ccs-btn px-3 py-1.5"
          >
            Day
          </Link>
        </div>
      </div>

      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--fg)]" style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}>
          Past Charlotte Car Shows
        </h1>
        <p className="text-xl text-[var(--fg)]/70 max-w-2xl mx-auto mt-4">
          Browse previously listed events.
        </p>
      </header>

      <div className="space-y-6 mb-12">
        {items.map((e) => (
          // Same EventCard used on /events (green button + location)
          <EventCard key={e.id} e={e} />
        ))}

        {items.length === 0 && (
          <div className="text-center py-12 text-[var(--fg)]/70">No past events found.</div>
        )}
      </div>

      {/* Same pagination controls as /events */}
      <nav className="flex justify-center gap-2 mt-8" aria-label="Pagination">
        <Link href="/events/" className="ccs-btn px-4 py-2">Previous events</Link>
        {nextHref ? (
          <Link href={nextHref} className="ccs-btn px-4 py-2">Next Page</Link>
        ) : (
          <span className="ccs-btn px-4 py-2 opacity-50 pointer-events-none">Next Page</span>
        )}
      </nav>
    </section>
  );
}