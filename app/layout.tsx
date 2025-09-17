// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import Script from "next/script";

import TopNav from "@/components/nav/TopNav";
import Footer from "@/components/Footer"; // <- your new component

export const metadata = {
  title: "Charlotte Car Shows | Weekly Events & Cruise-Ins",
  description:
    "Updated weekly—find, promote, and enjoy the best car events across Charlotte and surrounding areas. Free submissions, featured listings, and more.",
  alternates: { canonical: "https://charlottecarshows.com/" },
  openGraph: {
    title: "Charlotte Car Shows",
    description:
      "Weekly Charlotte-area car shows, meets, cruise-ins, and track events.",
    url: "https://charlottecarshows.com/",
    siteName: "Charlotte Car Shows",
    images: [{ url: "/og/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
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
      </body>
    </html>
  );
}
