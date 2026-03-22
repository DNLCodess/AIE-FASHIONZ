"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import StarRating from "./StarRating";

/**
 * Review submission form — shown when the user has a confirmed purchase.
 * @param {{ productId: string, productTitle: string, orderId: string, existingReview?: object }} props
 */
export default function ReviewForm({ productId, productTitle, orderId, existingReview }) {
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [title, setTitle] = useState(existingReview?.title ?? "");
  const [body, setBody] = useState(existingReview?.body ?? "");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const isEditing = Boolean(existingReview);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setErrorMsg("Please select a star rating."); return; }
    if (body.trim().length < 10) { setErrorMsg("Review must be at least 10 characters."); return; }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, orderId, rating, title: title.trim(), body: body.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not submit review.");
      setStatus("success");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div style={{ padding: "2rem", border: "1px solid var(--color-border)", textAlign: "center" }}>
        <CheckCircle size={28} style={{ color: "var(--color-success)", margin: "0 auto 1rem" }} />
        <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "var(--color-foreground)", marginBottom: "6px" }}>
          {isEditing ? "Review updated." : "Thank you for your review!"}
        </p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-muted)" }}>
          Your review helps other shoppers make better decisions.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-muted)", marginBottom: "10px" }}>
          Your rating *
        </p>
        <StarRating value={rating} onChange={setRating} size={28} />
        {rating > 0 && (
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-muted)", marginTop: "6px" }}>
            {["", "Poor", "Fair", "Good", "Very good", "Excellent"][rating]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="review-title" style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-muted)", display: "block", marginBottom: "6px" }}>
          Review title (optional)
        </label>
        <input
          id="review-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={`Summarise your experience with ${productTitle}`}
          maxLength={80}
          style={{
            width: "100%", padding: "11px 14px",
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface)",
            fontFamily: "var(--font-body)", fontSize: "14px",
            color: "var(--color-foreground)", outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--color-gold)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
        />
      </div>

      <div>
        <label htmlFor="review-body" style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-muted)", display: "block", marginBottom: "6px" }}>
          Your review *
        </label>
        <textarea
          id="review-body"
          required
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What did you love? How does it fit? Would you recommend it?"
          style={{
            width: "100%", padding: "11px 14px",
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface)",
            fontFamily: "var(--font-body)", fontSize: "14px",
            color: "var(--color-foreground)", outline: "none",
            resize: "vertical",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--color-gold)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
        />
        <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-subtle)", marginTop: "4px" }}>
          {body.length} / 1000
        </p>
      </div>

      {errorMsg && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", border: "1px solid var(--color-error)", backgroundColor: "rgba(192,57,43,0.05)" }}>
          <AlertCircle size={14} style={{ color: "var(--color-error)", flexShrink: 0 }} />
          <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-error)" }}>{errorMsg}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          padding: "13px",
          backgroundColor: status === "loading" ? "var(--color-border)" : "var(--color-gold)",
          color: "var(--color-foreground)",
          border: "none",
          fontFamily: "var(--font-body)",
          fontSize: "12px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          cursor: status === "loading" ? "not-allowed" : "pointer",
          transition: "background-color 200ms ease",
        }}
      >
        {status === "loading" ? "Submitting…" : isEditing ? "Update review" : "Submit review"}
      </button>
    </form>
  );
}
