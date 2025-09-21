// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import Script from "next/script";
import type { Metadata } from "next";

import TopNav from "@/components/nav/TopNav";
import Footer from "@/components/Footer";

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
    site: "@CharlotteCarShows",
  },
  robots: {
    index: true,
    follow: true,
  },
  // themeColor moved to generateViewport
  // Next.js viewport themeColor
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192" },
      { url: "/icon-512.png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
};

export function generateViewport() {
  return {
    themeColor: "#ffffff"
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Small perf wins for GA and images */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
      </head>
      <body className="bg-bg text-text">
        <div className="min-h-dvh flex flex-col">
          <TopNav />
          <main className="container flex-1 py-8">{children}</main>
          <Footer />
        </div>

        {/* CollectionPage JSON-LD */}
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

        {/* Organization JSON-LD */}
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
                "https://www.facebook.com/CharlotteCarShows/",
              ],
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  email: "hello@charlottecarshows.com",
                  contactType: "customer support",
                  areaServed: "US-NC",
                  availableLanguage: ["en"],
                },
              ],
            }),
          }}
        />

        {/* Google Analytics 4 (GA4) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ECG2CKEFSG"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ECG2CKEFSG', { 'send_page_view': true });
          `}
        </Script>

        {/* Google Ads (AdSense) - raw script tag so AdSense doesn't warn about data-nscript */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1514406406537630"
          crossOrigin="anonymous"
          async
        />
      </body>
    </html>
  );
}
