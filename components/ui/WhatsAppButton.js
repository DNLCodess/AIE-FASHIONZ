"use client";

import { useState, useEffect } from "react";

// Set NEXT_PUBLIC_WHATSAPP_NUMBER in .env.local (e.g. 13014335307 — no + or spaces)
const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "13014335307";
const WA_MESSAGE = encodeURIComponent(
  "Hello Aiefashion! I'd like some help with my order."
);
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  // Show tooltip after 3s on mount, then hide after 4s
  useEffect(() => {
    const show = setTimeout(() => setTooltip(true), 3000);
    const hide = setTimeout(() => setTooltip(false), 7000);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.75rem",
        right: "1.75rem",
        zIndex: 90,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "10px",
      }}
    >
      {/* Tooltip bubble */}
      {(tooltip || hovered) && (
        <div
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            padding: "10px 14px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            maxWidth: "200px",
            animation: "fadeIn 200ms ease",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--color-foreground)",
              marginBottom: "2px",
            }}
          >
            Need help?
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              color: "var(--color-muted)",
            }}
          >
            Chat directly with our team on WhatsApp
          </p>
        </div>
      )}

      {/* Button */}
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "56px",
          height: "56px",
          borderRadius: "9999px",
          backgroundColor: hovered ? "#1DA851" : "#25D366",
          boxShadow: "0 4px 20px rgba(37,211,102,0.4)",
          transition: "background-color 200ms ease, transform 200ms ease, box-shadow 200ms ease",
          transform: hovered ? "scale(1.08)" : "scale(1)",
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        {/* WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          width="28"
          height="28"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
