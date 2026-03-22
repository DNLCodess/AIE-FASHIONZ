"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";

const CATEGORIES = [
  { slug: "luxury-fabrics", label: "Luxury Fabrics" },
  { slug: "bags-shoes", label: "Bags & Shoes" },
  { slug: "jewellery", label: "Jewellery" },
  { slug: "party-dinner-wear", label: "Party Wear" },
  { slug: "childrens-wear", label: "Children's" },
  { slug: "body-shapers", label: "Body Shapers" },
];

const SORT_OPTIONS = [
  { value: "", label: "Relevance" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

const PER_PAGE = 20;

/** @param {{ initialResults: any[], total: number, q: string, category: string, sort: string, page: number }} props */
export default function SearchResultsView({ initialResults, total, q, category, sort, page }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const buildUrl = useCallback((overrides) => {
    const current = new URLSearchParams(searchParams.toString());
    const updates = { q, category, sort, page: "1", ...overrides };

    // Clean up empty params
    Object.entries(updates).forEach(([k, v]) => {
      if (v && v !== "1") {
        current.set(k, String(v));
      } else if (k === "page" && v === "1") {
        current.delete(k);
      } else if (!v || v === "") {
        current.delete(k);
      } else {
        current.set(k, String(v));
      }
    });

    const qs = current.toString();
    return `${pathname}${qs ? "?" + qs : ""}`;
  }, [searchParams, pathname, q, category, sort]);

  const totalPages = Math.ceil(total / PER_PAGE);
  const hasFilters = category || sort;

  return (
    <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "4rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        {q ? (
          <>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "var(--color-muted)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              {total === 0 ? "No results" : `${total} result${total !== 1 ? "s" : ""}`} for
            </p>
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                color: "var(--color-foreground)",
                lineHeight: 1.2,
              }}
            >
              &ldquo;{q}&rdquo;
            </h1>
          </>
        ) : (
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
              color: "var(--color-foreground)",
            }}
          >
            Browse all products
          </h1>
        )}
      </div>

      {/* Search bar — update query without losing filters */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          router.push(buildUrl({ q: fd.get("q") ?? "", page: "1" }));
        }}
        style={{
          display: "flex",
          alignItems: "center",
          border: "1px solid var(--color-border)",
          marginBottom: "1.75rem",
          backgroundColor: "var(--color-surface)",
          maxWidth: "560px",
        }}
      >
        <label htmlFor="search-q" style={{ padding: "0 14px", display: "flex" }}>
          <Search size={16} style={{ color: "var(--color-muted)" }} />
        </label>
        <input
          id="search-q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Search products…"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            color: "var(--color-foreground)",
            padding: "12px 0",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "12px 20px",
            backgroundColor: "var(--color-gold)",
            color: "var(--color-foreground)",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            transition: "background-color 200ms ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-gold-dark)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-gold)")}
        >
          Search
        </button>
      </form>

      {/* Filters row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "10px",
          marginBottom: "2rem",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            color: "var(--color-muted)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginRight: "4px",
          }}
        >
          <SlidersHorizontal size={13} />
          Filter
        </span>

        {/* Category chips */}
        {CATEGORIES.map((cat) => {
          const active = category === cat.slug;
          return (
            <Link
              key={cat.slug}
              href={buildUrl({ category: active ? "" : cat.slug })}
              style={{
                padding: "6px 14px",
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                letterSpacing: "0.04em",
                border: "1px solid",
                borderColor: active ? "var(--color-gold)" : "var(--color-border)",
                backgroundColor: active ? "var(--color-gold)" : "transparent",
                color: active ? "var(--color-foreground)" : "var(--color-muted)",
                textDecoration: "none",
                transition: "all 150ms ease",
                whiteSpace: "nowrap",
              }}
            >
              {cat.label}
            </Link>
          );
        })}

        {/* Divider */}
        <div
          style={{
            width: "1px",
            height: "20px",
            backgroundColor: "var(--color-border)",
            marginInline: "4px",
          }}
        />

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => router.push(buildUrl({ sort: e.target.value }))}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            color: "var(--color-muted)",
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface)",
            padding: "6px 10px",
            cursor: "pointer",
            outline: "none",
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Clear filters */}
        {hasFilters && (
          <Link
            href={buildUrl({ category: "", sort: "" })}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              color: "var(--color-muted)",
              textDecoration: "none",
              border: "1px solid var(--color-border)",
              padding: "6px 10px",
            }}
          >
            <X size={12} />
            Clear filters
          </Link>
        )}
      </div>

      {/* Results grid */}
      {initialResults.length > 0 ? (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "clamp(1rem, 2vw, 1.5rem)",
            }}
            className="sm:grid-cols-3 lg:grid-cols-4"
          >
            {initialResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "3rem",
              }}
            >
              {page > 1 && (
                <Link
                  href={buildUrl({ page: String(page - 1) })}
                  style={pageBtnStyle(false)}
                >
                  ← Prev
                </Link>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                // Show first, last, current ±1, and ellipsis
                const show =
                  p === 1 ||
                  p === totalPages ||
                  Math.abs(p - page) <= 1;
                if (!show) return null;

                const prevShown = Array.from({ length: p }, (_, i) => i + 1)
                  .reverse()
                  .slice(1)
                  .find((x) => x === 1 || x === totalPages || Math.abs(x - page) <= 1);

                const showEllipsis = prevShown !== undefined && p - prevShown > 1;

                return (
                  <span key={p} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {showEllipsis && (
                      <span style={{ color: "var(--color-muted)", fontFamily: "var(--font-body)", fontSize: "13px" }}>
                        …
                      </span>
                    )}
                    <Link
                      href={buildUrl({ page: String(p) })}
                      style={pageBtnStyle(p === page)}
                    >
                      {p}
                    </Link>
                  </span>
                );
              })}

              {page < totalPages && (
                <Link
                  href={buildUrl({ page: String(page + 1) })}
                  style={pageBtnStyle(false)}
                >
                  Next →
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        /* Empty state */
        <div
          style={{
            border: "1px solid var(--color-border)",
            padding: "5rem 2rem",
            textAlign: "center",
            marginTop: "1rem",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "9999px",
              border: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
            }}
          >
            <Search size={18} style={{ color: "var(--color-muted)" }} />
          </div>
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.25rem",
              color: "var(--color-foreground)",
              marginBottom: "10px",
            }}
          >
            {q ? `No results for \u201c${q}\u201d` : "No products found"}
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              color: "var(--color-muted)",
              marginBottom: "2rem",
            }}
          >
            {q
              ? "Try different keywords, or browse our collections below."
              : "Try adjusting your filters."}
          </p>
          {hasFilters && (
            <Link
              href={buildUrl({ category: "", sort: "" })}
              style={{
                display: "inline-block",
                padding: "12px 28px",
                backgroundColor: "var(--color-gold)",
                color: "var(--color-foreground)",
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Clear filters
            </Link>
          )}
          {!hasFilters && (
            <Link
              href="/shop"
              style={{
                display: "inline-block",
                padding: "12px 28px",
                backgroundColor: "var(--color-gold)",
                color: "var(--color-foreground)",
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Browse Collections
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function pageBtnStyle(active) {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "36px",
    height: "36px",
    padding: "0 10px",
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    border: "1px solid",
    borderColor: active ? "var(--color-gold)" : "var(--color-border)",
    backgroundColor: active ? "var(--color-gold)" : "transparent",
    color: active ? "var(--color-foreground)" : "var(--color-muted)",
    textDecoration: "none",
    transition: "all 150ms ease",
  };
}
