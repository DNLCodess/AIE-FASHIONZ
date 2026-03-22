"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu } from "lucide-react";
import useCartStore, { selectTotalItems } from "@/store/cartStore";
import useUiStore from "@/store/uiStore";
import ThemeToggle from "./ThemeToggle";
import { createClient } from "@/lib/supabase/client";

const NAV_LINKS = [
  { label: "Fabrics", href: "/shop/luxury-fabrics" },
  { label: "Bags & Shoes", href: "/shop/bags-shoes" },
  { label: "Jewellery", href: "/shop/jewellery" },
  { label: "Party Wear", href: "/shop/party-dinner-wear" },
  { label: "Children's", href: "/shop/childrens-wear" },
  { label: "Body Shapers", href: "/shop/body-shapers" },
];

const MD = 768;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { openCart, openMobileNav } = useUiStore();
  const totalItems = useCartStore(selectTotalItems);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MD);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition:
          "background-color 350ms ease, border-color 350ms ease, box-shadow 350ms ease",
        backgroundColor: scrolled
          ? "var(--color-surface)"
          : "rgba(10,10,10,0.45)",
        borderBottom: scrolled
          ? "1px solid var(--color-border)"
          : "1px solid rgba(255,255,255,0.08)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 1px 20px rgba(0,0,0,0.06)" : "none",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: scrolled ? "68px" : "76px",
            transition: "height 350ms ease",
          }}
        >
          {/* Hamburger — inline display:none on desktop, guaranteed */}
          <button
            onClick={openMobileNav}
            aria-label="Open menu"
            style={{
              display: isMobile ? "flex" : "none",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px",
              marginLeft: "-10px",
              marginRight: "4px",
              color: scrolled
                ? "var(--color-foreground)"
                : "rgba(255,255,255,0.9)",
              background: "none",
              border: "none",
              cursor: "pointer",
              transition: "color 200ms ease",
              flexShrink: 0,
            }}
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link
            href="/"
            style={{
              position: isMobile ? "absolute" : "static",
              left: isMobile ? "50%" : "auto",
              transform: isMobile ? "translateX(-50%)" : "none",
              fontFamily: "var(--font-heading)",
              fontSize: "1.35rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              textDecoration: "none",
              color: scrolled
                ? "var(--color-foreground)"
                : "rgba(255,255,255,0.96)",
              transition: "color 350ms ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--color-gold)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = scrolled
                ? "var(--color-foreground)"
                : "rgba(255,255,255,0.96)")
            }
          >
            AIE Fashionz
          </Link>

          {/* Desktop nav — inline display:none on mobile */}
          <div
            style={{
              display: isMobile ? "none" : "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "2rem",
              marginLeft: "2.5rem",
            }}
          >
            <nav
              style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}
              aria-label="Main navigation"
            >
              {NAV_LINKS.map((link) => (
                <NavLink key={link.href} href={link.href} scrolled={scrolled}>
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div
              style={{
                width: "1px",
                height: "18px",
                backgroundColor: scrolled
                  ? "var(--color-border)"
                  : "rgba(255,255,255,0.18)",
                transition: "background-color 350ms ease",
                flexShrink: 0,
              }}
            />

            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              <ThemeToggle scrolled={scrolled} />
              <HeaderIconButton
                href="/search"
                aria-label="Search"
                scrolled={scrolled}
              >
                <Search size={19} />
              </HeaderIconButton>
              <HeaderIconButton
                href="/account"
                aria-label="My account"
                scrolled={scrolled}
              >
                {user ? <UserAvatar user={user} /> : <User size={19} />}
              </HeaderIconButton>
              <CartButton
                totalItems={totalItems}
                openCart={openCart}
                scrolled={scrolled}
                size={19}
              />
            </div>
          </div>

          {/* Mobile right actions — inline display:none on desktop */}
          <div
            style={{
              display: isMobile ? "flex" : "none",
              marginLeft: "auto",
              alignItems: "center",
              gap: "2px",
            }}
          >
            <ThemeToggle scrolled={scrolled} />
            <CartButton
              totalItems={totalItems}
              openCart={openCart}
              scrolled={scrolled}
              size={24}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children, scrolled }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "13.5px",
        fontWeight: 500,
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
        textDecoration: "none",
        color: hovered
          ? scrolled
            ? "var(--color-foreground)"
            : "rgba(255,255,255,1)"
          : scrolled
            ? "var(--color-muted)"
            : "rgba(255,255,255,0.82)",
        transition: "color 200ms ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </Link>
  );
}

function HeaderIconButton({ href, children, scrolled, ...props }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      style={{
        padding: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: hovered
          ? scrolled
            ? "var(--color-foreground)"
            : "rgba(255,255,255,1)"
          : scrolled
            ? "var(--color-muted)"
            : "rgba(255,255,255,0.72)",
        transition: "color 200ms ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      {children}
    </Link>
  );
}

function CartButton({ totalItems, openCart, scrolled, size = 19 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={openCart}
      aria-label={`Cart${totalItems > 0 ? `, ${totalItems} item${totalItems !== 1 ? "s" : ""}` : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: hovered
          ? scrolled
            ? "var(--color-foreground)"
            : "rgba(255,255,255,1)"
          : scrolled
            ? "var(--color-muted)"
            : "rgba(255,255,255,0.72)",
        transition: "color 200ms ease",
      }}
    >
      <ShoppingBag size={size} />
      {totalItems > 0 && (
        <span
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            minWidth: "17px",
            height: "17px",
            padding: "0 3px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "9999px",
            fontSize: "10px",
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            backgroundColor: "var(--color-gold)",
            color: "var(--color-foreground)",
            lineHeight: 1,
          }}
        >
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </button>
  );
}

function UserAvatar({ user }) {
  const initial =
    user.user_metadata?.first_name?.[0]?.toUpperCase() ??
    user.email?.[0]?.toUpperCase() ??
    "U";
  return (
    <span
      style={{
        width: "22px",
        height: "22px",
        borderRadius: "9999px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "10px",
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        backgroundColor: "var(--color-gold)",
        color: "var(--color-foreground)",
        flexShrink: 0,
      }}
    >
      {initial}
    </span>
  );
}
