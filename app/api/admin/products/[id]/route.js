import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import supabaseAdmin from "@/lib/supabase/admin";

async function assertAdmin() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.app_metadata?.role !== "admin") return null;
  return user;
}

export async function PATCH(request, { params }) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const { id } = await params;
  const body = await request.json();
  const { variants, ...productData } = body;

  const { error } = await supabaseAdmin
    .from("products")
    .update(productData)
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Replace variants: delete existing, re-insert
  if (variants) {
    await supabaseAdmin.from("product_variants").delete().eq("product_id", id);
    const variantRows = variants.map((v) => ({ ...v, product_id: id }));
    const { error: varErr } = await supabaseAdmin.from("product_variants").insert(variantRows);
    if (varErr) console.error("Variant upsert:", varErr);
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request, { params }) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const { id } = await params;

  // Cascade deletes variants (FK constraint)
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
