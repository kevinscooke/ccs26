"use client";
import React from "react";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { formatDateET, formatTimeET } from "@/lib/et";

export default function EventCard(props: { event?: any; e?: any }) {
  const ev = props.event ?? props.e;
  if (!ev) return null;

  const startDate = formatDateET(ev.startAt);
  const startTime = formatTimeET(ev.startAt);
  const endTime = ev.endAt ? formatTimeET(ev.endAt) : "";

  return (
    <article className="ccs-card">
      <header className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {ev.title}
        </h3>
        <Link href={`/events/${ev.slug}`} className="ccs-btn">View Details</Link>
      </header>

      <p className="text-sm text-[var(--fg)]/70 mt-2">
        <Calendar className="inline-block w-4 h-4 mr-2" />
        <span>
          {startDate}{" "}
          {startTime}
          {endTime ? ` – ${endTime}` : ""} ET
        </span>
      </p>

      {ev.venue?.name && (
        <p className="text-sm text-[var(--fg)]/60 mt-1">
          {ev.venue.name} {ev.venue.city ? `• ${ev.venue.city}` : ""}
        </p>
      )}

      <p className="mt-3 text-[var(--fg)]/80">{ev.description}</p>
    </article>
  );
}