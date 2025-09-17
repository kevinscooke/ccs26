// netlify/functions/series_generate.ts
import type { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";

// If you need DB access; otherwise remove Prisma entirely.
const prisma = new PrismaClient();

export const handler: Handler = async () => {
  try {
    // TODO: put your series generation logic here.
    // Example:
    // await generateNextWeekSeries();

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, job: "series_generate" }),
    };
  } catch (err) {
    console.error("series_generate error:", err);
    return { statusCode: 500, body: "series_generate failed" };
  } finally {
    // Safe to ignore if you removed Prisma
    await prisma.$disconnect().catch(() => {});
  }
};
