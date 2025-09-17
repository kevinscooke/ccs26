import './globals.css';
import type { ReactNode } from 'react';
import TopNav from '@/components/nav/TopNav';

export const metadata = {
  title: 'Charlotte Car Shows | Weekly Events & Cruise-Ins',
  description: 'Updated weekly—find, promote, and enjoy the best car events across Charlotte and surrounding areas. Free submissions, featured listings, and more.',
  alternates: { canonical: 'https://charlottecarshows.com/' },
  openGraph: {
    title: 'Charlotte Car Shows',
    description: 'Weekly Charlotte-area car shows, meets, cruise-ins, and track events.',
    url: 'https://charlottecarshows.com/',
    siteName: 'Charlotte Car Shows',
    images: [{ url: '/og/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TopNav />
        <main className="container py-8">{children}</main>
        <footer className="container py-8 text-sm text-zinc-400">© {new Date().getFullYear()} Charlotte Car Shows</footer>
      </body>
    </html>
  );
}

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Charlotte Car Shows",
      "description": "Weekly Charlotte-area car shows, meets, and cruise-ins.",
      "url": "https://charlottecarshows.com/",
      "publisher": {
        "@type": "Organization",
        "name": "Charlotte Car Shows",
        "url": "https://charlottecarshows.com/"
      }
    })
  }}
/>

