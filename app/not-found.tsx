import NotFoundClient from "@/components/NotFoundClient";
import Link from "next/link";
import UpcomingSix from "@/components/event/UpcomingSix";

export default function NotFound() {
  return (
    <main className="px-4 py-6 max-w-5xl mx-auto">
      {/* instrumentation */}
      <NotFoundClient />

      <section className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-sm text-[var(--fg)]/70">We couldn't find the page you requested. We recently launched a new site. Try one of the quick links below.</p>

        <div className="mt-3 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/events/" className="ccs-btn-secondary px-4 py-2 w-full sm:w-auto text-center">All Events</Link>
          <Link href="/weekly-car-show-list-charlotte/" className="ccs-btn-primary px-4 py-2 w-full sm:w-auto text-center">Weekly Shows</Link>
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
