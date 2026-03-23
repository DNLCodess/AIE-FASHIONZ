import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import AccountSidebar from "@/components/account/AccountSidebar";

export const metadata = {
  title: "My Account | Aiefashion",
  robots: { index: false, follow: false },
};

export default async function AccountLayout({ children }) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {}, // read-only in layout
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirect=/account");

  return (
    <div className="min-h-screen pt-24 pb-24 bg-background">
      <div className="container">
        {/* Page header */}
        <div className="mb-10 md:mb-14">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-muted mb-3">
            My account
          </p>
          <h1
            className="font-heading leading-none text-foreground"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            {user.user_metadata?.first_name
              ? `Hello, ${user.user_metadata.first_name}.`
              : "My Account"}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 xl:gap-16 items-start">
          <div className="border-b border-border md:border-b-0 pb-6 md:pb-0">
            <AccountSidebar user={user} />
          </div>
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
