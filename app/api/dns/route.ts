// app/api/dns/route.ts
import { NextResponse } from "next/server";
import { promises as dns } from "dns";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const targets = [
    "supabase.co",
    "db.sxmpfsciiipdreingdhy.supabase.co",
  ];
  const results = [];
  for (const host of targets) {
    try {
      const a = await dns.lookup(host);
      results.push({ host, ok: true, a });
    } catch (e: any) {
      results.push({ host, ok: false, code: e?.code, message: String(e?.message || e) });
    }
  }
  return NextResponse.json({ results });
}
