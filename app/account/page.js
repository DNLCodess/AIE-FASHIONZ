import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Account Overview | Aiefashion" };

export default async function AccountOverviewPage() {
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

  // Fetch recent orders
  const { data: orders } = await supabase
    .from("orders")
    .select("id, reference, status, total, currency, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="space-y-10">
      {/* Recent orders */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-lg text-foreground">Recent Orders</h2>
          <Link
            href="/account/orders"
            className="font-body text-xs tracking-wide text-muted hover:text-foreground transition-colors"
          >
            View all →
          </Link>
        </div>

        {orders?.length ? (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between border border-border p-5 hover:bg-surface-raised transition-colors group"
              >
                <div>
                  <p className="font-body text-sm text-foreground">{order.reference}</p>
                  <p className="font-body text-xs text-muted mt-0.5">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-heading text-sm text-foreground">
                    {formatCurrency(order.total, order.currency)}
                  </p>
                  <OrderStatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border border-border p-10 text-center">
            <p className="font-body text-sm text-muted mb-4">No orders yet.</p>
            <Link
              href="/shop"
              className="font-body text-sm tracking-widest uppercase px-8 py-3 bg-gold text-foreground hover:bg-gold-dark transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </section>

      {/* Quick links */}
      <section>
        <h2 className="font-heading text-lg text-foreground mb-6">My Account</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { href: "/account/orders", label: "Order History", desc: "Track and manage your orders" },
            { href: "/account/wishlist", label: "Wishlist", desc: "Your saved pieces" },
            { href: "/account/profile", label: "Profile", desc: "Update your details and password" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border border-border p-6 hover:bg-surface-raised transition-colors"
            >
              <p className="font-heading text-base text-foreground mb-1">{item.label}</p>
              <p className="font-body text-xs text-muted">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function OrderStatusBadge({ status }) {
  const map = {
    pending:    { label: "Pending",    color: "text-muted" },
    processing: { label: "Processing", color: "text-gold" },
    shipped:    { label: "Shipped",    color: "text-foreground" },
    delivered:  { label: "Delivered",  color: "text-success" },
    cancelled:  { label: "Cancelled",  color: "text-error" },
  };
  const { label, color } = map[status] ?? { label: status, color: "text-muted" };
  return <p className={`font-body text-[11px] uppercase tracking-wide mt-0.5 ${color}`}>{label}</p>;
}
