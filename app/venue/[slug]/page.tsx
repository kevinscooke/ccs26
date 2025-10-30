// app/venue/[slug]/page.tsx

// Import a static snapshot so Next can prebuild venue pages during export.
// This mirrors how `app/events/[slug]/page.tsx` imports `data/events.json`.
import Link from 'next/link';
import venuesData from '../../data/venues.json';
import eventsData from '../../data/events.json';
import EventCard from '@/components/event/EventCard'; // adjust path if needed
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Container from '@/components/Container';
import Breadcrumbs from '@/components/Breadcrumbs';
import { buildEventItemListSchema, buildBreadcrumbListSchema } from '@/lib/eventSchema';
import { toEtDate, nowInET } from '@/lib/et';

export const dynamic = 'force-static';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const venues = (venuesData as any[]) || [];
  const v = venues.find((x) => x.slug === params.slug);
  const canonical = `https://charlottecarshows.com/venue/${params.slug}/`;
  if (!v) {
    return {
      title: 'Venue not found',
      alternates: { canonical },
    };
  }
  const city = v.city || 'Charlotte';
  const state = v.state || 'NC';
  const name = v.name || 'Venue';
  const rawDesc =
    v.description ||
    `${name} in ${city}, ${state}. Upcoming car show events, address, and map.`;
  const description = String(rawDesc).replace(/\s+/g, ' ').slice(0, 155);
  const image = '/images/hero-ccs.jpg';
  const title = `${name} – ${city}, ${state}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: [{ url: image }],
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image',
      images: [image],
    },
  };
}

export function generateStaticParams() {
  const venues = (venuesData as any[]) || [];
  return venues.map((v: any) => ({ slug: v.slug }));
}

export default function VenuePage({ params }: { params: { slug: string } }) {
  const venues = (venuesData as any[]) || [];
  const events = (eventsData as any[]) || [];
  const venue = venues.find((v) => v.slug === params.slug);
  if (!venue) notFound();

  // ET helpers to keep consistent with the rest of the site
  const nowET = nowInET();

  const upcoming = events
    .filter((e) => {
      const matchesSlug = e.venue?.slug === venue.slug;
      const matchesId = e.venue?.id === venue.id || e.venueId === venue.id;
      const isPublished = e.status === 'PUBLISHED';
      const startsAt = toEtDate(e.startAt);
      const isFuture = startsAt ? startsAt >= nowET : false;
      return isPublished && (matchesSlug || matchesId) && isFuture;
    })
    .sort((a, b) => {
      const ta = toEtDate(a.startAt)?.getTime() ?? 0;
      const tb = toEtDate(b.startAt)?.getTime() ?? 0;
      return ta - tb || a.title.localeCompare(b.title);
    })
    .slice(0, 8);

  // NEW: Past events for this venue (most recent first)
  const past = events
    .filter((e) => {
      const matchesSlug = e.venue?.slug === venue.slug;
      const matchesId = e.venue?.id === venue.id || e.venueId === venue.id;
      const isPublished = e.status === 'PUBLISHED';
      const startsAt = toEtDate(e.startAt);
      const isPast = startsAt ? startsAt < nowET : false;
      return isPublished && (matchesSlug || matchesId) && isPast;
    })
    .sort((a, b) => {
      const ta = toEtDate(a.startAt)?.getTime() ?? 0;
      const tb = toEtDate(b.startAt)?.getTime() ?? 0;
      return tb - ta || a.title.localeCompare(b.title);
    })
    .slice(0, 10); // show the 10 most recent past events

  const fmt = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'America/New_York',
  });

  const mapQuery = [venue.address1, venue.city, venue.state].filter(Boolean).join(', ') || venue.name || 'Charlotte, NC';

  // --- JSON-LD for Place + ItemList of upcoming events ---
  const canonical = `https://charlottecarshows.com/venue/${venue.slug}/`;
  const placeId = `${canonical}#place`;
  const postal =
    (venue as any).postal_code ??
    (venue as any).postal ??
    (venue as any).postalCode ??
    undefined;
  const lat =
    (venue as any).lat ?? (venue as any).latitude ?? undefined;
  const lng =
    (venue as any).lng ?? (venue as any).longitude ?? undefined;
  const placeLd: any = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    '@id': placeId,
    name: venue.name,
    url: canonical,
    ...(venue.url ? { sameAs: [venue.url] } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: venue.address1 || undefined,
      addressLocality: venue.city || undefined,
      addressRegion: venue.state || undefined,
      postalCode: postal,
      addressCountry: 'US',
    },
    ...(lat != null && lng != null
      ? { geo: { '@type': 'GeoCoordinates', latitude: lat, longitude: lng } }
      : {}),
  };
  // Build standardized Event schema ItemList
  const itemListLd = buildEventItemListSchema(upcoming.slice(0, 100) as any[], {
    name: `Upcoming events at ${venue.name}`,
    limit: 100,
  });

  // Build BreadcrumbList schema
  const breadcrumbSchema = buildBreadcrumbListSchema(
    [
      { label: "Home", href: "/" },
      { label: "Venues", href: "/venues/" },
      { label: venue.name, current: true },
    ],
    { currentPageUrl: canonical }
  );

  return (
    <Container>
      <section className="w-full space-y-8 lg:space-y-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Venues", href: "/venues/" },
            { label: venue.name, current: true },
          ]}
        />

        <header className="space-y-2 text-left">
          <h1
            className="text-3xl font-bold tracking-tight text-[var(--fg)] lg:text-[34px]"
            style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
          >
            {venue.name}
          </h1>
          {venue.description && (
            <p className="max-w-3xl text-base text-[var(--fg)]/70 lg:text-[15px]">{venue.description}</p>
          )}
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-5 lg:col-span-8">
            <h2 className="text-2xl font-semibold mb-4">Upcoming events at {venue.name}</h2>
            {upcoming.length === 0 ? (
              <div className="ccs-card text-[var(--fg)]/70">No upcoming events listed for this venue.</div>
            ) : (
              <div className="space-y-5">
                {upcoming.map((e: any) => (
                  <EventCard key={e.id} e={e} />
                ))}
              </div>
            )}

            {/* NEW: Past events section */}
            {past.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold mt-10 mb-4">Past events at {venue.name}</h2>
                <div className="space-y-5">
                  {past.map((e: any) => (
                    <EventCard key={e.id} e={e} />
                  ))}
                </div>
              </>
            )}
          </div>

          <aside className="space-y-4 lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            <div className="ccs-card">
          <h3 className="text-xl font-semibold mb-3">Location</h3>
              <div className="text-sm text-[var(--fg)]/70 mb-4">
                {venue.address1 && <div>{venue.address1}</div>}
                <div>{[venue.city, venue.state, venue.postal_code].filter(Boolean).join(', ')}</div>
                {venue.url && (
                  <div className="mt-2">
                    <a className="underline" href={venue.url} target="_blank" rel="noreferrer">Website</a>
                  </div>
                )}
              </div>

              <div className="aspect-[16/9] w-full overflow-hidden rounded-md border">
                <iframe
                  title={`Map for ${venue.name}`}
                  width="100%"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                />
              </div>
            </div>
          </aside>
        </div>

        {/* JSON-LD schemas */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(placeLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        {upcoming.length > 0 && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
        )}
      </section>
    </Container>
  );
}
