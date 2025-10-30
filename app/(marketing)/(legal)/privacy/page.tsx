import type { Metadata } from "next";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import { buildBreadcrumbListSchema } from "@/lib/eventSchema";

export const metadata: Metadata = {
  title: "Privacy Policy – Charlotte Car Shows",
  description: "How we collect, use, and protect your information.",
  alternates: { canonical: "https://charlottecarshows.com/privacy" },
};

export default function PrivacyPage() {
  // Build BreadcrumbList schema
  const breadcrumbSchema = buildBreadcrumbListSchema(
    [
      { label: "Home", href: "/" },
      { label: "Privacy Policy", current: true },
    ],
    { currentPageUrl: "https://charlottecarshows.com/privacy" }
  );

  return (
    <Container>
      <section className="w-full space-y-8 lg:space-y-10">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Privacy Policy", current: true },
          ]}
        />

        <header className="space-y-2 text-left">
          <h1
            className="text-3xl font-bold tracking-tight text-[var(--fg)] lg:text-[34px]"
            style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
          >
            Privacy Policy
          </h1>
          <p className="text-sm text-[var(--fg)]/60">Last updated: September 17, 2025</p>
        </header>

        <div className="prose max-w-3xl text-[var(--fg)]/80 leading-relaxed space-y-4">
        <h2>Information We Collect</h2>
        <p>
          Basic analytics, form submissions (e.g., event submissions, contact forms),
          and technical data (IP, device, pages viewed). We do not sell personal information.
        </p>

        <h2>How We Use Information</h2>
        <ul>
          <li>Operate and improve the Site</li>
          <li>Publish and promote submitted events</li>
          <li>Respond to inquiries</li>
          <li>Analytics to improve content and performance</li>
        </ul>

        <h2>Cookies & Analytics</h2>
        <p>
          We use cookies and analytics to understand usage. You can control cookies
          through your browser settings.
        </p>

        <h2>Data Retention</h2>
        <p>We keep data only as long as necessary for the purposes above.</p>

          <h2>Your Rights</h2>
          <ul>
            <li>Access, update, or delete your information</li>
            <li>Opt out of non-essential communications</li>
          </ul>

          <h2>Contact</h2>
          <p>Email: hello@charlottecarshows.com</p>
        </div>
      </section>
    </Container>
  );
}
