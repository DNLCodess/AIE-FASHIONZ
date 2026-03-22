import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabase/admin";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Developer-only endpoint to promote a user to admin.
 * DISABLED in production — use the Supabase Dashboard instead:
 *   Auth → Users → Edit user → app_metadata → { "role": "admin" }
 *
 * Only available when NODE_ENV !== "production".
 */
export async function POST(request) {
  // Hard-disabled in production
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const setupSecret = process.env.SETUP_SECRET;

  if (!setupSecret) {
    return NextResponse.json(
      { error: "SETUP_SECRET is not configured." },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const { secret, email } = body;

  // Timing-safe secret comparison to prevent timing attacks
  if (!secret) {
    return NextResponse.json({ error: "Invalid secret." }, { status: 401 });
  }

  let secretsMatch = false;
  try {
    const a = Buffer.from(secret);
    const b = Buffer.from(setupSecret);
    secretsMatch = a.length === b.length && timingSafeEqual(a, b);
  } catch {
    secretsMatch = false;
  }

  if (!secretsMatch) {
    return NextResponse.json({ error: "Invalid secret." }, { status: 401 });
  }

  if (!email) {
    return NextResponse.json({ error: "email is required." }, { status: 400 });
  }

  // Look up user by email
  const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();

  if (listError) {
    return NextResponse.json({ error: "Setup failed." }, { status: 500 });
  }

  const user = users.find((u) => u.email === email);

  if (!user) {
    // Generic error — don't leak whether the email exists
    return NextResponse.json({ error: "Setup failed." }, { status: 404 });
  }

  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
    user.id,
    { app_metadata: { ...user.app_metadata, role: "admin" } }
  );

  if (updateError) {
    return NextResponse.json({ error: "Setup failed." }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: `User promoted to admin.`,
  });
}
