import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

/**
 * CategoryShowcase — Image grid layout.
 * 2-col on mobile, 3-col on tablet/desktop.
 * Each card: portrait image with name overlay + arrow badge.
 */
export default function CategoryShowcase({ categories }) {
  if (!categories?.length) return null;

  return (
    <section
      style={{ backgroundColor: "var(--color-background)" }}
      className="py-16 md:py-24"
    >
      <div className="container">
        {/* Section header */}
        <Reveal className="mb-10 md:mb-12">
          <p
            className="font-body uppercase mb-3"
            style={{ fontSize: "11px", letterSpacing: "0.4em", color: "var(--color-subtle)" }}
          >
            Collections
          </p>
          <h2
            className="font-heading"
            style={{
              fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
              color: "var(--color-foreground)",
              lineHeight: 1.1,
            }}
          >
            Our Collections
          </h2>
        </Reveal>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {categories.slice(0, 6).map((cat, i) => (
            <Reveal key={cat.slug} delay={Math.min(i + 1, 4)}>
              <Link href={`/shop/${cat.slug}`} className="group block" style={{ textDecoration: "none" }}>
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: "3/4", backgroundColor: "var(--color-gold-light)" }}
                >
                  {cat.hero_image_url && (
                    <Image
                      src={cat.hero_image_url}
                      alt={cat.name}
                      fill
                      sizes="(min-width: 768px) 33vw, 50vw"
                      className="object-cover object-center"
                      style={{ transition: "transform 700ms cubic-bezier(0.22,1,0.36,1)" }}
                    />
                  )}

                  {/* Dark gradient */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)",
                    }}
                  />

                  {/* Content overlay */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "1.25rem",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <h3
                        className="font-heading text-white"
                        style={{ fontSize: "clamp(0.9rem, 2vw, 1.15rem)", lineHeight: 1.1 }}
                      >
                        {cat.name}
                      </h3>
                      <span
                        className="font-body mt-1 flex items-center gap-1"
                        style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}
                      >
                        Shop now
                        <span style={{ color: "var(--color-gold)" }}>→</span>
                      </span>
                    </div>

                    {/* Arrow badge */}
                    <div
                      className="shrink-0 hidden sm:flex items-center justify-center"
                      style={{
                        width: "36px",
                        height: "36px",
                        border: "1px solid rgba(255,255,255,0.3)",
                        transition: "border-color 200ms ease",
                      }}
                    >
                      <span style={{ color: "var(--color-gold)", fontSize: "14px" }}>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal className="mt-10 text-center">
          <Link
            href="/shop"
            className="inline-block font-body uppercase tracking-widest text-sm px-10 py-4 bg-gold hover:bg-gold-dark text-foreground transition-colors duration-200"
          >
            View More Collections
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
