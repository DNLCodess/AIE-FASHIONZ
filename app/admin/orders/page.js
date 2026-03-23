import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Orders | Admin" };

const STATUSES = ["all", "pending", "processing", "shipped", "delivered", "cancelled"];

export default async function AdminOrdersPage({ searchParams }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );

  const params = await searchParams;
  const status = params?.status ?? "all";
  const page = parseInt(params?.page ?? "1", 10);
  const pageSize = 25;
  const from = (page - 1) * pageSize;

  let query = supabase
    .from("orders")
    .select("id, reference, email, first_name, last_name, total, currency, status, country, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);

  if (status !== "all") query = query.eq("status", status);

  const { data: orders, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / pageSize);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">Orders</h1>
        <p className="font-body text-sm text-muted mt-0.5">{count ?? 0} total</p>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-1 border-b border-border">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`px-4 py-2 font-body text-sm capitalize transition-colors border-b-2 -mb-px ${
              status === s
                ? "border-gold text-foreground"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      {/* Table */}
      {orders?.length ? (
        <>
          <div className="border border-border overflow-x-auto">
            <table className="w-full font-body text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-raised">
                  {["Reference", "Customer", "Country", "Total", "Status", "Date"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs tracking-wide text-muted uppercase font-normal whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-surface-raised transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${o.id}`} className="text-foreground hover:text-gold transition-colors">
                        {o.reference}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {o.first_name} {o.last_name}
                      <span className="block text-[11px] text-muted/70 truncate max-w-[160px]">{o.email}</span>
                    </td>
                    <td className="px-4 py-3 text-muted">{o.country}</td>
                    <td className="px-4 py-3 font-heading text-foreground">{formatCurrency(o.total, o.currency)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-4 py-3 text-muted whitespace-nowrap">
                      {new Date(o.created_at).toLocaleDateString("en-US")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2 font-body text-sm">
              {page > 1 && (
                <Link href={`/admin/orders?status=${status}&page=${page - 1}`}
                  className="px-3 py-1.5 border border-border text-muted hover:text-foreground transition-colors">
                  ← Prev
                </Link>
              )}
              <span className="text-muted">Page {page} of {totalPages}</span>
              {page < totalPages && (
                <Link href={`/admin/orders?status=${status}&page=${page + 1}`}
                  className="px-3 py-1.5 border border-border text-muted hover:text-foreground transition-colors">
                  Next →
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="border border-border p-12 text-center">
          <p className="font-body text-sm text-muted">No orders {status !== "all" ? `with status "${status}"` : "yet"}.</p>
        </div>
      )}
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
    <span className={`text-[11px] uppercase tracking-wide ${colors[status] ?? "text-muted"}`}>{status}</span>
  );
}
