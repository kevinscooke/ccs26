import Link from "next/link";
// Use the same card as /events (NOT the compact one in components/event/)
import EventCard from "@/components/EventCard";
import eventsData from "@/app/data/events.json";

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
    "Your comprehensive guide to the Charlotte Auto Show: dates, schedule (Thu–Sun), location, parking, and ticket info. Browse this year’s events and past shows.",
  alternates: { canonical: "/events/charlotte-auto-show/" },
  openGraph: {
    title: "Charlotte Auto Show — Dates, Schedule, Location",
    description:
      "Plan your trip to the Charlotte Auto Show. See this year’s schedule, map, and official links. Browse past events.",
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Charlotte Auto Show Events",
    itemListElement: thisYearEvents.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://www.charlottecarshows.com/events/${e.slug}/`,
      item: {
        "@type": "Event",
        name: e.title,
        startDate: e.startAt,
        endDate: e.endAt || e.startAt,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: e.venue?.name || VENUE_NAME,
          address: {
            "@type": "PostalAddress",
            streetAddress: e.venue?.address1 || VENUE_ADDRESS.split(",")[0],
            addressLocality: e.venue?.city || "Charlotte",
            addressRegion: e.venue?.state || "NC",
            postalCode: e.venue?.postal_code || "28202",
            addressCountry: "US",
          },
        },
      },
    })),
  };

  return (
    <main className="container max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumbs only (no List/Week/Day toggle) */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[var(--fg)]/70">
        <ol className="flex items-center gap-1">
          <li><Link href="/" className="hover:underline">Home</Link></li>
          <li className="px-1">/</li>
          <li><Link href="/events/" className="hover:underline">Events</Link></li>
          <li className="px-1">/</li>
          <li aria-current="page" className="font-medium text-[var(--fg)]">Charlotte Auto Show</li>
        </ol>
      </nav>

      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Charlotte Auto Show</h1>
        <p className="text-lg text-[var(--fg)]/80 mt-3">
          Dates, schedule, location, and guide for the Charlotte Auto Show. Typically runs Thu–Sun.
        </p>
      </header>

      {/* This Year's Schedule */}
      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold">{currentYear} Schedule</h2>

        {upcomingThisYear.length > 0 && (
          <div className="space-y-4">
            {upcomingThisYear.map((e) => (
              <EventCard key={e.id} e={e} />   // if /events uses event={e}, swap to event={e}
            ))}
          </div>
        )}

        {pastThisYear.length > 0 && (
          <>
            <h3 className="text-xl font-semibold mt-6">Earlier this year</h3>
            <div className="space-y-4">
              {pastThisYear.map((e) => (
                <EventCard key={e.id} e={e} /> // or event={e} to match /events
              ))}
            </div>
          </>
        )}

        {upcomingThisYear.length === 0 && pastThisYear.length === 0 && (
          <p className="text-[var(--fg)]/70">No {currentYear} events listed yet. Check back soon.</p>
        )}
      </section>

      {/* Location + Map */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <article className="lg:col-span-2 ccs-card">
          <h2 className="text-2xl font-semibold mb-3">About the Charlotte Auto Show</h2>
          <p className="text-[var(--fg)]/80">
            The Charlotte Auto Show features new model debuts, specialty exhibits, and family-friendly attractions in Uptown Charlotte.
            Expect hands-on displays, show-only offers, and a weekend schedule that typically runs Thursday through Sunday.
          </p>
          <h3 className="text-xl font-semibold mt-5">Location & Parking</h3>
          <p className="text-[var(--fg)]/80">
            {VENUE_NAME}, {VENUE_ADDRESS}. Use the map or the Get Directions button for turn-by-turn navigation.
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
            <a href={OFFICIAL_SITE_URL} target="_blank" rel="noreferrer" className="ccs-btn px-3 py-1.5">Official Site</a>
            <a href={directionsHref} target="_blank" rel="noreferrer" className="ccs-btn px-3 py-1.5">Get Directions</a>
          </div>
        </aside>
      </section>

      {pastOtherYears.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Past Years</h2>
          <div className="space-y-4">
            {pastOtherYears.map((e) => (
              <EventCard key={e.id} e={e} /> // or event={e}
            ))}
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}