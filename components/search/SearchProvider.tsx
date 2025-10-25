"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type EventIndex = {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  description?: string;
  startAt?: string | null;
  venue?: { name?: string; city?: string };
  city?: { name?: string };
};

type Ctx = {
  data: EventIndex[] | null;
  loading: boolean;
  error: string | null;
  ensureLoaded: () => void;
};

const SearchCtx = createContext<Ctx | null>(null);

// simple module-level cache across navigations
let cached: EventIndex[] | null = null;
let inflight: Promise<EventIndex[]> | null = null;

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

async function loadIndex(base = ""): Promise<EventIndex[]> {
  if (cached) return cached;
  if (!inflight) {
    inflight = fetch(`${base}/search-index.json`, { cache: "force-cache" }).then(async (r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const json = (await r.json()) as EventIndex[];
      cached = json;
      return json;
    });
  }
  return inflight;
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<EventIndex[] | null>(cached);
  const [loading, setLoading] = useState<boolean>(!cached);
  const [error, setError] = useState<string | null>(null);

  const ensureLoaded = () => {
    if (cached) return;
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    setLoading(true);
    loadIndex(base)
      .then((json) => setData(json))
      .catch((e) => setError(e?.message || "Failed to load search index"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // prefetch on first mount
    if (!cached) ensureLoaded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<Ctx>(() => ({ data, loading, error, ensureLoaded }), [data, loading, error]);

  return <SearchCtx.Provider value={value}>{children}</SearchCtx.Provider>;
}

export function useSearchIndex() {
  const ctx = useContext(SearchCtx);
  if (!ctx) throw new Error("useSearchIndex must be used within <SearchProvider>");
  return { ...ctx, clean };
}