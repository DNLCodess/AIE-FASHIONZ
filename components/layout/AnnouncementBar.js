"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

const BAR_KEY = "aie_bar_v1";
const BAR_H = "40px";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(BAR_KEY);
    if (!dismissed) {
      document.documentElement.style.setProperty("--bar-h", BAR_H);
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(BAR_KEY, "1");
    document.documentElement.style.setProperty("--bar-h", "0px");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="banner"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 65,
        height: BAR_H,
        backgroundColor: "var(--color-foreground)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p className="font-body text-sm" style={{ color: "var(--color-background)" }}>
        Enjoy 10% Off Everything with Code{" "}
        <strong style={{ color: "var(--color-gold)" }}>&apos;AIETEN&apos;</strong>
      </p>
      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        style={{
          position: "absolute",
          right: "1rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "rgba(255,255,255,0.55)",
          display: "flex",
          alignItems: "center",
          padding: "4px",
          transition: "color 200ms ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,1)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
      >
        <X size={15} />
      </button>
    </div>
  );
}
