"use client";

import dynamic from "next/dynamic";
const AdSlot = dynamic(() => import("@/components/ads/AdSlot"), { ssr: false });

export default function FooterAdBar() {
  return (
    <div aria-label="Advertisement" className="bg-transparent py-2 md:py-3">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-12 leading-none flex justify-center">
        <AdSlot
          slot="8332267268" // use a dedicated footer unit, not the header/skyscraper slot
          // full-width responsive
          style={{ display: "block", width: "100%", minHeight: 120 }}
        />
      </div>
    </div>
  );
}