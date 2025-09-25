"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/components/Weekly.module.css";

function nowEtDay(): number {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" })).getDay();
}

function setHashValue(value: string | null) {
  if (typeof window === "undefined") return;
  if (value === null) {
    // clear hash -> week/all view
    history.replaceState(null, "", location.pathname + location.search);
  } else {
    location.hash = value;
  }
}

export default function WeeklyControls() {
  const router = useRouter();
  const [hash, setHash] = useState<string>(() => (typeof window !== "undefined" ? location.hash.replace(/^#/, "") : ""));
  const todayHash = `day=${nowEtDay()}`;

  useEffect(() => {
    const onHash = () => setHash(location.hash.replace(/^#/, ""));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const isSelected = (v: string | null) => {
    const cur = hash || null;
    return cur === v;
  };

  return (
    <div className={styles.headerControls} role="toolbar" aria-label="Weekly controls">
      <button
        type="button"
        className={styles.ctrlBtn}
        onClick={() => {
          // go to full events listing (separate page)
          router.push("/events/");
        }}
        aria-label="List view"
      >
        List
      </button>

      <button
        type="button"
        className={`${styles.ctrlBtn} ${isSelected(null) ? styles.active : ""}`}
        onClick={() => setHashValue(null)}
        aria-pressed={isSelected(null)}
        aria-label="Week view"
      >
        Week
      </button>

      <button
        type="button"
        className={`${styles.ctrlBtn} ${isSelected(todayHash) ? styles.active : ""}`}
        onClick={() => setHashValue(todayHash)}
        aria-pressed={isSelected(todayHash)}
        aria-label="Day view"
      >
        Day
      </button>
    </div>
  );
}