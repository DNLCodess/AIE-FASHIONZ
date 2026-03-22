import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aiefashionz.com";

export const metadata = {
  title: "Accessibility Statement | AIE Fashionz",
  description:
    "AIE Fashionz is committed to making our website accessible to everyone. Read our WCAG 2.1 AA accessibility statement.",
  alternates: { canonical: "/accessibility" },
  openGraph: {
    title: "Accessibility Statement | AIE Fashionz",
    description:
      "Our commitment to WCAG 2.1 AA compliance, keyboard navigation, screen reader support and inclusive design.",
    url: `${SITE_URL}/accessibility`,
  },
};

const FEATURES = [
  {
    title: "Keyboard navigation",
    body: "All interactive elements — links, buttons, form fields, and menus — are fully operable via keyboard. Focus indicators are clearly visible at all times.",
  },
  {
    title: "Screen reader support",
    body: "We use semantic HTML5 elements, ARIA labels, and descriptive alt text on all images to ensure compatibility with assistive technologies including NVDA, JAWS, and VoiceOver.",
  },
  {
    title: "Colour contrast",
    body: "Text and interactive elements meet the WCAG 2.1 AA minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text and UI components.",
  },
  {
    title: "Reduced motion",
    body: "Animations and transitions are suppressed for users who have enabled the 'Reduce Motion' system preference, in accordance with the prefers-reduced-motion media query.",
  },
  {
    title: "Resizable text",
    body: "The site is designed to remain fully functional and legible when text is resized up to 200% using browser zoom controls.",
  },
  {
    title: "No time limits",
    body: "No part of our website imposes a time limit on user interaction. Session timeouts related to account security provide adequate warning before expiry.",
  },
];

const KNOWN_LIMITATIONS = [
  "Some older product images may not yet have fully descriptive alt text. We are actively reviewing and updating these.",
  "Certain third-party embedded components (payment processors, live chat widgets) may not fully meet WCAG 2.1 AA. We are working with our suppliers to improve this.",
  "PDF documents linked from the site may not be fully accessible. We aim to provide HTML alternatives where possible.",
];

export default function AccessibilityPage() {
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
        Accessibility Statement
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
        Last reviewed: March 2026. AIE Fashionz is committed to ensuring our
        website is accessible and usable by everyone, regardless of disability,
        assistive technology, or browsing method.
      </p>

      {/* Commitment section */}
      <section style={{ marginBottom: "3rem" }}>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.4rem",
            color: "var(--color-foreground)",
            marginBottom: "1rem",
            paddingBottom: "0.75rem",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          Our Commitment
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            color: "var(--color-muted)",
            lineHeight: 1.85,
          }}
        >
          We aim to conform to the{" "}
          <strong style={{ color: "var(--color-foreground)" }}>
            Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
          </strong>
          . These guidelines explain how to make web content more accessible to
          people with disabilities, including those with visual, auditory,
          cognitive, and motor impairments. We continuously review and improve
          our site to maintain compliance.
        </p>
      </section>

      {/* Accessibility features */}
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
          Accessibility Features
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              style={{
                borderTop: i === 0 ? "none" : "1px solid var(--color-border)",
                paddingTop: i === 0 ? 0 : "1.75rem",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.05rem",
                  color: "var(--color-foreground)",
                  marginBottom: "0.5rem",
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  color: "var(--color-muted)",
                  lineHeight: 1.85,
                }}
              >
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Known limitations */}
      <section style={{ marginBottom: "3rem" }}>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.4rem",
            color: "var(--color-foreground)",
            marginBottom: "1rem",
            paddingBottom: "0.75rem",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          Known Limitations
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            color: "var(--color-muted)",
            lineHeight: 1.8,
            marginBottom: "1.25rem",
          }}
        >
          We are actively working to improve the following areas:
        </p>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "0.875rem",
          }}
        >
          {KNOWN_LIMITATIONS.map((item) => (
            <li
              key={item}
              style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}
            >
              <span
                style={{
                  flexShrink: 0,
                  marginTop: "0.35rem",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-gold)",
                  display: "inline-block",
                }}
              />
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  color: "var(--color-muted)",
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                {item}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Contact section */}
      <section style={{ marginBottom: "3rem" }}>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.4rem",
            color: "var(--color-foreground)",
            marginBottom: "1rem",
            paddingBottom: "0.75rem",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          Contact Us About Accessibility
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            color: "var(--color-muted)",
            lineHeight: 1.85,
          }}
        >
          If you experience any difficulty accessing content on our website, or
          if you have suggestions for improvement, please contact us at{" "}
          <a
            href="mailto:accessibility@aiefashionz.com"
            style={{ color: "var(--color-gold)" }}
          >
            accessibility@aiefashionz.com
          </a>
          . We aim to respond to accessibility queries within{" "}
          <strong style={{ color: "var(--color-foreground)" }}>
            3 business days
          </strong>
          .
        </p>
      </section>

      {/* Footer links */}
      <div
        style={{
          padding: "1.5rem 2rem",
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
          You may also find our{" "}
          <Link href="/privacy-policy" style={{ color: "var(--color-gold)" }}>
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" style={{ color: "var(--color-gold)" }}>
            Terms &amp; Conditions
          </Link>{" "}
          useful. For general enquiries, visit our{" "}
          <Link href="/contact" style={{ color: "var(--color-gold)" }}>
            Contact page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
