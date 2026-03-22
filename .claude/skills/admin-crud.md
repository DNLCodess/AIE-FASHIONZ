# Skill: Admin CRUD

Read before building any admin dashboard feature.

## Auth Guard

Every admin page and API route must verify the user has `role: 'admin'` in the profiles table.

### Middleware (already in place)

```js
// middleware.js — /admin/* routes are intercepted
// Checks Supabase session + profile.role
```

### In API Routes (belt-and-suspenders)

```js
export async function POST(request) {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorised" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // proceed with admin operation using service role client
}
```

Always use service role client for admin mutations — bypasses RLS safely, server-side only.

## Product CRUD

### Create product

```js
async function createProduct(formData) {
  const supabase = createServiceRoleClient(); // server only

  // 1. Generate slug from title
  const slug = formData.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // 2. Check slug uniqueness
  const { count } = await supabase
    .from("products")
    .select("id", { count: "exact" })
    .eq("slug", slug);

  const finalSlug = count > 0 ? `${slug}-${Date.now()}` : slug;

  // 3. Insert product
  const { data: product, error } = await supabase
    .from("products")
    .insert({
      slug: finalSlug,
      title: formData.title,
      description: formData.description,
      materials: formData.materials,
      care_instructions: formData.careInstructions,
      base_price: Math.round(formData.price * 100), // convert to pence
      compare_price: formData.comparePrice
        ? Math.round(formData.comparePrice * 100)
        : null,
      category_id: formData.categoryId,
      is_active: formData.isActive ?? false,
      is_featured: formData.isFeatured ?? false,
    })
    .select()
    .single();

  if (error) throw error;
  return product;
}
```

### Image upload flow

```js
async function uploadProductImage(productId, file, displayOrder, isPrimary) {
  const supabase = createServiceRoleClient();
  const ext = file.name.split(".").pop();
  const filename = `${productId}/${displayOrder}-${Date.now()}.${ext}`;

  // 1. Upload to storage
  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filename, file, { cacheControl: "31536000", upsert: false });

  if (uploadError) throw uploadError;

  // 2. Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(filename);

  // 3. Insert image record
  await supabase.from("product_images").insert({
    product_id: productId,
    url: publicUrl,
    alt_text: `Product image ${displayOrder}`,
    display_order: displayOrder,
    is_primary: isPrimary,
  });

  return publicUrl;
}
```

### Update product (trigger ISR revalidation)

```js
async function updateProduct(productId, updates) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("products")
    .update({
      ...updates,
      base_price: updates.price ? Math.round(updates.price * 100) : undefined,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId)
    .select("slug")
    .single();

  if (error) throw error;

  // Trigger ISR revalidation for this product's page
  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/products/revalidate`, {
    method: "POST",
    headers: { "x-revalidate-token": process.env.REVALIDATE_TOKEN },
    body: JSON.stringify({ slug: data.slug }),
  });

  return data;
}
```

## Order Management

### Update order status

```js
async function updateOrderStatus(orderId, status, trackingNumber) {
  const supabase = createServiceRoleClient();

  const updates = { status, updated_at: new Date().toISOString() };
  if (trackingNumber) updates.tracking_number = trackingNumber;

  const { error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", orderId);

  if (error) throw error;

  // If shipping, send shipping notification email
  if (status === "shipped") {
    const order = await getOrderById(orderId);
    await sendShippingNotificationEmail(order);
  }
}
```

## Admin Table Component Pattern

```jsx
"use client";

import { useQuery } from "@tanstack/react-query";

export default function OrdersTable({ initialData }) {
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "orders", { page, status }],
    queryFn: () => fetchAdminOrders({ page, status }),
    initialData: page === 0 && status === "all" ? initialData : undefined,
    staleTime: 30 * 1000, // 30s — admin wants fresh data
  });

  // render table...
}
```

Pass `initialData` from Server Component via prefetch — avoid loading state on first render.

## Promo Code Validation (reusable — also used at checkout)

```js
export async function validatePromoCode(code, subtotal) {
  const supabase = createServerClient();
  const { data: promo, error } = await supabase
    .from("promo_codes")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .single();

  if (error || !promo) return { valid: false, error: "Invalid code" };
  if (promo.expires_at && new Date(promo.expires_at) < new Date())
    return { valid: false, error: "Code expired" };
  if (promo.usage_limit && promo.used_count >= promo.usage_limit)
    return { valid: false, error: "Code limit reached" };
  if (promo.min_order_value && subtotal < promo.min_order_value) {
    return {
      valid: false,
      error: `Minimum order £${promo.min_order_value / 100} required`,
    };
  }

  const discount =
    promo.discount_type === "percentage"
      ? Math.round(subtotal * (promo.discount_value / 100))
      : promo.discount_value;

  return { valid: true, discount, promoId: promo.id };
}
```

## Do Not

- Never delete products — set `is_active: false`
- Never hard-delete orders — they are financial records
- Never expose service role key to client
- Never skip the admin role check in API routes
- Never accept price data from the client — always calculate server-side
