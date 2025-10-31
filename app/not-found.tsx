import NotFoundClient from "@/components/NotFoundClient";
import Link from "next/link";
import UpcomingSix from "@/components/event/UpcomingSix";

export default function NotFound() {
  return (
    <main className="w-full px-4 md:px-12 max-w-7xl mx-auto py-6">
      {/* instrumentation */}
      <NotFoundClient />

      <section className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold">Page not found</h1>
  <p className="mt-2 text-sm text-[var(--fg)]/70">We could not find the page you requested. We recently launched a new site. Try one of the quick links below.</p>

        <div className="mt-3 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/events/" className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30 w-full sm:w-auto text-center">All Events</Link>
          <Link href="/weekly-car-show-list-charlotte/" className="inline-flex items-center justify-center rounded-xl bg-brand-600 text-white px-4 py-2 text-sm font-semibold hover:bg-brand-700 transition focus:outline-none focus:ring-2 focus:ring-brand-500/40 w-full sm:w-auto text-center">Weekly Shows</Link>
        </div>
      </section>

      {/* Place upcoming events below the header to fill the whitespace and provide useful content */}
      <section className="mt-6">
        <p className="text-center text-sm text-[var(--fg)]/70">Here are the next 6 events for quick access.</p>
        {/* UpcomingSix is an async server component that loads current events */}
        {/* Wrap in a suspense boundary if desired in parent pages; here we render directly */}
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <UpcomingSix />
      </section>

      <div className="mt-4 text-center">
        <Link href="/" className="text-sm text-[var(--fg)]/60 hover:underline">Return home</Link>
      </div>
    </main>
  );
}
