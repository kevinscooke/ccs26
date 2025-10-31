import type { Metadata } from "next";
import Container from '@/components/Container';
import Breadcrumbs from '@/components/Breadcrumbs';
import { buildBreadcrumbListSchema } from "@/lib/eventSchema";
import dynamicImport from "next/dynamic"; // rename to avoid clashing with `export const dynamic`
const AdSlot = dynamicImport(() => import("@/components/ads/AdSlot"), { ssr: false });

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
  // Build BreadcrumbList schema
  const breadcrumbSchema = buildBreadcrumbListSchema(
    [
      { label: "Home", href: "/" },
      { label: "Contact", current: true },
    ],
    { currentPageUrl: "https://charlottecarshows.com/contact" }
  );

  return (
    <Container>
      <section className="w-full space-y-8 lg:space-y-10">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Contact", current: true },
          ]}
        />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: contact content ~60% (col-span-7/12 ≈ 58.3%) */}
        <div className="md:col-span-7">
          <section className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow">
            <h1 className="text-3xl font-semibold tracking-tight mb-2 text-zinc-900">Contact Charlotte Car Shows</h1>
            <p className="mb-4 text-zinc-700">
              Have a question, want to partner, or just want to say hello? Use the form below.
            </p>

            {/* Contact Form */}
            <form
              method="POST"
              name="contact"
              className="space-y-5 mb-8"
              data-netlify="true"
            >
              <input type="hidden" name="form-name" value="contact" />
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
                  <button type="submit" className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30">Send Message</button>
                </div>
              </div>
            </form>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2 text-zinc-900">Want to submit an event?</h2>
              <p className="mb-2 text-zinc-700">If you want to add your car show, meet, or automotive event to our calendar, use our dedicated event submission form.</p>
              <a href="/submit-event" className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30">Submit Your Event</a>
            </div>
          </section>
        </div>

        {/* Right: skyscraper ad ~40% (col-span-5/12 ≈ 41.7%) */}
        <aside className="md:col-span-5">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow">
            <div className="flex items-center justify-center">
              <AdSlot
                slot="7335717776"
                sizes={[
                  { media: "(min-width: 1024px)", width: 300, height: 600 }, // desktop skyscraper
                  { media: "(max-width: 1023px)", width: 320, height: 100 },  // mobile fallback
                ]}
              />
            </div>
          </div>
        </aside>
        </div>
      </section>
    </Container>
  );
}
