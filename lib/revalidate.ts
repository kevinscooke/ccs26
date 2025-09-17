export const TAGS = {
  EVENTS: 'events',
  event: (slug: string) => `event:${slug}`,
} as const;
