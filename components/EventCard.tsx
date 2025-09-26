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

  const isCancelled = (ev.public_status ?? ev.status) === "CANCELLED";
  const showTime = ev.show_time ?? true;

  return (
    <article className="ccs-card">
      <header className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold min-w-0 flex-1">
          <Link href={`/events/${ev.slug}`} className="hover:text-green-600">
            <span
              className="block break-words"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {ev.title}
            </span>
          </Link>
        </h3>

        <Link
          href={`/events/${ev.slug}`}
          className="ccs-btn bg-emerald-600 hover:bg-emerald-700 text-white whitespace-nowrap px-4 py-2 rounded"
        >
          View Details
        </Link>
      </header>

      <p className="text-sm text-[var(--fg)]/70 mt-2">
        <Calendar className="inline-block w-4 h-4 mr-2" />
        <span>
          {startDate}{" "}
          {isCancelled ? (
            <strong className="text-red-600">Canceled</strong>
          ) : showTime ? (
            <>
              {startTime}
              {endTime ? ` – ${endTime}` : ""} ET
            </>
          ) : null}
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