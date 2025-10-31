"use client";

import Link from "next/link";
import { useMemo, useEffect, useState, Suspense } from "react";
import type { Metadata } from "next";
import EventListCard from "@/components/event/EventListCard";
import eventsData from "@/app/data/events.json";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import WeeklyControls from "@/components/WeeklyControls.client";
import weeklyStyles from "@/components/Weekly.module.css";
import { SearchBox } from "@/components/search/SearchBox";
import dynamic from "next/dynamic";
import { buildEventItemListSchema, buildBreadcrumbListSchema } from "@/lib/eventSchema";
import { toEtDate, nowInET } from "@/lib/et";

const AdSlot = dynamic(() => import("@/components/ads/AdSlot"), { ssr: false });

const PAGE_SIZE = 15;

function PastEventsClient() {
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
  const nowET = useMemo(() => nowInET(), []);

  type EventType = (typeof eventsData)[number];
  const pastEvents = useMemo(() => {
    return (eventsData as EventType[])
      .filter((e) => {
        if (e.status !== "PUBLISHED") return false;
        const dt = toEtDate(e.startAt);
        return !!dt && dt.getTime() < nowET.getTime();
      })
      .sort((a, b) => {
        const ta = toEtDate(a.startAt)?.getTime() ?? 0;
        const tb = toEtDate(b.startAt)?.getTime() ?? 0;
        return tb - ta || a.title.localeCompare(b.title);
      });
  }, [nowET]);

  const totalPages = Math.max(1, Math.ceil(pastEvents.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const items = pastEvents.slice(start, start + PAGE_SIZE);
  const nextHref = page < totalPages ? `/events/past/?page=${page + 1}` : null;

  // Build JSON-LD ItemList with Event schemas (client-side)
  const itemList = useMemo(() => {
    return buildEventItemListSchema(items.slice(0, 100) as any[], {
      name: "Past Charlotte Car Shows",
      limit: 100,
    });
  }, [items]);

  // Build BreadcrumbList schema (client-side)
  const breadcrumbSchema = useMemo(() => {
    return buildBreadcrumbListSchema(
      [
        { label: "Home", href: "/" },
        { label: "All Events", href: "/events/" },
        { label: "Past Events", current: true },
      ],
      { currentPageUrl: "https://charlottecarshows.com/events/past/" }
    );
  }, []);

  const monthFmt = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "America/New_York",
  });

  // track last rendered month when mapping events
  let lastMonth: string | null = null;

  return (
    <Container>
      <section className="w-full space-y-8 lg:space-y-10">
        <div className={`${weeklyStyles.headerRow} gap-4`}>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "All Events", href: "/events/" },
              { label: "Past Events", current: true },
            ]}
          />
          <div className={weeklyStyles.headerControlsWrap}>
            <Suspense fallback={<div className="h-9 w-64 rounded-md bg-zinc-100" aria-hidden="true" />}>
              <WeeklyControls />
            </Suspense>
          </div>
        </div>

        {/* JSON-LD schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />

        <header className="space-y-2 text-left">
          <h1
            className="text-3xl font-bold tracking-tight text-[var(--fg)] lg:text-[34px]"
            style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
          >
            Past Charlotte Car Shows
          </h1>
          <p className="max-w-3xl text-base text-[var(--fg)]/70 lg:text-[15px]">
            Recently ended Cars & Coffee, meets, cruise-ins, and automotive events across the Charlotte area.
          </p>
        </header>

        <div className="mb-6 md:mb-8">
          <div className="max-w-xl">
            <SearchBox />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-5 lg:col-span-8">
            {items.map((e: EventType) => {
              const monthLabel = monthFmt.format(toEtDate(e.startAt) ?? new Date(e.startAt));
              const showMonth = monthLabel !== lastMonth;
              lastMonth = monthLabel;

              return (
                <div key={e.id}>
                  {showMonth && (
                    <div className="my-4 flex items-center gap-3">
                      <div className="h-px flex-1 bg-[var(--fg)]/10" />
                      <div className="text-xs font-medium uppercase tracking-wide text-[var(--fg)]/60">
                        {monthLabel}
                      </div>
                      <div className="h-px flex-1 bg-[var(--fg)]/10" />
                    </div>
                  )}
                  <EventListCard e={e} />
                </div>
              );
            })}

            {items.length === 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow text-[var(--fg)]/70">No past events found.</div>
            )}

            <nav className="mt-6 flex flex-wrap gap-3" aria-label="Pagination">
              <Link 
                href="/events/" 
                className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                aria-label="View all upcoming events"
              >
                All Events
              </Link>
              {nextHref ? (
                <Link 
                  href={nextHref} 
                  className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  aria-label={`Go to page ${page + 1}`}
                >
                  Next Page
                </Link>
              ) : (
                <span className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 opacity-50 pointer-events-none" aria-label="No more pages">Next Page</span>
              )}
            </nav>
          </div>

          <aside className="space-y-4 lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center justify-center">
              <AdSlot
                slot="7335717776"
                sizes={[
                  { media: "(min-width: 1024px)", width: 300, height: 600 }, // desktop skyscraper
                  { media: "(max-width: 1023px)", width: 320, height: 100 }, // mobile fallback
                ]}
              />
            </div>
          </aside>
        </div>
      </section>
    </Container>
  );
}

export default function PastEventsPage() {
  return <PastEventsClient />;
}
