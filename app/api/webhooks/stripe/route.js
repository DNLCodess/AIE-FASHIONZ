import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { fulfillOrder } from "@/lib/fulfillOrder";

export const config = { api: { bodyParser: false } };

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata?.order_id;

    if (!orderId) {
      console.error("No order_id in payment_intent metadata", paymentIntent.id);
      return NextResponse.json({ received: true });
    }

    try {
      await fulfillOrder(orderId, "stripe");
    } catch (err) {
      console.error("fulfillOrder failed:", err);
      return NextResponse.json({ error: "Fulfillment failed." }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
