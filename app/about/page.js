import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aiefashion.com";

export const metadata = {
  title: "About Aiefashion | Our Story — Premium Fashion Boutique",
  description:
    "Discover the story behind Aiefashion — a US-based luxury fashion boutique celebrating African elegance and global style. Premium fabrics, bags, jewellery and occasion wear for the modern woman.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Aiefashion | Our Story",
    description:
      "A premium fashion boutique celebrating African elegance and global style. Discover our story.",
    url: "/about",
  },
};

export default function AboutPage() {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Aiefashion",
    url: `${SITE_URL}/about`,
    description:
      "Aiefashion is a US-based luxury fashion boutique for women, specialising in premium fabrics, bags & shoes, jewellery, party wear, children's fashion and body shapers.",
    mainEntity: {
      "@type": "Organization",
      name: "Aiefashion",
      url: SITE_URL,
      foundingLocation: { "@type": "Place", addressLocality: "Lanham", addressRegion: "MD", addressCountry: "US" },
      description:
        "US-based luxury fashion boutique celebrating African elegance and global style.",
    },
  };

  return (
    <>
      <JsonLd data={orgSchema} />

      {/* Hero */}
      <section
        style={{
          backgroundColor: "var(--color-foreground)",
          paddingTop: "8rem",
          paddingBottom: "5rem",
        }}
      >
        <div className="container text-center">
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "var(--color-gold)",
              marginBottom: "1.5rem",
            }}
          >
            Our Story
          </p>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.4rem, 6vw, 5rem)",
              color: "var(--color-background)",
              lineHeight: 1.05,
              marginBottom: "2rem",
            }}
          >
            Dressed with intention.
            <br />
            <em style={{ color: "var(--color-gold)" }}>Built with purpose.</em>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "16px",
              color: "rgba(253,251,247,0.55)",
              maxWidth: "560px",
              margin: "0 auto",
              lineHeight: 1.8,
            }}
          >
            Aiefashion was founded to bring genuine luxury fashion to women
            who refuse to compromise — wherever in the world they are.
          </p>
        </div>
      </section>

      {/* Story */}
      <section style={{ backgroundColor: "var(--color-background)", padding: "5rem 0" }}>
        <div className="container">
          <div style={{ maxWidth: "720px", margin: "0 auto" }}>
            <div
              style={{
                width: "3rem",
                height: "1px",
                backgroundColor: "var(--color-gold)",
                marginBottom: "3rem",
              }}
            />
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                color: "var(--color-foreground)",
                marginBottom: "1.5rem",
              }}
            >
              Where luxury meets identity
            </h2>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                color: "var(--color-muted)",
                lineHeight: 1.9,
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <p>
                Aiefashion was born from a belief that luxury fashion should feel
                personal — not just prestigious. We are a US-based boutique with roots
                deeply connected to West African fashion culture, and we bring that
                richness of colour, fabric and craftsmanship to women across the globe.
              </p>
              <p>
                Every piece in our collections is curated to meet a single standard:
                excellence. From the silk charmeuse we source for our luxury fabrics
                range, to the hand-finished jewellery and statement occasion wear — each
                product must earn its place.
              </p>
              <p>
                We serve women who know exactly what they want: quality that lasts,
                style that turns heads, and a shopping experience that respects their
                time. Whether you are dressing for a gala in Lagos, a wedding in London,
                or an everyday moment that deserves to feel special — Aiefashion is
                your boutique.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        style={{
          backgroundColor: "var(--color-surface)",
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
          padding: "5rem 0",
        }}
      >
        <div className="container">
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
              color: "var(--color-foreground)",
              marginBottom: "3rem",
              textAlign: "center",
            }}
          >
            What we stand for
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "2.5rem",
            }}
          >
            {[
              {
                title: "Curation over quantity",
                body: "We stock fewer pieces, chosen with greater care. Quality is non-negotiable.",
              },
              {
                title: "Authentic luxury",
                body: "No imitations. Every product is sourced from trusted makers who share our standards.",
              },
              {
                title: "Global women, local care",
                body: "US-based. Worldwide shipping. Nigeria, EU and beyond — we come to you.",
              },
              {
                title: "Radical transparency",
                body: "Clear pricing, honest returns policy, and no hidden fees. Ever.",
              },
            ].map((item) => (
              <div key={item.title}>
                <div
                  style={{
                    width: "2rem",
                    height: "1px",
                    backgroundColor: "var(--color-gold)",
                    marginBottom: "1.25rem",
                  }}
                />
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.15rem",
                    color: "var(--color-foreground)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    color: "var(--color-muted)",
                    lineHeight: 1.8,
                  }}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: "var(--color-background)", padding: "5rem 0", textAlign: "center" }}>
        <div className="container">
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              color: "var(--color-foreground)",
              marginBottom: "1rem",
            }}
          >
            Shop the collections
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              color: "var(--color-muted)",
              marginBottom: "2.5rem",
            }}
          >
            Six curated categories. One standard — luxury.
          </p>
          <Link
            href="/shop"
            style={{
              display: "inline-block",
              padding: "14px 40px",
              backgroundColor: "var(--color-gold)",
              color: "var(--color-foreground)",
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Browse All Collections
          </Link>
        </div>
      </section>
    </>
  );
}
