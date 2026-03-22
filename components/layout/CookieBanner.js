"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "aie-cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        padding: "1rem 1.5rem",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* Text */}
        <p
          className="font-body"
          style={{
            fontSize: "14px",
            color: "var(--color-muted)",
            lineHeight: 1.7,
            flex: "1 1 280px",
            margin: 0,
          }}
        >
          We use cookies to improve your experience and analyse site traffic.
          See our{" "}
          <Link
            href="/privacy-policy#cookies"
            style={{
              color: "var(--color-gold)",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            Cookie Policy
          </Link>
          .
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <button
            onClick={decline}
            className="font-body"
            style={{
              padding: "0.625rem 1.5rem",
              fontSize: "12px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              border: "1px solid var(--color-foreground)",
              color: "var(--color-foreground)",
              backgroundColor: "transparent",
              cursor: "pointer",
              transition: "opacity 200ms ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Decline
          </button>

          <button
            onClick={accept}
            className="font-body"
            style={{
              padding: "0.625rem 1.5rem",
              fontSize: "12px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              backgroundColor: "var(--color-gold)",
              color: "var(--color-foreground)",
              border: "none",
              cursor: "pointer",
              transition: "background-color 200ms ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-gold-dark)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-gold)")
            }
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
