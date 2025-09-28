import Link from "next/link";
import EventCard from "@/components/EventCard";
import eventsData from "@/app/data/events.json";

const PAGE_SIZE = 15;

export default function PastEventsPage() {
  const now = new Date();

  type EventType = (typeof eventsData)[number];
  const pastEvents = (eventsData as EventType[])
    .filter((e) => new Date(e.startAt) < now)
    .sort(
      (a, b) =>
        new Date(b.startAt).getTime() - new Date(a.startAt).getTime() ||
        a.title.localeCompare(b.title)
    );

  const page = 1;
  const totalPages = Math.max(1, Math.ceil(pastEvents.length / PAGE_SIZE));
  const items = pastEvents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section className="container max-w-7xl mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-12">
        <h1
          className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--fg)]"
          style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
        >
          Past Charlotte Car Shows
        </h1>
        <p className="text-xl text-[var(--fg)]/70 max-w-2xl mx-auto mt-4">
          Browse previously listed events.
        </p>
      </header>

      <div className="space-y-6 mb-12">
        {items.map((e) => (
          // Use the same prop as other pages
          <EventCard key={e.id} e={e} />
        ))}

        {items.length === 0 && (
          <div className="text-center py-12 text-[var(--fg)]/70">
            No past events found.
          </div>
        )}
      </div>

      {/* Pagination Controls (same structure/classes as /events) */}
      <nav className="flex justify-center gap-2 mt-8" aria-label="Pagination">
        <Link href="/events/" className="ccs-btn px-4 py-2">
          Upcoming events
        </Link>
        {totalPages > 1 ? (
          <Link href="/events/past/page/2/" className="ccs-btn px-4 py-2">
            Next Page
          </Link>
        ) : (
          <span className="ccs-btn px-4 py-2 opacity-50 pointer-events-none">
            Next Page
          </span>
        )}
      </nav>
    </section>
  );
}