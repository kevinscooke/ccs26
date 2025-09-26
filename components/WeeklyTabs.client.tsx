"use client";
import React, { useEffect, useMemo, useState } from "react";
import styles from "@/components/Weekly.module.css";

type EventItem = { id?: string | number; startAt?: string };

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Mon..Sun
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function toEtDay(iso?: string): number | null {
  if (!iso) return null;
  try {
    const d = new Date(new Date(String(iso)).toLocaleString("en-US", { timeZone: "America/New_York" }));
    return d.getDay();
  } catch {
    return null;
  }
}

function nowEtDay(): number {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" })).getDay();
}

const MOBILE_SCROLL_DELAY = 50; // ms delay before forcing scroll on mobile/tall tabs

export default function WeeklyTabs({ events }: { events?: EventItem[] }) {
  // build simple counts per day if events supplied
  const eventsByDay = useMemo(() => {
    const map: Record<number, EventItem[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    (events || []).forEach((e) => {
      const d = toEtDay(e.startAt);
      if (d !== null) map[d].push(e);
    });
    return map;
  }, [events]);

  const dayScrollRef = React.useRef<HTMLDivElement | null>(null);

  // current day in ET used by default selection logic
  const todayEt = nowEtDay();

  // Start with no selection on the server so server-rendered HTML is deterministic.
  // Compute the real selection only on the client inside useEffect.
  const [selected, setSelected] = useState<number | "weekend" | null>(null);

  useEffect(() => {
    // client-only selection logic
    const compute = () => {
      // prefer explicit hash
      const h = location.hash.replace(/^#/, "");
      if (h.startsWith("day=")) {
        const n = Number(h.slice(4));
        if (!isNaN(n) && n >= 0 && n <= 6) return n;
      }
      if (h === "weekend") return "weekend";
      // pick the next day that has events, starting with today (today -> tomorrow -> ...)
      for (let i = 0; i < 7; i++) {
        const d = (todayEt + i) % 7;
        if ((eventsByDay[d] || []).length > 0) return d;
      }
      return todayEt;
    };
    setSelected(compute());
  }, [eventsByDay, todayEt]);

  useEffect(() => {
    const onHash = () => {
      const h = location.hash.replace(/^#/, "");
      if (h.startsWith("day=")) {
        const n = Number(h.slice(4));
        if (!isNaN(n)) setSelected(n);
      } else if (h === "weekend") {
        setSelected("weekend");
      } else {
        setSelected(null);
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // on mobile, scroll the dayScroll container to the end so weekend is visible
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMobile = window.innerWidth <= 640;
    if (isMobile && dayScrollRef.current) {
      // small timeout to ensure rendering first
      setTimeout(() => {
        const el = dayScrollRef.current!;
        el.scrollLeft = el.scrollWidth;
      }, MOBILE_SCROLL_DELAY);
    }
  }, [dayScrollRef, eventsByDay]);

  // if selected day becomes empty and events exist, jump to next available (keeps UX nice)
  useEffect(() => {
    if (typeof selected === "number") {
      if ((eventsByDay[selected] || []).length === 0) {
        const today = nowEtDay();
        for (let i = 0; i < 7; i++) {
          const d = (today + i) % 7;
          if ((eventsByDay[d] || []).length > 0) {
            location.hash = `day=${d}`;
            return;
          }
        }
        location.hash = "";
      }
    }
  }, [eventsByDay, selected]);

  const today = nowEtDay();

  return (
    <div className={styles.dayTabs} role="tablist" aria-label="Week days">
      <div ref={dayScrollRef} className={styles.dayScroll}>
        {DAY_ORDER.map((dayNum, idx) => {
          const label = DAY_LABELS[idx];
          const isActive = selected === dayNum;
          const count = (eventsByDay[dayNum] || []).length;
          return (
            <button
              key={dayNum}
              type="button"
              className={`${styles.tab} ${isActive ? styles.active : ""}`}
              onClick={() => {
                setSelected(dayNum);
                location.hash = `day=${dayNum}`;
              }}
              aria-pressed={isActive}
              aria-label={`Show ${label}`}
            >
              {label}
              {dayNum === today ? <span className={styles.todayMarker}> •</span> : null}
              {count ? <span className={styles.tabCount}>({count})</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}