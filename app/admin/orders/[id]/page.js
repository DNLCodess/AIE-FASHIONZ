import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export const metadata = { title: "Order Detail | Admin" };

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();

  if (!order) notFound();

  const currency = order.currency ?? "USD";

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link href="/admin/orders" className="font-body text-xs text-muted hover:text-foreground transition-colors">
            ← Orders
          </Link>
          <h1 className="font-heading text-2xl text-foreground mt-2">{order.reference}</h1>
          <p className="font-body text-sm text-muted mt-0.5">
            {new Date(order.created_at).toLocaleDateString("en-US", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </p>
        </div>

        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
      </div>

      {/* Customer */}
      <section className="border border-border p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h3 className="font-heading text-sm text-foreground mb-3">Customer</h3>
          <p className="font-body text-sm text-foreground">{order.first_name} {order.last_name}</p>
          <p className="font-body text-sm text-muted">{order.email}</p>
          {order.phone && <p className="font-body text-sm text-muted">{order.phone}</p>}
        </div>
        <div>
          <h3 className="font-heading text-sm text-foreground mb-3">Delivery Address</h3>
          <address className="font-body text-sm text-muted not-italic space-y-0.5">
            <p>{order.address_line1}</p>
            {order.address_line2 && <p>{order.address_line2}</p>}
            <p>{order.city}{order.state ? `, ${order.state}` : ""} {order.postcode}</p>
            <p>{order.country}</p>
          </address>
        </div>
      </section>

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

      {/* Totals */}
      <section className="border border-border p-6 space-y-3 max-w-xs ml-auto">
        <h3 className="font-heading text-sm text-foreground mb-4">Payment</h3>
        <Row label="Subtotal" value={formatCurrency(order.subtotal, currency)} />
        <Row label="Shipping" value={formatCurrency(order.shipping, currency)} />
        {/* VAT row removed — US store */}
        <div className="h-px bg-border" />
        <Row label="Total" value={formatCurrency(order.total, currency)} bold />
        {order.payment_provider && (
          <p className="font-body text-xs text-muted capitalize">via {order.payment_provider}</p>
        )}
      </section>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between">
      <span className={`font-body text-sm ${bold ? "text-foreground font-medium" : "text-muted"}`}>{label}</span>
      <span className={bold ? "font-heading text-base text-foreground" : "font-body text-sm text-foreground"}>
        {value}
      </span>
    </div>
  );
}
