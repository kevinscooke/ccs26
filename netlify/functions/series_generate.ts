import { PrismaClient } from "@prisma/client";
import { promises as dns } from "dns";

// Small inline helper (functions can’t easily import "@/lib/prisma")
async function getPrismaForFunction() {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error("DATABASE_URL not set");

  const u = new URL(raw);
  const { address } = await dns.lookup(u.hostname, { family: 4 });
  if (address && address !== u.hostname) u.hostname = address;
  process.env.DATABASE_URL = u.toString();

  return new PrismaClient({ log: ["warn", "error"] });
}

const prisma = await getPrismaForFunction();
