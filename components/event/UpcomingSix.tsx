// components/event/UpcomingSix.tsx
import Link from "next/link";
import eventsData from "../../app/data/events.json";

export const runtime = "nodejs";

export default function UpcomingSix() {
  const now = new Date();
  const events = (eventsData as any[])
    .filter(e => e.status === "PUBLISHED" && new Date(e.startAt) >= now)
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime() || a.title.localeCompare(b.title))
    .slice(0, 6);

  if (!events.length) {
    return <p className="mt-4 text-zinc-400">No upcoming events yet.</p>;
  }

  const fmt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/New_York",
  });

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((e) => (
        <article key={e.id} className="ccs-card">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold leading-snug">
              <Link className="hover:underline" href={`/events/${e.slug}`}>
                {e.title}
              </Link>
            </h3>
            {e.isFeatured && <span className="ccs-badge">Featured</span>}
          </div>

          <p className="mt-1 text-sm text-zinc-400">
            {fmt.format(new Date(e.startAt))}
            {e.venue?.name
              ? ` • ${e.venue.name}${
                  e.venue.city ? `, ${e.venue.city}${e.venue.state ? `, ${e.venue.state}` : ""}` : ""
                }`
              : e.city?.name
              ? ` • ${e.city.name}`
              : ""}
          </p>

          <div className="mt-4 flex gap-2">
            <Link className="ccs-btn" href={`/events/${e.slug}`}>
              Details
            </Link>
            {e.url && (
              <a className="ccs-btn" href={e.url} target="_blank" rel="noreferrer">
                Official
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
