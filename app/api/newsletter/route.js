import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabase/admin";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body ?? {};

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .upsert(
        { email: email.trim().toLowerCase(), subscribed_at: new Date().toISOString() },
        { onConflict: "email", ignoreDuplicates: true }
      );

    if (error) {
      console.error("[newsletter] Supabase error:", error.message);
      return NextResponse.json({ error: "Could not save your subscription. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[newsletter] Unexpected error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
