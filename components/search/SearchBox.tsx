"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchIndex } from "./SearchProvider";

export function SearchBox({ className = "" }: { className?: string }) {
  const { data, loading, error, clean, ensureLoaded } = useSearchIndex();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // close dropdown on navigation
    setOpen(false);
  }, [pathname]);

  const results = useMemo(() => {
    if (!data || !q.trim()) return [];
    const nq = clean(q);
    const now = Date.now();
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

    const upcoming = filtered
      .filter((e) => (e.startAt ? new Date(e.startAt).getTime() >= now : false))
      .sort((a, b) => new Date(a.startAt || 0).getTime() - new Date(b.startAt || 0).getTime());
    const past = filtered
      .filter((e) => !(e.startAt ? new Date(e.startAt).getTime() >= now : false))
      .sort((a, b) => new Date(b.startAt || 0).getTime() - new Date(a.startAt || 0).getTime());

    return [...upcoming, ...past].slice(0, 10);
  }, [data, q, clean]);

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const term = q.trim();
          if (!term) return;
          setOpen(false);
          router.push(`/search?q=${encodeURIComponent(term)}`);
        }}
      >
        <label htmlFor="global-search" className="sr-only">
          Search events and venues
        </label>
        <input
          id="global-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => {
            ensureLoaded();
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              (e.target as HTMLInputElement).blur();
            }
          }}
          placeholder="Search events or venues"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-expanded={open && !!q}
          aria-haspopup="listbox"
        />
      </form>

      {open && q && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
          {loading && <div className="p-3 text-sm text-gray-600">Loading index…</div>}
          {error && <div className="p-3 text-sm text-red-700 bg-red-50">Failed to load search index.</div>}
          {!loading && !error && results.length === 0 && <div className="p-3 text-sm text-gray-600">No matches.</div>}
          {!loading && !error && results.length > 0 && (
            <ul className="max-h-80 overflow-auto divide-y divide-gray-100" role="listbox">
              {results.map((e, idx) => {
                const start = e.startAt ? new Date(e.startAt) : null;
                const dateLabel =
                  start &&
                  start.toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    timeZone: "America/New_York",
                  });
                const location = [e.venue?.name, e.city?.name || e.venue?.city].filter(Boolean).join(", ");
                return (
                  <li key={e.id}>
                    <Link
                      href={`/events/${e.slug}/`}
                      onClick={() => setOpen(false)}
                      className="block px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      <div className="font-medium text-gray-900">{e.title}</div>
                      <div className="text-gray-600">
                        {dateLabel && <span className="mr-2">🗓 {dateLabel}</span>}
                        {location && <span>📍 {location}</span>}
                      </div>
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  href={`/search?q=${encodeURIComponent(q.trim())}`}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  See all results →
                </Link>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}