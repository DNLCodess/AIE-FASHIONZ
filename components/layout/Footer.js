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
  { label: "WhatsApp", href: "https://wa.me/13014335307" },
  { label: "TikTok", href: "https://www.tiktok.com/@aiefashion" },
  { label: "Facebook", href: "https://www.facebook.com/aiefashion" },
  { label: "Instagram", href: "https://www.instagram.com/aiefashion" },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#0C0C0A" }}>
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
              className="font-heading inline-block mb-2 transition-colors duration-200"
              style={{
                fontSize: "1.25rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: "var(--color-gold)",
              }}
            >
              Aiefashion
            </Link>

            <p
              className="font-body"
              style={{
                fontSize: "13px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
                marginBottom: "1.5rem",
              }}
            >
              Premium Fashion
            </p>

            <p
              className="font-body"
              style={{
                fontSize: "15px",
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.75)",
                marginBottom: "2rem",
                maxWidth: "26ch",
              }}
            >
              Premium fashion for women who shop with intention. Delivered
              globally.
            </p>

            <div
              style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}
            >
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body transition-colors duration-200 hover:text-gold"
                  style={{
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                  }}
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
                fontSize: "12px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
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
                fontSize: "12px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
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

          {/* Get in Touch */}
          <div>
            <h3
              className="font-body"
              style={{
                fontSize: "12px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
                marginBottom: "1.5rem",
                fontWeight: 500,
              }}
            >
              Get in Touch
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ marginBottom: "1rem" }}>
                <p
                  className="font-body"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.4)",
                    marginBottom: "0.25rem",
                  }}
                >
                  Head Office
                </p>
                <span
                  className="font-body"
                  style={{ fontSize: "15px", color: "rgba(255,255,255,0.78)" }}
                >
                  Lanham, Maryland, USA
                </span>
              </li>
              <li style={{ marginBottom: "0.875rem" }}>
                <a
                  href="tel:+13014335307"
                  className="font-body transition-colors duration-200"
                  style={{
                    fontSize: "15px",
                    color: "rgba(255,255,255,0.78)",
                    textDecoration: "none",
                  }}
                >
                  +1 (301) 433-5307
                </a>
              </li>
              <li style={{ marginBottom: "1.5rem" }}>
                <a
                  href="mailto:aiefashionllc@gmail.com"
                  className="font-body transition-colors duration-200"
                  style={{
                    fontSize: "15px",
                    color: "rgba(255,255,255,0.78)",
                    textDecoration: "none",
                  }}
                >
                  aiefashionllc@gmail.com
                </a>
              </li>
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
          style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}
        >
          Aiefashion · Online orders only · Worldwide delivery
        </p>
        <p
          className="font-body"
          style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}
        >
          © {new Date().getFullYear()} Aiefashion. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="font-body transition-colors duration-200 hover:text-[rgba(255,255,255,0.97)]"
      style={{
        fontSize: "15px",
        color: "rgba(255,255,255,0.78)",
        textDecoration: "none",
      }}
    >
      {children}
    </Link>
  );
}
