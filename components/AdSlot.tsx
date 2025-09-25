"use client";
import { useEffect } from "react";

export default function AdSlot() {
  useEffect(() => {
    let timeoutId: number | null = null;
    let idleId: number | null = null;

    const run = () => {
      if (!document.querySelector('script[data-adsense="ccs"]')) {
        const s = document.createElement("script");
        s.setAttribute("data-adsense", "ccs");
        s.async = true;
        s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1514406406537630";
        s.crossOrigin = "anonymous";
        document.head.appendChild(s);
      }

      const container = document.getElementById("ccs-ad-slot");
      if (container && !container.querySelector(".adsbygoogle")) {
        const ins = document.createElement("ins");
        ins.className = "adsbygoogle";
        ins.style.display = "block";
        ins.setAttribute("data-ad-client", "ca-pub-1514406406537630");
        ins.setAttribute("data-ad-slot", "7335717776");
        ins.setAttribute("data-ad-format", "auto");
        ins.setAttribute("data-full-width-responsive", "true");
        container.appendChild(ins);
        try {
          
          (window as any).adsbygoogle = (window as any).adsbygoogle || [];
          (window as any).adsbygoogle.push({});
        } catch (e) {
          // ignore
        }
      }
    };

    if ("requestIdleCallback" in window && "cancelIdleCallback" in window) {
      // @ts-ignore - requestIdleCallback types may be missing in some TS lib setups
      idleId = requestIdleCallback(run, { timeout: 2000 }) as number;
    } else {
      // use global setTimeout — TS will recognize this if DOM lib is present
      timeoutId = (setTimeout(run, 1500) as unknown) as number;
    }

    return () => {
      if (idleId !== null && "cancelIdleCallback" in window) {
        // @ts-ignore
        cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return <div id="ccs-ad-slot" aria-hidden="true" />;
}