
import eventsData from "../data/events.json";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://charlottecarshows.com';
  const lastmod = process.env.LAST_MODIFIED || new Date().toISOString();
  const events = (eventsData as any[]);
  const urls = events.map(e => `<url><loc>${base}/events/${e.slug}</loc><changefreq>daily</changefreq><lastmod>${new Date(e.updatedAt).toISOString()}</lastmod></url>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>${base}/</loc><lastmod>${lastmod}</lastmod></url>
    <url><loc>${base}/events</loc><lastmod>${lastmod}</lastmod></url>
    <url><loc>${base}/guide-to-charlotte-car-shows</loc><lastmod>${lastmod}</lastmod></url>
    <url><loc>${base}/resources</loc><lastmod>${lastmod}</lastmod></url>
    <url><loc>${base}/weekly-car-show-list-charlotte</loc><lastmod>${lastmod}</lastmod></url>
    <url><loc>${base}/contact</loc><lastmod>${lastmod}</lastmod></url>
    <url><loc>${base}/submit-event</loc><lastmod>${lastmod}</lastmod></url>
    <url><loc>${base}/terms</loc><lastmod>${lastmod}</lastmod></url>
    ${urls}
  </urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
