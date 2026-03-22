"use client";

import { useTheme } from "@/lib/theme";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * @param {{ scrolled?: boolean }} props
 * scrolled — passed from Header so the icon colour matches the
 * header's current dark-band / solid-surface state.
 */
export default function ThemeToggle({ scrolled = false }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => setMounted(true), []);

  // Return a zero-size placeholder before mount so it takes no space
  // and cannot cause layout shifts or icon collisions.
  if (!mounted) {
    return (
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: "39px",
          height: "39px",
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        background: "none",
        border: "none",
        cursor: "pointer",
        borderRadius: "9999px",
        // Matches the exact same colour logic as every other header icon
        color: hovered
          ? scrolled
            ? "var(--color-foreground)"
            : "rgba(255,255,255,1)"
          : scrolled
            ? "var(--color-muted)"
            : "rgba(255,255,255,0.72)",
        transition: "color 200ms ease",
      }}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
