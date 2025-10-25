"use client";

import AdSlot from "@/components/ads/AdSlot";

export default function HeaderAdBar() {
  return (
    <div
      aria-label="Advertisement"
      className="flex items-center justify-center bg-transparent py-2 md:py-3" // equal, small spacing
    >
      <div className="leading-none">
        <AdSlot
          slot="7744630827" // leaderboard unit
          sizes={[
            { media: "(min-width: 1024px)", width: 728, height: 90 }, // desktop
            { media: "(max-width: 1023px)", width: 320, height: 100 }, // mobile
          ]}
        />
      </div>
    </div>
  );
}