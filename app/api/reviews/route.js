import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import supabaseAdmin from "@/lib/supabase/admin";

export async function POST(req) {
  try {
    const { productId, rating, title, body } = await req.json();

    // ── Validate inputs ──────────────────────────────────────────────────────
    if (!productId?.trim()) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
    }
    if (!body?.trim() || body.trim().length < 10) {
      return NextResponse.json({ error: "Review body must be at least 10 characters." }, { status: 400 });
    }
    if (body.trim().length > 1000) {
      return NextResponse.json({ error: "Review body must be 1000 characters or fewer." }, { status: 400 });
    }

    // ── Auth ─────────────────────────────────────────────────────────────────
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
    if (!user) {
      return NextResponse.json({ error: "You must be signed in to leave a review." }, { status: 401 });
    }

    // ── Verify purchase ──────────────────────────────────────────────────────
    // User must have a delivered/shipped order containing this product.
    // orderId is resolved server-side only — never trusted from client.
    const { data: eligibleOrder } = await supabase
      .from("orders")
      .select("id, order_items!inner(product_id)")
      .eq("user_id", user.id)
      .in("status", ["delivered", "shipped"])
      .eq("order_items.product_id", productId)
      .limit(1)
      .maybeSingle();

    // Allow editing an existing review even if order status changed
    const { data: existingReview } = await supabase
      .from("reviews")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .maybeSingle();

    if (!eligibleOrder && !existingReview) {
      return NextResponse.json(
        { error: "Reviews are only available after a confirmed delivery." },
        { status: 403 }
      );
    }

    const isVerified = Boolean(eligibleOrder);
    // Always use server-resolved order ID — never accept orderId from client
    const resolvedOrderId = eligibleOrder?.id ?? null;

    // ── Upsert review ────────────────────────────────────────────────────────
    // is_published: false — requires admin moderation before going live
    const { error } = await supabaseAdmin
      .from("reviews")
      .upsert(
        {
          product_id: productId,
          user_id: user.id,
          order_id: resolvedOrderId,
          rating,
          title: title?.trim().slice(0, 200) || null,
          body: body.trim(),
          is_verified: isVerified,
          is_published: false,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,product_id" }
      );

    if (error) {
      return NextResponse.json({ error: "Failed to save review." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Review submitted for moderation." });
  } catch (err) {
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
