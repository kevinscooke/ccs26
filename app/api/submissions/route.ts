import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  const data = await request.json();
  // Minimal create; in production validate with zod/hcaptcha
  const city = await prisma.city.findFirst({ where: { slug: data.citySlug }});
  if (!city) return NextResponse.json({ error: 'Unknown city' }, { status: 400 });

  const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const ev = await prisma.event.create({
    data: {
      cityId: city.id,
      title: data.title,
      slug,
      description: data.description || '',
      startAt: new Date(data.startAt),
      endAt: data.endAt ? new Date(data.endAt) : null,
      status: 'PENDING',
      source: 'submission',
      url: data.url || null
    }
  });
  return NextResponse.json({ ok: true, id: ev.id, slug: ev.slug });
}
