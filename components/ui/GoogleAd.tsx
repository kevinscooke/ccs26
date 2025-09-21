"use client";
import { useEffect, useRef, useState } from "react";

type GoogleAdProps = {
  slot: string | number;
  format?: string;
  className?: string;
};

// IntersectionObserver-based lazy-loading for ads.
// Behavior:
// - Renders the <ins> placeholder immediately (no reserved height) but only calls
//   (window as any).adsbygoogle.push({}) once the ad element intersects the viewport.
// - Guards against multiple pushes across re-renders and multiple ins elements.
// - If IntersectionObserver isn't available, falls back to immediate push.

export default function GoogleAd({ slot, format = "auto", className = "my-8" }: GoogleAdProps) {
  const adRef = useRef<HTMLDivElement | null>(null);
  const pushedRef = useRef(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const el = adRef.current;
    if (!el) return;

    const tryPush = () => {
      if (pushedRef.current) return;
      // @ts-ignore
      const ads = typeof window !== "undefined" ? (window as any).adsbygoogle : undefined;
      if (ads) {
        try {
          ads.push({});
          pushedRef.current = true;
        } catch (err) {
          console.warn("adsbygoogle.push failed:", err);
        }
        return;
      }

      // If the ads script hasn't finished loading yet, poll briefly (safe, short-lived)
      let attempts = 0;
      const maxAttempts = 8; // ~800ms polling
      const interval = setInterval(() => {
        // @ts-ignore
        const adsNow = (window as any).adsbygoogle;
        attempts += 1;
        if (adsNow) {
          try {
            adsNow.push({});
            pushedRef.current = true;
          } catch (err) {
            console.warn("adsbygoogle.push failed on poll:", err);
          }
          clearInterval(interval);
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
        }
      }, 100);
    };

    // If IntersectionObserver not available, push immediately.
    if (typeof IntersectionObserver === "undefined") {
      tryPush();
      return;
    }

    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          tryPush();
          io.disconnect();
          return;
        }
      }
    });

    io.observe(el);

    return () => {
      io.disconnect();
    };
  }, [isMounted]);

  return (
    <div ref={adRef} className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-1514406406537630"
        data-ad-slot={slot}
        data-ad-format={format}
      />
    </div>
  );
}
