import supabaseAdmin from "@/lib/supabase/admin";
import { sendOrderConfirmation } from "@/lib/email/send";

/**
 * Fulfil a paid order: update status, decrement stock, send confirmation email.
 * @param {string} orderId
 * @param {string} paymentProvider - "stripe" | "paystack"
 */
export async function fulfillOrder(orderId, paymentProvider) {
  // ── 1. Fetch order + items ──────────────────────────────
  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    throw new Error(`Order ${orderId} not found: ${orderError?.message}`);
  }

  // ── 2. Atomic idempotency lock — prevents double-fulfilment on concurrent webhook retries
  // Only updates if status is still "pending"; returns nothing if already processed.
  const { data: locked, error: lockError } = await supabaseAdmin
    .from("orders")
    .update({ status: "processing" })
    .eq("id", orderId)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  if (lockError) {
    throw new Error(`Failed to lock order ${orderId}: ${lockError.message}`);
  }

  if (!locked) {
    // Another invocation already moved status past "pending"
    return;
  }

  // ── 3. Decrement stock for each variant ─────────────────
  for (const item of order.order_items) {
    if (item.variant_id) {
      const { error: stockError } = await supabaseAdmin.rpc("decrement_stock", {
        p_variant_id: item.variant_id,
        p_quantity: item.quantity,
      });

      if (stockError) {
        // Log but don't fail — stock reconciliation can happen offline
        console.error(`Stock decrement failed for variant ${item.variant_id}:`, stockError);
      }
    }
  }

  // ── 4. Set payment provider + fulfilled_at (status already set above) ───
  const { error: updateError } = await supabaseAdmin
    .from("orders")
    .update({ payment_provider: paymentProvider, fulfilled_at: new Date().toISOString() })
    .eq("id", orderId);

  if (updateError) {
    throw new Error(`Failed to update order payment details: ${updateError.message}`);
  }

  // ── 5. Send confirmation email ───────────────────────────
  try {
    await sendOrderConfirmation(order);
  } catch (emailErr) {
    // Non-fatal — log but don't block
    console.error("Failed to send order confirmation email:", emailErr);
  }
}
