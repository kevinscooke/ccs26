// app/venue/[slug]/page.tsx

// Import a static snapshot so Next can prebuild venue pages during export.
// This mirrors how `app/events/[slug]/page.tsx` imports `data/events.json`.
import Link from 'next/link';
import venuesData from '../../data/venues.json';
import eventsData from '../../data/events.json';

export function generateStaticParams() {
  const venues = (venuesData as any[]) || [];
  return venues.map((v: any) => ({ slug: v.slug }));
}

export default function VenuePage({ params }: { params: { slug: string } }) {
  const venues = (venuesData as any[]) || [];
  const events = (eventsData as any[]) || [];
  const venue = venues.find((v) => v.slug === params.slug);
  if (!venue) return <div className="p-4">Venue not found</div>;

  const now = new Date();
  const upcoming = events
    .filter((e) => {
      // match by enriched venue slug or by id / venueId
      const matchesSlug = e.venue?.slug === venue.slug;
      const matchesId = e.venue?.id === venue.id || e.venueId === venue.id;
      const isPublished = e.status === 'PUBLISHED';
      const startsAt = e.startAt ? new Date(e.startAt) : null;
      const isFuture = startsAt ? startsAt >= now : false;
      return isPublished && (matchesSlug || matchesId) && isFuture;
    })
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
    .slice(0, 8);

  const fmt = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'America/New_York',
  });

  const mapQuery = [venue.address1, venue.city, venue.state].filter(Boolean).join(', ') || venue.name || 'Charlotte, NC';

  return (
    <main className="max-w-6xl mx-auto p-4 space-y-6">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">{venue.name}</h1>
        {venue.description && <p className="text-lg text-[var(--fg)]/80">{venue.description}</p>}
        <div className="text-sm text-[var(--fg)]/70">
          {venue.address1 && <div>{venue.address1}</div>}
          <div>{[venue.city, venue.state, venue.postal_code].filter(Boolean).join(', ')}</div>
          {venue.url && (
            <a className="underline" href={venue.url} target="_blank" rel="noreferrer">Website</a>
          )}
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Upcoming events at {venue.name}</h2>
          {upcoming.length === 0 ? (
            <p className="text-zinc-500">No upcoming events listed for this venue.</p>
          ) : (
            <div className="space-y-4">
              {upcoming.map((e: any) => (
                <article key={e.id} className="ccs-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        <Link href={`/events/${e.slug}`} className="hover:underline">
                          {e.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-zinc-500 mt-1">{fmt.format(new Date(e.startAt))}</p>
                    </div>
                    <div className="text-sm text-zinc-400">
                      {e.isFeatured && <span className="ccs-badge">Featured</span>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="ccs-card">
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
        </aside>
      </section>
    </main>
  );
}
