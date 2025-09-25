"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "@/components/Weekly.module.css";
import EventCard from "@/components/EventCard";
import { getEventSlug } from "@/lib/eventSlug";

function toEtDay(iso: string) {
  const d = new Date(new Date(String(iso)).toLocaleString("en-US", { timeZone: "America/New_York" }));
  return d.getDay();
}
function slugify(s?: string) {
  if (!s) return "";
  return String(s).toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/(^-+|-+$)/g,"");
}

export default function WeeklyList({ events }: { events?: any[] }) {
  const eventsByDay = useMemo(() => {
    const map: Record<number, any[]> = {0:[],1:[],2:[],3:[],4:[],5:[],6:[]};
    (events || []).forEach((e) => {
      try {
        const day = toEtDay(e.startAt);
        (map[day] ||= []).push(e);
      } catch {}
    });
    return map;
  }, [events]);

  const todayEt = useMemo(() => {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
    return now.getDay();
  }, []);

  const computeDefault = () => {
    if (typeof window !== "undefined") {
      const h = location.hash.replace(/^#/, "");
      if (h.startsWith("day=")) {
        const n = Number(h.slice(4));
        if (!isNaN(n) && n>=0 && n<=6) return n;
      }
      if (h === "weekend") return "weekend";
    }
    // pick the next day that has events, starting with today (today -> tomorrow -> ...)
    for (let i = 0; i < 7; i++) {
      const d = (todayEt + i) % 7;
      if ((eventsByDay[d] || []).length > 0) return d;
    }
    return todayEt;
  };

  // server-safe initial render: no selection. set selection on client.
  const [selected, setSelected] = useState<number | "weekend" | null>(null);

  useEffect(() => {
    setSelected(computeDefault());
  }, [eventsByDay, todayEt]);

  useEffect(() => {
    const handler = () => {
      const h = location.hash.replace(/^#/, "");
      if (h.startsWith("day=")) {
        const n = Number(h.slice(4));
        if (!isNaN(n)) setSelected(n);
      } else if (h === "weekend") {
        setSelected("weekend");
      } else setSelected(null);
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  useEffect(() => {
    if (typeof selected === "number") {
      if ((eventsByDay[selected] || []).length === 0) {
        // jump to next available
        for (let i=0;i<7;i++){
          const d = (todayEt + i) % 7;
          if ((eventsByDay[d] || []).length > 0) { location.hash = `day=${d}`; return; }
        }
        location.hash = "";
      }
    }
  }, [eventsByDay, selected, todayEt]);

  const filtered = useMemo(() => {
    if (selected === null) return Object.values(eventsByDay).flat();
    if (selected === "weekend") return [...(eventsByDay[6]||[]), ...(eventsByDay[0]||[])];
    return eventsByDay[selected] || [];
  }, [eventsByDay, selected]);

  return (
    <div className="mt-4 space-y-4 w-full">
      {filtered.length === 0 ? (
        <p className="text-sm text-zinc-600">No events for the selected day.</p>
      ) : filtered.map((e) => (
        // ensure any fallback links inside EventCard still match canonical slug
        <EventCard key={getEventSlug(e)} event={e} />
      ))}
    </div>
  );
}