import type { Metadata } from "next";

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
  return (
    <section className="ccs-card max-w-2xl mx-auto">
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
  netlify
      >
        <input type="hidden" name="form-name" value="submit-event" />
  {/* <input type="hidden" name="bot-field" /> */}

        <div className="grid gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm text-zinc-500">
              Name<span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              name="name"
              required
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
              placeholder="Your name"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-zinc-500">
              Email<span className="text-red-500">*</span>
            </span>
            <input
              type="email"
              name="email"
              required
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
              placeholder="you@example.com"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-zinc-500">Event URL</span>
            <input
              type="url"
              name="event_url"
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
              placeholder="https://example.com/event"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-zinc-500">
              Event Date<span className="text-red-500">*</span>
            </span>
            <input
              type="date"
              name="event_date"
              required
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm text-zinc-500">
                Start Time<span className="text-red-500">*</span>
              </span>
              <input
                type="time"
                name="event_start_time"
                required
                className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm text-zinc-500">
                End Time<span className="text-red-500">*</span>
              </span>
              <input
                type="time"
                name="event_end_time"
                required
                className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
              />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-zinc-500">Event Location</span>
            <input
              type="text"
              name="event_location"
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
              placeholder="Venue name, address, city, state"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-zinc-500">Details</span>
            <textarea
              name="details"
              rows={6}
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
              placeholder="Tell us about your event (parking info, cost, special notes, etc.)"
            />
          </label>

          <div className="pt-2">
            <button type="submit" className="ccs-btn">
              Submit Event
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
