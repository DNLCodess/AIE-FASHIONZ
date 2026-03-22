import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import supabaseAdmin from "@/lib/supabase/admin";
import { z } from "zod";

const variantSchema = z.object({
  size: z.string().optional(),
  colour: z.string().optional(),
  stock: z.number().int().min(0),
  additional_price: z.number().int().min(0).default(0),
});

const productPatchSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  description: z.string().optional(),
  category_id: z.string().uuid().optional(),
  base_price: z.number().int().positive().optional(),
  compare_price: z.number().int().positive().optional(),
  images: z.array(z.string().url()).optional(),
  materials: z.string().optional(),
  is_published: z.boolean().optional(),
  slug: z.string().optional(),
  variants: z.array(variantSchema).optional(),
});

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

  const parsed = productPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid product data." }, { status: 400 });
  }

  const { variants, ...productData } = parsed.data;

  const { error } = await supabaseAdmin
    .from("products")
    .update(productData)
    .eq("id", id);

  if (error) {
    console.error("Product update:", error);
    return NextResponse.json({ error: "Failed to create product." }, { status: 500 });
  }

  // Replace variants: delete existing, re-insert
  if (variants) {
    await supabaseAdmin.from("product_variants").delete().eq("product_id", id);
    const variantRows = variants.map((v) => ({ ...v, product_id: id }));
    const { error: varErr } = await supabaseAdmin.from("product_variants").insert(variantRows);
    if (varErr) {
      console.error("Variant upsert:", varErr);
      return NextResponse.json({ error: "Failed to create variants." }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request, { params }) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const { id } = await params;

  // Cascade deletes variants (FK constraint)
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
  if (error) {
    console.error("Product delete:", error);
    return NextResponse.json({ error: "Failed to delete product." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
