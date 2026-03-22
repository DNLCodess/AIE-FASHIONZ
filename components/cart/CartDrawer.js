"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import useUiStore from "@/store/uiStore";
import useCartStore, { selectTotalItems, selectSubtotal } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";
import CartItem from "./CartItem";

export default function CartDrawer() {
  const { cartOpen, closeCart, currency } = useUiStore();
  const { items, removeItem, updateQuantity } = useCartStore();
  const totalItems = useCartStore(selectTotalItems);
  const subtotal = useCartStore(selectSubtotal);

  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen]);

  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && closeCart();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [closeCart]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          cartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-md flex flex-col bg-surface border-l border-border transition-transform duration-300 ease-in-out ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-border">
          <div className="flex items-center gap-2 text-muted">
            <ShoppingBag size={20} />
            <span className="font-body text-base tracking-wide text-foreground">
              Cart
              {totalItems > 0 && <span className="text-muted"> ({totalItems})</span>}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-2 -mr-2 text-muted hover:text-foreground transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
              <ShoppingBag size={40} className="text-subtle" />
              <p className="font-heading text-lg text-muted">Your cart is empty</p>
              <p className="font-body text-base text-subtle">
                Discover our collections and find something you love.
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="mt-2 px-8 py-3 font-body text-sm font-medium tracking-widest uppercase bg-gold text-foreground hover:bg-gold-dark transition-colors"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
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
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-6 space-y-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="font-body text-base text-muted">Subtotal</span>
              <span className="font-heading text-lg text-foreground">
                {formatCurrency(subtotal, currency)}
              </span>
            </div>
            <p className="font-body text-sm text-subtle">
              Shipping and taxes calculated at checkout.
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full py-4 text-center font-body text-sm font-medium tracking-widest uppercase bg-gold text-foreground hover:bg-gold-dark transition-colors"
            >
              Checkout
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="block w-full py-3 text-center font-body text-sm tracking-wide text-muted hover:text-foreground transition-colors"
            >
              View full cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
