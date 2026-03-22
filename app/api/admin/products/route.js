import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import supabaseAdmin from "@/lib/supabase/admin";
import { generateSlug } from "@/lib/utils";

async function assertAdmin(request) {
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

export async function POST(request) {
  const user = await assertAdmin(request);
  if (!user) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const body = await request.json();
  const { variants, ...productData } = body;

  const slug = productData.slug || generateSlug(productData.title);

  const { data: product, error } = await supabaseAdmin
    .from("products")
    .insert({ ...productData, slug })
    .select("id")
    .single();

  if (error) {
    console.error("Product insert:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (variants?.length) {
    const variantRows = variants.map((v) => ({ ...v, product_id: product.id }));
    const { error: varErr } = await supabaseAdmin.from("product_variants").insert(variantRows);
    if (varErr) console.error("Variant insert:", varErr);
  }

  return NextResponse.json({ id: product.id }, { status: 201 });
}
