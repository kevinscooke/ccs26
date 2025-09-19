import type { Metadata } from "next";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "Privacy Policy – Charlotte Car Shows",
  description: "How we collect, use, and protect your information.",
  alternates: { canonical: "https://charlottecarshows.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <Container>
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-600">Last updated: September 17, 2025</p>

      <div className="prose mt-6">
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
    </Container>
  );
}
