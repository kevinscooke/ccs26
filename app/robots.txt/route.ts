// app/robots.txt/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    // Disallow typical non-content paths if you have them:
    // "Disallow: /search/",
    // "Disallow: /assets/",
    "",
    "Sitemap: https://charlottecarshows.com/sitemap.xml",
    "",
  ].join("\n");

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
