"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useSearchIndex } from "@/components/search/SearchProvider";
import { parseStartAtToUtc, formatET } from "@/lib/et";
import EventListCard from "@/components/event/EventListCard";

export default function SearchResults() {
  const sp = useSearchParams();
  const qParam = sp.get("q") ?? "";
  const { data, loading, error, clean } = useSearchIndex();

  const q = clean(qParam);

  const results = useMemo(() => {
    if (!data || !q) return [];
    const nq = clean(q);

    const filtered = data
      .map((e) => {
        const haystack = [
          clean(e.title),
          clean(e.description || e.summary),
          clean(e.venue?.name),
          clean(e.city?.name || e.venue?.city),
        ].join(" ");
        return haystack.includes(nq) ? e : null;
      })
      .filter((e): e is typeof data[number] => e !== null);

    // Use ET-aware parsing for consistent date handling
    const nowUtc = new Date();
    const withTimes = filtered.map((e) => ({
      e,
      startUtc: e.startAt ? parseStartAtToUtc(e.startAt) : null,
    }));

    const upcoming = withTimes
      .filter(({ startUtc }) => !!startUtc && startUtc.getTime() >= nowUtc.getTime())
      .sort((a, b) => (a.startUtc?.getTime() ?? 0) - (b.startUtc?.getTime() ?? 0))
      .map(({ e }) => e);

    const past = withTimes
      .filter(({ startUtc }) => !startUtc || startUtc.getTime() < nowUtc.getTime())
      .sort((a, b) => (b.startUtc?.getTime() ?? 0) - (a.startUtc?.getTime() ?? 0))
      .map(({ e }) => e);

    return [...upcoming, ...past];
  }, [data, q, clean]);

  if (loading) {
    return (
      <div className="h-16 animate-pulse rounded-xl border border-gray-200 bg-gray-100" />
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Failed to load search index.
      </div>
    );
  }

  if (!q) {
    return (
      <div className="ccs-card p-6">
        <p className="text-[var(--fg)]/70">Enter a search term in the search box above to find events.</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="ccs-card p-6">
        <p className="text-[var(--fg)]/70">No results found for &ldquo;{qParam}&rdquo;. Try different search terms.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--fg)]/70">
        {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{qParam}&rdquo;
      </p>
      <section className="space-y-4">
        {results.map((event) => {
          // Convert to EventListCard format - need to match the event shape
          const eventForCard = {
            id: event.id,
            title: event.title,
            slug: event.slug,
            startAt: event.startAt || "",
            endAt: null,
            description: event.description || event.summary || null,
            venue: event.venue ? {
              name: event.venue.name || undefined,
              city: event.venue.city || undefined,
            } : null,
            city: event.city?.name ? { name: event.city.name } : null,
          };
          return <EventListCard key={event.id} e={eventForCard as any} />;
        })}
      </section>
    </div>
  );
}

