"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useIsWishlisted, useToggleWishlist } from "@/hooks/useWishlist";
import { createClient } from "@/lib/supabase/client";

const NEW_CUTOFF = new Date(Date.now() - 1000 * 60 * 60 * 24 * 21);

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const isWishlisted = useIsWishlisted(product.id);
  const { mutate: toggleWishlist } = useToggleWishlist();

  const handleHeartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    toggleWishlist(product.id);
  };

  const primaryImage = product.images?.[0];
  const secondaryImage = product.images?.[1];
  const isOnSale =
    product.compare_price && product.compare_price > product.base_price;
  const isLowStock = product.variants?.some(
    (v) => v.stock_count > 0 && v.stock_count <= 3,
  );
  const isNew =
    product.created_at && new Date(product.created_at) > NEW_CUTOFF;

  return (
    <article>
      <Link
        href={`/product/${product.slug}`}
        className="group block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Image container ── */}
        <div
          className="relative overflow-hidden mb-4"
          style={{
            aspectRatio: "3/4",
            backgroundColor: "var(--color-gold-light)",
          }}
        >
          {/* Primary image */}
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

          {/* Secondary hover image */}
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

          {/* ── Badges ── */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {isOnSale && (
              <span
                className="font-body uppercase tracking-widest px-2 py-0.5"
                style={{
                  fontSize: "9px",
                  backgroundColor: "var(--color-foreground)",
                  color: "var(--color-background)",
                  letterSpacing: "0.12em",
                }}
              >
                Sale
              </span>
            )}
            {isNew && !isOnSale && (
              <span
                className="font-body uppercase tracking-widest px-2 py-0.5"
                style={{
                  fontSize: "9px",
                  backgroundColor: "var(--color-gold)",
                  color: "var(--color-foreground)",
                  letterSpacing: "0.12em",
                }}
              >
                New
              </span>
            )}
            {isLowStock && !isOnSale && !isNew && (
              <span
                className="font-body uppercase tracking-widest px-2 py-0.5"
                style={{
                  fontSize: "9px",
                  backgroundColor: "var(--color-foreground)",
                  color: "var(--color-background)",
                  letterSpacing: "0.12em",
                  opacity: 0.75,
                }}
              >
                Low Stock
              </span>
            )}
          </div>

          {/* ── Wishlist button ── */}
          <button
            type="button"
            onClick={handleHeartClick}
            aria-label={
              isWishlisted
                ? `Remove ${product.title} from wishlist`
                : `Save ${product.title} to wishlist`
            }
            className="absolute top-3 right-3 z-10 transition-all duration-200"
            style={{
              padding: "8px",
              backgroundColor: "rgba(253,251,247,0.9)",
              backdropFilter: "blur(4px)",
              opacity: hovered || isWishlisted ? 1 : 0,
              transform:
                hovered || isWishlisted ? "translateY(0)" : "translateY(-4px)",
              transition:
                "opacity 250ms ease, transform 250ms ease, background-color 200ms ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--color-background)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(253,251,247,0.9)")
            }
          >
            <Heart
              size={13}
              style={{
                color: isWishlisted ? "var(--color-gold)" : "var(--color-muted)",
                fill: isWishlisted ? "var(--color-gold)" : "none",
                transition: "color 200ms ease, fill 200ms ease",
              }}
            />
          </button>

          {/* ── Bottom gold reveal bar ── */}
          <div
            className="absolute bottom-0 left-0 h-[2px] transition-all duration-500 ease-out"
            style={{
              width: hovered ? "100%" : "0%",
              backgroundColor: "var(--color-gold)",
            }}
          />
        </div>

        {/* ── Product info ── */}
        <div>
          {/* Category — subtle label */}
          {product.categories?.name && (
            <p
              className="font-body uppercase tracking-[0.2em] mb-1 truncate"
              style={{ fontSize: "9px", color: "var(--color-subtle)" }}
            >
              {product.categories.name}
            </p>
          )}

          {/* Title */}
          <h3
            className="font-body mb-2 line-clamp-2 leading-snug"
            style={{
              fontSize: "13px",
              color: "var(--color-foreground)",
              transition: "color 200ms ease",
            }}
          >
            {product.title}
          </h3>

          {/* Price row */}
          <div className="flex items-baseline gap-2">
            <span
              className="font-heading"
              style={{ fontSize: "1rem", color: "var(--color-gold)" }}
            >
              {formatCurrency(product.base_price)}
            </span>
            {isOnSale && (
              <span
                className="font-body line-through"
                style={{ fontSize: "12px", color: "var(--color-subtle)" }}
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
