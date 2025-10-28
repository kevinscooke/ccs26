// app/events/[slug]/page.tsx
import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import eventsData from "@/app/data/events.json";
// import venuesData from "@/app/data/venues.json"; // not used here
import Container from "@/components/Container";
import { Calendar } from "lucide-react";
import { formatDateET, formatTimeET, toEtDate } from "@/lib/et";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";

// Ads (still lazy on the client)
const AdSlot = dynamic(() => import("@/components/ads/AdSlot"), { ssr: false });
// Client bits
const CalendarButtons = dynamic(() => import("@/components/event/CalendarButtons"), { ssr: false });
const StickyCTA = dynamic(() => import("@/components/event/StickyCTA"), { ssr: false });

// ---------- Metadata ----------
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const events = (eventsData as any[]) || [];
  const ev = events.find((e) => e.slug === params.slug && e.status === "PUBLISHED");
  if (!ev) return { title: "Event not found", robots: { index: false, follow: false } };

  const city = ev.city?.name || ev.venue?.city || "Charlotte";
  const state = ev.venue?.state || "NC";
  const cityState = `${city}, ${state}`;
  const dateLong = formatDateET(ev.startAt);

  const title = `${ev.title} – ${cityState} (${dateLong})`;
  const descBase = `${ev.title} in ${cityState} on ${dateLong}. ${(ev.description || "Details, time, venue, and map.").trim()}`.replace(/\s+/g, " ");
  const description = descBase.slice(0, 155);
  const canonical = `https://charlottecarshows.com/events/${params.slug}/`;
  const image = ev.imageUrl?.trim() || "/images/hero-ccs.jpg";

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description: descBase, url: canonical, type: "website", images: [{ url: image }] },
    twitter: { title, description: descBase, card: "summary_large_image", images: [image] },
  };
}

// ---------- Static params ----------
export function generateStaticParams() {
  const events = (eventsData as any[]) || [];
  return events.filter((e) => e.status === "PUBLISHED" && e.slug).map((e) => ({ slug: e.slug }));
}

// ---------- helpers ----------
function fmtAddress(v?: { address1?: string | null; address2?: string | null; city?: string | null; state?: string | null; postal?: string | null; }) {
  if (!v) return "";
  const parts = [v.address1, v.address2, v.city, v.state, v.postal].filter(Boolean);
  return parts.join(", ");
}
function isValidUrl(u: any): u is string { return typeof u === "string" && /^\s*https?:\/\//i.test(u?.trim()); }

export default async function EventPage({ params }: { params: { slug: string } }) {
  const events = (eventsData as any[]) || [];
  const ev = events.find((e) => e.slug === params.slug && e.status === "PUBLISHED");
  if (!ev) return notFound();

  const isCancelled = (ev.public_status ?? ev.status) === "CANCELLED";
  const showTime = ev.show_time ?? true;

  const canonical = `https://charlottecarshows.com/events/${params.slug}/`;
  const image = ev.imageUrl?.trim() || "/images/hero-ccs.jpg";

  // Clean, safe fields
  const city = ev.city?.name || ev.venue?.city || "Charlotte";
  const state = ev.venue?.state || "NC";
  const desc = ev.description?.trim() || undefined;
  const isPaid =
    typeof ev.price === "number"
      ? ev.price > 0
      : Boolean(ev.isPaid ?? ev.paid ?? ev.admissionPaid ?? false);
  const size =
    typeof ev.size === "number"
      ? ev.size
      : typeof ev.estimatedSize === "number"
      ? ev.estimatedSize
      : typeof ev.expectedSize === "number"
      ? ev.expectedSize
      : undefined;
  const isRecurring = Boolean(ev.isRecurring ?? ev.recurring ?? ev.frequency);
  const venueSlug = ev.venueslug ? String(ev.venueslug).trim() : null;
  const mapQuery = ev.venue
    ? `${ev.venue.name}, ${[ev.venue.address1, ev.venue.address2, ev.venue.city, ev.venue.state, ev.venue.postal]
        .filter(Boolean)
        .join(", ")}`
    : `${ev.title}, ${city}, ${state}`;
  const mapsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`;
  const parkingInfo = (ev.parkingInfo || ev.parking || "").toString().trim() || "See event details";

  // Past event flag (use endAt if present, else startAt)
  const endedAtMs =
    toEtDate(ev.endAt ?? ev.startAt)?.getTime() ??
    new Date(ev.endAt ?? ev.startAt).getTime();
  const isPastEvent = endedAtMs < Date.now();

  const siteUrl = isValidUrl(ev.url || ev.website || ev.siteUrl || ev.externalUrl)
    ? (ev.url || ev.website || ev.siteUrl || ev.externalUrl).trim()
    : null;

  // Featured flag (supports multiple possible fields)
  const isFeatured = Boolean(ev.isFeatured ?? (ev as any).featured ?? (ev as any).is_featured);

  // Chronological prev/next (by startAt in ET)
  const toMs = (d: string) => (toEtDate(d)?.getTime() ?? new Date(d).getTime());
  const published = events.filter((e) => e.status === "PUBLISHED" && e.slug);
  const sorted = [...published].sort((a, b) => toMs(a.startAt) - toMs(b.startAt));
  const idx = sorted.findIndex((e) => e.slug === ev.slug);
  const prev = idx > 0 ? sorted[idx - 1] : null;
  const next = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null;

  // Enrichments for JSON-LD
  const socials = [
    ev.instagram, ev.facebook, ev.twitter, ev.youtube, ev.tiktok, ev.social, ev.socialUrl,
  ]
    .filter(Boolean)
    .map((s: string) => s.trim())
    .filter(isValidUrl);

  const organizerObj =
    ev.organizer
      ? {
          "@type": "Organization",
          name: ev.organizer,
          ...(siteUrl ? { url: siteUrl } : {}),
          ...(socials.length ? { sameAs: socials } : {}),
        }
      : undefined;

  const performers: any[] = Array.isArray((ev as any).performers)
    ? (ev as any).performers
        .map((p: any) =>
          typeof p === "string"
            ? { "@type": "Organization", name: p }
            : p?.name
            ? { "@type": p["@type"] || "Organization", name: p.name }
            : null
        )
        .filter(Boolean)
    : (ev as any).performer
    ? [
        typeof (ev as any).performer === "string"
          ? { "@type": "Organization", name: (ev as any).performer }
          : (ev as any).performer?.name
          ? { "@type": (ev as any).performer["@type"] || "Organization", name: (ev as any).performer.name }
          : null,
      ].filter(Boolean)
    : [];

  const maxCapRaw =
    (ev as any).capacity ??
    (ev as any).maxCapacity ??
    (ev as any).maxAttendees ??
    (ev as any).maximumAttendeeCapacity ??
    (typeof (ev as any).size === "number" ? (ev as any).size : undefined);
  const maxCap = typeof maxCapRaw === "number" ? maxCapRaw : undefined;

  // ---------- JSON-LD (enriched) ----------
  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: ev.title,
    startDate: toEtDate(ev.startAt)?.toISOString() ?? ev.startAt,
    ...(ev.endAt ? { endDate: toEtDate(ev.endAt)?.toISOString() ?? ev.endAt } : {}),
    description: desc,
    url: canonical,
    image,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    isAccessibleForFree: !isPaid,
    offers: [{ "@type": "Offer", price: isPaid ? String(ev.price ?? "") : "0.00", priceCurrency: "USD", url: siteUrl || canonical, availability: "https://schema.org/InStock" }],
    ...(organizerObj ? { organizer: organizerObj } : {}),
    ...(performers.length ? { performer: performers } : {}),
    ...(typeof maxCap === "number" ? { maximumAttendeeCapacity: maxCap } : {}),
    ...(ev.venue?.name
      ? {
          location: {
            "@type": "Place",
            name: ev.venue.name,
            address: {
              "@type": "PostalAddress",
              streetAddress: [ev.venue.address1, ev.venue.address2].filter(Boolean).join(" "),
              addressLocality: ev.venue.city,
              addressRegion: ev.venue.state,
              postalCode: ev.venue.postal,
              addressCountry: "US",
            },
          },
        }
      : {}),
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

  return (
    <Container>
      <div className="w-full space-y-6 pt-0 pb-20 lg:space-y-8">
        {/* Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="text-sm text-[var(--fg)]/60">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="text-[var(--fg)] hover:underline">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/events/" className="text-[var(--fg)] hover:underline">All Events</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="max-w-[60ch] truncate text-[var(--fg)]/80">{ev.title}</li>
          </ol>
        </nav>

        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white/70 backdrop-blur p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              {isPastEvent && (
                <div
                  className="mb-4 flex items-start gap-3 rounded-xl border border-orange-300 bg-orange-50 px-4 py-3 text-orange-900 shadow-sm ring-1 ring-orange-200"
                  role="status"
                >
                  <span aria-hidden="true">⏳</span>
                  <p className="text-sm">
                    This event has ended.{" "}
                    {venueSlug ? (
                      <Link href={`/venue/${venueSlug}/`} className="underline underline-offset-2 font-medium">
                        See upcoming events at this venue
                      </Link>
                    ) : (
                      <Link href="/events/" className="underline underline-offset-2 font-medium">
                        Browse upcoming events
                      </Link>
                    )}
                    .
                  </p>
                </div>
              )}
             {isFeatured && (
               <div
                 className="mb-4 flex items-start gap-3 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-green-900 shadow-sm ring-1 ring-green-200"
                 role="status"
               >
                 {/* Star/burst icon */}
                 <svg className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                   <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                 </svg>
                <p className="text-sm font-medium">Featured event</p>
               </div>
             )}
              {/* Display heading font via Tailwind class you’ll map to a display family (e.g., Bebas/Anton) */}
              <h1 className="font-serif text-balance tracking-tight text-[var(--fg)] leading-tight text-3xl sm:text-4xl lg:text-5xl max-w-[68ch] break-words">
                {ev.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1">
                  <Calendar className="h-4 w-4 text-zinc-500" />
                  {formatDateET(ev.startAt)}{showTime ? ` • ${formatTimeET(ev.startAt)}${ev.endAt ? `–${formatTimeET(ev.endAt)}` : ""} ET` : ""}
                </span>
                <span className={`inline-flex rounded-full px-3 py-1 ${isPaid ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-700"}`}>
                  {isPaid ? "Paid" : "Free"}
                </span>
                {size && <span className="inline-flex rounded-full bg-zinc-50 text-zinc-700 px-3 py-1">Est. {size}+</span>}
                {isCancelled && <span className="inline-flex rounded-full bg-red-50 text-red-700 px-3 py-1">Canceled</span>}
              </div>

              

              {desc && (
                <p className="mt-4 max-w-2xl text-zinc-600 leading-relaxed">{desc}</p>
              )}
{/* Address (between date/time and description) */}
              <div className="text-sm mt-2 gap-2 flex items-center">
                  <div className="text-zinc-500">Address: {fmtAddress(ev.venue)}</div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {siteUrl && (
                  <a
                    className="inline-flex items-center justify-center rounded-xl bg-black text-white px-4 py-2 text-sm font-medium shadow hover:bg-zinc-900"
                    href={siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cta="official_site"
                  >
                    Visit official site
                  </a>
                )}
                <a className="inline-flex items-center rounded-xl border px-4 py-2 text-sm hover:bg-zinc-50"
                   href={mapsHref} target="_blank" rel="noopener noreferrer" data-cta="directions">
                  Get directions
                </a>
                <CalendarButtons
                  title={ev.title}
                  startISO={toEtDate(ev.startAt)?.toISOString() ?? ev.startAt}
                  endISO={ev.endAt ? (toEtDate(ev.endAt)?.toISOString() ?? ev.endAt) : undefined}
                  details={desc || ""}
                  location={mapQuery}
                />
              </div>
            </div>
            {/* Optional hero image (if you want, keep your current OG as fallback) */}
            <div className="md:w-1/3 hidden md:block">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border">
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                  priority={false}
                />
              </div>
            </div>
          </div>

          {/* QUICK FACTS */}
          <ul className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <li className="rounded-xl border bg-white px-4 py-3 text-zinc-700">📍 {city}, {state}</li>
            <li className="rounded-xl border bg-white px-4 py-3 text-zinc-700">🅿️ Parking: {parkingInfo}</li>
            <li className="rounded-xl border bg-white px-4 py-3 text-zinc-700">🍔 Food Trucks</li>
            <li className="rounded-xl border bg-white px-4 py-3 text-zinc-700">{isRecurring ? "🔁 Recurring" : "🗓️ One-time"}</li>
          </ul>
        </section>

        {/* Full-width two-column section: Location (wide) + Event details (skinny) */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Location (left, wider) */}
          <section className="ccs-card space-y-5 lg:col-span-8">
            <h2 className="font-[var(--font-heading,_inherit)] text-2xl sm:text-3xl text-zinc-900 flex items-center gap-2">
              📍 Location
            </h2>
            {ev.venue ? (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8" aria-hidden="true">📌</div>
                  <div className="flex-1">
                    {venueSlug ? (
                      <h3 className="font-semibold text-zinc-900">
                        <Link href={`/venue/${venueSlug}/`} className="hover:underline">
                          {ev.venue.name}
                        </Link>
                      </h3>
                    ) : (
                      <h3 className="font-semibold text-zinc-900">{ev.venue.name}</h3>
                    )}
                    <p className="mt-1 text-zinc-600">
                      {venueSlug ? (
                        <Link href={`/venue/${venueSlug}/`} className="hover:underline">
                          {fmtAddress(ev.venue)}
                        </Link>
                      ) : (
                        fmtAddress(ev.venue)
                      )}
                    </p>
                  </div>
                </div>
                <div
                  id="map"
                  className="scroll-mt-24 md:scroll-mt-28 aspect-[16/9] overflow-hidden rounded-xl border border-zinc-200"
                >
                  <iframe
                    title="Event Location Map"
                    width="100%"
                    height="100%"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                  />
                </div>
                <p className="text-xs text-zinc-500">
                  Map centers on the venue—confirm with the organizer before traveling.
                </p>
              </div>
            ) : (
              <p className="text-zinc-600">Venue details will be announced soon.</p>
            )}
          </section>

          {/* Event details (right, skinny; stacked 1xN) */}
          <section className="ccs-card space-y-5 lg:col-span-4">
            <h2 className="font-[var(--font-heading,_inherit)] text-2xl sm:text-3xl text-zinc-900 flex items-center gap-2">
              ℹ️ Event details
            </h2>
            <dl className="space-y-4 text-sm text-[var(--fg)]">
              <div className="rounded-xl border p-4">
                <dt className="text-xs uppercase tracking-wide text-zinc-500">Date & time</dt>
                <dd className="mt-1 text-zinc-800">
                  {formatDateET(ev.startAt)}
                  {showTime ? (
                    <>
                      <br />
                      {formatTimeET(ev.startAt)}
                      {ev.endAt ? ` – ${formatTimeET(ev.endAt)}` : ""} ET
                    </>
                  ) : null}
                  {isCancelled && <div className="text-red-600 font-semibold">Canceled</div>}
                </dd>
              </div>

              <div className="rounded-xl border p-4">
                <dt className="text-xs uppercase tracking-wide text-zinc-500">Admission</dt>
                <dd className="mt-1">{isPaid ? "Paid" : "Free"}</dd>
              </div>

              <div className="rounded-xl border p-4">
                <dt className="text-xs uppercase tracking-wide text-zinc-500">Estimated size</dt>
                <dd className="mt-1">{size ? `${size}+` : "Unknown"}</dd>
              </div>

              <div className="rounded-xl border p-4">
                <dt className="text-xs uppercase tracking-wide text-zinc-500">Parking</dt>
                <dd className="mt-1">{parkingInfo}</dd>
              </div>

              {siteUrl && (
                <div className="rounded-xl border p-4">
                  <dt className="text-xs uppercase tracking-wide text-zinc-500">Social / website</dt>
                  <dd className="mt-1">
                    <a className="underline" href={siteUrl} target="_blank" rel="noopener noreferrer">
                      Official site
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </section>
        </section>

        {/* Prev/Next now full width under the two columns */}
        {(prev || next) && (
          <nav className="ccs-card mt-0 flex items-center justify-between text-sm">
            <div>
              {prev ? (
                <Link
                  className="group flex items-center gap-2 border rounded-xl px-4 py-2 hover:bg-zinc-50"
                  href={`/events/${prev.slug}`}
                >
                  <span className="transition-transform group-hover:-translate-x-1">←</span>
                  <span>{prev.title}</span>
                </Link>
              ) : (
                <span className="px-4 text-zinc-400">Start of list</span>
              )}
            </div>
            <div>
              {next ? (
                <Link
                  className="group flex items-center gap-2 border rounded-xl px-4 py-2 hover:bg-zinc-50"
                  href={`/events/${next.slug}`}
                >
                  <span>{next.title}</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              ) : (
                <span className="px-4 text-zinc-400">End of list</span>
              )}
            </div>
          </nav>
        )}

        {/* Mobile sticky CTA */}
        <StickyCTA
          directionsHref={mapsHref}
          icsMeta={{
            title: ev.title,
            startISO: toEtDate(ev.startAt)?.toISOString() ?? ev.startAt,
            endISO: ev.endAt ? (toEtDate(ev.endAt)?.toISOString() ?? ev.endAt) : undefined,
            details: desc || "",
            location: mapQuery,
          }}
        />
      </div> {/* <-- closes the main wrapper once */}
    </Container>
  );
}