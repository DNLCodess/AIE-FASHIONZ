import { create } from "zustand";
import { persist } from "zustand/middleware";

let _toastId = 0;

const useUiStore = create(
  persist(
    (set) => ({
      cartOpen: false,
      mobileNavOpen: false,
      searchOpen: false,
      currency: "USD",
      toasts: [],

      openCart: () => set({ cartOpen: true }),
      closeCart: () => set({ cartOpen: false }),
      toggleCart: () => set((state) => ({ cartOpen: !state.cartOpen })),

      openMobileNav: () => set({ mobileNavOpen: true }),
      closeMobileNav: () => set({ mobileNavOpen: false }),
      toggleMobileNav: () =>
        set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),

      openSearch: () => set({ searchOpen: true }),
      closeSearch: () => set({ searchOpen: false }),

      setCurrency: (currency) => set({ currency }),

      /** @param {{ message: string, type?: "cart"|"wishlist"|"error" }} opts */
      addToast: (opts) => {
        const id = ++_toastId;
        set((state) => ({ toasts: [...state.toasts, { id, ...opts }] }));
        setTimeout(() => {
          set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
        }, 3200);
      },
      removeToast: (id) =>
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: "aie-ui",
      // Only persist the currency preference — UI open/close states reset on load
      partialize: (state) => ({ currency: state.currency }),
    }
  )
);

export default useUiStore;
