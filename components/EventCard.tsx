"use client";
import React from "react";
import Link from "next/link";

type EventBase = {
  id: string | number;
  slug?: string;
  title?: string;
  startAt?: string;
  description?: string | null;
  url?: string | null;
  isFeatured?: boolean;
  venue?: { name?: string | null; city?: string | null; state?: string | null; slug?: string | null };
  city?: { name?: string | null };
};

function isValidUrl(u?: any) {
  return typeof u === "string" && /^\s*https?:\/\//i.test(u.trim());
}

function truncate(s?: string | null, n = 220) {
  if (!s) return "";
  return s.length <= n ? s : s.slice(0, n).replace(/\s+\S*$/, "") + "…";
}

export default function EventCard({ event }: { event: EventBase }) {
  const e = event;
  const tfmt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/New_York",
  });

  const when = e.startAt ? tfmt.format(new Date(String(e.startAt))) : "";

  // Build venueLine (sanitize control chars & stray year)
  let venueLine = "";
  if (e.venue) {
    const name = e.venue?.name ?? "";
    const cityState = [e.venue?.city, e.venue?.state].filter(Boolean).join(", ");
    venueLine = [name, cityState].filter(Boolean).join(" • ");
  } else if (e.city?.name) {
    venueLine = e.city.name;
  }
  if (venueLine) {
    venueLine = String(venueLine).replace(/[\u0000-\u001F\u007F]+/g, "").replace(/\b2022\b/g, "").trim();
  }

  const eventSlug = e.slug ?? String(e.id);

  return (
    <>
      <article className="ccs-card group transition-all hover:shadow-lg hover:scale-[1.01] w-full">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-6 w-full">
          <div className="min-w-0 space-y-2 w-full">
            <div>
              <div className="flex items-start gap-3 flex-wrap">
                <h2 className="text-xl font-semibold text-[var(--fg)]">
                  <Link href={`/events/${eventSlug}`} className="hover:text-green-600 transition-colors">
                    {e.title}
                  </Link>
                </h2>
                {e.isFeatured && <span className="ccs-badge">Featured</span>}
              </div>

              <div className="mt-2 border-t border-[var(--fg)]/10" />

              <p className="mt-2 pt-2 text-base text-[var(--fg)]/60 flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                <span className="inline-flex items-center gap-2">
                  <svg className="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="whitespace-nowrap">{when}</span>
                </span>

                {venueLine && (
                  <span className="inline-flex items-center gap-2">
                    <span className="hidden md:inline text-[var(--fg)]/40">•</span>
                    <svg className="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{venueLine}</span>
                  </span>
                )}
              </p>
            </div>

            {e.description && (
              <p className="text-sm md:text-base text-[var(--fg)]/70 leading-relaxed">
                {truncate(e.description)}
              </p>
            )}
          </div>

          <div className="shrink-0 flex flex-col gap-2 mt-4 md:mt-0 w-full md:w-auto">
            <Link
              className="ccs-btn-primary px-4 py-2 group-hover:scale-105 transition-transform w-full md:w-auto"
              href={`/events/${eventSlug}/`}
            >
              View Details
            </Link>

            {isValidUrl(e.url) && (
              <a
                className="ccs-btn px-4 py-2.5 w-full md:w-auto"
                href={String(e.url)}
                target="_blank"
                rel="noreferrer noopener"
              >
                Official Site
              </a>
            )}
          </div>
        </div>
      </article>
    </>
  );
}