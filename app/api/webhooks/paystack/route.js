import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { fulfillOrder } from "@/lib/fulfillOrder";

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  // ── Verify HMAC-SHA512 signature ─────────────────────────
  const expectedSignature = createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.error("Paystack webhook signature mismatch");
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (event.event === "charge.success") {
    const orderId = event.data?.metadata?.order_id;

    if (!orderId) {
      console.error("No order_id in Paystack metadata", event.data?.reference);
      return NextResponse.json({ received: true });
    }

    try {
      await fulfillOrder(orderId, "paystack");
    } catch (err) {
      console.error("fulfillOrder failed:", err);
      return NextResponse.json({ error: "Fulfillment failed." }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
