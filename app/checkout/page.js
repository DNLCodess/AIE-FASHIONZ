"use client";

import { useState, useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Link from "next/link";
import useCartStore, { selectSubtotal } from "@/store/cartStore";
import useUiStore from "@/store/uiStore";
import StepIndicator from "@/components/checkout/StepIndicator";
import ContactStep from "@/components/checkout/ContactStep";
import AddressStep from "@/components/checkout/AddressStep";
import DeliveryStep from "@/components/checkout/DeliveryStep";
import StripePaymentForm from "@/components/checkout/StripePaymentForm";
import OrderSummaryPanel from "@/components/checkout/OrderSummaryPanel";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
  const { items } = useCartStore();
  const { currency } = useUiStore();
  const subtotal = useCartStore(selectSubtotal);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [clientSecret, setClientSecret] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);

  const countryCode = formData.address?.country ?? "GB";

  // ── Step handlers ──────────────────────────────────────────
  const handleContact = (data) => {
    setFormData((prev) => ({ ...prev, contact: data }));
    setStep(2);
  };

  const handleAddress = (data) => {
    setFormData((prev) => ({ ...prev, address: data }));
    setStep(3);
  };

  const handleDelivery = async (data) => {
    setFormData((prev) => ({ ...prev, delivery: data }));
    setApiError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          contact: formData.contact,
          address: formData.address,
          delivery: data,
          currency,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setApiError(json.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      if (json.provider === "stripe") {
        setClientSecret(json.clientSecret);
        setOrderId(json.orderId);
        setStep(4);
      } else if (json.provider === "paystack") {
        // Redirect to Paystack hosted page
        window.location.href = json.authorizationUrl;
      }
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Empty cart guard ───────────────────────────────────────
  if (items.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-heading text-xl text-foreground">Your cart is empty</p>
        <Link href="/shop" className="font-body text-sm text-muted hover:text-foreground transition-colors">
          ← Back to shop
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-24">
      <div className="container">
        {/* Header */}
        <div className="mb-10 md:mb-14">
          <Link
            href="/cart"
            className="font-body text-xs text-muted hover:text-foreground transition-colors tracking-wide"
          >
            ← Cart
          </Link>
          <h1
            className="font-heading leading-none mt-4"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
          >
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 xl:gap-20 items-start">
          {/* Left — steps */}
          <div className="space-y-10">
            <StepIndicator currentStep={step} />

            {apiError && (
              <div className="border border-error p-4">
                <p className="font-body text-sm text-error">{apiError}</p>
              </div>
            )}

            {step === 1 && (
              <section>
                <StepHeading>Contact information</StepHeading>
                <ContactStep defaultValues={formData.contact} onNext={handleContact} />
              </section>
            )}

            {step === 2 && (
              <section>
                <StepHeading>Delivery address</StepHeading>
                <AddressStep
                  defaultValues={formData.address}
                  onNext={handleAddress}
                  onBack={() => setStep(1)}
                />
              </section>
            )}

            {step === 3 && (
              <section>
                <StepHeading>Shipping method</StepHeading>
                {loading ? (
                  <p className="font-body text-sm text-muted">Preparing your order…</p>
                ) : (
                  <DeliveryStep
                    countryCode={countryCode}
                    currency={currency}
                    onNext={handleDelivery}
                    onBack={() => setStep(2)}
                  />
                )}
              </section>
            )}

            {step === 4 && clientSecret && (
              <section>
                <StepHeading>Payment</StepHeading>
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "stripe",
                      variables: {
                        colorPrimary: "#D4AF37",
                        colorBackground: "#FFFFFF",
                        fontFamily: "Instrument Sans, sans-serif",
                        borderRadius: "2px",
                      },
                    },
                  }}
                >
                  <StripePaymentForm onBack={() => setStep(3)} orderId={orderId} />
                </Elements>
              </section>
            )}
          </div>

          {/* Right — summary */}
          <OrderSummaryPanel
            items={items}
            subtotal={subtotal}
            countryCode={countryCode}
            currency={currency}
          />
        </div>
      </div>
    </main>
  );
}

function StepHeading({ children }) {
  return (
    <h2 className="font-heading text-lg text-foreground mb-6">{children}</h2>
  );
}
