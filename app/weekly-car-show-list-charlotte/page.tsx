export function generateViewport() {
  return {
    themeColor: "#ffffff"
  };
}
import type { Metadata } from "next";
// ...existing code...

export async function generateMetadata(): Promise<Metadata> {
  // reuse the same helpers used by the page so metadata and visible heading match
  const nowEt = nowInET();
  const weekStartEt = startOfWeekET(nowEt);
  const weekEndEt = endOfWeekET(nowEt);
  const headingRange = formatRangeET(weekStartEt, weekEndEt);
  return {
    title: "Charlotte Weekly Car Show List | Charlotte Car Shows",
    description: `See the complete weekly schedule of Charlotte-area car shows, Cars & Coffee, cruise-ins, and meets for ${headingRange}. Updated every week with the latest events, venues, and details for car enthusiasts in Charlotte, NC.`,
    alternates: {
      canonical: 'https://charlottecarshows.com/weekly-car-show-list-charlotte',
    },
    openGraph: {
      title: "Charlotte Weekly Car Show List",
      description: `Discover all upcoming Charlotte car shows, meets, and cruise-ins for this week (${headingRange}). Find event times, locations, and details for the Charlotte, NC area.`,
      url: "https://charlottecarshows.com/weekly-car-show-list-charlotte",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Charlotte Weekly Car Show List",
      description: `See this week's Charlotte car shows, meets, and cruise-ins. Updated weekly for car enthusiasts in Charlotte, NC. (${headingRange})`,
    },
  };
}

import React from "react";
import Link from "next/link";
import eventsData from "../data/events.json";
import AdSlot from "@/components/AdSlot";
import WeeklyControls from "@/components/WeeklyControls.client";
import EventCard from "@/components/EventCard";
import Container from "@/components/Container";
import {
  nowInET,
  startOfWeekET,
  endOfWeekET,
  formatRangeET,
  toEtDate,
} from "@/lib/et";

// Helper: treat "null", empty, non-string as absent URL
function isValidUrl(u: any): u is string {
  return typeof u === "string" && u.trim() !== "" && !/^null$/i.test(u.trim());
}

export default function WeeklyCarShowListPage() {
  const nowEt = nowInET();
  const weekStartEt = startOfWeekET(nowEt);
  const weekEndEt = endOfWeekET(nowEt);
  const events = (eventsData as any[] || [])
    .filter((e) => {
      if (e.status !== "PUBLISHED") return false;
      const dt = toEtDate(e.startAt);
      return !!dt && dt >= weekStartEt && dt < weekEndEt;
    })
    .sort((a, b) => (toEtDate(a.startAt)?.getTime() ?? 0) - (toEtDate(b.startAt)?.getTime() ?? 0) || a.title.localeCompare(b.title))
    // sanitize URL field so downstream rendering can rely on truthiness
    .map((e) => ({ ...e, url: isValidUrl(e.url) ? e.url.trim() : null }));

  const headingRange = formatRangeET(weekStartEt, weekEndEt);
  const tfmt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/New_York",
  });

  // Group events by day
  const days: { [date: string]: any[] } = {};
  events.forEach((e) => {
    const dt = toEtDate(e.startAt) ?? new Date(e.startAt);
    const dayLabel = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      timeZone: "America/New_York",
    }).format(dt);
    if (!days[dayLabel]) days[dayLabel] = [];
    days[dayLabel].push(e);
  });

  return (
    <Container className="space-y-12 py-6">
      <div className="flex items-center justify-between">
        <nav aria-label="Breadcrumb" className="text-sm text-[var(--fg)]/60 mb-6">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link href="/" className="text-[var(--fg)]/60 hover:text-[var(--fg)]">Home</Link></li>
            <li> / </li>
            <li className="text-[var(--fg)]">All Events</li>
          </ol>
        </nav>
        <div>
          <WeeklyControls />
        </div>
      </div>
  <header className="text-center space-y-2 mt-1">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--fg)]" style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}>
          Charlotte Weekly Car Show List
        </h1>
        <p className="text-xl text-[var(--fg)]/70 max-w-2xl mx-auto">
          See the complete weekly schedule of Charlotte-area car shows, Cars &amp; Coffee, cruise-ins, and meets. Updated every week with the latest events, venues, and details for car enthusiasts in Charlotte, NC.
        </p>
        <div className="mt-2 text-base text-[var(--fg)]/60">
          <span className="font-semibold">{headingRange}</span>
          <span className="ml-2">({events.length} events)</span>
        </div>
      </header>
      <div className="space-y-8">
        {Object.entries(days).map(([day, dayEvents]) => (
          <div key={day} className="space-y-4">
            <h2 className="text-2xl font-semibold text-[var(--fg)] mb-2 mt-4">{day}</h2>
            {dayEvents.map((e: any) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        ))}
       {!events.length && (
         <div className="ccs-card text-[var(--fg)]/70">No events in this week.</div>
       )}
       </div>
       {/* Ad loads after LCP/hydration via client AdSlot to avoid blocking LCP */}
       <AdSlot />
     </Container>
   );
 }
