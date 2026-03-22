"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import useUiStore from "@/store/uiStore";

const NAV_LINKS = [
  { label: "Luxury Fabrics", href: "/shop/luxury-fabrics" },
  { label: "Bags & Shoes", href: "/shop/bags-shoes" },
  { label: "Jewellery", href: "/shop/jewellery" },
  { label: "Party & Dinner Wear", href: "/shop/party-dinner-wear" },
  { label: "Children's Wear", href: "/shop/childrens-wear" },
  { label: "Body Shapers", href: "/shop/body-shapers" },
];

const SECONDARY_LINKS = [
  { label: "Search", href: "/search" },
  { label: "My Account", href: "/account" },
  { label: "Wishlist", href: "/account/wishlist" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "Shipping & Returns", href: "/shipping-returns" },
];

export default function MobileNav() {
  const { mobileNavOpen, closeMobileNav } = useUiStore();

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileNavOpen]);

  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && closeMobileNav();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [closeMobileNav]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeMobileNav}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileNavOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Drawer */}
      <nav
        className={`fixed top-0 left-0 bottom-0 z-50 w-[85vw] max-w-sm flex flex-col bg-surface md:hidden transition-transform duration-300 ease-in-out ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobile navigation"
        aria-hidden={!mobileNavOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-border">
          <span className="font-heading text-lg tracking-[0.2em] uppercase text-foreground">
            AIE Fashionz
          </span>
          <button
            onClick={closeMobileNav}
            className="p-2 -mr-2 text-muted hover:text-foreground transition-colors"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <p className="font-body text-xs tracking-[0.15em] uppercase text-subtle mb-4">Shop</p>
          <ul className="space-y-1 mb-10">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMobileNav}
                  className="block py-3 font-heading text-2xl tracking-wide text-foreground hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="border-t border-border mb-6" />

          <ul className="space-y-1">
            {SECONDARY_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMobileNav}
                  className="block py-2 font-body text-base text-muted hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="px-6 py-6 border-t border-border">
          <p className="font-body text-xs text-subtle">
            © {new Date().getFullYear()} AIE Fashionz Ltd
          </p>
        </div>
      </nav>
    </>
  );
}
