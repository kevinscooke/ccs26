// scripts/generate_from_series.ts
import { RRule } from "rrule";
import { addMinutes } from "date-fns";
// ⬅️ use your IPv4-safe singleton helper instead of a prisma export
import { getPrisma } from "../lib/prisma"; // adjust path if this file lives elsewhere

// If you run this with tsx (recommended), top-level await is fine:
const prisma = await getPrisma();

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

/* … your existing series helpers & generate logic remain unchanged …
   Keep all functions that previously used `prisma` — they’ll now use the
   `const prisma = await getPrisma()` declared above. */

// Example signatures (keep your bodies as-is):
async function generateAllSeries() {
  // use `prisma` here
}
async function generateForSeriesId(seriesId: string) {
  // use `prisma` here
}

async function main() {
  await generateAllSeries();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

export { generateAllSeries, generateForSeriesId };
