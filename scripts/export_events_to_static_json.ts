// scripts/export_events_to_static_json.ts
// Export events from database to reduced static JSON for static hosting
import { getPrisma } from "../lib/prisma";
import fs from "fs";
import path from "path";

const prismaPromise = getPrisma();

const OUTPUT_PATH = path.join(__dirname, "../data/events.json");

// Reduced event schema
function mapEvent(event: any) {
  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    description: event.description,
    url: event.url,
    startAt: event.startAt,
    endAt: event.endAt,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
    publishedAt: event.publishedAt,
    status: event.status,
    isFeatured: event.isFeatured,
    price: event.price,
    type: event.type,
    size: event.size,
    isRecurring: event.isRecurring,
    socialLinks: event.socialLinks,
    city: event.city ? {
      id: event.city.id,
      slug: event.city.slug,
      name: event.city.name,
      region: event.city.region,
    } : null,
    venue: event.venue ? {
      id: event.venue.id,
      name: event.venue.name,
      address1: event.venue.address1,
      city: event.venue.city,
      state: event.venue.state,
    } : null,
    seriesId: event.seriesId,
    cityId: event.cityId,
    venueId: event.venueId,
    organizerId: event.organizerId,
  };
}

async function main() {
  const prisma = await prismaPromise;
  const events = await prisma.event.findMany({
    include: {
      city: true,
      venue: true,
    },
  });
  const reduced = events.map(mapEvent);
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(reduced, null, 2));
  console.log(`Exported ${reduced.length} events to ${OUTPUT_PATH}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
