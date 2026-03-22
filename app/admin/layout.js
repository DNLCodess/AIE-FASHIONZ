import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = { title: "Admin | AIE Fashionz" };

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirect=/admin");

  // Role is stored in app_metadata (set server-side via service role)
  if (user.app_metadata?.role !== "admin") {
    redirect("/?error=unauthorized");
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />

      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="h-14 border-b border-border flex items-center px-6 gap-4 bg-surface sticky top-0 z-10">
          <span className="font-body text-xs tracking-[0.3em] uppercase text-muted">
            AIE Fashionz
          </span>
          <span className="text-border">·</span>
          <span className="font-body text-xs text-muted">Admin</span>
          <div className="ml-auto font-body text-xs text-muted">{user.email}</div>
        </div>

        {/* Page content */}
        <main className="p-6 md:p-8 max-w-6xl">{children}</main>
      </div>
    </div>
  );
}
