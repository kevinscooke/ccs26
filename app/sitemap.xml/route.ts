import { NextResponse } from 'next/server';
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const revalidate = 86400;

export async function GET() {
  const prisma = await getPrisma();
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const lastmod = process.env.LAST_MODIFIED || new Date().toISOString();
  const events = await prisma.event.findMany({ select: { slug: true, updatedAt: true } });
  const urls = events.map(e => `<url><loc>${base}/events/${e.slug}</loc><changefreq>daily</changefreq><lastmod>${e.updatedAt.toISOString()}</lastmod></url>`).join('');
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
  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } });
}
