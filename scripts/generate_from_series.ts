// scripts/generate_from_series.ts
import { prisma } from "@/lib/db";
import { RRule } from "rrule";
import { addMinutes } from "date-fns";

/** ---------- Minimal ET helpers (DST-aware, no extra deps) ---------- */
// US DST: 2nd Sunday in March, 1st Sunday in November
function secondSundayInMarch(year: number) {
  const d = new Date(Date.UTC(year, 2, 1)); // March 1 UTC
  const firstSunday = 1 + ((7 - d.getUTCDay()) % 7);
  return new Date(Date.UTC(year, 2, firstSunday + 7));
}
function firstSundayInNovember(year: number) {
  const d = new Date(Date.UTC(year, 10, 1)); // Nov 1 UTC
  const firstSunday = 1 + ((7 - d.getUTCDay()) % 7);
  return new Date(Date.UTC(year, 10, firstSunday));
}
/** For a given local calendar date in ET, return "-04:00" (DST) or "-05:00" (standard) */
function easternOffsetForLocalDate(
  year: number,
  month1to12: number,
  day: number
): "-04:00" | "-05:00" {
  const y = year;
  const dstStart = secondSundayInMarch(y);
  const dstEnd = firstSundayInNovember(y);
  const localDayUTC = Date.UTC(y, month1to12 - 1, day);
  const inDST =
    localDayUTC >= Date.UTC(
      dstStart.getUTCFullYear(),
      dstStart.getUTCMonth(),
      dstStart.getUTCDate()
    ) &&
    localDayUTC <
      Date.UTC(
        dstEnd.getUTCFullYear(),
        dstEnd.getUTCMonth(),
        dstEnd.getUTCDate()
      );
  return inDST ? "-04:00" : "-05:00";
}
/** Build an ISO string with the correct ET offset (no external libs) */
function isoWithEasternOffset(
  y: number,
  m1to12: number,
  d: number,
  hh: number,
  mm: number
) {
  const off = easternOffsetForLocalDate(y, m1to12, d); // "-04:00" | "-05:00"
  const mmStr = String(m1to12).padStart(2, "0");
  const ddStr = String(d).padStart(2, "0");
  const hhStr = String(hh).padStart(2, "0");
  const miStr = String(mm).padStart(2, "0");
  return `${y}-${mmStr}-${ddStr}T${hhStr}:${miStr}:00${off}`;
}
/** YYYY-MM-DD based on ET for slugs */
function dateSlugET(d: Date) {
  const tz = "America/New_York";
  const yyyy = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
  }).format(d);
  const mm = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    month: "2-digit",
  }).format(d);
  const dd = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    day: "2-digit",
  }).format(d);
  return `${yyyy}-${mm}-${dd}`;
}

/** ---------- Generator for one series ---------- */
async function generateForSeriesId(seriesId: string) {
  const s = await prisma.series.findUnique({
    where: { id: seriesId },
    include: { city: true, venue: true },
  });
  if (!s) {
    console.warn("Series not found:", seriesId);
    return;
  }

  // Window: from the 1st of this month in ET → horizon months ahead
  const tz = "America/New_York";
  const todayET = new Date(
    new Date().toLocaleString("en-US", { timeZone: tz })
  );
  const since = new Date(todayET);
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const horizon = new Date(todayET);
  horizon.setMonth(horizon.getMonth() + (s.generateHorizonMonths ?? 6));
  horizon.setHours(23, 59, 59, 999);

  // RRULE occurrences within [since, horizon]
  const rule = RRule.fromString(s.rrule);
  const occurrences = rule.between(since, horizon, true);

  for (const occ of occurrences) {
    // ✅ Use UTC calendar parts to avoid Fri/Sat drift
    const y = occ.getUTCFullYear();
    const m = occ.getUTCMonth() + 1; // 1..12
    const d = occ.getUTCDate();

    // Build ET start/end → UTC instants (defaults to 8:00/240 if not set on Series)
    const startIso = isoWithEasternOffset(
      y,
      m,
      d,
      s.startHour ?? 8,
      s.startMinute ?? 0
    );
    const startUtc = new Date(startIso); // parses offset → UTC instant
    const endUtc = addMinutes(startUtc, s.durationMin ?? 240);

    // Slug should reflect the ET date of startUtc
    const slug = `${s.slugBase}-${dateSlugET(startUtc)}`;

    await prisma.event.upsert({
      where: { slug },
      update: {
        title: s.title,
        description: s.description ?? null,
        startAt: startUtc,
        endAt: endUtc,
        cityId: s.cityId,
        venueId: s.venueId ?? null,
        status: "PUBLISHED",
        source: "series",
        type: "MEET",
        seriesId: s.id,
      },
      create: {
        title: s.title,
        slug,
        description: s.description ?? null,
        startAt: startUtc,
        endAt: endUtc,
        cityId: s.cityId,
        venueId: s.venueId ?? null,
        status: "PUBLISHED",
        source: "series",
        type: "MEET",
        seriesId: s.id,
      },
    });

    // Helpful log in ET
    console.log(
      "Upserted event:",
      slug,
      "→",
      new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        dateStyle: "full",
        timeStyle: "short",
      }).format(startUtc)
    );
  }

  await prisma.series.update({
    where: { id: s.id },
    data: { lastGeneratedThrough: horizon },
  });
}

/** ---------- Generate for all series ---------- */
async function generateAllSeries() {
  const all = await prisma.series.findMany({
    select: { id: true, slugBase: true },
  });
  if (!all.length) {
    console.log("No series found. Create one in Prisma Studio, then re-run.");
    return;
  }
  for (const s of all) {
    console.log(`Generating for series: ${s.slugBase}`);
    await generateForSeriesId(s.id);
  }
}

async function main() {
  await generateAllSeries();
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

export { generateAllSeries, generateForSeriesId };
