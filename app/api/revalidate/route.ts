import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { TAGS } from '@/lib/revalidate';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { city, event } = body;
  revalidateTag(TAGS.EVENTS);
  if (city) revalidateTag(TAGS.city(city));
  if (event) revalidateTag(TAGS.event(event));
  return NextResponse.json({ ok: true });
}
