import { prisma } from '../lib/db';

async function main() {
  // Seed a couple cities
  const charlotte = await prisma.city.upsert({
    where: { slug: 'charlotte' },
    update: {},
    create: { slug: 'charlotte', name: 'Charlotte', region: 'NC' },
  });
  const raleigh = await prisma.city.upsert({
    where: { slug: 'raleigh' },
    update: {},
    create: { slug: 'raleigh', name: 'Raleigh', region: 'NC' },
  });

  // Seed one published event
  const start = new Date();
  start.setDate(start.getDate() + 7);
  await prisma.event.create({
    data: {
      cityId: charlotte.id,
      title: 'Cars & Coffee Charlotte',
      slug: 'cars-and-coffee-charlotte',
      description: 'Monthly meet for all enthusiasts. Family-friendly.',
      startAt: start,
      status: 'PUBLISHED',
      isFeatured: true,
      url: 'https://example.com/event',
    }
  });

  console.log('Seeded cities and example event.');
}

main().then(async () => {
  await prisma.$disconnect();
}).catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
