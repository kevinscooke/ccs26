import { NextResponse } from "next/server";
import { Client } from "pg";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.DATABASE_URL;
  if (!url) return NextResponse.json({ ok: false, error: "No DATABASE_URL" }, { status: 500 });

  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  try {
    const timeout = setTimeout(() => client.end().catch(() => {}), 8000);
    await client.connect();
    const { rows } = await client.query("select 1 as ok");
    clearTimeout(timeout);
    await client.end();
    return NextResponse.json({ ok: true, rows });
  } catch (e: any) {
    // Look for codes like ENOTFOUND, ETIMEDOUT, ECONNREFUSED
    return NextResponse.json({ ok: false, name: e?.name, code: e?.code, message: String(e?.message || e) }, { status: 500 });
  }
}
