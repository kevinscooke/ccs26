/**
 * ET (Eastern Time) helpers — robust parsing & formatting.
 *
 * Behavior:
 * - Strings with explicit timezone (Z or ±HH:MM) are parsed as given.
 * - Naive ISO datetimes (YYYY-MM-DDTHH:MM[:SS]) are treated as UTC instants
 *   (we append 'Z' before parsing).
 * - Date-only strings are treated as UTC midnight (YYYY-MM-DD -> YYYY-MM-DDT00:00:00Z).
 * - Use formatDateET/formatTimeET to render in America/New_York.
 */

export function nowInET(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
}

export function toEtDate(value: any): Date | null {
  if (value == null) return null;
  try {
    if (value instanceof Date) {
      return value;
    }
    const s = String(value).trim();
    if (!s) return null;

    // If string contains explicit timezone info (Z or ±HH[:MM]) parse as-is
    if (/[zZ]|[+\-]\d{2}:?\d{2}$/.test(s)) {
      const parsed = new Date(s);
      return isNaN(parsed.getTime()) ? null : parsed;
    }

    // YYYY-MM-DD -> treat as UTC midnight for that date
    const dateOnlyMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (dateOnlyMatch) {
      const parsed = new Date(s + "T00:00:00Z");
      return isNaN(parsed.getTime()) ? null : parsed;
    }

    // Naive ISO-like datetime YYYY-MM-DDTHH:MM[:SS] -> interpret as UTC instant
    const naiveIsoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?$/);
    if (naiveIsoMatch) {
      const parsed = new Date(s + "Z"); // append Z to treat as UTC
      return isNaN(parsed.getTime()) ? null : parsed;
    }

    // Fallback: try Date constructor (best-effort)
    const parsed = new Date(s);
    return isNaN(parsed.getTime()) ? null : parsed;
  } catch {
    return null;
  }
}

export function startOfWeekET(base: Date) {
  // Convert instant to ET-local Date, then compute Monday 00:00 ET
  const etLocal = new Date(new Date(base).toLocaleString("en-US", { timeZone: "America/New_York" }));
  const day = etLocal.getDay();
  // Monday = 1; if Sunday (0) move forward to Monday
  if (day === 0) {
    etLocal.setDate(etLocal.getDate() + 1);
  } else {
    const diffToMonday = (day + 6) % 7;
    etLocal.setDate(etLocal.getDate() - diffToMonday);
  }
  etLocal.setHours(0, 0, 0, 0);
  return etLocal;
}

export function endOfWeekET(d: Date) {
  const start = startOfWeekET(d);
  const end = new Date(start);
  end.setDate(end.getDate() + 7); // exclusive end
  return end;
}

export function formatDateET(d: string | Date | null | undefined) {
  const dt = toEtDate(d);
  if (!dt) return "";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "America/New_York" }).format(dt);
}

export function formatTimeET(d: string | Date | null | undefined) {
  const dt = toEtDate(d);
  if (!dt) return "";
  return new Intl.DateTimeFormat("en-US", { timeStyle: "short", timeZone: "America/New_York" }).format(dt);
}

export function formatRangeET(start: Date, endExclusive: Date) {
  const fmt = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "America/New_York" });
  const endShown = new Date(endExclusive);
  endShown.setDate(endShown.getDate() - 1);
  return `${fmt.format(start)} – ${fmt.format(endShown)}`;
}

import { zonedTimeToUtc } from "date-fns-tz";

export const ET_TZ = "America/New_York";

// If startAt has no timezone, treat it as UTC by appending Z.
// If it has Z or an offset, use it as-is.
export function parseStartAtToUtc(startAt?: string | null): Date | null {
  if (!startAt) return null;
  const hasTZ = /[zZ]|[+\-]\d{2}:\d{2}$/.test(startAt);
  const iso = hasTZ ? startAt : `${startAt}Z`;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

// Format a UTC Date in Eastern Time (DST-aware). Don’t hardcode -4.
export function formatET(dateUtc: Date, opts?: Intl.DateTimeFormatOptions) {
  return dateUtc.toLocaleString("en-US", {
    timeZone: ET_TZ,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    ...opts,
  });
}