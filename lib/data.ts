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
function normalizeEvents(v2events: EventV2[], venues: VenueV2[]) {
  const byId = new Map<string, VenueV2>();
  for (const v of venues) byId.set(v.id, v);

  return v2events.map((e) => {
    const venue = e.venue_id ? byId.get(e.venue_id) ?? null : null;
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

export async function loadEvents(): Promise<any[]> {
  // prefer V2 flat public file if present. Detect whether the file looks like
  // V2 (snake_case fields) so we don't mistakenly normalize an already-legacy
  // file that happens to be named `events.json`.
  const maybe = await readPublicJson<any[]>('events.json');
  let publicEvents: any[] | null = null;
  if (maybe && Array.isArray(maybe)) {
    const looksLikeV2 = maybe.length > 0 && (Object.prototype.hasOwnProperty.call(maybe[0], 'start_at') || Object.prototype.hasOwnProperty.call(maybe[0], 'venue_id'));
    if (looksLikeV2) {
      const venues = await loadVenues();
      publicEvents = normalizeEvents(maybe as EventV2[], venues);
    } else {
      publicEvents = maybe as any[];
    }
  }

  // Also try to read the snapshot copy under app/data/events.json on the server
  // so that if the public file is missing items (partial export) we can merge
  // in missing entries from the snapshot. This helps avoid accidental data
  // loss in UpcomingSix when the public export is incomplete.
  let snapshot: any[] = [];
  if (typeof window === 'undefined') {
    try {
      const p = path.join(process.cwd(), 'app', 'data', 'events.json');
      const raw = await fs.readFile(p, 'utf8');
      const parsed = JSON.parse(raw) as any[];
      if (Array.isArray(parsed)) snapshot = parsed;
    } catch (err) {
      // ignore
    }
  }

  // If we have publicEvents, merge with snapshot: prefer public by slug, but
  // include any snapshot events missing from public.
  if (publicEvents) {
    if (snapshot.length === 0) return publicEvents;
    const bySlug = new Map<string, any>();
    for (const e of publicEvents) {
      if (e && e.slug) bySlug.set(e.slug, e);
    }
    for (const s of snapshot) {
      if (s && s.slug && !bySlug.has(s.slug)) bySlug.set(s.slug, s);
    }
    return Array.from(bySlug.values()).sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime() || (a.title || '').localeCompare(b.title || ''));
  }

  // fallback: try legacy nested data folder inside app/data
  const legacy = await readPublicJson<any[]>('data/events.json');
  if (legacy && Array.isArray(legacy)) return legacy;

  // final fallback: try fetching /data/events.json (older code)
  try {
    const res = await fetch('/data/events.json', { cache: 'no-store' });
    return res.ok ? res.json() : [];
  } catch (err) {
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
