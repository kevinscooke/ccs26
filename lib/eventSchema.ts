/**
 * Standardized Event JSON-LD schema helper
 * Ensures consistent Event schema format across all pages
 */

import { toEtDate } from "@/lib/et";

function isValidUrl(u: any): u is string {
  return typeof u === "string" && /^\s*https?:\/\//i.test(u.trim());
}

export interface EventSchemaOptions {
  /**
   * Event object with standard event fields
   */
  event: {
    id: string;
    title: string;
    slug: string;
    startAt: string | Date;
    endAt?: string | Date | null;
    description?: string | null;
    imageUrl?: string | null;
    url?: string | null;
    website?: string | null;
    siteUrl?: string | null;
    externalUrl?: string | null;
    price?: number | null;
    isPaid?: boolean | null;
    paid?: boolean | null;
    admissionPaid?: boolean | null;
    organizer?: string | null;
    venue?: {
      name?: string | null;
      address1?: string | null;
      address2?: string | null;
      city?: string | null;
      state?: string | null;
      postal?: string | null;
      postal_code?: string | null;
      postalCode?: string | null;
    } | null;
    status?: string | null;
    public_status?: string | null;
    capacity?: number | null;
    maxCapacity?: number | null;
    maxAttendees?: number | null;
    maximumAttendeeCapacity?: number | null;
    size?: number | null;
    estimatedSize?: number | null;
    expectedSize?: number | null;
  };
  /**
   * Base URL for event detail pages (default: "https://charlottecarshows.com")
   */
  baseUrl?: string;
  /**
   * Default image URL if event doesn't have one
   */
  defaultImage?: string;
}

/**
 * Builds a standardized Event schema.org JSON-LD object
 * Based on the pattern from /events/[slug]/page.tsx
 */
export function buildEventSchema(options: EventSchemaOptions): any {
  const { event, baseUrl = "https://charlottecarshows.com", defaultImage = "/images/hero-ccs.jpg" } = options;

  const canonical = `${baseUrl}/events/${event.slug}/`;
  const image = event.imageUrl?.trim() || defaultImage;

  // Determine if event is paid
  const isPaid =
    typeof event.price === "number"
      ? event.price > 0
      : Boolean(event.isPaid ?? event.paid ?? event.admissionPaid ?? false);

  // Get site URL if valid
  const siteUrl = isValidUrl(event.url || event.website || event.siteUrl || event.externalUrl)
    ? (event.url || event.website || event.siteUrl || event.externalUrl)!.trim()
    : null;

  // Determine if cancelled
  const isCancelled = (event.public_status ?? event.status) === "CANCELLED";

  // Get maximum capacity if available
  const maxCapRaw =
    event.capacity ??
    event.maxCapacity ??
    event.maxAttendees ??
    event.maximumAttendeeCapacity ??
    (typeof event.size === "number" ? event.size : undefined);
  const maxCap = typeof maxCapRaw === "number" ? maxCapRaw : undefined;

  // Build location if venue exists
  const location = event.venue?.name
    ? {
        "@type": "Place" as const,
        name: event.venue.name,
        address: {
          "@type": "PostalAddress" as const,
          streetAddress: [event.venue.address1, event.venue.address2].filter(Boolean).join(" "),
          addressLocality: event.venue.city || undefined,
          addressRegion: event.venue.state || undefined,
          postalCode: event.venue.postal || event.venue.postal_code || event.venue.postalCode || undefined,
          addressCountry: "US" as const,
        },
      }
    : undefined;

  // Build organizer if exists
  const organizer = event.organizer
    ? {
        "@type": "Organization" as const,
        name: event.organizer,
        ...(siteUrl ? { url: siteUrl } : {}),
      }
    : undefined;

  // Get dates
  const startDate = toEtDate(event.startAt)?.toISOString() ?? event.startAt;
  const endDate = event.endAt ? (toEtDate(event.endAt)?.toISOString() ?? event.endAt) : undefined;

  // Build the schema
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate,
    ...(endDate ? { endDate } : {}),
    ...(event.description?.trim() ? { description: event.description.trim() } : {}),
    url: canonical,
    image,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    isAccessibleForFree: !isPaid,
    offers: [
      {
        "@type": "Offer",
        price: isPaid ? String(event.price ?? "") : "0.00",
        priceCurrency: "USD",
        url: siteUrl || canonical,
        availability: "https://schema.org/InStock",
      },
    ],
    ...(organizer ? { organizer } : {}),
    ...(maxCap ? { maximumAttendeeCapacity: maxCap } : {}),
    ...(location ? { location } : {}),
    ...(isCancelled ? { eventStatus: "https://schema.org/EventCancelled" } : {}),
  };

  return schema;
}

/**
 * Builds an ItemList schema with Event schemas embedded in ListItems
 * Useful for list pages like /events/, /weekly-car-show-list-charlotte/
 */
export function buildEventItemListSchema(
  events: EventSchemaOptions["event"][],
  options?: {
    baseUrl?: string;
    defaultImage?: string;
    name?: string;
    limit?: number;
  }
): any {
  const {
    baseUrl = "https://charlottecarshows.com",
    defaultImage = "/images/hero-ccs.jpg",
    name = "Events",
    limit = 100,
  } = options || {};

  const limitedEvents = events.slice(0, limit);

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: limitedEvents.map((event, i) => {
      const eventSchema = buildEventSchema({ event, baseUrl, defaultImage });
      return {
        "@type": "ListItem",
        position: i + 1,
        // For Google carousels: ListItem should have EITHER 'url' OR 'item', not both
        // Since we're embedding full Event schema (which includes its own url property),
        // we only use 'item' here
        item: eventSchema,
      };
    }),
  };
}

/**
 * Builds a BreadcrumbList JSON-LD schema
 * Ensures consistent BreadcrumbList format across all pages
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export function buildBreadcrumbListSchema(
  items: BreadcrumbItem[],
  options?: {
    baseUrl?: string;
    currentPageUrl?: string; // Full canonical URL for the current page
  }
): any {
  const { baseUrl = "https://charlottecarshows.com", currentPageUrl } = options || {};

  // Build URLs correctly - current page should use the canonical URL if provided
  const itemListElement = items.map((item, i) => {
    let url: string;
    
    if (item.current && currentPageUrl) {
      // Use provided canonical URL for current page
      url = currentPageUrl;
    } else if (item.current || !item.href) {
      // Fallback: construct from breadcrumb path (less reliable)
      const pathParts = items
        .slice(0, i + 1)
        .map(it => it.href || "")
        .filter(Boolean);
      url = `${baseUrl}${pathParts.length > 0 ? pathParts.join("") : "/"}`;
    } else {
      url = `${baseUrl}${item.href}`;
    }
    
    return {
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: url,
    };
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
}

