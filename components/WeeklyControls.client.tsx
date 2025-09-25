"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/components/Weekly.module.css";

function nowEtDay(): number {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" })).getDay();
}

function setHashValue(value: string | null) {
  if (value === null) {
    // clear hash
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
        className={`${styles.ctrlBtn} ${isSelected(todayHash) ? styles.active : ""}`}
        onClick={() => setHashValue(todayHash)}
      >
        Today
      </button>

      <button
        type="button"
        className={`${styles.ctrlBtn} ${isSelected("weekend") ? styles.active : ""}`}
        onClick={() => setHashValue(isSelected("weekend") ? null : "weekend")}
      >
        Weekend
      </button>

      <button
        type="button"
        className={styles.ctrlBtn}
        onClick={() => {
          // go to full events listing
          router.push("/events/");
        }}
      >
        All
      </button>
    </div>
  );
}