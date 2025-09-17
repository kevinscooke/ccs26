// scripts/cleanup_bad_concord.ts
import { prisma } from "@/lib/db";

/** Return "Sun" | "Mon" | ... in America/New_York */
function etWeekdayShort(d: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
  }).format(d);
}

async function main() {
  // 1) Find your Concord series by slugBase
  const series = await prisma.series.findFirst({
    where: { slugBase: "cars-and-coffee-concord" },
    select: { id: true, slugBase: true },
  });

  if (!series) {
    console.log("Series not found: cars-and-coffee-concord");
    return;
  }

  // 2) Fetch all events linked to this series
  const events = await prisma.event.findMany({
    where: { seriesId: series.id },
    select: { id: true, slug: true, startAt: true },
    orderBy: { startAt: "asc" },
  });

  if (!events.length) {
    console.log("No events found for series:", series.slugBase);
    return;
  }

  // 3) Keep only those that are Fridays in ET (the wrong ones we created earlier)
  const wrongFriday = events.filter((e) => etWeekdayShort(new Date(e.startAt)) === "Fri");

  if (!wrongFriday.length) {
    console.log("No mis-dated Friday events found — nothing to delete.");
    return;
  }

  console.log("Will delete these Friday events:");
  wrongFriday.forEach((e) => console.log(" -", e.slug));

  // 4) Delete them in one go
  await prisma.event.deleteMany({
    where: { id: { in: wrongFriday.map((e) => e.id) } },
  });

  console.log(`Deleted ${wrongFriday.length} event(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
