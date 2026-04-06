import Image from "next/image";
import Link from "next/link";
import { getFeaturedProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import ProductGrid from "@/components/product/ProductGrid";
import NewsletterForm from "@/components/home/NewsletterForm";
import Marquee from "@/components/ui/Marquee";
import Reveal from "@/components/ui/Reveal";
import CategoryShowcase from "@/components/home/CategoryShowCase";
import VideoHero from "@/components/home/VideoHero";
import TrustBar from "@/components/home/TrustBar";
import PromoDualPanel from "@/components/home/PromoDualPanel";
import JsonLd from "@/components/seo/JsonLd";

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aiefashion.com";

export const metadata = {
  title: "Aiefashion | Luxury Fashion for Women — Premium Fashion",
  description:
    "Aiefashion — your destination for luxury women's fashion. Shop premium fabrics, designer bags & shoes, gold jewellery, party & occasion wear, children's fashion and body shapers. Free US shipping over $75. Worldwide delivery.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Aiefashion | Luxury Fashion for Women — Premium Fashion",
    description:
      "Destination for luxury women's fashion. Premium fabrics, bags, jewellery, party wear and more. Free US shipping. Worldwide delivery.",
    url: "/",
    images: [
      {
        url: `${SITE_URL}/promotions/image1.jpeg`,
        width: 1200,
        height: 630,
        alt: "Aiefashion Luxury Fashion",
      },
    ],
  },
  twitter: {
    title: "Aiefashion | Luxury Fashion for Women — Premium Fashion",
    description:
      "Destination for luxury women's fashion. Premium fabrics, bags, jewellery, party wear and more.",
    images: [`${SITE_URL}/promotions/image1.jpeg`],
  },
};

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
  ]);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Aiefashion",
    url: SITE_URL,
    description:
      "US-based luxury fashion boutique for women. Premium fabrics, bags & shoes, jewellery, party wear, children's wear and body shapers. Worldwide delivery.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Lanham, Maryland",
      addressLocality: "Lanham",
      addressRegion: "MD",
      addressCountry: "US",
    },
    sameAs: [
      "https://www.instagram.com/aiefashion",
      "https://www.facebook.com/aiefashion",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Aiefashion",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />

      {/* ═══════════════════════════════════════════════════════
          1. HERO — full-viewport video background
      ═══════════════════════════════════════════════════════ */}
      <VideoHero />

      {/* ═══════════════════════════════════════════════════════
          2. MARQUEE TICKER
      ═══════════════════════════════════════════════════════ */}
      <Marquee />

      {/* ═══════════════════════════════════════════════════════
          3. TRUST BAR — 4 signals
      ═══════════════════════════════════════════════════════ */}
      <TrustBar />

      {/* ═══════════════════════════════════════════════════════
          4. SHOP THE LATEST — featured products (first 4)
      ═══════════════════════════════════════════════════════ */}
      {featured.length > 0 && (
        <section
          style={{
            backgroundColor: "var(--color-surface)",
            borderTop: "1px solid var(--color-border)",
          }}
          className="py-16 md:py-24"
        >
          <div className="container">
            <Reveal className="mb-3">
              <p
                className="font-body uppercase mb-4"
                style={{ fontSize: "14px", letterSpacing: "0.35em", color: "var(--color-gold)" }}
              >
                New Season
              </p>
              <h2
                className="font-heading"
                style={{
                  fontSize: "clamp(1.75rem, 4vw, 3rem)",
                  color: "var(--color-foreground)",
                  lineHeight: 1.05,
                }}
              >
                Shop the Latest Looks
              </h2>
            </Reveal>
            <Reveal reveal="fade" className="mb-12">
              <p
                className="font-body"
                style={{ fontSize: "16px", color: "var(--color-muted)", maxWidth: "42ch", lineHeight: 1.6 }}
              >
                Refresh your wardrobe with our carefully curated collections — each piece meeting the AIE standard.
              </p>
            </Reveal>

            <ProductGrid products={featured.slice(0, 4)} />

            <Reveal className="mt-12 text-center">
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
      )}

      {/* ═══════════════════════════════════════════════════════
          5. EDITORIAL SPLIT — image left / brand statement right
      ═══════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: "var(--color-foreground)" }}>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image panel */}
          <div
            className="relative overflow-hidden"
            style={{ minHeight: "clamp(280px, 65vw, 640px)" }}
          >
            <Image
              src="/promotions/image3.jpeg"
              alt="Aiefashion editorial — the AIE standard"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-center"
              loading="lazy"
            />
            {/* Subtle bottom-up tint to anchor text */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)",
              }}
            />
          </div>

          {/* Text panel */}
          <Reveal
            className="flex flex-col justify-center"
            style={{ padding: "clamp(2.5rem, 5vw, 5rem)" }}
          >
            <p
              className="font-body uppercase mb-6"
              style={{ fontSize: "14px", letterSpacing: "0.4em", color: "var(--color-gold)" }}
            >
              The AIE Standard
            </p>
            <h2
              className="font-heading mb-6"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 4rem)",
                color: "var(--color-background)",
                lineHeight: 1.0,
                letterSpacing: "-0.01em",
              }}
            >
              Quality never<br />
              goes out<br />
              of style.
            </h2>
            <p
              className="font-body mb-4"
              style={{
                fontSize: "16px",
                color: "rgba(253,251,247,0.65)",
                lineHeight: 1.75,
                maxWidth: "42ch",
              }}
            >
              Aiefashion is your destination for luxury women&apos;s fashion based in Lanham, Maryland.
              A fast-growing boutique because we always put customers first.
            </p>
            <p
              className="font-body mb-10"
              style={{
                fontSize: "16px",
                color: "rgba(253,251,247,0.65)",
                lineHeight: 1.75,
                maxWidth: "42ch",
              }}
            >
              Every piece is hand-selected to meet the AIE standard — no compromises on quality,
              style, or delivery.
            </p>
            <Link
              href="/about"
              className="font-body uppercase"
              style={{
                fontSize: "14px",
                letterSpacing: "0.3em",
                color: "var(--color-background)",
                borderBottom: "1px solid rgba(253,251,247,0.35)",
                paddingBottom: "4px",
                width: "fit-content",
                transition: "border-color 200ms ease",
              }}
            >
              Our Story →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          6. DUAL-PANEL CATEGORY SPOTLIGHT
      ═══════════════════════════════════════════════════════ */}
      <PromoDualPanel />

      {/* ═══════════════════════════════════════════════════════
          7. CATEGORY SHOWCASE — editorial asymmetric grid
      ═══════════════════════════════════════════════════════ */}
      <CategoryShowcase categories={categories} />

      {/* ═══════════════════════════════════════════════════════
          8. MID-PAGE VIDEO STATEMENT — full-bleed with overlay
      ═══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: "clamp(380px, 70vh, 720px)" }}
      >
        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/promotions/image9.jpeg"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        >
          <source src="/promotions/video3.mp4" type="video/mp4" />
          <source src="/promotions/video2.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.58)" }}
        />

        {/* Content */}
        <div
          className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6"
          style={{ minHeight: "clamp(380px, 70vh, 720px)" }}
        >
          <Reveal reveal="up">
            <p
              className="font-body uppercase text-white mb-5"
              style={{ fontSize: "14px", letterSpacing: "0.45em", opacity: 0.7 }}
            >
              The Aiefashion Way
            </p>
            <h2
              className="font-heading text-white mb-10"
              style={{
                fontSize: "clamp(2.2rem, 7vw, 6.5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
              }}
            >
              A New Standard<br />
              <em style={{ color: "var(--color-gold)" }}>in Fashion.</em>
            </h2>
            <Link
              href="/shop"
              className="inline-block font-body uppercase bg-gold hover:bg-gold-dark text-foreground transition-colors duration-200 w-full sm:w-auto"
              style={{ fontSize: "16px", padding: "18px 56px", letterSpacing: "0.2em" }}
            >
              Shop the Collection
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          9. URGENCY BANNER — promo code, full gold strip
      ═══════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: "var(--color-gold)" }}>
        <div
          className="container flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ paddingBlock: "clamp(2.5rem, 5vw, 4rem)" }}
        >
          <div className="text-center md:text-left">
            <p
              className="font-body uppercase mb-2"
              style={{ fontSize: "14px", letterSpacing: "0.35em", color: "var(--color-foreground)", opacity: 0.65, fontWeight: 600 }}
            >
              Limited Time Offer
            </p>
            <h2
              className="font-heading"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                color: "var(--color-foreground)",
                lineHeight: 1.05,
                marginBottom: "0.5rem",
              }}
            >
              10% Off Everything
            </h2>
            <p
              className="font-body"
              style={{ fontSize: "17px", color: "var(--color-foreground)", opacity: 0.75, lineHeight: 1.5 }}
            >
              Use code{" "}
              <strong
                style={{
                  fontFamily: "var(--font-body)",
                  letterSpacing: "0.1em",
                  color: "var(--color-foreground)",
                  fontSize: "18px",
                }}
              >
                AIETEN
              </strong>{" "}
              at checkout
            </p>
          </div>
          <Link
            href="/shop"
            className="font-body uppercase text-center shrink-0 w-full md:w-auto"
            style={{
              fontSize: "16px",
              fontWeight: 600,
              padding: "18px 56px",
              backgroundColor: "var(--color-foreground)",
              color: "var(--color-background)",
              letterSpacing: "0.18em",
              transition: "opacity 200ms ease",
              minHeight: "56px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Shop &amp; Save 10%
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          10. LATEST COLLECTIONS — remaining featured products
      ═══════════════════════════════════════════════════════ */}
      {featured.length > 4 && (
        <section
          style={{
            backgroundColor: "var(--color-surface)",
            borderTop: "1px solid var(--color-border)",
          }}
          className="py-16 md:py-24"
        >
          <div className="container">
            <Reveal className="mb-3">
              <p
                className="font-body uppercase mb-4"
                style={{ fontSize: "14px", letterSpacing: "0.35em", color: "var(--color-gold)" }}
              >
                Trending Now
              </p>
              <h2
                className="font-heading"
                style={{
                  fontSize: "clamp(1.75rem, 4vw, 3rem)",
                  color: "var(--color-foreground)",
                  lineHeight: 1.05,
                }}
              >
                Latest Collections
              </h2>
            </Reveal>
            <Reveal reveal="fade" className="mb-12">
              <p
                className="font-body"
                style={{ fontSize: "16px", color: "var(--color-muted)", maxWidth: "42ch", lineHeight: 1.6 }}
              >
                New arrivals carefully curated for the modern woman who demands luxury.
              </p>
            </Reveal>

            <ProductGrid products={featured.slice(4)} />

            <Reveal className="mt-12 text-center">
              <Link
                href="/shop"
                className="inline-block font-body uppercase bg-gold hover:bg-gold-dark text-foreground transition-colors duration-200 w-full sm:w-auto"
                style={{ fontSize: "16px", padding: "18px 56px", letterSpacing: "0.2em" }}
              >
                Shop More
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          11. NEWSLETTER — dark section, gold accent
      ═══════════════════════════════════════════════════════ */}
      <section
        style={{ backgroundColor: "var(--color-foreground)" }}
        className="py-24 md:py-32"
      >
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <Reveal reveal="up">
              <div className="flex items-center justify-center gap-4 mb-10">
                <div
                  className="h-px flex-1 max-w-16"
                  style={{ backgroundColor: "rgba(212,175,55,0.3)" }}
                />
                <span style={{ color: "var(--color-gold)", fontSize: "18px" }}>◆</span>
                <div
                  className="h-px flex-1 max-w-16"
                  style={{ backgroundColor: "rgba(212,175,55,0.3)" }}
                />
              </div>

              <p
                className="font-body uppercase mb-5"
                style={{ fontSize: "14px", letterSpacing: "0.4em", color: "var(--color-gold)" }}
              >
                Join the inner circle
              </p>
              <h2
                className="font-heading mb-4"
                style={{
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  color: "var(--color-background)",
                  lineHeight: 1.05,
                }}
              >
                First access.<br />
                Exclusive offers.
              </h2>
              <p
                className="font-body mb-10"
                style={{ fontSize: "17px", color: "rgba(253,251,247,0.55)", lineHeight: 1.7 }}
              >
                Sign up and receive 10% off your first order. No spam, ever.
              </p>
            </Reveal>

            <Reveal reveal="up" delay={2}>
              <NewsletterForm dark />
              <p
                className="font-body mt-5"
                style={{ fontSize: "14px", color: "rgba(253,251,247,0.3)" }}
              >
                No spam. Unsubscribe at any time. We respect your privacy.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
