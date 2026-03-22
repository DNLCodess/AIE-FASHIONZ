"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import useCartStore from "@/store/cartStore";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const clearCart = useCartStore((s) => s.clearCart);

  // Clear cart on mount — payment was successful
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md w-full space-y-8">
        {/* Decorative motif */}
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="h-px flex-1 max-w-16 bg-border" />
          <span className="text-gold text-lg">◆</span>
          <div className="h-px flex-1 max-w-16 bg-border" />
        </div>

        {/* Icon */}
        <div className="w-14 h-14 rounded-full border border-gold flex items-center justify-center mx-auto">
          <span className="text-gold text-xl">✓</span>
        </div>

        <div className="space-y-3">
          <p className="font-body text-[10px] tracking-[0.4em] uppercase text-muted">
            Order confirmed
          </p>
          <h1
            className="font-heading leading-tight text-foreground"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
          >
            Thank you for your order
          </h1>
          <p className="font-body text-sm text-muted leading-relaxed">
            A confirmation email is on its way to you. We&apos;ll notify you when your order ships.
          </p>
        </div>

        {orderId && (
          <div className="border border-border px-6 py-4">
            <p className="font-body text-xs text-muted tracking-wide">Order reference</p>
            <p className="font-heading text-sm text-foreground mt-1">{orderId}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/shop"
            className="px-8 py-4 font-body text-sm tracking-widest uppercase bg-gold text-foreground hover:bg-gold-dark transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/account"
            className="px-8 py-4 font-body text-sm tracking-widest uppercase border border-border text-muted hover:text-foreground transition-colors"
          >
            My Account
          </Link>
        </div>

        {/* Trust */}
        <p className="font-body text-xs text-muted">
          14-day hassle-free returns · Worldwide delivery
        </p>
      </div>
    </main>
  );
}
