"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Link from "next/link";
import Image from "next/image";
import useCartStore, { selectSubtotal } from "@/store/cartStore";
import useUiStore from "@/store/uiStore";
import StripePaymentForm from "@/components/checkout/StripePaymentForm";
import { formatCurrency } from "@/lib/utils";
import { calculateShipping, getShippingOption } from "@/lib/shipping";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const COUNTRIES = [
  { code: "US", label: "United States" },
  { code: "NG", label: "Nigeria" },
  { code: "CA", label: "Canada" },
  { code: "GB", label: "United Kingdom" },
  { code: "AU", label: "Australia" },
  { code: "DE", label: "Germany" },
  { code: "FR", label: "France" },
  { code: "IE", label: "Ireland" },
  { code: "NL", label: "Netherlands" },
  { code: "ZA", label: "South Africa" },
];

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  phone: z.string().optional(),
  company: z.string().optional(),
  country: z.string().min(2, "Required"),
  line1: z.string().min(1, "Required"),
  line2: z.string().optional(),
  city: z.string().min(1, "Required"),
  state: z.string().optional(),
  postcode: z.string().min(1, "Required"),
  deliveryType: z.enum(["ship", "pickup"]),
  emailOffers: z.boolean().optional(),
  textOffers: z.boolean().optional(),
});

export default function CheckoutPage() {
  const { items } = useCartStore();
  const { currency } = useUiStore();
  const subtotal = useCartStore(selectSubtotal);

  const [phase, setPhase] = useState("form"); // "form" | "stripe"
  const [clientSecret, setClientSecret] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { country: "US", deliveryType: "ship" },
  });

  const watchedCountry = watch("country");
  const watchedDeliveryType = watch("deliveryType");
  const shippingOption = getShippingOption(watchedCountry || "US");
  const shipping = calculateShipping(watchedCountry || "US", subtotal);
  const total = subtotal + shipping;

  // ── Empty cart guard ──────────────────────────────────────
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

  const onSubmit = async (data) => {
    setApiError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          contact: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
          },
          address: {
            line1: data.line1,
            line2: data.line2,
            city: data.city,
            state: data.state,
            postcode: data.postcode,
            country: data.country,
          },
          delivery: { shippingOption },
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
        setPhase("stripe");
      } else if (json.provider === "paystack") {
        window.location.href = json.authorizationUrl;
      }
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const orderSummary = (
    <OrderSidebar
      items={items}
      subtotal={subtotal}
      shipping={shipping}
      total={total}
      currency={currency}
      discountCode={discountCode}
      setDiscountCode={setDiscountCode}
    />
  );

  // ── Stripe payment phase ──────────────────────────────────
  if (phase === "stripe" && clientSecret) {
    return (
      <CheckoutShell>
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 lg:gap-16 items-start">
            <div>
              <button
                type="button"
                onClick={() => setPhase("form")}
                className="font-body text-xs text-muted hover:text-foreground transition-colors mb-8"
              >
                ← Back to information
              </button>
              <h2 className="font-heading text-lg text-foreground mb-6">Payment</h2>
              <p
                className="font-body mb-6"
                style={{ fontSize: "12px", color: "var(--color-muted)" }}
              >
                All transactions are secure and encrypted.
              </p>
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
                <StripePaymentForm onBack={() => setPhase("form")} orderId={orderId} />
              </Elements>
            </div>
            {/* Sidebar — hidden on mobile in stripe phase, visible on desktop */}
            <div className="hidden lg:block lg:sticky lg:top-8">{orderSummary}</div>
          </div>
        </div>
      </CheckoutShell>
    );
  }

  // ── Single-page form phase ────────────────────────────────
  return (
    <CheckoutShell>
      {/* Mobile order summary toggle */}
      <div
        className="lg:hidden border-b border-border px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: "var(--color-surface-raised)" }}
      >
        <span className="font-body text-sm text-muted">
          Order summary · {items.length} item{items.length !== 1 ? "s" : ""}
        </span>
        <span className="font-heading text-sm text-foreground">{formatCurrency(total, currency)}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 lg:gap-16 items-start">

          {/* ── Left: form ── */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-10">

            {/* Express checkout */}
            <div>
              <p
                className="font-body text-center uppercase tracking-widest mb-4"
                style={{ fontSize: "11px", color: "var(--color-subtle)" }}
              >
                Express checkout
              </p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {["Shop Pay", "PayPal", "G Pay"].map((label) => (
                  <div
                    key={label}
                    className="h-12 border border-border flex items-center justify-center"
                    style={{ opacity: 0.4 }}
                    aria-hidden="true"
                  >
                    <span className="font-body text-xs text-muted">{label}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-border)" }} />
                <span className="font-body text-sm" style={{ color: "var(--color-muted)" }}>OR</span>
                <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-border)" }} />
              </div>
            </div>

            {/* Contact */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-heading text-lg text-foreground">Contact</h2>
                <Link
                  href="/auth/login"
                  className="font-body text-sm transition-colors"
                  style={{ color: "var(--color-gold)" }}
                >
                  Sign in
                </Link>
              </div>
              <div className="space-y-4">
                <div>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="Email or mobile phone number"
                    className={inputCls(errors.email)}
                    autoComplete="email"
                  />
                  {errors.email && <p className="font-body text-xs text-error mt-1">{errors.email.message}</p>}
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register("emailOffers")} className="w-4 h-4 accent-gold shrink-0" />
                  <span className="font-body text-sm text-muted">Email me with news and offers</span>
                </label>
              </div>
            </div>

            {/* Delivery */}
            <div>
              <h2 className="font-heading text-lg text-foreground mb-5">Delivery</h2>

              {/* Ship / Pickup toggle */}
              <div className="grid grid-cols-2 mb-5" style={{ border: "1px solid var(--color-border)" }}>
                {(["ship", "pickup"] ).map((type) => (
                  <label
                    key={type}
                    className="flex items-center justify-center gap-2 h-12 cursor-pointer transition-colors"
                    style={{
                      backgroundColor: watchedDeliveryType === type ? "var(--color-gold-light)" : "transparent",
                      borderBottom: watchedDeliveryType === type ? "2px solid var(--color-gold)" : "2px solid transparent",
                    }}
                  >
                    <input type="radio" value={type} {...register("deliveryType")} className="sr-only" />
                    <span className="font-body text-sm text-foreground capitalize">{type}</span>
                  </label>
                ))}
              </div>

              <div className="space-y-4">
                {/* Country */}
                <select
                  {...register("country")}
                  className={inputCls(errors.country)}
                  autoComplete="country"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                  <option disabled>──────────</option>
                  <option value="OTHER">Other</option>
                </select>

                {/* Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      {...register("firstName")}
                      placeholder="First name"
                      className={inputCls(errors.firstName)}
                      autoComplete="given-name"
                    />
                    {errors.firstName && <p className="font-body text-xs text-error mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <input
                      {...register("lastName")}
                      placeholder="Last name"
                      className={inputCls(errors.lastName)}
                      autoComplete="family-name"
                    />
                    {errors.lastName && <p className="font-body text-xs text-error mt-1">{errors.lastName.message}</p>}
                  </div>
                </div>

                <input
                  {...register("company")}
                  placeholder="Company (optional)"
                  className={inputCls()}
                  autoComplete="organization"
                />

                <div>
                  <input
                    {...register("line1")}
                    placeholder="Address"
                    className={inputCls(errors.line1)}
                    autoComplete="address-line1"
                  />
                  {errors.line1 && <p className="font-body text-xs text-error mt-1">{errors.line1.message}</p>}
                </div>

                <input
                  {...register("line2")}
                  placeholder="Apartment, suite, etc. (optional)"
                  className={inputCls()}
                  autoComplete="address-line2"
                />

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <input
                      {...register("city")}
                      placeholder="City"
                      className={inputCls(errors.city)}
                      autoComplete="address-level2"
                    />
                    {errors.city && <p className="font-body text-xs text-error mt-1">{errors.city.message}</p>}
                  </div>
                  <input
                    {...register("state")}
                    placeholder="State"
                    className={inputCls()}
                    autoComplete="address-level1"
                  />
                  <div>
                    <input
                      {...register("postcode")}
                      placeholder="ZIP code"
                      className={inputCls(errors.postcode)}
                      autoComplete="postal-code"
                    />
                    {errors.postcode && <p className="font-body text-xs text-error mt-1">{errors.postcode.message}</p>}
                  </div>
                </div>

                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="Phone"
                  className={inputCls()}
                  autoComplete="tel"
                />

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register("textOffers")} className="w-4 h-4 accent-gold shrink-0" />
                  <span className="font-body text-sm text-muted">Text me with news and offers</span>
                </label>
              </div>
            </div>

            {/* Shipping method */}
            <div>
              <h2 className="font-heading text-lg text-foreground mb-5">Shipping method</h2>
              <div
                className="flex items-center justify-between p-4"
                style={{
                  border: "1px solid var(--color-gold)",
                  backgroundColor: "var(--color-gold-light)",
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Custom radio */}
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{ width: "18px", height: "18px", border: "2px solid var(--color-gold)", borderRadius: "50%" }}
                  >
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--color-gold)" }} />
                  </div>
                  <span className="font-body text-sm text-foreground">{shippingOption.label}</span>
                </div>
                <span className="font-heading text-sm text-foreground">
                  {shipping === 0 ? "Free" : formatCurrency(shipping, currency)}
                </span>
              </div>
            </div>

            {/* Payment */}
            <div>
              <h2 className="font-heading text-lg text-foreground mb-2">Payment</h2>
              <p
                className="font-body mb-5"
                style={{ fontSize: "12px", color: "var(--color-muted)" }}
              >
                All transactions are secure and encrypted.
              </p>

              {/* Credit card option */}
              <div
                className="border p-4 mb-2"
                style={{ borderColor: "var(--color-gold)", backgroundColor: "var(--color-gold-light)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center shrink-0"
                      style={{ width: "18px", height: "18px", border: "2px solid var(--color-gold)", borderRadius: "50%" }}
                    >
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--color-gold)" }} />
                    </div>
                    <span className="font-body text-sm text-foreground">Credit card</span>
                  </div>
                  <span className="font-body text-xs text-muted">VISA · MC · AMEX</span>
                </div>
                <p
                  className="font-body mt-3 ml-7"
                  style={{ fontSize: "12px", color: "var(--color-muted)" }}
                >
                  Card details will be collected securely on the next step.
                </p>
              </div>

              {/* Paystack — Nigeria only */}
              {watchedCountry === "NG" && (
                <div className="border border-border p-4 flex items-center gap-3">
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{ width: "18px", height: "18px", border: "2px solid var(--color-border)", borderRadius: "50%" }}
                  />
                  <span className="font-body text-sm text-foreground">Paystack (Nigeria)</span>
                </div>
              )}
            </div>

            {/* Save info */}
            <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1.5rem" }}>
              <h3 className="font-body text-sm text-foreground mb-4">Save my information for a faster checkout</h3>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-gold mt-0.5 shrink-0" />
                <div>
                  <span className="font-body text-sm text-muted block">Mobile phone (optional)</span>
                  <span
                    className="font-body mt-1 block"
                    style={{ fontSize: "11px", color: "var(--color-subtle)" }}
                  >
                    By providing your phone number, you agree to create a Shop account subject to our Terms and Privacy Policy.
                  </span>
                </div>
              </label>
            </div>

            {/* API error */}
            {apiError && (
              <div className="border border-error p-4">
                <p className="font-body text-sm text-error">{apiError}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 font-body text-base tracking-widest uppercase bg-gold text-foreground hover:bg-gold-dark transition-colors disabled:opacity-60"
            >
              {loading ? "Processing…" : "Pay now"}
            </button>
          </form>

          {/* ── Right: order summary (desktop sidebar) ── */}
          <div className="hidden lg:block lg:sticky lg:top-8">{orderSummary}</div>
        </div>

        {/* Mobile order summary (shown below form) */}
        <div className="lg:hidden mt-10 border-t border-border pt-8">{orderSummary}</div>
      </div>

      {/* Footer links */}
      <div
        style={{ borderTop: "1px solid var(--color-border)" }}
        className="py-6 px-4 mt-4"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap gap-x-8 gap-y-2 justify-center">
          {[
            { label: "Refund policy", href: "/returns" },
            { label: "Shipping", href: "/shipping-returns" },
            { label: "Privacy policy", href: "#" },
            { label: "Terms of service", href: "#" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="font-body text-sm text-muted hover:text-foreground transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </CheckoutShell>
  );
}

/* ── Shared layout wrapper ───────────────────────────────── */

function CheckoutShell({ children }) {
  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      {/* Checkout header */}
      <header
        className="py-4 px-4"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-heading text-xl text-foreground">
            Aiefashion
          </Link>
          <Link
            href="/cart"
            className="font-body text-sm text-muted hover:text-foreground transition-colors"
          >
            ← Cart
          </Link>
        </div>
      </header>

      {children}
    </main>
  );
}

/* ── Order sidebar with discount code ───────────────────── */

function OrderSidebar({ items, subtotal, shipping, total, currency, discountCode, setDiscountCode }) {
  return (
    <div
      className="border border-border"
      style={{ backgroundColor: "var(--color-surface-raised)" }}
    >
      {/* Items */}
      <div className="p-6 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div
              className="relative shrink-0 overflow-hidden"
              style={{ width: "64px", aspectRatio: "3/4", backgroundColor: "var(--color-gold-light)" }}
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="64px"
                  className="object-cover object-top"
                />
              ) : (
                <div className="w-full h-full" style={{ backgroundColor: "var(--color-surface)" }} />
              )}
              {/* Qty badge */}
              <span
                className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center font-body text-[11px]"
                style={{
                  borderRadius: "50%",
                  backgroundColor: "var(--color-foreground)",
                  color: "var(--color-background)",
                }}
              >
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
          </div>
        ))}
      </div>

      <div className="h-px" style={{ backgroundColor: "var(--color-border)" }} />

      {/* Discount code */}
      <div className="p-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            placeholder="Discount code"
            className="flex-1 h-11 px-3 font-body text-sm text-foreground bg-surface border border-border focus:outline-none focus:border-foreground transition-colors"
          />
          <button
            type="button"
            className="px-5 h-11 font-body text-sm text-foreground border border-border hover:border-foreground transition-colors"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="h-px" style={{ backgroundColor: "var(--color-border)" }} />

      {/* Totals */}
      <div className="p-6 space-y-3">
        <div className="flex justify-between font-body text-sm">
          <span className="text-muted">Subtotal</span>
          <span className="text-foreground">{formatCurrency(subtotal, currency)}</span>
        </div>
        <div className="flex justify-between font-body text-sm">
          <span className="text-muted">Shipping</span>
          <span className="text-foreground">
            {shipping === 0 ? "Free" : formatCurrency(shipping, currency)}
          </span>
        </div>

        <div className="h-px" style={{ backgroundColor: "var(--color-border)" }} />

        <div className="flex justify-between items-baseline">
          <span className="font-body text-sm text-muted">Total</span>
          <div className="flex items-baseline gap-2">
            <span
              className="font-body text-xs uppercase"
              style={{ color: "var(--color-subtle)" }}
            >
              {currency}
            </span>
            <span className="font-heading text-xl text-foreground">{formatCurrency(total, currency)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Input class helper ──────────────────────────────────── */

function inputCls(error) {
  return `w-full h-12 px-4 font-body text-base text-foreground bg-surface border ${
    error ? "border-error" : "border-border"
  } focus:outline-none focus:border-foreground transition-colors placeholder:text-subtle`;
}
