// components/event/StickyCTA.tsx
"use client";
import React from "react";

type IcsMeta = { title: string; startISO: string; endISO?: string; details?: string; location?: string; };

function icsBlobUrl(meta: IcsMeta) {
  const dt = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const lines = [
    "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//CharlotteCarShows//Sticky//EN","BEGIN:VEVENT",
    `UID:${crypto.randomUUID()}@charlottecarshows.com`,
    `DTSTAMP:${dt(new Date().toISOString())}`,
    `DTSTART:${dt(meta.startISO)}`,
    `DTEND:${dt(meta.endISO || meta.startISO)}`,
    `SUMMARY:${meta.title}`,
    meta.details ? `DESCRIPTION:${meta.details.replace(/\n/g, "\\n")}` : "",
    meta.location ? `LOCATION:${meta.location}` : "",
    "END:VEVENT","END:VCALENDAR",
  ].filter(Boolean).join("\r\n");
  return URL.createObjectURL(new Blob([lines], { type: "text/calendar;charset=utf-8" }));
}

export default function StickyCTA({ directionsHref, icsMeta }: { directionsHref: string; icsMeta: IcsMeta; }) {
  const [icsHref, setIcsHref] = React.useState<string>("");

  React.useEffect(() => {
    const u = icsBlobUrl(icsMeta);
    setIcsHref(u);
    return () => URL.revokeObjectURL(u);
  }, [icsMeta]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 md:hidden border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-3xl px-4 py-3 grid grid-cols-2 gap-3">
        <a href={directionsHref} target="_blank" rel="noopener noreferrer"
           className="inline-flex items-center justify-center rounded-xl bg-black text-white px-4 py-2 text-sm font-medium shadow hover:bg-zinc-900"
           data-cta="sticky_directions">
          Get directions
        </a>
        <a href={icsHref} download={`${icsMeta.title.replace(/\s+/g, "_")}.ics`}
           className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm hover:bg-zinc-50"
           data-cta="sticky_ics">
          Add to Calendar
        </a>
      </div>
    </div>
  );
}
