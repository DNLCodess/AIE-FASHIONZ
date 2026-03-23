"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useIsWishlisted, useToggleWishlist } from "@/hooks/useWishlist";

import useCartStore from "@/store/cartStore";
import useUiStore from "@/store/uiStore";

const NEW_CUTOFF = new Date(Date.now() - 1000 * 60 * 60 * 24 * 21);

/** Colour name → hex for swatch dots */
const COLOUR_HEX = {
  black:   "#1C1C1A",
  white:   "#FDFBF7",
  ivory:   "#F5F0E4",
  cream:   "#F5EDD6",
  gold:    "#D4AF37",
  red:     "#C0392B",
  burgundy:"#800020",
  blue:    "#2563EB",
  navy:    "#1E3A5F",
  green:   "#16A34A",
  pink:    "#EC4899",
  blush:   "#F2B8B0",
  nude:    "#D4A896",
  brown:   "#92400E",
  silver:  "#A8A9AD",
  grey:    "#9CA3AF",
  gray:    "#9CA3AF",
  purple:  "#7C3AED",
  orange:  "#EA580C",
  yellow:  "#FBBF24",
  multi:   "linear-gradient(135deg,#E74C3C,#F39C12,#2ECC71,#3498DB)",
};

const LIGHT_COLOURS = new Set(["white", "ivory", "cream", "blush", "nude", "yellow"]);

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [addState, setAddState] = useState("idle"); // idle | picking | adding | added
  const [selectedSize, setSelectedSize] = useState(null);
  const router = useRouter();
  const isWishlisted = useIsWishlisted(product.id);
  const { mutate: toggleWishlist } = useToggleWishlist();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUiStore((s) => s.openCart);
  const addToast = useUiStore((s) => s.addToast);

  const primaryImage = product.images?.[0];
  const secondaryImage = product.images?.[1];
  const isOnSale = product.compare_price && product.compare_price > product.base_price;
  const isLowStock = product.variants?.some((v) => v.stock_count > 0 && v.stock_count <= 3);
  const isNew = product.created_at && new Date(product.created_at) > NEW_CUTOFF;
  const isOutOfStock =
    product.variants?.length > 0 && product.variants.every((v) => v.stock_count === 0);

  const availableSizes =
    product.variants
      ?.filter((v) => v.stock_count > 0 && v.size)
      .map((v) => v.size)
      .filter((s, i, arr) => arr.indexOf(s) === i) ?? [];
  const needsSizePick = availableSizes.length > 1;

  /* Colour swatches — deduplicated, max 5 visible */
  const colours =
    product.variants
      ?.map((v) => v.colour)
      .filter(Boolean)
      .filter((c, i, arr) => arr.indexOf(c) === i) ?? [];
  const visibleColours = colours.slice(0, 5);
  const extraColours = colours.length - visibleColours.length;

  /* ── Handlers ─────────────────────────────────────────── */

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const willWishlist = !isWishlisted;
    toggleWishlist({ productId: product.id, remove: isWishlisted }, {
      onSuccess: () => {
        addToast({
          type: "wishlist",
          message: willWishlist ? "Saved to wishlist" : "Removed from wishlist",
        });
      },
      onError: (err) => {
        if (err.message?.includes("Sign in")) {
          router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        } else {
          addToast({ type: "error", message: "Could not update wishlist" });
        }
      },
    });
  };

  const handleQuickAddClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    if (needsSizePick) {
      setAddState("picking");
    } else {
      commitAdd(availableSizes[0] ?? null);
    }
  };

  const handleSizeClick = (e, size) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize(size);
    commitAdd(size);
  };

  const commitAdd = (size) => {
    setAddState("adding");
    const variant =
      product.variants?.find((v) => (!size || v.size === size) && v.stock_count > 0) ??
      product.variants?.[0];
    if (!variant) return;
    addItem(product, variant);
    addToast({ type: "cart", message: `${product.title} added to bag` });
    setAddState("added");
    setTimeout(() => {
      openCart();
      setAddState("idle");
      setSelectedSize(null);
    }, 900);
  };

  const handleCancelPick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAddState("idle");
    setSelectedSize(null);
  };

  /* ── Render ───────────────────────────────────────────── */

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/product/${product.slug}`} className="group block">

        {/* ── Image ──────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            aspectRatio: "3/4",
            overflow: "hidden",
            backgroundColor: "var(--color-gold-light)",
            marginBottom: "1rem",
          }}
        >
          {/* Gold top-edge accent — desktop hover only, no conflict with quick-add */}
          <div
            className="hidden md:block"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "2px",
              width: hovered && addState === "idle" ? "100%" : "0%",
              backgroundColor: "var(--color-gold)",
              transition: "width 420ms ease-out",
              zIndex: 6,
            }}
          />

          {/* Primary image */}
          {primaryImage && (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-top"
              style={{
                transform: hovered ? "scale(1.04)" : "scale(1)",
                opacity: hovered && secondaryImage ? 0 : 1,
                transition: "opacity 550ms ease, transform 700ms ease",
              }}
            />
          )}

          {/* Secondary image — crossfade on hover */}
          {secondaryImage && (
            <Image
              src={secondaryImage.url}
              alt={secondaryImage.alt || product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-top"
              style={{
                transform: hovered ? "scale(1.04)" : "scale(1.02)",
                opacity: hovered ? 1 : 0,
                transition: "opacity 550ms ease, transform 700ms ease",
              }}
            />
          )}

          {/* Sold out overlay */}
          {isOutOfStock && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(253,251,247,0.75)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                className="font-body"
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--color-muted)",
                }}
              >
                Sold Out
              </span>
            </div>
          )}

          {/* Badges — top left */}
          {!isOutOfStock && (
            <div
              style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                zIndex: 10,
              }}
            >
              {isOnSale && (
                <Badge text="Sale" bg="var(--color-foreground)" color="var(--color-background)" />
              )}
              {isNew && !isOnSale && (
                <Badge text="New" bg="var(--color-gold)" color="var(--color-foreground)" />
              )}
              {isLowStock && !isOnSale && !isNew && (
                <Badge text="Low Stock" bg="var(--color-foreground)" color="var(--color-background)" opacity={0.72} />
              )}
            </div>
          )}

          {/* Wishlist — always visible, top right */}
          <button
            type="button"
            onClick={handleHeartClick}
            aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 10,
              padding: "8px",
              backgroundColor: "rgba(253,251,247,0.9)",
              backdropFilter: "blur(6px)",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Heart
              size={16}
              style={{
                color: isWishlisted ? "var(--color-gold)" : "var(--color-foreground)",
                fill: isWishlisted ? "var(--color-gold)" : "none",
                transition: "color 200ms ease, fill 200ms ease",
              }}
            />
          </button>

          {/* Quick-add — desktop only (display:none on mobile) */}
          {!isOutOfStock && (
            <div
              className="hidden md:block"
              style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20 }}
            >
              {/* Size picker tray */}
              {addState === "picking" && (
                <div
                  onClick={(e) => e.preventDefault()}
                  style={{
                    backgroundColor: "rgba(253,251,247,0.98)",
                    backdropFilter: "blur(8px)",
                    padding: "12px 12px 14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <span
                      className="font-body"
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "var(--color-foreground)",
                      }}
                    >
                      Select size
                    </span>
                    <button
                      onClick={handleCancelPick}
                      aria-label="Cancel"
                      style={{ padding: "4px", background: "none", border: "none", cursor: "pointer", color: "var(--color-muted)" }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                    {availableSizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={(e) => handleSizeClick(e, sz)}
                        style={{
                          minWidth: "40px",
                          padding: "7px 10px",
                          fontSize: "12px",
                          fontFamily: "var(--font-body)",
                          fontWeight: 500,
                          color: selectedSize === sz ? "var(--color-background)" : "var(--color-foreground)",
                          backgroundColor: selectedSize === sz ? "var(--color-foreground)" : "transparent",
                          border: `1px solid ${selectedSize === sz ? "var(--color-foreground)" : "var(--color-border)"}`,
                          cursor: "pointer",
                          textAlign: "center",
                          transition: "all 120ms ease",
                        }}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Added confirmation */}
              {addState === "added" && (
                <div
                  style={{
                    backgroundColor: "var(--color-foreground)",
                    padding: "13px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <ShoppingBag size={14} style={{ color: "var(--color-gold)" }} />
                  <span
                    className="font-body"
                    style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", color: "var(--color-background)" }}
                  >
                    Added to bag
                  </span>
                </div>
              )}

              {/* Quick-add button — slides up on hover */}
              {addState === "idle" && (
                <button
                  onClick={handleQuickAddClick}
                  aria-label={`Quick add ${product.title}`}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "rgba(28,28,26,0.9)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    opacity: hovered ? 1 : 0,
                    transform: hovered ? "translateY(0)" : "translateY(6px)",
                    transition: "opacity 220ms ease, transform 220ms ease, background-color 150ms ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(28,28,26,1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(28,28,26,0.9)")}
                >
                  <ShoppingBag size={14} style={{ color: "var(--color-gold)" }} />
                  <span
                    className="font-body"
                    style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FDFBF7" }}
                  >
                    {needsSizePick ? "Select size" : "Add to bag"}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Product info ────────────────────────────────── */}
        <div>
          <h3
            className="font-body line-clamp-2"
            style={{
              fontSize: "15px",
              fontWeight: 500,
              lineHeight: 1.45,
              color: "var(--color-foreground)",
              marginBottom: "10px",
            }}
          >
            {product.title}
          </h3>

          {/* Colour swatches */}
          {visibleColours.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "10px" }}>
              {visibleColours.map((col) => {
                const key = col.toLowerCase();
                const hex = COLOUR_HEX[key];
                if (!hex) return null;
                const isGradient = hex.startsWith("linear");
                return (
                  <span
                    key={col}
                    title={col}
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "9999px",
                      backgroundColor: isGradient ? undefined : hex,
                      backgroundImage: isGradient ? hex : undefined,
                      border: LIGHT_COLOURS.has(key)
                        ? "1px solid var(--color-border)"
                        : "1.5px solid transparent",
                      flexShrink: 0,
                    }}
                  />
                );
              })}
              {extraColours > 0 && (
                <span
                  className="font-body"
                  style={{ fontSize: "11px", color: "var(--color-muted)", lineHeight: 1 }}
                >
                  +{extraColours}
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span
              className="font-heading"
              style={{ fontSize: "1.1rem", color: "var(--color-gold)" }}
            >
              {formatCurrency(product.base_price)}
            </span>
            {isOnSale && (
              <span
                className="font-body line-through"
                style={{ fontSize: "13px", color: "var(--color-subtle)" }}
              >
                {formatCurrency(product.compare_price)}
              </span>
            )}
          </div>
        </div>

      </Link>
    </article>
  );
}

function Badge({ text, bg, color, opacity = 1 }) {
  return (
    <span
      className="font-body uppercase"
      style={{
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.12em",
        padding: "4px 8px",
        backgroundColor: bg,
        color,
        opacity,
        display: "inline-block",
      }}
    >
      {text}
    </span>
  );
}
