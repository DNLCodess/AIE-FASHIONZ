import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aiefashion.com";

export const metadata = {
  title: "FAQ | Aiefashion — Delivery, Returns & Shopping Questions",
  description:
    "Answers to common questions about Aiefashion — delivery times, returns, payment methods, sizing, Nigerian shipping, and more.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ | Aiefashion",
    description: "Answers to common questions about delivery, returns, payment and more.",
    url: "/faq",
  },
};

const FAQS = [
  {
    q: "Where do you ship to?",
    a: "We ship worldwide. UK orders are dispatched within 1–2 business days. We deliver to Nigeria, the EU, USA, Canada, and most international destinations. Shipping costs and times vary by location and are calculated at checkout.",
  },
  {
    q: "How long does UK delivery take?",
    a: "Standard UK delivery takes 2–5 business days. Express options are available at checkout. Orders placed before 12pm Monday–Friday are typically dispatched the same day.",
  },
  {
    q: "Do you ship to Nigeria?",
    a: "Yes — we offer dedicated shipping to Nigeria. Payment is accepted via Paystack (cards, bank transfer) and Stripe. Delivery typically takes 7–14 business days to Nigerian addresses.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards via Stripe (Visa, Mastercard, Amex), Apple Pay, Google Pay, and Paystack for Nigerian customers (cards and bank transfer).",
  },
  {
    q: "How do I return an item?",
    a: "You have 14 days from delivery to return any item in its original condition. Email aiefashionllc@gmail.com with your order number and we will send you a prepaid return label (UK customers). See our full returns policy for details.",
  },
  {
    q: "Are the prices inclusive of VAT?",
    a: "All prices shown are inclusive of UK VAT at 20% for UK customers. VAT is itemised at checkout. International customers outside the UK may be charged import duties by their local customs authority — these are not included in our prices.",
  },
  {
    q: "How do I know which size to order?",
    a: "Each product listing includes a size guide where applicable. For fabrics, sizes refer to length in metres. For garments and accessories, we recommend checking the product description for specific measurements. If unsure, contact us before ordering.",
  },
  {
    q: "Can I cancel or change my order?",
    a: "Orders can be cancelled or amended within 1 hour of placing them — contact us immediately at aiefashionllc@gmail.com. After dispatch, standard return procedures apply.",
  },
  {
    q: "Are your products authentic luxury?",
    a: "Yes. Every product stocked at Aiefashion is hand-selected against our quality standard. We source directly from trusted makers and suppliers. No imitations, no compromises.",
  },
  {
    q: "Do you offer gift wrapping?",
    a: "Gift wrapping is available on request at checkout. Add a note in the order comments and we will package your items in our signature presentation wrap.",
  },
];

export default function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "FAQ", item: `${SITE_URL}/faq` },
    ],
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="container" style={{ paddingTop: "3rem", paddingBottom: "5rem" }}>
        <div style={{ maxWidth: "760px" }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--color-muted)",
              marginBottom: "1rem",
            }}
          >
            Help centre
          </p>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              color: "var(--color-foreground)",
              marginBottom: "0.75rem",
            }}
          >
            Frequently Asked Questions
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              color: "var(--color-muted)",
              marginBottom: "3rem",
              lineHeight: 1.7,
            }}
          >
            Can&apos;t find the answer you need?{" "}
            <Link href="/contact" style={{ color: "var(--color-gold)" }}>
              Contact our team
            </Link>{" "}
            and we&apos;ll respond within 24 hours.
          </p>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {FAQS.map(({ q, a }, i) => (
              <details
                key={q}
                style={{
                  borderTop: "1px solid var(--color-border)",
                  ...(i === FAQS.length - 1 ? { borderBottom: "1px solid var(--color-border)" } : {}),
                }}
              >
                <summary
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "15px",
                    fontWeight: 500,
                    color: "var(--color-foreground)",
                    padding: "1.25rem 0",
                    cursor: "pointer",
                    listStyle: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  {q}
                  <span
                    style={{
                      width: "20px",
                      height: "20px",
                      flexShrink: 0,
                      border: "1px solid var(--color-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      color: "var(--color-muted)",
                    }}
                  >
                    +
                  </span>
                </summary>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    color: "var(--color-muted)",
                    lineHeight: 1.85,
                    paddingBottom: "1.5rem",
                    paddingRight: "2rem",
                  }}
                >
                  {a}
                </p>
              </details>
            ))}
          </div>

          <div
            style={{
              marginTop: "3.5rem",
              padding: "2rem",
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.1rem",
                color: "var(--color-foreground)",
                marginBottom: "0.5rem",
              }}
            >
              Still have questions?
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                color: "var(--color-muted)",
                marginBottom: "1.25rem",
              }}
            >
              Our customer care team is here to help Monday–Friday, 9am–5pm GMT.
            </p>
            <Link
              href="/contact"
              style={{
                display: "inline-block",
                padding: "11px 28px",
                backgroundColor: "var(--color-gold)",
                color: "var(--color-foreground)",
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
