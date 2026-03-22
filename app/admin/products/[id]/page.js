import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import ProductForm from "@/components/admin/ProductForm";

export const metadata = { title: "Edit Product | Admin" };

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );

  const { data: product } = await supabase
    .from("products")
    .select("*, variants:product_variants(*)")
    .eq("id", id)
    .single();

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">Edit Product</h1>
        <p className="font-body text-sm text-muted mt-0.5">{product.title}</p>
      </div>
      <ProductForm product={product} apiPath={`/api/admin/products/${id}`} method="PATCH" />
    </div>
  );
}
