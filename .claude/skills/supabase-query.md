# Skill: Supabase Query

Read before writing any Supabase database interaction.

## Client Selection

```js
// In Server Components, Route Handlers, middleware:
import { createServerClient } from "@/lib/supabase/server";
const supabase = createServerClient();

// In Client Components (rare — only for real-time or auth state):
import { createBrowserClient } from "@/lib/supabase/client";
const supabase = createBrowserClient();
```

Never import `createServerClient` in a Client Component.
Never use service role key outside API routes / server-only files.

## Query Conventions

### Always select specific columns — never `select('*')`

```js
// ❌
const { data } = await supabase.from("products").select("*");

// ✅
const { data } = await supabase
  .from("products")
  .select(
    "id, slug, title, base_price, category_id, product_images(url, is_primary)",
  );
```

### Always handle errors explicitly

```js
const { data, error } = await supabase.from("products").select("id, title");

if (error) {
  console.error("[products]", error.message);
  throw new Error("Failed to fetch products"); // let error boundary catch it
}
```

### Pagination — always paginate lists

```js
const PAGE_SIZE = 24;

const { data, count } = await supabase
  .from("products")
  .select("id, slug, title, base_price", { count: "exact" })
  .eq("is_active", true)
  .order("created_at", { ascending: false })
  .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
```

### Joins — use Supabase PostgREST syntax

```js
// Products with their primary image and category name
const { data } = await supabase
  .from("products")
  .select(
    `
    id, slug, title, base_price, compare_price,
    categories(name, slug),
    product_images(url, alt_text, is_primary)
  `,
  )
  .eq("is_active", true)
  .eq("product_images.is_primary", true);
```

## RLS Policy Patterns

### Public read (products, categories)

```sql
CREATE POLICY "Public can read active products"
ON products FOR SELECT
USING (is_active = true);
```

### User owns row (addresses, wishlists, orders)

```sql
CREATE POLICY "Users can manage own addresses"
ON addresses FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

### Admin bypass (service role handles this automatically — but for custom admin roles)

```sql
CREATE POLICY "Admin full access"
ON products FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### Guest order read (by guest_email match)

```sql
CREATE POLICY "Guests can read own orders"
ON orders FOR SELECT
USING (
  auth.uid() = user_id
  OR (user_id IS NULL AND guest_email = current_setting('app.guest_email', true))
);
```

## Real-time Subscriptions (use sparingly)

```js
// Only in Client Components, only where live updates matter (stock count, order status)
useEffect(() => {
  const channel = supabase
    .channel("product-stock")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "product_variants",
        filter: `product_id=eq.${productId}`,
      },
      (payload) => {
        queryClient.invalidateQueries({ queryKey: ["product", slug] });
      },
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}, [productId]);
```

## Storage (product images)

```js
// Upload
const { data, error } = await supabase.storage
  .from("product-images")
  .upload(`products/${productId}/${filename}`, file, {
    cacheControl: "3600",
    upsert: false,
  });

// Get public URL
const {
  data: { publicUrl },
} = supabase.storage
  .from("product-images")
  .getPublicUrl(`products/${productId}/${filename}`);
```

## Price Handling

- All prices stored as integers (pence for GBP, kobo for NGN)
- Never store floats — `base_price: 4999` = £49.99
- Format for display in utils.js:

```js
export function formatPrice(pence, currency = "GBP") {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(pence / 100);
}
```

## Common Patterns

### Fetch product by slug (PDP)

```js
export async function getProductBySlug(slug) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id, slug, title, description, materials, care_instructions,
      base_price, compare_price,
      categories(id, name, slug),
      product_variants(id, size, colour, sku, stock_count, additional_price),
      product_images(id, url, alt_text, display_order, is_primary)
    `,
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) throw new Error(`Product not found: ${slug}`);
  return data;
}
```

### Fetch category products (SSR with filters)

```js
export async function getCategoryProducts({ categorySlug, filters, page = 0 }) {
  const supabase = createServerClient();
  let query = supabase
    .from("products")
    .select(
      `
      id, slug, title, base_price, compare_price,
      product_images(url, alt_text, is_primary)
    `,
      { count: "exact" },
    )
    .eq("categories.slug", categorySlug)
    .eq("is_active", true);

  if (filters.minPrice) query = query.gte("base_price", filters.minPrice * 100);
  if (filters.maxPrice) query = query.lte("base_price", filters.maxPrice * 100);
  if (filters.sort === "price_asc")
    query = query.order("base_price", { ascending: true });
  if (filters.sort === "price_desc")
    query = query.order("base_price", { ascending: false });
  if (!filters.sort) query = query.order("created_at", { ascending: false });

  query = query.range(page * 24, (page + 1) * 24 - 1);

  const { data, error, count } = await query;
  if (error) throw error;
  return { products: data, total: count };
}
```
