import Image from "next/image";
import Link from "next/link";

/**
 * PromoDualPanel — two full-bleed category spotlight panels.
 * Mobile: stacked vertically.
 * Desktop: side by side (50 / 50).
 * Each panel is image-dominant with overlaid headline + CTA.
 */
const PANELS = [
  {
    src:   "/promotions/image5.jpeg",
    alt:   "Party & Occasion Wear — Aiefashion SS25",
    label: "Party & Occasion",
    sub:   "Dress to impress, every time.",
    href:  "/shop/party-dinner-wear",
    cta:   "Shop Occasion Wear",
  },
  {
    src:   "/promotions/image4.jpeg",
    alt:   "Premium Fabrics — Aiefashion",
    label: "Premium Fabrics",
    sub:   "Curated luxury, by the yard.",
    href:  "/shop/luxury-fabrics",
    cta:   "Shop Fabrics",
  },
];

export default function PromoDualPanel() {
  return (
    <section aria-label="Category spotlights">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {PANELS.map(({ src, alt, label, sub, href, cta }) => (
          <Link
            key={href}
            href={href}
            className="group relative overflow-hidden block"
            style={{
              minHeight: "clamp(320px, 60vw, 640px)",
              textDecoration: "none",
            }}
          >
            {/* Background image */}
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-center"
              style={{
                transition: "transform 800ms cubic-bezier(0.22,1,0.36,1)",
              }}
              loading="lazy"
            />

            {/* Base gradient */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.12) 55%, transparent 100%)",
                transition: "opacity 400ms ease",
              }}
            />

            {/* Hover vignette (CSS via group-hover handled in globals) */}
            <div
              className="category-overlay absolute inset-0"
              style={{ opacity: 0, transition: "opacity 400ms ease" }}
            />

            {/* Content */}
            <div
              className="absolute inset-0 flex flex-col justify-end"
              style={{ padding: "clamp(1.5rem, 3.5vw, 2.75rem)" }}
            >
              <p
                className="font-body uppercase text-white"
                style={{
                  fontSize: "14px",
                  letterSpacing: "0.35em",
                  opacity: 0.65,
                  marginBottom: "0.75rem",
                }}
              >
                {sub}
              </p>
              <h3
                className="font-heading text-white"
                style={{
                  fontSize: "clamp(1.6rem, 3.5vw, 3rem)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.01em",
                  marginBottom: "1.25rem",
                  textShadow: "0 2px 12px rgba(0,0,0,0.3)",
                }}
              >
                {label}
              </h3>

              <span
                className="font-body uppercase flex items-center gap-3"
                style={{
                  fontSize: "14px",
                  letterSpacing: "0.22em",
                  fontWeight: 600,
                  color: "var(--color-gold)",
                  transition: "gap 200ms ease",
                }}
              >
                {cta}
                <span style={{ fontSize: "18px", transition: "transform 200ms ease" }}>→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
