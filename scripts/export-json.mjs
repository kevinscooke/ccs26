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

    // Helper: nice label for public status
  const labelFor = (ps) =>
    ps === 'CANCELLED' ? 'Cancelled' :
    ps === 'POSTPONED' ? 'Postponed' : 'Published';

  const events = (eventsExt ?? []).map((e) => {
    const v = e.venue_id ? venuesById.get(e.venue_id) : null;

    // read new columns from RPC (snake_case), default sensible values
    const public_status = e.public_status ?? 'PUBLISHED';
    const show_time = (e.show_time ?? true) === true; // coerce to boolean
    const status_note = e.status_note ?? null;

    return {
      // existing fields (unchanged)
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

      public_status,
      status_label: labelFor(public_status),
      show_time,
      status_note,

      start_time_for_display: show_time ? e.start_at : null,
      end_time_for_display:   show_time ? (e.end_at ?? null) : null,

      // new: venue slug for linking
      venueslug: v?.slug ?? null,

      // location enrichment (unchanged)
      city: null,
      venue: v
        ? {
            id: v.id,
            name: v.name,
            address1: v.address1 || null,
            city: v.city || null,
            state: v.state || null,
          }
        : null,

      // ids (unchanged)
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

// scripts/export-json.mjs (replace your exportEvents with this)
async function exportEvents() {
  // Call the RPC directly — no .from() after .rpc()
  const { data, error } = await supabase.rpc('export_events_extended_v2');
  if (error) {
    throw new Error(`RPC export_events_extended_v2 failed: ${error.message}`);
  }

  const out = (data ?? []).map((e) => {
    const public_status = e.public_status ?? 'PUBLISHED';
    const show_time     = (e.show_time ?? true) === true;
    const status_note   = e.status_note ?? null;

    const labelFor = (ps) =>
      ps === 'CANCELLED' ? 'Cancelled' :
      ps === 'POSTPONED' ? 'Postponed' : 'Published';

    return {
      // existing fields
      id: e.id,
      title: e.title,
      slug: e.slug,
      description: e.description,
      url: e.url ?? null,
      startAt: e.start_at,
      endAt: e.end_at ?? null,
      createdAt: e.created_at ?? null,
      updatedAt: e.updated_at ?? null,
      publishedAt: e.published_at ?? null,
      status: e.status,                 // workflow (EventStatus)
      isFeatured: e.is_featured ?? false,
      price: e.price ?? null,
      type: e.type ?? null,
      size: e.size ?? null,
      isRecurring: e.is_recurring ?? false,

      // social links: RPC returns jsonb; keep as-is or coerce to []
      socialLinks: e.social_links ?? [],

      // NEW public-facing fields
      public_status,
      status_label: labelFor(public_status),
      show_time,
      status_note,

      // NEW display helpers
      start_time_for_display: show_time ? e.start_at : null,
      end_time_for_display:   show_time ? (e.end_at ?? null) : null,

      // ids
      seriesId: e.series_id ?? null,
      venueId: e.venue_id ?? null,
      organizerId: e.organizer_id ?? null,

      // optional enriched objects (populate elsewhere if needed)
      city: null,
      venue: null,
    };
  });


  fs.writeFileSync("app/data/events.json", JSON.stringify(out, null, 2), "utf8");
}

(async () => {
   try {
     await main();
   } catch (err) {
     console.error("Export failed:", err?.message || err);
     process.exit(1);
   }
 })();
