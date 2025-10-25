import { mkdir, writeFile } from "fs/promises";
import { resolve } from "path";
import { loadEvents } from "../lib/data";

async function main() {
  const events = (await loadEvents()) as any[];

  const index = events.map((e) => ({
    id: e.id ?? e.slug,
    slug: e.slug,
    title: e.title ?? "",
    summary: e.summary ?? "",
    description: e.description ?? "",
    startAt: e.startAt ?? null,
    venue: { name: e?.venue?.name ?? "", city: e?.venue?.city ?? "" },
    city: { name: e?.city?.name ?? "" },
  }));

  const outDir = resolve(process.cwd(), "public");
  await mkdir(outDir, { recursive: true });
  await writeFile(resolve(outDir, "search-index.json"), JSON.stringify(index), "utf8");
  console.log(`search-index.json • ${index.length} records`);
}

main().catch((err) => {
  console.error("Failed to build search index:", err);
  process.exit(1);
});