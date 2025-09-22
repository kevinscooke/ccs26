"use client";
import { useEffect } from "react";

export default function NotFoundClient() {
  useEffect(() => {
    try {
      // Ensure dataLayer exists then push
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.dataLayer = window.dataLayer || [];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.dataLayer.push({
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
