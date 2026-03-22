import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Dashboard | Admin" };

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );

  // Parallel fetches
  const [ordersRes, productCountRes, recentOrdersRes] = await Promise.all([
    supabase.from("orders").select("total, status, currency"),
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("id, reference, email, total, currency, status, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const orders = ordersRes.data ?? [];
  const totalRevenue = orders
    .filter((o) => ["processing", "shipped", "delivered"].includes(o.status))
    .reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const productCount = productCountRes.count ?? 0;
  const recentOrders = recentOrdersRes.data ?? [];

  const stats = [
    { label: "Total Revenue", value: formatCurrency(totalRevenue, "GBP"), sub: "Paid orders" },
    { label: "Total Orders", value: orders.length, sub: `${pendingCount} pending` },
    { label: "Products", value: productCount, sub: "Active listings" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-2xl text-foreground mb-1">Dashboard</h1>
        <p className="font-body text-sm text-muted">Overview of your store</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="border border-border p-6 bg-surface">
            <p className="font-body text-xs tracking-wide text-muted uppercase mb-3">{s.label}</p>
            <p className="font-heading text-3xl text-foreground mb-1">{s.value}</p>
            <p className="font-body text-xs text-muted">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-base text-foreground">Recent Orders</h2>
          <Link href="/admin/orders" className="font-body text-xs text-muted hover:text-foreground transition-colors">
            View all →
          </Link>
        </div>
        <OrderTable orders={recentOrders} />
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="font-heading text-base text-foreground mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products/new"
            className="px-5 py-2.5 font-body text-sm tracking-widest uppercase bg-gold text-foreground hover:bg-gold-dark transition-colors"
          >
            + New Product
          </Link>
          <Link
            href="/admin/orders"
            className="px-5 py-2.5 font-body text-sm tracking-widest uppercase border border-border text-muted hover:text-foreground transition-colors"
          >
            Manage Orders
          </Link>
          <Link
            href="/admin/categories"
            className="px-5 py-2.5 font-body text-sm tracking-widest uppercase border border-border text-muted hover:text-foreground transition-colors"
          >
            Categories
          </Link>
        </div>
      </section>
    </div>
  );
}

function OrderTable({ orders }) {
  if (!orders.length) {
    return <p className="font-body text-sm text-muted py-6">No orders yet.</p>;
  }

  return (
    <div className="border border-border overflow-x-auto">
      <table className="w-full font-body text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-raised">
            {["Reference", "Customer", "Total", "Status", "Date"].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs tracking-wide text-muted uppercase font-normal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-surface-raised transition-colors">
              <td className="px-4 py-3">
                <Link href={`/admin/orders/${order.id}`} className="text-foreground hover:text-gold transition-colors">
                  {order.reference}
                </Link>
              </td>
              <td className="px-4 py-3 text-muted truncate max-w-[160px]">{order.email}</td>
              <td className="px-4 py-3 font-heading text-foreground">
                {formatCurrency(order.total, order.currency)}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={order.status} />
              </td>
              <td className="px-4 py-3 text-muted">
                {new Date(order.created_at).toLocaleDateString("en-GB")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    pending:    "text-muted",
    processing: "text-gold",
    shipped:    "text-foreground",
    delivered:  "text-success",
    cancelled:  "text-error",
    refunded:   "text-error",
  };
  return (
    <span className={`text-[11px] uppercase tracking-wide ${colors[status] ?? "text-muted"}`}>
      {status}
    </span>
  );
}
