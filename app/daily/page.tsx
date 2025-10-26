import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import WeeklyTabs from "@/components/WeeklyTabs.client";
import WeeklyControls from "@/components/WeeklyControls.client";
import WeeklyList from "@/components/WeeklyList.client";
import Container from "@/components/Container";
import weeklyStyles from "@/components/Weekly.module.css";
import heroStyles from "@/components/HomeHero.module.css";
import eventsData from "../data/events.json";
import { getEventSlug } from "@/lib/eventSlug";
import HomeHero from "@/components/HomeHero";
import { nowInET, startOfWeekET, endOfWeekET, formatRangeET, toEtDate } from "@/lib/et";
import { Suspense } from "react";

export function generateViewport() {
  return {
    themeColor: "#ffffff",
  };
}

// local helper implementations removed — use shared helpers from lib/et

// Helper: treat "null", empty, non-string as absent URL
function isValidUrl(u: any): u is string {
  return typeof u === "string" && u.trim() !== "" && !/^null$/i.test(u.trim());
}

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

export default async function DailyPage() {
  return (
    <Container>
      <Suspense fallback={<div className="h-9 w-64 rounded-md bg-zinc-100" aria-hidden="true" />}>
        <WeeklyControls />
      </Suspense>
      {/* use shared hero so formatting matches other pages */}
      <HomeHero
        title="Daily Car Show List"
        lead="See the complete weekly schedule of Charlotte-area car shows, Cars & Coffee, cruise-ins, and meets. Updated every week with the latest events, venues, and details for car enthusiasts in Charlotte, NC."
        range="September 22, 2025 – September 28, 2025"
        className="prose lg:prose-lg"
      />

      {/* Centered tabs */}
      <div className={weeklyStyles.tabsWrap}>
        <WeeklyTabs events={[]} />
      </div>

      {/* Event list */}
      <WeeklyList events={[]} />
    </Container>
  );
}
