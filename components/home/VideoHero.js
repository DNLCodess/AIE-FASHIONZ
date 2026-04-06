"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function VideoHero() {
  const videoRef = useRef(null);

  useEffect(() => {
    // Ensure muted DOM property is set (React 19 safety)
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  }, []);

  useEffect(() => {
    // Parallax on desktop only — no jank on mobile
    if (typeof window === "undefined") return;
    const handleScroll = () => {
      if (!videoRef.current || window.innerWidth < 1024) return;
      videoRef.current.style.transform = `translateY(${window.scrollY * 0.28}px)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className="hero-section relative overflow-hidden"
      style={{ minHeight: "100svh" }}
    >
      {/* ── Video background ──────────────────────────────── */}
      <div className="absolute inset-0" style={{ overflow: "hidden" }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="/promotions/image1.jpeg"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "115%",
            objectFit: "cover",
            objectPosition: "center top",
            top: "-5%",
            willChange: "transform",
          }}
        >
          <source src="/promotions/video1.mp4" type="video/mp4" />
        </video>

        {/* Primary bottom-up gradient for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.18) 100%)",
          }}
        />
        {/* Side vignette for left-aligned editorial layout */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 65%)",
          }}
        />
      </div>

      {/* ── Floating editorial insert — desktop only ──────── */}
      <div
        className="absolute top-32 right-10 hidden lg:block"
        style={{
          width: "190px",
          height: "255px",
          overflow: "hidden",
          border: "1px solid rgba(212,175,55,0.4)",
          zIndex: 5,
        }}
        aria-hidden="true"
      >
        <Image
          src="/promotions/image2.jpeg"
          alt=""
          fill
          sizes="190px"
          className="object-cover object-center hero-scale"
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)",
          }}
        />
        <span
          className="font-body uppercase absolute bottom-4 left-4"
          style={{ fontSize: "11px", letterSpacing: "0.28em", color: "rgba(255,255,255,0.75)" }}
        >
          SS25
        </span>
      </div>

      {/* ── Hero text — absolutely anchored top + bottom ─────
          top: clears the announcement bar + header at all times
          bottom: padding from viewport bottom
          overflow: hidden clips upward if content is too tall
          (label clips before CTA — least important content first)
      ────────────────────────────────────────────────────── */}
      <div
        className="absolute left-0 right-0 z-10 px-6 md:px-14 lg:px-20 flex flex-col justify-end overflow-hidden"
        style={{
          top: "calc(var(--bar-h, 0px) + 5rem)",
          bottom: "5rem",
        }}
      >
        <p
          className="hero-up font-body uppercase text-white"
          style={{
            animationDelay: "0.05s",
            fontSize: "14px",
            letterSpacing: "0.45em",
            opacity: 0.68,
            marginBottom: "1.25rem",
          }}
        >
          New Arrivals — SS25
        </p>

        <h1
          className="hero-up font-heading text-white"
          style={{
            animationDelay: "0.18s",
            /* Max capped at 6rem to prevent vertical overflow on short viewports */
            fontSize: "clamp(2.25rem, 8vw, 6rem)",
            lineHeight: 1.0,
            letterSpacing: "-0.02em",
            marginBottom: "1.25rem",
          }}
        >
          Dress<br />
          with<br />
          <em style={{ color: "var(--color-gold)" }}>intention.</em>
        </h1>

        {/* Gold rule */}
        <div
          className="hero-line"
          style={{
            height: "1px",
            width: "3rem",
            backgroundColor: "var(--color-gold)",
            marginBottom: "1.25rem",
          }}
        />

        <p
          className="hero-up font-body text-white"
          style={{
            animationDelay: "0.35s",
            fontSize: "clamp(1rem, 1.4vw, 1.1rem)",
            lineHeight: 1.65,
            opacity: 0.72,
            maxWidth: "38ch",
            marginBottom: "2rem",
          }}
        >
          Six curated categories. One standard — luxury. Shop the latest
          collection, delivered worldwide.
        </p>

        <div
          className="hero-up flex flex-col sm:flex-row gap-4"
          style={{ animationDelay: "0.5s" }}
        >
          <Link
            href="/shop"
            className="font-body uppercase text-center bg-gold hover:bg-gold-dark text-foreground transition-colors duration-200 w-full sm:w-auto"
            style={{
              fontSize: "16px",
              fontWeight: 600,
              padding: "18px 48px",
              letterSpacing: "0.18em",
              minHeight: "56px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Shop the Collection
          </Link>
          <Link
            href="/shop/party-dinner-wear"
            className="font-body uppercase text-white text-center transition-colors duration-200 w-full sm:w-auto"
            style={{
              fontSize: "16px",
              padding: "18px 48px",
              letterSpacing: "0.18em",
              border: "1px solid rgba(255,255,255,0.38)",
              minHeight: "56px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            New Arrivals
          </Link>
        </div>
      </div>

      {/* ── Scroll indicator — desktop only ──────────────── */}
      <div
        className="hero-up absolute right-10 bottom-12 hidden lg:flex flex-col items-center gap-3 z-10"
        style={{ animationDelay: "1s" }}
        aria-hidden="true"
      >
        <span
          className="font-body uppercase text-white"
          style={{ fontSize: "11px", letterSpacing: "0.32em", opacity: 0.4, writingMode: "vertical-rl" }}
        >
          Scroll
        </span>
        <div
          className="scroll-line"
          style={{ width: "1px", height: "60px", backgroundColor: "rgba(255,255,255,0.3)" }}
        />
      </div>
    </section>
  );
}
