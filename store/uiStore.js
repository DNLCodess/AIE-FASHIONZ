import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUiStore = create(
  persist(
    (set) => ({
      cartOpen: false,
      mobileNavOpen: false,
      currency: "GBP",

      openCart: () => set({ cartOpen: true }),
      closeCart: () => set({ cartOpen: false }),
      toggleCart: () => set((state) => ({ cartOpen: !state.cartOpen })),

      openMobileNav: () => set({ mobileNavOpen: true }),
      closeMobileNav: () => set({ mobileNavOpen: false }),
      toggleMobileNav: () =>
        set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),

      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: "aie-ui",
      // Only persist the currency preference — UI open/close states reset on load
      partialize: (state) => ({ currency: state.currency }),
    }
  )
);

export default useUiStore;
