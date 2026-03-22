"use client";

import { useState } from "react";

/**
 * Interactive star picker (write mode) or static display (read mode).
 *
 * @param {{ value: number, onChange?: (n: number) => void, size?: number, readOnly?: boolean }} props
 */
export default function StarRating({ value = 0, onChange, size = 20, readOnly = false }) {
  const [hovered, setHovered] = useState(0);

  const display = readOnly ? value : (hovered || value);

  return (
    <div
      style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}
      aria-label={`Rating: ${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = display >= star;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readOnly && setHovered(star)}
            onMouseLeave={() => !readOnly && setHovered(0)}
            aria-label={`${star} star${star !== 1 ? "s" : ""}`}
            style={{
              background: "none",
              border: "none",
              padding: "1px",
              cursor: readOnly ? "default" : "pointer",
              lineHeight: 1,
              display: "flex",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={size}
              height={size}
              fill={filled ? "var(--color-gold)" : "none"}
              stroke={filled ? "var(--color-gold)" : "var(--color-border)"}
              strokeWidth="1.5"
              aria-hidden="true"
              style={{ transition: "fill 120ms ease, stroke 120ms ease" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Compact read-only stars used in review cards and aggregate display.
 * Uses half-star rendering via CSS clip-path.
 */
export function StarDisplay({ rating, size = 14, showNumber = false }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
      <span style={{ display: "inline-flex", gap: "2px" }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const half = !filled && rating >= star - 0.5;
          return (
            <span key={star} style={{ position: "relative", display: "inline-flex", width: size, height: size }}>
              {/* Background (empty) star */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="var(--color-border)" strokeWidth="1.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              {/* Filled overlay */}
              {(filled || half) && (
                <span style={{ position: "absolute", top: 0, left: 0, overflow: "hidden", width: half ? "50%" : "100%" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="var(--color-gold)" stroke="var(--color-gold)" strokeWidth="1.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </span>
              )}
            </span>
          );
        })}
      </span>
      {showNumber && (
        <span style={{ fontFamily: "var(--font-body)", fontSize: size - 2, color: "var(--color-muted)" }}>
          {rating.toFixed(1)}
        </span>
      )}
    </span>
  );
}
