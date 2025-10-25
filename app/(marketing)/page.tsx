import { Suspense } from "react";
import Image from "next/image";
import type { Metadata } from "next";
import Container from "@/components/Container";
import CompactUpcomingEvents from "@/components/event/CompactUpcomingEvents";
import FeaturedEventsGrid from "@/components/event/FeaturedEventsGrid";
import { TAGS } from "@/lib/tags";
import dynamic from "next/dynamic";
const AdSlot = dynamic(() => import("@/components/ads/AdSlot"), { ssr: false });

export const metadata: Metadata = {
  title: "Charlotte Car Shows – Weekly Event Listings & Automotive Community",
  description:
    "Discover the best car shows in Charlotte, NC and the surrounding area. Updated weekly with event listings, featured shows, and resources for enthusiasts and organizers.",
  alternates: { canonical: "https://charlottecarshows.com" },
  openGraph: {
    title: "Charlotte Car Shows – Weekly Event Listings & Automotive Community",
    description:
      "Discover the best car shows in Charlotte, NC and the surrounding area. Updated weekly with event listings, featured shows, and resources for enthusiasts and organizers.",
    url: "https://charlottecarshows.com",
    type: "website",
    images: [
      {
        url: "https://charlottecarshows.com/images/hero-ccs.jpg",
        alt: "Charlotte car show—rows of cars with spectators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Charlotte Car Shows",
    description:
      "Weekly-updated listings of Charlotte-area car shows, Cars & Coffee, and automotive community resources.",
    images: ["https://charlottecarshows.com/images/hero-ccs.jpg"],
  },
  authors: [{ name: "Charlotte Car Shows", url: "https://charlottecarshows.com" }],
  keywords: [
    "Charlotte car shows",
    "Cars & Coffee",
    "Charlotte events",
    "car meetups",
    "Charlotte NC",
  ],
  robots: {
    index: true,
    follow: true,
  },
};

// Fully static page
export default function MarketingHomePage() {
  return (
    <Container>
      {/* Organization JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `{
  "@context":"https://schema.org",
  "@type":"Organization",
  "name":"Charlotte Car Shows",
  "url":"https://charlottecarshows.com",
  "logo":"https://charlottecarshows.com/icon-512x512.png",
  "sameAs":[
    "https://www.instagram.com/charlottecarshows/",
    "https://www.facebook.com/CharlotteCarShows/"
  ]
}`
        }}
      />

      {/* WebSite + SearchAction JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `{
  "@context":"https://schema.org",
  "@type":"WebSite",
  "url":"https://charlottecarshows.com",
  "potentialAction":{
    "@type":"SearchAction",
    "target":"https://charlottecarshows.com/search?q={query}",
    "query-input":"required name=query"
  }
}`
        }}
      />

      <div className="space-y-12 pt-2 pb-6 lg:space-y-10 lg:pt-3 lg:pb-6">
        {/* Row 2: Hero + Compact Upcoming */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 lg:items-start">
          <div className="space-y-6 lg:col-span-7">
            <article className="space-y-5">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                  Spotlight
                </span>
                <h1
                  className="text-[32px] font-extrabold leading-tight tracking-tight text-gray-900 lg:text-[38px]"
                  style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
                >
                  Charlotte&apos;s essential guide to car shows, cruises, and coffee meets.
                </h1>
              </div>

              <p className="text-base text-gray-700 lg:text-[17px] lg:leading-7">
                Discover what&apos;s happening this week across the Queen City scene—curated gatherings,
                storied venues, and upcoming feature rallies pulled together by local enthusiasts.
              </p>

              <div className="flex flex-wrap items-center gap-2 text-[13px] text-gray-500 lg:gap-3">
                <span>Updated every Thursday</span>
                <span>•</span>
                <span>Greater Charlotte Metro</span>
                <span>•</span>
                <span>Curated by Charlotte Car Shows</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <a className="ccs-btn-primary px-4 py-2 text-sm shadow" href="/events/">
                  Browse events
                </a>
                <a
                  className="ccs-btn px-4 py-2 text-sm bg-white text-[var(--fg)] shadow hover:bg-white/80"
                  href="/pricing"
                >
                  Feature your event
                </a>
              </div>
            </article>

            <div className="relative overflow-hidden rounded-3xl shadow-lg min-h-[480px] sm:min-h-[520px] lg:min-h-[520px]">
              <Image
                src="/images/hero-ccs.jpg"
                alt="Charlotte car show—rows of cars with spectators"
                fill
                priority
                loading="eager"
                className="object-cover"
                sizes="(min-width: 1280px) 45vw, (min-width: 1024px) 55vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-between gap-4 p-4 sm:p-6">
                <div className="max-w-lg text-white space-y-2">
                  <p className="text-xs sm:text-sm uppercase tracking-wide text-white/70">November highlight</p>
                  <h2 className="text-xl sm:text-2xl font-bold leading-tight font-[var(--font-heading,_inherit)]">
                    Charlotte Auto Show • Uptown Charlotte
                  </h2>
                  <p className="text-xs sm:text-sm text-white/80">
                    New model debuts, specialty exhibits, and family-friendly attractions all weekend long at the Charlotte Convention Center.
                  </p>
                </div>
                <div>
                  <a
                    href="/events/charlotte-auto-show/"
                    className="ccs-btn-primary inline-block px-5 py-2 text-sm shadow-lg"
                  >
                    Explore show schedule
                  </a>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="h-full rounded-2xl border border-gray-200 bg-white/95 p-5 shadow-sm lg:p-4">
              <div className="mb-4 space-y-1">
                <h2
                  className="text-lg font-bold text-gray-900"
                  style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
                >
                  Upcoming events
                </h2>
                <p className="text-xs text-gray-600">The next five stops worth a closer look.</p>
              </div>
              <Suspense
                fallback={
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="h-16 animate-pulse rounded-2xl border border-gray-200 bg-gray-100"
                      />
                    ))}
                  </div>
                }
              >
                <CompactUpcomingEvents />
              </Suspense>
            </div>
          </aside>
        </section>

        {/* Row 3: Featured Events */}
       {/* } <section className="space-y-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2
                className="text-[30px] font-bold text-gray-900"
                style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
              >
                Featured events
              </h2>
              <p className="text-sm text-gray-600">Handpicked gatherings worth the drive.</p>
            </div>
            <a
              href="/events/?featured=true"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-800"
            >
              Explore all featured →
            </a>
          </div>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-80 animate-pulse rounded-3xl bg-gray-100" />
                ))}
              </div>
            }
          >
            <FeaturedEventsGrid />
          </Suspense>
        </section> */}

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
            <a className="ccs-btn inline-block" href="/events/">View Schedule</a>
          </div>
          <div className="ccs-card">
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Major Shows</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
              Don&apos;t miss Charlotte&apos;s biggest automotive events, including AutoFair, Charlotte Auto Show, and special exhibitions.
            </p>
            <a className="ccs-btn inline-block" href="/events/charlotte-auto-show/">Charlotte Auto Show</a>
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
    </Container>
  );
}

