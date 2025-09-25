"use client";
import { useEffect } from "react";

export default function AdSlot() {
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let idleId: number | null = null;

    if (typeof window !== "undefined") {
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).adsbygoogle = (window as any).adsbygoogle || [];
            (window as any).adsbygoogle.push({});
          } catch (e) {
            // ignore
          }
        }
      };

      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(run, { timeout: 2000 });
      } else {
        // direct assignment without double-cast; ReturnType<typeof setTimeout> covers Node/browser differences
        timeoutId = setTimeout(run, 1500);
      }
    }

    return () => {
      // cleanup example (when unmounting)
      if (idleId != null) {
        if (typeof window.cancelIdleCallback === "function") {
          window.cancelIdleCallback(idleId);
        } else {
          // safe fallback if cancelIdleCallback not present
          clearTimeout(idleId as unknown as ReturnType<typeof setTimeout>);
        }
      }
      if (timeoutId != null) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return <div id="ccs-ad-slot" aria-hidden="true" />;
}