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
  title: "Aiefashion | Luxury Fashion for Women — UK Boutique",
  description:
    "Aiefashion — the UK's destination for luxury women's fashion. Shop premium fabrics, designer bags & shoes, gold jewellery, party & occasion wear, children's fashion and body shapers. Free UK delivery over £150. Worldwide shipping.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Aiefashion | Luxury Fashion for Women — UK Boutique",
    description:
      "UK's destination for luxury women's fashion. Premium fabrics, bags, jewellery, party wear and more. Free UK delivery. Worldwide shipping.",
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
    title: "Aiefashion | Luxury Fashion for Women — UK Boutique",
    description:
      "UK's destination for luxury women's fashion. Premium fabrics, bags, jewellery, party wear and more.",
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=630&fit=crop&q=90"],
  },
};

const HERO_A =
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&h=1200&fit=crop&crop=top&q=90&auto=format";
const HERO_B =
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&h=1200&fit=crop&crop=top&q=90&auto=format";
const EDITORIAL =
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&h=700&fit=crop&crop=center&q=90&auto=format";

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(4),
    getCategories(),
  ]);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Aiefashion",
    url: SITE_URL,
    description:
      "UK-based luxury fashion boutique for women. Premium fabrics, bags & shoes, jewellery, party wear, children's wear and body shapers. Worldwide delivery.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "GB",
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
          HERO — Triptych layout
          Desktop: large left image / centre editorial text / right image
          Mobile:  full-bleed image + text overlay
      ───────────────────────────────────────────────────────── */}
      <section
        className="relative -mt-16 md:-mt-20 overflow-hidden"
        style={{ minHeight: "100svh" }}
      >
        {/* ── Mobile: single full-bleed image ── */}
        <div className="absolute inset-0 md:hidden">
          <Image
            src={HERO_A}
            alt="Aiefashion luxury fashion"
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.08) 100%)",
            }}
          />
        </div>

        {/* ── Desktop: triptych ── */}
        <div
          className="hidden md:grid absolute inset-0"
          style={{ gridTemplateColumns: "1fr 480px 1fr" }}
        >
          {/* Left image panel */}
          <div className="relative overflow-hidden">
            <Image
              src={HERO_A}
              alt=""
              fill
              priority
              sizes="33vw"
              className="object-cover object-top hero-scale"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, rgba(253,251,247,0) 70%, rgba(253,251,247,0.95) 100%)",
              }}
            />
          </div>

          {/* Centre ivory panel — text lives here */}
          <div style={{ backgroundColor: "var(--color-background)" }} />

          {/* Right image panel */}
          <div className="relative overflow-hidden">
            <Image
              src={HERO_B}
              alt=""
              fill
              priority
              sizes="33vw"
              className="object-cover object-top hero-scale"
              style={{ animationDelay: "0.3s" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to left, rgba(253,251,247,0) 70%, rgba(253,251,247,0.95) 100%)",
              }}
            />
          </div>
        </div>

        {/* ── Content layer — sits over everything ── */}
        <div
          className="relative z-10 flex flex-col justify-end md:justify-center items-center text-center px-6"
          style={{
            minHeight: "100svh",
            paddingBottom: "5rem",
            paddingTop: "7rem",
          }}
        >
          {/* Season eyebrow */}
          <p
            className="hero-up font-body uppercase tracking-[0.4em] mb-6 text-white md:text-opacity-100"
            style={{
              animationDelay: "0.1s",
              fontSize: "10px",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            <span className="md:hidden">New Season — SS25</span>
            <span
              className="hidden md:inline"
              style={{ color: "var(--color-subtle)" }}
            >
              New Season — SS25
            </span>
          </p>

          {/* Headline — oversized editorial serif */}
          <h1
            className="hero-up font-heading leading-[0.88] tracking-[-0.02em] text-white mb-0"
            style={{
              animationDelay: "0.2s",
              fontSize: "clamp(4rem, 11vw, 10rem)",
            }}
          >
            <span className="md:hidden">
              Dress
              <br />
              with
              <br />
              <em style={{ color: "var(--color-gold)" }}>intention.</em>
            </span>
            <span
              className="hidden md:block"
              style={{ color: "var(--color-foreground)" }}
            >
              Dress
              <br />
              with
              <br />
              <em style={{ color: "var(--color-gold)" }}>intention.</em>
            </span>
          </h1>

          {/* Gold rule */}
          <div
            className="hero-line mx-auto my-8"
            style={{
              animationDelay: "0.4s",
              height: "1px",
              width: "3rem",
              backgroundColor: "var(--color-gold)",
            }}
          />

          {/* Sub-copy */}
          <p
            className="hero-up font-body leading-relaxed max-w-xs mb-10"
            style={{
              animationDelay: "0.5s",
              fontSize: "15px",
              color: "rgba(255,255,255,0.65)",
            }}
          >
            <span className="md:hidden">
              Six categories. One standard — luxury.
            </span>
            <span
              className="hidden md:block"
              style={{ color: "var(--color-muted)" }}
            >
              Six categories. One standard — luxury.
              <br />
              Premium fashion for the woman who knows.
            </span>
          </p>

          {/* CTAs */}
          <div
            className="hero-up flex flex-col sm:flex-row items-center gap-4"
            style={{ animationDelay: "0.65s" }}
          >
            <Link
              href="/shop"
              className="font-body uppercase tracking-widest text-sm px-10 py-4 bg-gold hover:bg-gold-dark text-foreground transition-colors duration-200"
            >
              Shop Now
            </Link>
            <Link
              href="/shop/party-dinner-wear"
              className="font-body uppercase tracking-widest text-sm px-10 py-4 transition-colors duration-200 border"
              style={{
                borderColor: "rgba(255,255,255,0.35)",
                color: "rgba(255,255,255,0.85)",
              }}
            >
              <span className="md:hidden">New Arrivals</span>
              <span
                className="hidden md:inline"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-muted)",
                }}
              >
                New Arrivals
              </span>
            </Link>
          </div>

          {/* Scroll indicator — desktop */}
          <div
            className="hidden md:flex hero-fade flex-col items-center gap-3 absolute bottom-10"
            style={{ animationDelay: "1.4s" }}
          >
            <div
              className="scroll-line"
              style={{
                width: "1px",
                height: "3rem",
                backgroundColor: "var(--color-border)",
              }}
            />
            <span
              className="font-body uppercase tracking-[0.3em]"
              style={{ fontSize: "10px", color: "var(--color-subtle)" }}
            >
              Scroll
            </span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          MARQUEE TICKER
      ───────────────────────────────────────────────────────── */}
      <Marquee />

      {/* ─────────────────────────────────────────────────────────
          CATEGORIES — Editorial numbered list
      ───────────────────────────────────────────────────────── */}
      <CategoryShowcase categories={categories} />

      {/* ─────────────────────────────────────────────────────────
          EDITORIAL BAND — full-bleed image with overlaid statement
      ───────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ height: "60vh", minHeight: "380px" }}
      >
        <Image
          src={EDITORIAL}
          alt="Aiefashion editorial"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(28,28,26,0.55)" }}
        />
        <div className="relative z-10 h-full flex items-center justify-center px-6 text-center">
          <Reveal reveal="fade">
            <p
              className="font-body uppercase tracking-[0.5em] mb-6"
              style={{ fontSize: "10px", color: "var(--color-gold)" }}
            >
              The AIE Standard
            </p>
            <blockquote
              className="font-heading italic text-white leading-[1.1]"
              style={{
                fontSize: "clamp(1.8rem, 5vw, 4rem)",
                maxWidth: "900px",
              }}
            >
              &ldquo;Every piece chosen for the woman
              <br className="hidden md:block" />
              who shops with intention.&rdquo;
            </blockquote>
            <Link
              href="/about"
              className="font-body uppercase tracking-[0.3em] mt-10 inline-block text-white/50 hover:text-white transition-colors duration-200"
              style={{ fontSize: "11px" }}
            >
              Our Story →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          FEATURED PRODUCTS
      ───────────────────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section
          style={{
            backgroundColor: "var(--color-surface)",
            borderTop: "1px solid var(--color-border)",
          }}
          className="py-20 md:py-28"
        >
          <div className="container">
            {/* Header row */}
            <div className="flex items-end justify-between mb-12 md:mb-16">
              <Reveal>
                <div>
                  <p
                    className="font-body uppercase tracking-[0.4em] mb-3"
                    style={{ fontSize: "10px", color: "var(--color-subtle)" }}
                  >
                    Curated for you
                  </p>
                  <h2
                    className="font-heading leading-none"
                    style={{
                      color: "var(--color-foreground)",
                      fontSize: "clamp(2rem, 4vw, 3rem)",
                    }}
                  >
                    Featured Pieces
                  </h2>
                </div>
              </Reveal>

              <Reveal reveal="fade">
                <Link
                  href="/shop"
                  className="hidden sm:flex items-center gap-2 font-body uppercase tracking-[0.2em] text-muted hover:text-foreground transition-colors duration-200"
                  style={{ fontSize: "11px" }}
                >
                  View all
                  <span style={{ color: "var(--color-gold)" }}>→</span>
                </Link>
              </Reveal>
            </div>

            <ProductGrid products={featured} />

            {/* Mobile view-all */}
            <Reveal className="mt-12 text-center sm:hidden">
              <Link
                href="/shop"
                className="font-body uppercase tracking-[0.2em]"
                style={{ fontSize: "11px", color: "var(--color-muted)" }}
              >
                View all products →
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────
          TRUST / USP STRIP — 3 pillars
      ───────────────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "var(--color-background)",
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
        }}
        className="py-14 md:py-16"
      >
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            {[
              {
                num: "01",
                title: "Curated Quality",
                body: "Every product is hand-selected to meet the AIE standard — no compromises.",
              },
              {
                num: "02",
                title: "Worldwide Delivery",
                body: "UK-based, globally shipped. Nigeria, EU, and beyond — we bring AIE to you.",
              },
              {
                num: "03",
                title: "Luxury Returns",
                body: "14-day hassle-free returns. Your satisfaction is the only acceptable outcome.",
              },
            ].map((item, i) => (
              <Reveal key={item.num} delay={i + 1} className="flex flex-col">
                <span
                  className="font-heading mb-5 block"
                  style={{
                    fontSize: "2.5rem",
                    color: "var(--color-gold)",
                    opacity: 0.35,
                  }}
                >
                  {item.num}
                </span>
                <div
                  className="h-px w-8 mb-5"
                  style={{ backgroundColor: "var(--color-gold)" }}
                />
                <h3
                  className="font-heading mb-3"
                  style={{
                    fontSize: "1.25rem",
                    color: "var(--color-foreground)",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="font-body leading-relaxed"
                  style={{ fontSize: "14px", color: "var(--color-muted)" }}
                >
                  {item.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

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
              {/* Decorative motif */}
              <div className="flex items-center justify-center gap-4 mb-10">
                <div
                  className="h-px flex-1 max-w-16"
                  style={{ backgroundColor: "rgba(212,175,55,0.3)" }}
                />
                <span style={{ color: "var(--color-gold)", fontSize: "18px" }}>
                  ◆
                </span>
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
                style={{
                  fontSize: "15px",
                  color: "rgba(253,251,247,0.55)",
                  lineHeight: 1.7,
                }}
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
