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
  sizes?: { media: string; width: number; height: number }[]; // pick one size by media query
};

export default function AdSlot({
  slot,
  className,
  style,
  format = "auto",
  fullWidthResponsive = true,
  sizes,
}: AdSlotProps) {
  const insRef = useRef<HTMLModElement | null>(null); // was HTMLInsElement
  const pushedRef = useRef(false);
  const sizeRef = useRef<{ width: number; height: number } | null>(null);

  useEffect(() => {
    // Resolve size once on mount if a sizes map is provided
    if (typeof window !== "undefined" && Array.isArray(sizes) && sizes.length) {
      for (const s of sizes) {
        try {
          if (window.matchMedia(s.media).matches) {
            sizeRef.current = { width: s.width, height: s.height };
            break;
          }
        } catch {}
      }
      // Fallback to last entry if none matched
      if (!sizeRef.current) {
        const last = sizes[sizes.length - 1];
        sizeRef.current = { width: last.width, height: last.height };
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = insRef.current as any;
    if (!el) return;

    // If using sizes, ensure we've chosen one before pushing
    if (sizes && !sizeRef.current) return;

    const alreadyLoaded =
      el.getAttribute?.("data-adsbygoogle-status") === "done";

    const maybePush = () => {
      if (pushedRef.current || alreadyLoaded) {
        pushedRef.current = true;
        return;
      }
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        pushedRef.current = true;
      } catch {
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
  }, [slot, sizes]);

  // Build style with optional fixed size from sizes[]
  const fixedSize = sizeRef.current;
  const mergedStyle: React.CSSProperties = {
    display: "block",
    ...(fixedSize ? { width: fixedSize.width, height: fixedSize.height } : {}),
    ...(style || {}),
  };

  // If sizes[] provided, force fixed-size mode (omit responsive data attrs)
  const dataProps =
    sizes || fullWidthResponsive === false
      ? {}
      : {
          "data-ad-format": format ?? "auto",
          "data-full-width-responsive": "true",
        };

  return (
    <ins
      ref={insRef as any}
      className={`adsbygoogle ${className ?? ""}`}
      style={mergedStyle}
      data-ad-client="ca-pub-1514406406537630"
      data-ad-slot={slot}
      {...(dataProps as any)}
    />
  );
}
