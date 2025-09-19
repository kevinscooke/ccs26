import type { NextPage } from "next";

const ContactPage: NextPage = () => (
  <section className="ccs-card max-w-2xl mx-auto">
    <h1 className="text-3xl font-semibold tracking-tight mb-2 text-zinc-900">Contact Charlotte Car Shows</h1>
    <p className="mb-4 text-zinc-700">
      Have a question, want to partner, or just want to say hello? Use the form below or email us at <a className="underline text-zinc-900" href="mailto:hello@charlottecarshows.com">hello@charlottecarshows.com</a>.
    </p>
    <form
      method="POST"
      name="contact"
      data-netlify="true"
      netlify-honeypot="bot-field"
      className="space-y-5 mb-8"
    >
      <input type="hidden" name="form-name" value="contact" />
      <input type="hidden" name="bot-field" />
      <div className="grid gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm text-zinc-400">Name<span className="text-red-500">*</span></span>
          <input
            type="text"
            name="name"
            required
            className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
            placeholder="Your name"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm text-zinc-400">Email<span className="text-red-500">*</span></span>
          <input
            type="email"
            name="email"
            required
            className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
            placeholder="you@example.com"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm text-zinc-400">Message<span className="text-red-500">*</span></span>
          <textarea
            name="message"
            required
            rows={5}
            className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
            placeholder="How can we help you?"
          />
        </label>
        <div className="pt-2">
          <button type="submit" className="ccs-btn">Send Message</button>
        </div>
      </div>
    </form>
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2 text-zinc-900">Want to submit an event?</h2>
      <p className="mb-2 text-zinc-700">If you want to add your car show, meet, or automotive event to our calendar, use our dedicated event submission form.</p>
      <a href="/submit-event" className="ccs-btn">Submit Your Event</a>
    </div>
  </section>
);

export default ContactPage;
