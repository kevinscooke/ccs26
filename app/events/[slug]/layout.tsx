import type { ReactNode } from "react";
import AdSense from "@/components/ads/AdSense";

export default function EventDetailLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="container py-6">{children}</div>

      <div className="container py-6">
        <AdSense />
      </div>
    </div>
  );
}
