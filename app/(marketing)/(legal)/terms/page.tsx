import type { Metadata } from "next";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import { buildBreadcrumbListSchema } from "@/lib/eventSchema";

export const metadata: Metadata = {
  title: "Terms of Service – Charlotte Car Shows",
  description: "Terms of Service for using CharlotteCarShows.com.",
  alternates: { canonical: "https://charlottecarshows.com/terms" },
};

export default function TermsPage() {
  // Build BreadcrumbList schema
  const breadcrumbSchema = buildBreadcrumbListSchema(
    [
      { label: "Home", href: "/" },
      { label: "Terms of Service", current: true },
    ],
    { currentPageUrl: "https://charlottecarshows.com/terms" }
  );

  return (
    <Container>
      <section className="w-full space-y-8 lg:space-y-10">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Terms of Service", current: true },
          ]}
        />

        <header className="space-y-2 text-left">
          <h1
            className="text-3xl font-bold tracking-tight text-[var(--fg)] lg:text-[34px]"
            style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
          >
            Terms of Service
          </h1>
          <p className="text-sm text-[var(--fg)]/60">Last updated: September 17, 2025</p>
        </header>

        <div className="prose max-w-3xl text-[var(--fg)]/80 leading-relaxed space-y-4">
        <p>
          Welcome to CharlotteCarShows.com (“Site”). By accessing or using the Site,
          you agree to these Terms. If you do not agree, please do not use the Site.
        </p>

        <h2>Use of the Site</h2>
        <p>
          You may use the Site for lawful purposes only. Event information is provided
          “as is” and may change without notice. Always verify details with event hosts.
        </p>

        <h2>Accounts & Submissions</h2>
        <p>
          If you submit events or content, you represent that you have rights to do so and
          grant us a nonexclusive license to display and promote that content on the Site
          and our social channels.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          The Site is provided without warranties of any kind. We are not liable for any
          damages arising from your use of the Site or reliance on event information.
        </p>

        <h2>Changes</h2>
        <p>We may update these Terms. Continued use means you accept the changes.</p>

          <h2>Contact</h2>
          <p>Email: hello@charlottecarshows.com</p>
        </div>
      </section>
    </Container>
  );
}
