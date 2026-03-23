import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "My Orders | Aiefashion" };

export default async function OrdersPage() {
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

  const { data: orders } = await supabase
    .from("orders")
    .select("id, reference, status, total, currency, created_at, country")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h2 className="font-heading text-lg text-foreground mb-8">Order History</h2>

      {orders?.length ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="flex items-center justify-between border border-border p-5 hover:bg-surface-raised transition-colors"
            >
              <div className="min-w-0">
                <p className="font-body text-sm text-foreground">{order.reference}</p>
                <p className="font-body text-xs text-muted mt-0.5">
                  {new Date(order.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="font-heading text-sm text-foreground">
                  {formatCurrency(order.total, order.currency)}
                </p>
                <StatusBadge status={order.status} />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="border border-border p-14 text-center">
          <div className="w-px h-10 bg-border mx-auto mb-6" />
          <p className="font-heading text-lg text-muted mb-2">No orders yet</p>
          <p className="font-body text-sm text-muted mb-8">
            Your order history will appear here once you&apos;ve made a purchase.
          </p>
          <Link
            href="/shop"
            className="px-10 py-4 font-body text-sm tracking-widest uppercase bg-gold text-foreground hover:bg-gold-dark transition-colors"
          >
            Shop Now
          </Link>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending:    "text-muted",
    processing: "text-gold",
    shipped:    "text-foreground",
    delivered:  "text-success",
    cancelled:  "text-error",
    refunded:   "text-error",
  };
  return (
    <p className={`font-body text-[11px] uppercase tracking-wide mt-0.5 ${map[status] ?? "text-muted"}`}>
      {status}
    </p>
  );
}
