import { Suspense } from 'react';
import eventsData from '../../public/events.json';
import Image from "next/image";
import { TAGS } from "@/lib/tags";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Charlotte Car Shows – Weekly Event Listings & Automotive Community",
  description:
    "Discover the best car shows in Charlotte, NC and the surrounding area. Updated weekly with event listings, featured shows, and resources for enthusiasts and organizers.",
  alternates: { canonical: "https://charlottecarshows.com" },
};

// Fully static page
export default function Home() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative rounded-xl overflow-hidden shadow-lg">
          <div className="absolute inset-0">
            <Image
              src="/images/hero-ccs.jpg"
              alt="Charlotte car show—rows of cars with spectators"
              className="object-cover"
              fill
              priority
              sizes="(min-width: 768px) 60vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/20" />
          </div>
          <div className="relative z-10 px-6 py-12 md:py-20 md:px-12">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg" style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}>
                Find Your Next Car Show in Charlotte
              </h1>
              <p className="mt-4 text-lg md:text-xl text-white/90 leading-relaxed">
                The most comprehensive source for car shows, Cars & Coffee meetups, and automotive events across the Charlotte area.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a className="ccs-btn-primary px-6 py-3 text-lg shadow-lg" href="/events">Browse Events</a>
                <a className="ccs-btn px-5 py-3 text-lg bg-white/90 text-[var(--fg)] hover:bg-white" href="/pricing">Feature Your Event</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="ccs-card">
        <div className="flex items-center justify-between md:flex-nowrap flex-wrap gap-4 mb-6">
          {/* Left: heading/intro */}
          <div className="min-w-0">
            <h2
              className="text-3xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
            >
              This Week's Events
            </h2>
            <p className="text-gray-600">
              Curated listings across the greater Charlotte area
            </p>
          </div>

          {/* Right: buttons grouped & right-aligned on desktop */}
          <div className="w-full md:w-auto md:ml-auto flex justify-start md:justify-end items-center gap-3">
            <a className="ccs-btn px-6 py-3" href="/events">View All Events</a>
            <a className="ccs-btn-primary px-6 py-3" href="/weekly-car-show-list-charlotte">
              Events this Week!
            </a>
          </div>
        </div>

        <section className="mt-4 grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          {eventsData
            .filter((e) => e.status === 'PUBLISHED' && new Date(e.startAt) >= new Date())
            .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime() || a.title.localeCompare(b.title))
            .slice(0, 6)
            .map((e) => (
              <article key={e.id} className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-lg bg-white/5 shadow-sm">
                <div className="min-w-0 order-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold leading-snug truncate">
                      <a className="hover:underline" href={`/events/${e.slug}`}>{e.title}</a>
                    </h3>
                    {e.isFeatured && <span className="ccs-badge">Featured</span>}
                  </div>
                  <p className="mt-1 text-sm text-zinc-400">
                    {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/New_York' }).format(new Date(e.startAt))}
                    {(() => {
                      function clean(str?: string | null) {
                        if (!str) return "";
                        return (
                          str
                            .replace(/[\x00-\x1F\x7F]+/g, " ")
                            .replace(/\b(19\d{2}|20\d{2})\b/g, " ")
                            .replace(/\s+/g, " ")
                            .trim()
                        );
                      }

                      if (e.venue?.name) {
                        const venue = clean(e.venue.name);
                        const city = clean(e.venue.city);
                        const state = clean(e.venue.state);
                        const parts = [venue, city, state].filter(Boolean);
                        return parts.length ? ` • ${parts.join(", ")}` : "";
                      } else if (e.city?.name) {
                        const c = clean(e.city.name);
                        return c ? ` • ${c}` : "";
                      } else {
                        return "";
                      }
                    })()}
                  </p>
                </div>
                <div className="order-2 mt-3 sm:mt-0 ml-0 sm:ml-auto flex gap-2 w-full sm:w-auto">
                  <a className="ccs-btn w-full sm:w-auto justify-center" href={`/events/${e.slug}`}>Details</a>
                </div>
              </article>
            ))}
        </section>
</section>

{/* Value Props */}
      <section className="grid gap-8 md:grid-cols-3">
        {[
          {
            title: "Weekly Updates",
            description: "Fresh listings every week covering Charlotte and surrounding areas. Never miss a local car event.",
            icon: "📅"
          },
          {
            title: "Free Submissions",
            description: "List your car show or meetup for free. Easy submission process with quick approval.",
            icon: "✨"
          },
          {
            title: "Premium Features",
            description: "Boost your event with featured placement, social promotion, and extended reach.",
            icon: "🌟"
          }
        ].map(prop => (
          <div key={prop.title} className="ccs-card">
            <div className="text-3xl mb-4">{prop.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{prop.title}</h3>
            <p className="text-gray-600 leading-relaxed">{prop.description}</p>
          </div>
        ))}
      </section>

      {/* Featured Locations */}
      <section className="grid gap-8 md:grid-cols-2">
        <div className="ccs-card">
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">Cars &amp; Coffee at CMS</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Join hundreds of enthusiasts at Charlotte Motor Speedway every third Saturday. Free admission, family-friendly atmosphere, and amazing vehicles.
          </p>
          <a className="ccs-btn inline-block" href="/events">View Schedule</a>
        </div>
        <div className="ccs-card">
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">Major Shows</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Don't miss Charlotte's biggest automotive events, including AutoFair, Charlotte Auto Show, and special exhibitions.
          </p>
          <a className="ccs-btn inline-block" href="/events">See Major Events</a>
        </div>
      </section>

      {/* Guide promo */}
      <section className="ccs-card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}>
              New: The Guide to Charlotte Car Shows
            </h2>
            <p className="text-gray-600">Monthly staples, annual shows, and local resources—all in one place.</p>
          </div>
          <a className="ccs-btn-primary px-5 py-2" href="/guide-to-charlotte-car-shows">Read the Guide</a>
        </div>
      </section>

      {/* Community Section */}
      <section className="ccs-card text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4" 
            style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}>
          Join Our Community
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6 leading-relaxed">
          Follow us for daily updates, event highlights, and exclusive content. Connect with thousands of local car enthusiasts.
        </p>
        <div className="flex justify-center gap-4">
          <a className="ccs-btn-primary px-6 py-3" 
             href="https://www.instagram.com/charlottecarshows/" 
             target="_blank" 
             rel="noreferrer">
            Follow on Instagram
          </a>
          <a className="ccs-btn px-6 py-3" 
             href="https://www.facebook.com/CharlotteCarShows/" 
             target="_blank" 
             rel="noreferrer">
            Join on Facebook
          </a>
        </div>
      </section>
    </div>
  );
}

