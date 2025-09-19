// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import Script from "next/script";
import type { Metadata } from "next";

import TopNav from "@/components/nav/TopNav";
import Footer from "@/components/Footer"; // <- your new component

export const metadata: Metadata = {
  metadataBase: new URL("https://charlottecarshows.com"),
  title: {
    default: "Charlotte Car Shows",
    template: "%s | Charlotte Car Shows",
  },
  description:
    "Weekly-updated list of Charlotte, NC car shows, cruise-ins, and meets. Submit your event and get featured.",
  applicationName: "Charlotte Car Shows",
  alternates: {
    canonical: "https://charlottecarshows.com",
  },
  openGraph: {
    type: "website",
    siteName: "Charlotte Car Shows",
    url: "https://charlottecarshows.com",
  },
  twitter: {
    card: "summary_large_image",
    site: "@CharlotteCarShows", // update if you have one
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-bg text-text">
        {/* Page wrapper keeps footer at bottom and main content flexible */}
        <div className="min-h-dvh flex flex-col">
          <TopNav />

          {/* MAIN stays constrained to your container */}
          <main className="container flex-1 py-8">{children}</main>

          {/* Site-wide footer */}
          <Footer />
        </div>

        {/* JSON-LD moved into the tree via next/script */}
        <Script
          id="ld-collection"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: "Charlotte Car Shows",
              description:
                "Weekly Charlotte-area car shows, meets, and cruise-ins.",
              url: "https://charlottecarshows.com/",
              publisher: {
                "@type": "Organization",
                name: "Charlotte Car Shows",
                url: "https://charlottecarshows.com/",
              },
            }),
          }}
        />

        {/* Organization JSON-LD for the business */}
        <Script
          id="ld-organization"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Charlotte Car Shows",
              url: "https://charlottecarshows.com/",
              logo: "https://charlottecarshows.com/images/hero-ccs.jpg",
              sameAs: [
                "https://www.instagram.com/charlottecarshows/",
                "https://www.facebook.com/CharlotteCarShows/"
              ],
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  email: "hello@charlottecarshows.com",
                  contactType: "customer support",
                  areaServed: "US-NC",
                  availableLanguage: ["en"]
                }
              ]
            }),
          }}
        />
      </body>
    </html>
  );
}
