import type { Metadata } from "next";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ResourceCard from "@/components/ResourceCard";
import { resources } from "./resources.data";
import Link from "next/link";
import dynamic from "next/dynamic";
import { buildBreadcrumbListSchema } from "@/lib/eventSchema";
const AdSlot = dynamic(() => import("@/components/ads/AdSlot"), { ssr: false });

export const revalidate = 604800; // 1 week ISR for resources

export const metadata: Metadata = {
  title: "Resources – Charlotte Car Shows",
  description:
    "Curated links to calendars, venues, car clubs, vendors, and local automotive resources around Charlotte.",
  alternates: { canonical: "https://charlottecarshows.com/resources" },
  openGraph: {
    type: "website",
    url: "https://charlottecarshows.com/resources",
    title: "Resources – Charlotte Car Shows",
    description:
      "Curated links to calendars, venues, car clubs, vendors, and local automotive resources around Charlotte.",
  },
};

export default function ResourcesPage() {
  // Build BreadcrumbList schema
  const breadcrumbSchema = buildBreadcrumbListSchema(
    [
      { label: "Home", href: "/" },
      { label: "Resources", current: true },
    ],
    { currentPageUrl: "https://charlottecarshows.com/resources" }
  );

  return (
    <Container>
      <section className="w-full space-y-8 lg:space-y-10">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Resources", current: true },
          ]}
        />

        <header className="space-y-2 text-left">
          <h1
            className="text-3xl font-bold tracking-tight text-[var(--fg)] lg:text-[34px]"
            style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
          >
            Charlotte Automotive Resources
          </h1>
          <p className="max-w-3xl text-base text-[var(--fg)]/70 lg:text-[15px]">
            Dealerships, Service Centers, Detailers, Tint & Wraps, Photographers & More. These businesses are recommended based on their tenure and reputation in the local car community.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-8 lg:col-span-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Featured Repair</h2>
        <div className="grid gap-6 mb-8">
          {/* Eurowise Performance */}
          <div className="ccs-card">
            <h3 className="text-lg font-bold">Eurowise Performance</h3>
            <p className="mb-2">Eurowise Performance is Charlotte’s premier European auto specialist, offering performance upgrades, maintenance, and custom builds for VW, Audi, Porsche, BMW, and more. Trusted by enthusiasts for their expertise and quality service.</p>
            <p className="mb-1 text-sm text-zinc-600">441 Springbrook Rd, Charlotte, NC 28217</p>
            <a href="https://eurowise.com/" target="_blank" rel="noopener" className="ccs-btn mt-2">Visit Website</a>
          </div>
            </div>
            <h2 className="text-2xl font-semibold mb-4 mt-8">Featured Dealerships</h2>
        <div className="grid gap-6">
          {/* Lamborghini Charlotte */}
          <div className="ccs-card">
            <h3 className="text-lg font-bold">Lamborghini Charlotte</h3>
            <p className="mb-2">Experience the luxury difference at Lamborghini Charlotte. Offering the very best new and pre-owned luxury vehicles. Order your Lamborghini today in Charlotte and have it delivered across the Carolinas.</p>
            <p className="mb-1 text-sm text-zinc-600">6500 E Independence Blvd, Charlotte, NC 28212</p>
            <p className="mb-1 text-sm text-zinc-600">Models: Aventador, Huracan, Huracan STO, Urus</p>
            <a href="https://www.lamborghinicharlotte.com/" target="_blank" rel="noopener" className="ccs-btn mt-2">Visit Website</a>
          </div>
          
          {/* Foreign Cars Charlotte */}
          <div className="ccs-card">
            <h3 className="text-lg font-bold">Foreign Cars Charlotte</h3>
            <p className="mb-2">Foreign Cars Charlotte offers a curated selection of luxury and exotic vehicles, including Ferrari, Maserati, Aston Martin, and Porsche. Their team provides a personalized buying experience for discerning clients.</p>
            <p className="mb-1 text-sm text-zinc-600">416 Tyvola Rd, Charlotte, NC 28217</p>
            <a href="https://www.foreigncarscharlotte.com/" target="_blank" rel="noopener" className="ccs-btn mt-2">Visit Website</a>
          </div>
          {/* Chicago Motor Cars of SC */}
          <div className="ccs-card">
            <h3 className="text-lg font-bold">Chicago Motor Cars of SC</h3>
            <p className="mb-2">Chicago Motor Cars of SC brings high-end performance and luxury vehicles to the Carolinas, specializing in rare and collectible cars. Their knowledgeable staff can help you find your dream car.</p>
            <p className="mb-1 text-sm text-zinc-600">Charlotte, NC & South Carolina</p>
            <a href="https://www.chicagomotorcars.com/" target="_blank" rel="noopener" className="ccs-btn mt-2">Visit Website</a>
          </div>
            </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Local Resources</h2>
              <ul className="list-disc pl-6 space-y-2 text-[var(--fg)]/80">
                <li><a href="https://carshowseo.com/" target="_blank" rel="noopener" className="underline hover:text-brand-700">Car Show SEO</a></li>
                <li><a href="https://charlottestormwater.com/" target="_blank" rel="noopener" className="underline hover:text-brand-700">Charlotte Stormwater</a></li>
                <li><a href="https://clttrailerrental.com/" target="_blank" rel="noopener" className="underline hover:text-brand-700">Charlotte Trailer Rental</a></li>
                <li><a href="https://peoples.golf/" target="_blank" rel="noopener" className="underline hover:text-brand-700">Peoples Golf</a></li>
                <li><a href="https://raleighcarshows.com/" target="_blank" rel="noopener" className="underline hover:text-brand-700">Raleigh Car Shows</a></li>
                <li><a href="https://charlottecarshows.com/" target="_blank" rel="noopener" className="underline hover:text-brand-700">Atlanta Car Shows</a></li>
                <li><a href="https://www.redfin.com/blog/unique-things-to-do-in-charlotte/" target="_blank" rel="noopener" className="underline hover:text-brand-700">REDFIN BLOG</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Want to be listed?</h2>
              <p className="text-[var(--fg)]/80">Don&apos;t see your business listed? <Link href="/contact" className="underline hover:text-brand-700">Send us a message</Link> and we&apos;ll get it added for free.</p>
            </section>
          </div>

          <aside className="space-y-4 lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center justify-center">
              <AdSlot
                slot="7335717776"
                sizes={[
                  { media: "(min-width: 1024px)", width: 300, height: 600 }, // desktop skyscraper
                  { media: "(max-width: 1023px)", width: 320, height: 100 }, // mobile fallback
                ]}
              />
            </div>
          </aside>
        </div>
      </section>
    </Container>
  );
}
