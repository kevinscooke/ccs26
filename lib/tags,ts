// lib/tags.ts
export const TAGS = {
  EVENTS: "events" as const,
  event: (slug: string) => `event:${slug}` as const,
  city: (name: string) => `city:${name}` as const,   // <-- add this
};

export type Tag =
  | typeof TAGS.EVENTS
  | ReturnType<typeof TAGS.event>
  | ReturnType<typeof TAGS.city>;
