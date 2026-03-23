import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Dashboard | Admin" };

function supabaseClient(cookieStore) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const supabase = supabaseClient(cookieStore);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    allOrdersRes,
    productCountRes,
    recentOrdersRes,
    revenueTrendRes,
    genderRes,
    countryRes,
  ] = await Promise.all([
    supabase.from("orders").select("total, status, currency"),
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("id, reference, email, first_name, last_name, total, currency, status, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("orders")
      .select("created_at, total, status")
      .gte("created_at", thirtyDaysAgo.toISOString())
      .in("status", ["processing", "shipped", "delivered"]),
    supabase.from("profiles").select("gender"),
    supabase
      .from("orders")
      .select("country, total")
      .not("country", "is", null),
  ]);

  const allOrders = allOrdersRes.data ?? [];
  const totalRevenue = allOrders
    .filter((o) => ["processing", "shipped", "delivered"].includes(o.status))
    .reduce((sum, o) => sum + o.total, 0);

  // Status counts
  const statusCounts = allOrders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  // Revenue by day (last 30 days)
  const revenueByDay = {};
  (revenueTrendRes.data ?? []).forEach((o) => {
    const day = o.created_at.slice(0, 10);
    revenueByDay[day] = (revenueByDay[day] ?? 0) + o.total;
  });
  const revenueDays = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
    return { key, label, value: revenueByDay[key] ?? 0 };
  });

  // Gender breakdown
  const genderData = genderRes.data ?? [];
  const genderCounts = {
    female: genderData.filter((p) => p.gender === "female").length,
    male: genderData.filter((p) => p.gender === "male").length,
    "non-binary": genderData.filter((p) => p.gender === "non-binary").length,
    unspecified: genderData.filter(
      (p) => !p.gender || p.gender === "prefer-not-to-say"
    ).length,
  };

  // Top countries by revenue
  const countryRevenue = {};
  (countryRes.data ?? []).forEach((o) => {
    if (o.country) countryRevenue[o.country] = (countryRevenue[o.country] ?? 0) + o.total;
  });
  const topCountries = Object.entries(countryRevenue)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const stats = [
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue, "USD"),
      sub: "Paid orders only",
      trend: null,
    },
    {
      label: "Total Orders",
      value: allOrders.length,
      sub: `${statusCounts.pending ?? 0} pending`,
      trend: null,
    },
    {
      label: "Products",
      value: productCountRes.count ?? 0,
      sub: "Active listings",
      trend: null,
    },
    {
      label: "Customers",
      value: genderData.length || "—",
      sub: "Registered accounts",
      trend: null,
    },
  ];

  const orderStatusSegments = [
    { label: "Pending",    value: statusCounts.pending    ?? 0, color: "#A8A7A3" },
    { label: "Processing", value: statusCounts.processing ?? 0, color: "#D4AF37" },
    { label: "Shipped",    value: statusCounts.shipped    ?? 0, color: "#1C1C1A" },
    { label: "Delivered",  value: statusCounts.delivered  ?? 0, color: "#2D7A47" },
    { label: "Cancelled",  value: statusCounts.cancelled  ?? 0, color: "#C0392B" },
  ].filter((s) => s.value > 0);

  const genderSegments = [
    { label: "Female",     value: genderCounts.female,      color: "#D4AF37" },
    { label: "Male",       value: genderCounts.male,        color: "#1C1C1A" },
    { label: "Non-binary", value: genderCounts["non-binary"], color: "#6B6A66" },
    { label: "Unspecified",value: genderCounts.unspecified, color: "#E8E5E0" },
  ].filter((s) => s.value > 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl text-foreground">Dashboard</h1>
        <p className="font-body text-sm text-muted mt-0.5">Store analytics overview</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="border border-border p-5 bg-surface">
            <p className="font-body text-[10px] tracking-widest text-muted uppercase mb-2">{s.label}</p>
            <p className="font-heading text-2xl text-foreground leading-none mb-1">{s.value}</p>
            <p className="font-body text-[11px] text-muted">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue trend */}
      <section className="border border-border bg-surface p-5">
        <h2 className="font-heading text-base text-foreground mb-1">Revenue — Last 30 Days</h2>
        <p className="font-body text-[11px] text-muted mb-4">Paid orders (processing, shipped, delivered)</p>
        <BarChart days={revenueDays} />
      </section>

      {/* Donut charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <section className="border border-border bg-surface p-5">
          <h2 className="font-heading text-base text-foreground mb-4">Order Status</h2>
          {orderStatusSegments.length > 0 ? (
            <DonutChartCard segments={orderStatusSegments} total={allOrders.length} label="orders" />
          ) : (
            <p className="font-body text-sm text-muted">No orders yet.</p>
          )}
        </section>

        <section className="border border-border bg-surface p-5">
          <h2 className="font-heading text-base text-foreground mb-1">Customer Gender</h2>
          <p className="font-body text-[11px] text-muted mb-4">Based on registration data</p>
          {genderSegments.length > 0 ? (
            <DonutChartCard segments={genderSegments} total={genderData.length} label="customers" />
          ) : (
            <p className="font-body text-sm text-muted">No profile data yet. Gender is collected on signup.</p>
          )}
        </section>
      </div>

      {/* Top countries */}
      {topCountries.length > 0 && (
        <section className="border border-border bg-surface p-5">
          <h2 className="font-heading text-base text-foreground mb-4">Revenue by Country</h2>
          <HorizontalBars
            items={topCountries.map(([country, revenue]) => ({
              label: country,
              value: revenue,
              display: formatCurrency(revenue, "USD"),
            }))}
          />
        </section>
      )}

      {/* Recent orders */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading text-base text-foreground">Recent Orders</h2>
          <Link href="/admin/orders" className="font-body text-xs text-muted hover:text-foreground transition-colors">
            View all →
          </Link>
        </div>
        <RecentOrdersTable orders={recentOrdersRes.data ?? []} />
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="font-heading text-base text-foreground mb-3">Quick Actions</h2>
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

// ─── Chart components ───────────────────────────────────────────────────────

function BarChart({ days }) {
  const maxValue = Math.max(...days.map((d) => d.value), 1);
  const svgH = 100;
  const barW = 8;
  const gap = 2;
  const totalW = days.length * (barW + gap);
  // Show only every 5th label to avoid crowding
  const labelStep = 5;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${totalW} ${svgH + 20}`}
        style={{ minWidth: "400px", width: "100%", height: "auto" }}
        aria-label="Revenue bar chart"
      >
        {days.map((day, i) => {
          const barH = ((day.value / maxValue) * svgH * 0.85);
          const x = i * (barW + gap);
          const y = svgH - barH;
          return (
            <g key={day.key}>
              <rect
                x={x}
                y={barH > 0 ? y : svgH - 1}
                width={barW}
                height={barH > 0 ? barH : 1}
                fill={barH > 0 ? "#D4AF37" : "#E8E5E0"}
                fillOpacity={barH > 0 ? 0.85 : 1}
              />
              {i % labelStep === 0 && (
                <text
                  x={x + barW / 2}
                  y={svgH + 14}
                  textAnchor="middle"
                  fontSize="6"
                  fill="#A8A7A3"
                  fontFamily="var(--font-body)"
                >
                  {day.label}
                </text>
              )}
            </g>
          );
        })}
        {/* Baseline */}
        <line x1={0} y1={svgH} x2={totalW} y2={svgH} stroke="#E8E5E0" strokeWidth="0.5" />
      </svg>
    </div>
  );
}

function DonutChartCard({ segments, total, label }) {
  const r = 50;
  const ir = 32;
  const cx = 65;
  const cy = 65;
  let currentAngle = -Math.PI / 2;
  const totalVal = segments.reduce((s, seg) => s + seg.value, 0);

  const arcs = segments.map((seg) => {
    const angle = totalVal > 0 ? (seg.value / totalVal) * 2 * Math.PI : 0;
    const x1 = cx + r * Math.cos(currentAngle);
    const y1 = cy + r * Math.sin(currentAngle);
    currentAngle += angle;
    const x2 = cx + r * Math.cos(currentAngle);
    const y2 = cy + r * Math.sin(currentAngle);
    const ix1 = cx + ir * Math.cos(currentAngle);
    const iy1 = cy + ir * Math.sin(currentAngle);
    const ix2 = cx + ir * Math.cos(currentAngle - angle);
    const iy2 = cy + ir * Math.sin(currentAngle - angle);
    const large = angle > Math.PI ? 1 : 0;
    const d =
      angle > 0
        ? `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${ir} ${ir} 0 ${large} 0 ${ix2} ${iy2} Z`
        : "";
    return { ...seg, d };
  });

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 130 130" className="w-28 h-28 shrink-0" aria-hidden="true">
        {arcs.map((arc, i) =>
          arc.d ? <path key={i} d={arc.d} fill={arc.color} /> : null
        )}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="13" fontFamily="var(--font-heading)" fill="#1C1C1A" fontWeight="400">
          {total}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="7" fontFamily="var(--font-body)" fill="#A8A7A3">
          {label}
        </text>
      </svg>

      <div className="space-y-1.5 min-w-0">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 shrink-0 rounded-none"
              style={{ background: seg.color }}
            />
            <span className="font-body text-xs text-muted truncate">{seg.label}</span>
            <span className="font-body text-xs text-foreground ml-auto pl-2 shrink-0">
              {totalVal > 0 ? Math.round((seg.value / totalVal) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HorizontalBars({ items }) {
  const maxValue = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="space-y-3">
      {items.map(({ label, value, display }) => (
        <div key={label} className="space-y-1">
          <div className="flex justify-between font-body text-xs">
            <span className="text-foreground">{label}</span>
            <span className="text-muted">{display}</span>
          </div>
          <div className="h-1.5 bg-surface-raised rounded-none overflow-hidden">
            <div
              className="h-full bg-gold transition-all duration-500"
              style={{ width: `${(value / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function RecentOrdersTable({ orders }) {
  if (!orders.length) {
    return <p className="font-body text-sm text-muted py-6">No orders yet.</p>;
  }

  return (
    <div className="border border-border overflow-x-auto">
      <table className="w-full font-body text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-raised">
            {["Reference", "Customer", "Total", "Status", "Date"].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs tracking-wide text-muted uppercase font-normal whitespace-nowrap">
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
              <td className="px-4 py-3 text-muted">
                {order.first_name} {order.last_name}
                <span className="block text-[11px] opacity-70 truncate max-w-35">{order.email}</span>
              </td>
              <td className="px-4 py-3 font-heading text-foreground whitespace-nowrap">
                {formatCurrency(order.total, order.currency)}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={order.status} />
              </td>
              <td className="px-4 py-3 text-muted whitespace-nowrap">
                {new Date(order.created_at).toLocaleDateString("en-US")}
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
