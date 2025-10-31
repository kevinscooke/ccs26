import type { Metadata } from "next";
import Container from '@/components/Container';
import Breadcrumbs from '@/components/Breadcrumbs';
import { buildBreadcrumbListSchema } from "@/lib/eventSchema";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Submit Your Event – Charlotte Car Shows",
  description:
    "List your car show, meet, or automotive event in Charlotte. Free submissions with quick approval process.",
  alternates: { canonical: "https://charlottecarshows.com/submit-event" },
  openGraph: {
    title: "Submit Your Car Show – Charlotte Car Shows",
    description:
      "Add your automotive event to Charlotte's most comprehensive car show listing platform.",
    url: "https://charlottecarshows.com/submit-event",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Submit Your Car Show – Charlotte Car Shows",
    description:
      "Add your automotive event to Charlotte's most comprehensive car show listing platform.",
  },
};

export default function SubmitEventPage() {
  // Build BreadcrumbList schema
  const breadcrumbSchema = buildBreadcrumbListSchema(
    [
      { label: "Home", href: "/" },
      { label: "Submit Event", current: true },
    ],
    { currentPageUrl: "https://charlottecarshows.com/submit-event" }
  );

  return (
    <Container>
      <section className="w-full space-y-8 lg:space-y-10">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Submit Event", current: true },
          ]}
        />
        <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">
        Submit Your Event
      </h1>
      <p className="mb-4 text-zinc-700">
        Add your car show, meet, or automotive event to our calendar. Free
        submissions, quick approval, and maximum visibility for Charlotte
        enthusiasts.
      </p>

      <form
  method="POST"
  name="submit-event"
  className="mt-6 space-y-5"
  data-netlify="true"
      >
        <input type="hidden" name="form-name" value="submit-event" />
  {/* <input type="hidden" name="bot-field" /> */}

        <div className="grid gap-4">
          <label htmlFor="submit-name" className="flex flex-col gap-2">
            <span className="text-sm text-zinc-500">
              Name<span className="text-red-500">*</span>
            </span>
            <input
              id="submit-name"
              type="text"
              name="name"
              required
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
              placeholder="Your name"
            />
          </label>

          <label htmlFor="submit-email" className="flex flex-col gap-2">
            <span className="text-sm text-zinc-500">
              Email<span className="text-red-500">*</span>
            </span>
            <input
              id="submit-email"
              type="email"
              name="email"
              required
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
              placeholder="you@example.com"
            />
          </label>

          <label htmlFor="submit-event-url" className="flex flex-col gap-2">
            <span className="text-sm text-zinc-500">Event URL</span>
            <input
              id="submit-event-url"
              type="url"
              name="event_url"
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
              placeholder="https://example.com/event"
            />
          </label>

          <label htmlFor="submit-event-date" className="flex flex-col gap-2">
            <span className="text-sm text-zinc-500">
              Event Date<span className="text-red-500">*</span>
            </span>
            <input
              id="submit-event-date"
              type="date"
              name="event_date"
              required
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label htmlFor="submit-start-time" className="flex flex-col gap-2">
              <span className="text-sm text-zinc-500">
                Start Time<span className="text-red-500">*</span>
              </span>
              <input
                id="submit-start-time"
                type="time"
                name="event_start_time"
                required
                className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
              />
            </label>

            <label htmlFor="submit-end-time" className="flex flex-col gap-2">
              <span className="text-sm text-zinc-500">
                End Time<span className="text-red-500">*</span>
              </span>
              <input
                id="submit-end-time"
                type="time"
                name="event_end_time"
                required
                className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
              />
            </label>
          </div>

          <label htmlFor="submit-location" className="flex flex-col gap-2">
            <span className="text-sm text-zinc-500">Event Location</span>
            <input
              id="submit-location"
              type="text"
              name="event_location"
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
              placeholder="Venue name, address, city, state"
            />
          </label>

          <label htmlFor="submit-details" className="flex flex-col gap-2">
            <span className="text-sm text-zinc-500">Details</span>
            <textarea
              id="submit-details"
              name="details"
              rows={6}
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
              placeholder="Tell us about your event (parking info, cost, special notes, etc.)"
            />
          </label>

          <div className="pt-2">
            <button type="submit" className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30">
              Submit Event
            </button>
          </div>
        </div>
      </form>
        </div>
      </section>
    </Container>
  );
}
