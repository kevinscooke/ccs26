"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "@/components/Weekly.module.css";

export default function WeeklyControls() {
  const router = useRouter();
  const pathname = usePathname() ?? "";

  const isActive = (p: string) => pathname === p || pathname.startsWith(p);

  return (
    <div className={styles.headerControls} role="toolbar" aria-label="Weekly controls">
      <button
        type="button"
        className={`${styles.ctrlBtn} ${isActive("/events") ? styles.ctrlBtnActive : ""}`}
        onClick={() => router.push("/events/")}
        aria-pressed={isActive("/events")}
      >
        List
      </button>

      <button
        type="button"
        className={`${styles.ctrlBtn} ${isActive("/weekly-car-show-list-charlotte") ? styles.ctrlBtnActive : ""}`}
        onClick={() => router.push("/weekly-car-show-list-charlotte/")}
        aria-pressed={isActive("/weekly-car-show-list-charlotte")}
      >
        Week
      </button>

      <button
        type="button"
        className={`${styles.ctrlBtn} ${isActive("/daily") ? styles.ctrlBtnActive : ""}`}
        onClick={() => router.push("/daily/")}
        aria-pressed={isActive("/daily")}
      >
        Day
      </button>
    </div>
  );
}