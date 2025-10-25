"use client";

import AdSlot from "@/components/ads/AdSlot";

export default function FooterAdBar() {
  return (
    <div aria-label="Advertisement" className="flex items-center justify-center bg-transparent py-2 md:py-3">
      <div className="leading-none w-full">
        <AdSlot
          slot="7744630827"
          // Responsive, any height based on screen/creative
          style={{ display: "block", width: "100%" }}
        />
      </div>
    </div>
  );
}