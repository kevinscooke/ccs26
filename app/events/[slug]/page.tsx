// app/events/[slug]/page.tsx
import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import GoogleAd from "@/components/ui/GoogleAd";
import eventsData from "../../data/events.json";

export const dynamic = "force-static";

// --- Metadata per event (title/desc/canonical/OG/Twitter) ---
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const events = (eventsData as any[]) || [];
  const ev = events.find(
    (e) => e.slug === params.slug && e.status === "PUBLISHED"
  );
  if (!ev) {
    return {
      title: "Event not found",
      robots: { index: false, follow: false },
    };
  }

  const city =
    ev.city?.name || ev.venue?.city || "Charlotte";
  const state = ev.venue?.state || "NC";
  const cityState = `${city}, ${state}`;
  const dateLong = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "America/New_York",
  }).format(new Date(ev.startAt));

  const title = `${ev.title} – ${cityState} (${dateLong})`;
  const descBase = `${ev.title} in ${cityState} on ${dateLong}. ${
    (ev.description || "Details, time, venue, and map.").trim()
  }`.replace(/\s+/g, " ");
  const description = descBase.slice(0, 155);
  const canonical = `https://charlottecarshows.com/events/${params.slug}/`;

  const image =
    ev.imageUrl ||
    "/images/hero-ccs.jpg"; // fallback

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description: descBase,
      url: canonical,
      type: "website",
      images: [{ url: image }],
    },
    twitter: {
      title,
      description: descBase,
      card: "summary_large_image",
      images: [image],
    },
  };
}

// Prebuild all event pages
export function generateStaticParams() {
  const events = (eventsData as any[]) || [];
  return events
    .filter((e) => e.status === "PUBLISHED" && e.slug)
    .map((e) => ({ slug: e.slug }));
}

function nowInET() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
  );
}
function startOfWeekET(base: Date) {
  const et = nowInET();
  et.setFullYear(base.getFullYear(), base.getMonth(), base.getDate());
  const day = et.getDay();
  const diffToMonday = (day + 6) % 7;
  et.setDate(et.getDate() - diffToMonday);
  et.setHours(0, 0, 0, 0);
  return et;
}
function fmtAddress(v?: {
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  postal?: string | null;
}) {
  if (!v) return "";
  const parts = [v.address1, v.address2, v.city, v.state, v.postal].filter(
    Boolean
  );
  return parts.join(", ");
}

export default function EventDetail({
  params,
}: {
  params: { slug: string };
}) {
  const events = (eventsData as any[]) || [];
  const ev = events.find(
    (e) => e.slug === params.slug && e.status === "PUBLISHED"
  );
  if (!ev) return <p>Event not found.</p>;

  // New fields w/ safe fallbacks
  const isPaid = typeof ev.isPaid === "boolean" ? ev.isPaid : false;
  const size = typeof ev.size === "number" ? ev.size : undefined;
  const isRecurring =
    typeof ev.isRecurring === "boolean" ? ev.isRecurring : false;
  const isSponsored =
    typeof ev.isSponsored === "boolean" ? ev.isSponsored : false;
  const parkingInfo =
    typeof ev.parkingInfo === "string" ? ev.parkingInfo : "See event details";
  const socialLinks = Array.isArray(ev.socialLinks) ? ev.socialLinks : [];

  // Prev/Next by startAt
  const sortedEvents = events
    .filter((e) => e.status === "PUBLISHED")
    .sort(
      (a, b) =>
        new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
    );
  const idx = sortedEvents.findIndex((e) => e.slug === params.slug);
  const prev = idx > 0 ? sortedEvents[idx - 1] : null;
  const next = idx < sortedEvents.length - 1 ? sortedEvents[idx + 1] : null;

  const addr = fmtAddress(ev.venue ?? undefined);
  const mapQuery = addr || ev.city?.name || "Charlotte, NC";
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapQuery
  )}`;

  const dt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/New_York",
  });

  // Weekly page link (offset from current ET week)
  const eventStart = new Date(ev.startAt);
  const curWeek = startOfWeekET(nowInET());
  const evWeek = startOfWeekET(eventStart);
  const diffMs = evWeek.getTime() - curWeek.getTime();
  const weekOffset = Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));
  const weeklyHref = weekOffset
    ? `/weekly-car-show-list-charlotte?w=${weekOffset}`
    : `/weekly-car-show-list-charlotte/`;

  // --- Event JSON-LD ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: ev.title,
    startDate: new Date(ev.startAt).toISOString(),
    endDate: ev.endAt
      ? new Date(ev.endAt).toISOString()
      : new Date(ev.startAt).toISOString(),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
  url: `https://charlottecarshows.com/events/${ev.slug}/`,
    description: ev.description || undefined,
    image: ev.imageUrl ? [ev.imageUrl] : undefined,
    location: {
      "@type": "Place",
      name: ev.venue?.name || ev.city?.name || "Charlotte",
      address: ev.venue
        ? {
            "@type": "PostalAddress",
            streetAddress: [ev.venue.address1, ev.venue.address2]
              .filter(Boolean)
              .join(", "),
            addressLocality: ev.venue.city || ev.city?.name,
            addressRegion: ev.venue.state || "NC",
            postalCode: ev.venue.postal || undefined,
            addressCountry: "US",
          }
        : undefined,
    },
    organizer: {
      "@type": "Organization",
      name: "Charlotte Car Shows",
      url: "https://charlottecarshows.com",
    },
    offers: ev.url
      ? {
          "@type": "Offer",
          url: ev.url,
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          validFrom: new Date(ev.startAt).toISOString(),
        }
      : undefined,
  };

  // --- BreadcrumbList JSON-LD ---
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://charlottecarshows.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "All Events",
    item: "https://charlottecarshows.com/events/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Weekly Charlotte Car Shows",
        item: `https://charlottecarshows.com${weeklyHref}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: ev.title,
  item: `https://charlottecarshows.com/events/${ev.slug}/`,
      },
    ],
  };

  return (
    <div className="w-full px-2 md:px-4 max-w-5xl mx-auto space-y-6">

  {/* JSON-LD blocks */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <nav aria-label="Breadcrumb" className="text-sm text-[var(--fg)]/60">
        <ol className="flex items-center gap-2 flex-wrap">
          <li>
            <Link href="/" className="hover:underline text-[var(--fg)]">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/events/" className="hover:underline text-[var(--fg)]">
              All Events
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li
            aria-current="page"
            className="text-[var(--fg)]/80 truncate max-w-[60ch]"
          >
            {ev.title}
          </li>
        </ol>
      </nav>

      <header className="text-center space-y-4">
        {ev.isFeatured && (
          <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            Featured Event
          </div>
        )}
        <h1
          className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--fg)]"
          style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
        >
          {ev.title}
        </h1>
        <div className="text-xl text-[var(--fg)]/70 flex flex-col sm:flex-row items-center justify-center gap-2">
          <span className="flex items-center gap-2 text-base md:text-xl">
            <span>{dt.format(new Date(ev.startAt))}{ev.endAt && ` – ${new Intl.DateTimeFormat('en-US', { timeStyle: 'short', timeZone: 'America/New_York' }).format(new Date(ev.endAt))}`}</span>
          </span>
          {ev.city?.name && (
            <span className="flex items-center gap-2 text-base md:text-xl">
              <span className="text-[var(--fg)]/40 md:inline hidden">•</span>
              <span>{ev.city.name}</span>
            </span>
          )}
        </div>
      </header>

  <div className="flex justify-center gap-3">
        {ev.url && (
          <a
            className="ccs-btn-primary px-6 py-3 text-lg"
            href={ev.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Official Site
          </a>
        )}
        <a
          className="ccs-btn px-6 py-3 text-lg"
          href={mapsHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          Get Directions
        </a>
      </div>

      {ev.description && (
        <section className="ccs-card w-full">
          <h2
            className="text-2xl font-semibold text-[var(--fg)] mb-4"
            style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
          >
            About this event
          </h2>
          <p className="text-lg text-[var(--fg)]/80 leading-relaxed">
            {ev.description}
          </p>
        </section>
      )}

  <section className="grid gap-6 md:grid-cols-2">
  <div className="ccs-card w-full">
          <h2
            className="text-2xl font-semibold text-[var(--fg)] mb-6"
            style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
          >
            Event Details
          </h2>
          <dl className="space-y-4">
            <div className="flex gap-3">
              <dt className="w-8" aria-hidden="true">📅</dt>
              <dd className="flex-1">
                <span className="block text-sm text-[var(--fg)]/60">
                  Date &amp; Time
                </span>
                  <span className="block text-[var(--fg)] mt-1">
                  {new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "America/New_York" }).format(new Date(ev.startAt))}
                  <br />
                  {new Intl.DateTimeFormat("en-US", { timeStyle: "short", timeZone: "America/New_York" }).format(new Date(ev.startAt))}
                  {ev.endAt
                    ? ` – ${new Intl.DateTimeFormat("en-US", {
                        timeStyle: "short",
                        timeZone: "America/New_York",
                      }).format(new Date(ev.endAt))}`
                    : ""}{" "}
                  ET
                </span>
              </dd>
            </div>

            <div className="flex gap-3">
              <dt className="w-8" aria-hidden="true">🎟️</dt>
              <dd className="flex-1">
                <span className="block text-sm text-[var(--fg)]/60">
                  Admission
                </span>
                <span className="block text-[var(--fg)] mt-1">
                  {isPaid ? "Paid" : "Free"}
                </span>
              </dd>
            </div>

            <div className="flex gap-3">
              <dt className="w-8" aria-hidden="true">👥</dt>
              <dd className="flex-1">
                <span className="block text-sm text-[var(--fg)]/60">
                  Estimated Size
                </span>
                <span className="block text-[var(--fg)] mt-1">
                  {size ? `${size}+` : "Unknown"}
                </span>
              </dd>
            </div>

            <div className="flex gap-3">
              <dt className="w-8" aria-hidden="true">🔁</dt>
              <dd className="flex-1">
                <span className="block text-sm text-[var(--fg)]/60">
                  Event Frequency
                </span>
                <span className="block text-[var(--fg)] mt-1">
                  {isRecurring ? "Recurring" : "One-time"}
                </span>
              </dd>
            </div>

            <div className="flex gap-3">
              <dt className="w-8" aria-hidden="true">⭐</dt>
              <dd className="flex-1">
                <span className="block text-sm text-[var(--fg)]/60">
                  Featured/Sponsored
                </span>
                <span className="block text-[var(--fg)] mt-1">
                  {ev.isFeatured
                    ? "Featured"
                    : isSponsored
                    ? "Sponsored"
                    : "Standard"}
                </span>
              </dd>
            </div>

            <div className="flex gap-3">
              <dt className="w-8" aria-hidden="true">🅿️</dt>
              <dd className="flex-1">
                <span className="block text-sm text-[var(--fg)]/60">
                  Parking
                </span>
                <span className="block text-[var(--fg)] mt-1">
                  {parkingInfo}
                </span>
              </dd>
            </div>

            <div className="flex gap-3">
              <dt className="w-8" aria-hidden="true">🔗</dt>
              <dd className="flex-1">
                <span className="block text-sm text-[var(--fg)]/60">
                  Social / Website
                </span>
                <span className="block text-[var(--fg)] mt-1">
                  {ev.url ? (
                    <a
                      href={ev.url}
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Official Site
                    </a>
                  ) : (
                    "-"
                  )}
                  {socialLinks.length > 0 &&
                    socialLinks.map((link: string, i: number) => (
                      <span key={i} className="ml-2">
                        <a
                          href={link}
                          className="underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Social
                        </a>
                      </span>
                    ))}
                </span>
              </dd>
            </div>

            {ev.type && (
              <div className="flex gap-3">
                <dt className="w-8" aria-hidden="true">🏁</dt>
                <dd className="flex-1">
                  <span className="block text-sm text-[var(--fg)]/60">
                    Event Type
                  </span>
                  <span className="block text-[var(--fg)] mt-1">
                    {String(ev.type).replaceAll("_", " ")}
                  </span>
                </dd>
              </div>
            )}
          </dl>
        </div>

  <div className="ccs-card w-full">
          <h2
            className="text-2xl font-semibold text-[var(--fg)] mb-6"
            style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
          >
            Location
          </h2>

          {ev.venue ? (
            <div className="space-y-6">
              <div className="flex gap-3">
                <div className="w-8" aria-hidden="true">📍</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--fg)]">
                    {ev.venue.name}
                  </h3>
                  <p className="text-[var(--fg)]/70 mt-1">
                    {fmtAddress(ev.venue ?? undefined)}
                  </p>
                </div>
              </div>

              <div className="aspect-[16/9] overflow-hidden rounded-xl border border-zinc-200">
                <iframe
                  title="Event Location Map"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    mapQuery
                  )}&output=embed`}
                />
              </div>
              <p className="text-sm text-[var(--fg)]/60">
                Map centers on the venue address. Always check the event’s official link before traveling.
              </p>
            </div>
          ) : (
            <p className="text-[var(--fg)]/70">
              Venue details will be announced soon.
            </p>
          )}
        </div>
      </section>

      {(prev || next) && (
        <nav className="ccs-card flex items-center justify-between text-sm">
          <div>
            {prev && prev.slug && prev.title ? (
              <Link
                className="group flex items-center gap-2 ccs-btn px-4 py-3"
                href={`/events/${prev.slug}`}
              >
                <span className="group-hover:-translate-x-1 transition-transform">
                  ←
                </span>
                <span>{prev.title}</span>
              </Link>
            ) : (
              <span className="text-[var(--fg)]/40 px-4">Start of list</span>
            )}
          </div>
          <div>
            {next && next.slug && next.title ? (
              <Link
                className="group flex items-center gap-2 ccs-btn px-4 py-3"
                href={`/events/${next.slug}`}
              >
                <span>{next.title}</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            ) : (
              <span className="text-[var(--fg)]/40 px-4">End of list</span>
            )}
          </div>
        </nav>
      )}

      <GoogleAd slot="1514406406" format="auto" className="mt-8" />
    </div>
  );
}
