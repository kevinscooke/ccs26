import Link from "next/link";
import type { Metadata } from "next";
// Use the same card as /events (NOT the compact one in components/event/)
import EventListCard from "@/components/event/EventListCard";
import eventsData from "@/app/data/events.json";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import { buildEventItemListSchema, buildBreadcrumbListSchema } from "@/lib/eventSchema";
import dynamic from "next/dynamic";

const AdSlot = dynamic(() => import("@/components/ads/AdSlot"), { ssr: false });

const SERIES_SLUG = "charlotte-auto-show";
const OFFICIAL_SITE_URL = "https://www.charlotteautoshow.com";

// Use string IDs, comma-separated
const CURRENT_YEAR_EVENT_IDS: Array<string | number> = [
  "cmfnekzek0000q5h0gcuuw7lc", // Thu
  "f11fdd83-6fec-49d3-b5e4-e13e0783891b", // Fri
  // add Sat/Sun IDs if desired
];

const VENUE_NAME = "Charlotte Convention Center";
const VENUE_ADDRESS = "501 S College St, Charlotte, NC 28202";

function toET(x: string | number | Date) {
  return new Date(new Date(x).toLocaleString("en-US", { timeZone: "America/New_York" }));
}

export const metadata = {
  title: "Charlotte Auto Show: Dates, Schedule, Location, and Guide",
  description:
    "Plan your visit to the Charlotte Auto Show at Charlotte Convention Center. See new vehicles, test drives, manufacturer displays, and exclusive show-only offers. Browse schedules, parking info, and directions.",
  alternates: { canonical: "/events/charlotte-auto-show/" },
  openGraph: {
    title: "Charlotte Auto Show — Dates, Schedule, Location",
    description:
      "Explore the latest vehicles and automotive technology at Charlotte's premier auto show. Located in Uptown at the Charlotte Convention Center.",
    url: "/events/charlotte-auto-show/",
    type: "website",
  },
};

export default function CharlotteAutoShowPage() {
  const now = toET(new Date());
  const currentYear = now.getFullYear();

  type E = (typeof eventsData)[number];

  // Union of ID and slug matches, de-duped
  const idsSet = new Set(CURRENT_YEAR_EVENT_IDS.map(String));
  const seriesEventsAll = (eventsData as E[]).filter((e) => {
    const idMatch = idsSet.size > 0 && idsSet.has(String(e.id));
    const slugMatch = String(e.slug || "").toLowerCase().includes(SERIES_SLUG);
    return idMatch || slugMatch;
  });
  const seriesEvents: E[] = Array.from(
    new Map(seriesEventsAll.map((e) => [String(e.id), e])).values()
  );

  const thisYearEvents = seriesEvents.filter(
    (e) => toET(e.startAt).getFullYear() === currentYear
  );

  const upcomingThisYear = thisYearEvents
    .filter((e) => toET(e.startAt) >= now)
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

  const pastThisYear = thisYearEvents
    .filter((e) => toET(e.startAt) < now)
    .sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime());

  const pastOtherYears = seriesEvents
    .filter((e) => toET(e.startAt).getFullYear() < currentYear)
    .sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime())
    .slice(0, 12);

  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${VENUE_NAME}, ${VENUE_ADDRESS}`
  )}`;
  const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    `${VENUE_NAME}, ${VENUE_ADDRESS}`
  )}&output=embed`;

  // Build standardized Event schema ItemList
  const jsonLd = buildEventItemListSchema(thisYearEvents as any[], {
    name: "Charlotte Auto Show Events",
    limit: 100,
  });

  // Build BreadcrumbList schema
  const breadcrumbSchema = buildBreadcrumbListSchema(
    [
      { label: "Home", href: "/" },
      { label: "Events", href: "/events/" },
      { label: "Charlotte Auto Show", current: true },
    ],
    { currentPageUrl: "https://charlottecarshows.com/events/charlotte-auto-show/" }
  );

  return (
    <Container>
      <section className="w-full space-y-8 lg:space-y-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Events", href: "/events/" },
            { label: "Charlotte Auto Show", current: true },
          ]}
        />

        <header className="space-y-2 text-left">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--fg)] lg:text-[34px]" style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}>
            Charlotte Auto Show
          </h1>
          <p className="max-w-3xl text-base text-[var(--fg)]/70 lg:text-[15px]">
            Explore the latest vehicles, meet industry experts, and experience interactive displays at Charlotte&apos;s premier automotive showcase in Uptown.
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
                    <p className="text-[var(--fg)]/70 text-sm">{VENUE_ADDRESS}, Uptown Charlotte</p>
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
                    <p className="text-[var(--fg)]/80 text-sm md:text-base">Multiple decks and lots nearby. Valet available. LYNX light rail accessible.</p>
                  </div>
                </div>

                {/* Event Description */}
                <div className="pt-2 border-t border-[var(--fg)]/10">
                  <p className="text-[var(--fg)]/80 text-sm md:text-base leading-relaxed">
                    Experience hands-on demonstrations, exclusive show-only offers, and specialty exhibits featuring electric vehicles, luxury models, trucks, and SUVs. Open to both industry professionals and families.
                  </p>
                </div>
              </div>
            </section>

            {/* This Year's Schedule - Primary CTA */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">{currentYear} Schedule</h2>

              {upcomingThisYear.length > 0 && (
                <div className="space-y-4">
                  {upcomingThisYear.map((e) => (
                    <EventListCard key={e.id} e={e} />
                  ))}
                </div>
              )}

              {pastThisYear.length > 0 && (
                <>
                  <h3 className="text-xl font-semibold mt-6">Earlier this year</h3>
                  <div className="space-y-4">
                    {pastThisYear.map((e) => (
                      <EventListCard key={e.id} e={e} />
                    ))}
                  </div>
                </>
              )}

              {upcomingThisYear.length === 0 && pastThisYear.length === 0 && (
                <p className="text-[var(--fg)]/70">No {currentYear} events listed yet. Check back soon.</p>
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
                <a href={OFFICIAL_SITE_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-3 py-1.5 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30">Official Site</a>
                <a href={directionsHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-3 py-1.5 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30">Get Directions</a>
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
              <h2 className="text-2xl font-semibold mb-3">About the Charlotte Auto Show</h2>
              <p className="text-[var(--fg)]/80">
                The Charlotte Auto Show brings the automotive industry to the heart of the Queen City, showcasing the latest new vehicle models, cutting-edge technology, and interactive experiences for all ages. Held annually at the Charlotte Convention Center, this four-day event typically runs Thursday through Sunday, offering both industry professionals and families opportunities to explore hundreds of vehicles from leading manufacturers.
              </p>
              <p className="text-[var(--fg)]/80 mt-4">
                Visitors can expect manufacturer displays, hands-on demonstrations, test drive opportunities, and exclusive show-only incentives. The event features specialty exhibits highlighting electric vehicles, luxury models, trucks, and SUVs, making it the region&apos;s most comprehensive automotive showcase.
              </p>
              <h3 className="text-xl font-semibold mt-5">Location & Parking Information</h3>
              <p className="text-[var(--fg)]/80">
                The Charlotte Auto Show takes place at the <strong>{VENUE_NAME}</strong>, located at <strong>{VENUE_ADDRESS}</strong> in Uptown Charlotte. The Convention Center is easily accessible via I-77 and I-277, with multiple parking decks and surface lots within walking distance. Valet parking is available, and public transportation options include the LYNX light rail. Use the interactive map in the sidebar or click Get Directions for turn-by-turn navigation from your location.
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
                <a href={OFFICIAL_SITE_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-3 py-1.5 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30">Official Site</a>
                <a href={directionsHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-3 py-1.5 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30">Get Directions</a>
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