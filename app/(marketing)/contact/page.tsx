export const dynamic = "force-static";

export default function Contact() {
  return (
    <section className="ccs-card max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight">Submit Your Event</h1>
      <p className="mt-2 text-zinc-300">
        Prefer email? Reach us at <a className="underline" href="mailto:hello@charlottecarshows.com">hello@charlottecarshows.com</a>.
      </p>

      {/* Netlify Forms */}
      <form
        name="event-submission"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        action="/thanks"
        className="mt-6 space-y-5"
      >
        {/* Netlify required hidden inputs */}
        <input type="hidden" name="form-name" value="event-submission" />
        <p className="hidden">
          <label>
            Don’t fill this out: <input name="bot-field" />
          </label>
        </p>

        <div className="grid gap-4">
          {/* Name */}
          <label className="flex flex-col gap-2">
            <span className="text-sm text-zinc-400">Name<span className="text-red-500">*</span></span>
            <input
              type="text"
              name="name"
              required
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100"
              placeholder="Your name"
            />
          </label>

          {/* Email */}
          <label className="flex flex-col gap-2">
            <span className="text-sm text-zinc-400">Email<span className="text-red-500">*</span></span>
            <input
              type="email"
              name="email"
              required
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100"
              placeholder="you@example.com"
            />
          </label>

          {/* Event URL (optional) */}
          <label className="flex flex-col gap-2">
            <span className="text-sm text-zinc-400">Event URL</span>
            <input
              type="url"
              name="event_url"
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100"
              placeholder="https://example.com/event"
            />
          </label>

          {/* Event Date (required) */}
          <label className="flex flex-col gap-2">
            <span className="text-sm text-zinc-400">Event Date<span className="text-red-500">*</span></span>
            <input
              type="date"
              name="event_date"
              required
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100"
            />
          </label>

          {/* Start / End Time (required) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm text-zinc-400">Start Time<span className="text-red-500">*</span></span>
              <input
                type="time"
                name="event_start_time"
                required
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm text-zinc-400">End Time<span className="text-red-500">*</span></span>
              <input
                type="time"
                name="event_end_time"
                required
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100"
              />
            </label>
          </div>

          {/* Location (optional) */}
          <label className="flex flex-col gap-2">
            <span className="text-sm text-zinc-400">Event Location</span>
            <input
              type="text"
              name="event_location"
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100"
              placeholder="Venue name, address, city, state"
            />
          </label>

          {/* Details (optional) */}
          <label className="flex flex-col gap-2">
            <span className="text-sm text-zinc-400">Details</span>
            <textarea
              name="details"
              rows={6}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100"
              placeholder="Tell us about your event (parking info, cost, special notes, etc.)"
            />
          </label>

          {/* Optional: Netlify reCAPTCHA v2 */}
          {/* <div data-netlify-recaptcha="true"></div> */}

          <div className="pt-2">
            <button type="submit" className="ccs-btn">Submit Event</button>
          </div>
        </div>
      </form>
    </section>
  );
}
