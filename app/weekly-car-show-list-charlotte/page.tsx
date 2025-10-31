export function generateViewport() {
  return {
    themeColor: "#ffffff"
  };
}
import React, { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import WeeklyControls from "@/components/WeeklyControls.client";
import weeklyStyles from "@/components/Weekly.module.css";
import { SearchBox } from "@/components/search/SearchBox";
import dynamic from "next/dynamic";
import { loadEvents } from "@/lib/data";
import EventListCard from "@/components/event/EventListCard";
import { nowInET, startOfWeekET, endOfWeekET, toEtDate } from "@/lib/et";
import { buildEventItemListSchema, buildBreadcrumbListSchema } from "@/lib/eventSchema";

const AdSlot = dynamic(() => import("@/components/ads/AdSlot"), { ssr: false });

export const metadata: Metadata = {
  title: "Charlotte Weekly Car Show List | Charlotte Car Shows",
  description:
    "See this week’s Charlotte-area car shows, Cars & Coffee, cruise-ins, and meets. Updated weekly.",
  alternates: { canonical: "https://charlottecarshows.com/weekly-car-show-list-charlotte/" },
  openGraph: {
    type: "website",
    title: "Charlotte Weekly Car Show List",
    description:
      "This week’s Charlotte-area car shows, Cars & Coffee, cruise-ins, and meets.",
    url: "https://charlottecarshows.com/weekly-car-show-list-charlotte/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Charlotte Weekly Car Show List",
    description:
      "This week’s Charlotte-area car shows, Cars & Coffee, cruise-ins, and meets.",
  },
};

export default async function WeeklyCarShowListPage() {
  const now = nowInET();
  const weekStart = startOfWeekET(now);
  const weekEnd = endOfWeekET(now);

  const eventsData = await loadEvents();
  type EventType = typeof eventsData[number];

  const weekly = (eventsData as EventType[])
    .filter((e) => {
      if (e.status !== "PUBLISHED") return false;
      const dt = toEtDate(e.startAt);
      return !!dt && dt >= weekStart && dt < weekEnd;
    })
    .sort((a, b) => {
      const ta = toEtDate(a.startAt)?.getTime() ?? 0;
      const tb = toEtDate(b.startAt)?.getTime() ?? 0;
      return ta - tb || a.title.localeCompare(b.title);
    });

  // Build an ordered list of day labels for this week (Sun–Sat)
  const dayLabelFmt = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "America/New_York",
  });
  const dayKeyFmt = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "America/New_York",
  });

  // Group events by day
  const groups = new Map<string, { label: string; items: EventType[] }>();
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const key = dayKeyFmt.format(d); // "Sunday"
    const label = dayLabelFmt.format(d); // "Sunday, May 12"
    groups.set(key, { label, items: [] });
  }
  for (const e of weekly) {
    const d = toEtDate(e.startAt) ?? new Date(e.startAt);
    const key = dayKeyFmt.format(d);
    const g = groups.get(key);
    if (g) g.items.push(e);
  }

  // Heading range (e.g., “May 12–18”)
  const rangeFmt = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    timeZone: "America/New_York",
  });
  const headingRange =
    `${rangeFmt.format(weekStart)}–${rangeFmt.format(weekEnd)}`;

  // Build JSON-LD ItemList with Event schemas
  const itemListSchema = buildEventItemListSchema(weekly.slice(0, 100), {
    name: `This Week's Charlotte Car Shows (${headingRange})`,
    limit: 100,
  });

  // Build BreadcrumbList schema
  const breadcrumbSchema = buildBreadcrumbListSchema(
    [
      { label: "Home", href: "/" },
      { label: "Events this Week", current: true },
    ],
    { currentPageUrl: "https://charlottecarshows.com/weekly-car-show-list-charlotte/" }
  );

  return (
    <Container>
      <section className="w-full space-y-8 lg:space-y-10">
        {/* Full-width toolbar (match /events/) */}
        <div className={`${weeklyStyles.headerRow} gap-4`}>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Events this Week", current: true },
            ]}
          />
          <div className={weeklyStyles.headerControlsWrap}>
            <Suspense
              fallback={
                <div className="h-9 w-64 rounded-md bg-zinc-100" aria-hidden="true" />
              }
            >
              <WeeklyControls />
            </Suspense>
          </div>
        </div>

        {/* JSON-LD schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />

        {/* Header text (match tone from /events/) */}
        <header className="space-y-2 text-left">
          <h1
            className="text-3xl font-bold tracking-tight text-[var(--fg)] lg:text-[34px]"
            style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
          >
            Charlotte Weekly Car Show List
          </h1>
          <p className="max-w-3xl text-base text-[var(--fg)]/70 lg:text-[15px]">
            This week’s Charlotte-area Cars & Coffee, meets, cruise-ins, and car
            shows across the metro. Updated weekly.
          </p>
          <div className="text-sm text-[var(--fg)]/60">
            <span className="font-semibold">{headingRange}</span>
            <span className="ml-2">
              ({weekly.length} event{weekly.length === 1 ? "" : "s"})
            </span>
          </div>
        </header>

        {/* Search (exactly like /events/) */}
        <div className="mb-6 md:mb-8">
          <div className="max-w-xl">
            <SearchBox />
          </div>
        </div>

        {/* Two-column layout, same as /events/ */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Main column */}
          <div className="space-y-5 lg:col-span-8">
            {[...groups.values()]
              .filter((g) => g.items.length > 0)
              .map((g) => (
                <React.Fragment key={g.label}>
                  <div className="my-4 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[var(--fg)]/10" />
                    <div className="text-xs font-medium uppercase tracking-wide text-[var(--fg)]/60">
                      {g.label}
                    </div>
                    <div className="h-px flex-1 bg-[var(--fg)]/10" />
                  </div>
                  {g.items.map((e) => (
                    <EventListCard key={e.id} e={e} />
                  ))}
                </React.Fragment>
              ))}

            {!weekly.length && (
              <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow text-[var(--fg)]/70">
                No events for this week yet.
              </div>
            )}
          </div>

          {/* Sidebar (skyscraper) */}
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

        {/* Bottom ad to mirror /events/ */}
        <div className="flex items-center justify-center">
          <AdSlot slot="weekly-list-bottom" />
        </div>
      </section>
    </Container>
  );
}