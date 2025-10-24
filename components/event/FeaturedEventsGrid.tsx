import Image from "next/image";
import Link from "next/link";
import { loadEvents } from "@/lib/data";
import { parseToETDate } from "@/lib/formatET";

function eventImage(event: any): string | null {
  return (
    event?.heroImage?.url ||
    event?.coverImage?.url ||
    event?.featuredImage?.url ||
    event?.image?.url ||
    event?.imageUrl ||
    null
  );
}

function clean(str?: string | null) {
  if (!str) return "";
  return str.replace(/[\x00-\x1F\x7F]+/g, " ").replace(/\s+/g, " ").trim();
}

export default async function FeaturedEventsGrid() {
  const eventsData = await loadEvents();

  const featured = (eventsData as any[])
    .filter((event) => event?.status === "PUBLISHED" && event?.isFeatured)
    .map((event) => {
      const start = parseToETDate(event?.startAt);
      return start ? { event, start } : null;
    })
    .filter(
      (value): value is { event: any; start: Date } => Boolean(value)
    )
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, 4);

  if (!featured.length) {
    return (
      <div className="py-12 text-center text-gray-500">
        <p>No featured events at this time.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {featured.map(({ event, start }) => {
        const dateLabel = start.toLocaleString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
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
        const description = clean(
          event?.summary || event?.excerpt || event?.description || ""
        );
        const img = eventImage(event);

        return (
          <Link
            key={event.id ?? event.slug}
            href={`/events/${event.slug}/`}
            className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-400 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-500">
              {img ? (
                <Image
                  src={img}
                  alt={event.title}
                  fill
                  priority={false}
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 1280px) 18vw, (min-width: 1024px) 22vw, (min-width: 768px) 33vw, 100vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-5xl text-white/80">
                  🚗
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-70 transition group-hover:opacity-90" />
              <span className="absolute top-3 right-3 rounded-full bg-emerald-300 px-3 py-1 text-xs font-semibold text-emerald-900 shadow">
                Featured
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-3 px-5 py-5">
              <h3 className="text-lg font-bold text-gray-900 transition group-hover:text-emerald-700">
                {event.title}
              </h3>

              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <span aria-hidden>📅</span>
                  {dateLabel}
                  <span className="text-gray-400">•</span>
                  {timeLabel}
                </p>
                {location && (
                  <p className="flex items-center gap-2">
                    <span aria-hidden>📍</span>
                    <span className="truncate">{location}</span>
                  </p>
                )}
              </div>

              {description && (
                <p className="line-clamp-3 text-sm text-gray-500">{description}</p>
              )}

              <div className="mt-auto flex items-center justify-between text-sm font-semibold text-emerald-600 transition group-hover:text-emerald-800">
                <span>View event</span>
                <span aria-hidden>→</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}