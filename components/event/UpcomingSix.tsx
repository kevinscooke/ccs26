// components/event/UpcomingSix.tsx
import Link from "next/link";
import { loadEvents } from "@/lib/data";
import { Calendar, MapPin } from "lucide-react";
import { formatDateET, parseToETDate } from "@/lib/formatET";

export default async function UpcomingSix() {
  const now = Date.now();
  const eventsData = await loadEvents();
  const events = (eventsData as any[])
    .filter(
      (e) =>
        e.status === "PUBLISHED" &&
        (parseToETDate(e.startAt)?.getTime() ?? Infinity) >= now
    )
    .sort(
      (a, b) =>
        (parseToETDate(a.startAt)?.getTime() ?? 0) -
          (parseToETDate(b.startAt)?.getTime() ?? 0) ||
        a.title.localeCompare(b.title)
    )
    .slice(0, 6);

  if (!events.length) {
    return <p className="mt-4 text-zinc-400">No upcoming events yet.</p>;
  }

  // display using ET-aware formatter

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full">
      {events.map((e) => (
        <article key={e.id} className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow flex flex-col gap-3 w-full max-w-md mx-auto">
          <div className="min-w-0 break-words w-full">
            <h3 className="text-base font-semibold leading-snug text-center sm:text-left break-words">
              <Link className="hover:underline" href={`/events/${e.slug}/`}>
                {e.title}
              </Link>
            </h3>

            <p className="mt-2 text-sm text-zinc-500 flex items-center justify-center gap-2 sm:justify-start sm:text-left break-words">
              <Calendar className="w-4 h-4 text-zinc-400" />
              <span>{formatDateET(e.startAt)}</span>
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
                  <p className="mt-1 text-sm text-zinc-500 flex items-center justify-center gap-2 sm:justify-start sm:text-left break-words">
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
                <p className="mt-2 text-sm text-zinc-500 text-center sm:text-left break-words">{truncate(raw, 140)}</p>
              );
            })()}
          </div>

          <div className="mt-3 flex justify-center">
            <Link
              className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30 w-full max-w-xs text-center"
              href={`/events/${e.slug}/`}
            >
              Details
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
