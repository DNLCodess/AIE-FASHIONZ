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

// Each mobile icon button = 10px padding + icon + 10px padding = 39px
// ThemeToggle (39) + Search (39) + Cart (39) = 117px + 2px gaps = ~120px
// Add 16px buffer for safety = 136px
const SIDE_WIDTH = "136px";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { openCart, openMobileNav, openSearch } = useUiStore();
  const totalItems = useCartStore(selectTotalItems);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [openSearch]);

  useEffect(() => {
    const supabase = createClient();
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
        top: "var(--bar-h, 0px)",
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
        {/* ── MOBILE layout: strict 3-column grid ──────────────────────────
            Left and right columns are IDENTICAL fixed widths.
            Logo is in the middle flex:1 column, centred.
            Hidden on md and above.
        ─────────────────────────────────────────────────────────────────── */}
        <div
          className="grid md:hidden"
          style={{
            gridTemplateColumns: `${SIDE_WIDTH} 1fr ${SIDE_WIDTH}`,
            alignItems: "center",
            height: scrolled ? "60px" : "68px",
            transition: "height 350ms ease",
          }}
        >
          {/* Col 1 — hamburger, left-aligned */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <button
              onClick={openMobileNav}
              aria-label="Open menu"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px",
                marginLeft: "-10px",
                color: scrolled
                  ? "var(--color-foreground)"
                  : "rgba(255,255,255,0.9)",
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "color 200ms ease",
              }}
            >
              <Menu size={22} />
            </button>
          </div>

          {/* Col 2 — logo, centred within this column */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Link
              href="/"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(0.9rem, 3.8vw, 1.2rem)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                textDecoration: "none",
                color: scrolled
                  ? "var(--color-foreground)"
                  : "rgba(255,255,255,0.96)",
                transition: "color 350ms ease",
              }}
            >
              Aiefashion
            </Link>
          </div>

          {/* Col 3 — icons, right-aligned */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "0px",
            }}
          >
            <ThemeToggle scrolled={scrolled} />
            <SearchButton
              openSearch={openSearch}
              scrolled={scrolled}
              size={20}
            />
            <CartButton
              totalItems={totalItems}
              openCart={openCart}
              scrolled={scrolled}
              size={20}
            />
          </div>
        </div>

        {/* ── DESKTOP layout ────────────────────────────────────────────────
            Hidden below md.
        ─────────────────────────────────────────────────────────────────── */}
        <div
          className="hidden md:flex"
          style={{
            alignItems: "center",
            height: scrolled ? "68px" : "76px",
            transition: "height 350ms ease",
          }}
        >
          <Link
            href="/"
            style={{
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
              flexShrink: 0,
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
            Aiefashion
          </Link>

          <div
            style={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "2rem",
              marginLeft: "2.5rem",
            }}
          >
            <nav
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.75rem",
              }}
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

            <div
              style={{ display: "flex", alignItems: "center", gap: "2px" }}
            >
              <ThemeToggle scrolled={scrolled} />
              <SearchButton
                openSearch={openSearch}
                scrolled={scrolled}
                size={19}
              />
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
        </div>
      </div>
    </header>
  );
}

/* ── Sub-components ─────────────────────────────────────── */

function NavLink({ href, children, scrolled }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "15px",
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
            : "rgba(255,255,255,0.92)",
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

function SearchButton({ openSearch, scrolled, size = 19 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={openSearch}
      aria-label="Search"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
      <Search size={size} />
    </button>
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
            minWidth: "18px",
            height: "18px",
            padding: "0 3px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "2px",
            fontSize: "11px",
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
        width: "26px",
        height: "26px",
        borderRadius: "2px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12px",
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
