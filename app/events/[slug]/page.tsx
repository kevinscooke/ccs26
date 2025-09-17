import Link from "next/link";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 86400; // 24h

function fmtAddress(v?: {
  address1?: string|null; address2?: string|null;
  city?: string|null; state?: string|null; postal?: string|null;
}) {
  if (!v) return "";
  const parts = [v.address1, v.address2, v.city, v.state, v.postal].filter(Boolean);
  return parts.join(", ");
}

export default async function EventDetail({ params }: { params: { slug: string } }) {
  const ev = await prisma.event.findFirst({
    where: { slug: params.slug, status: "PUBLISHED" },
    include: { city: true, venue: true }
  });

  if (!ev) return <p>Event not found.</p>;

  // Prev / Next (strict chronological by startAt)
  const [prev, next] = await Promise.all([
    prisma.event.findFirst({
      where: { status: "PUBLISHED", startAt: { lt: ev.startAt } },
      orderBy: { startAt: "desc" },
      select: { slug: true, title: true }
    }),
    prisma.event.findFirst({
      where: { status: "PUBLISHED", startAt: { gt: ev.startAt } },
      orderBy: { startAt: "asc" },
      select: { slug: true, title: true }
    }),
  ]);

  const addr = fmtAddress(ev.venue ?? undefined);
  const mapQuery = addr || ev.city?.name || "Charlotte, NC";
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  const dt = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeStyle: "short" });

  return (
    <article className="space-y-6">
      {/* Title + meta */}
      <header className="ccs-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{ev.title}</h1>
            <p className="mt-1 text-sm text-zinc-400">
              {(ev.city?.name ? `${ev.city.name} • ` : "")}{dt.format(new Date(ev.startAt))}
              {ev.endAt ? ` – ${new Intl.DateTimeFormat("en-US", { timeStyle: "short" }).format(new Date(ev.endAt))}` : ""}
            </p>
          </div>
          {ev.isFeatured && <span className="ccs-badge">Featured</span>}
        </div>
      </header>
      
      {/* Description */}
      {ev.description && (
        <section className="ccs-card">
          <h2 className="text-lg font-semibold">About this event</h2>
          <p className="mt-2 text-zinc-300">{ev.description}</p>
        </section>
      )}
      
      {/* 3-column block: Details | Venue | Map */}
      <section className="ccs-card">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Details */}
          <div>
            <h2 className="text-lg font-semibold">Details</h2>
            <dl className="mt-2 space-y-1 text-sm">
              <div>
                <dt className="text-zinc-400">Date:</dt>
                <dd>{new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date(ev.startAt))}</dd>
              </div>
              <div>
                <dt className="text-zinc-400">Time:</dt>
                <dd>
                  {new Intl.DateTimeFormat("en-US", { timeStyle: "short" }).format(new Date(ev.startAt))}
                  {ev.endAt ? ` – ${new Intl.DateTimeFormat("en-US", { timeStyle: "short" }).format(new Date(ev.endAt))}` : ""}
                  &nbsp;ET
                </dd>
              </div>
              {ev.type && (
                <div>
                  <dt className="text-zinc-400">Type:</dt>
                  <dd>{ev.type.replaceAll("_", " ")}</dd>
                </div>
              )}
              {ev.url && (
                <div>
                  <dt className="text-zinc-400">Official:</dt>
                  <dd><a className="ccs-btn mt-1 inline-block" href={ev.url} target="_blank" rel="noreferrer">Event Link</a></dd>
                </div>
              )}
            </dl>
          </div>

          {/* Venue */}
          <div>
            <h2 className="text-lg font-semibold">Venue</h2>
            {ev.venue ? (
              <div className="mt-2 text-sm">
                <p className="font-medium">{ev.venue.name}</p>
                <p className="text-zinc-300">{addr}</p>
                <p className="mt-2">
                  <a className="ccs-btn" href={mapsHref} target="_blank" rel="noreferrer">Open in Google Maps</a>
                </p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-zinc-400">Venue details coming soon.</p>
            )}
          </div>

          {/* Map (Google Maps Embed – no key required) */}
          <div>
            <h2 className="text-lg font-semibold">Map</h2>
            <div className="mt-2 overflow-hidden rounded-2xl border border-zinc-800">
              <iframe
                title="Event Map"
                width="100%"
                height="220"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
              />
            </div>
            <p className="mt-2 text-xs text-zinc-400">
              Map centers on the venue address. Always check the event’s official link before traveling.
            </p>
          </div>
        </div>
      </section>

      

      {/* Prev / Next */}
      {(prev || next) && (
        <nav className="ccs-card flex items-center justify-between text-sm">
          <div>
            {prev ? (
              <Link className="ccs-btn" href={`/events/${prev.slug}`} aria-label={`Previous event: ${prev.title}`}>
                ‹ {prev.title}
              </Link>
            ) : <span className="text-zinc-600">Start of list</span>}
          </div>
          <div>
            {next ? (
              <Link className="ccs-btn" href={`/events/${next.slug}`} aria-label={`Next event: ${next.title}`}>
                {next.title} ›
              </Link>
            ) : <span className="text-zinc-600">End of list</span>}
          </div>
        </nav>
      )}
    </article>
  );
}

