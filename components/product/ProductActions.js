"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Share2, Check, Link2 } from "lucide-react";
import { useIsWishlisted, useToggleWishlist } from "@/hooks/useWishlist";
import useUiStore from "@/store/uiStore";

export default function ProductActions({ product }) {
  const router = useRouter();
  const isWishlisted = useIsWishlisted(product.id);
  const { mutate: toggleWishlist } = useToggleWishlist();
  const addToast = useUiStore((s) => s.addToast);
  const [shareState, setShareState] = useState("idle"); // idle | copied

  const handleWishlist = () => {
    const willWishlist = !isWishlisted;
    toggleWishlist({ productId: product.id, remove: isWishlisted }, {
      onSuccess: () => {
        addToast({
          type: "wishlist",
          message: willWishlist ? "Saved to wishlist" : "Removed from wishlist",
        });
      },
      onError: (err) => {
        if (err.message?.includes("Sign in")) {
          router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        } else {
          addToast({ type: "error", message: "Could not update wishlist" });
        }
      },
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: product.title,
      text: product.description?.slice(0, 100) ?? product.title,
      url,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled — no feedback needed
      }
      return;
    }

    // Fallback: copy link
    try {
      await navigator.clipboard.writeText(url);
      setShareState("copied");
      addToast({ type: "cart", message: "Link copied to clipboard" });
      setTimeout(() => setShareState("idle"), 2000);
    } catch {
      addToast({ type: "error", message: "Could not copy link" });
    }
  };

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      {/* Wishlist */}
      <button
        type="button"
        onClick={handleWishlist}
        aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "14px 16px",
          border: `1px solid ${isWishlisted ? "var(--color-gold)" : "var(--color-border)"}`,
          backgroundColor: isWishlisted ? "var(--color-gold-light)" : "transparent",
          cursor: "pointer",
          transition: "border-color 200ms ease, background-color 200ms ease",
        }}
      >
        <Heart
          size={16}
          style={{
            color: isWishlisted ? "var(--color-gold)" : "var(--color-muted)",
            fill: isWishlisted ? "var(--color-gold)" : "none",
            transition: "color 200ms ease, fill 200ms ease",
            flexShrink: 0,
          }}
        />
        <span
          className="font-body"
          style={{
            fontSize: "12px",
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: isWishlisted ? "var(--color-gold)" : "var(--color-muted)",
            transition: "color 200ms ease",
          }}
        >
          {isWishlisted ? "Wishlisted" : "Wishlist"}
        </span>
      </button>

      {/* Share */}
      <button
        type="button"
        onClick={handleShare}
        aria-label="Share product"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "14px 16px",
          border: "1px solid var(--color-border)",
          backgroundColor: "transparent",
          cursor: "pointer",
          transition: "border-color 200ms ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-muted)")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
      >
        {shareState === "copied" ? (
          <Check size={16} style={{ color: "var(--color-success)", flexShrink: 0 }} />
        ) : (
          <Share2 size={16} style={{ color: "var(--color-muted)", flexShrink: 0 }} />
        )}
        <span
          className="font-body"
          style={{
            fontSize: "12px",
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: shareState === "copied" ? "var(--color-success)" : "var(--color-muted)",
            transition: "color 200ms ease",
          }}
        >
          {shareState === "copied" ? "Copied" : "Share"}
        </span>
      </button>
    </div>
  );
}
