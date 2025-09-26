interface EventLike {
  slug?: string;
  id?: string | number;
}

export function getEventSlug(e: EventLike): string {
  // Prefer slug, fall back to id, otherwise empty string
  return String(e?.slug ?? e?.id ?? "");
}