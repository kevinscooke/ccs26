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

export default function DailyPage() {
  const nowEt = nowInET();
  const weekStartEt = startOfWeekET(nowEt);
  const weekEndEt = endOfWeekET(nowEt);
  const events = (eventsData as any[])
    .filter(e => {
      if (e.status !== "PUBLISHED") return false;
      const dt = toEtDate(e.startAt);
      return !!dt && dt >= weekStartEt && dt < weekEndEt;
    })
    .sort((a, b) => (toEtDate(a.startAt)?.getTime() ?? 0) - (toEtDate(b.startAt)?.getTime() ?? 0) || a.title.localeCompare(b.title))
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

  const eventsForClient = (eventsData as any[] || [])
    .map((e) => {
      const startRaw = e.startAt ?? e.startsAt ?? e.start ?? e.datetime ?? null;
      // build a stable id: prefer explicit id/slug, otherwise derive from slug/title+start
      const stableId =
        e.id ?? e.slug ?? getEventSlug(e) ?? `${String(e.title ?? "").slice(0, 40).replace(/\s+/g, "-")}-${String(startRaw)}`;
      return {
        __rawStart: startRaw,
        id: String(stableId),
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
          lead="See the complete weekly schedule of Charlotte-area car shows, Cars & Coffee, cruise-ins, and meets. Updated every week with the latest events, venues, and details for car enthusiasts in Charlotte, NC."
          range="September 22, 2025 – September 28, 2025"
          className="prose lg:prose-lg"
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
