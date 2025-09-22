"use client";
import { useEffect } from "react";

export default function NotFoundClient() {
  useEffect(() => {
    try {
      // Safely access the dataLayer on window without TypeScript directives
      const w = window as Window & { dataLayer?: any[] };
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({
        event: "page_not_found",
        page_location: window.location.href,
        page_referrer: document.referrer,
        page_title: document.title,
      });
    } catch (e) {
      // swallow errors in instrumentation
    }
  }, []);

  return null;
}
