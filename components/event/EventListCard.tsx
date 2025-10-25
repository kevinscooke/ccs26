import React from "react";
import Link from "next/link";
import { toEtDate } from "@/lib/et";

type EventLike = {
  id?: string | number;
  slug: string;
  title: string;
  startAt: string | number | Date;
  endAt?: string | number | Date | null;
  isFeatured?: boolean;
  description?: string | null;
  url?: string | null;
  venue?: { name?: string; city?: string; state?: string } | null;
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

export default function EventListCard({ e }: { e: EventLike }) {
  const desc = (e.description || "").toString().trim();
  const descShort = desc.length > 220 ? desc.slice(0, 220).replace(/\s+\S*$/, "") + "…" : desc;

  const dt = toEtDate(e.startAt) ?? new Date(e.startAt as any);
  const dateLabel = dateFmt.format(dt);
  const timeLabel = timeFmt.format(dt);

  const officialUrl = isValidHttp(e.url) ? e.url!.trim() : null;

  const hasVenue = Boolean(e.venue?.name || e.venue?.city || e.venue?.state);
  const cityState = [e.venue?.city, e.venue?.state].filter(Boolean).join(", ");
  const venueText = [e.venue?.name, cityState].filter(Boolean).join(" • ");

  return (
    <article className="ccs-card group transition-all hover:shadow-lg hover:scale-[1.01]">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6">
        <div className="min-w-0 space-y-3">
          <div>
            <div className="flex items-start gap-3 flex-wrap">
              <h2 className="text-[20px] md:text-[22px] font-semibold leading-tight text-[var(--fg)]">
                <Link href={`/events/${e.slug}`} className="hover:text-green-600 transition-colors">
                  {e.title}
                </Link>
              </h2>
              {e.isFeatured && <span className="ccs-badge">Featured</span>}
            </div>

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
                  <span className="truncate">{venueText}</span>
                </div>
              )}
            </div>
          </div>

          {desc && (
            <p className="text-[13.5px] md:text-[15px] text-[var(--fg)]/70 leading-relaxed">
              {descShort}
            </p>
          )}
        </div>

        <div className="shrink-0 flex flex-col gap-3 mt-4 md:mt-0 w-full md:w-auto">
          <Link className="ccs-btn-primary px-5 py-2.5 group-hover:scale-105 transition-transform w-full md:w-auto" href={`/events/${e.slug}`}>
            View Details
          </Link>
          {officialUrl && (
            <a className="ccs-btn px-5 py-2.5 w-full md:w-auto" href={officialUrl} target="_blank" rel="noreferrer">
              Official Site
            </a>
          )}
        </div>
      </div>
    </article>
  );
}