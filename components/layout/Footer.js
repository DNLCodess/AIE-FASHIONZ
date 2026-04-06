/**
 * Footer — Server Component.
 * All hover states use CSS classes from globals.css (no event handlers).
 *
 * Mobile grid  : 2-col → brand spans both cols (top), Shop + Help side-by-side (below)
 * Desktop grid : 3-col → brand | Shop | Help
 */
import Link from "next/link";

const SHOP_LINKS = [
  { label: "Luxury Fabrics",       href: "/shop/luxury-fabrics"    },
  { label: "Bags & Shoes",         href: "/shop/bags-shoes"        },
  { label: "Jewellery",            href: "/shop/jewellery"         },
  { label: "Party & Dinner Wear",  href: "/shop/party-dinner-wear" },
  { label: "Children's Wear",      href: "/shop/childrens-wear"    },
  { label: "Body Shapers",         href: "/shop/body-shapers"      },
];

const HELP_LINKS = [
  { label: "Contact Us",          href: "/contact"          },
  { label: "FAQ",                 href: "/faq"              },
  { label: "Shipping & Returns",  href: "/shipping-returns" },
  { label: "Size Guide",          href: "/size-guide"       },
  { label: "Track My Order",      href: "/account/orders"   },
];

const LEGAL_LINKS = [
  { label: "Privacy",        href: "/privacy-policy"         },
  { label: "Terms",          href: "/terms"                  },
  { label: "Cookies",        href: "/privacy-policy#cookies" },
  { label: "Accessibility",  href: "/accessibility"          },
];

const SOCIAL_LINKS = [
  { label: "Instagram",  href: "https://www.instagram.com/aiefashion" },
  { label: "TikTok",     href: "https://www.tiktok.com/@aiefashion"   },
  { label: "Facebook",   href: "https://www.facebook.com/aiefashion"  },
  { label: "WhatsApp",   href: "https://wa.me/13014335307"            },
];

/* ── Column heading ─────────────────────────────────────── */
function ColHeading({ children }) {
  return (
    <p
      className="font-body uppercase"
      style={{
        fontSize: "13px",
        letterSpacing: "0.22em",
        color: "rgba(255,255,255,0.38)",
        marginBottom: "1.25rem",
        fontWeight: 500,
      }}
    >
      {children}
    </p>
  );
}

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#0C0C0A" }}>

      {/* ── Main columns ───────────────────────────────────── */}
      <div
        className="container"
        style={{
          paddingTop: "3.5rem",
          paddingBottom: "3.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/*
          Mobile  (2-col): brand col-span-2 → Shop | Help
          Desktop (3-col): brand | Shop | Help
        */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10 md:gap-x-10 md:gap-y-0">

          {/* ── Brand (full-width on mobile, 1-col on desktop) ─ */}
          <div
            className="col-span-2 md:col-span-1"
            style={{
              paddingBottom: "2rem",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Logo */}
            <Link
              href="/"
              className="font-heading"
              style={{
                fontSize: "1.1rem",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: "var(--color-gold)",
                display: "block",
                marginBottom: "0.4rem",
              }}
            >
              Aiefashion
            </Link>

            <p
              className="font-body"
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.3)",
                marginBottom: "1.75rem",
              }}
            >
              Luxury Fashion · Lanham, Maryland
            </p>

            {/* Contact — brief */}
            <div style={{ marginBottom: "1.75rem" }}>
              <a
                href="tel:+13014335307"
                className="font-body footer-nav-link"
                style={{ display: "block", marginBottom: "0.35rem" }}
              >
                +1 (301) 433-5307
              </a>
              <a
                href="mailto:aiefashionllc@gmail.com"
                className="font-body footer-nav-link"
              >
                aiefashionllc@gmail.com
              </a>
            </div>

            {/* Social */}
            <div style={{ display: "flex", flexWrap: "wrap", columnGap: "1.25rem", rowGap: "0.25rem" }}>
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Aiefashion on ${s.label}`}
                  className="font-body footer-social-link"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* ── Shop ───────────────────────────────────────── */}
          <div>
            <ColHeading>Shop</ColHeading>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {SHOP_LINKS.map((link) => (
                <li key={link.href} style={{ marginBottom: "0.7rem" }}>
                  <Link href={link.href} className="font-body footer-nav-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Help ───────────────────────────────────────── */}
          <div>
            <ColHeading>Help</ColHeading>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {HELP_LINKS.map((link) => (
                <li key={link.href} style={{ marginBottom: "0.7rem" }}>
                  <Link href={link.href} className="font-body footer-nav-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────── */}
      <div
        className="container"
        style={{
          paddingTop: "1.1rem",
          paddingBottom: "1.1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
        }}
      >
        {/* Legal links row */}
        <nav
          aria-label="Legal"
          style={{ display: "flex", flexWrap: "wrap", gap: "0 1.25rem" }}
        >
          {LEGAL_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="font-body footer-legal-link">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <p
          className="font-body"
          style={{ fontSize: "13px", color: "rgba(255,255,255,0.22)" }}
        >
          © {new Date().getFullYear()} Aiefashion LLC. All rights reserved. · Online orders only · Worldwide delivery.
        </p>
      </div>

    </footer>
  );
}
