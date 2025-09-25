export function getEventSlug(e: any): string {
  // prefer a human slug, fall back to id (string)
  const slug = e?.slug ?? e?.id;
  return slug === undefined || slug === null ? "" : String(slug);
}