import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import Link from "next/link";
import CategoryActions from "@/components/admin/CategoryActions";

export const metadata = { title: "Categories | Admin" };

export default async function AdminCategoriesPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, description, product_count:products(count)")
    .order("name");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-foreground">Categories</h1>
          <p className="font-body text-sm text-muted mt-0.5">{categories?.length ?? 0} categories</p>
        </div>
      </div>

      <CategoryActions />

      {categories?.length ? (
        <div className="border border-border overflow-x-auto">
          <table className="w-full font-body text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-raised">
                {["Name", "Slug", "Products", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs tracking-wide text-muted uppercase font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-surface-raised transition-colors">
                  <td className="px-4 py-3 text-foreground font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-muted font-mono text-xs">{cat.slug}</td>
                  <td className="px-4 py-3 text-muted">
                    {cat.product_count?.[0]?.count ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/shop/${cat.slug}`}
                        target="_blank"
                        className="text-xs text-muted hover:text-foreground transition-colors"
                      >
                        View ↗
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border border-border p-12 text-center">
          <p className="font-body text-sm text-muted">No categories found.</p>
        </div>
      )}
    </div>
  );
}
