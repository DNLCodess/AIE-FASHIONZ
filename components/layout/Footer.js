"use client";
import Link from "next/link";

const SHOP_LINKS = [
  { label: "Luxury Fabrics", href: "/shop/luxury-fabrics" },
  { label: "Bags & Shoes", href: "/shop/bags-shoes" },
  { label: "Jewellery", href: "/shop/jewellery" },
  { label: "Party & Dinner Wear", href: "/shop/party-dinner-wear" },
  { label: "Children's Wear", href: "/shop/childrens-wear" },
  { label: "Body Shapers", href: "/shop/body-shapers" },
];

const HELP_LINKS = [
  { label: "Contact Us", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Shipping & Returns", href: "/shipping-returns" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "Track My Order", href: "/account/orders" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Cookie Policy", href: "/privacy-policy#cookies" },
  { label: "Accessibility", href: "/accessibility" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#" },
  { label: "TikTok", href: "#" },
  { label: "WhatsApp", href: "#" },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--color-foreground)" }}>
      {/* Main grid */}
      <div
        className="container"
        style={{
          paddingTop: "4rem",
          paddingBottom: "4rem",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div>
            <Link
              href="/"
              style={{
                display: "inline-block",
                marginBottom: "0.5rem",
                fontFamily: "var(--font-heading)",
                fontSize: "1.25rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: "var(--color-gold)",
                transition: "color 200ms ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-gold-dark)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-gold)")
              }
            >
              AIE Fashionz
            </Link>

            <p
              className="font-body"
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.28)",
                marginBottom: "1.5rem",
              }}
            >
              UK Luxury Fashion
            </p>

            <p
              className="font-body"
              style={{
                fontSize: "14px",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.5)",
                marginBottom: "2rem",
                maxWidth: "26ch",
              }}
            >
              Premium fashion for women who shop with intention. Delivered
              globally from the UK.
            </p>

            <div
              style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}
            >
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="font-body"
                  style={{
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.3)",
                    textDecoration: "none",
                    transition: "color 200ms ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--color-gold)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(255,255,255,0.3)")
                  }
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3
              className="font-body"
              style={{
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.28)",
                marginBottom: "1.5rem",
                fontWeight: 500,
              }}
            >
              Shop
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {SHOP_LINKS.map((link) => (
                <li key={link.href} style={{ marginBottom: "0.875rem" }}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3
              className="font-body"
              style={{
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.28)",
                marginBottom: "1.5rem",
                fontWeight: 500,
              }}
            >
              Help
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {HELP_LINKS.map((link) => (
                <li key={link.href} style={{ marginBottom: "0.875rem" }}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3
              className="font-body"
              style={{
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.28)",
                marginBottom: "1.5rem",
                fontWeight: 500,
              }}
            >
              Legal
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {LEGAL_LINKS.map((link) => (
                <li key={link.href} style={{ marginBottom: "0.875rem" }}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="container"
        style={{
          paddingTop: "1.25rem",
          paddingBottom: "1.25rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
        }}
      >
        <p
          className="font-body"
          style={{ fontSize: "12px", color: "rgba(255,255,255,0.22)" }}
        >
          AIE Fashionz Ltd · Company No. [XXXXXXXX] · Registered in England
          &amp; Wales
        </p>
        <p
          className="font-body"
          style={{ fontSize: "12px", color: "rgba(255,255,255,0.22)" }}
        >
          © {new Date().getFullYear()} AIE Fashionz. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="font-body"
      style={{
        fontSize: "14px",
        color: "rgba(255,255,255,0.5)",
        textDecoration: "none",
        transition: "color 200ms ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.color = "rgba(255,255,255,0.9)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
      }
    >
      {children}
    </Link>
  );
}
