import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aiefashionz.com";

export const metadata = {
  title: "Shipping & Returns | AIE Fashionz",
  description:
    "AIE Fashionz delivery information and 14-day returns policy. Free UK delivery on orders over £75. Worldwide shipping available including Nigeria.",
  alternates: { canonical: "/shipping-returns" },
  openGraph: {
    title: "Shipping & Returns | AIE Fashionz",
    description:
      "Free UK delivery on orders over £75. 14-day returns in line with the UK Consumer Rights Act. Worldwide shipping including Nigeria.",
    url: `${SITE_URL}/shipping-returns`,
  },
};

const DELIVERY_ROWS = [
  {
    service: "UK Standard",
    time: "3–5 business days",
    cost: "FREE over £75 · £4.99 otherwise",
  },
  {
    service: "UK Express",
    time: "1–2 business days",
    cost: "£8.99",
  },
  {
    service: "Europe",
    time: "5–8 business days",
    cost: "From £12.99",
  },
  {
    service: "International (incl. Nigeria)",
    time: "7–14 business days",
    cost: "From £15.99",
  },
];

export default function ShippingReturnsPage() {
  return (
    <div
      className="container"
      style={{ paddingTop: "3rem", paddingBottom: "5rem", maxWidth: "760px" }}
    >
      {/* Eyebrow */}
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
        Customer Service
      </p>

      <h1
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(1.8rem, 4vw, 3rem)",
          color: "var(--color-foreground)",
          marginBottom: "0.75rem",
        }}
      >
        Shipping &amp; Returns
      </h1>

      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          color: "var(--color-muted)",
          marginBottom: "3rem",
          lineHeight: 1.8,
        }}
      >
        Last updated: March 2026. All orders are dispatched Monday–Friday with a
        cut-off time of{" "}
        <strong style={{ color: "var(--color-foreground)" }}>2pm GMT</strong>.
        Orders placed after this time or on weekends will be processed the next
        working day.
      </p>

      {/* ── Section 1: Delivery ── */}
      <section style={{ marginBottom: "3.5rem" }}>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.4rem",
            color: "var(--color-foreground)",
            marginBottom: "1.25rem",
            paddingBottom: "0.75rem",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          Delivery Information
        </h2>

        {/* Delivery table */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr>
                {["Service", "Estimated Time", "Cost"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "0.75rem 1rem",
                      backgroundColor: "var(--color-surface-raised)",
                      color: "var(--color-muted)",
                      fontSize: "11px",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DELIVERY_ROWS.map((row, i) => (
                <tr key={row.service}>
                  <td
                    style={{
                      padding: "0.875rem 1rem",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-foreground)",
                      fontWeight: 500,
                      backgroundColor:
                        i % 2 === 0
                          ? "var(--color-surface)"
                          : "var(--color-background)",
                    }}
                  >
                    {row.service}
                  </td>
                  <td
                    style={{
                      padding: "0.875rem 1rem",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-muted)",
                      backgroundColor:
                        i % 2 === 0
                          ? "var(--color-surface)"
                          : "var(--color-background)",
                    }}
                  >
                    {row.time}
                  </td>
                  <td
                    style={{
                      padding: "0.875rem 1rem",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-muted)",
                      backgroundColor:
                        i % 2 === 0
                          ? "var(--color-surface)"
                          : "var(--color-background)",
                    }}
                  >
                    {row.cost}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            color: "var(--color-muted)",
            marginTop: "1rem",
            lineHeight: 1.7,
          }}
        >
          Delivery times are estimates and may be affected by customs clearance
          for international orders. A tracking number will be emailed to you
          once your order ships.
        </p>
      </section>

      {/* ── Section 2: Returns Policy ── */}
      <section style={{ marginBottom: "3.5rem" }}>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.4rem",
            color: "var(--color-foreground)",
            marginBottom: "1.25rem",
            paddingBottom: "0.75rem",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          Returns Policy
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          <PolicyBlock title="14-day return window">
            You have 14 calendar days from the date you receive your order to
            return any item. This is your statutory right under the{" "}
            <strong style={{ color: "var(--color-foreground)" }}>
              UK Consumer Rights Act 2015
            </strong>{" "}
            and the Consumer Contracts Regulations 2013.
          </PolicyBlock>

          <PolicyBlock title="Condition of returned items">
            Items must be returned unworn, unwashed, with all original tags
            attached and, where possible, in their original packaging. We reserve
            the right to refuse a refund if items show signs of wear, damage, or
            alteration.
          </PolicyBlock>

          <PolicyBlock title="Sale items">
            Items purchased in a sale are eligible for exchange or store credit
            only — no cash refunds.
          </PolicyBlock>

          <PolicyBlock title="How to return">
            Email{" "}
            <a
              href="mailto:returns@aiefashionz.com"
              style={{ color: "var(--color-gold)" }}
            >
              returns@aiefashionz.com
            </a>{" "}
            with your order number and reason for return. We will respond within
            2 business days with return instructions. UK customers will receive a
            prepaid returns label.
          </PolicyBlock>

          <PolicyBlock title="Refunds">
            Once your return is received and inspected, we will notify you of
            approval or rejection. Approved refunds are processed to your original
            payment method within{" "}
            <strong style={{ color: "var(--color-foreground)" }}>
              5–10 business days
            </strong>{" "}
            of receipt. Original shipping costs are not refunded unless the item
            is faulty.
          </PolicyBlock>
        </div>
      </section>

      {/* ── Section 3: Faulty Items ── */}
      <section style={{ marginBottom: "3rem" }}>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.4rem",
            color: "var(--color-foreground)",
            marginBottom: "1.25rem",
            paddingBottom: "0.75rem",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          Faulty Items
        </h2>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            color: "var(--color-muted)",
            lineHeight: 1.85,
          }}
        >
          If you receive a faulty or incorrect item, please contact us within{" "}
          <strong style={{ color: "var(--color-foreground)" }}>30 days</strong>{" "}
          of receipt at{" "}
          <a
            href="mailto:support@aiefashionz.com"
            style={{ color: "var(--color-gold)" }}
          >
            support@aiefashionz.com
          </a>
          . We will arrange collection at no cost and offer a full refund or
          replacement — your choice.
        </p>
      </section>

      {/* Contact box */}
      <div
        style={{
          padding: "2rem",
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            color: "var(--color-muted)",
            lineHeight: 1.8,
          }}
        >
          <strong style={{ color: "var(--color-foreground)" }}>
            Questions about a return?
          </strong>{" "}
          Email{" "}
          <a
            href="mailto:returns@aiefashionz.com"
            style={{ color: "var(--color-gold)" }}
          >
            returns@aiefashionz.com
          </a>{" "}
          or visit our{" "}
          <Link href="/faq" style={{ color: "var(--color-gold)" }}>
            FAQ page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function PolicyBlock({ title, children }) {
  return (
    <div>
      <h3
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "1.05rem",
          color: "var(--color-foreground)",
          marginBottom: "0.5rem",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          color: "var(--color-muted)",
          lineHeight: 1.85,
        }}
      >
        {children}
      </p>
    </div>
  );
}
