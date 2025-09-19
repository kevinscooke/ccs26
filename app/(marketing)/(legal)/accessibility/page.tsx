import type { Metadata } from "next";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "Accessibility – Charlotte Car Shows",
  description: "Our commitment to an accessible experience for all users.",
  alternates: { canonical: "https://charlottecarshows.com/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <Container>
      <h1 className="text-3xl font-bold">Accessibility</h1>
      <p className="mt-2 text-sm text-gray-600">Last updated: September 17, 2025</p>

      <div className="prose mt-6">
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
          If you encounter barriers, email <a href="mailto:hello@charlottecarshows.com">hello@charlottecarshows.com</a>
          with the page URL and description. We’ll work to resolve it promptly.
        </p>
      </div>
    </Container>
  );
}
