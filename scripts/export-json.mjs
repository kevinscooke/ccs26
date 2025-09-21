// scripts/export-json.mjs
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load env from .env (and .env.local for Next-style projects)
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in env.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, { auth: { persistSession: false } });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const { data: events, error: evErr } = await supabase.rpc("export_events");
  if (evErr) throw evErr;

  const { data: venues, error: veErr } = await supabase.rpc("export_venues");
  if (veErr) throw veErr;

  const outDir = path.join(process.cwd(), "public", "data");
  fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(path.join(outDir, "events.json"), JSON.stringify(events ?? [], null, 2));
  fs.writeFileSync(path.join(outDir, "venues.json"), JSON.stringify(venues ?? [], null, 2));

  console.log(`Exported ${events?.length ?? 0} events and ${venues?.length ?? 0} venues.`);
}

main().catch((err) => {
  console.error("Export failed:", err?.message || err);
  process.exit(1);
});
