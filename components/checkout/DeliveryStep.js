"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { getShippingOption } from "@/lib/shipping";

export default function DeliveryStep({ countryCode = "GB", currency = "GBP", onNext, onBack }) {
  const option = getShippingOption(countryCode);
  const [selected] = useState(option);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {/* Single option for now — extensible later */}
        <label className="flex items-start gap-4 border border-gold p-4 cursor-pointer">
          <input
            type="radio"
            name="shipping"
            checked
            readOnly
            className="mt-0.5 accent-gold"
          />
          <div className="flex-1">
            <p className="font-body text-sm text-foreground">{selected.label}</p>
          </div>
          <span className="font-heading text-sm text-foreground">
            {formatCurrency(selected.rate, currency)}
          </span>
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-4 font-body text-sm tracking-widest uppercase border border-border text-muted hover:text-foreground transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => onNext({ shippingOption: selected })}
          className="flex-[2] py-4 font-body text-sm tracking-widest uppercase bg-gold text-foreground hover:bg-gold-dark transition-colors"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}
