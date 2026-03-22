import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export async function generateMetadata({ params }) {
  return { title: `Order ${(await params).id} | AIE Fashionz` };
}

export default async function OrderDetailPage({ params }) {
  const { id } = await params;
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

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .eq("user_id", user.id) // RLS + explicit guard
    .single();

  if (!order) notFound();

  const currency = order.currency ?? "GBP";

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Link
        href="/account/orders"
        className="font-body text-xs text-muted hover:text-foreground transition-colors"
      >
        ← Orders
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg text-foreground">{order.reference}</h2>
          <p className="font-body text-xs text-muted mt-1">
            Placed{" "}
            {new Date(order.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <StatusPill status={order.status} />
      </div>

      {/* Items */}
      <section className="border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-heading text-sm text-foreground">Items</h3>
        </div>
        <ul className="divide-y divide-border">
          {order.order_items.map((item) => (
            <li key={item.id} className="flex items-center justify-between px-6 py-4 gap-4">
              <div className="min-w-0">
                <p className="font-body text-sm text-foreground">{item.title}</p>
                {(item.size || item.colour) && (
                  <p className="font-body text-xs text-muted mt-0.5">
                    {[item.size, item.colour].filter(Boolean).join(" · ")}
                  </p>
                )}
                <p className="font-body text-xs text-muted mt-0.5">Qty: {item.quantity}</p>
              </div>
              <span className="font-heading text-sm text-foreground shrink-0">
                {formatCurrency(item.price * item.quantity, currency)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Totals + Address grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Totals */}
        <section className="border border-border p-6 space-y-3">
          <h3 className="font-heading text-sm text-foreground mb-4">Payment Summary</h3>
          <Row label="Subtotal" value={formatCurrency(order.subtotal, currency)} />
          <Row label="Shipping" value={formatCurrency(order.shipping, currency)} />
          {order.vat > 0 && <Row label="VAT (20%)" value={formatCurrency(order.vat, currency)} />}
          <div className="h-px bg-border" />
          <Row
            label="Total"
            value={formatCurrency(order.total, currency)}
            bold
          />
        </section>

        {/* Delivery address */}
        <section className="border border-border p-6">
          <h3 className="font-heading text-sm text-foreground mb-4">Delivery Address</h3>
          <address className="font-body text-sm text-muted not-italic space-y-0.5">
            <p>{order.first_name} {order.last_name}</p>
            <p>{order.address_line1}</p>
            {order.address_line2 && <p>{order.address_line2}</p>}
            <p>{order.city}{order.state ? `, ${order.state}` : ""} {order.postcode}</p>
            <p>{order.country}</p>
          </address>
        </section>
      </div>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between">
      <span className={`font-body text-sm ${bold ? "text-foreground" : "text-muted"}`}>{label}</span>
      <span className={`${bold ? "font-heading text-base text-foreground" : "font-body text-sm text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    pending:    "border-border text-muted",
    processing: "border-gold text-gold",
    shipped:    "border-foreground text-foreground",
    delivered:  "border-success text-success",
    cancelled:  "border-error text-error",
  };
  return (
    <span className={`border px-3 py-1 font-body text-[11px] uppercase tracking-widest ${map[status] ?? "border-border text-muted"}`}>
      {status}
    </span>
  );
}
