import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

/**
 * Fetch the current user's order list.
 */
export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("orders")
        .select("id, reference, status, total, currency, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
}

/**
 * Fetch a single order by ID.
 * @param {string} orderId
 */
export function useOrder(orderId) {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", orderId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!orderId,
  });
}
