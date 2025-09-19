"use client";
import { useEffect } from "react";

type GoogleAdProps = {
  slot: string | number;
  format?: string;
  className?: string;
};

export default function GoogleAd({ slot, format = "auto", className = "my-8" }: GoogleAdProps) {
  useEffect(() => {
    // @ts-ignore
    if (typeof window !== "undefined" && window.adsbygoogle) {
      // @ts-ignore
      window.adsbygoogle.push({});
    }
  }, []);
  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-1514406406537630"
        data-ad-slot={slot}
        data-ad-format={format}
      ></ins>
    </div>
  );
}
