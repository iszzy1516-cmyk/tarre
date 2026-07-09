import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useCartStore } from "@/stores/cartStore";

export function useCart() {
  const queryClient = useQueryClient();
  const { items: localItems, addItem, removeItem, updateQuantity, clearCart } = useCartStore();

  const { data: serverCart } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get("/cart");
      return data.items;
    },
    enabled: false, // Only fetch when explicitly needed; local cart is primary
  });

  const addItemMutation = useMutation({
    mutationFn: async (payload: { product_id: string; variant_id?: string; quantity: number }) => {
      await api.post("/cart/items", payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const mergeCartMutation = useMutation({
    mutationFn: async () => {
      await api.post("/cart/merge");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  return {
    items: localItems,
    serverItems: serverCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    addItemToServer: addItemMutation.mutateAsync,
    mergeCart: mergeCartMutation.mutateAsync,
  };
}
