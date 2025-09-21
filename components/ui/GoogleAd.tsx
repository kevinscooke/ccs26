"use client";
import { useEffect, useRef } from "react";

type GoogleAdProps = {
  slot: string | number;
  format?: string;
  className?: string;
};

// Minimal AdSense placeholder component.
// On mount, it calls (window.adsbygoogle||[]).push({}) to request an ad.
export default function GoogleAd({ slot, format = "auto", className = "my-8" }: GoogleAdProps) {
  const adRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // ignore in static export or test envs
    }
  }, []);

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
