// app/events/page.tsx  (All events index - 1 column preserved)
import React, { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { loadEvents } from "@/lib/data";
import { toEtDate, nowInET, formatDateET, formatTimeET } from "@/lib/et";
import { buildEventItemListSchema, buildBreadcrumbListSchema } from "@/lib/eventSchema";
import Container from '@/components/Container';
import EventListCard from "@/components/event/EventListCard";
import WeeklyControls from "@/components/WeeklyControls.client";
import Breadcrumbs from "@/components/Breadcrumbs";
import weeklyStyles from "@/components/Weekly.module.css";
import dynamic from "next/dynamic";
import { SearchBox } from "@/components/search/SearchBox";
const AdSlot = dynamic(() => import("@/components/ads/AdSlot"), { ssr: false });

// Use runtime loader so /events stays in sync with V2 JSON (no rebuild needed)

export const metadata: Metadata = {
  title: "All Charlotte Car Shows | Charlotte Car Shows",
  description:
    "Browse all upcoming Charlotte-area car shows, Cars & Coffee, meets, cruise-ins, and track nights.",
  alternates: { canonical: "https://charlottecarshows.com/events/" },
  openGraph: {
    type: "website",
    title: "All Charlotte Car Shows",
    description:
      "All upcoming Charlotte-area car shows, Cars & Coffee, meets, cruise-ins, and track nights.",
  url: "https://charlottecarshows.com/events/",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Charlotte Car Shows",
    description:
      "All upcoming Charlotte-area car shows, Cars & Coffee, meets, cruise-ins, and track nights.",
  },
};
function isValidUrl(u: any): u is string {
  return typeof u === "string" && /^\s*https?:\/\//i.test(u.trim());
}

export default async function EventsAllPage() {
  // use ET-normalized "now" so comparisons match displayed ET times
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
    })
    // sanitize URL field so a non-http value won't render as a site link
    .map(e => ({ ...e, url: isValidUrl(e.url) ? e.url.trim() : null }));

  // --- JSON-LD: ItemList with Event schemas (standardized format) ---
  // Keep it reasonable in size; cap at 100 items to avoid huge script tags.
  const itemList = buildEventItemListSchema(events.slice(0, 100) as any[], {
    name: "All Charlotte Car Shows",
    limit: 100,
  });

  // Build BreadcrumbList schema
  const breadcrumbSchema = buildBreadcrumbListSchema(
    [{ label: "Home", href: "/" }, { label: "All Events", current: true }],
    { currentPageUrl: "https://charlottecarshows.com/events/" }
  );

  const urlFor = (p: number) => (p <= 1 ? "/events/" : `/events/page/${p}/`);

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
            items={[{ label: "Home", href: "/" }, { label: "All Events", current: true }]}
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
            Browse upcoming Cars & Coffee, meets, cruise-ins, and Charlotte Metro automotive events across the greater Charlotte area — including Concord, Huntersville, Rock Hill, and beyond. Whether you’re into exotics, classics, muscle cars, or family car shows in Charlotte, NC, you’ll find it here.
          </p>
          <p className="max-w-3xl text-base text-[var(--fg)]/70 lg:text-[15px]">
            Search or scroll through upcoming events to find your next weekend meet. If you don’t see your event listed, <a href="/contact/">submit your event here</a> to be featured on the Charlotte Car Shows list.
          </p>
        </header>

        <div className="mb-6 md:mb-8">
          <div className="max-w-xl">
            <SearchBox />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-5 lg:col-span-8">
            {events.slice(0, 15).map((e: EventType) => {
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
              <Link 
                href="/events/past/" 
                className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                aria-label="View previous events"
              >
                Previous events
              </Link>
              <Link 
                href="/events/page/2/" 
                className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                aria-label="Go to page 2"
              >
                Next page
              </Link>
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
