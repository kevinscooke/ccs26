import { mkdir, readFile, writeFile } from "fs/promises";
import { resolve } from "path";

type Event = {
  id?: string;
  slug: string;
  title?: string;
  summary?: string;
  description?: string;
  startAt?: string | null;
  status?: string;
  venue?: { name?: string; city?: string };
  city?: { name?: string };
};

function clean(s?: string | null) {
  return (s ?? "").trim();
}

async function main() {
  // Read exactly what was exported
  const srcPath = resolve(process.cwd(), "app/data/events.json");
  const raw = await readFile(srcPath, "utf8");
  const events: Event[] = JSON.parse(raw);

  // Only PUBLISHED, dedupe by id/slug, and keep only fields needed for search
  const seen = new Set<string>();
  const index = events
    .filter((e) => e?.status === "PUBLISHED")
    .map((e) => ({
      id: e.id ?? e.slug,
      slug: e.slug,
      title: clean(e.title),
      summary: clean(e.summary),
      description: clean(e.description),
      startAt: e.startAt ?? null,
      venue: { name: clean(e?.venue?.name), city: clean(e?.venue?.city) },
      city: { name: clean(e?.city?.name) },
    }))
    .filter((e) => {
      const key = e.id || e.slug;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  const outDir = resolve(process.cwd(), "public");
  await mkdir(outDir, { recursive: true });
  await writeFile(resolve(outDir, "search-index.json"), JSON.stringify(index), "utf8");
  console.log(`search-index.json • ${index.length} records (from events.json)`);
}

main().catch((err) => {
  console.error("Failed to build search index:", err);
  process.exit(1);
});