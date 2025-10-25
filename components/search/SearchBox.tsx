"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchIndex } from "./SearchProvider";
import { parseStartAtToUtc, formatET } from "@/lib/et"; // <- use ET helper

export function SearchBox({ className = "" }: { className?: string }) {
  const { data, loading, error, clean, ensureLoaded } = useSearchIndex();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);

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
    const nowUtc = new Date();

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

    // Strict ET-aware parsing only (no native Date fallback)
    const withTimes = filtered.map((e) => ({
      e,
      startUtc: e.startAt ? parseStartAtToUtc(e.startAt) : null,
    }));

    const upcoming = withTimes
      .filter(({ startUtc }) => !!startUtc && startUtc.getTime() >= nowUtc.getTime())
      .sort((a, b) => a.startUtc!.getTime() - b.startUtc!.getTime())
      .map(({ e }) => e);

    const past = withTimes
      .filter(({ startUtc }) => !startUtc || startUtc.getTime() < nowUtc.getTime())
      .sort((a, b) => (b.startUtc?.getTime() ?? 0) - (a.startUtc?.getTime() ?? 0))
      .map(({ e }) => e);

    return [...upcoming, ...past].slice(0, 10);
  }, [data, q, clean]);

  // Helper to render exactly like events pages
  const formatStartLabel = (startAt?: string | null) => {
    if (!startAt) return null;
    const d = parseStartAtToUtc(startAt);
    if (!d) return null; // refuse to guess with native Date
    return formatET(d);
  };

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const term = q.trim();
          if (!term) return;
          setOpen(false);
          inputRef.current?.blur(); // prevent mobile zoom carrying over
          router.push(`/search?q=${encodeURIComponent(term)}`);
        }}
      >
        <label htmlFor="global-search" className="sr-only">
          Search events and venues
        </label>
        <input
          ref={inputRef}
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
          inputMode="search"
          enterKeyHint="search"
          autoComplete="on"
          placeholder="Search events or venues"
          // text-base = 16px; shrink back to text-sm on md+ to match desktop
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base md:text-sm text-gray-900 placeholder-gray-400 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        />
      </form>

      {open && q && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
          {loading && <div className="p-3 text-sm text-gray-600">Loading index…</div>}
          {error && <div className="p-3 text-sm text-red-700 bg-red-50">Failed to load search index.</div>}
          {!loading && !error && results.length === 0 && <div className="p-3 text-sm text-gray-600">No matches.</div>}
          {!loading && !error && results.length > 0 && (
            <ul className="max-h-80 overflow-auto divide-y divide-gray-100" role="listbox">
              {results.map((e) => {
                const dateLabel = formatStartLabel(e.startAt);
                const location = [e.venue?.name, e.city?.name || e.venue?.city]
                  .filter(Boolean)
                  .join(", ");

                return (
                  <li key={e.id}>
                    <Link
                      href={`/events/${e.slug}/`}
                      onClick={() => {
                        setOpen(false);
                        (document.activeElement as HTMLElement | null)?.blur();
                      }}
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