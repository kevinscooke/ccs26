import Link from "next/link";
import type { Metadata } from "next";
import EventCard from "@/components/EventCard";
import eventsData from "@/app/data/events.json";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import { buildEventItemListSchema, buildBreadcrumbListSchema } from "@/lib/eventSchema";
import { toEtDate, nowInET } from "@/lib/et";
import dynamic from "next/dynamic";

const AdSlot = dynamic(() => import("@/components/ads/AdSlot"), { ssr: false });

const SERIES_SLUG = "charlotte-autofair";
const OFFICIAL_SITE_URL = "https://www.charlottemotorspeedway.com/events/autofair/";

// AutoFair 2026 event IDs
const AUTOFAIR_2026_EVENT_IDS: Array<string> = [
  "7fb39344-1d13-4c45-882f-82ad90aa9e6c", // Thursday
  "3940ada8-c47a-4c41-b4c0-3a856a703b99", // Friday
  "be48d403-c249-4453-8453-77baf66e9954", // Saturday
];

const VENUE_NAME = "Charlotte Motor Speedway";
const VENUE_ADDRESS = "5555 Concord Pkwy S, Concord, NC 28107";
const TARGET_YEAR = 2026; // AutoFair 2026

export const metadata: Metadata = {
  title: "Charlotte AutoFair 2026: Dates, Schedule, Location, and Guide",
  description:
    "Your comprehensive guide to Charlotte AutoFair 2026: dates, schedule (April 9-11), location at Charlotte Motor Speedway, parking, and ticket info. Browse this year's events and past shows.",
  alternates: { canonical: "https://charlottecarshows.com/events/charlotte-autofair" },
  openGraph: {
    title: "Charlotte AutoFair 2026 — Dates, Schedule, Location",
    description:
      "Plan your trip to Charlotte AutoFair 2026. See this year's schedule, map, and official links. Browse past events.",
    url: "https://charlottecarshows.com/events/charlotte-autofair",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Charlotte AutoFair 2026",
    description: "Southeast's premier collector car event at Charlotte Motor Speedway. April 9-11, 2026.",
  },
};

export default function CharlotteAutoFairPage() {
  const now = nowInET();

  type E = (typeof eventsData)[number];

  // Union of ID and slug matches, de-duped
  const idsSet = new Set(AUTOFAIR_2026_EVENT_IDS.map(String));
  const seriesEventsAll = (eventsData as E[]).filter((e) => {
    const idMatch = idsSet.size > 0 && idsSet.has(String(e.id));
    const slugMatch = String(e.slug || "").toLowerCase().includes(SERIES_SLUG);
    return idMatch || slugMatch;
  });
  const seriesEvents: E[] = Array.from(
    new Map(seriesEventsAll.map((e) => [String(e.id), e])).values()
  );

  // Filter for TARGET_YEAR (2026) events
  const targetYearEvents = seriesEvents.filter(
    (e) => (toEtDate(e.startAt)?.getFullYear() ?? 0) === TARGET_YEAR
  );

  const upcomingTargetYear = targetYearEvents
    .filter((e) => (toEtDate(e.startAt) ?? new Date(0)) >= now)
    .sort((a, b) => (toEtDate(a.startAt)?.getTime() ?? 0) - (toEtDate(b.startAt)?.getTime() ?? 0));

  const pastTargetYear = targetYearEvents
    .filter((e) => (toEtDate(e.startAt) ?? new Date(0)) < now)
    .sort((a, b) => (toEtDate(b.startAt)?.getTime() ?? 0) - (toEtDate(a.startAt)?.getTime() ?? 0));

  const pastOtherYears = seriesEvents
    .filter((e) => (toEtDate(e.startAt)?.getFullYear() ?? 0) < TARGET_YEAR)
    .sort((a, b) => (toEtDate(b.startAt)?.getTime() ?? 0) - (toEtDate(a.startAt)?.getTime() ?? 0))
    .slice(0, 12);

  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${VENUE_NAME}, ${VENUE_ADDRESS}`
  )}`;
  const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    `${VENUE_NAME}, ${VENUE_ADDRESS}`
  )}&output=embed`;

  // Build standardized Event schema ItemList
  const jsonLd = buildEventItemListSchema(targetYearEvents as any[], {
    name: "Charlotte AutoFair 2026 Events",
    limit: 100,
  });

  // Build BreadcrumbList schema
  const breadcrumbSchema = buildBreadcrumbListSchema(
    [
      { label: "Home", href: "/" },
      { label: "Events", href: "/events/" },
      { label: "Charlotte AutoFair", current: true },
    ],
    { currentPageUrl: "https://charlottecarshows.com/events/charlotte-autofair" }
  );

  return (
    <Container>
      <section className="w-full space-y-8 lg:space-y-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Events", href: "/events/" },
            { label: "Charlotte AutoFair", current: true },
          ]}
        />

        <header className="space-y-2 text-left">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--fg)] lg:text-[34px]" style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}>
            Charlotte AutoFair 2026
          </h1>
          <p className="max-w-3xl text-base text-[var(--fg)]/70 lg:text-[15px]">
            Dates, schedule, location, and guide for Charlotte AutoFair. The Southeast&apos;s premier collector car event at Charlotte Motor Speedway, typically runs Thursday through Saturday.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-8 lg:col-span-8">
            {/* 2026 Schedule */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">{TARGET_YEAR} Schedule</h2>

              {upcomingTargetYear.length > 0 && (
                <div className="space-y-4">
                  {upcomingTargetYear.map((e) => (
                    <EventCard key={e.id} e={e} />
                  ))}
                </div>
              )}

              {pastTargetYear.length > 0 && (
                <>
                  <h3 className="text-xl font-semibold mt-6">Earlier in {TARGET_YEAR}</h3>
                  <div className="space-y-4">
                    {pastTargetYear.map((e) => (
                      <EventCard key={e.id} e={e} />
                    ))}
                  </div>
                </>
              )}

              {upcomingTargetYear.length === 0 && pastTargetYear.length === 0 && (
                <p className="text-[var(--fg)]/70">No {TARGET_YEAR} events listed yet. Check back soon.</p>
              )}
            </section>

            {/* Location + Map */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <article className="md:col-span-2 ccs-card">
                <h2 className="text-2xl font-semibold mb-3">About Charlotte AutoFair</h2>
                <p className="text-[var(--fg)]/80">
                  Charlotte AutoFair is the Southeast&apos;s premier collector car event—the largest of its kind in the region. 
                  This three-day celebration brings together thousands of automotive enthusiasts, vendors, and classic car 
                  collectors at Charlotte Motor Speedway.
                </p>
                <p className="text-[var(--fg)]/80 mt-4">
                  Expect hundreds of vendor booths, swap meet areas, classic car displays, and automotive memorabilia. 
                  Whether you&apos;re buying, selling, or just browsing, Charlotte AutoFair is a must-attend event for car enthusiasts.
                </p>
                <h3 className="text-xl font-semibold mt-5">Location & Parking</h3>
                <p className="text-[var(--fg)]/80">
                  {VENUE_NAME}, {VENUE_ADDRESS}. Use the map or the Get Directions button for turn-by-turn navigation. 
                  Ample parking is available on-site.
                </p>
              </article>

              <aside className="ccs-card">
                <h3 className="text-xl font-semibold mb-3">Map</h3>
                <div className="aspect-[16/9] w-full overflow-hidden rounded-md border">
                  <iframe
                    title={`Map for ${VENUE_NAME}`}
                    width="100%"
                    height="100%"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={mapEmbedSrc}
                  />
                </div>
                <div className="mt-4 flex gap-3">
                  <a href={OFFICIAL_SITE_URL} target="_blank" rel="noreferrer" className="ccs-btn px-3 py-1.5">
                    Official Site
                  </a>
                  <a href={directionsHref} target="_blank" rel="noreferrer" className="ccs-btn px-3 py-1.5">
                    Get Directions
                  </a>
                </div>
              </aside>
            </section>

            {pastOtherYears.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Past Years</h2>
                <div className="space-y-4">
                  {pastOtherYears.map((e) => (
                    <EventCard key={e.id} e={e} />
                  ))}
                </div>
              </section>
            )}
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

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      </section>
    </Container>
  );
}
