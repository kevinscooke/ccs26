// components/ads/AdSlot.tsx
"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

type AdSlotProps = {
  slot: string; // AdSense ad slot id
  className?: string;
  style?: React.CSSProperties;
  format?: string; // "auto"
  fullWidthResponsive?: "true" | "false";
};

export default function AdSlot({
  slot,
  className,
  style,
  format = "auto",
  fullWidthResponsive = "true",
}: AdSlotProps) {
  const insRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    const el = insRef.current as any;
    if (!el) return;

    const alreadyLoaded =
      el.getAttribute?.("data-adsbygoogle-status") === "done";

    const maybePush = () => {
      if (pushedRef.current) return;
      if (alreadyLoaded) {
        pushedRef.current = true;
        return;
      }
      try {
        if (typeof window !== "undefined") {
          window.adsbygoogle = window.adsbygoogle || [];
          // Push only once per slot instance
          window.adsbygoogle.push({});
          pushedRef.current = true;
        }
      } catch (err: any) {
        // Ignore benign "All 'ins' elements..." errors when nothing left to fill
        const msg = String(err?.message || err || "");
        if (!msg.includes("All 'ins' elements")) {
          // Optional: console.warn("[AdSlot]", msg);
        }
      }
    };

    // Push when near viewport (reduces errors and improves LCP)
    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry?.isIntersecting) {
            maybePush();
            observer?.disconnect();
            observer = null;
          }
        },
        { rootMargin: "300px 0px" }
      );
      observer.observe(el);
    } catch {
      // Fallback if IntersectionObserver unavailable
      setTimeout(maybePush, 1000);
    }

    // Safety timeout in case observer never fires
    const t = setTimeout(maybePush, 4000);

    return () => {
      if (observer) observer.disconnect();
      clearTimeout(t);
    };
  }, [slot]);

  return (
    <ins
      ref={insRef as any}
      className={`adsbygoogle ${className ?? ""}`}
      style={{ display: "block", ...(style || {}) }}
      data-ad-client="ca-pub-1514406406537630"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={fullWidthResponsive}
    />
  );
}
