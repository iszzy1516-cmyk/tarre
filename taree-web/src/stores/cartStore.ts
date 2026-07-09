import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product, ProductVariant } from "../types";
import { useToastStore } from "./toastStore";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product, variant?: ProductVariant, qty?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

function calculateTotals(items: CartItem[]) {
  return {
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      totalItems: 0,
      totalPrice: 0,

      addItem: (product, variant, qty = 1) => {
        const { items } = get();
        const existingItem = items.find(
          (item) =>
            item.product.id === product.id &&
            item.variant?.id === variant?.id
        );

        let newItems: CartItem[];
        if (existingItem) {
          newItems = items.map((item) =>
            item.id === existingItem.id
              ? { ...item, quantity: item.quantity + qty }
              : item
          );
        } else {
          newItems = [
            ...items,
            {
              id: `${product.id}-${variant?.id ?? "default"}`,
              product,
              variant,
              quantity: qty,
            },
          ];
        }

        set({ items: newItems, ...calculateTotals(newItems), isOpen: true });
        useToastStore.getState().addToast(`${product.name} added to bag`, "success");
      },

      removeItem: (itemId) => {
        const { items } = get();
        const newItems = items.filter((item) => item.id !== itemId);
        set({ items: newItems, ...calculateTotals(newItems) });
      },

      updateQuantity: (itemId, quantity) => {
        const { items } = get();
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        const newItems = items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        );
        set({ items: newItems, ...calculateTotals(newItems) });
      },

      clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),

      toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),
    }),
    {
      name: "taree-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
