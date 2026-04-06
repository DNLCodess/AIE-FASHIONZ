import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

/**
 * CategoryShowcase — editorial text-below-image grid.
 *
 * Pattern used by COS, Massimo Dutti, Arket:
 * — Portrait image (no text overlay — image speaks for itself)
 * — Below: gold index number · category name · description · CTA
 *
 * This gives users instant clarity on what each category contains
 * without having to decode text overlaid on a busy image.
 *
 * Grid: 2-col mobile → 3-col desktop.
 * All 6 categories carry equal visual weight (no forced asymmetry).
 */

export default function CategoryShowcase({ categories }) {
  if (!categories?.length) return null;

  const cats = categories.slice(0, 6);

  return (
    <section
      style={{
        backgroundColor: "var(--color-background)",
        borderTop: "1px solid var(--color-border)",
      }}
      className="py-16 md:py-24"
    >
      <div className="container">

        {/* ── Section header ─────────────────────────────── */}
        <Reveal className="mb-12 md:mb-16">
          <p
            className="font-body uppercase mb-4"
            style={{ fontSize: "14px", letterSpacing: "0.4em", color: "var(--color-gold)" }}
          >
            Collections
          </p>
          <h2
            className="font-heading"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              color: "var(--color-foreground)",
              lineHeight: 1.05,
            }}
          >
            Six categories.
            <br />
            <em style={{ color: "var(--color-muted)", fontStyle: "normal" }}>
              One standard.
            </em>
          </h2>
        </Reveal>

        {/* ── Category grid ──────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
          {cats.map((cat, i) => (
            <Reveal key={cat.slug} delay={Math.min(i + 1, 5)}>
              <Link
                href={`/shop/${cat.slug}`}
                className="group block"
                style={{ textDecoration: "none" }}
              >

                {/* ── Image ──────────────────────────────── */}
                <div
                  className="relative overflow-hidden"
                  style={{
                    aspectRatio: "3/4",
                    backgroundColor: "var(--color-gold-light)",
                    marginBottom: "1.25rem",
                  }}
                >
                  {cat.hero_image_url && (
                    <Image
                      src={cat.hero_image_url}
                      alt={cat.name}
                      fill
                      sizes="(min-width: 768px) 33vw, 50vw"
                      className="object-cover object-center"
                      style={{
                        transition: "transform 700ms cubic-bezier(0.22,1,0.36,1)",
                      }}
                    />
                  )}

                  {/* Hover — subtle scrim appears */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.12)",
                      transition: "opacity 350ms ease",
                    }}
                  />
                </div>

                {/* ── Text block ─────────────────────────── */}
                <div>
                  {/* Gold index */}
                  <span
                    className="font-body block"
                    style={{
                      fontSize: "12px",
                      letterSpacing: "0.4em",
                      color: "var(--color-gold)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Category name */}
                  <h3
                    className="font-heading"
                    style={{
                      fontSize: "clamp(1.05rem, 2.2vw, 1.35rem)",
                      color: "var(--color-foreground)",
                      lineHeight: 1.15,
                      marginBottom: "0.6rem",
                      transition: "color 200ms ease",
                    }}
                  >
                    {cat.name}
                  </h3>

                  {/* Description — clamped to 2 lines on mobile */}
                  {cat.description && (
                    <p
                      className="font-body"
                      style={{
                        fontSize: "15px",
                        color: "var(--color-muted)",
                        lineHeight: 1.6,
                        marginBottom: "1rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {cat.description}
                    </p>
                  )}

                  {/* CTA */}
                  <span
                    className="font-body uppercase inline-flex items-center gap-2"
                    style={{
                      fontSize: "13px",
                      letterSpacing: "0.2em",
                      color: "var(--color-foreground)",
                      fontWeight: 500,
                      borderBottom: "1px solid var(--color-border)",
                      paddingBottom: "3px",
                      transition: "border-color 200ms ease, color 200ms ease",
                    }}
                  >
                    Shop Collection
                    <span
                      style={{
                        color: "var(--color-gold)",
                        transition: "transform 200ms ease",
                        display: "inline-block",
                      }}
                    >
                      →
                    </span>
                  </span>
                </div>

              </Link>
            </Reveal>
          ))}
        </div>

        {/* ── Footer CTA ─────────────────────────────────── */}
        <Reveal className="mt-14 md:mt-20 text-center">
          <Link
            href="/shop"
            className="inline-block font-body uppercase bg-gold hover:bg-gold-dark text-foreground transition-colors duration-200 w-full sm:w-auto"
            style={{ fontSize: "16px", padding: "18px 56px", letterSpacing: "0.2em" }}
          >
            View All Collections
          </Link>
        </Reveal>

      </div>
    </section>
  );
}
