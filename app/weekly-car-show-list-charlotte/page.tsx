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

function nowInET() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
}
function startOfWeekET(d: Date) {
  // Create a Date object normalized to ET for the provided date, then
  // return the Monday that defines the week. If the date is Sunday, move
  // to the next day (Monday) so the week is Monday->Sunday.
  const et = new Date(new Date(d).toLocaleString("en-US", { timeZone: "America/New_York" }));
  const day = et.getDay();
  if (day === 0) {
    et.setDate(et.getDate() + 1);
  } else {
    const diffToMonday = (day + 6) % 7;
    et.setDate(et.getDate() - diffToMonday);
  }
  et.setHours(0, 0, 0, 0);
  return et;
}
function endOfWeekET(d: Date) {
  const start = startOfWeekET(d);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return end;
}
function formatRangeET(start: Date, endExclusive: Date) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "America/New_York",
  });
  const endShown = new Date(endExclusive);
  endShown.setDate(endShown.getDate() - 1);
  return `${fmt.format(start)} – ${fmt.format(endShown)}`;
}

// Helper: treat "null", empty, non-string as absent URL
function isValidUrl(u: any): u is string {
  return typeof u === "string" && u.trim() !== "" && !/^null$/i.test(u.trim());
}

export default function WeeklyCarShowListPage() {
  const nowEt = nowInET();
  const weekStartEt = startOfWeekET(nowEt);
  const weekEndEt = endOfWeekET(nowEt);
  const events = (eventsData as any[])
    .filter(e => e.status === "PUBLISHED" && new Date(e.startAt) >= weekStartEt && new Date(e.startAt) < weekEndEt)
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime() || a.title.localeCompare(b.title))
    // sanitize URL field so downstream rendering can rely on truthiness
    .map(e => ({ ...e, url: isValidUrl(e.url) ? e.url.trim() : null }));

  const headingRange = formatRangeET(weekStartEt, weekEndEt);
  const tfmt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/New_York",
  });

  // Group events by day
  const days: { [date: string]: any[] } = {};
  events.forEach(e => {
    const day = new Date(e.startAt).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "America/New_York" });
    if (!days[day]) days[day] = [];
    days[day].push(e);
  });

  return (
    <section className="w-full px-4 md:px-12 max-w-7xl mx-auto space-y-12 py-6">
  {/* Top ad intentionally removed to avoid reserved space above hero */}
      <nav aria-label="Breadcrumb" className="text-sm text-[var(--fg)]/60 mb-0">
        <ol className="flex items-center gap-2 flex-wrap">
          <li><Link href="/" className="hover:underline text-[var(--fg)]">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/events/" className="hover:underline text-[var(--fg)]">All Events</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-[var(--fg)]/80">Weekly Charlotte Car Shows</li>
        </ol>
      </nav>
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
              <article key={e.id} className="ccs-card group transition-all hover:shadow-lg hover:scale-[1.01]">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6">
                  <div className="min-w-0 space-y-3">
                    <div>
                      <div className="flex items-start gap-3 flex-wrap">
                        <h3 className="text-xl font-semibold text-[var(--fg)]">
                          <Link href={`/events/${e.slug}`} className="hover:text-green-600 transition-colors">
                            {e.title}
                          </Link>
                        </h3>
                        {e.isFeatured && (
                          <span className="ccs-badge">Featured</span>
                        )}
                      </div>
                      <div className="mt-2 border-t border-[var(--fg)]/10" />
                      <p className="mt-2 pt-2 text-base text-[var(--fg)]/60 flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                        <span className="inline-flex items-center gap-2">
                          <svg className="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="whitespace-nowrap">{tfmt.format(new Date(e.startAt))}</span>
                        </span>
                        {e.venue?.name && (
                          <span className="inline-flex items-center gap-2">
                            <span className="hidden md:inline text-[var(--fg)]/40">•</span>
                            <svg className="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{e.venue.name}</span>
                          </span>
                        )}
                        {e.city?.name && !e.venue?.name && (
                          <span className="inline-flex items-center gap-2">
                            <span className="hidden md:inline text-[var(--fg)]/40">•</span>
                            <span>{e.city.name}</span>
                          </span>
                        )}
                      </p>
                    </div>
                    {e.description && (
                      <p className="text-sm md:text-base text-[var(--fg)]/70 leading-relaxed">{e.description.length > 220 ? e.description.slice(0, 220).replace(/\s+\S*$/, "…") : e.description}</p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ))}
        {!events.length && (
          <div className="ccs-card text-[var(--fg)]/70">No events in this week.</div>
        )}
      </div>
      {/* Ad loads after LCP/hydration via client AdSlot to avoid blocking LCP */}
      <AdSlot />
    </section>
  );
}
