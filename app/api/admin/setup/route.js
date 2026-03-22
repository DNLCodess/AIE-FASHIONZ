import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabase/admin";

/**
 * Developer-only endpoint to promote a user to admin.
 *
 * Protected by SETUP_SECRET env var — never expose this publicly.
 *
 * Usage:
 *   curl -X POST https://your-domain.com/api/admin/setup \
 *     -H "Content-Type: application/json" \
 *     -d '{"secret": "YOUR_SETUP_SECRET", "email": "you@example.com"}'
 *
 * Or via browser fetch in the console:
 *   fetch('/api/admin/setup', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ secret: 'YOUR_SETUP_SECRET', email: 'you@example.com' })
 *   }).then(r => r.json()).then(console.log)
 */
export async function POST(request) {
  const setupSecret = process.env.SETUP_SECRET;

  if (!setupSecret) {
    return NextResponse.json(
      { error: "SETUP_SECRET is not configured." },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const { secret, email } = body;

  // ── 1. Verify secret ─────────────────────────────────────
  if (!secret || secret !== setupSecret) {
    return NextResponse.json({ error: "Invalid secret." }, { status: 401 });
  }

  if (!email) {
    return NextResponse.json({ error: "email is required." }, { status: 400 });
  }

  // ── 2. Look up user by email ──────────────────────────────
  const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();

  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 500 });
  }

  const user = users.find((u) => u.email === email);

  if (!user) {
    return NextResponse.json(
      { error: `No user found with email: ${email}` },
      { status: 404 }
    );
  }

  // ── 3. Promote to admin via app_metadata ─────────────────
  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
    user.id,
    { app_metadata: { ...user.app_metadata, role: "admin" } }
  );

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: `${email} has been promoted to admin.`,
    userId: user.id,
  });
}
