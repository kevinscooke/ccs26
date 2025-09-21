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
                  {/* Sanitize venue fields to remove control chars and stray '2022' */}
                  {(() => {
                    function clean(str?: string | null) {
                      if (!str) return "";
                      return str.replace(/[\u0000-\u001F\u007F]|2022/g, "").trim();
                    }
                    if (e.venue?.name) {
                      let venue = clean(e.venue.name);
                      let city = clean(e.venue.city);
                      let state = clean(e.venue.state);
                      let parts = [venue];
                      if (city) parts.push(city);
                      if (state) parts.push(state);
                      return ` • ${parts.filter(Boolean).join(", ")}`;
                    } else if (e.city?.name) {
                      return ` • ${clean(e.city.name)}`;
                    } else {
                      return "";
                    }
                  })()}
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
