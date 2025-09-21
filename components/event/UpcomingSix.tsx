// components/event/UpcomingSix.tsx
import Link from "next/link";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

function loadEventsSync(): any[] {
  // Try public/data/events.json, then app/data/events.json, then public/events.json
  const candidates = [
    path.join(process.cwd(), "public", "data", "events.json"),
    path.join(process.cwd(), "app", "data", "events.json"),
    path.join(process.cwd(), "public", "events.json"),
  ];

  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, "utf8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (err) {
      // ignore and try next
    }
  }

  return [];
}

export default function UpcomingSix() {
  const now = new Date();
  const eventsData = loadEventsSync();
  const events = (eventsData as any[])
    .filter((e) => e.status === "PUBLISHED" && new Date(e.startAt) >= now)
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
  <article key={e.id} className="ccs-card flex flex-col sm:flex-row items-start gap-4">
          {/* date pill - hidden on small screens */}
          <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 rounded-md bg-zinc-900 text-white text-xs font-semibold">
            <div className="text-sm">{new Date(e.startAt).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</div>
            <div className="text-lg leading-none">{new Date(e.startAt).getDate()}</div>
          </div>

          <div className="min-w-0 flex-1 order-1">
            <div className="flex items-start gap-3">
              <h3 className="text-lg font-semibold leading-snug truncate">
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
                // Remove C0 control chars, DEL, and any standalone 4-digit year between 1900-2099
                function clean(str?: string | null) {
                  if (!str) return "";
                  return (
                    str
                      // strip control chars (0x00-0x1F) and DEL (0x7F)
                      .replace(/[\x00-\x1F\x7F]+/g, " ")
                      // remove standalone years like 2022, 1999, 2030
                      .replace(/\b(19\d{2}|20\d{2})\b/g, " ")
                      // collapse whitespace and trim
                      .replace(/\s+/g, " ")
                      .trim()
                  );
                }

                if (e.venue?.name) {
                  let venue = clean(e.venue.name);
                  let city = clean(e.venue.city);
                  let state = clean(e.venue.state);
                  const parts = [venue, city, state].filter(Boolean);
                  return parts.length ? ` • ${parts.join(", ")}` : "";
                } else if (e.city?.name) {
                  const c = clean(e.city.name);
                  return c ? ` • ${c}` : "";
                } else {
                  return "";
                }
              })()}
            </p>
          </div>

          {/* Make the details button full-width on small screens to avoid overflow/viewport issues
              and switch to auto width on sm+ so it sits inline on desktop. */}
          {/* Ensure the Details button appears below the event info on small screens
              (order-2), but returns to inline/side position on sm+ displays. */}
          <div className="order-2 mt-3 sm:mt-0 sm:ml-4 sm:flex-shrink-0 w-full sm:w-auto sm:order-none sm:self-start">
            <Link className="ccs-btn w-full sm:w-auto justify-center" href={`/events/${e.slug}`}>
              Details
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
