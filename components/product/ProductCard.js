"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useIsWishlisted, useToggleWishlist } from "@/hooks/useWishlist";
import { createClient } from "@/lib/supabase/client";
import useCartStore from "@/store/cartStore";
import useUiStore from "@/store/uiStore";

const NEW_CUTOFF = new Date(Date.now() - 1000 * 60 * 60 * 24 * 21);

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [addState, setAddState] = useState("idle"); // idle | picking | adding | added
  const [selectedSize, setSelectedSize] = useState(null);
  const router = useRouter();
  const isWishlisted = useIsWishlisted(product.id);
  const { mutate: toggleWishlist } = useToggleWishlist();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUiStore((s) => s.openCart);

  const primaryImage = product.images?.[0];
  const secondaryImage = product.images?.[1];
  const isOnSale =
    product.compare_price && product.compare_price > product.base_price;
  const isLowStock = product.variants?.some(
    (v) => v.stock_count > 0 && v.stock_count <= 3,
  );
  const isNew = product.created_at && new Date(product.created_at) > NEW_CUTOFF;
  const isOutOfStock =
    product.variants?.length > 0 &&
    product.variants.every((v) => v.stock_count === 0);

  const availableSizes =
    product.variants
      ?.filter((v) => v.stock_count > 0 && v.size)
      .map((v) => v.size)
      .filter((s, i, arr) => arr.indexOf(s) === i) ?? [];

  const needsSizePick = availableSizes.length > 1;

  async function handleHeartClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push(
        `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`,
      );
      return;
    }
    toggleWishlist(product.id);
  }

  function handleQuickAddClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    if (needsSizePick) {
      setAddState("picking");
    } else {
      commitAdd(availableSizes[0] ?? null);
    }
  }

  function handleSizeClick(e, size) {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize(size);
    commitAdd(size);
  }

  function commitAdd(size) {
    setAddState("adding");
    const variant =
      product.variants?.find(
        (v) => (!size || v.size === size) && v.stock_count > 0,
      ) ?? product.variants?.[0];
    if (!variant) return;
    addItem(product, variant);
    setAddState("added");
    setTimeout(() => {
      openCart();
      setAddState("idle");
      setSelectedSize(null);
    }, 900);
  }

  function handleCancelPick(e) {
    e.preventDefault();
    e.stopPropagation();
    setAddState("idle");
    setSelectedSize(null);
  }

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/product/${product.slug}`} className="group block">
        {/* Image container */}
        <div
          style={{
            position: "relative",
            aspectRatio: "3/4",
            overflow: "hidden",
            backgroundColor: "var(--color-gold-light)",
            marginBottom: "0.875rem",
          }}
        >
          {primaryImage && (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-top"
              style={{
                transform: hovered ? "scale(1.05)" : "scale(1)",
                opacity: hovered && secondaryImage ? 0 : 1,
                transition: "opacity 600ms ease, transform 700ms ease",
              }}
            />
          )}

          {secondaryImage && (
            <Image
              src={secondaryImage.url}
              alt={secondaryImage.alt || product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-top"
              style={{
                transform: hovered ? "scale(1.05)" : "scale(1.02)",
                opacity: hovered ? 1 : 0,
                transition: "opacity 600ms ease, transform 700ms ease",
              }}
            />
          )}

          {/* Sold out overlay */}
          {isOutOfStock && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(253,251,247,0.7)",
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
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--color-text-secondary)",
                }}
              >
                Sold Out
              </span>
            </div>
          )}

          {/* Badges */}
          {!isOutOfStock && (
            <div
              style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                zIndex: 10,
              }}
            >
              {isOnSale && (
                <Badge
                  text="Sale"
                  bg="var(--color-foreground)"
                  color="var(--color-background)"
                />
              )}
              {isNew && !isOnSale && (
                <Badge
                  text="New"
                  bg="var(--color-gold)"
                  color="var(--color-foreground)"
                />
              )}
              {isLowStock && !isOnSale && !isNew && (
                <Badge
                  text="Low Stock"
                  bg="var(--color-foreground)"
                  color="var(--color-background)"
                  opacity={0.75}
                />
              )}
            </div>
          )}

          {/* Wishlist */}
          <button
            type="button"
            onClick={handleHeartClick}
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Save to wishlist"
            }
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 10,
              padding: "7px",
              backgroundColor: "rgba(253,251,247,0.92)",
              backdropFilter: "blur(4px)",
              border: "none",
              cursor: "pointer",
              opacity: hovered || isWishlisted ? 1 : 0,
              transform:
                hovered || isWishlisted ? "translateY(0)" : "translateY(-4px)",
              transition: "opacity 250ms ease, transform 250ms ease",
            }}
          >
            <Heart
              size={13}
              style={{
                color: isWishlisted
                  ? "var(--color-gold)"
                  : "var(--color-muted)",
                fill: isWishlisted ? "var(--color-gold)" : "none",
                transition: "color 200ms ease, fill 200ms ease",
              }}
            />
          </button>

          {/* Quick-add actions */}
          {!isOutOfStock && (
            <>
              {/* Size picker tray */}
              {addState === "picking" && (
                <div
                  onClick={(e) => e.preventDefault()}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 20,
                    backgroundColor: "rgba(253,251,247,0.97)",
                    backdropFilter: "blur(8px)",
                    padding: "12px 12px 14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <span
                      className="font-body"
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--color-foreground)",
                      }}
                    >
                      Select size
                    </span>
                    <button
                      onClick={handleCancelPick}
                      style={{
                        padding: "2px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--color-muted)",
                      }}
                      aria-label="Cancel"
                    >
                      <X size={13} />
                    </button>
                  </div>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}
                  >
                    {availableSizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={(e) => handleSizeClick(e, sz)}
                        style={{
                          minWidth: "36px",
                          padding: "6px 10px",
                          fontSize: "12px",
                          fontFamily: "var(--font-body)",
                          fontWeight: selectedSize === sz ? 600 : 500,
                          color:
                            selectedSize === sz
                              ? "var(--color-background)"
                              : "var(--color-foreground)",
                          backgroundColor:
                            selectedSize === sz
                              ? "var(--color-foreground)"
                              : "transparent",
                          border: `1px solid ${selectedSize === sz ? "var(--color-foreground)" : "var(--color-border)"}`,
                          cursor: "pointer",
                          textAlign: "center",
                          transition: "all 150ms ease",
                        }}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                  <p
                    className="font-body"
                    style={{
                      fontSize: "11px",
                      fontWeight: 500,
                      color: "var(--color-text-secondary)",
                      marginTop: "7px",
                    }}
                  >
                    <Link
                      href={`/product/${product.slug}`}
                      style={{
                        color: "var(--color-muted)",
                        textDecoration: "underline",
                        textUnderlineOffset: "3px",
                      }}
                    >
                      Full details & size guide →
                    </Link>
                  </p>
                </div>
              )}

              {/* Added confirmation */}
              {addState === "added" && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 20,
                    backgroundColor: "var(--color-foreground)",
                    padding: "14px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <ShoppingBag
                    size={13}
                    style={{ color: "var(--color-gold)" }}
                  />
                  <span
                    className="font-body"
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "var(--color-background)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Added to bag
                  </span>
                </div>
              )}

              {/* Quick-add button — always visible on mobile, hover on desktop */}
              {addState === "idle" && (
                <button
                  onClick={handleQuickAddClick}
                  aria-label={`Quick add ${product.title}`}
                  className="md:opacity-0 md:group-hover:opacity-100"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 15,
                    padding: "12px",
                    backgroundColor: "rgba(28,28,26,0.88)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "7px",
                    transition:
                      "background-color 200ms ease, opacity 250ms ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(28,28,26,0.97)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(28,28,26,0.88)")
                  }
                >
                  <ShoppingBag
                    size={13}
                    style={{ color: "var(--color-gold)" }}
                  />
                  <span
                    className="font-body"
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#FDFBF7",
                    }}
                  >
                    {needsSizePick ? "Select size" : "Add to bag"}
                  </span>
                </button>
              )}
            </>
          )}

          {/* Gold reveal bar */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: "2px",
              width: hovered && addState === "idle" ? "100%" : "0%",
              backgroundColor: "var(--color-gold)",
              transition: "width 500ms ease-out",
              zIndex: 5,
            }}
          />
        </div>

        {/* Product info */}
        <div>
          {product.categories?.name && (
            <p
              className="font-body uppercase truncate"
              style={{
                fontSize: "10px",
                letterSpacing: "0.18em",
                fontWeight: 600,
                color: "var(--color-text-secondary)",
                marginBottom: "5px",
              }}
            >
              {product.categories.name}
            </p>
          )}

          <h3
            className="font-body line-clamp-2 leading-snug"
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--color-foreground)",
              marginBottom: "7px",
            }}
          >
            {product.title}
          </h3>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.5rem",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "baseline", gap: "8px" }}
            >
              <span
                className="font-heading"
                style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--color-gold)" }}
              >
                {formatCurrency(product.base_price)}
              </span>
              {isOnSale && (
                <span
                  className="font-body line-through"
                  style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}
                >
                  {formatCurrency(product.compare_price)}
                </span>
              )}
            </div>
            {availableSizes.length > 0 && availableSizes.length <= 5 && (
              <div
                className="hidden md:flex"
                style={{ alignItems: "center", gap: "4px" }}
              >
                {availableSizes.map((sz) => (
                  <span
                    key={sz}
                    className="font-body"
                    style={{ fontSize: "10px", fontWeight: 500, color: "var(--color-text-secondary)" }}
                  >
                    {sz}
                  </span>
                ))}
              </div>
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
        letterSpacing: "0.1em",
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
