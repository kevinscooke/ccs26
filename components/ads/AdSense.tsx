"use client";
import { useEffect, useRef } from "react";

type Props = {
  adSlot?: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function AdSense({ adSlot = "1234567890", className = "", style }: Props) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const el = adRef.current?.querySelector('ins.adsbygoogle') as HTMLElement | null;
      if (el && !el.dataset.adsPlaced) {
  // mark this element so we don't push again for it
  el.dataset.adsPlaced = '1';
  // @ts-ignore - adsbygoogle global provided by external script
  (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // ignore errors in static export / test environments
    }
  }, []);

  return (
    <div ref={adRef} className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-1514406406537630"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
