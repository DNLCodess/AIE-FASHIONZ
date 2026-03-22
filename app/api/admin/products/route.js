import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import supabaseAdmin from "@/lib/supabase/admin";
import { generateSlug } from "@/lib/utils";
import { z } from "zod";

const variantSchema = z.object({
  size: z.string().optional(),
  colour: z.string().optional(),
  stock: z.number().int().min(0),
  additional_price: z.number().int().min(0).default(0),
});

const productSchema = z.object({
  title: z.string().min(1).max(300),
  description: z.string().optional(),
  category_id: z.string().uuid(),
  base_price: z.number().int().positive(),
  compare_price: z.number().int().positive().optional(),
  images: z.array(z.string().url()).optional(),
  materials: z.string().optional(),
  is_published: z.boolean().optional(),
  slug: z.string().optional(),
  variants: z.array(variantSchema).optional(),
});

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

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid product data." }, { status: 400 });
  }

  const { variants, ...productData } = parsed.data;

  const slug = productData.slug || generateSlug(productData.title);

  const { data: product, error } = await supabaseAdmin
    .from("products")
    .insert({ ...productData, slug })
    .select("id")
    .single();

  if (error) {
    console.error("Product insert:", error);
    return NextResponse.json({ error: "Failed to create product." }, { status: 500 });
  }

  if (variants?.length) {
    const variantRows = variants.map((v) => ({ ...v, product_id: product.id }));
    const { error: varErr } = await supabaseAdmin.from("product_variants").insert(variantRows);
    if (varErr) {
      console.error("Variant insert:", varErr);
      return NextResponse.json({ error: "Failed to create variants." }, { status: 500 });
    }
  }

  return NextResponse.json({ id: product.id }, { status: 201 });
}
