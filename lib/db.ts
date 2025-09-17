import { getPrisma } from "@/lib/prisma";

export async function db() {
  return getPrisma();
}
