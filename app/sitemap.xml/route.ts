import { NextResponse } from 'next/server';
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const revalidate = 86400;

export async function GET() {
  const prisma = await getPrisma();
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const events = await prisma.event.findMany({ /* minimal fields */ });
  const urls = events.map(e => `<url><loc>${base}/events/${e.slug}</loc><changefreq>daily</changefreq></url>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>${base}/</loc></url>
    <url><loc>${base}/events</loc></url>
    <url><loc>${base}/guide-to-charlotte-car-shows</loc></url>
    ${urls}
  </urlset>`;
  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } });
}
