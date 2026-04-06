import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

/**
 * EditorialGrid — "The SS25 Edit"
 *
 * Replaces the previous auto-scrolling image strip which gave users no
 * context about what they were looking at. This section is purposeful:
 *  - Clear section header tells users what this is
 *  - Each image links to a specific category
 *  - Labels below every image communicate exactly where each click leads
 *  - 4-col desktop, 2-col mobile — readable, never crowded
 */

const ITEMS = [
  {
    src:   "/promotions/image2.jpeg",
    tag:   "New Season",
    title: "SS25 Collection",
    desc:  "All the new arrivals, in one place.",
    href:  "/shop",
  },
  {
    src:   "/promotions/image5.jpeg",
    tag:   "Party & Dinner",
    title: "Occasion Wear",
    desc:  "Dress for every event that matters.",
    href:  "/shop/party-dinner-wear",
  },
  {
    src:   "/promotions/image8.jpeg",
    tag:   "Premium",
    title: "Luxury Fabrics",
    desc:  "Hand-picked textiles, sold by the metre.",
    href:  "/shop/luxury-fabrics",
  },
  {
    src:   "/promotions/image4.jpeg",
    tag:   "Accessories",
    title: "Bags & Shoes",
    desc:  "Statement pieces that complete the look.",
    href:  "/shop/bags-shoes",
  },
];

export default function PromoImageStrip() {
  return (
    <section
      style={{
        backgroundColor: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
      }}
      className="py-16 md:py-24"
    >
      <div className="container">

        {/* ── Header ─────────────────────────────────────── */}
        <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-14">
          <div>
            <p
              className="font-body uppercase mb-3"
              style={{ fontSize: "14px", letterSpacing: "0.4em", color: "var(--color-gold)" }}
            >
              Curated Picks
            </p>
            <h2
              className="font-heading"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 3rem)",
                color: "var(--color-foreground)",
                lineHeight: 1.05,
              }}
            >
              The SS25 Edit
            </h2>
          </div>
          <Link
            href="/shop"
            className="font-body uppercase shrink-0"
            style={{
              fontSize: "14px",
              letterSpacing: "0.2em",
              color: "var(--color-foreground)",
              textDecoration: "none",
              borderBottom: "1px solid var(--color-border)",
              paddingBottom: "3px",
              whiteSpace: "nowrap",
            }}
          >
            See All →
          </Link>
        </Reveal>

        {/* ── 4-col editorial grid ──────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {ITEMS.map((item, i) => (
            <Reveal key={item.href + i} delay={Math.min(i + 1, 4)}>
              <Link
                href={item.href}
                className="group block"
                style={{ textDecoration: "none" }}
              >
                {/* Image */}
                <div
                  className="relative overflow-hidden"
                  style={{
                    aspectRatio: "3/4",
                    backgroundColor: "var(--color-gold-light)",
                    marginBottom: "1rem",
                  }}
                >
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover object-center"
                    style={{ transition: "transform 700ms cubic-bezier(0.22,1,0.36,1)" }}
                    loading="lazy"
                  />
                  {/* Hover scrim */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.1)",
                      transition: "opacity 350ms ease",
                    }}
                  />
                </div>

                {/* Text below image */}
                <p
                  className="font-body uppercase"
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.35em",
                    color: "var(--color-gold)",
                    marginBottom: "0.35rem",
                  }}
                >
                  {item.tag}
                </p>
                <h3
                  className="font-heading"
                  style={{
                    fontSize: "clamp(1rem, 2vw, 1.2rem)",
                    color: "var(--color-foreground)",
                    lineHeight: 1.2,
                    marginBottom: "0.4rem",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="font-body"
                  style={{
                    fontSize: "14px",
                    color: "var(--color-muted)",
                    lineHeight: 1.55,
                  }}
                >
                  {item.desc}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
