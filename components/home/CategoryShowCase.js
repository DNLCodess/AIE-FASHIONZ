import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

/**
 * CategoryShowcase — Editorial numbered list layout.
 *
 * Desktop: Two-column. Left = oversized editorial number + category meta + CTA.
 *          Right = tall portrait image that changes on hover.
 * Mobile:  Stacked full-width cards, 3:4 ratio, with label overlay.
 *
 * Layout inspired by Celine, SSENSE, and Armani — numbered editorial
 * navigation rather than a generic image grid.
 */
export default function CategoryShowcase({ categories }) {
  if (!categories?.length) return null;

  return (
    <section
      style={{ backgroundColor: "var(--color-background)" }}
      className="py-20 md:py-28"
    >
      <div className="container">
        {/* ── Section header ───────────────────────────────── */}
        <Reveal className="mb-14 md:mb-16">
          <div className="flex items-center gap-6">
            <div
              style={{
                height: "1px",
                width: "2rem",
                backgroundColor: "var(--color-gold)",
              }}
            />
            <p
              className="font-body uppercase"
              style={{
                fontSize: "10px",
                letterSpacing: "0.4em",
                color: "var(--color-subtle)",
              }}
            >
              Collections
            </p>
          </div>
        </Reveal>

        {/* ── Desktop layout: numbered editorial list ───────── */}
        <div className="hidden md:block">
          {categories.slice(0, 6).map((cat, i) => (
            <CategoryRow key={cat.slug} cat={cat} index={i} />
          ))}
        </div>

        {/* ── Mobile layout: stacked portrait cards ─────────── */}
        <div className="md:hidden space-y-3">
          {categories.slice(0, 6).map((cat, i) => (
            <MobileCard key={cat.slug} cat={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Desktop row ─────────────────────────────────────────── */

function CategoryRow({ cat, index }) {
  const num = String(index + 1).padStart(2, "0");
  // Alternate image position: odd rows = image right, even = image left
  const imageRight = index % 2 === 0;

  return (
    <Reveal delay={Math.min(index + 1, 4)}>
      <Link
        href={`/shop/${cat.slug}`}
        className="group"
        style={{
          display: "grid",
          gridTemplateColumns: imageRight ? "1fr 340px" : "340px 1fr",
          gap: 0,
          borderTop: "1px solid var(--color-border)",
          minHeight: "260px",
          textDecoration: "none",
        }}
      >
        {/* Text panel */}
        <div
          style={{
            order: imageRight ? 1 : 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "2.5rem 3rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background fill on hover */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "var(--color-gold-light)",
              transform: "scaleX(0)",
              transformOrigin: imageRight ? "left" : "right",
              transition: "transform 500ms cubic-bezier(0.22,1,0.36,1)",
            }}
            className="group-hover:scale-x-100"
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Ghost number */}
            <span
              className="font-heading"
              style={{
                fontSize: "5rem",
                lineHeight: 1,
                color: "var(--color-gold)",
                opacity: 0.12,
                display: "block",
                marginBottom: "1rem",
                transition: "opacity 300ms ease",
                userSelect: "none",
              }}
            >
              {num}
            </span>

            {/* Category name — large editorial serif */}
            <h3
              className="font-heading"
              style={{
                fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)",
                lineHeight: 1.05,
                color: "var(--color-foreground)",
                transition: "color 200ms ease",
              }}
            >
              {cat.name}
            </h3>

            {/* Description — shown if available */}
            {cat.description && (
              <p
                className="font-body"
                style={{
                  fontSize: "13px",
                  color: "var(--color-muted)",
                  marginTop: "0.75rem",
                  maxWidth: "28ch",
                  lineHeight: 1.65,
                }}
              >
                {cat.description}
              </p>
            )}
          </div>

          {/* CTA row */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                height: "1px",
                width: "2rem",
                backgroundColor: "var(--color-gold)",
                transition: "width 400ms ease",
              }}
              className="group-hover:w-16"
            />
            <span
              className="font-body uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: "0.25em",
                color: "var(--color-muted)",
                transition: "color 200ms ease",
              }}
            >
              Explore collection
            </span>
            <span
              style={{
                color: "var(--color-gold)",
                fontSize: "14px",
                transform: "translateX(0)",
                transition: "transform 300ms ease",
                display: "inline-block",
              }}
              className="group-hover:translate-x-2"
            >
              →
            </span>
          </div>
        </div>

        {/* Image panel */}
        <div
          style={{
            order: imageRight ? 2 : 1,
            position: "relative",
            overflow: "hidden",
            backgroundColor: "var(--color-gold-light)",
          }}
        >
          <Image
            src={cat.hero_image_url}
            alt={cat.name}
            fill
            sizes="340px"
            className="object-cover object-center"
            style={{
              transition: "transform 700ms cubic-bezier(0.22,1,0.36,1)",
            }}
          />
          {/* Subtle dark vignette */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0) 60%)",
              transition: "opacity 400ms ease",
            }}
          />
        </div>
      </Link>
    </Reveal>
  );
}

/* ── Mobile card ─────────────────────────────────────────── */

function MobileCard({ cat, index }) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <Reveal delay={Math.min(index + 1, 4)}>
      <Link
        href={`/shop/${cat.slug}`}
        className="group block"
        style={{ textDecoration: "none" }}
      >
        <div
          style={{
            position: "relative",
            aspectRatio: "4/3",
            overflow: "hidden",
            backgroundColor: "var(--color-gold-light)",
          }}
        >
          <Image
            src={cat.hero_image_url}
            alt={cat.name}
            fill
            sizes="100vw"
            className="object-cover object-center"
            style={{
              transition: "transform 700ms ease",
            }}
          />

          {/* Gradient */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)",
            }}
          />

          {/* Content overlay */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "1.5rem",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <div>
              {/* Ghost number */}
              <span
                className="font-heading"
                style={{
                  fontSize: "3.5rem",
                  lineHeight: 1,
                  color: "white",
                  opacity: 0.15,
                  display: "block",
                  marginBottom: "0.4rem",
                  userSelect: "none",
                }}
              >
                {num}
              </span>
              <h3
                className="font-heading"
                style={{
                  fontSize: "1.35rem",
                  color: "white",
                  lineHeight: 1.1,
                }}
              >
                {cat.name}
              </h3>
            </div>

            {/* Arrow badge */}
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "1px solid rgba(255,255,255,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ color: "var(--color-gold)", fontSize: "16px" }}>
                →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
