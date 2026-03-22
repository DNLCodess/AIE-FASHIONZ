"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, Clock, ArrowRight, Loader2, TrendingUp, Tag } from "lucide-react";
import useUiStore from "@/store/uiStore";
import { useInstantSearch, useSuggestions } from "@/hooks/useSearch";
import { formatCurrency } from "@/lib/utils";

// ── Constants ──────────────────────────────────────────────────────────────

const RECENT_KEY = "aie-recent-searches";
const MAX_RECENT = 3;

const TRENDING = [
  "Luxury Fabrics",
  "Evening Bag",
  "Gold Jewellery",
  "Party Dress",
  "Body Shaper",
];

const CATEGORY_LABELS = {
  "luxury-fabrics": "Luxury Fabrics",
  "bags-shoes": "Bags & Shoes",
  "jewellery": "Jewellery",
  "party-dinner-wear": "Party Wear",
  "childrens-wear": "Children's",
  "body-shapers": "Body Shapers",
};

// ── Local-storage helpers ──────────────────────────────────────────────────

function getRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]"); }
  catch { return []; }
}

function saveRecent(query) {
  const q = query.trim();
  if (!q) return;
  const next = [q, ...getRecent().filter((s) => s !== q)].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

function removeRecent(query) {
  const next = getRecent().filter((s) => s !== query);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  return next;
}

function clearRecent() {
  localStorage.removeItem(RECENT_KEY);
}

// ── Highlight matched text ─────────────────────────────────────────────────

function HighlightMatch({ text, query }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ fontWeight: 700, color: "var(--color-foreground)" }}>
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  );
}

// ── Section header ─────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <p style={{
      fontFamily: "var(--font-body)",
      fontSize: "12px",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--color-muted)",
      padding: "14px 16px 6px",
    }}>
      {children}
    </p>
  );
}

// ── Row components ─────────────────────────────────────────────────────────

function SuggestionRow({ label, query, icon, onClick, active, onHover }) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        width: "100%",
        padding: "9px 16px",
        background: active ? "var(--color-surface-raised)" : "transparent",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        transition: "background 120ms ease",
      }}
    >
      <span style={{ color: "var(--color-subtle)", flexShrink: 0, display: "flex" }}>{icon}</span>
      <span style={{
        fontFamily: "var(--font-body)",
        fontSize: "15px",
        color: "var(--color-foreground)",
        flex: 1,
        textAlign: "left",
      }}>
        <HighlightMatch text={label} query={query} />
      </span>
      <ArrowRight size={13} style={{ color: "var(--color-border)", flexShrink: 0 }} />
    </button>
  );
}

function CategoryRow({ category, query, active, onHover }) {
  return (
    <Link
      href={`/shop/${category.slug}`}
      onMouseEnter={onHover}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "9px 16px",
        background: active ? "var(--color-surface-raised)" : "transparent",
        textDecoration: "none",
        transition: "background 120ms ease",
      }}
    >
      <Tag size={13} style={{ color: "var(--color-subtle)", flexShrink: 0 }} />
      <span style={{
        fontFamily: "var(--font-body)",
        fontSize: "13.5px",
        color: "var(--color-foreground)",
        flex: 1,
      }}>
        <HighlightMatch text={category.label} query={query} />
      </span>
      <span style={{
        fontFamily: "var(--font-body)",
        fontSize: "13px",
        color: "var(--color-muted)",
        border: "1px solid var(--color-border)",
        padding: "3px 8px",
        flexShrink: 0,
      }}>
        Browse →
      </span>
    </Link>
  );
}

function ProductRow({ product, query, active, onHover, onClick }) {
  const image =
    product.images?.find((img) => img.is_primary)?.url ??
    product.images?.[0]?.url;

  return (
    <Link
      href={`/product/${product.slug}`}
      onClick={onClick}
      onMouseEnter={onHover}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "9px 16px",
        textDecoration: "none",
        background: active ? "var(--color-surface-raised)" : "transparent",
        transition: "background 120ms ease",
      }}
    >
      <div style={{
        width: "44px",
        height: "58px",
        flexShrink: 0,
        backgroundColor: "var(--color-gold-light)",
        overflow: "hidden",
      }}>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
          />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "15px",
          fontWeight: 500,
          color: "var(--color-foreground)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          marginBottom: "3px",
        }}>
          <HighlightMatch text={product.title} query={query} />
        </p>
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          color: "var(--color-muted)",
          marginBottom: "3px",
        }}>
          {CATEGORY_LABELS[product.category_slug] ?? product.category_slug}
        </p>
        <p style={{ fontFamily: "var(--font-heading)", fontSize: "15px", color: "var(--color-gold)" }}>
          {formatCurrency(product.base_price, "GBP")}
        </p>
      </div>
    </Link>
  );
}

// ── Main modal ─────────────────────────────────────────────────────────────

export default function SearchModal() {
  const { searchOpen, closeSearch } = useUiStore();
  const router = useRouter();
  const inputRef = useRef(null);

  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState([]);
  const [activeIdx, setActiveIdx] = useState(-1);

  const showSuggestions = query.trim().length >= 2;

  const { data: instantData, isFetching } = useInstantSearch(query);
  const { data: suggestionsData } = useSuggestions(query);

  const products = instantData?.results ?? [];
  const suggestions = suggestionsData?.queries ?? [];
  const categoryMatches = suggestionsData?.categories ?? [];

  // Flat navigable list for keyboard nav when suggestions are visible
  // Order: suggestions → category matches → products
  const navItems = showSuggestions
    ? [
        ...suggestions.map((s) => ({ type: "suggestion", value: s })),
        ...categoryMatches.map((c) => ({ type: "category", value: c })),
        ...products.map((p) => ({ type: "product", value: p })),
      ]
    : recent.map((s) => ({ type: "recent", value: s }));

  // Open: reset state + focus
  useEffect(() => {
    if (searchOpen) {
      setRecent(getRecent());
      setQuery("");
      setActiveIdx(-1);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  // Escape to close
  useEffect(() => {
    if (!searchOpen) return;
    const handler = (e) => { if (e.key === "Escape") closeSearch(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [searchOpen, closeSearch]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = searchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [searchOpen]);

  // Reset keyboard position when list changes
  useEffect(() => { setActiveIdx(-1); }, [navItems.length, query]);

  const navigateToSearch = useCallback((term) => {
    const q = (term ?? query).trim();
    if (!q) return;
    saveRecent(q);
    setRecent(getRecent());
    closeSearch();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }, [query, closeSearch, router]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, navItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0) {
        const item = navItems[activeIdx];
        if (item.type === "suggestion" || item.type === "recent") {
          setQuery(item.value);
          setActiveIdx(-1);
        } else if (item.type === "category") {
          closeSearch();
          router.push(`/shop/${item.value.slug}`);
        } else if (item.type === "product") {
          saveRecent(query.trim());
          closeSearch();
          router.push(`/product/${item.value.slug}`);
        }
      } else {
        navigateToSearch();
      }
    }
  };

  if (!searchOpen) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      display: "flex", flexDirection: "column", alignItems: "center",
      paddingTop: "72px",
    }}>
      {/* Backdrop */}
      <div
        onClick={closeSearch}
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0,
          backgroundColor: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "640px",
          margin: "0 1rem",
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "calc(100vh - 120px)",
          overflow: "hidden",
        }}
      >
        {/* ── Input ─────────────────────────────────────────── */}
        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          padding: "0 16px",
          borderBottom: "1px solid var(--color-border)",
          height: "58px", flexShrink: 0,
        }}>
          {isFetching && showSuggestions ? (
            <Loader2 size={17} style={{ color: "var(--color-gold)", flexShrink: 0, animation: "spin 0.8s linear infinite" }} />
          ) : (
            <Search size={17} style={{ color: "var(--color-muted)", flexShrink: 0 }} />
          )}
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search products, categories…"
            autoComplete="off"
            aria-label="Search"
            aria-autocomplete="list"
            style={{
              flex: 1, border: "none", outline: "none",
              background: "transparent",
              fontFamily: "var(--font-body)", fontSize: "16px",
              color: "var(--color-foreground)",
            }}
          />
          {query && (
            <button
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              aria-label="Clear search"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "4px", background: "none", border: "none",
                cursor: "pointer", color: "var(--color-muted)",
              }}
            >
              <X size={15} />
            </button>
          )}
          <kbd style={{
            fontFamily: "var(--font-body)", fontSize: "11px",
            color: "var(--color-muted)",
            border: "1px solid var(--color-border)",
            borderRadius: "3px", padding: "2px 6px", flexShrink: 0,
          }}>
            ESC
          </kbd>
        </div>

        {/* ── Body ──────────────────────────────────────────── */}
        <div style={{ overflowY: "auto", flex: 1 }}>

          {/* ── Idle state (< 2 chars) ── */}
          {!showSuggestions && (
            <>
              {/* Trending */}
              <SectionLabel>Trending</SectionLabel>
              {TRENDING.map((term, i) => (
                <SuggestionRow
                  key={term}
                  label={term}
                  query=""
                  icon={<TrendingUp size={13} />}
                  active={false}
                  onHover={() => {}}
                  onClick={() => navigateToSearch(term)}
                />
              ))}

              {/* Recent searches */}
              {recent.length > 0 && (
                <>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 16px 5px",
                  }}>
                    <p style={{
                      fontFamily: "var(--font-body)", fontSize: "12px",
                      letterSpacing: "0.12em", textTransform: "uppercase",
                      color: "var(--color-muted)", margin: 0,
                    }}>
                      Recent
                    </p>
                    <button
                      onClick={() => { clearRecent(); setRecent([]); }}
                      style={{
                        fontFamily: "var(--font-body)", fontSize: "13px",
                        color: "var(--color-muted)", background: "none",
                        border: "none", cursor: "pointer",
                      }}
                    >
                      Clear all
                    </button>
                  </div>
                  {recent.map((term, i) => (
                    <div
                      key={term}
                      style={{
                        display: "flex", alignItems: "center",
                        background: activeIdx === i ? "var(--color-surface-raised)" : "transparent",
                        transition: "background 120ms ease",
                      }}
                      onMouseEnter={() => setActiveIdx(i)}
                      onMouseLeave={() => setActiveIdx(-1)}
                    >
                      <button
                        onClick={() => setQuery(term)}
                        style={{
                          display: "flex", alignItems: "center", gap: "12px",
                          flex: 1, padding: "9px 16px",
                          background: "none", border: "none",
                          cursor: "pointer", textAlign: "left",
                        }}
                      >
                        <Clock size={13} style={{ color: "var(--color-subtle)", flexShrink: 0 }} />
                        <span style={{
                          fontFamily: "var(--font-body)", fontSize: "15px",
                          color: "var(--color-foreground)",
                        }}>
                          {term}
                        </span>
                      </button>
                      {/* Remove individual recent */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRecent(removeRecent(term));
                        }}
                        aria-label={`Remove "${term}" from recent searches`}
                        style={{
                          padding: "9px 14px",
                          background: "none", border: "none",
                          cursor: "pointer", color: "var(--color-subtle)",
                          display: "flex", alignItems: "center",
                        }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </>
          )}

          {/* ── Active search (≥ 2 chars) ── */}
          {showSuggestions && (
            <>
              {/* Autocomplete suggestions */}
              {suggestions.length > 0 && (
                <>
                  <SectionLabel>Suggestions</SectionLabel>
                  {suggestions.map((suggestion, i) => (
                    <SuggestionRow
                      key={suggestion}
                      label={suggestion}
                      query={query}
                      icon={<Search size={13} />}
                      active={activeIdx === i}
                      onHover={() => setActiveIdx(i)}
                      onClick={() => {
                        setQuery(suggestion);
                        setActiveIdx(-1);
                        inputRef.current?.focus();
                      }}
                    />
                  ))}
                </>
              )}

              {/* Category matches */}
              {categoryMatches.length > 0 && (
                <>
                  <SectionLabel>Categories</SectionLabel>
                  {categoryMatches.map((cat, i) => {
                    const idx = suggestions.length + i;
                    return (
                      <CategoryRow
                        key={cat.slug}
                        category={cat}
                        query={query}
                        active={activeIdx === idx}
                        onHover={() => setActiveIdx(idx)}
                      />
                    );
                  })}
                </>
              )}

              {/* Product results */}
              {products.length > 0 && (
                <>
                  <SectionLabel>Products</SectionLabel>
                  {products.map((product, i) => {
                    const idx = suggestions.length + categoryMatches.length + i;
                    return (
                      <ProductRow
                        key={product.id}
                        product={product}
                        query={query}
                        active={activeIdx === idx}
                        onHover={() => setActiveIdx(idx)}
                        onClick={() => {
                          saveRecent(query.trim());
                          closeSearch();
                        }}
                      />
                    );
                  })}
                </>
              )}

              {/* No results */}
              {!isFetching && suggestions.length === 0 && categoryMatches.length === 0 && products.length === 0 && (
                <div style={{ padding: "48px 24px", textAlign: "center" }}>
                  <p style={{
                    fontFamily: "var(--font-heading)", fontSize: "1.1rem",
                    color: "var(--color-foreground)", marginBottom: "8px",
                  }}>
                    No results for &ldquo;{query}&rdquo;
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--color-muted)" }}>
                    Try a different term or browse our collections.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Footer: See all results ── */}
        {showSuggestions && products.length > 0 && (
          <div style={{
            borderTop: "1px solid var(--color-border)",
            padding: "11px 16px", flexShrink: 0,
          }}>
            <button
              onClick={() => navigateToSearch()}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", background: "none", border: "none",
                cursor: "pointer", padding: 0,
              }}
            >
              <span style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--color-muted)" }}>
                See all results for{" "}
                <strong style={{ color: "var(--color-foreground)" }}>&ldquo;{query}&rdquo;</strong>
                {instantData?.total > products.length && (
                  <span style={{ color: "var(--color-gold)", marginLeft: "6px" }}>
                    ({instantData.total} total)
                  </span>
                )}
              </span>
              <ArrowRight size={14} style={{ color: "var(--color-gold)" }} />
            </button>
          </div>
        )}

        {/* ── Keyboard hint ── */}
        <div style={{
          borderTop: "1px solid var(--color-border)",
          padding: "7px 16px", display: "flex", gap: "16px", flexShrink: 0,
        }}>
          {[
            { keys: ["↑", "↓"], label: "navigate" },
            { keys: ["↵"], label: "select" },
            { keys: ["ESC"], label: "close" },
          ].map(({ keys, label }) => (
            <span key={label} style={{
              display: "flex", alignItems: "center", gap: "4px",
              fontFamily: "var(--font-body)", fontSize: "12px",
              color: "var(--color-muted)",
            }}>
              {keys.map((k) => (
                <kbd key={k} style={{
                  border: "1px solid var(--color-border)",
                  borderRadius: "3px", padding: "1px 5px", fontSize: "11px",
                }}>
                  {k}
                </kbd>
              ))}
              {label}
            </span>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
