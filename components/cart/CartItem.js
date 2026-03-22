"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function CartItem({ item, currency, onUpdateQuantity, onRemove }) {
  return (
    <li className="flex gap-4 p-6">
      {/* Image */}
      <div className="relative w-20 shrink-0 aspect-[3/4] bg-gold-subtle overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="80px"
            className="object-cover object-top"
          />
        ) : (
          <div className="w-full h-full bg-surface-raised" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-body text-base text-foreground mb-1 line-clamp-2 leading-snug">
          {item.title}
        </p>
        {(item.size || item.colour) && (
          <p className="font-body text-sm text-muted mb-3">
            {[item.size, item.colour].filter(Boolean).join(" · ")}
          </p>
        )}
        <div className="flex items-center justify-between">
          {/* Qty stepper */}
          <div className="flex items-center border border-border">
            <button
              onClick={() => onUpdateQuantity(item.variantId, item.quantity - 1)}
              className="w-10 h-10 flex items-center justify-center text-xl text-muted hover:text-foreground transition-colors"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-10 text-center font-body text-base text-foreground">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.variantId, item.quantity + 1)}
              className="w-10 h-10 flex items-center justify-center text-xl text-muted hover:text-foreground transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <span className="font-heading text-base text-foreground">
            {formatCurrency(item.price * item.quantity, currency)}
          </span>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(item.variantId)}
        className="self-start p-1 -mr-1 mt-0.5 text-muted hover:text-foreground transition-colors"
        aria-label={`Remove ${item.title}`}
      >
        <X size={16} />
      </button>
    </li>
  );
}
