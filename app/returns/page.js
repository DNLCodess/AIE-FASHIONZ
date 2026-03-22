import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aiefashionz.com";

export const metadata = {
  title: "Returns & Refunds Policy | AIE Fashionz — 14-Day Free Returns",
  description:
    "AIE Fashionz offers free 14-day returns on all UK orders in line with the UK Consumer Rights Act 2015. Read our full returns and refund policy.",
  alternates: { canonical: "/returns" },
  openGraph: {
    title: "Returns & Refunds Policy | AIE Fashionz",
    description: "Free 14-day returns on all UK orders. Full returns and refund policy.",
    url: "/returns",
  },
};

const SECTIONS = [
  {
    title: "14-day return window",
    body: "You have 14 calendar days from the date you receive your order to return any item. This is in accordance with your rights under the UK Consumer Rights Act 2015 and the Consumer Contracts Regulations 2013.",
  },
  {
    title: "Condition of returned items",
    body: "Items must be returned in their original, unworn condition with all tags attached and in the original packaging where possible. We reserve the right to refuse a refund or exchange if items show signs of wear, damage, or alteration.",
  },
  {
    title: "How to start a return",
    body: "Email us at returns@aiefashionz.com with your order number and the reason for your return. We will respond within 2 business days with return instructions and a prepaid label for UK customers.",
  },
  {
    title: "Refunds",
    body: "Once your return is received and inspected, we will notify you of the approval or rejection of your refund. Approved refunds are processed to your original payment method within 5–10 business days. Original shipping costs are non-refundable unless the item is faulty.",
  },
  {
    title: "Faulty or incorrect items",
    body: "If you receive a faulty or incorrect item, contact us immediately at support@aiefashionz.com. We will arrange collection at no cost and provide a full refund or replacement at your choice.",
  },
  {
    title: "International returns",
    body: "Customers outside the UK are responsible for return shipping costs and any applicable customs duties. We recommend using a tracked service. Refunds will be issued once items are received and inspected.",
  },
  {
    title: "Non-returnable items",
    body: "For hygiene reasons, the following cannot be returned unless faulty: body shapers (if unsealed), earrings and pierced jewellery, and items marked as final sale.",
  },
];

export default function ReturnsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Returns & Refunds Policy",
    url: `${SITE_URL}/returns`,
    description: "AIE Fashionz returns and refunds policy — 14-day free returns for UK customers.",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Returns Policy", item: `${SITE_URL}/returns` },
      ],
    },
  };

  return (
    <>
      <JsonLd data={schema} />

      <div className="container" style={{ paddingTop: "3rem", paddingBottom: "5rem", maxWidth: "760px" }}>
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
          Legal
        </p>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            color: "var(--color-foreground)",
            marginBottom: "0.75rem",
          }}
        >
          Returns &amp; Refunds
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            color: "var(--color-muted)",
            marginBottom: "3rem",
          }}
        >
          Last updated: March 2026. We want you to love every purchase.
          If you don&apos;t, here&apos;s exactly what to do.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2.5rem",
          }}
        >
          {SECTIONS.map((s, i) => (
            <div key={s.title} style={{ borderTop: "1px solid var(--color-border)", paddingTop: "2rem" }}>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.2rem",
                  color: "var(--color-foreground)",
                  marginBottom: "0.75rem",
                }}
              >
                {i + 1}. {s.title}
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  color: "var(--color-muted)",
                  lineHeight: 1.85,
                }}
              >
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "3rem",
            padding: "2rem",
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-muted)", lineHeight: 1.8 }}>
            <strong style={{ color: "var(--color-foreground)" }}>Need help?</strong>
            {" "}Contact our customer care team at{" "}
            <a href="mailto:returns@aiefashionz.com" style={{ color: "var(--color-gold)" }}>
              returns@aiefashionz.com
            </a>
            {" "}or visit our{" "}
            <Link href="/faq" style={{ color: "var(--color-gold)" }}>FAQ page</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
