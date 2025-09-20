import type { Metadata } from "next";
import Container from "@/components/Container";
import ResourceCard from "@/components/ResourceCard";
import { resources } from "./resources.data";

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

import Link from "next/link";
import GoogleAd from "@/components/ui/GoogleAd";

export default function ResourcesPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Charlotte Automotive Resources</h1>
      <p className="mb-6 text-lg text-zinc-700">
        Dealerships, Service Centers, Detailers, Tint & Wraps, Photographers & More. These businesses are recommended based on their tenure and reputation in the local car community.
      </p>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Featured Repair</h2>
        <div className="grid gap-6 mb-8">
          {/* Eurowise Performance */}
          <div className="ccs-card">
            <h3 className="text-lg font-bold">Eurowise Performance</h3>
            <p className="mb-2">Eurowise Performance is Charlotte’s premier European auto specialist, offering performance upgrades, maintenance, and custom builds for VW, Audi, Porsche, BMW, and more. Trusted by enthusiasts for their expertise and quality service.</p>
            <p className="mb-1 text-sm text-zinc-600">441 Springbrook Rd, Charlotte, NC 28217</p>
            <a href="https://eurowise.com/" target="_blank" rel="noopener" className="ccs-btn mt-2">Visit Website</a>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-2">Featured Dealerships</h2>
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
      {/* Google Ad between sections */}
      <GoogleAd slot="1234567890" format="auto" className="my-8" />

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Local Resources</h2>
        <ul className="list-disc ml-6 text-zinc-700">
          <li><a href="https://carshowseo.com/" target="_blank" rel="noopener" className="underline">Car Show SEO</a></li>
          <li><a href="https://charlottestormwater.com/" target="_blank" rel="noopener" className="underline">Charlotte Stormwater</a></li>
          <li><a href="https://clttrailerrental.com/" target="_blank" rel="noopener" className="underline">Charlotte Trailer Rental</a></li>
          <li><a href="https://peoples.golf/" target="_blank" rel="noopener" className="underline">Peoples Golf</a></li>
          <li><a href="https://raleighcarshows.com/" target="_blank" rel="noopener" className="underline">Raleigh Car Shows</a></li>
          <li><a href="https://charlottecarshows.com/" target="_blank" rel="noopener" className="underline">Atlanta Car Shows</a></li>
          <li><a href="https://www.redfin.com/blog/unique-things-to-do-in-charlotte/" target="_blank" rel="noopener" className="underline">REDFIN BLOG</a></li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Want to be listed?</h2>
        <p className="text-zinc-700">Don’t see your business listed? <Link href="/contact" className="underline">Send us a message</Link> and we’ll get it added for free.</p>
      </section>
    </main>
  );
}
