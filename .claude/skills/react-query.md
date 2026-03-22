# Skill: React Query Hook

Read before creating any `useX` data-fetching hook.

## Setup (already in place — reference only)

```js
// app/layout.js — QueryClientProvider wraps the app
// lib/queryClient.js — shared QueryClient config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes default
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

## Query Key Conventions

Always use arrays. Structure: `[entity, identifier?, filters?]`

```js
["products"][("products", { category: "jewellery", page: 0 })][ // all products
  ("product", slug)
][("orders", userId)][("order", orderId)][("wishlist", userId)][ // single product
  ("reviews", productId)
][("search", query)];
```

Consistent keys = correct cache invalidation. Never use strings alone.

## Hook Template

```js
// hooks/useProducts.js
import { useQuery } from "@tanstack/react-query";
import { createBrowserClient } from "@/lib/supabase/client";

/**
 * @param {{ category?: string, page?: number, sort?: string }} options
 */
export function useProducts({ category, page = 0, sort } = {}) {
  return useQuery({
    queryKey: ["products", { category, page, sort }],
    queryFn: async () => {
      const supabase = createBrowserClient();
      let query = supabase
        .from("products")
        .select("id, slug, title, base_price, product_images(url, is_primary)")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .range(page * 24, (page + 1) * 24 - 1);

      if (category) query = query.eq("categories.slug", category);

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
```

## Stale Time Guidelines

| Data type               | staleTime | Reason                                     |
| ----------------------- | --------- | ------------------------------------------ |
| Products list           | 5 min     | Changes infrequently                       |
| Single product          | 5 min     | Stock could change — ISR handles SEO layer |
| Categories              | 30 min    | Very rarely changes                        |
| Orders                  | 30 sec    | Customer expects near-real-time status     |
| Cart (if server-synced) | 0         | Always fresh                               |
| Search results          | 2 min     | Reasonable cache for same query            |
| Reviews                 | 10 min    | Low update frequency                       |

## Mutation Pattern (create/update/delete)

```js
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, productId }) => {
      const supabase = createBrowserClient();
      const { error } = await supabase
        .from("wishlists")
        .insert({ user_id: userId, product_id: productId });
      if (error) throw error;
    },
    onSuccess: (_, { userId }) => {
      // Invalidate wishlist cache for this user
      queryClient.invalidateQueries({ queryKey: ["wishlist", userId] });
    },
    onError: (error) => {
      console.error("[wishlist:add]", error.message);
    },
  });
}
```

## Optimistic Updates (for cart and wishlist UX)

```js
useMutation({
  mutationFn: updateCartItem,
  onMutate: async ({ itemId, quantity }) => {
    await queryClient.cancelQueries({ queryKey: ["cart"] });
    const previous = queryClient.getQueryData(["cart"]);

    // Optimistically update
    queryClient.setQueryData(["cart"], (old) => ({
      ...old,
      items: old.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item,
      ),
    }));

    return { previous }; // context for rollback
  },
  onError: (err, _, context) => {
    queryClient.setQueryData(["cart"], context.previous); // rollback
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  },
});
```

## Prefetching (for navigation UX)

```js
// In Server Components — prefetch before the page renders
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function CategoryPage({ params }) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["products", { category: params.category }],
    queryFn: () => getCategoryProducts(params.category),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoryProductGrid category={params.category} />
    </HydrationBoundary>
  );
}
```

## Pagination Pattern

```js
export function useProductsPaginated({ category, sort }) {
  const [page, setPage] = useState(0);

  const query = useQuery({
    queryKey: ["products", { category, page, sort }],
    queryFn: () => fetchProducts({ category, page, sort }),
    placeholderData: keepPreviousData, // keeps old data visible while fetching next page
  });

  return { ...query, page, setPage };
}
```

## Error Handling in Components

```jsx
const { data, isLoading, isError, error } = useProducts();

if (isLoading) return <ProductGridSkeleton />;
if (isError)
  return <ErrorState message="Couldn't load products. Please refresh." />;
```

Never render `null` silently on error — always show an on-brand error state.
