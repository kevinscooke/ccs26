import type { Metadata } from "next";
import { Suspense } from "react";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SearchBox } from "@/components/search/SearchBox";
import { buildBreadcrumbListSchema } from "@/lib/eventSchema";
import SearchResults from "./SearchResults";

export const metadata: Metadata = {
  title: "Search Charlotte Car Shows | Charlotte Car Shows",
  description:
    "Search for car shows, events, and automotive gatherings in Charlotte, NC and the surrounding area. Find events by name, venue, date, or location.",
  alternates: {
    canonical: "https://charlottecarshows.com/search",
  },
  openGraph: {
    title: "Search Charlotte Car Shows",
    description: "Search for car shows, events, and automotive gatherings in Charlotte, NC and the surrounding area.",
    url: "https://charlottecarshows.com/search",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Search Charlotte Car Shows",
    description: "Search for car shows, events, and automotive gatherings in Charlotte, NC.",
  },
};

export default function SearchPage() {
  const breadcrumbSchema = buildBreadcrumbListSchema(
    [
      { label: "Home", href: "/" },
      { label: "Search", current: true },
    ],
    { currentPageUrl: "https://charlottecarshows.com/search" }
  );

  return (
    <Container>
      <section className="w-full space-y-8 lg:space-y-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Search", current: true },
          ]}
        />
        <header className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--fg)] lg:text-[34px]" style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}>
              Search
            </h1>
          </div>
          <div className="max-w-md">
            <SearchBox />
          </div>
        </header>
        <Suspense
          fallback={
            <div className="h-16 animate-pulse rounded-xl border border-gray-200 bg-gray-100" />
          }
        >
          <SearchResults />
        </Suspense>
      </section>
    </Container>
  );
}
