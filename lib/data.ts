// lib/data.ts
import type { EventV2, VenueV2 } from '@/types';
import fs from 'fs/promises';
import path from 'path';

// Try to read from public/ on the server (during SSR/build). If that fails
// (or we're in the browser), fall back to fetching the file from the site root.
async function readPublicJson<T = any>(filename: string): Promise<T | null> {
  // server-side fast path
  if (typeof window === 'undefined') {
    try {
      const p = path.join(process.cwd(), 'public', filename);
      const raw = await fs.readFile(p, 'utf8');
      return JSON.parse(raw) as T;
    } catch (err) {
      // fallthrough to client fetch fallback below
    }
  }

  // client-side or fallback: use fetch relative to site root
  try {
    const res = await fetch(`/${filename}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (err) {
    return null;
  }
}

// normalize V2 -> legacy shape expected by most existing pages
// Also handles legacy format from events.json (already normalized, just needs venue slugs)
function normalizeEvents(v2events: EventV2[], venues: VenueV2[]) {
  const byId = new Map<string, VenueV2>();
  for (const v of venues) byId.set(v.id, v);

  return v2events.map((e: any) => {
    // Try to find venue by venue_id first, then by embedded venue.id (for events.json structure)
    let venue: VenueV2 | null = null;
    if (e.venue_id) {
      venue = byId.get(e.venue_id) ?? null;
    } else if (e.venue?.id) {
      // Handle embedded venue data (from events.json export format)
      venue = byId.get(e.venue.id) ?? null;
    }
    
    // Check if this is already in legacy format (has startAt) or V2 format (has start_at)
    const isLegacyFormat = e.startAt !== undefined;
    
    // If legacy format, preserve all fields and just add/update venue slug
    if (isLegacyFormat) {
      return {
        ...e,
        venue: venue
          ? {
              ...e.venue, // Preserve existing venue fields
              id: venue.id,
              name: venue.name || e.venue?.name,
              slug: venue.slug, // Add slug from venues.json
              address1: venue.address1 || e.venue?.address1,
              city: venue.city || e.venue?.city,
              state: venue.state || e.venue?.state,
              postal: venue.postal_code ?? e.venue?.postal,
            }
          : e.venue || null,
      };
    }
    
    // V2 format - normalize from scratch
    return {
      id: e.id,
      title: e.title,
      slug: e.slug,
      description: '',
      url: e.source_url || null,
      startAt: e.start_at,
      endAt: e.end_at || null,
      createdAt: null,
      updatedAt: null,
      publishedAt: null,
      status: e.status || 'PUBLISHED',
      isFeatured: false,
      price: null,
      type: null,
      size: null,
      isRecurring: false,
      socialLinks: [],
      city: venue ? { id: '', slug: venue.slug, name: venue.city || '', region: venue.state || '' } : null,
      venue: venue
        ? {
            id: venue.id,
            name: venue.name,
            slug: venue.slug,
            address1: venue.address1,
            city: venue.city,
            state: venue.state,
            postal: venue.postal_code ?? undefined,
          }
        : null,
      seriesId: null,
      cityId: venue ? '' : null,
      venueId: venue ? venue.id : null,
      organizerId: null,
    } as any;
  });
}

export async function loadVenues(): Promise<VenueV2[]> {
  // Try the preferred public root file first
  const fromPublic = await readPublicJson<VenueV2[]>('venues.json');
  if (fromPublic && Array.isArray(fromPublic)) return fromPublic;

  // Older layout: public/data/venues.json
  const fromPublicData = await readPublicJson<VenueV2[]>('data/venues.json');
  if (fromPublicData && Array.isArray(fromPublicData)) return fromPublicData;

  // During development or when using the exporter snapshot, we may have a copy
  // under app/data/venues.json (source-controlled). Try reading that directly
  // from the project root on the server.
  if (typeof window === 'undefined') {
    try {
      const p = path.join(process.cwd(), 'app', 'data', 'venues.json');
      const raw = await fs.readFile(p, 'utf8');
      const parsed = JSON.parse(raw) as VenueV2[];
      if (Array.isArray(parsed)) return parsed;
    } catch (err) {
      // ignore and fall through to empty
    }
  }

  return [];
}

// Prefer local JSON so lists and detail routes match during static export
export async function loadEvents(): Promise<any[]> {
  try {
    const mod = await import('@/app/data/events.json');
    const data = (mod as any).default ?? mod;
    const events = Array.isArray(data) ? data : [];
    
    // Normalize events to add venue slugs (needed for EventListCard venue links)
    const venues = await loadVenues();
    return normalizeEvents(events as EventV2[], venues);
  } catch {
    return [];
  }
}

// Useful lookups
export function indexVenuesById(venues: VenueV2[]) {
  const byId = new Map<string, VenueV2>();
  for (const v of venues) byId.set(v.id, v);
  return byId;
}

export function indexVenuesBySlug(venues: VenueV2[]) {
  const bySlug = new Map<string, VenueV2>();
  for (const v of venues) bySlug.set(v.slug, v);
  return bySlug;
}

// Dates
export function toLocal(dt: string | null | undefined) {
  return dt ? new Date(dt) : null;
}
