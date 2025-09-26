export function getTZOffsetMs(date: Date, timeZone = "America/New_York"): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(date);
  const map: Record<string, string> = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const asUtc = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second)
  );
  return asUtc - date.getTime();
}

export function parseToETDate(value?: string | null): Date | null {
  if (!value) return null;
  const s = String(value).trim();

  // If it already contains timezone info, parse normally.
  if (/[zZ]$/.test(s) || /[+\-]\d{2}:\d{2}$/.test(s) || /[+\-]\d{2}$/.test(s)) {
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  // Match YYYY-MM-DD[ T ]HH:mm[:ss]
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
  if (!m) {
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const hour = Number(m[4] || 0);
  const minute = Number(m[5] || 0);
  const second = Number(m[6] || 0);

  // Interpret timezone-less input as UTC (source timestamps are UTC without offset).
  const utcMs = Date.UTC(year, month - 1, day, hour, minute, second);
  return new Date(utcMs);
}

export function parseToDate(input: string | Date): Date {
  if (input instanceof Date) return input;
  if (typeof input !== "string") return new Date(input);
  // If string already contains timezone info (Z or +HH:MM / -HH:MM) parse as-is
  if (/[zZ]|[+\-]\d{2}:?\d{2}$/.test(input)) return new Date(input);
  // Otherwise treat bare ISO-like strings as UTC by appending 'Z'
  return new Date(input + "Z");
}

export function formatDateET(value?: string | Date | null): string {
  const d = value instanceof Date ? value : parseToETDate(String(value));
  if (!d) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/New_York",
  }).format(d);
}

export function formatRangeET(start?: string | Date | null, end?: string | Date | null) {
  const s = start instanceof Date ? start : parseToETDate(String(start));
  const e = end instanceof Date ? end : parseToETDate(String(end));
  if (!s || !e) return "";
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "America/New_York",
    }).format(d);
  return `${fmt(s)} – ${fmt(e)}`;
}

export function formatTimeET(d: string | Date) {
  const dt = parseToDate(d);
  return new Intl.DateTimeFormat("en-US", { timeStyle: "short", timeZone: "America/New_York" }).format(dt);
}