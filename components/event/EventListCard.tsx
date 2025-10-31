import React from "react";
import Link from "next/link";
import { toEtDate } from "@/lib/et";

type EventLike = {
  id?: string | number;
  slug?: string;
  title?: string;
  startAt: string | number | Date;
  endAt?: string | number | Date | null;
  isFeatured?: boolean;
  description?: string | null;
  descriptionShort?: string | null;
  shortDescription?: string | null;
  url?: string | null;
  tags?: string[] | null;
  venue?: { name?: string; city?: string; state?: string; slug?: string | null } | null;
};

function isValidHttp(u: any): u is string {
  return typeof u === "string" && /^\s*https?:\/\//i.test(u.trim());
}

const dateFmt = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone: "America/New_York",
});

const timeFmt = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/New_York",
});

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[\s/]+/g, "-").replace(/[^a-z0-9-]+/g, "").replace(/-+/g, "-");
}

export default function EventListCard({ 
  e, 
  disableVenueLink = false 
}: { 
  e: EventLike;
  disableVenueLink?: boolean;
}) {
  if (!e || !e.startAt) return null;

  // Handle multiple description fields (for backward compatibility with EventCard)
  const desc =
    (e as any).shortDescription ??
    e.descriptionShort ??
    e.description ??
    "";
  const descStr = String(desc).trim();
  const descShort = descStr.length > 220 ? descStr.slice(0, 220).replace(/\s+\S*$/, "") + "…" : descStr;

  const dt = toEtDate(e.startAt) ?? new Date(e.startAt as any);
  const dateLabel = dateFmt.format(dt);
  const timeLabel = timeFmt.format(dt);

  const officialUrl = isValidHttp(e.url) ? e.url!.trim() : null;

  const hasVenue = Boolean(e.venue?.name || e.venue?.city || e.venue?.state);
  const cityState = [e.venue?.city, e.venue?.state].filter(Boolean).join(", ");
  const venueText = [e.venue?.name, cityState].filter(Boolean).join(" • ");

  // Handle optional slug (for backward compatibility with EventCard)
  const slug = e.slug || (e.title ? slugify(e.title) : null);
  const eventHref = slug ? `/events/${slug}/` : null;
  const eventTitle = e.title || "Untitled event";

  // Handle venue slug for linking
  const venueName = e.venue?.name ?? null;
  const venueSlug = e.venue?.slug ?? (venueName ? slugify(venueName) : null);
  const venueHref = venueSlug ? `/venue/${venueSlug}/` : null;

  return (
    <article
      className={`bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow group transition-all hover:shadow-lg hover:scale-[1.01] ${e.isFeatured ? "ring-1 ring-green-200" : ""}`}
      data-featured={e.isFeatured ? "true" : "false"}
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6">
        <div className="min-w-0 space-y-3">
          <div>
            <div className="flex items-start gap-3 flex-wrap">
              <h2 className="text-[20px] md:text-[22px] font-semibold leading-tight text-[var(--fg)]">
                {eventHref ? (
                  <Link href={eventHref} className="hover:text-green-600 transition-colors">
                    {eventTitle}
                  </Link>
                ) : (
                  <span>{eventTitle}</span>
                )}
              </h2>
            </div>

            {e.isFeatured && (
              <div className="mt-2 flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-1.5 text-sm text-green-800">
                {/* Star/burst icon */}
                <svg className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <span className="font-medium">Featured event</span>
              </div>
            )}

            <div className="mt-2 border-t border-[var(--fg)]/10" />

            {/* Meta: date/time first row, location second row */}
            <div className="mt-2 pt-2 space-y-1">
              <div className="flex items-center gap-2 text-sm md:text-[15px] text-[var(--fg)]/70">
                <svg className="w-4 h-4 opacity-70" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="whitespace-nowrap">{dateLabel} • {timeLabel}</span>
              </div>

              {hasVenue && (
                <div className="flex items-center gap-2 text-sm md:text-[14px] text-[var(--fg)]/55">
                  <svg className="w-4 h-4 opacity-60" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {!disableVenueLink && venueHref ? (
                    <Link href={venueHref} className="hover:underline truncate">
                      {venueText}
                    </Link>
                  ) : (
                    <span className="truncate">{venueText}</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {descStr && (
            <p className="text-[13.5px] md:text-[15px] text-[var(--fg)]/70 leading-relaxed">
              {descShort}
            </p>
          )}

          {/* Tags support (optional, for backward compatibility with EventCard) */}
          {Array.isArray(e.tags) && e.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {e.tags.slice(0, 5).map((t) => (
                <span key={t} className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium border border-gray-200">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="shrink-0 flex flex-col gap-3 mt-4 md:mt-0 w-full md:w-auto">
          {eventHref && (
            <Link 
              className="bg-brand-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-brand-700 group-hover:scale-105 transition-transform w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-brand-500/30" 
              href={eventHref}
              aria-label={`View details for ${eventTitle}`}
            >
              View Details
            </Link>
          )}
          {officialUrl && (
            <a 
              className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-800 px-5 py-2.5 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30 w-full md:w-auto" 
              href={officialUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label={`Visit official site for ${eventTitle} (opens in new tab)`}
            >
              Official Site
            </a>
          )}
        </div>
      </div>
    </article>
  );
}