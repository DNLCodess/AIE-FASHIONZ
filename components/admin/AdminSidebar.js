"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Tag, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/categories", label: "Categories", icon: Tag },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="w-56 shrink-0 border-r border-border bg-surface min-h-screen sticky top-0 flex flex-col">
      {/* Brand */}
      <div className="h-14 flex items-center px-5 border-b border-border">
        <span className="font-heading text-base tracking-[0.15em] uppercase text-foreground">
          AIE
        </span>
        <span className="ml-1.5 font-body text-[10px] tracking-[0.2em] uppercase text-muted">
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-0.5 px-2">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 font-body text-sm transition-colors rounded-sm ${
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

      {/* Sign out */}
      <div className="p-2 border-t border-border">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full font-body text-sm text-muted hover:text-error transition-colors rounded-sm"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
