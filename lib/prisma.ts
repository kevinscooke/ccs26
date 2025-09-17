// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { promises as dns } from "dns";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

/**
 * Resolve DATABASE_URL hostname to IPv4 and patch process.env so Prisma/pg uses it.
 * Do this once per cold start.
 */
async function ensureIPv4DatabaseUrl() {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error("DATABASE_URL not set");

  // If someone already set an IPv4 override, use it.
  const override = process.env.DATABASE_URL_IPV4;
  if (override) {
    process.env.DATABASE_URL = override;
    return;
  }

  try {
    const u = new URL(raw);
    const { address } = await dns.lookup(u.hostname, { family: 4 });
    if (address && address !== u.hostname) {
      u.hostname = address;
      process.env.DATABASE_URL = u.toString();
    }
  } catch {
    // If DNS lookup fails, keep original; prisma will surface the error
    process.env.DATABASE_URL = raw;
  }
}

export async function getPrisma(): Promise<PrismaClient> {
  if (global.__prisma) return global.__prisma;

  await ensureIPv4DatabaseUrl();

  const client = new PrismaClient({
    log: ["warn", "error"],
  });

  global.__prisma = client;
  return client;
}
