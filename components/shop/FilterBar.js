"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { useState } from "react";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function FilterBar({ totalCount }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sortOpen, setSortOpen] = useState(false);

  const currentSort = searchParams.get("sort") || "newest";
  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === currentSort)?.label ?? "Newest";

  function updateParam(key, value) {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "newest") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="border-b border-border sticky top-16 md:top-20 z-30 bg-surface/95 backdrop-blur-sm">
      <div className="container py-4 flex items-center justify-between gap-4">
        {/* Left: count */}
        <p className="font-body text-sm text-muted hidden sm:block">
          {totalCount !== undefined && (
            <span>{totalCount} {totalCount === 1 ? "product" : "products"}</span>
          )}
        </p>

        {/* Right: sort */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="relative">
            <button
              onClick={() => setSortOpen((o) => !o)}
              className="flex items-center gap-2 font-body text-sm text-muted hover:text-foreground transition-colors px-3 py-2 border border-border"
            >
              <SlidersHorizontal size={14} />
              <span>{currentSortLabel}</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
              />
            </button>

            {sortOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setSortOpen(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 top-full mt-1 z-20 w-52 bg-surface border border-border shadow-lg">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        updateParam("sort", option.value);
                        setSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 font-body text-sm transition-colors ${
                        currentSort === option.value
                          ? "text-foreground bg-surface-raised"
                          : "text-muted hover:text-foreground hover:bg-surface-raised"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
