"use client";

import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { calculateShipping } from "@/lib/shipping";
import { calculateVAT } from "@/lib/vat";

export default function OrderSummaryPanel({ items, subtotal, countryCode = "US", currency = "USD" }) {
  const shipping = calculateShipping(countryCode, subtotal);
  const vat = calculateVAT(subtotal, countryCode);
  const total = subtotal + shipping + vat;

  return (
    <aside className="bg-surface-raised border border-border p-6 md:p-8 space-y-6">
      <h2 className="font-heading text-base text-foreground">Order Summary</h2>

      {/* Items */}
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3">
            <div className="relative w-14 shrink-0 aspect-3/4 bg-gold-light overflow-hidden">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="56px"
                  className="object-cover object-top"
                />
              ) : (
                <div className="w-full h-full bg-surface" />
              )}
              {/* Qty badge */}
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-foreground text-background font-body text-[11px] flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm text-foreground line-clamp-2 leading-snug">{item.title}</p>
              {(item.size || item.colour) && (
                <p className="font-body text-xs text-muted mt-0.5">
                  {[item.size, item.colour].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
            <span className="font-heading text-sm text-foreground shrink-0">
              {formatCurrency(item.price * item.quantity, currency)}
            </span>
          </li>
        ))}
      </ul>

      <div className="h-px bg-border" />

      {/* Totals */}
      <div className="space-y-2.5 font-body text-base">
        <div className="flex justify-between">
          <span className="text-muted">Subtotal</span>
          <span className="text-foreground">{formatCurrency(subtotal, currency)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Shipping</span>
          <span className="text-foreground">{formatCurrency(shipping, currency)}</span>
        </div>
        {/* VAT row removed — US store */}
      </div>

      <div className="h-px bg-border" />

      <div className="flex justify-between items-baseline">
        <span className="font-body text-sm text-muted">Total</span>
        <span className="font-heading text-xl text-foreground">{formatCurrency(total, currency)}</span>
      </div>
    </aside>
  );
}
