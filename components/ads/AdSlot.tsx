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
  format?: string; // e.g. "auto"
  fullWidthResponsive?: boolean; // accept boolean for ergonomics
};

export default function AdSlot({
  slot,
  className,
  style,
  format = "auto",
  fullWidthResponsive = true,
}: AdSlotProps) {
  const insRef = useRef<HTMLModElement | null>(null); // was HTMLInsElement
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
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        pushedRef.current = true;
      } catch (err) {
        // ignore benign repeat push errors
      }
    };

    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            maybePush();
            observer?.disconnect();
            observer = null;
          }
        },
        { rootMargin: "300px 0px" }
      );
      observer.observe(el);
    } catch {
      setTimeout(maybePush, 1000);
    }

    const t = setTimeout(maybePush, 4000);
    return () => {
      observer?.disconnect();
      clearTimeout(t);
    };
  }, [slot]);

  return (
    <ins
      ref={insRef}
      className={`adsbygoogle ${className ?? ""}`}
      style={{ display: "block", ...(style || {}) }}
      data-ad-client="ca-pub-1514406406537630"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
    />
  );
}
