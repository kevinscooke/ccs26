import type { Metadata } from "next";
import Container from "@/components/Container";
import ResourceCard from "@/components/ResourceCard";
import { resources } from "./resources.data";

export const revalidate = 3600;

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
  const grouped = resources.reduce<Record<string, typeof resources>>((acc, r) => {
    const key = r.category ?? "Other";
    (acc[key] ||= []).push(r);
    return acc;
  }, {});

  const categories = Object.keys(grouped).sort();

  return (
    <Container>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Resources</h1>
        <p className="mt-2 text-gray-600">
          Bookmarkable list of trusted Charlotte-area automotive links.
        </p>
      </header>

      <div className="space-y-10">
        {categories.map((cat) => (
          <section key={cat}>
            <h2 className="mb-4 text-xl font-semibold">{cat}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {grouped[cat].map((r) => (
                <ResourceCard key={r.href} {...r} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Optional: simple JSON-LD for breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://charlottecarshows.com/" },
              { "@type": "ListItem", position: 2, name: "Resources", item: "https://charlottecarshows.com/resources" }
            ],
          }),
        }}
      />
    </Container>
  );
}
