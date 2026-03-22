# Skill: Checkout Flow

Read before touching any checkout, payment, or order creation code.

## Architecture Overview

```
User confirms cart
  → POST /api/checkout/create-session
    → Validate cart items against Supabase stock
    → Calculate shipping (zone-based)
    → Calculate VAT (20% for UK, rules vary for EU/international)
    → Create pending order in Supabase
    → Create Stripe PaymentIntent (or Paystack transaction)
  → Client completes payment
  → Webhook fires (stripe/paystack)
    → Verify webhook signature
    → Update order status to 'processing'
    → Decrement stock in product_variants
    → Send order confirmation email via Resend
  → Redirect to /checkout/success?order_id=xxx
```

## Payment Routing

```js
// lib/paystack.js — use for NGN currency / Nigerian billing address
// lib/stripe.js — use for GBP, USD, EUR, all other markets

function getPaymentProvider(currency, billingCountry) {
  if (currency === "NGN" || billingCountry === "NG") return "paystack";
  return "stripe";
}
```

Never process both simultaneously. Route clearly based on currency/country.

## Order Creation (Supabase)

Always create order as `status: 'pending'` BEFORE payment.
Only move to `'processing'` in the webhook AFTER payment confirmation.
Never trust client-side data for prices — always recalculate server-side.

```js
// api/checkout/route.js
export async function POST(request) {
  const { cartItems, shippingAddress, guestEmail } = await request.json();
  const supabase = createServerClient();

  // 1. Validate every item against current DB prices and stock
  const productIds = cartItems.map((i) => i.productId);
  const { data: variants } = await supabase
    .from("product_variants")
    .select(
      "id, product_id, stock_count, additional_price, products(base_price)",
    )
    .in(
      "id",
      cartItems.map((i) => i.variantId),
    );

  // 2. Check stock
  for (const item of cartItems) {
    const variant = variants.find((v) => v.id === item.variantId);
    if (!variant || variant.stock_count < item.quantity) {
      return Response.json(
        { error: `${item.name} is out of stock` },
        { status: 400 },
      );
    }
  }

  // 3. Recalculate totals server-side
  const subtotal = cartItems.reduce((sum, item) => {
    const variant = variants.find((v) => v.id === item.variantId);
    return (
      sum +
      (variant.products.base_price + variant.additional_price) * item.quantity
    );
  }, 0);

  const shippingCost = calculateShipping(shippingAddress.countryCode);
  const vatAmount = calculateVAT(subtotal, shippingAddress.countryCode);
  const total = subtotal + shippingCost + vatAmount;

  // 4. Create pending order
  const { data: order } = await supabase
    .from("orders")
    .insert({
      user_id: session?.user?.id ?? null,
      guest_email: guestEmail ?? null,
      status: "pending",
      subtotal,
      shipping_cost: shippingCost,
      vat_amount: vatAmount,
      total,
      shipping_address: shippingAddress,
      payment_provider: "stripe",
    })
    .select()
    .single();

  // 5. Create order items
  await supabase.from("order_items").insert(
    cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId,
      quantity: item.quantity,
      unit_price: variants.find((v) => v.id === item.variantId).products
        .base_price,
      total_price:
        variants.find((v) => v.id === item.variantId).products.base_price *
        item.quantity,
    })),
  );

  // 6. Create Stripe PaymentIntent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: "gbp",
    metadata: { orderId: order.id },
    automatic_payment_methods: { enabled: true }, // enables Apple Pay, Google Pay, Klarna
  });

  return Response.json({
    clientSecret: paymentIntent.client_secret,
    orderId: order.id,
  });
}
```

## Shipping Zone Rates (pence)

```js
// lib/shipping.js
const SHIPPING_ZONES = {
  GB: { name: "UK Standard", cost: 395, freeAbove: 5000 }, // £3.95, free over £50
  NG: { name: "Nigeria DHL", cost: 2500, freeAbove: 25000 }, // £25.00, free over £250
  EU: { name: "EU Standard", cost: 995, freeAbove: 10000 }, // £9.95, free over £100
  DEFAULT: { name: "International", cost: 1495, freeAbove: 15000 },
};

export function calculateShipping(countryCode, subtotal) {
  const zone = SHIPPING_ZONES[countryCode] ?? SHIPPING_ZONES.DEFAULT;
  return subtotal >= zone.freeAbove ? 0 : zone.cost;
}
```

## VAT Calculation

```js
// lib/vat.js
export function calculateVAT(subtotal, countryCode) {
  // UK: 20% VAT always included/added
  if (countryCode === "GB") return Math.round(subtotal * 0.2);
  // EU: varies by country — simplified: charge UK VAT, reconcile later
  // Non-EU: typically zero-rated for export
  return 0;
}
```

Note: Get an accountant to confirm VAT handling for EU/international before launch.

## Webhook Handlers

### Stripe Webhook

```js
// app/api/webhooks/stripe/route.js
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(request) {
  const body = await request.text();
  const signature = headers().get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const { orderId } = event.data.object.metadata;
    await fulfillOrder(orderId, event.data.object.id);
  }

  if (event.type === "payment_intent.payment_failed") {
    await cancelOrder(event.data.object.metadata.orderId);
  }

  return Response.json({ received: true });
}
```

### Paystack Webhook

```js
// app/api/webhooks/paystack/route.js
import crypto from "crypto";

export async function POST(request) {
  const body = await request.text();
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(body)
    .digest("hex");

  if (hash !== request.headers.get("x-paystack-signature")) {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);
  if (event.event === "charge.success") {
    await fulfillOrder(event.data.metadata.orderId, event.data.reference);
  }

  return Response.json({ received: true });
}
```

### fulfillOrder (shared)

```js
async function fulfillOrder(orderId, paymentReference) {
  const supabase = createServerClient(); // service role

  // 1. Update order status
  await supabase
    .from("orders")
    .update({
      status: "processing",
      payment_reference: paymentReference,
    })
    .eq("id", orderId);

  // 2. Decrement stock
  const { data: items } = await supabase
    .from("order_items")
    .select("variant_id, quantity")
    .eq("order_id", orderId);

  for (const item of items) {
    await supabase.rpc("decrement_stock", {
      variant_id: item.variant_id,
      qty: item.quantity,
    });
  }

  // 3. Send confirmation email
  const order = await getOrderWithItems(orderId);
  await sendOrderConfirmationEmail(order);
}
```

## Stock Decrement (Supabase RPC — prevents race conditions)

```sql
-- Create this function in Supabase SQL editor
CREATE OR REPLACE FUNCTION decrement_stock(variant_id UUID, qty INT)
RETURNS void AS $$
  UPDATE product_variants
  SET stock_count = GREATEST(stock_count - qty, 0)
  WHERE id = variant_id;
$$ LANGUAGE sql;
```

## Do Not

- Never adjust prices client-side
- Never skip webhook signature verification
- Never fulfil order before payment confirmation
- Never store card details — Stripe/Paystack handles all card data
- Never run stock decrement in a loop without atomic operation (use RPC)
