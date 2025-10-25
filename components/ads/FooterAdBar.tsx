"use client";

import AdSlot from "@/components/ads/AdSlot";

export default function FooterAdBar() {
  return (
    <div aria-label="Advertisement" className="flex items-center justify-center bg-transparent py-2 md:py-3">
      <div className="leading-none">
        <AdSlot
          slot="7744630827"
          sizes={[
            { media: "(min-width: 1024px)", width: 728, height: 90 },
            { media: "(max-width: 1023px)", width: 320, height: 100 },
          ]}
        />
      </div>
    </div>
  );
}