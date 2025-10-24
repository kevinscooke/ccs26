// components/ads/AdSlot.tsx
"use client";

import { useEffect, useRef, useState } from "react";

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
  const insRef = useRef<HTMLElement | null>(null);
  const pushedRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [fixedSize, setFixedSize] = useState<{ width: number; height: number } | null>(null);

  // Resolve size once on mount if sizes[] provided
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (Array.isArray(sizes) && sizes.length) {
      let chosen: { width: number; height: number } | null = null;
      for (const s of sizes) {
        try {
          if (window.matchMedia(s.media).matches) {
            chosen = { width: s.width, height: s.height };
            break;
          }
        } catch {
          // ignore
        }
      }
      if (!chosen) {
        const last = sizes[sizes.length - 1];
        chosen = { width: last.width, height: last.height };
      }
      setFixedSize(chosen);
    }

    setReady(true);
  }, [sizes]);

  // Push when ready (sizes chosen) and near viewport
  useEffect(() => {
    if (!ready) return;

    const el = insRef.current as any;
    if (!el) return;

    const alreadyLoaded = el.getAttribute?.("data-adsbygoogle-status") === "done";

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
        // benign repeats are ignored
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
      setTimeout(maybePush, 500);
    }

    const t = setTimeout(maybePush, 4000);
    return () => {
      observer?.disconnect();
      clearTimeout(t);
    };
  }, [ready, slot]);

  const mergedStyle: React.CSSProperties = {
    display: "block",
    ...(fixedSize ? { width: fixedSize.width, height: fixedSize.height } : {}),
    ...(style || {}),
  };

  // If sizes[] provided (fixed), omit responsive data attrs
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
