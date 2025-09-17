import { prisma } from '../../lib/db';
// In a real project, import your email provider SDK (Resend, etc.)

export default async () => {
  const now = new Date();
  const end = new Date(now.getTime() + 5 * 24 * 3600 * 1000);
  const cities = await prisma.city.findMany();

  for (const c of cities) {
    const events = await prisma.event.findMany({
      where: { cityId: c.id, status: 'PUBLISHED', startAt: { gte: now, lte: end } },
      orderBy: [{ isFeatured: 'desc' }, { startAt: 'asc' }],
      take: 50,
    });
    if (!events.length) continue;
    // TODO: send email. For now, just log.
    console.log(`Weekly digest for ${c.name}: ${events.length} events`);
  }
};
