// types.ts
export type VenueV2 = {
  id: string;
  slug: string;
  name: string;
  address1: string | null;
  city: string | null;
  state: string | null;
  postal_code?: string | null;
  url?: string | null;
  lat: number | null;
  lng: number | null;
};

export type EventV2 = {
  id: string;
  title: string;
  slug: string;
  start_at: string;         // ISO UTC
  end_at: string | null;    // ISO UTC
  venue_id: string | null;
  status: string;           // 'PUBLISHED' in your export
  tags: string[] | null;
  image_url: string | null;
  source_url: string | null;
  venue_slug: string | null;
};
