"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import EventListCard from "@/components/event/EventListCard";
import { toEtDate, nowInET } from "@/lib/et";

const PAGE_SIZE = 15;

type EventType = {
  id?: string | number;
  status?: string;
  startAt: string | number | Date;
  title?: string;
  [key: string]: any;
};

type UpcomingEventsListProps = {
  allEvents: EventType[];
  initialPage?: number;
  showPagination?: boolean;
};

export default function UpcomingEventsList({ 
  allEvents, 
  initialPage = 1,
  showPagination = true 
}: UpcomingEventsListProps) {
  const [page, setPage] = useState(initialPage);

  // Update page from URL query param if present (for /events/page/[page]/)
  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const p = parseInt(sp.get("page") ?? String(initialPage), 10);
      if (!Number.isNaN(p) && p > 0) setPage(p);
    } catch {
      // no-op
    }
  }, [initialPage]);

  // Also update from pathname for /events/page/[page]/ routes
  useEffect(() => {
    try {
      const pathMatch = window.location.pathname.match(/\/events\/page\/(\d+)\/?$/);
      if (pathMatch) {
        const p = parseInt(pathMatch[1], 10);
        if (!Number.isNaN(p) && p > 0) setPage(p);
      }
    } catch {
      // no-op
    }
  }, []);

  // Filter events client-side based on current browser time (ET)
  const nowET = useMemo(() => nowInET(), []);
  
  const upcomingEvents = useMemo(() => {
    return (allEvents as EventType[])
      .filter((e) => {
        if (e.status !== "PUBLISHED") return false;
        const dt = toEtDate(e.startAt);
        return !!dt && dt.getTime() >= nowET.getTime();
      })
      .sort((a, b) => {
        const ta = toEtDate(a.startAt)?.getTime() ?? 0;
        const tb = toEtDate(b.startAt)?.getTime() ?? 0;
        return ta - tb || (a.title ?? "").localeCompare(b.title ?? "");
      });
  }, [allEvents, nowET]);

  const totalPages = Math.max(1, Math.ceil(upcomingEvents.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const paginatedEvents = upcomingEvents.slice(start, start + PAGE_SIZE);

  const monthFmt = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "America/New_York",
  });

  let lastMonth: string | null = null;

  return (
    <div className="space-y-5 lg:col-span-8">
      {paginatedEvents.map((e: EventType) => {
        const monthLabel = monthFmt.format(toEtDate(e.startAt) ?? new Date(e.startAt as any));
        const showMonth = monthLabel !== lastMonth;
        lastMonth = monthLabel;

        return (
          <React.Fragment key={e.id}>
            {showMonth && (
              <div className="my-4 flex items-center gap-3" key={`m-${monthLabel}`} role="separator" aria-label={`Events in ${monthLabel}`}>
                <div className="h-px flex-1 bg-[var(--fg)]/10" aria-hidden="true" />
                <div className="text-xs font-medium uppercase tracking-wide text-[var(--fg)]/60">
                  {monthLabel}
                </div>
                <div className="h-px flex-1 bg-[var(--fg)]/10" aria-hidden="true" />
              </div>
            )}
            <EventListCard e={e} disableVenueLink />
          </React.Fragment>
        );
      })}

      {paginatedEvents.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow text-[var(--fg)]/70">
          No upcoming events found.
        </div>
      )}

      {showPagination && (
        <nav className="mt-6 flex flex-wrap gap-3" aria-label="Pagination">
          <Link 
            href="/events/past/" 
            className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            aria-label="View previous events"
          >
            Previous events
          </Link>
          {page > 1 && (
            <Link 
              href={page === 2 ? "/events/" : `/events/page/${page - 1}/`} 
              className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              aria-label={`Go to page ${page - 1}`}
            >
              Previous
            </Link>
          )}
          {page < totalPages && (
            <Link 
              href={page === 1 ? "/events/page/2/" : `/events/page/${page + 1}/`} 
              className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              aria-label={`Go to page ${page + 1}`}
            >
              Next page
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}

