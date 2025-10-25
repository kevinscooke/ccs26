"use client";

import AdSlot from "@/components/ads/AdSlot";

export default function FooterAdBar() {
  return (
    <footer aria-label="Advertisement" className="mt-6">
      <div className="flex items-center justify-center p-0 bg-transparent">
        <AdSlot
          slot="7744630827" // use your bottom/leaderboard unit id
          // full-width responsive; reserve a bit of height so push() reliably fires
          style={{ display: "block", width: "100%", minHeight: 120, lineHeight: 0 }}
        />
      </div>
    </footer>
  );
}