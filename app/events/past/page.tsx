import React from "react";
import Link from "next/link";
// GoogleAd removed
import eventsData from "../../data/events.json";

const PAGE_SIZE = 15;

export function generateStaticParams() {
  // No params for root past page
  return [];
}

export default function PastEventsRoot() {
  // Render first page of past events (page 1)
  return <RedirectToFirstPastPage />;
}

function RedirectToFirstPastPage() {
  // Static link-only page: show the first page of past events content server-side
  const now = new Date();
  type EventType = typeof eventsData[number];
  const past = (eventsData as EventType[])
    .filter((e) => e.status === "PUBLISHED" && new Date(e.startAt) < now)
    .sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime() || a.title.localeCompare(b.title));

  const paginated = past.slice(0, PAGE_SIZE);
  const totalPages = Math.ceil(past.length / PAGE_SIZE);

  const tfmt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/New_York",
  });

  return (
    <section className="w-full px-4 md:px-12 max-w-7xl mx-auto space-y-12 py-6">
  {/* Top ad intentionally removed to avoid reserved space above hero */}
      <header className="text-center space-y-2 mt-1">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--fg)]" style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}>
          Past Charlotte Car Shows
        </h1>
        <p className="text-xl text-[var(--fg)]/70 max-w-2xl mx-auto">
          Browse previously listed events (past dates).
        </p>
      </header>

      <div className="space-y-6">
        {paginated.map((e: any) => (
          <article key={e.id} className="ccs-card group">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-[var(--fg)]">
                <Link href={`/events/${e.slug}`} className="hover:text-green-600 transition-colors">{e.title}</Link>
              </h2>
              <div className="text-sm text-[var(--fg)]/60">{tfmt.format(new Date(e.startAt))}</div>
            </div>
            {e.description && <p className="mt-2 text-[var(--fg)]/70">{e.description}</p>}
          </article>
        ))}
      </div>

      <nav className="flex justify-center gap-2 mt-8" aria-label="Pagination">
        {totalPages > 1 && (
          <Link href="/events/past/page/2/" className="ccs-btn px-4 py-2">Next</Link>
        )}
      </nav>
    </section>
  );
}
