import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

const QUERY_KEY = ["wishlist"];

// Single module-level client — avoids creating a new instance per click
let _supabase;
function getSupabase() {
  if (!_supabase) _supabase = createClient();
  return _supabase;
}

/**
 * Returns the current user's wishlist product IDs.
 */
export function useWishlist() {
  return useQuery({
    queryKey: QUERY_KEY,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    queryFn: async () => {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("wishlist")
        .select("product_id")
        .eq("user_id", user.id);

      if (error) throw error;
      return data?.map((w) => w.product_id) ?? [];
    },
  });
}

/**
 * Returns true if a given product ID is in the wishlist.
 * @param {string} productId
 */
export function useIsWishlisted(productId) {
  const { data = [] } = useWishlist();
  return data.includes(productId);
}

/**
 * Toggle (add/remove) a product in the wishlist.
 */
export function useToggleWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    // Variables: { productId, remove } — caller decides the action so mutationFn
    // doesn't read from a cache that onMutate has already optimistically updated.
    mutationFn: async ({ productId, remove }) => {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sign in to save items to your wishlist.");

      if (remove) {
        const { error } = await supabase
          .from("wishlist")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("wishlist")
          .insert({ user_id: user.id, product_id: productId });
        if (error) throw error;
      }
    },
    // Optimistic update
    onMutate: async ({ productId, remove }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      const previous = queryClient.getQueryData(QUERY_KEY) ?? [];
      queryClient.setQueryData(
        QUERY_KEY,
        remove ? previous.filter((id) => id !== productId) : [...previous, productId]
      );
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      queryClient.setQueryData(QUERY_KEY, ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
