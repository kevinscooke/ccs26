// scripts/export-events-to-json.ts
import { PrismaClient } from '@prisma/client';
import { writeFileSync } from 'fs';

async function main() {
  const prisma = new PrismaClient();
  const events = await prisma.event.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: [{ startAt: 'asc' }, { title: 'asc' }],
    include: { venue: true, city: true },
  });
  writeFileSync('public/events.json', JSON.stringify(events, null, 2));
  await prisma.$disconnect();
  console.log('Exported events to public/events.json');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
