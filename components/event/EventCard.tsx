import React from "react";
import { Calendar } from "lucide-react";
import { formatDateET, formatTimeET, toEtDate } from "@/lib/et";

function EventCard({ e }: { e: any }) {
  const dt = toEtDate(e.startAt);
  return (
    <article className="...">
      {/* debug: shows raw and parsed */}
      <pre className="text-xs mb-2">
        raw: {String(e.startAt)} | toEtDate:{" "}
        {dt ? dt.toISOString() : "null"}
      </pre>

      <p className="text-sm text-zinc-500">
        <Calendar className="inline-block w-4 h-4 mr-2" />
        <span>
          {formatDateET(e.startAt)}{" "}
          {formatTimeET(e.startAt)}
          {e.endAt ? ` – ${formatTimeET(e.endAt)}` : ""} ET
        </span>
      </p>
    </article>
  );
}
export default EventCard;