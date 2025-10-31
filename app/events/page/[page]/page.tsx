import React, { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { loadEvents } from "@/lib/data";
import EventListCard from "@/components/event/EventListCard";
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

export async function generateStaticParams() {
  // Generate page params for pages 2..N (page 1 is /events)
  const now = nowInET();
  const eventsData = await loadEvents();
  type EventType = typeof eventsData[number];
  const events = (eventsData as EventType[])
    .filter((e: EventType) => {
      if (e.status !== "PUBLISHED") return false;
      const dt = toEtDate(e.startAt);
      return !!dt && dt.getTime() >= now.getTime();
    })
    .sort((a: EventType, b: EventType) => {
      const ta = toEtDate(a.startAt)?.getTime() ?? 0;
      const tb = toEtDate(b.startAt)?.getTime() ?? 0;
      return ta - tb || a.title.localeCompare(b.title);
    });

  const totalPages = Math.ceil(events.length / PAGE_SIZE);
  const pages: Array<{ page: string }> = [];
  for (let i = 2; i <= totalPages; i++) {
    pages.push({ page: String(i) });
  }
  return pages;
}

export async function generateMetadata({ params }: { params: { page: string } }): Promise<Metadata> {
  const pageNum = Math.max(1, parseInt(params.page, 10) || 1);
  return {
    title: pageNum > 1 ? `All Charlotte Car Shows - Page ${pageNum} | Charlotte Car Shows` : "All Charlotte Car Shows | Charlotte Car Shows",
    description: "Browse all upcoming Charlotte-area car shows, Cars & Coffee, meets, cruise-ins, and track nights.",
    alternates: { canonical: `https://charlottecarshows.com/events/page/${pageNum}/` },
    openGraph: {
      type: "website",
      title: pageNum > 1 ? `All Charlotte Car Shows - Page ${pageNum}` : "All Charlotte Car Shows",
      description: "All upcoming Charlotte-area car shows, Cars & Coffee, meets, cruise-ins, and track nights.",
      url: `https://charlottecarshows.com/events/page/${pageNum}/`,
    },
    twitter: {
      card: "summary_large_image",
      title: pageNum > 1 ? `All Charlotte Car Shows - Page ${pageNum}` : "All Charlotte Car Shows",
      description: "All upcoming Charlotte-area car shows, Cars & Coffee, meets, cruise-ins, and track nights.",
    },
  };
}

export default async function EventsPage({ params }: { params: { page: string } }) {
  const now = nowInET();
  const pageNum = Math.max(1, parseInt(params.page, 10) || 1);
  const eventsData = await loadEvents();
  type EventType = typeof eventsData[number];
  const events = (eventsData as EventType[])
    .filter((e: EventType) => {
      if (e.status !== "PUBLISHED") return false;
      const dt = toEtDate(e.startAt);
      return !!dt && dt.getTime() >= now.getTime();
    })
    .sort((a: EventType, b: EventType) => {
      const ta = toEtDate(a.startAt)?.getTime() ?? 0;
      const tb = toEtDate(b.startAt)?.getTime() ?? 0;
      return ta - tb || a.title.localeCompare(b.title);
    });

  const start = (pageNum - 1) * PAGE_SIZE;
  const paginatedEvents = events.slice(start, start + PAGE_SIZE);
  const totalPages = Math.ceil(events.length / PAGE_SIZE);

  // Build JSON-LD ItemList with Event schemas (standardized format)
  const itemList = buildEventItemListSchema(paginatedEvents.slice(0, 100) as any[], {
    name: `All Charlotte Car Shows - Page ${pageNum}`,
    limit: 100,
  });

  // Build BreadcrumbList schema
  const breadcrumbSchema = buildBreadcrumbListSchema(
    [
      { label: "Home", href: "/" },
      { label: "All Events", href: "/events/" },
      { label: `Page ${pageNum}`, current: true },
    ],
    { currentPageUrl: `https://charlottecarshows.com/events/page/${pageNum}/` }
  );

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
              { label: `Page ${pageNum}`, current: true },
            ]}
          />
          <div className={weeklyStyles.headerControlsWrap}>
            <Suspense fallback={<div className="h-9 w-64 rounded-md bg-zinc-100" aria-hidden="true" />}>
              <WeeklyControls />
            </Suspense>
          </div>
        </div>

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
            The Charlotte Car Show List
          </h1>
          <p className="max-w-3xl text-base text-[var(--fg)]/70 lg:text-[15px]">
            Browse upcoming Cars & Coffee, meets, cruise-ins, and Charlotte Metro automotive events across the greater Charlotte area — including Concord, Huntersville, Rock Hill, and beyond.
          </p>
        </header>

        <div className="mb-6 md:mb-8">
          <div className="max-w-xl">
            <SearchBox />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-5 lg:col-span-8">
            {paginatedEvents.map((e: EventType) => {
              const monthLabel = monthFmt.format(toEtDate(e.startAt) ?? new Date(e.startAt));
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
                  <EventListCard e={e} />
                </React.Fragment>
              );
            })}

            <nav className="mt-6 flex flex-wrap gap-3" aria-label="Pagination">
              {pageNum > 1 && (
                <Link 
                  href={pageNum === 2 ? "/events/" : `/events/page/${pageNum - 1}/`} 
                  className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  aria-label={`Go to page ${pageNum - 1}`}
                >
                  Previous
                </Link>
              )}
              <Link 
                href="/events/past/" 
                className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                aria-label="View previous events"
              >
                Previous events
              </Link>
              {pageNum < totalPages && (
                <Link 
                  href={`/events/page/${pageNum + 1}/`} 
                  className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  aria-label={`Go to page ${pageNum + 1}`}
                >
                  Next page
                </Link>
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
