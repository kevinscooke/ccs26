import React, { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { loadEvents } from "@/lib/data";
import { toEtDate, nowInET } from "@/lib/et";
import UpcomingEventsList from "@/components/event/UpcomingEventsList.client";
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
  // Use server time for static generation, but client will filter at runtime
  const eventsData = await loadEvents();
  type EventType = typeof eventsData[number];
  const publishedEvents = (eventsData as EventType[])
    .filter((e: EventType) => e.status === "PUBLISHED");

  // Estimate pages (will be corrected by client-side filtering)
  const estimatedTotalPages = Math.ceil(publishedEvents.length / PAGE_SIZE);
  const pages: Array<{ page: string }> = [];
  for (let i = 2; i <= Math.min(estimatedTotalPages, 10); i++) {
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
  const pageNum = Math.max(1, parseInt(params.page, 10) || 1);
  const eventsData = await loadEvents();
  type EventType = typeof eventsData[number];
  
  // Filter PUBLISHED events for JSON-LD (SEO - use server time for now)
  const now = nowInET();
  const publishedEvents = (eventsData as EventType[])
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
  const paginatedEvents = publishedEvents.slice(start, start + PAGE_SIZE);

  // All published events (for client-side filtering)
  const allPublishedEvents = (eventsData as EventType[])
    .filter((e: EventType) => e.status === "PUBLISHED");

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
          <UpcomingEventsList allEvents={allPublishedEvents} initialPage={pageNum} showPagination={true} />

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
