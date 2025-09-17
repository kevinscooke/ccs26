import { NextResponse } from 'next/server';

export const revalidate = 86400;

export function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return new NextResponse(`User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml`, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
