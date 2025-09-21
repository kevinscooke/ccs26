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
  const { data: venues, error: veErr } = await supabase.rpc("export_venues");
  if (veErr) throw new Error(`export_venues RPC failed: ${veErr.message}`);

  const { data: eventsExt, error: evErr } = await supabase.rpc("export_events_extended");
  if (evErr) throw new Error(`export_events_extended RPC failed: ${evErr.message}`);

  // quick lookup for venue enrichment
  const venuesById = new Map((venues ?? []).map((v) => [v.id, v]));

  const events = (eventsExt ?? []).map((e) => {
    const v = e.venue_id ? venuesById.get(e.venue_id) : null;
    return {
      id: e.id,
      title: e.title,
      slug: e.slug,
      description: e.description,
      url: e.url || e.source_url || null,
      startAt: e.start_at,
      endAt: e.end_at || null,
      createdAt: e.created_at || null,
      updatedAt: e.updated_at || null,
      publishedAt: e.published_at || null,
      status: e.status,
      isFeatured: e.is_featured,
      price: e.price ?? null,
      type: e.type ?? null,
      size: e.size ?? null,
      isRecurring: e.is_recurring,
      socialLinks: e.social_links ?? [],
      city: null, // optional: enrich via a City RPC if you have one
      venue: v
        ? {
            id: v.id,
            name: v.name,
            address1: v.address1 || null,
            city: v.city || null,
            state: v.state || null,
          }
        : null,
      seriesId: e.series_id || null,
      cityId: e.city_id || null,
      venueId: e.venue_id || null,
      organizerId: e.organizer_id || null,
    };
  });

  const outDir = path.join(process.cwd(), "public", "data");
  fs.mkdirSync(outDir, { recursive: true });

  // Primary runtime copy (served statically)
  fs.writeFileSync(path.join(outDir, "events.json"), JSON.stringify(events ?? [], null, 2));
  fs.writeFileSync(path.join(outDir, "venues.json"), JSON.stringify(venues ?? [], null, 2));

  // Optional repository snapshot for review / checked-in data
  const appOut = path.join(process.cwd(), "app", "data");
  fs.mkdirSync(appOut, { recursive: true });
  fs.writeFileSync(path.join(appOut, "events.json"), JSON.stringify(events ?? [], null, 2));
  fs.writeFileSync(path.join(appOut, "venues.json"), JSON.stringify(venues ?? [], null, 2));

  console.log(`Exported ${events?.length ?? 0} events and ${venues?.length ?? 0} venues.`);
}

main().catch((err) => {
  console.error("Export failed:", err?.message || err);
  process.exit(1);
});
