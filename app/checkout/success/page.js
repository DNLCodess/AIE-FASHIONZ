"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, RotateCcw, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import useCartStore from "@/store/cartStore";

// Metadata cannot be exported from a 'use client' component — handled via head in layout.
// robots: noindex is applied via a separate metadata export in a wrapper if needed.
// For now we suppress indexing via the meta tag approach in the component.

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const provider = searchParams.get("provider");

  const clearCart = useCartStore((s) => s.clearCart);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Clear the cart once on mount — payment succeeded
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  // Fetch order details from Supabase
  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("orders")
          .select("id, order_number, shipping_country, status, created_at")
          .eq("id", orderId)
          .single();

        if (!error && data) {
          setOrder(data);
        }
      } catch {
        // Non-critical — we still show the confirmation page
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Determine delivery estimate based on shipping country
  const isUS =
    !order?.shipping_country ||
    order.shipping_country === "US" ||
    order.shipping_country === "United States";

  const deliveryEstimate = isUS
    ? "3–5 business days"
    : "7–14 business days";

  const orderReference =
    order?.order_number || orderId || "—";

  return (
    <div
      style={{
        minHeight: "calc(100vh - 5rem)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1.5rem",
        backgroundColor: "var(--color-background)",
      }}
    >
      {/* noindex meta — injected imperatively for CSR pages */}
      <meta name="robots" content="noindex, nofollow" />

      <div style={{ maxWidth: "520px", width: "100%", textAlign: "center" }}>
        {/* Decorative rule */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              backgroundColor: "var(--color-border)",
            }}
          />
          <span style={{ color: "var(--color-gold)", fontSize: "0.875rem" }}>
            ◆
          </span>
          <div
            style={{
              flex: 1,
              height: "1px",
              backgroundColor: "var(--color-border)",
            }}
          />
        </div>

        {/* Checkmark icon */}
        <div
          style={{
            width: "64px",
            height: "64px",
            margin: "0 auto 1.5rem",
            border: "1px solid var(--color-gold)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CheckCircle
            size={28}
            color="var(--color-gold)"
            strokeWidth={1.5}
          />
        </div>

        {/* Eyebrow */}
        <p
          className="font-body"
          style={{
            fontSize: "11px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            marginBottom: "0.75rem",
          }}
        >
          Order Confirmed
        </p>

        {/* Heading */}
        <h1
          className="font-heading"
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            color: "var(--color-foreground)",
            marginBottom: "0.875rem",
            lineHeight: 1.15,
          }}
        >
          Thank you for your order!
        </h1>

        {/* Sub-heading */}
        <p
          className="font-body"
          style={{
            fontSize: "15px",
            color: "var(--color-muted)",
            lineHeight: 1.8,
            marginBottom: "2rem",
          }}
        >
          A confirmation email is on its way to you. We&apos;ll notify you as
          soon as your order ships.
        </p>

        {/* Order reference + delivery estimate box */}
        <div
          style={{
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface)",
            padding: "1.5rem 2rem",
            marginBottom: "2rem",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {/* Reference */}
          <div>
            <p
              className="font-body"
              style={{
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-muted)",
                marginBottom: "0.25rem",
              }}
            >
              Order reference
            </p>
            {loading ? (
              <div
                style={{
                  height: "1.25rem",
                  width: "140px",
                  backgroundColor: "var(--color-surface-raised)",
                  borderRadius: "2px",
                }}
              />
            ) : (
              <p
                className="font-heading"
                style={{
                  fontSize: "1rem",
                  color: "var(--color-foreground)",
                  letterSpacing: "0.05em",
                }}
              >
                {orderReference}
              </p>
            )}
          </div>

          {/* Divider */}
          <div
            style={{ height: "1px", backgroundColor: "var(--color-border)" }}
          />

          {/* Estimated delivery */}
          <div>
            <p
              className="font-body"
              style={{
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-muted)",
                marginBottom: "0.25rem",
              }}
            >
              Estimated delivery
            </p>
            <p
              className="font-body"
              style={{
                fontSize: "15px",
                color: "var(--color-foreground)",
                fontWeight: 500,
              }}
            >
              {deliveryEstimate}
            </p>
          </div>

          {/* Provider note (optional) */}
          {provider && (
            <>
              <div
                style={{
                  height: "1px",
                  backgroundColor: "var(--color-border)",
                }}
              />
              <div>
                <p
                  className="font-body"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--color-muted)",
                    marginBottom: "0.25rem",
                  }}
                >
                  Payment via
                </p>
                <p
                  className="font-body"
                  style={{
                    fontSize: "14px",
                    color: "var(--color-foreground)",
                    textTransform: "capitalize",
                  }}
                >
                  {provider}
                </p>
              </div>
            </>
          )}
        </div>

        {/* CTA buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            marginBottom: "2.5rem",
          }}
        >
          <Link
            href="/shop"
            className="font-body"
            style={{
              display: "block",
              padding: "1rem 2rem",
              backgroundColor: "var(--color-gold)",
              color: "var(--color-foreground)",
              textDecoration: "none",
              fontSize: "12px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 500,
              transition: "background-color 200ms ease",
              textAlign: "center",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--color-gold-dark)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-gold)")
            }
          >
            Continue Shopping
          </Link>

          <Link
            href="/account/orders"
            className="font-body"
            style={{
              display: "block",
              padding: "1rem 2rem",
              border: "1px solid var(--color-border)",
              color: "var(--color-muted)",
              textDecoration: "none",
              fontSize: "12px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              transition: "color 200ms ease, border-color 200ms ease",
              textAlign: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-foreground)";
              e.currentTarget.style.borderColor = "var(--color-foreground)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-muted)";
              e.currentTarget.style.borderColor = "var(--color-border)";
            }}
          >
            View Your Orders
          </Link>
        </div>

        {/* Trust strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
            flexWrap: "wrap",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          {[
            { icon: <RotateCcw size={14} strokeWidth={1.5} />, label: "Free Returns" },
            { icon: <ShieldCheck size={14} strokeWidth={1.5} />, label: "Secure Payment" },
            { icon: <Package size={14} strokeWidth={1.5} />, label: "Premium Quality" },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="font-body"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "12px",
                color: "var(--color-muted)",
              }}
            >
              <span style={{ color: "var(--color-gold)" }}>{icon}</span>
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
