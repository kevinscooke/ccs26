// app/events/[slug]/page.tsx
import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import eventsData from "../../data/events.json";
import venuesData from "../../data/venues.json";
import Container from '@/components/Container';
import { Calendar } from "lucide-react";
import { formatDateET, formatTimeET, toEtDate } from "@/lib/et";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
const AdSlot = dynamic(() => import("@/components/ads/AdSlot"), { ssr: false });

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
  const dateLong = formatDateET(ev.startAt);

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

// use centralized ET helpers (toEtDate/formatDateET/formatTimeET) from lib/et

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

function isValidUrl(u: any): u is string {
  return typeof u === "string" && /^\s*https?:\/\//i.test(u.trim());
}

// simple local slugify fallback
function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[\s/]+/g, "-")
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/-+/g, "-");
}

export default async function EventPage({ params }: { params: { slug: string } }) {
  const events = (eventsData as any[]) || [];
  const ev = events.find((e) => e.slug === params.slug && e.status === "PUBLISHED");
  if (!ev) return notFound();

  const isCancelled = (ev.public_status ?? ev.status) === "CANCELLED";
  const showTime = ev.show_time ?? true;

  // --- build derived vars used in JSX and JSON-LD ---
  const canonical = `https://charlottecarshows.com/events/${params.slug}/`;
  const image = ev.imageUrl || "/images/hero-ccs.jpg";

  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: ev.title,
    startDate: toEtDate(ev.startAt)?.toISOString() ?? ev.startAt,
    ...(ev.endAt ? { endDate: toEtDate(ev.endAt)?.toISOString() ?? ev.endAt } : {}),
    description: ev.description || undefined,
    url: canonical,
    image,
    // add schema.org EventCancelled when cancelled
    ...(isCancelled ? { eventStatus: "https://schema.org/EventCancelled" } : {}),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://charlottecarshows.com/" },
      { "@type": "ListItem", position: 2, name: "All Events", item: "https://charlottecarshows.com/events/" },
      { "@type": "ListItem", position: 3, name: ev.title, item: canonical },
    ],
  };

  const siteUrl = isValidUrl(ev.url || ev.website || ev.siteUrl || ev.externalUrl)
    ? (ev.url || ev.website || ev.siteUrl || ev.externalUrl).trim()
    : null;
  const mapQuery = ev.venue ? fmtAddress(ev.venue) : `${ev.title} ${ev.city?.name ?? ""}`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  const isPaid = Boolean(ev.price) || ev.admission === "paid" || !!ev.paid;
  const size = ev.size || ev.estimatedAttendance || null;
  const isRecurring = !!ev.recurrence || !!ev.isRecurring || !!ev.frequency;
  const isSponsored = !!ev.isSponsored;
  const parkingInfo = ev.venue?.parking || ev.parking || "Unknown";
  const socialLinks = Array.isArray(ev.social) ? ev.social : ev.social ? [ev.social] : [];
  const venueList = (venuesData as any[]) || [];
  const venueById = ev.venue?.id
    ? venueList.find((v) => String(v.id) === String(ev.venue?.id))
    : null;
  const venueSlug =
    ev.venue?.slug ??
    venueById?.slug ??
    (ev.venue?.name ? slugify(ev.venue.name) : null) ??
    null;

  const idx = events.findIndex((e) => e.slug === params.slug);
  const prevEvent = idx > 0 ? events[idx - 1] : null;
  const nextEvent = idx >= 0 && idx < events.length - 1 ? events[idx + 1] : null;
  const prev: { slug: string; title: string } | null = prevEvent
    ? { slug: String(prevEvent.slug ?? ""), title: String(prevEvent.title ?? prevEvent.slug ?? "") }
    : null;
  const next: { slug: string; title: string } | null = nextEvent
    ? { slug: String(nextEvent.slug ?? ""), title: String(nextEvent.title ?? nextEvent.slug ?? "") }
    : null;
  // --- end derived vars ---

  return (
    <Container>
      <div className="w-full space-y-6 py-6 lg:space-y-8">
        {/* Top leaderboard ad */}
        <section>
          <div className="rounded-lg bg-white px-2 py-2 sm:min-h-[90px] lg:min-h-[90px]">
            <AdSlot
              slot="7744630827"
              // 320x100 mobile / 728x90 desktop via responsive
              style={{ minHeight: 90 }}
            />
          </div>
        </section>

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
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="text-[var(--fg)] hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/events/" className="text-[var(--fg)] hover:underline">
                All Events
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="max-w-[60ch] truncate text-[var(--fg)]/80">
              {ev.title}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <section className="ccs-card space-y-4">
              {ev.isFeatured && (
                <div className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Featured Event
                </div>
              )}

              <header className="space-y-2 text-left">
                <h1
                  className="text-3xl font-bold tracking-tight text-[var(--fg)] lg:text-[40px]"
                  style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
                >
                  {ev.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--fg)]/70 lg:text-base">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-[var(--fg)]/40" />
                    {formatDateET(ev.startAt)}{" "}
                    {isCancelled ? (
                      <strong className="text-red-600">Canceled</strong>
                    ) : (
                      showTime && (
                        <>
                          {formatTimeET(ev.startAt)}
                          {ev.endAt ? ` – ${formatTimeET(ev.endAt)}` : ""} ET
                        </>
                      )
                    )}
                  </span>
                  {ev.city?.name && (
                    <>
                      <span className="hidden text-[var(--fg)]/40 lg:inline">•</span>
                      <span>{ev.city.name}</span>
                    </>
                  )}
                </div>

                {isCancelled && ev.status_note && (
                  <p className="text-sm text-[var(--fg)]/70">{ev.status_note}</p>
                )}
              </header>

              {ev.description && (
                <p className="text-base leading-relaxed text-[var(--fg)]/80">
                  {ev.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {siteUrl && (
                  <a
                    className="ccs-btn-primary px-4 py-2 text-sm lg:text-base"
                    href={siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit official site
                  </a>
                )}
                <a
                  className="ccs-btn px-4 py-2 text-sm lg:text-base"
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get directions
                </a>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="ccs-card space-y-5">
                <h2
                  className="text-2xl font-semibold text-[var(--fg)]"
                  style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
                >
                  Location
                </h2>
                {ev.venue ? (
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8" aria-hidden="true">
                        📍
                      </div>
                      <div className="flex-1">
                        {venueSlug ? (
                          <h3 className="font-semibold text-[var(--fg)]">
                            <Link href={`/venue/${venueSlug}/`} className="hover:underline">
                              {ev.venue.name}
                            </Link>
                          </h3>
                        ) : (
                          <h3 className="font-semibold text-[var(--fg)]">{ev.venue.name}</h3>
                        )}
                        <p className="mt-1 text-[var(--fg)]/70">
                          {venueSlug ? (
                            <Link href={`/venue/${venueSlug}/`} className="hover:underline">
                              {fmtAddress(ev.venue ?? undefined)}
                            </Link>
                          ) : (
                            fmtAddress(ev.venue ?? undefined)
                          )}
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
                        src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                      />
                    </div>
                    <p className="text-xs text-[var(--fg)]/60">
                      Map centers on the venue address—confirm with the organizer before traveling.
                    </p>
                  </div>
                ) : (
                  <p className="text-[var(--fg)]/70">Venue details will be announced soon.</p>
                )}
              </div>

              <div className="ccs-card space-y-5">
                <h2
                  className="text-2xl font-semibold text-[var(--fg)]"
                  style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
                >
                  Event details
                </h2>
                <dl className="space-y-4 text-sm text-[var(--fg)]">
                  <div className="flex gap-3">
                    <dt className="w-8" aria-hidden="true">
                      📅
                    </dt>
                    <dd className="flex-1 space-y-1">
                      <span className="text-[var(--fg)]/60">
                        Date &amp; time:
                      </span>
                      <span>
                        {formatDateET(ev.startAt)}
                        <br />
                        {isCancelled ? (
                          <strong className="text-red-600">Canceled</strong>
                        ) : (
                          showTime &&
                          `${formatTimeET(ev.startAt)}${
                            ev.endAt ? ` – ${formatTimeET(ev.endAt)}` : ""
                          } ET`
                        )}
                      </span>
                      {isCancelled && ev.status_note && (
                        <p className="text-[var(--fg)]/70">{ev.status_note}</p>
                      )}
                    </dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-8" aria-hidden="true">
                      🎟️
                    </dt>
                    <dd className="flex-1">
                      <span className="text-[var(--fg)]/60">
                        Admission:
                      </span>{" "}
                      <span>{isPaid ? "Paid" : "Free"}</span>
                    </dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-8" aria-hidden="true">
                      👥
                    </dt>
                    <dd className="flex-1">
                      <span className="text-[var(--fg)]/60">
                        Estimated size:
                      </span>{" "}
                      <span>{size ? `${size}+` : "Unknown"}</span>
                    </dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-8" aria-hidden="true">
                      🔁
                    </dt>
                    <dd className="flex-1">
                      <span className="text-[var(--fg)]/60">
                        Event frequency:
                      </span>{" "}
                      <span>{isRecurring ? "Recurring" : "One-time"}</span>
                    </dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-8" aria-hidden="true">
                      ⭐
                    </dt>
                    <dd className="flex-1">
                      <span className="text-[var(--fg)]/60">
                        Featured / sponsored:
                      </span>{" "}
                      <span>
                        {ev.isFeatured ? "Featured" : isSponsored ? "Sponsored" : "Standard"}
                      </span>
                    </dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-8" aria-hidden="true">
                      🅿️
                    </dt>
                    <dd className="flex-1">
                      <span className="text-[var(--fg)]/60">
                        Parking:
                      </span>{" "}
                      <span>{parkingInfo}</span>
                    </dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-8" aria-hidden="true">
                      🔗
                    </dt>
                    <dd className="flex-1 space-y-1">
                      <span className="text-[var(--fg)]/60">
                        Social / website:
                      </span>
                      <span className="flex flex-wrap gap-2">
                        {siteUrl ? (
                          <a
                            href={siteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            Official site
                          </a>
                        ) : (
                          "-"
                        )}
                        {socialLinks.map((link: string, i: number) => (
                          <a
                            key={i}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            Social
                          </a>
                        ))}
                      </span>
                    </dd>
                  </div>
                  {ev.type && (
                    <div className="flex gap-3">
                      <dt className="w-8" aria-hidden="true">
                        🏁
                      </dt>
                      <dd className="flex-1">
                        <span className="text-[var(--fg)]/60">
                          Event type:
                        </span>{" "}
                        <span>{String(ev.type).replaceAll("_", " ")}</span>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </section>

            {(prev || next) && (
              <nav className="ccs-card flex items-center justify-between text-sm">
                <div>
                  {prev ? (
                    <Link
                      className="group flex items-center gap-2 ccs-btn px-4 py-2"
                      href={`/events/${prev.slug}`}
                    >
                      <span className="transition-transform group-hover:-translate-x-1">←</span>
                      <span>{prev.title}</span>
                    </Link>
                  ) : (
                    <span className="px-4 text-[var(--fg)]/40">Start of list</span>
                  )}
                </div>
                <div>
                  {next ? (
                    <Link
                      className="group flex items-center gap-2 ccs-btn px-4 py-2"
                      href={`/events/${next.slug}`}
                    >
                      <span>{next.title}</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  ) : (
                    <span className="px-4 text-[var(--fg)]/40">End of list</span>
                  )}
                </div>
              </nav>
            )}
          </div>

          {/* Right column sticky skyscraper ad */}
          <aside className="space-y-4 lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg bg-white px-2 py-2 min-h-[280px] lg:min-h-[600px]">
              <AdSlot
                slot="7335717776"
                // 300x600 desktop skyscraper (auto on mobile)
                style={{ minHeight: 280 }}
              />
            </div>
          </aside>
        </div>

        {/* Bottom ad slot */}
        <section>
          <div className="rounded-lg bg-white px-2 py-2 sm:min-h-[90px] lg:min-h-[90px]">
            <AdSlot
              slot="7335717776"
              // 320x100 mobile / 728x90 desktop via responsive
              style={{ minHeight: 90 }}
            />
          </div>
        </section>
      </div>
    </Container>
  );
}
