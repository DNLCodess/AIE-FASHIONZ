import Image from "next/image";
import Link from "next/link";
import { getFeaturedProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import ProductGrid from "@/components/product/ProductGrid";
import NewsletterForm from "@/components/home/NewsletterForm";
import Marquee from "@/components/ui/Marquee";
import Reveal from "@/components/ui/Reveal";
import CategoryShowcase from "@/components/home/CategoryShowCase";
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
      "destination for luxury women's fashion. Premium fabrics, bags, jewellery, party wear and more. Free US shipping. Worldwide delivery.",
    url: "/",
    images: [
      {
        url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=630&fit=crop&q=90",
        width: 1200,
        height: 630,
        alt: "Aiefashion Luxury Fashion",
      },
    ],
  },
  twitter: {
    title: "Aiefashion | Luxury Fashion for Women — Premium Fashion",
    description:
      "destination for luxury women's fashion. Premium fabrics, bags, jewellery, party wear and more.",
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=630&fit=crop&q=90"],
  },
};

const HERO_IMG =
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&h=900&fit=crop&crop=top&q=90&auto=format";
const QUALITY_IMG =
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1000&fit=crop&crop=center&q=90&auto=format";

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

      {/* ─────────────────────────────────────────────────────────
          HERO — full-bleed image with text overlay
      ───────────────────────────────────────────────────────── */}
      <section
        className="relative -mt-16 md:-mt-20 overflow-hidden"
        style={{ minHeight: "100svh" }}
      >
        {/* Background image — full bleed on all screen sizes */}
        <div className="absolute inset-0">
          <Image
            src={HERO_IMG}
            alt="Aiefashion luxury fashion"
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
          {/* Gradient — stronger at bottom on mobile, balanced on desktop */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.15) 100%)",
            }}
          />
        </div>

        {/* Content */}
        <div
          className="relative z-10 flex flex-col justify-end items-center text-center px-6"
          style={{ minHeight: "100svh", paddingBottom: "5rem", paddingTop: "7rem" }}
        >
          <p
            className="hero-up font-body uppercase tracking-[0.4em] mb-5"
            style={{ animationDelay: "0.1s", fontSize: "10px", color: "rgba(255,255,255,0.55)" }}
          >
            New Arrivals — SS25
          </p>

          <h1
            className="hero-up font-heading leading-[0.9] tracking-[-0.02em] text-white mb-0"
            style={{ animationDelay: "0.2s", fontSize: "clamp(3.5rem, 10vw, 9rem)" }}
          >
            Dress
            <br />
            with
            <br />
            <em style={{ color: "var(--color-gold)" }}>intention.</em>
          </h1>

          <div
            className="hero-line mx-auto my-8"
            style={{
              animationDelay: "0.4s",
              height: "1px",
              width: "3rem",
              backgroundColor: "var(--color-gold)",
            }}
          />

          <p
            className="hero-up font-body leading-relaxed max-w-xs mb-10"
            style={{ animationDelay: "0.5s", fontSize: "15px", color: "rgba(255,255,255,0.6)" }}
          >
            Six categories. One standard — luxury.
          </p>

          <div
            className="hero-up flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            style={{ animationDelay: "0.65s" }}
          >
            <Link
              href="/shop"
              className="w-full sm:w-auto font-body uppercase tracking-widest text-sm px-10 py-4 bg-gold hover:bg-gold-dark text-foreground transition-colors duration-200 text-center"
            >
              Shop Now
            </Link>
            <Link
              href="/shop/party-dinner-wear"
              className="w-full sm:w-auto font-body uppercase tracking-widest text-sm px-10 py-4 border transition-colors duration-200 text-center"
              style={{ borderColor: "rgba(255,255,255,0.35)", color: "rgba(255,255,255,0.85)" }}
            >
              New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          MARQUEE TICKER
      ───────────────────────────────────────────────────────── */}
      <Marquee />

      {/* ─────────────────────────────────────────────────────────
          SHOP THE LATEST LOOKS — Featured products near top
      ───────────────────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section
          style={{
            backgroundColor: "var(--color-surface)",
            borderTop: "1px solid var(--color-border)",
          }}
          className="py-16 md:py-24"
        >
          <div className="container">
            {/* Header */}
            <Reveal className="mb-4">
              <p
                className="font-body uppercase tracking-[0.4em] mb-3"
                style={{ fontSize: "10px", color: "var(--color-subtle)" }}
              >
                New season
              </p>
              <h2
                className="font-heading leading-none"
                style={{ color: "var(--color-foreground)", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
              >
                Shop The Latest Looks
              </h2>
            </Reveal>
            <Reveal reveal="fade" className="mb-12">
              <p
                className="font-body"
                style={{ fontSize: "14px", color: "var(--color-muted)", maxWidth: "42ch" }}
              >
                Refresh your wardrobe with these super cute collections.
              </p>
            </Reveal>

            <ProductGrid products={featured} />

            <Reveal className="mt-12 text-center">
              <Link
                href="/shop"
                className="inline-block font-body uppercase tracking-widest text-sm px-10 py-4 bg-gold hover:bg-gold-dark text-foreground transition-colors duration-200"
              >
                View More Collections
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────
          QUALITY STATEMENT — text + image two-column
      ───────────────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "var(--color-background)",
          borderTop: "1px solid var(--color-border)",
        }}
        className="py-16 md:py-24"
      >
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Text */}
            <Reveal>
              <p
                className="font-body uppercase mb-5"
                style={{ fontSize: "11px", letterSpacing: "0.4em", color: "var(--color-gold)" }}
              >
                The AIE Standard
              </p>
              <h2
                className="font-heading mb-6"
                style={{
                  fontSize: "clamp(2rem, 3.5vw, 3rem)",
                  color: "var(--color-foreground)",
                  lineHeight: 1.05,
                }}
              >
                Quality never
                <br />
                goes out of style.
              </h2>
              <p
                className="font-body leading-relaxed mb-4"
                style={{ fontSize: "15px", color: "var(--color-muted)", maxWidth: "46ch" }}
              >
                Aiefashion is your destination for luxury women&apos;s fashion based in Lanham,
                Maryland. We are a fast-growing boutique because we always put customers first. A
                customer-centred shopping experience has always been our goal, and we pride ourselves
                on comprehensive policies that put us in a realm above our competitors.
              </p>
              <p
                className="font-body leading-relaxed mb-8"
                style={{ fontSize: "15px", color: "var(--color-muted)", maxWidth: "46ch" }}
              >
                Every piece is hand-selected to meet the AIE standard — no compromises on quality,
                style, or delivery.
              </p>
              <Link
                href="/about"
                className="font-body uppercase tracking-[0.3em] text-foreground hover:text-gold transition-colors duration-200"
                style={{ fontSize: "12px" }}
              >
                Learn More →
              </Link>
            </Reveal>

            {/* Image */}
            <Reveal reveal="fade">
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: "4/5", backgroundColor: "var(--color-gold-light)" }}
              >
                <Image
                  src={QUALITY_IMG}
                  alt="Aiefashion quality fashion"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover object-center"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          OUR COLLECTIONS — image grid (CategoryShowcase)
      ───────────────────────────────────────────────────────── */}
      <CategoryShowcase categories={categories} />

      {/* ─────────────────────────────────────────────────────────
          NEWSLETTER — dark section, gold accent
      ───────────────────────────────────────────────────────── */}
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
                className="font-body uppercase tracking-[0.4em] mb-5"
                style={{ fontSize: "10px", color: "var(--color-gold)" }}
              >
                Join the inner circle
              </p>
              <h2
                className="font-heading mb-4"
                style={{
                  color: "var(--color-background)",
                  fontSize: "clamp(1.8rem, 4vw, 3rem)",
                  lineHeight: 1.1,
                }}
              >
                First access.
                <br />
                Exclusive offers.
              </h2>
              <p
                className="font-body mb-10"
                style={{ fontSize: "15px", color: "rgba(253,251,247,0.55)", lineHeight: 1.7 }}
              >
                Sign up and receive 10% off your first order.
              </p>
            </Reveal>

            <Reveal reveal="up" delay={2}>
              <NewsletterForm dark />
              <p
                className="font-body mt-5"
                style={{ fontSize: "12px", color: "rgba(253,251,247,0.3)" }}
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
