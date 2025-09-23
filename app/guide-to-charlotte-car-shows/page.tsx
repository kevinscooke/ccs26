// app/guide-to-charlotte-car-shows/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const runtime = "nodejs";
export const revalidate = 604800; // 1 week ISR for guide page

export const metadata: Metadata = {
  title: "The Guide to Charlotte Car Shows | Charlotte Car Shows",
  description:
    "Your guide to Charlotte car shows and cruise-ins: monthly staples, annual shows, and local resources for enthusiasts.",
  alternates: { canonical: "https://charlottecarshows.com/guide-to-charlotte-car-shows" },
  openGraph: {
    type: "article",
    title: "The Guide to Charlotte Car Shows",
    description:
      "Monthly car shows and cruise-ins around Charlotte, plus annual events and resources.",
    url: "https://charlottecarshows.com/guide-to-charlotte-car-shows",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Guide to Charlotte Car Shows",
    description:
      "Monthly car shows and cruise-ins around Charlotte, plus annual events and resources.",
  },
};

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="ccs-card scroll-mt-24">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--fg)] mb-4" style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}>
        {title}
      </h2>
      <div className="space-y-4 text-[var(--fg)]/80 leading-relaxed">{children}</div>
    </section>
  );
}

function Item({ title, meta, children }: { title: string; meta?: string; children?: React.ReactNode }) {
  return (
    <article className="border border-[var(--fg)]/10 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-[var(--fg)]">{title}</h3>
      {meta && <p className="text-sm text-[var(--fg)]/60 mt-1">{meta}</p>}
      {children && <div className="mt-2 text-[var(--fg)]/80">{children}</div>}
    </article>
  );
}

export default function GuidePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "The Guide to Charlotte Car Shows",
    description:
      "Monthly car shows and cruise-ins around Charlotte, plus annual events and resources.",
    author: { "@type": "Organization", name: "Charlotte Car Shows" },
    publisher: { "@type": "Organization", name: "Charlotte Car Shows", url: "https://charlottecarshows.com" },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://charlottecarshows.com/guide-to-charlotte-car-shows",
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-sm text-[var(--fg)]/60">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:underline text-[var(--fg)]">Home</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/resources" className="hover:underline text-[var(--fg)]">Resources</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-[var(--fg)]/80">Guide to Charlotte Car Shows</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--fg)]" style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}>
          The Guide to Charlotte Car Shows
        </h1>
        <p className="text-lg text-[var(--fg)]/70 max-w-2xl">
          New to local shows or looking to plan your weekends? This guide covers monthly staples,
          annual highlights, and helpful resources across the greater Charlotte area.
          For up-to-date dates and times, always check the
          {" "}
          <Link className="underline hover:text-green-700" href="/events/">events calendar</Link>.
        </p>
      </header>

      {/* Layout: content + right-rail ToC */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Main content */}
        <div className="space-y-10">
          {/* Mobile ToC */}
          <nav className="lg:hidden ccs-card">
            <h2 className="text-xl font-semibold text-[var(--fg)] mb-3">On this page</h2>
            <ul className="list-disc pl-6 space-y-1 text-[var(--fg)]/80">
              <li><a className="hover:underline" href="#first-weekend">First Weekend Of The Month</a></li>
              <li><a className="hover:underline" href="#second-weekend">Second Weekend Of The Month</a></li>
              <li><a className="hover:underline" href="#third-weekend">Third Weekend Of The Month</a></li>
              <li><a className="hover:underline" href="#fourth-weekend">Fourth Weekend Of The Month</a></li>
              <li><a className="hover:underline" href="#annual-shows">Annual Car Shows in Charlotte</a></li>
              <li><a className="hover:underline" href="#local-resources">Local Resources</a></li>
            </ul>
          </nav>

          {/* Ad removed from main flow and placed into the right-rail below so it
              is only visible on desktop (lg+) and remains sticky while the
              user scrolls. This prevents the ad from appearing inline on
              mobile between the ToC and content. */}

          {/* Sections */}
          <Section id="first-weekend" title="First Weekend Of The Month">
            <div className="grid gap-4 md:grid-cols-2">
              <Item title={'Mint Hill "Hwy 51" Cruise-In'} meta="1st Friday · Mint Hill Festival Shopping Center, Charlotte, NC">
                Community-focused cruise-in hosted by Classic Cruisers of Monroe.
                Family friendly; vintage cars, trucks, and muscle cars often attend.
              </Item>
              <Item title="Cars and Coffee Charlotte" meta="1st Saturday · Old Charlotte Coliseum area (Whitehall), Charlotte, NC">
                One of Charlotte’s longest-running meets. Classics, exotics, hot rods, and bikes.
                Arrive early for parking; respect the venue and neighbors.
              </Item>
            </div>
          </Section>

          <Section id="second-weekend" title="Second Weekend Of The Month">
            <div className="grid gap-4 md:grid-cols-2">
              <Item title="Uptown Lexington Cruise-In" meta="2nd Tuesday (Mar–Oct) · Uptown Lexington, NC">
                A mid-week staple with hundreds of cars in a historic downtown setting.
              </Item>
              <Item title="Classic Car Cruise In – Monroe" meta="2nd Friday (Apr–Oct) · Historic Downtown Monroe, NC">
                Open to all; stroll downtown, enjoy restaurants, and check out the chrome.
              </Item>
              <Item title="Waterbean Cars and Coffee" meta="2nd Saturday · Cornelius, NC (Lake Norman)">
                Regular high-end turnout from the LKN community; arrive early for best parking.
              </Item>
              <Item title="RK Motors Carolina Classic & Performance" meta="2nd Saturday (Mar–Nov) · RK Motors Charlotte">
                Showroom cruise-in with classes, giveaways, and family-friendly activities.
              </Item>
              <Item title="Kannapolis Cruise-In" meta="2nd Saturday (Apr–Nov) · Downtown Kannapolis, NC">
                Big draw with 500+ classics not uncommon; great Americana atmosphere.
              </Item>
              <Item title="Taillights At Twilight" meta="2nd Saturday · Indian Land, SC">
                Evening meet with specials and tours at Charlotte Auto Spa and nearby vendors.
              </Item>
              <Item title="Early Henry Cruise-In" meta="2nd Sunday (Mar–Nov) · Statesville, NC">
                Pre-’72 classics gathering; bring your vintage ride.
              </Item>
            </div>
          </Section>

          <Section id="third-weekend" title="Third Weekend Of The Month">
            <div className="grid gap-4 md:grid-cols-2">
              <Item title="East Coast Cruisers Monthly Meeting" meta="3rd Monday · Concord, NC">
                Club meeting; prospective members welcome.
              </Item>
              <Item title="Hot Rods and Hops" meta="3rd Friday (from Apr) · Cornelius, NC">
                Evening gathering with food trucks, brewery options, and music.
              </Item>
              <Item title="Cars and Coffee Concord" meta="3rd Saturday (except May/Oct) · Charlotte Motor Speedway">
                Fan Zone cruise-in hosted at CMS; all are welcome.
              </Item>
              <Item title="Caffeine and Horsepower" meta="3rd Saturday · Weddington, NC (Harris Teeter lot)">
                Neighborhood meet with coffee and donuts; strong community vibe.
              </Item>
              <Item title="Cars At The Cafe" meta="3rd Saturday · Community Matters Cafe, Charlotte, NC">
                Non-profit focused meet supporting local causes in a central location.
              </Item>
              <Item title="Mayberry Cool Cars & Rods" meta="3rd Saturday (Jun–Oct) · Downtown Mount Airy, NC">
                Historic downtown setting; music, shopping, and a big turnout.
              </Item>
            </div>
          </Section>

          <Section id="fourth-weekend" title="Fourth Weekend Of The Month">
            <div className="grid gap-4 md:grid-cols-2">
              <Item title="Oakboro Cruise-In" meta="4th Friday · Downtown Oakboro, NC (burnout at ~9pm)">
                One of NC’s largest downtown cruise-ins—bring a chair and your camera.
              </Item>
              <Item title="Caffeine and Classics" meta="4th Saturday · Streetside Classics, Concord, NC">
                Showroom event at Streetside’s expansive facility near CMS.
              </Item>
              <Item title="Rides & Coffee" meta="4th Sunday · Detail Garage, Charlotte, NC">
                Morning meet with coffee, demos, raffles, and product discounts.
              </Item>
              <Item title="Matthews North End Cruise-In" meta="4th Sunday (Apr–Nov) · Matthews, NC">
                Free family-friendly cruise-in with prizes and sponsor specials.
              </Item>
            </div>
          </Section>

          <Section id="annual-shows" title="Annual Car Shows in Charlotte">
            <div className="grid gap-4 md:grid-cols-2">
              <Item title="Charlotte AutoFair" meta="Every April & September · Charlotte Motor Speedway">
                Massive spring and fall show by the AACA Hornets Nest Region: swap meets, judged shows,
                cruise-ins, and special exhibits that attract enthusiasts from across the Southeast.
              </Item>
              <Item title="Charlotte International Auto Show" meta="Typically November · Charlotte Convention Center">
                New-model showcase from 30+ manufacturers with hands-on product demos and ride & drive opportunities.
              </Item>
            </div>
            <p className="text-sm text-[var(--fg)]/60 mt-3">Always verify dates and details on the event’s official site or on our <Link href="/events/" className="underline">events page</Link>.</p>
          </Section>

          <Section id="local-resources" title="Local Resources">
            <ul className="list-disc pl-6 space-y-2">
              <li><a className="underline" href="https://carshowseo.com/" target="_blank" rel="noreferrer">Car Show SEO</a></li>
              <li><a className="underline" href="https://raleighcarshows.com/" target="_blank" rel="noreferrer">Raleigh Car Shows</a></li>
              <li><a className="underline" href="https://charlottestormwater.com/" target="_blank" rel="noreferrer">Charlotte Stormwater</a></li>
              <li><a className="underline" href="https://clttrailerrental.com/" target="_blank" rel="noreferrer">Charlotte Trailer Rental</a></li>
            </ul>
          </Section>
        </div>

        {/* Right rail ToC (sticky on desktop) */}
        <aside className="hidden lg:block self-start sticky top-20">
          <div className="ccs-card">
            <h2 className="text-base font-semibold text-[var(--fg)] mb-3">On this page</h2>
            <ul className="space-y-2 text-[var(--fg)]/80">
              <li><a className="hover:underline" href="#first-weekend">First Weekend Of The Month</a></li>
              <li><a className="hover:underline" href="#second-weekend">Second Weekend Of The Month</a></li>
              <li><a className="hover:underline" href="#third-weekend">Third Weekend Of The Month</a></li>
              <li><a className="hover:underline" href="#fourth-weekend">Fourth Weekend Of The Month</a></li>
              <li><a className="hover:underline" href="#annual-shows">Annual Car Shows in Charlotte</a></li>
              <li><a className="hover:underline" href="#local-resources">Local Resources</a></li>
            </ul>
            {/* Skyscraper ad: visible only on lg+ (aside is hidden on mobile) */}
            <div className="mt-4">
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
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
