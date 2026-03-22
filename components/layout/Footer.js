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
    <footer className="bg-foreground">
      {/* Main grid */}
      <div className="container py-16 md:py-20 border-b border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-block mb-2 font-heading text-xl tracking-[0.2em] uppercase text-gold hover:text-gold-dark transition-colors duration-200"
            >
              AIE Fashionz
            </Link>
            <p className="font-body text-[11px] tracking-[0.2em] uppercase text-white/30 mb-6">
              UK Luxury Fashion
            </p>
            <p className="font-body text-sm leading-relaxed text-white/50 mb-8 max-w-xs">
              Premium fashion for women who shop with intention. Delivered
              globally from the UK.
            </p>
            <div className="flex items-center gap-6">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="font-body text-xs tracking-wide text-white/35 hover:text-gold transition-colors duration-200"
                  aria-label={s.label}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-body text-[10px] tracking-[0.2em] uppercase text-white/30 mb-6">
              Shop
            </h3>
            <ul className="space-y-3.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/50 hover:text-white/90 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-body text-[10px] tracking-[0.2em] uppercase text-white/30 mb-6">
              Help
            </h3>
            <ul className="space-y-3.5">
              {HELP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/50 hover:text-white/90 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-body text-[10px] tracking-[0.2em] uppercase text-white/30 mb-6">
              Legal
            </h3>
            <ul className="space-y-3.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/50 hover:text-white/90 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="container py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p className="font-body text-xs text-white/25">
          AIE Fashionz Ltd · Company No. [XXXXXXXX] · Registered in England & Wales
        </p>
        <p className="font-body text-xs text-white/25">
          © {new Date().getFullYear()} AIE Fashionz. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
