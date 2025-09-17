import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { TAGS } from "@/lib/tags";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { city, event } = body as { city?: string; event?: string };

  revalidateTag(TAGS.EVENTS);
  if (city)  revalidateTag(TAGS.city(city));
  if (event) revalidateTag(TAGS.event(event));

  return NextResponse.json({ ok: true });
}
