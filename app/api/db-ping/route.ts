// app/api/db-ping/route.ts
import { NextResponse } from "next/server";
import { Client } from "pg";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const toCodes = (s: string) => Array.from(s).map(c => c.charCodeAt(0));

export async function GET() {
  const url = process.env.DATABASE_URL || "";
  let host = "";
  try {
    host = new URL(url).hostname;
  } catch {}

  // show exactly what the function sees
  if (!host) {
    return NextResponse.json({ ok: false, urlLen: url.length, url }, { status: 500 });
  }

  try {
    const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
    await client.connect();
    const { rows } = await client.query("select 1 as ok");
    await client.end();
    return NextResponse.json({ ok: true, host, hostLen: host.length, hostCodes: toCodes(host), rows });
  } catch (e: any) {
    return NextResponse.json({
      ok: false,
      host,
      hostLen: host.length,
      hostCodes: toCodes(host),
      name: e?.name, code: e?.code, message: String(e?.message || e)
    }, { status: 500 });
  }
}
