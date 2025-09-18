// netlify/functions/weekly_digest.ts
import { getPrisma } from "../../lib/prisma";

/**
 * Scheduled function to compile a weekly digest of upcoming events.
 * Netlify will import and run the default export.
 */
export default async function weeklyDigest() {
  const prisma = await getPrisma();

  const now = new Date();
  const weekFromNow = new Date(now);
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  // Pull next 7 days of published events
  const events = await prisma.event.findMany({
    where: {
      status: "PUBLISHED",
      startAt: { gte: now, lt: weekFromNow },
    },
    orderBy: [{ startAt: "asc" }, { title: "asc" }],
    include: { city: true, venue: true },
    take: 200,
  });

  // TODO: send via your email provider
  console.log(`[weekly_digest] events found: ${events.length}`);

  return { ok: true, count: events.length };
}
