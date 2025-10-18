import React from "react";
import { Calendar } from "lucide-react";
import { toEtDate, formatDateET, formatTimeET } from "@/lib/et";
import Link from "next/link";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[\s/]+/g, "-").replace(/[^a-z0-9-]+/g, "").replace(/-+/g, "-");
}

type EventLike = {
  id?: string | number;
  slug?: string;
  title?: string;
  startAt: string | number | Date;
  endAt?: string | number | Date | null;
  descriptionShort?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  tags?: string[] | null;
  venue?: {
    name?: string | null;
    slug?: string | null;
    city?: string | null;
    state?: string | null;
  };
};

export default function EventCard(props: { e?: EventLike; event?: EventLike }) {
  const e = props.e ?? props.event;
  if (!e) return null;

  const start = toEtDate(e.startAt);
  const dateLabel = formatDateET(start);
  const timeLabel = formatTimeET(start);

  const href = e.slug ? `/events/${e.slug}/` : undefined;

  const venueName = e.venue?.name ?? null;
  const venueSlug = e.venue?.slug ?? (venueName ? slugify(venueName) : null);
  const venueHref = venueSlug ? `/venue/${venueSlug}/` : undefined;

  const desc =
    (e as any).shortDescription ??
    e.descriptionShort ??
    e.description ??
    "";

  const descShort = String(desc).replace(/\s+/g, " ").slice(0, 180);

  return (
    <article className="ccs-card">
      <div className="flex flex-col gap-2">
        <div className="text-sm text-[var(--fg)]/70">
          {dateLabel} • {timeLabel}
        </div>

        {href ? (
          <h3 className="text-lg font-semibold">
            <Link className="hover:underline" href={href}>
              {e.title ?? "Untitled event"}
            </Link>
          </h3>
        ) : (
          <h3 className="text-lg font-semibold">{e.title ?? "Untitled event"}</h3>
        )}

        {descShort && <p className="text-[var(--fg)]/80">{descShort}</p>}

        {venueName && (
          <div className="text-sm text-[var(--fg)]/70">
            📍{" "}
            {venueHref ? (
              <Link className="hover:underline" href={venueHref}>
                {venueName}
              </Link>
            ) : (
              venueName
            )}
            {e.venue?.city
              ? ` — ${e.venue.city}${e.venue.state ? ", " + e.venue.state : ""}`
              : ""}
          </div>
        )}

        {Array.isArray(e.tags) && e.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {e.tags.slice(0, 5).map((t) => (
              <span key={t} className="ccs-badge">
                {t}
              </span>
            ))}
          </div>
        )}

        {href && (
          <div className="mt-2">
            <Link href={href} className="ccs-btn">
              Event details
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}