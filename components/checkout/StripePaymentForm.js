"use client";

import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function StripePaymentForm({ onBack, orderId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setError(null);
    setProcessing(true);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?order_id=${orderId}`,
      },
    });

    // If here, an error occurred (successful payments redirect away)
    if (stripeError) {
      setError(stripeError.message ?? "An unexpected error occurred.");
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: "tabs",
          fields: { billingDetails: { address: { country: "never" } } },
        }}
      />

      {error && (
        <p className="font-body text-sm text-error">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={processing}
          className="flex-1 py-4 font-body text-sm tracking-widest uppercase border border-border text-muted hover:text-foreground transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-[2] py-4 font-body text-sm tracking-widest uppercase bg-gold text-foreground hover:bg-gold-dark transition-colors disabled:opacity-60"
        >
          {processing ? "Processing…" : "Pay Now"}
        </button>
      </div>

      <p className="font-body text-[11px] text-muted text-center">
        Your payment is secured by Stripe. We never store card details.
      </p>
    </form>
  );
}
