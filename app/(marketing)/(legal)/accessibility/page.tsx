import type { Metadata } from "next";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import { buildBreadcrumbListSchema } from "@/lib/eventSchema";

export const metadata: Metadata = {
  title: "Accessibility – Charlotte Car Shows",
  description: "Our commitment to an accessible experience for all users.",
  alternates: { canonical: "https://charlottecarshows.com/accessibility" },
};

export default function AccessibilityPage() {
  // Build BreadcrumbList schema
  const breadcrumbSchema = buildBreadcrumbListSchema(
    [
      { label: "Home", href: "/" },
      { label: "Accessibility", current: true },
    ],
    { currentPageUrl: "https://charlottecarshows.com/accessibility" }
  );

  return (
    <Container>
      <section className="w-full space-y-8 lg:space-y-10">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Accessibility", current: true },
          ]}
        />

        <header className="space-y-2 text-left">
          <h1
            className="text-3xl font-bold tracking-tight text-[var(--fg)] lg:text-[34px]"
            style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
          >
            Accessibility
          </h1>
          <p className="text-sm text-[var(--fg)]/60">Last updated: September 17, 2025</p>
        </header>

        <div className="prose max-w-3xl text-[var(--fg)]/80 leading-relaxed space-y-4">
        <p>
          We aim to meet WCAG 2.1 AA guidelines and continuously improve the
          accessibility of CharlotteCarShows.com.
        </p>

        <h2>Measures We Take</h2>
        <ul>
          <li>Logical headings, labels, and landmarks</li>
          <li>Keyboard navigability</li>
          <li>Sufficient color contrast and focus states</li>
          <li>Alt text for images where meaningful</li>
        </ul>

          <h2>Feedback</h2>
          <p>
            If you encounter barriers, email <a href="mailto:hello@charlottecarshows.com" className="underline hover:text-brand-700">hello@charlottecarshows.com</a>
            with the page URL and description. We'll work to resolve it promptly.
          </p>
        </div>
      </section>
    </Container>
  );
}
