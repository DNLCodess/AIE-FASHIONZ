"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Package, Heart, User, LogOut } from "lucide-react";

const NAV = [
  { href: "/account", label: "Overview", icon: User, exact: true },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/profile", label: "Profile", icon: User },
];

export default function AccountSidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="space-y-1" aria-label="Account navigation">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-3.5 font-body text-base transition-colors ${
              active
                ? "bg-surface-raised text-foreground border-l-2 border-gold"
                : "text-muted hover:text-foreground hover:bg-surface-raised"
            }`}
          >
            <Icon size={16} className={active ? "text-gold" : ""} />
            {label}
          </Link>
        );
      })}

      <div className="pt-4 border-t border-border mt-4">
        <p className="px-4 font-body text-sm text-muted mb-2 truncate">{user.email}</p>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3.5 w-full font-body text-base text-muted hover:text-error transition-colors text-left"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </nav>
  );
}
