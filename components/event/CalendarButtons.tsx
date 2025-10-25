// components/event/CalendarButtons.tsx
"use client";
import React from "react";

type Props = {
  title: string;
  startISO: string;
  endISO?: string;
  details?: string;
  location?: string;
};

function googleCalUrl({ title, startISO, endISO, details, location }: Props) {
  // Google expects UTC in YYYYMMDDTHHmmssZ without separators
  const toG = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const dates = `${toG(startISO)}/${toG(endISO || startISO)}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates,
    details: details || "",
    location: location || "",
  });
  return `https://www.google.com/calendar/render?${params.toString()}`;
}

function buildICS({ title, startISO, endISO, details, location }: Props) {
  const dt = (iso: string) =>
    new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const dtStart = dt(startISO);
  const dtEnd = dt(endISO || startISO);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CharlotteCarShows//Event//EN",
    "BEGIN:VEVENT",
    `UID:${crypto.randomUUID()}@charlottecarshows.com`,
    `DTSTAMP:${dt(new Date().toISOString())}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${title}`,
    details ? `DESCRIPTION:${details.replace(/\n/g, "\\n")}` : "",
    location ? `LOCATION:${location}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");
}

export default function CalendarButtons(props: Props) {
  const handleIcs = () => {
    const ics = buildICS(props);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${props.title.replace(/\s+/g, "_")}.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  return (
    <div className="inline-flex items-center gap-2" id="rsvp">
      <a
        className="inline-flex items-center rounded-xl border px-3 py-2 text-sm hover:bg-zinc-50"
        href={googleCalUrl(props)}
        target="_blank"
        rel="noopener noreferrer"
        data-cta="calendar_google"
      >
        Add to Google
      </a>
      <button
        className="inline-flex items-center rounded-xl border px-3 py-2 text-sm hover:bg-zinc-50"
        onClick={handleIcs}
        data-cta="calendar_ics"
      >
        Download .ics
      </button>
    </div>
  );
}
