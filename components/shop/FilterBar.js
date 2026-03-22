"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  LayoutGrid,
  AlignJustify,
  Tag,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

/* ── Data ─────────────────────────────────────────────────── */

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "luxury-fabrics", label: "Fabrics" },
  { value: "bags-shoes", label: "Bags & Shoes" },
  { value: "jewellery", label: "Jewellery" },
  { value: "party-dinner-wear", label: "Party Wear" },
  { value: "childrens-wear", label: "Children's" },
  { value: "body-shapers", label: "Body Shapers" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "popular", label: "Most popular" },
];

const COLOUR_OPTIONS = [
  { value: "black", label: "Black", hex: "#1C1C1A" },
  { value: "white", label: "White", hex: "#FDFBF7" },
  { value: "gold", label: "Gold", hex: "#D4AF37" },
  { value: "red", label: "Red", hex: "#C0392B" },
  { value: "blue", label: "Blue", hex: "#2563EB" },
  { value: "green", label: "Green", hex: "#16A34A" },
  { value: "pink", label: "Pink", hex: "#EC4899" },
  { value: "nude", label: "Nude", hex: "#D4A896" },
  { value: "brown", label: "Brown", hex: "#92400E" },
  {
    value: "multi",
    label: "Multi",
    hex: "linear-gradient(135deg,#E74C3C,#F39C12,#2ECC71,#3498DB)",
  },
];

const SIZE_OPTIONS = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "6",
  "8",
  "10",
  "12",
  "14",
  "16",
];

export const PRICE_RANGES = [
  { value: "under-50", label: "Under £50", min: 0, max: 4999 },
  { value: "50-150", label: "£50 – £150", min: 5000, max: 14999 },
  { value: "150-300", label: "£150 – £300", min: 15000, max: 29999 },
  { value: "over-300", label: "£300+", min: 30000, max: Infinity },
];

/* ── Hook: sync grid density preference ──────────────────── */
export function useGridDensity() {
  const [density, setDensity] = useState(() => {
    if (typeof window === "undefined") return "comfortable";
    return localStorage.getItem("aie-grid-density") || "comfortable";
  });
  const toggle = () => {
    const next = density === "comfortable" ? "compact" : "comfortable";
    setDensity(next);
    localStorage.setItem("aie-grid-density", next);
  };
  return [density, toggle];
}

/* ── FilterBar ─────────────────────────────────────────────── */

export default function FilterBar({ totalCount }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [density, toggleDensity] = useGridDensity();
  const panelRef = useRef(null);
  const sortRef = useRef(null);

  const currentSort = searchParams.get("sort") || "newest";
  const currentColour = searchParams.get("colour") || "";
  const currentSize = searchParams.get("size") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentPrice = searchParams.get("price") || "";
  const currentOnSale = searchParams.get("onSale") || "";
  const currentInStock = searchParams.get("inStock") || "";
  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === currentSort)?.label ?? "Newest first";

  const activeFilterCount = [
    currentColour,
    currentSize,
    currentPrice,
    currentOnSale,
    currentInStock,
  ].filter(Boolean).length;

  function setParam(key, value) {
    const params = new URLSearchParams(searchParams);
    if (value && !(key === "sort" && value === "newest")) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function toggleParam(key) {
    const params = new URLSearchParams(searchParams);
    if (params.get(key)) {
      params.delete(key);
    } else {
      params.set(key, "1");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function clearAll() {
    router.push(pathname, { scroll: false });
  }

  // Close panels on outside click
  useEffect(() => {
    function handler(e) {
      if (panelRef.current && !panelRef.current.contains(e.target))
        setFilterOpen(false);
      if (sortRef.current && !sortRef.current.contains(e.target))
        setSortOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {/* ── Main bar ──────────────────────────────────────── */}
      <div
        style={{
          position: "sticky",
          top: "68px",
          zIndex: 30,
          backgroundColor: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "56px",
              gap: "0.5rem",
            }}
          >
            {/* ── Category pills — desktop ─────────────────── */}
            <div
              className="hidden md:flex"
              style={{
                alignItems: "center",
                gap: "0.35rem",
                flex: 1,
                overflowX: "auto",
                scrollbarWidth: "none",
              }}
            >
              {CATEGORIES.map((cat) => (
                <CategoryPill
                  key={cat.value}
                  cat={cat}
                  active={currentCategory === cat.value}
                  onClick={() => setParam("category", cat.value)}
                />
              ))}
            </div>

            {/* ── Right controls ───────────────────────────── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginLeft: "auto",
                flexShrink: 0,
              }}
            >
              {/* Active filter count badge */}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAll}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    padding: "6px 12px",
                    fontSize: "13px",
                    fontFamily: "var(--font-body)",
                    color: "var(--color-foreground)",
                    backgroundColor: "var(--color-gold-light)",
                    border: "1px solid var(--color-gold)",
                    cursor: "pointer",
                  }}
                >
                  {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
                  <X size={11} />
                </button>
              )}

              {/* Filter toggle button */}
              <div ref={panelRef} style={{ position: "relative" }}>
                <button
                  onClick={() => {
                    setFilterOpen((o) => !o);
                    setSortOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "8px 14px",
                    fontSize: "13px",
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                    color: filterOpen
                      ? "var(--color-foreground)"
                      : "var(--color-muted)",
                    backgroundColor: filterOpen
                      ? "var(--color-surface-raised)"
                      : "transparent",
                    border: "1px solid var(--color-border)",
                    cursor: "pointer",
                    transition: "all 200ms ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  <SlidersHorizontal size={13} />
                  Filter
                  {activeFilterCount > 0 && (
                    <span
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "9999px",
                        backgroundColor: "var(--color-gold)",
                        color: "var(--color-foreground)",
                        fontSize: "11px",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Filter dropdown panel */}
                {filterOpen && (
                  <FilterPanel
                    currentColour={currentColour}
                    currentSize={currentSize}
                    currentPrice={currentPrice}
                    currentOnSale={currentOnSale}
                    currentInStock={currentInStock}
                    setParam={setParam}
                    toggleParam={toggleParam}
                    clearAll={clearAll}
                    onClose={() => setFilterOpen(false)}
                    activeFilterCount={activeFilterCount}
                  />
                )}
              </div>

              {/* Sort dropdown */}
              <div ref={sortRef} style={{ position: "relative" }}>
                <button
                  onClick={() => {
                    setSortOpen((o) => !o);
                    setFilterOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "8px 14px",
                    fontSize: "13px",
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                    color: "var(--color-muted)",
                    backgroundColor: "transparent",
                    border: "1px solid var(--color-border)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {currentSortLabel}
                  <ChevronDown
                    size={12}
                    style={{
                      transition: "transform 200ms ease",
                      transform: sortOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>

                {sortOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 4px)",
                      zIndex: 50,
                      width: "200px",
                      backgroundColor: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    }}
                  >
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setParam("sort", option.value);
                          setSortOpen(false);
                        }}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "12px 16px",
                          fontSize: "14px",
                          fontFamily: "var(--font-body)",
                          color:
                            currentSort === option.value
                              ? "var(--color-foreground)"
                              : "var(--color-muted)",
                          backgroundColor:
                            currentSort === option.value
                              ? "var(--color-surface-raised)"
                              : "transparent",
                          border: "none",
                          cursor: "pointer",
                          borderLeft:
                            currentSort === option.value
                              ? "2px solid var(--color-gold)"
                              : "2px solid transparent",
                          transition: "all 150ms ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "var(--color-surface-raised)";
                          e.currentTarget.style.color =
                            "var(--color-foreground)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            currentSort === option.value
                              ? "var(--color-surface-raised)"
                              : "transparent";
                          e.currentTarget.style.color =
                            currentSort === option.value
                              ? "var(--color-foreground)"
                              : "var(--color-muted)";
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Grid density toggle — desktop only */}
              <button
                onClick={toggleDensity}
                title={
                  density === "comfortable"
                    ? "Compact view"
                    : "Comfortable view"
                }
                className="hidden md:flex"
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "6px 10px",
                  color: "var(--color-muted)",
                  backgroundColor: "transparent",
                  border: "1px solid var(--color-border)",
                  cursor: "pointer",
                  transition: "color 200ms ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-foreground)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--color-muted)")
                }
              >
                {density === "comfortable" ? (
                  <LayoutGrid size={14} />
                ) : (
                  <AlignJustify size={14} />
                )}
              </button>
            </div>
          </div>

          {/* ── Category pills — mobile scroll strip ──────────
              Uses flex + md:hidden via className only.
              No inline display style — avoids overriding Tailwind. */}
          <div
            className="flex md:hidden"
            style={{
              gap: "0.35rem",
              overflowX: "auto",
              paddingBottom: "10px",
              scrollbarWidth: "none",
            }}
          >
            {CATEGORIES.map((cat) => (
              <CategoryPill
                key={cat.value}
                cat={cat}
                active={currentCategory === cat.value}
                onClick={() => setParam("category", cat.value)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Category pill ─────────────────────────────────────────── */

function CategoryPill({ cat, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        padding: "7px 14px",
        fontSize: "13px",
        fontFamily: "var(--font-body)",
        fontWeight: active ? 500 : 400,
        letterSpacing: "0.03em",
        whiteSpace: "nowrap",
        color: active ? "var(--color-background)" : "var(--color-muted)",
        backgroundColor: active ? "var(--color-foreground)" : "transparent",
        border: `1px solid ${active ? "var(--color-foreground)" : "var(--color-border)"}`,
        cursor: "pointer",
        transition: "all 200ms ease",
      }}
    >
      {cat.label}
    </button>
  );
}

/* ── Filter panel (dropdown) ──────────────────────────────── */

function FilterPanel({
  currentColour,
  currentSize,
  currentPrice,
  currentOnSale,
  currentInStock,
  setParam,
  toggleParam,
  clearAll,
  onClose,
  activeFilterCount,
}) {
  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: "calc(100% + 4px)",
        zIndex: 50,
        width: "360px",
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.1)",
        padding: "1.5rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.25rem",
        }}
      >
        <span
          className="font-body"
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: "var(--color-foreground)",
            letterSpacing: "0.05em",
          }}
        >
          FILTER
        </span>
        {activeFilterCount > 0 && (
          <button
            onClick={() => {
              clearAll();
              onClose();
            }}
            style={{
              fontSize: "13px",
              fontFamily: "var(--font-body)",
              color: "var(--color-muted)",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* ── Quick toggles: On Sale + In Stock ─────────────── */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem" }}>
        <ToggleChip
          active={!!currentOnSale}
          onClick={() => toggleParam("onSale")}
          icon={<Tag size={11} />}
          label="On Sale"
        />
        <ToggleChip
          active={!!currentInStock}
          onClick={() => toggleParam("inStock")}
          icon={<CheckCircle size={11} />}
          label="In Stock"
        />
      </div>

      {/* ── Price range ───────────────────────────────────── */}
      <div style={{ marginBottom: "1.5rem" }}>
        <p
          className="font-body"
          style={{
            fontSize: "13px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            marginBottom: "0.75rem",
          }}
        >
          Price
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {PRICE_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() =>
                setParam(
                  "price",
                  currentPrice === range.value ? "" : range.value
                )
              }
              aria-pressed={currentPrice === range.value}
              style={{
                padding: "8px 14px",
                fontSize: "13px",
                fontFamily: "var(--font-body)",
                color:
                  currentPrice === range.value
                    ? "var(--color-background)"
                    : "var(--color-muted)",
                backgroundColor:
                  currentPrice === range.value
                    ? "var(--color-gold)"
                    : "transparent",
                border: `1px solid ${currentPrice === range.value ? "var(--color-gold)" : "var(--color-border)"}`,
                cursor: "pointer",
                transition: "all 200ms ease",
                whiteSpace: "nowrap",
              }}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Colour swatches ───────────────────────────────── */}
      <div style={{ marginBottom: "1.5rem" }}>
        <p
          className="font-body"
          style={{
            fontSize: "13px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            marginBottom: "0.75rem",
          }}
        >
          Colour
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {COLOUR_OPTIONS.map((col) => (
            <button
              key={col.value}
              onClick={() =>
                setParam("colour", currentColour === col.value ? "" : col.value)
              }
              title={col.label}
              aria-label={col.label}
              aria-pressed={currentColour === col.value}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "9999px",
                backgroundColor: col.hex.startsWith("linear")
                  ? undefined
                  : col.hex,
                backgroundImage: col.hex.startsWith("linear")
                  ? col.hex
                  : undefined,
                border:
                  currentColour === col.value
                    ? "2px solid var(--color-gold)"
                    : col.value === "white"
                      ? "1px solid var(--color-border)"
                      : "2px solid transparent",
                cursor: "pointer",
                transform:
                  currentColour === col.value ? "scale(1.2)" : "scale(1)",
                transition: "transform 200ms ease, border-color 200ms ease",
                outline:
                  currentColour === col.value
                    ? "2px solid var(--color-gold-light)"
                    : "none",
                outlineOffset: "2px",
              }}
            />
          ))}
        </div>
        {currentColour && (
          <p
            className="font-body"
            style={{
              fontSize: "13px",
              color: "var(--color-muted)",
              marginTop: "0.5rem",
            }}
          >
            {COLOUR_OPTIONS.find((c) => c.value === currentColour)?.label}
            <button
              onClick={() => setParam("colour", "")}
              style={{
                marginLeft: "6px",
                color: "var(--color-muted)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              ×
            </button>
          </p>
        )}
      </div>

      {/* ── Size pills ────────────────────────────────────── */}
      <div>
        <p
          className="font-body"
          style={{
            fontSize: "13px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            marginBottom: "0.75rem",
          }}
        >
          Size
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {SIZE_OPTIONS.map((sz) => (
            <button
              key={sz}
              onClick={() => setParam("size", currentSize === sz ? "" : sz)}
              aria-pressed={currentSize === sz}
              style={{
                minWidth: "44px",
                padding: "8px 12px",
                fontSize: "13px",
                fontFamily: "var(--font-body)",
                color:
                  currentSize === sz
                    ? "var(--color-background)"
                    : "var(--color-muted)",
                backgroundColor:
                  currentSize === sz
                    ? "var(--color-foreground)"
                    : "transparent",
                border: `1px solid ${currentSize === sz ? "var(--color-foreground)" : "var(--color-border)"}`,
                cursor: "pointer",
                transition: "all 200ms ease",
                textAlign: "center",
              }}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Apply / close */}
      <button
        onClick={onClose}
        style={{
          width: "100%",
          marginTop: "1.5rem",
          padding: "14px",
          fontSize: "14px",
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--color-background)",
          backgroundColor: "var(--color-foreground)",
          border: "none",
          cursor: "pointer",
          transition: "background-color 200ms ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--color-gold)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--color-foreground)")
        }
      >
        Done
      </button>
    </div>
  );
}

/* ── Toggle chip (On Sale / In Stock) ─────────────────────── */

function ToggleChip({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        padding: "8px 14px",
        fontSize: "13px",
        fontFamily: "var(--font-body)",
        fontWeight: active ? 500 : 400,
        color: active ? "var(--color-background)" : "var(--color-muted)",
        backgroundColor: active ? "var(--color-foreground)" : "transparent",
        border: `1px solid ${active ? "var(--color-foreground)" : "var(--color-border)"}`,
        cursor: "pointer",
        transition: "all 200ms ease",
        whiteSpace: "nowrap",
      }}
    >
      {icon}
      {label}
    </button>
  );
}
