import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

const QUERY_KEY = ["wishlist"];

async function getUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Returns the current user's wishlist product slugs.
 */
export function useWishlist() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const user = await getUser();
      if (!user) return [];

      const supabase = createClient();
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
    mutationFn: async (productId) => {
      const user = await getUser();
      if (!user) throw new Error("Sign in to save items to your wishlist.");

      const supabase = createClient();
      const current = queryClient.getQueryData(QUERY_KEY) ?? [];
      const isWishlisted = current.includes(productId);

      if (isWishlisted) {
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
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      const previous = queryClient.getQueryData(QUERY_KEY) ?? [];
      const isIn = previous.includes(productId);
      queryClient.setQueryData(
        QUERY_KEY,
        isIn ? previous.filter((id) => id !== productId) : [...previous, productId]
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
