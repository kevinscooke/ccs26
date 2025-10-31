import Link from "next/link";
import type { Metadata } from "next";
import EventListCard from "@/components/event/EventListCard";
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
    "Charlotte AutoFair 2026 at Charlotte Motor Speedway: Southeast's largest collector car swap meet. Find classic car parts, vintage memorabilia, and project vehicles. Over 10,000 vendor spaces. April dates and parking info.",
  alternates: { canonical: "https://charlottecarshows.com/events/charlotte-autofair" },
  openGraph: {
    title: "Charlotte AutoFair 2026 — Dates, Schedule, Location",
    description:
      "Join thousands at the Southeast's largest automotive swap meet. Classic cars, parts, and memorabilia at Charlotte Motor Speedway.",
    url: "https://charlottecarshows.com/events/charlotte-autofair",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Charlotte AutoFair 2026",
    description: "Southeast's largest collector car swap meet. 10,000+ vendor spaces at Charlotte Motor Speedway.",
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
            Discover classic cars, swap meet treasures, and automotive parts at the region&apos;s largest collector car gathering. Three days of buying, selling, and celebrating automotive history.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-8 lg:col-span-8">
            {/* Quick Info Card - Condensed About + Location */}
            <section className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow">
              <div className="space-y-4">
                {/* Location */}
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--fg)]/60 mt-0.5 flex-shrink-0" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-[var(--fg)] text-sm md:text-base mb-1">Location</p>
                    <p className="text-[var(--fg)]/80 text-sm md:text-base">{VENUE_NAME}</p>
                    <p className="text-[var(--fg)]/70 text-sm">{VENUE_ADDRESS}, Concord, NC</p>
                  </div>
                </div>

                {/* Parking */}
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--fg)]/60 mt-0.5 flex-shrink-0" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 002 2h10a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V6a3 3 0 013-3h4a3 3 0 013 3v3" />
                  </svg>
                  <div>
                    <p className="font-semibold text-[var(--fg)] text-sm md:text-base mb-1">Parking</p>
                    <p className="text-[var(--fg)]/80 text-sm md:text-base">Extensive on-site parking. Early arrival recommended. RV parking available. Access via I-85 (Exit 49).</p>
                  </div>
                </div>

                {/* Event Description */}
                <div className="pt-2 border-t border-[var(--fg)]/10">
                  <p className="text-[var(--fg)]/80 text-sm md:text-base leading-relaxed">
                    Discover rare automotive parts, vintage memorabilia, project cars, and finished classics at this massive three-day swap meet and collector car marketplace. Perfect for serious collectors and casual browsers.
                  </p>
                </div>
              </div>
            </section>

            {/* 2026 Schedule - Primary CTA */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">{TARGET_YEAR} Schedule</h2>

              {upcomingTargetYear.length > 0 && (
                <div className="space-y-4">
                  {upcomingTargetYear.map((e) => (
                    <EventListCard key={e.id} e={e} />
                  ))}
                </div>
              )}

              {pastTargetYear.length > 0 && (
                <>
                  <h3 className="text-xl font-semibold mt-6">Earlier in {TARGET_YEAR}</h3>
                  <div className="space-y-4">
                    {pastTargetYear.map((e) => (
                      <EventListCard key={e.id} e={e} />
                    ))}
                  </div>
                </>
              )}

              {upcomingTargetYear.length === 0 && pastTargetYear.length === 0 && (
                <p className="text-[var(--fg)]/70">No {TARGET_YEAR} events listed yet. Check back soon.</p>
              )}
            </section>

            {/* Map - Mobile only (shown in main content) */}
            <section className="lg:hidden bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow">
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
                <a href={OFFICIAL_SITE_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-3 py-1.5 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30">
                  Official Site
                </a>
                <a href={directionsHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-3 py-1.5 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30">
                  Get Directions
                </a>
              </div>
            </section>

            {pastOtherYears.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Past Years</h2>
                <div className="space-y-4">
                  {pastOtherYears.map((e) => (
                    <EventListCard key={e.id} e={e} />
                  ))}
                </div>
              </section>
            )}

            {/* Extended About - After schedule for SEO */}
            <section className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow">
              <h2 className="text-2xl font-semibold mb-3">About Charlotte AutoFair</h2>
              <p className="text-[var(--fg)]/80">
                Charlotte AutoFair transforms Charlotte Motor Speedway into the Southeast&apos;s largest collector car marketplace, attracting thousands of vendors, buyers, and enthusiasts from across the region. This spring event spans three days (typically Thursday through Saturday) and features over 10,000 vendor spaces, making it one of the most significant automotive swap meets in the United States.
              </p>
              <p className="text-[var(--fg)]/80 mt-4">
                Whether you&apos;re searching for rare parts, vintage memorabilia, project cars, or finished classics, AutoFair offers something for every collector. The event combines a massive swap meet with curated classic car displays, creating an unmatched atmosphere for automotive enthusiasts. Many vendors specialize in specific makes, eras, or restoration needs, making it the perfect destination for serious collectors and casual browsers alike.
              </p>
              <h3 className="text-xl font-semibold mt-5">Venue & Parking Details</h3>
              <p className="text-[var(--fg)]/80">
                Charlotte AutoFair takes place at <strong>{VENUE_NAME}</strong> in Concord, located at <strong>{VENUE_ADDRESS}</strong>. The Speedway offers extensive on-site parking with easy access to vendor areas. Early arrival is recommended, especially on opening day, as parking fills quickly. The venue is accessible from I-85 (Exit 49) and offers RV parking for attendees traveling from out of town. Use the map in the sidebar or click Get Directions for navigation assistance.
              </p>
            </section>
          </div>

          <aside className="hidden lg:block space-y-4 lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            {/* Map - Desktop only (in sidebar above ad) */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow">
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
                <a href={OFFICIAL_SITE_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-3 py-1.5 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30">
                  Official Site
                </a>
                <a href={directionsHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-3 py-1.5 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30">
                  Get Directions
                </a>
              </div>
            </div>
            
            {/* Ad Slot - Desktop only (mobile has top/bottom ads already) */}
            <div className="flex items-center justify-center">
              <AdSlot
                slot="7335717776"
                sizes={[
                  { media: "(min-width: 1024px)", width: 300, height: 600 }, // desktop skyscraper only
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
