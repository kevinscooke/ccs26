import type { ReactNode } from "react";
import AdSense from "@/components/ads/AdSense";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="container py-6">
        {children}
      </div>

      {/* Ad slot for marketing pages */}
      <div className="container py-6">
        <AdSense className="mx-auto" />
      </div>
    </div>
  );
}
