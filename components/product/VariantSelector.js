"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/store/cartStore";
import useUiStore from "@/store/uiStore";
import { formatCurrency } from "@/lib/utils";

export default function VariantSelector({ product }) {
  const { variants } = product;
  const router = useRouter();
  const { addItem } = useCartStore();
  const { openCart } = useUiStore();

  // Derive unique sizes and colours
  const sizes = [...new Set(variants.map((v) => v.size))];
  const colours = [...new Set(variants.map((v) => v.colour))];
  const hasSizes = sizes.length > 1 || sizes[0] !== "One Size";
  const hasColours = colours.length > 1;

  const [selectedSize, setSelectedSize] = useState(hasSizes ? null : sizes[0]);
  const [selectedColour, setSelectedColour] = useState(hasColours ? null : colours[0]);
  const [added, setAdded] = useState(false);

  const selectedVariant = useMemo(
    () =>
      variants.find(
        (v) =>
          v.size === selectedSize &&
          v.colour === selectedColour
      ) ?? null,
    [variants, selectedSize, selectedColour]
  );

  const isOutOfStock = selectedVariant?.stock_count === 0;
  const isLowStock = selectedVariant?.stock_count > 0 && selectedVariant?.stock_count <= 3;
  const canAdd = selectedVariant && !isOutOfStock;

  const totalPrice = product.base_price + (selectedVariant?.additional_price ?? 0);

  function handleAddToCart() {
    if (!canAdd) return;
    addItem(product, selectedVariant, 1);
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="font-heading text-2xl text-gold">{formatCurrency(totalPrice)}</span>
        {product.compare_price && product.compare_price > product.base_price && (
          <span className="font-body text-sm text-subtle line-through">
            {formatCurrency(product.compare_price)}
          </span>
        )}
      </div>

      {/* Colour selector */}
      {hasColours && (
        <div>
          <p className="font-body text-sm text-muted mb-3">
            Colour{selectedColour ? <span className="text-foreground ml-2">{selectedColour}</span> : null}
          </p>
          <div className="flex flex-wrap gap-2">
            {colours.map((colour) => {
              const available = variants.some(
                (v) => v.colour === colour && v.stock_count > 0 && (!selectedSize || v.size === selectedSize)
              );
              return (
                <button
                  key={colour}
                  onClick={() => setSelectedColour(colour)}
                  disabled={!available}
                  className={`px-4 py-2 font-body text-sm border transition-colors ${
                    selectedColour === colour
                      ? "border-foreground bg-foreground text-background"
                      : available
                      ? "border-border text-muted hover:border-muted hover:text-foreground"
                      : "border-border text-subtle line-through cursor-not-allowed opacity-40"
                  }`}
                >
                  {colour}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size selector */}
      {hasSizes && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-body text-sm text-muted">
              Size{selectedSize ? <span className="text-foreground ml-2">{selectedSize}</span> : null}
            </p>
            <button className="font-body text-xs text-muted underline underline-offset-2 hover:text-foreground transition-colors">
              Size guide
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const available = variants.some(
                (v) => v.size === size && v.stock_count > 0 && (!selectedColour || v.colour === selectedColour)
              );
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  disabled={!available}
                  className={`min-w-[52px] px-3 py-2 font-body text-sm border transition-colors ${
                    selectedSize === size
                      ? "border-foreground bg-foreground text-background"
                      : available
                      ? "border-border text-muted hover:border-muted hover:text-foreground"
                      : "border-border text-subtle cursor-not-allowed opacity-40"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock status */}
      {selectedVariant && (
        <div>
          {isLowStock && (
            <p className="font-body text-xs text-error">Only {selectedVariant.stock_count} left in stock</p>
          )}
          {isOutOfStock && (
            <p className="font-body text-xs text-muted">Out of stock — check back soon</p>
          )}
        </div>
      )}

      {/* Add to cart */}
      <button
        onClick={handleAddToCart}
        disabled={!canAdd}
        className={`w-full py-4 font-body text-sm font-medium tracking-widest uppercase transition-colors ${
          canAdd
            ? added
              ? "bg-success text-background cursor-default"
              : "bg-gold text-foreground hover:bg-gold-dark"
            : "bg-surface-raised text-subtle cursor-not-allowed"
        }`}
      >
        {added ? "Added to Cart ✓" : isOutOfStock ? "Out of Stock" : !selectedVariant ? "Select Options" : "Add to Cart"}
      </button>
    </div>
  );
}
