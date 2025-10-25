"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type EventIndex = {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  description?: string;
  startAt?: string | null;
  venue?: { name?: string; city?: string };
  city?: { name?: string };
};

function clean(str?: string | null) {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\x00-\x1F\x7F]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function SearchClient() {
  const sp = useSearchParams();
  const qParam = sp.get("q") ?? "";
  const q = clean(qParam);

  const [data, setData] = useState<EventIndex[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/search-index.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`${r.status}`))))
      .then((json: EventIndex[]) => setData(json))
      .catch((e) => setError(e?.message || "Failed to load search index"));
  }, []);

  const results = useMemo<EventIndex[]>(() => {
    if (!data || !q) return [];
    const filtered = data
      .map<EventIndex | null>((e) => {
        const hay = [clean(e.title), clean(e.description || e.summary), clean(e.venue?.name), clean(e.city?.name || e.venue?.city)].join(" ");
        return hay.includes(q) ? e : null;
      })
      .filter((e): e is EventIndex => e !== null);

    const now = Date.now();
    const upcoming = filtered
      .filter((e) => (e.startAt ? new Date(e.startAt).getTime() >= now : false))
      .sort((a, b) => new Date(a.startAt || 0).getTime() - new Date(b.startAt || 0).getTime());
    const past = filtered
      .filter((e) => !(e.startAt ? new Date(e.startAt).getTime() >= now : false))
      .sort((a, b) => new Date(b.startAt || 0).getTime() - new Date(a.startAt || 0).getTime());

    return [...upcoming, ...past];
  }, [data, q]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-heading">Search</h1>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Failed to load search index.</div>}

      {!q && <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-600">Enter a search in the box.</div>}

      {q && (
        <>
          <p className="text-sm text-gray-600">
            {results.length} result{results.length === 1 ? "" : "s"} for “{qParam}”
          </p>
          <section className="grid gap-4 md:gap-6">
            {results.map((event) => {
              const start = event.startAt ? new Date(event.startAt) : undefined;
              const dateLabel = start
                ? start.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/New_York" })
                : null;
              const venueName = event.venue?.name;
              const cityName = event.city?.name || event.venue?.city;
              const location = [venueName, cityName].filter(Boolean).join(", ");

              return (
                <Link
                  key={event.id ?? event.slug}
                  href={`/events/${event.slug}/`}
                  className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-lg"
                >
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-emerald-700">{event.title}</h3>
                  <div className="mt-1 text-sm text-gray-600">
                    {dateLabel && <span className="mr-2">🗓 {dateLabel}</span>}
                    {location && <span>📍 {location}</span>}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">{event.summary || event.description}</p>
                  <p className="mt-2 text-sm font-semibold text-emerald-600 group-hover:text-emerald-800">View details →</p>
                </Link>
              );
            })}
          </section>
        </>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-5xl px-4 py-8"><div className="h-16 animate-pulse rounded-xl border border-gray-200 bg-gray-100" /></main>}>
      <SearchClient />
    </Suspense>
  );
}