import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Submit Your Event – Charlotte Car Shows",
  description: "List your car show, meet, or automotive event in Charlotte. Free submissions with quick approval process.",
  alternates: { canonical: "https://charlottecarshows.com/contact" },
  openGraph: {
    title: "Submit Your Car Show – Charlotte Car Shows",
    description: "Add your automotive event to Charlotte's most comprehensive car show listing platform.",
    url: "https://charlottecarshows.com/contact",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Submit Your Car Show – Charlotte Car Shows",
    description: "Add your automotive event to Charlotte's most comprehensive car show listing platform.",
  },
};

export default function Contact() {
  return (
    <section className="ccs-card max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight mb-2 text-zinc-900">Contact Charlotte Car Shows</h1>
      <p className="mb-4 text-zinc-700">
        Have a question, want to partner, or just want to say hello? Use the form below.
      </p>

      {/* Contact Form */}
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
}
