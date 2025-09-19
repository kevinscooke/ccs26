export type Resource = {
  title: string;
  href: string;
  description?: string;
  badge?: string;
  category?: 'Calendars' | 'Venues' | 'Clubs' | 'Vendors' | 'Photography' | 'Other';
};

export const resources: Resource[] = [
  // Calendars
  {
    title: "Charlotte Car Shows – Weekly List",
    href: "https://charlottecarshows.com/",
    description: "Our weekly roundup of meets, cruises, and shows.",
    badge: "Local",
    category: "Calendars",
  },
  // Add the rest of your links here. You can copy from the current WP page and paste.
];
