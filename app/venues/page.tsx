// app/venues/page.tsx
import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import venuesData from "../data/venues.json";
import eventsData from "../data/events.json";
import { loadVenues } from "@/lib/data";
import { toEtDate, nowInET } from "@/lib/et";
import { buildBreadcrumbListSchema } from "@/lib/eventSchema";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SearchBox } from "@/components/search/SearchBox";
import dynamic from "next/dynamic";
const AdSlot = dynamic(() => import("@/components/ads/AdSlot"), { ssr: false });

export const metadata: Metadata = {
  title: "All Charlotte Car Show Venues | Charlotte Car Shows",
  description:
    "Browse all Charlotte-area car show venues, including locations for Cars & Coffee, meets, cruise-ins, and automotive events.",
  alternates: { canonical: "https://charlottecarshows.com/venues/" },
  openGraph: {
    type: "website",
    title: "All Charlotte Car Show Venues",
    description:
      "Browse all Charlotte-area car show venues, including locations for Cars & Coffee, meets, cruise-ins, and automotive events.",
    url: "https://charlottecarshows.com/venues/",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Charlotte Car Show Venues",
    description:
      "Browse all Charlotte-area car show venues, including locations for Cars & Coffee, meets, cruise-ins, and automotive events.",
  },
};

type VenueWithEvents = {
  id: string;
  name: string;
  slug: string;
  address1: string | null;
  city: string | null;
  state: string | null;
  postal_code?: string | null;
  url?: string | null;
  upcomingCount: number;
  cityState: string;
};

function VenueCard({ venue }: { venue: VenueWithEvents }) {
  return (
    <article className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow hover:shadow-lg transition-shadow">
      <div className="space-y-3">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold leading-tight text-[var(--fg)] mb-2">
            <Link href={`/venue/${venue.slug}/`} className="hover:text-brand-600 transition-colors">
              {venue.name}
            </Link>
          </h2>
          <div className="flex items-start gap-2 text-sm md:text-base text-[var(--fg)]/70">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-[var(--fg)]/60 mt-0.5 flex-shrink-0" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              {venue.address1 && <div>{venue.address1}</div>}
              <div>{venue.cityState}</div>
              {venue.postal_code && <div className="text-sm text-[var(--fg)]/60">{venue.postal_code}</div>}
            </div>
          </div>
        </div>

        {venue.upcomingCount > 0 && (
          <div className="pt-2 border-t border-[var(--fg)]/10">
            <Link
              href={`/venue/${venue.slug}/`}
              className="inline-flex items-center gap-2 text-sm md:text-base text-brand-600 hover:text-brand-700 font-medium"
              aria-label={`View ${venue.upcomingCount} upcoming event${venue.upcomingCount !== 1 ? 's' : ''} at ${venue.name}`}
            >
              <svg className="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {venue.upcomingCount} upcoming event{venue.upcomingCount !== 1 ? "s" : ""}
            </Link>
          </div>
        )}

        <div className="pt-2">
          <Link
            href={`/venue/${venue.slug}/`}
            className="inline-flex items-center justify-center rounded-xl bg-brand-600 text-white px-4 py-2 text-sm font-semibold hover:bg-brand-700 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30 w-full"
            aria-label={`View details for ${venue.name}`}
          >
            View Venue Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default async function VenuesPage() {
  const venues = (venuesData as any[]) || [];
  const events = (eventsData as any[]) || [];
  const nowET = nowInET();

  // Count upcoming events per venue
  const venuesWithEvents: VenueWithEvents[] = venues
    .map((v) => {
      const upcomingCount = events.filter((e) => {
        if (e.status !== "PUBLISHED") return false;
        const matchesSlug = e.venue?.slug === v.slug;
        const matchesId = e.venue?.id === v.id || e.venueId === v.id;
        const startsAt = toEtDate(e.startAt);
        const isFuture = startsAt ? startsAt >= nowET : false;
        return (matchesSlug || matchesId) && isFuture;
      }).length;

      const cityState = [v.city, v.state].filter(Boolean).join(", ") || "";

      return {
        id: v.id,
        name: v.name,
        slug: v.slug,
        address1: v.address1,
        city: v.city,
        state: v.state,
        postal_code: v.postal || v.postal_code || null,
        url: v.url,
        upcomingCount,
        cityState,
      };
    })
    .sort((a, b) => {
      // Sort by upcoming event count (desc), then alphabetically by name
      if (b.upcomingCount !== a.upcomingCount) {
        return b.upcomingCount - a.upcomingCount;
      }
      return a.name.localeCompare(b.name);
    });

  // Group by city for display
  const venuesByCity = venuesWithEvents.reduce((acc, venue) => {
    const city = venue.city || "Other";
    if (!acc[city]) acc[city] = [];
    acc[city].push(venue);
    return acc;
  }, {} as Record<string, VenueWithEvents[]>);

  const cities = Object.keys(venuesByCity).sort();

  // Build BreadcrumbList schema
  const breadcrumbSchema = buildBreadcrumbListSchema(
    [{ label: "Home", href: "/" }, { label: "Venues", current: true }],
    { currentPageUrl: "https://charlottecarshows.com/venues/" }
  );

  // Build JSON-LD ItemList for venues (Place schemas)
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "All Charlotte Car Show Venues",
    description: "Browse all Charlotte-area car show venues",
    numberOfItems: venuesWithEvents.length,
    itemListElement: venuesWithEvents.slice(0, 100).map((venue, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Place",
        name: venue.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: venue.address1 || undefined,
          addressLocality: venue.city || undefined,
          addressRegion: venue.state || undefined,
          postalCode: venue.postal_code || undefined,
        },
        url: `https://charlottecarshows.com/venue/${venue.slug}/`,
      },
    })),
  };

  return (
    <Container>
      <section className="w-full space-y-8 lg:space-y-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Venues", current: true }]} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />

        <header className="space-y-2 text-left">
          <h1
            className="text-3xl font-bold tracking-tight text-[var(--fg)] lg:text-[34px]"
            style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
          >
            All Charlotte Car Show Venues
          </h1>
          <p className="max-w-3xl text-base text-[var(--fg)]/70 lg:text-[15px]">
            Browse all Charlotte-area car show venues, including locations for Cars & Coffee, meets, cruise-ins, and automotive events. Find venues by location, view upcoming events, and get directions.
          </p>
        </header>

        <div className="mb-6 md:mb-8">
          <div className="max-w-xl">
            <SearchBox />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-8 lg:col-span-8">
            {cities.map((city) => {
              const cityVenues = venuesByCity[city];
              return (
                <div key={city} className="space-y-5">
                  <div className="flex items-center gap-3" role="separator" aria-label={`Venues in ${city}`}>
                    <div className="h-px flex-1 bg-[var(--fg)]/10" aria-hidden="true" />
                    <h2 className="text-lg md:text-xl font-semibold text-[var(--fg)] uppercase tracking-wide">
                      {city}
                    </h2>
                    <div className="h-px flex-1 bg-[var(--fg)]/10" aria-hidden="true" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    {cityVenues.map((venue) => (
                      <VenueCard key={venue.id} venue={venue} />
                    ))}
                  </div>
                </div>
              );
            })}
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
      </section>
    </Container>
  );
}

