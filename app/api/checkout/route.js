import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { initializeTransaction } from "@/lib/paystack";
import { calculateShipping } from "@/lib/shipping";
import { calculateVAT } from "@/lib/vat";
import supabaseAdmin from "@/lib/supabase/admin";
import { nanoid } from "nanoid";

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, contact, address, delivery, currency = "USD" } = body;

    // ── 1. Validate input ────────────────────────────────────
    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }
    if (!contact?.email || !address?.line1 || !address?.country) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // ── 2. Recalculate totals server-side (never trust client) ─
    const variantIds = items.map((i) => i.variantId).filter(Boolean);
    if (variantIds.length !== items.length) {
      return NextResponse.json({ error: "Invalid cart items." }, { status: 400 });
    }

    const { data: variantRows, error: variantFetchError } = await supabaseAdmin
      .from("product_variants")
      .select("id, price")
      .in("id", variantIds);

    if (variantFetchError) {
      console.error("Variant fetch error:", variantFetchError);
      return NextResponse.json({ error: "Failed to verify cart prices." }, { status: 500 });
    }

    const priceMap = new Map(variantRows.map((v) => [v.id, v.price]));

    const missingVariant = items.some((item) => !priceMap.has(item.variantId));
    if (missingVariant) {
      return NextResponse.json({ error: "Invalid cart items." }, { status: 400 });
    }

    const subtotal = items.reduce(
      (sum, item) => sum + (priceMap.get(item.variantId) ?? 0) * item.quantity,
      0
    );
    const shipping = calculateShipping(address.country, subtotal);
    const vat = calculateVAT(subtotal, address.country); // always 0 (US store)
    const total = subtotal + shipping + vat;

    // ── 3. Create pending order in Supabase ──────────────────
    const reference = `AIE-${nanoid(10).toUpperCase()}`;

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        reference,
        status: "pending",
        email: contact.email,
        first_name: contact.firstName,
        last_name: contact.lastName,
        phone: contact.phone ?? null,
        address_line1: address.line1,
        address_line2: address.line2 ?? null,
        city: address.city,
        state: address.state ?? null,
        postcode: address.postcode,
        country: address.country,
        currency,
        subtotal,
        shipping,
        vat,
        total,
      })
      .select("id")
      .single();

    if (orderError) {
      console.error("Order insert error:", orderError);
      return NextResponse.json({ error: "Failed to create order." }, { status: 500 });
    }

    // ── 4. Insert order items ────────────────────────────────
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId,
      title: item.title,
      size: item.size ?? null,
      colour: item.colour ?? null,
      price: priceMap.get(item.variantId),
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(orderItems);

    if (itemsError) {
      console.error("Order items insert error:", itemsError);
      return NextResponse.json({ error: "Failed to save order items." }, { status: 500 });
    }

    // ── 5. Create payment intent ─────────────────────────────
    const usePaystack = address.country === "NG";

    if (usePaystack) {
      // Paystack — amounts in kobo (Nigerian currency already in kobo in our system)
      const txData = await initializeTransaction({
        email: contact.email,
        amountInKobo: total,
        reference,
        callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?order_id=${order.id}&provider=paystack`,
        metadata: { order_id: order.id, reference },
      });

      return NextResponse.json({
        provider: "paystack",
        authorizationUrl: txData.authorization_url,
        orderId: order.id,
      });
    } else {
      // Stripe — amounts in smallest currency unit (cents for USD)
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: currency.toLowerCase(),
        automatic_payment_methods: { enabled: true },
        metadata: { order_id: order.id, reference },
        receipt_email: contact.email,
      });

      return NextResponse.json({
        provider: "stripe",
        clientSecret: paymentIntent.client_secret,
        orderId: order.id,
      });
    }
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
