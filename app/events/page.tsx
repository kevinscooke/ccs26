// app/events/page.tsx  (All events index - 1 column preserved)
import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { loadEvents } from "@/lib/data";
import { toEtDate, nowInET, formatDateET, formatTimeET } from "@/lib/et";
import Container from '@/components/Container';
import EventCard from "@/components/EventCard";
import WeeklyControls from "@/components/WeeklyControls.client";
import Breadcrumbs from "@/components/Breadcrumbs";
import weeklyStyles from "@/components/Weekly.module.css";
import dynamic from "next/dynamic";
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
        <section>
          <div className="rounded-lg bg-white px-2 py-2 sm:min-h-[90px] lg:min-h-[90px]">
            <AdSlot
              slot="7335717776"
              // 320x100 mobile / 728x90 desktop via responsive
              style={{ minHeight: 90 }}
            />
          </div>
        </section>

        <div className={`${weeklyStyles.headerRow} gap-4`}>
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "All Events", current: true }]}
          />
          <div className={weeklyStyles.headerControlsWrap}>
            <WeeklyControls />
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
        />

        <header className="space-y-2 text-left">
          <h1
            className="text-3xl font-bold tracking-tight text-[var(--fg)] lg:text-[34px]"
            style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
          >
            All Charlotte Car Shows
          </h1>
          <p className="max-w-3xl text-base text-[var(--fg)]/70 lg:text-[15px]">
            Browse upcoming Cars &amp; Coffee, meets, cruise-ins, and automotive events across the
            Charlotte area.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-5 lg:col-span-8">
            {events.slice(0, 15).map((e: EventType) => {
              const monthLabel = monthFmt.format(toEtDate(e.startAt) ?? new Date(e.startAt));
              const showMonth = monthLabel !== lastMonth;
              lastMonth = monthLabel;

              return (
                <React.Fragment key={e.id}>
                  {showMonth && (
                    <div className="my-4 flex items-center gap-3" key={`m-${monthLabel}`}>
                      <div className="h-px flex-1 bg-[var(--fg)]/10" />
                      <div className="text-xs font-medium uppercase tracking-wide text-[var(--fg)]/60">
                        {monthLabel}
                      </div>
                      <div className="h-px flex-1 bg-[var(--fg)]/10" />
                    </div>
                  )}
                  <EventCard event={e} />
                </React.Fragment>
              );
            })}

            <nav className="mt-6 flex flex-wrap gap-3" aria-label="Pagination">
              <Link href="/events/past/" className="ccs-btn px-4 py-2 text-sm">
                Previous events
              </Link>
              <Link href="/events/page/2/" className="ccs-btn px-4 py-2 text-sm">
                Next page
              </Link>
            </nav>
          </div>

          <aside className="space-y-4 lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg bg-white px-2 py-2 min-h-[280px] lg:min-h-[600px]">
              <AdSlot
                slot="7335717776"
                // 300x600 desktop skyscraper (auto on mobile)
                style={{ minHeight: 280 }}
              />
            </div>
          </aside>
        </div>

        {/* Bottom leaderboard ad */}
        <section>
          <div className="rounded-lg bg-white px-2 py-2 sm:min-h-[90px] lg:min-h-[90px]">
            <AdSlot
              slot="7335717776"
              // 320x100 mobile / 728x90 desktop via responsive
              style={{ minHeight: 90 }}
            />
          </div>
        </section>
      </section>
    </Container>
  );
}
