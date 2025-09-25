export function generateViewport() {
  return {
    themeColor: "#ffffff"
  };
}
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

export default function DailyPage() {
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

  // Build a serializable, minimal events array for the client component
  // Only include events that start within the current ET week (Monday -> Sunday).
  const weekStart = startOfWeekET(nowInET());
  const weekEnd = endOfWeekET(nowInET()); // exclusive

  function toEtDate(value: any): Date | null {
    if (!value) return null;
    try {
      return new Date(new Date(String(value)).toLocaleString("en-US", { timeZone: "America/New_York" }));
    } catch {
      return null;
    }
  }

  const eventsForClient = (eventsData as any[] || [])
    .map((e) => {
      const startRaw = e.startAt ?? e.startsAt ?? e.start ?? e.datetime ?? null;
      return {
        __rawStart: startRaw,
        id: e.id ?? e.slug ?? Math.random().toString(36).slice(2, 9),
        slug: getEventSlug(e), // canonical slug used across the site
        title: e.title ?? e.name ?? "",
        startAt: startRaw ? String(startRaw) : "",
        description: e.description ?? e.summary ?? null,
        url: e.url ?? null,
        isFeatured: !!e.isFeatured,
        venue: {
          name: e.venue?.name ?? null,
          slug: e.venue?.slug ?? null,
          city: e.venue?.city ?? null,
          state: e.venue?.state ?? null,
        },
        city: {
          name: e.city?.name ?? e.city ?? null,
        },
      };
    })
    .filter((e) => {
      const dt = toEtDate(e.__rawStart);
      if (!dt) return false;
      return dt >= weekStart && dt < weekEnd;
    })
    .map(({ __rawStart, ...keep }) => keep);

  return (
    <Container>
      <section className="w-full space-y-12 py-6">
        {/* Top row */}
        <div className={weeklyStyles.headerRow}>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Daily View", current: true }]} />
          <div className={weeklyStyles.headerControlsWrap}>
            <WeeklyControls />
          </div>
        </div>

        {/* use shared hero so formatting matches other pages */}
        <HomeHero
          title="Daily Car Show List"
          lead={
            <>
              See the complete weekly schedule of Charlotte-area car shows, Cars & Coffee, cruise-ins, and meets.
              Updated every week with the latest events, venues, and details for car enthusiasts in Charlotte, NC.
            </>
          }
          range={formatRangeET(weekStartEt, weekEndEt)}
        />

        {/* Centered tabs */}
        <div className={weeklyStyles.tabsWrap}>
          <WeeklyTabs events={eventsForClient} />
        </div>

        {/* Event list */}
        <WeeklyList events={eventsForClient} />
      </section>
    </Container>
  );
}
