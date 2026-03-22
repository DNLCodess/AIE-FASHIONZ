"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { searchProducts, getSuggestions } from "@/lib/api/products";

/**
 * Debounce a value by `delay` ms.
 * @param {string} value
 * @param {number} delay
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

/**
 * Instant search hook — debounced, returns top results for the overlay.
 * @param {string} query  raw (un-debounced) input value
 * @param {number} limit  max results to return (default 6)
 */
export function useInstantSearch(query, limit = 6) {
  const debounced = useDebounce(query, 280);

  return useQuery({
    queryKey: ["search", "instant", debounced, limit],
    queryFn: () => searchProducts(debounced, { limit }),
    enabled: debounced.trim().length >= 2,
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
}

/**
 * Autocomplete suggestions — query phrases + category matches.
 * Synchronous data source so no loading state needed.
 * @param {string} query raw (un-debounced) input value
 */
export function useSuggestions(query) {
  const debounced = useDebounce(query, 150);
  return useQuery({
    queryKey: ["search", "suggestions", debounced],
    queryFn: () => getSuggestions(debounced),
    enabled: debounced.trim().length >= 2,
    placeholderData: { queries: [], categories: [] },
    staleTime: 60_000,
  });
}

/**
 * Full search results hook — used on the /search page.
 * @param {{ q: string, category: string, sort: string, page: number }} params
 */
export function useSearchResults({ q, category, sort, page = 1 }) {
  return useQuery({
    queryKey: ["search", "results", q, category, sort, page],
    queryFn: () => searchProducts(q, { category, sort, page, limit: 20 }),
    enabled: true,
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
}
