"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import useCartStore, { selectSubtotal } from "@/store/cartStore";
import useUiStore from "@/store/uiStore";
import CartItem from "@/components/cart/CartItem";
import { formatCurrency } from "@/lib/utils";
import { calculateShipping } from "@/lib/shipping";

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const { currency } = useUiStore();
  const subtotal = useCartStore(selectSubtotal);

  // Default shipping estimate to US until address is provided
  const shippingEstimate = useMemo(() => calculateShipping("US"), []);
  const estimatedTotal = subtotal + shippingEstimate;

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="w-px h-16 bg-border mx-auto" />
        <ShoppingBag size={36} className="text-muted" />
        <h1 className="font-heading text-2xl text-foreground">Your cart is empty</h1>
        <p className="font-body text-sm text-muted max-w-xs">
          Explore our collections and find something you love.
        </p>
        <Link
          href="/shop"
          className="mt-4 px-10 py-4 font-body text-sm tracking-widest uppercase bg-gold text-foreground hover:bg-gold-dark transition-colors"
        >
          Shop Now
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-24">
      <div className="container">
        {/* Page header */}
        <div className="mb-12 md:mb-16">
          <p className="font-body text-[10px] tracking-[0.4em] uppercase text-muted mb-3">
            Your selection
          </p>
          <h1
            className="font-heading leading-none"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            Shopping Cart
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 xl:gap-20 items-start">
          {/* Items */}
          <section aria-label="Cart items">
            <ul className="divide-y divide-border border-t border-border">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  currency={currency}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </ul>

            <div className="mt-8 flex items-center gap-6">
              <Link
                href="/shop"
                className="font-body text-sm text-muted hover:text-foreground transition-colors tracking-wide flex items-center gap-2"
              >
                ← Continue Shopping
              </Link>
            </div>
          </section>

          {/* Order summary */}
          <aside
            className="border border-border p-8 space-y-5 lg:sticky lg:top-28"
            aria-label="Order summary"
          >
            <h2 className="font-heading text-lg text-foreground mb-2">Order Summary</h2>

            <div className="space-y-3 font-body text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="text-foreground">{formatCurrency(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Shipping (estimated)</span>
                <span className="text-foreground">{formatCurrency(shippingEstimate, currency)}</span>
              </div>
              <p className="text-[11px] text-muted leading-relaxed">
                Final shipping determined by your delivery address.
                Free shipping on US orders over $75.
              </p>
            </div>

            <div className="h-px bg-border" />

            <div className="flex justify-between items-baseline">
              <span className="font-body text-sm text-muted">Estimated total</span>
              <span className="font-heading text-xl text-foreground">
                {formatCurrency(estimatedTotal, currency)}
              </span>
            </div>

            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full py-4 font-body text-sm tracking-widest uppercase bg-gold text-foreground hover:bg-gold-dark transition-colors"
            >
              Proceed to Checkout
              <ArrowRight size={16} />
            </Link>

            {/* Trust signals */}
            <div className="space-y-2 pt-2">
              {["Secure checkout — SSL encrypted", "14-day hassle-free returns", "Worldwide delivery available"].map(
                (text) => (
                  <p key={text} className="font-body text-[11px] text-muted flex items-start gap-2">
                    <span className="text-gold mt-px">✓</span>
                    {text}
                  </p>
                )
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
