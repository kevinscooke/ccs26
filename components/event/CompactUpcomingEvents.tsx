import Link from "next/link";
import { loadEvents } from "@/lib/data";
import { parseToETDate } from "@/lib/formatET";

function clean(str?: string | null) {
  if (!str) return "";
  return str.replace(/[\x00-\x1F\x7F]+/g, " ").replace(/\s+/g, " ").trim();
}

export default async function CompactUpcomingEvents() {
  const eventsData = await loadEvents();
  const now = Date.now();

  const upcoming = (eventsData as any[])
    .filter((event) => event?.status === "PUBLISHED")
    .map((event) => {
      const start = parseToETDate(event?.startAt);
      return start ? { event, start } : null;
    })
    .filter((value): value is { event: any; start: Date } => Boolean(value))
    .filter(({ start }) => start.getTime() >= now)
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, 6);

  if (!upcoming.length) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>No upcoming events found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {upcoming.map(({ event, start }) => {
        const month = start.toLocaleString("en-US", {
          month: "short",
          timeZone: "America/New_York",
        });
        const day = start.toLocaleString("en-US", {
          day: "numeric",
          timeZone: "America/New_York",
        });
        const weekday = start.toLocaleString("en-US", {
          weekday: "short",
          timeZone: "America/New_York",
        });
        const timeLabel = start.toLocaleString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZone: "America/New_York",
        });

        const venueName = clean(event?.venue?.name);
        const cityName = clean(event?.city?.name || event?.venue?.city);
        const location = [venueName, cityName].filter(Boolean).join(", ");

        return (
          <Link
            key={event.id ?? event.slug}
            href={`/events/${event.slug}/`}
            className="group flex items-start gap-3 rounded-xl border border-gray-200 bg-white/90 p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          >
            <div className="flex w-14 flex-col items-center justify-center rounded-md bg-emerald-600 py-1.5 text-white shadow">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-white/80">
                {weekday}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
                {month}
              </span>
              <span className="text-xl font-extrabold leading-none">{day}</span>
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <h3 className="text-[13px] font-semibold leading-snug text-gray-900 transition group-hover:text-emerald-700">
                {event.title}
              </h3>
              <div className="space-y-1 text-[11px] text-gray-600 leading-snug">
                <p className="flex items-center gap-1">
                  <span aria-hidden>🕒</span>
                  {timeLabel}
                </p>
                {location && (
                  <p className="flex items-start gap-1">
                    <span aria-hidden>📍</span>
                    <span className="break-words">{location}</span>
                  </p>
                )}
              </div>
              <p className="text-[11px] font-semibold text-emerald-600 transition group-hover:text-emerald-800">
                Event details →
              </p>
            </div>
          </Link>
        );
      })}

      <div className="border-t border-gray-200 pt-3">
        <Link
          href="/events/"
          className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-800"
        >
          View all events →
        </Link>
      </div>
    </div>
  );
}