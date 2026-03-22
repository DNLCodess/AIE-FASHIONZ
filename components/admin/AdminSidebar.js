"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Tag, LogOut, Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/categories", label: "Categories", icon: Tag },
];

function SidebarNav({ pathname, onSignOut, onNavigate }) {
  return (
    <>
      <nav className="flex-1 py-4 space-y-0.5 px-2">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-3 font-body text-sm transition-colors rounded-sm ${
                active
                  ? "bg-gold/10 text-foreground"
                  : "text-muted hover:text-foreground hover:bg-surface-raised"
              }`}
            >
              <Icon size={15} className={active ? "text-gold" : ""} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-border">
        <button
          onClick={onSignOut}
          className="flex items-center gap-3 px-3 py-3 w-full font-body text-sm text-muted hover:text-error transition-colors rounded-sm"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 border-r border-border bg-surface min-h-screen sticky top-0 flex-col">
        <div className="h-14 flex items-center px-5 border-b border-border">
          <span className="font-heading text-base tracking-[0.15em] uppercase text-foreground">
            AIE
          </span>
          <span className="ml-1.5 font-body text-[10px] tracking-[0.2em] uppercase text-muted">
            Admin
          </span>
        </div>
        <SidebarNav pathname={pathname} onSignOut={handleSignOut} />
      </aside>

      {/* Mobile hamburger */}
      <button
        className="md:hidden fixed top-0 left-0 z-50 h-14 w-14 flex items-center justify-center text-muted hover:text-foreground transition-colors"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-surface flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-14 flex items-center justify-between px-5 border-b border-border">
          <div className="flex items-center">
            <span className="font-heading text-base tracking-[0.15em] uppercase text-foreground">
              AIE
            </span>
            <span className="ml-1.5 font-body text-xs tracking-[0.2em] uppercase text-muted">
              Admin
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 text-muted hover:text-foreground transition-colors"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
        <SidebarNav
          pathname={pathname}
          onSignOut={handleSignOut}
          onNavigate={() => setMobileOpen(false)}
        />
      </aside>
    </>
  );
}
