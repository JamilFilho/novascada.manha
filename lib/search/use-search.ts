// lib/search/use-search.ts
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Fuse, { type FuseResult, type IFuseOptions } from "fuse.js";
import type { SearchEntry } from "./types";

const INDEX_URL = "/search-index.json";

// Pesos: título e referência bíblica pesam mais que o corpo do texto,
// então "119:105" ou "desejo" no título ganham na frente de uma
// ocorrência qualquer em content.
const FUSE_OPTIONS: IFuseOptions<SearchEntry> = {
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  threshold: 0.32, // menor = mais estrito. 0.32 tolera pequenos typos.
  ignoreLocation: true,
  keys: [
    { name: "title", weight: 0.35 },
    { name: "reference", weight: 0.25 },
    { name: "book", weight: 0.15 },
    { name: "excerpt", weight: 0.1 },
    { name: "content", weight: 0.1 },
    { name: "description", weight: 0.05 },
  ],
};

let cachedIndexPromise: Promise<SearchEntry[]> | null = null;

function loadIndex(): Promise<SearchEntry[]> {
  if (!cachedIndexPromise) {
    cachedIndexPromise = fetch(INDEX_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`search-index.json: ${res.status}`);
        return res.json() as Promise<SearchEntry[]>;
      })
      .catch((err) => {
        cachedIndexPromise = null; // permite retry numa próxima chamada
        throw err;
      });
  }
  return cachedIndexPromise;
}

interface UseSearchResult {
  query: string;
  setQuery: (q: string) => void;
  results: FuseResult<SearchEntry>[];
  isLoading: boolean;
  error: string | null;
}

// Referência tipo "119:105" ou "Salmos 119:105" tem prioridade de match exato
// contra o campo reference antes de cair no fuzzy search geral.
function referenceShortcut(entries: SearchEntry[], query: string) {
  const m = query.match(/(\d+):(\d+)/);
  if (!m) return null;
  const [, chapter, verse] = m;
  const hits = entries.filter(
    (e) => String(e.chapter) === chapter && String(e.verse) === verse
  );
  if (hits.length === 0) return null;
  return hits.map((item) => ({ item, refIndex: -1 }) as FuseResult<SearchEntry>);
}

export function useSearch(debounceMs = 150): UseSearchResult {
  const [entries, setEntries] = useState<SearchEntry[] | null>(null);
  const [query, setQueryState] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    loadIndex()
      .then((data) => !cancelled && setEntries(data))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  function setQuery(q: string) {
    setQueryState(q);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedQuery(q), debounceMs);
  }

  const fuse = useMemo(() => {
    if (!entries) return null;
    return new Fuse(entries, FUSE_OPTIONS);
  }, [entries]);

  const results = useMemo(() => {
    if (!fuse || !entries || debouncedQuery.trim().length < 2) return [];
    return referenceShortcut(entries, debouncedQuery) ?? fuse.search(debouncedQuery, { limit: 20 });
  }, [fuse, entries, debouncedQuery]);

  return { query, setQuery, results, isLoading, error };
}