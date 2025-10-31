import eventsData from "../data/events.json";
import venuesData from "../data/venues.json";

const PAGE_SIZE = 15;

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://charlottecarshows.com';
  const fallbackLastmod = process.env.LAST_MODIFIED || new Date().toISOString();
  const now = new Date();

  // Events (single pages)
  type EventAny = any;
  const allEvents = (eventsData as EventAny[]);
  const events = allEvents.filter((e) => e.status === 'PUBLISHED' && new Date(e.startAt) >= now);
  const eventUrls = events
    .map((e) => {
      const updated = e.updatedAt || e.updatedAt || e.updatedAt || fallbackLastmod;
      const lastmod = new Date(updated || fallbackLastmod).toISOString();
      return `<url><loc>${base}/events/${e.slug}/</loc><changefreq>daily</changefreq><lastmod>${lastmod}</lastmod></url>`;
    })
    .join('');

  // Paginated event index pages (page 1 is /events)
  const totalPages = Math.max(1, Math.ceil(events.length / PAGE_SIZE));
  const paginatedUrls = Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => {
    const p = i + 2; // pages start at 2 for /events/page/2
    return `<url><loc>${base}/events/page/${p}/</loc><changefreq>weekly</changefreq><lastmod>${fallbackLastmod}</lastmod></url>`;
  }).join('');

  // Venues
  const venues = (venuesData as any[]);
  const venueUrls = venues
    .map((v) => {
      const updated = v.updated_at || v.updatedAt || fallbackLastmod;
      const lastmod = new Date(updated || fallbackLastmod).toISOString();
      // FIX: plural -> singular
      return `<url><loc>${base}/venue/${v.slug}/</loc><changefreq>weekly</changefreq><lastmod>${lastmod}</lastmod></url>`;
    })
    .join('');

  const marketingUrls = `
    <url><loc>${base}/events/charlotte-auto-show/</loc><changefreq>weekly</changefreq><lastmod>${fallbackLastmod}</lastmod></url>
  `;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n    <url><loc>${base}/</loc><lastmod>${fallbackLastmod}</lastmod></url>\n    <url><loc>${base}/events/</loc><lastmod>${fallbackLastmod}</lastmod></url>\n    <url><loc>${base}/venues/</loc><lastmod>${fallbackLastmod}</lastmod></url>\n    <url><loc>${base}/guide-to-charlotte-car-shows/</loc><lastmod>${fallbackLastmod}</lastmod></url>\n    <url><loc>${base}/resources/</loc><lastmod>${fallbackLastmod}</lastmod></url>\n    <url><loc>${base}/weekly-car-show-list-charlotte/</loc><lastmod>${fallbackLastmod}</lastmod></url>\n    <url><loc>${base}/contact/</loc><lastmod>${fallbackLastmod}</lastmod></url>\n    <url><loc>${base}/submit-event/</loc><lastmod>${fallbackLastmod}</lastmod></url>\n    <url><loc>${base}/terms/</loc><lastmod>${fallbackLastmod}</lastmod></url>\n    ${eventUrls}\n    ${paginatedUrls}\n    ${venueUrls}\n    ${marketingUrls}\n  </urlset>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
