export function generateViewport() {
  return {
    themeColor: "#ffffff"
  };
}
import type { Metadata } from "next";
import { Suspense } from "react";
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
import AdSlot from "@/components/ads/AdSlot";
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

export default async function WeeklyPage() {
  // Build this week’s event list and group by weekday (ET)
  const nowEt = nowInET();
  const weekStartEt = startOfWeekET(nowEt);
  const weekEndEt = endOfWeekET(nowEt);

  const all = Array.isArray(eventsData) ? (eventsData as any[]) : [];
  const events = all
    .filter((e) => {
      const d = toEtDate(e.startAt) ?? new Date(e.startAt);
      const t = d.getTime();
      return Number.isFinite(t) && t >= weekStartEt.getTime() && t <= weekEndEt.getTime();
    })
    .sort((a, b) => {
      const ta = (toEtDate(a.startAt) ?? new Date(a.startAt)).getTime();
      const tb = (toEtDate(b.startAt) ?? new Date(b.startAt)).getTime();
      return ta - tb;
    });
  
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const days: Record<string, any[]> = Object.fromEntries(dayNames.map((d) => [d, [] as any[]]));
  for (const e of events) {
    const d = toEtDate(e.startAt) ?? new Date(e.startAt);
    const name = dayNames[d.getDay()];
    days[name].push(e);
  }

  return (
    <Container>
      <Suspense fallback={<div className="h-9 w-64 rounded-md bg-zinc-100" aria-hidden="true" />}>
        <WeeklyControls />
      </Suspense>
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
      <AdSlot slot="weekly-list-bottom" />
    </Container>
  );
}
