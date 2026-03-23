"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Heart, X, AlertCircle } from "lucide-react";
import useUiStore from "@/store/uiStore";

const ICONS = {
  cart:     <ShoppingBag size={16} style={{ color: "var(--color-gold)", flexShrink: 0 }} />,
  wishlist: <Heart size={16} style={{ color: "var(--color-gold)", flexShrink: 0 }} />,
  error:    <AlertCircle size={16} style={{ color: "var(--color-error)", flexShrink: 0 }} />,
};

const ACCENT = {
  cart:     "var(--color-gold)",
  wishlist: "var(--color-gold)",
  error:    "var(--color-error)",
};

export default function ToastContainer() {
  const toasts = useUiStore((s) => s.toasts);
  const removeToast = useUiStore((s) => s.removeToast);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "16px",
        left: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "10px",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function Toast({ toast, onDismiss }) {
  const [visible, setVisible] = useState(false);

  // Trigger enter animation on mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const icon = ICONS[toast.type] ?? ICONS.cart;
  const accent = ACCENT[toast.type] ?? ACCENT.cart;

  return (
    <div
      role="status"
      style={{
        pointerEvents: "auto",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderLeft: `3px solid ${accent}`,
        padding: "14px 16px",
        minWidth: "220px",
        maxWidth: "min(340px, calc(100vw - 32px))",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 240ms ease, transform 240ms ease",
      }}
    >
      {icon}
      <span
        className="font-body"
        style={{
          fontSize: "14px",
          fontWeight: 500,
          color: "var(--color-foreground)",
          flex: 1,
          lineHeight: 1.4,
        }}
      >
        {toast.message}
      </span>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px",
          color: "var(--color-muted)",
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
