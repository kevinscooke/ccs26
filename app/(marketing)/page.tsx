import { Suspense } from 'react';
import UpcomingSix from '@/components/event/UpcomingSix';

export default function Home() {
  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="ccs-card relative overflow-hidden">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            The #1 source for Charlotte car shows
          </h1>
          <p className="text-zinc-300">
            Updated weekly—find, promote, and enjoy the best car events across Charlotte and the surrounding area.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <a className="ccs-btn-primary" href="/events">Browse Events</a>
            <a className="ccs-btn" href="/pricing">Feature Your Event</a>
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="ccs-card">
          <h3 className="text-lg font-semibold">Updated Weekly Listings</h3>
          <p className="mt-1 text-zinc-300">
            One place for meets, cruise-ins, Cars &amp; Coffee, track nights, and more.
          </p>
        </div>
        <div className="ccs-card">
          <h3 className="text-lg font-semibold">Free Submissions</h3>
          <p className="mt-1 text-zinc-300">
            We post local events for free—send the details and we’ll share it.
          </p>
        </div>
        <div className="ccs-card">
          <h3 className="text-lg font-semibold">Promotion Options</h3>
          <p className="mt-1 text-zinc-300">
            Upgrade to <em>Featured</em> for top placement and extra reach.
          </p>
        </div>
      </section>

      {/* THIS WEEK / QUICK LINKS */}
      <section className="ccs-card">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">This Week</h2>
          <a className="ccs-btn" href="/events">View full list</a>
        </div>
        <p className="mt-2 text-zinc-300">
          We curate weekly Charlotte-area events—Charlotte, Mooresville, Concord, Rock Hill, Indian Trail, Waxhaw and more.
        </p>

        <Suspense fallback={<div className="mt-4 text-zinc-400">Loading events…</div>}>
          {/* @ts-expect-error Async Server Component */}
          <UpcomingSix />
        </Suspense>
      </section>

      {/* LOCAL HIGHLIGHTS (OPTIONAL) */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="ccs-card">
          <h3 className="text-lg font-semibold">Cars &amp; Coffee at CMS</h3>
          <p className="mt-1 text-zinc-300">
            Third Saturday each month at Charlotte Motor Speedway—free spectator admission.
          </p>
          <div className="mt-3">
            <a className="ccs-btn" href="/events">See dates</a>
          </div>
        </div>
        <div className="ccs-card">
          <h3 className="text-lg font-semibold">Seasonal &amp; Big Shows</h3>
          <p className="mt-1 text-zinc-300">
            AutoFair, the Charlotte Auto Show, and more—watch the calendar for dates.
          </p>
          <div className="mt-3">
            <a className="ccs-btn" href="/events">Browse upcoming</a>
          </div>
        </div>
      </section>

      {/* SOCIAL / COMMUNITY */}
      <section className="ccs-card">
        <h2 className="text-2xl font-semibold tracking-tight">Join the community</h2>
        <p className="mt-2 text-zinc-300">
          Follow for weekly lists, features, and last-minute updates.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a className="ccs-btn" href="https://www.instagram.com/charlottecarshows/" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a className="ccs-btn" href="https://www.facebook.com/CharlotteCarShows/" target="_blank" rel="noreferrer">
            Facebook
          </a>
        </div>
      </section>
    </div>
  );
}

