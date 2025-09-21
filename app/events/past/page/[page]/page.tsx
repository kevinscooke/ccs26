import React from "react";
import Link from "next/link";
import GoogleAd from "@/components/ui/GoogleAd";
import eventsData from "../../../../data/events.json";

const PAGE_SIZE = 15;

export function generateStaticParams() {
  const now = new Date();
  type EventType = typeof eventsData[number];
  const past = (eventsData as EventType[])
    .filter((e: EventType) => e.status === "PUBLISHED" && new Date(e.startAt) < now)
    .sort((a: EventType, b: EventType) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime() || a.title.localeCompare(b.title));

  const totalPages = Math.ceil(past.length / PAGE_SIZE);
  const pages: Array<{ page: string }> = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push({ page: String(i) });
  }
  return pages;
}

export default function PastEventsPage({ params }: { params: { page: string } }) {
  const now = new Date();
  const pageNum = Math.max(1, parseInt(params.page, 10) || 1);
  type EventType = typeof eventsData[number];
  const past = (eventsData as EventType[])
    .filter((e: EventType) => e.status === "PUBLISHED" && new Date(e.startAt) < now)
    .sort((a: EventType, b: EventType) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime() || a.title.localeCompare(b.title));

  const start = (pageNum - 1) * PAGE_SIZE;
  const paginated = past.slice(start, start + PAGE_SIZE);
  const totalPages = Math.ceil(past.length / PAGE_SIZE);

  const tfmt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/New_York",
  });

  return (
    <section className="max-w-5xl mx-auto px-4 space-y-8">
  {/* Top ad intentionally removed to avoid reserved space above hero */}
      <header className="text-center space-y-4">
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
        {pageNum > 1 && (
          <Link href={pageNum === 2 ? "/events/past" : `/events/past/page/${pageNum - 1}`} className="ccs-btn px-4 py-2">Previous</Link>
        )}
        {Array.from({ length: totalPages }, (_, i) => (
          <Link
            key={i + 1}
            href={i === 0 ? "/events/past" : `/events/past/page/${i + 1}`}
            className={`ccs-btn px-4 py-2${i + 1 === pageNum ? " ccs-btn-primary" : ""}`}
            aria-current={i + 1 === pageNum ? "page" : undefined}
          >
            {i + 1}
          </Link>
        ))}
        {pageNum < totalPages && (
          <Link href={`/events/past/page/${pageNum + 1}`} className="ccs-btn px-4 py-2">Next</Link>
        )}
      </nav>
    </section>
  );
}
