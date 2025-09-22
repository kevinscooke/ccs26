// components/event/UpcomingSix.tsx
import Link from "next/link";
import { loadEvents } from "@/lib/data";
import { Calendar, MapPin } from "lucide-react";

export default async function UpcomingSix() {
  const now = new Date();
  const eventsData = await loadEvents();
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
        <article key={e.id} className="ccs-card flex flex-col items-stretch gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold leading-snug truncate text-center sm:text-left">
              <Link className="hover:underline" href={`/events/${e.slug}`}>
                {e.title}
              </Link>
            </h3>

            <p className="mt-2 text-sm text-zinc-500 flex items-center justify-center gap-2 sm:justify-start sm:text-left">
              <Calendar className="w-4 h-4 text-zinc-400" />
              <span>{fmt.format(new Date(e.startAt))}</span>
            </p>

            {/* Location */}
            {(() => {
              function clean(str?: string | null) {
                if (!str) return "";
                return str.replace(/[\x00-\x1F\x7F]+/g, " ").replace(/\s+/g, " ").trim();
              }

              const venueName = clean(e.venue?.name || null);
              const cityName = clean(e.city?.name || e.venue?.city || null);
              const parts = [venueName, cityName].filter(Boolean);
              if (parts.length) {
                return (
                  <p className="mt-1 text-sm text-zinc-500 flex items-center justify-center gap-2 sm:justify-start sm:text-left">
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    <span>{parts.join(', ')}</span>
                  </p>
                );
              }
              return null;
            })()}

            {/* Short description (sanitized + truncated) */}
            {(() => {
              function clean(str?: string | null) {
                if (!str) return "";
                return str.replace(/[\x00-\x1F\x7F]+/g, " ").replace(/\s+/g, " ").trim();
              }
              function truncate(s: string, n = 140) {
                if (!s) return "";
                return s.length > n ? s.slice(0, n - 1).trim() + '…' : s;
              }

              const raw = clean(e.description || e.summary || e.excerpt || "");
              if (!raw) return null;
              return (
                <p className="mt-2 text-sm text-zinc-500 text-center sm:text-left">{truncate(raw, 140)}</p>
              );
            })()}
          </div>

          <div className="mt-3">
            <Link
              className="ccs-btn w-full justify-center block text-center"
              href={`/events/${e.slug}`}
            >
              Details
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
