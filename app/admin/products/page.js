import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export const metadata = { title: "Products | Admin" };

export default async function AdminProductsPage({ searchParams }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );

  const params = await searchParams;
  const search = params?.q ?? "";
  const page = parseInt(params?.page ?? "1", 10);
  const pageSize = 20;
  const from = (page - 1) * pageSize;

  let query = supabase
    .from("products")
    .select("id, title, slug, base_price, category_slug, is_active, is_featured", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);

  if (search) query = query.ilike("title", `%${search}%`);

  const { data: products, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-foreground">Products</h1>
          <p className="font-body text-sm text-muted mt-0.5">{count ?? 0} total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-5 py-2.5 font-body text-sm tracking-widest uppercase bg-gold text-foreground hover:bg-gold-dark transition-colors"
        >
          + New Product
        </Link>
      </div>

      {/* Search */}
      <form method="GET" className="flex gap-2">
        <input
          name="q"
          defaultValue={search}
          placeholder="Search products…"
          className="flex-1 h-10 px-3 font-body text-sm border border-border bg-surface focus:outline-none focus:border-foreground"
        />
        <button type="submit" className="px-4 h-10 font-body text-sm border border-border text-muted hover:text-foreground transition-colors">
          Search
        </button>
        {search && (
          <Link href="/admin/products" className="px-4 h-10 flex items-center font-body text-sm text-muted hover:text-foreground transition-colors">
            Clear
          </Link>
        )}
      </form>

      {/* Table */}
      {products?.length ? (
        <>
          <div className="border border-border overflow-x-auto">
            <table className="w-full font-body text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-raised">
                  {["Title", "Category", "Price", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs tracking-wide text-muted uppercase font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-raised transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/products/${p.id}`} className="text-foreground hover:text-gold transition-colors font-medium">
                        {p.title}
                      </Link>
                      {p.is_featured && (
                        <span className="ml-2 text-[10px] uppercase tracking-wide text-gold">Featured</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted capitalize">{p.category_slug?.replace(/-/g, " ")}</td>
                    <td className="px-4 py-3 font-heading text-foreground">{formatCurrency(p.base_price)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] uppercase tracking-wide ${p.is_active ? "text-success" : "text-muted"}`}>
                        {p.is_active ? "Active" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-4">
                        <Link href={`/admin/products/${p.id}`} className="text-xs text-muted hover:text-foreground transition-colors">
                          Edit
                        </Link>
                        <Link href={`/product/${p.slug}`} target="_blank" className="text-xs text-muted hover:text-foreground transition-colors">
                          View ↗
                        </Link>
                        <DeleteProductButton id={p.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2 font-body text-sm">
              {page > 1 && (
                <Link href={`/admin/products?page=${page - 1}${search ? `&q=${search}` : ""}`}
                  className="px-3 py-1.5 border border-border text-muted hover:text-foreground transition-colors">
                  ← Prev
                </Link>
              )}
              <span className="text-muted">Page {page} of {totalPages}</span>
              {page < totalPages && (
                <Link href={`/admin/products?page=${page + 1}${search ? `&q=${search}` : ""}`}
                  className="px-3 py-1.5 border border-border text-muted hover:text-foreground transition-colors">
                  Next →
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="border border-border p-12 text-center">
          <p className="font-body text-sm text-muted mb-4">
            {search ? `No products matching "${search}".` : "No products yet."}
          </p>
          {!search && (
            <Link href="/admin/products/new" className="font-body text-sm text-gold hover:text-foreground transition-colors">
              Create your first product →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
