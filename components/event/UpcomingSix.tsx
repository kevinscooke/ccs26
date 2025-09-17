// components/event/UpcomingSix.tsx
import { prisma } from '@/lib/db';
import Link from 'next/link';

export const revalidate = 600; // cache for 10 minutes

export default async function UpcomingSix() {
  const now = new Date();
  const events = await prisma.event.findMany({
    where: { status: 'PUBLISHED', startAt: { gte: now } },
    orderBy: [{ startAt: 'asc' }, { title: 'asc' }],
    take: 6,
    include: { city: true },
  });

  if (!events.length) {
    return <p className="mt-4 text-zinc-400">No upcoming events yet.</p>;
  }

  const fmt = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((e) => (
        <article key={e.id} className="ccs-card">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold">{e.title}</h3>
            {e.isFeatured && <span className="ccs-badge">Featured</span>}
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            {e.city?.name ? `${e.city.name} • ` : ''}
            {fmt.format(new Date(e.startAt))}
          </p>
          <div className="mt-4 flex gap-2">
            <Link className="ccs-btn" href={`/events/${e.slug}`}>Details</Link>
            {e.url && (
              <a className="ccs-btn" href={e.url} target="_blank" rel="noreferrer">
                Official
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
