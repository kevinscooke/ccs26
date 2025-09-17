// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (typeof globalThis !== "undefined") {
  // @ts-ignore
  if (!globalThis.__prisma) {
    // Only instantiate if env exists to avoid build-time crash
    if (!process.env.DATABASE_URL) {
      // create a no-op shim so imports won’t explode during build
      // @ts-ignore
      globalThis.__prisma = null;
    } else {
      // @ts-ignore
      globalThis.__prisma = new PrismaClient();
    }
  }
  // @ts-ignore
  prisma = globalThis.__prisma ?? ({} as any);
} else {
  prisma = new PrismaClient();
}

export { prisma };
