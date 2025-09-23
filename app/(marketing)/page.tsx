import { Suspense } from 'react';
import UpcomingSix from '@/components/event/UpcomingSix';
import Image from "next/image";
import { TAGS } from "@/lib/tags";
import type { Metadata } from "next";
import Container from '@/components/Container';

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
export default function Home() {
  return (
    <Container>
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
                <a className="ccs-btn-primary px-6 py-3 text-lg shadow-lg" href="/events/">Browse Events</a>
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
              This Week&apos;s Events
            </h2>
            <p className="text-gray-600">
              Curated listings across the greater Charlotte area
            </p>
          </div>

          {/* Right: buttons grouped & right-aligned on desktop */}
          <div className="w-full md:w-auto md:ml-auto flex justify-start md:justify-end items-center gap-3">
            <a className="ccs-btn px-6 py-3" href="/events/">View All Events</a>
            <a className="ccs-btn-primary px-6 py-3" href="/weekly-car-show-list-charlotte/">
              Events this Week!
            </a>
          </div>
        </div>

        <section className="mt-4">
          <Suspense>
            {/* UpcomingSix is an async Server Component that uses the runtime loader
                so it shows the same merged events as /events (loadEvents()). */}
            {/* It returns the same 6-item grid UI. */}
            <UpcomingSix />
          </Suspense>
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
          <a className="ccs-btn inline-block" href="/events/">View Schedule</a>
        </div>
        <div className="ccs-card">
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">Major Shows</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
            Don&apos;t miss Charlotte&apos;s biggest automotive events, including AutoFair, Charlotte Auto Show, and special exhibitions.
          </p>
          <a className="ccs-btn inline-block" href="/events/">See Major Events</a>
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
      <div
          dangerouslySetInnerHTML={{
            __html: `
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1514406406537630" crossorigin="anonymous"></script>
<!-- CCS-2026 -->
<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-1514406406537630" data-ad-slot="7335717776" data-ad-format="auto" data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
`
          }}
        />
    </Container>
  );
}

