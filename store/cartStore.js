import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, variant, quantity = 1) => {
        const { items } = get();
        const existingIndex = items.findIndex(
          (item) => item.variantId === variant.id
        );

        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          set({ items: updated });
        } else {
          set({
            items: [
              ...items,
              {
                id: `${product.id}-${variant.id}`,
                productId: product.id,
                variantId: variant.id,
                title: product.title,
                slug: product.slug,
                image:
                  product.images?.find((img) => img.is_primary)?.url ??
                  product.images?.[0]?.url ??
                  null,
                size: variant.size,
                colour: variant.colour,
                price: product.base_price + (variant.additional_price || 0),
                quantity,
              },
            ],
          });
        }
      },

      removeItem: (variantId) => {
        set({
          items: get().items.filter((item) => item.variantId !== variantId),
        });
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity < 1) {
          get().removeItem(variantId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.variantId === variantId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),
    }),
    { name: "aie-cart" }
  )
);

export const selectTotalItems = (state) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectSubtotal = (state) =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export default useCartStore;
