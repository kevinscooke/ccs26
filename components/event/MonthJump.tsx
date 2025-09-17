"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

function nowInET() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
}
function startOfWeekET_Mon(d: Date) {
  const et = nowInET();
  et.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
  const day = et.getDay(); // 0..6
  const diffToMonday = (day + 6) % 7;
  et.setDate(et.getDate() - diffToMonday);
  et.setHours(0, 0, 0, 0);
  return et;
}
function weeksBetween(a: Date, b: Date) {
  const ms = b.getTime() - a.getTime();
  return Math.trunc(ms / (7 * 24 * 60 * 60 * 1000));
}

export default function MonthJump({ currentWeekOffset = 0 }: { currentWeekOffset?: number }) {
  const router = useRouter();
  const sp = useSearchParams();

  // Build month list: current month ± 11 (total 12)
  const options = useMemo(() => {
    const list: { value: string; label: string; weekOffset: number }[] = [];
    const today = nowInET();
    const thisWeekStart = startOfWeekET_Mon(today);

    for (let delta = -2; delta <= 9; delta++) {
      const d = new Date(today);
      d.setMonth(d.getMonth() + delta, 1); // first of that month
      d.setHours(0, 0, 0, 0);

      // Week containing the 1st of that month
      const monthWeekStart = startOfWeekET_Mon(d);
      const w = weeksBetween(thisWeekStart, monthWeekStart);

      const label = new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "America/New_York",
      }).format(d);

      const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      list.push({ value, label, weekOffset: w });
    }
    return list;
  }, []);

  // Show current month as selected if its weekOffset matches the current page's week
  // Otherwise show the month that matches currentWeekOffset best.
  const selectedValue = useMemo(() => {
    const today = nowInET();
    const thisWeekStart = startOfWeekET_Mon(today);
    const targetWeekStart = new Date(thisWeekStart);
    targetWeekStart.setDate(targetWeekStart.getDate() + currentWeekOffset * 7);
    const firstOfTargetMonth = new Date(targetWeekStart);
    firstOfTargetMonth.setDate(1);
    const v = `${firstOfTargetMonth.getFullYear()}-${String(firstOfTargetMonth.getMonth() + 1).padStart(2, "0")}`;
    return v;
  }, [currentWeekOffset]);

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value; // "YYYY-MM"
    const found = options.find(o => o.value === val);
    const page = Number(sp.get("p") || "1");
    const u = new URLSearchParams();
    if (found && found.weekOffset) u.set("w", String(found.weekOffset));
    if (page > 1) u.set("p", "1"); // reset page on month jump
    const q = u.toString();
    router.push(q ? `/events?${q}` : "/events");
  }

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="text-zinc-400">Jump to month:</span>
      <select
        className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100"
        value={selectedValue}
        onChange={onChange}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
