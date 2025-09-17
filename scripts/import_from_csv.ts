/**
 * CSV headers:
 * citySlug,title,slug,description,startAt,endAt,url,isFeatured
 */
import fs from 'node:fs';
import path from 'node:path';
import { prisma } from '../lib/db';

function parseCSV(text: string): string[][] {
  const lines = text.trim().split(/\r?\n/);
  return lines.map(line => line.split(',').map(s => s.trim()));
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// NEW: create city on the fly if missing
async function ensureCity(slug: string) {
  const s = slugify(slug);
  return prisma.city.upsert({
    where: { slug: s },
    update: {},
    create: { slug: s, name: s.replace(/-/g, ' ').replace(/\b\w/g, m => m.toUpperCase()), region: 'NC' },
  });
}

async function run() {
  const file = process.argv[2] || 'events.csv';
  const full = path.resolve(process.cwd(), file);
  if (!fs.existsSync(full)) {
    console.error('CSV not found:', full);
    process.exit(1);
  }
  const csv = parseCSV(fs.readFileSync(full, 'utf8'));
  const [headers, ...rows] = csv;
  const idx = Object.fromEntries(headers.map((h, i) => [h, i]));

  for (const row of rows) {
    const citySlug = row[idx.citySlug];
    if (!citySlug) { console.warn('Skipping row; no citySlug'); continue; }

    const city = await ensureCity(citySlug);

    const rawTitle = row[idx.title];
    if (!rawTitle) { console.warn('Skipping row; no title'); continue; }

    const slug = row[idx.slug] ? slugify(row[idx.slug]) : slugify(`${rawTitle}-${city.slug}`);
    const startAt = new Date(row[idx.startAt]);
    const endAt   = row[idx.endAt] ? new Date(row[idx.endAt]) : null;
    const url     = row[idx.url] || null;
    const isFeatured = (row[idx.isFeatured] || '').toLowerCase() === 'true';

    await prisma.event.upsert({
      where: { slug },
      update: { title: rawTitle, description: row[idx.description], startAt, endAt, url, isFeatured },
      create: {
        cityId: city.id,
        title: rawTitle,
        slug,
        description: row[idx.description],
        startAt,
        endAt,
        url,
        status: 'PUBLISHED',
        isFeatured,
        type: 'MEET',
        source: 'csv',
      },
    });
    console.log('Upserted event:', slug);
  }
  console.log('Import complete.');
}

run().finally(() => prisma.$disconnect());
