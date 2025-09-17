import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";  // your prisma client module

export const runtime = "nodejs";

export async function GET() {
  try {
    // lightweight check
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("HEALTH ERROR:", e);
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
