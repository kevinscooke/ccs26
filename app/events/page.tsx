// app/events/page.tsx  (All events index - 1 column preserved)
import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { loadEvents } from "@/lib/data";
import Container from '@/components/Container';
import EventCard from "@/components/EventCard";

// Use runtime loader so /events stays in sync with V2 JSON (no rebuild needed)

export const metadata: Metadata = {
  title: "All Charlotte Car Shows | Charlotte Car Shows",
  description:
    "Browse all upcoming Charlotte-area car shows, Cars & Coffee, meets, cruise-ins, and track nights.",
  alternates: { canonical: "https://charlottecarshows.com/events/" },
  openGraph: {
    type: "website",
    title: "All Charlotte Car Shows",
    description:
      "All upcoming Charlotte-area car shows, Cars & Coffee, meets, cruise-ins, and track nights.",
  url: "https://charlottecarshows.com/events/",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Charlotte Car Shows",
    description:
      "All upcoming Charlotte-area car shows, Cars & Coffee, meets, cruise-ins, and track nights.",
  },
};
function isValidUrl(u: any): u is string {
  return typeof u === "string" && /^\s*https?:\/\//i.test(u.trim());
}

export default async function EventsAllPage() {
  const now = new Date();
  const eventsData = await loadEvents();
  type EventType = typeof eventsData[number];
  const events = (eventsData as EventType[])
    .filter((e: EventType) => e.status === "PUBLISHED" && new Date(e.startAt) >= now)
    .sort((a: EventType, b: EventType) =>
      new Date(a.startAt).getTime() - new Date(b.startAt).getTime() ||
      a.title.localeCompare(b.title)
    )
    // sanitize URL field so a non-http value won't render as a site link
    .map(e => ({ ...e, url: isValidUrl(e.url) ? e.url.trim() : null }));

  // --- JSON-LD: ItemList of event detail URLs (good for discovery on list pages) ---
  // Keep it reasonable in size; cap at 100 items to avoid huge script tags.
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
  itemListElement: events.slice(0, 100).map((e: EventType, i: number) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://charlottecarshows.com/events/${e.slug}`,
      name: e.title,
    })),
  };

  const tfmt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/New_York",
  });

  const truncate = (s?: string | null, n = 220) =>
    !s ? "" : s.length <= n ? s : s.slice(0, n).replace(/\s+\S*$/, "") + "…";

  const urlFor = (p: number) => (p <= 1 ? "/events/" : `/events/page/${p}/`);

  const monthFmt = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "America/New_York",
  });

  // track last rendered month when mapping events
  let lastMonth: string | null = null;

  return (
    <Container>
      <section className="w-full space-y-12">
  {/* Top ad intentionally removed to avoid reserved space above hero */}
    {/* Breadcrumbs */}
    <nav aria-label="Breadcrumb" className="text-sm text-[var(--fg)]/60 mb-0">
        <ol className="flex items-center gap-2 flex-wrap">
          <li><Link href="/" className="hover:underline text-[var(--fg)]">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-[var(--fg)]/80">All Events</li>
        </ol>
      </nav>
      {/* JSON-LD in body is fine with the App Router */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />

  <header className="text-center space-y-2 mt-1">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--fg)]" 
            style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}>
          All Charlotte Car Shows
        </h1>
        <p className="text-lg text-[var(--fg)]/70 max-w-2xl mx-auto">
          Browse upcoming Cars &amp; Coffee, meets, cruise-ins, and automotive events across the Charlotte area.
        </p>
      </header>

      <div className="space-y-6">
        {events.slice(0, 15).map((e: EventType) => {
            const monthLabel = monthFmt.format(new Date(e.startAt));
            const showMonth = monthLabel !== lastMonth;
            lastMonth = monthLabel;

            return (
              <React.Fragment key={e.id}>
                {showMonth && (
                  <div className="flex items-center gap-3 my-6" key={`m-${monthLabel}`}>
                    <div className="h-px flex-1 bg-[var(--fg)]/10" />
                    <div className="text-sm uppercase tracking-wide text-[var(--fg)]/60">{monthLabel}</div>
                    <div className="h-px flex-1 bg-[var(--fg)]/10" />
                  </div>
                )}
                <EventCard event={e} />
              </React.Fragment>
            );
      })}
      </div>
      {/* Pagination Controls */}
      <nav className="flex justify-center gap-2 mt-8" aria-label="Pagination">
  <Link href="/events/past/" className="ccs-btn px-4 py-2">Previous events</Link>
  <Link href="/events/page/2/" className="ccs-btn px-4 py-2">Next Page</Link>
      </nav>
  <div
          dangerouslySetInnerHTML={{
            __html: `
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1514406406537630" crossorigin="anonymous"></script>
<!-- CCS-2026 -->
<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-1514406406537630" data-ad-slot="7335717776" data-ad-format="auto" data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
`
          }}
        />
      </section>
    </Container>
  );
}
