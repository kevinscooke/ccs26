// app/robots.txt/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const body = [
    "User-agent: *",
    "Disallow: /*?w=",
    "Allow: /",
    "Sitemap: https://charlottecarshows.com/sitemap.xml"
  ].join("\n");

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
