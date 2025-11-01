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
  const [selectedIndex, setSelectedIndex] = useState(-1);
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
    setSelectedIndex(-1);
  }, [pathname]);

  useEffect(() => {
    // Reset selected index when query changes
    setSelectedIndex(-1);
  }, [q]);

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
              setSelectedIndex(-1);
              (e.target as HTMLInputElement).blur();
            } else if (e.key === "ArrowDown" && results.length > 0) {
              e.preventDefault();
              const nextIndex = selectedIndex < results.length ? selectedIndex + 1 : 0;
              setSelectedIndex(nextIndex);
              // Focus the corresponding link element
              const links = boxRef.current?.querySelectorAll<HTMLElement>('[role="option"] a');
              if (links && links[nextIndex]) {
                links[nextIndex].focus();
              }
            } else if (e.key === "ArrowUp" && results.length > 0) {
              e.preventDefault();
              const prevIndex = selectedIndex > 0 ? selectedIndex - 1 : results.length;
              setSelectedIndex(prevIndex);
              // Focus the corresponding link element
              const links = boxRef.current?.querySelectorAll<HTMLElement>('[role="option"] a');
              if (links && links[prevIndex]) {
                links[prevIndex].focus();
              }
            } else if (e.key === "Enter" && open && selectedIndex >= 0 && selectedIndex <= results.length) {
              // Navigate to selected result or "see all" link
              e.preventDefault();
              if (selectedIndex < results.length) {
                const selectedResult = results[selectedIndex];
                if (selectedResult) {
                  router.push(`/events/${selectedResult.slug}/`);
                  setOpen(false);
                  setSelectedIndex(-1);
                }
              } else {
                // Navigate to "see all" link
                router.push(`/search?q=${encodeURIComponent(q.trim())}`);
                setOpen(false);
                setSelectedIndex(-1);
              }
            } else if (e.key === "Enter" && open && results.length > 0 && selectedIndex === -1) {
              // If no result selected but Enter pressed, navigate to first result
              e.preventDefault();
              const firstResult = results[0];
              if (firstResult) {
                router.push(`/events/${firstResult.slug}/`);
                setOpen(false);
                setSelectedIndex(-1);
              }
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
        <div 
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={results.length > 0 ? "search-results-listbox" : undefined}
        >
          {loading && <div className="p-3 text-sm text-gray-600" role="status" aria-live="polite">Loading index…</div>}
          {error && <div className="p-3 text-sm text-red-700 bg-red-50" role="alert" aria-live="assertive">Failed to load search index.</div>}
          {!loading && !error && results.length === 0 && <div className="p-3 text-sm text-gray-600" role="status" aria-live="polite">No matches.</div>}
          {!loading && !error && results.length > 0 && (
            <ul 
              id="search-results-listbox"
              className="max-h-80 overflow-auto divide-y divide-gray-100" 
              role="listbox"
              aria-label={`${results.length} search result${results.length !== 1 ? 's' : ''}`}
            >
              {results.map((e, idx) => {
                const dateLabel = formatStartLabel(e.startAt);
                const location = [e.venue?.name, e.city?.name || e.venue?.city]
                  .filter(Boolean)
                  .join(", ");
                const isSelected = selectedIndex === idx;

                return (
                  <li key={e.id} role="option" aria-selected={isSelected}>
                    <Link
                      href={`/events/${e.slug}/`}
                      onFocus={() => setSelectedIndex(idx)}
                      onClick={() => {
                        setOpen(false);
                        setSelectedIndex(-1);
                        (document.activeElement as HTMLElement | null)?.blur();
                      }}
                      className={`block px-3 py-2 text-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 focus:ring-2 focus:ring-brand-500/30 ${isSelected ? 'bg-gray-50' : ''}`}
                      aria-label={`${e.title}${dateLabel ? `, ${dateLabel}` : ''}${location ? `, ${location}` : ''}`}
                      tabIndex={-1}
                    >
                      <div className="font-medium text-gray-900">{e.title}</div>
                      <div className="text-gray-600" aria-hidden="true">
                        {dateLabel && <span className="mr-2">🗓 {dateLabel}</span>}
                        {location && <span>📍 {location}</span>}
                      </div>
                    </Link>
                  </li>
                );
              })}
              <li role="option" aria-selected={selectedIndex === results.length}>
                <Link
                  href={`/search?q=${encodeURIComponent(q.trim())}`}
                  onFocus={() => setSelectedIndex(results.length)}
                  onClick={() => {
                    setOpen(false);
                    setSelectedIndex(-1);
                  }}
                  className={`block px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 focus:outline-none focus:bg-emerald-50 focus:ring-2 focus:ring-brand-500/30 ${selectedIndex === results.length ? 'bg-emerald-50' : ''}`}
                  aria-label={`See all results for "${q.trim()}"`}
                  tabIndex={-1}
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