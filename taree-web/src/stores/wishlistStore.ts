import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Product } from "../types";

interface WishlistItem {
  id: string;
  product: Product;
}

async function fetchWishlist(): Promise<WishlistItem[]> {
  const { data } = await api.get("/wishlist");
  return data.map((item: any) => ({
    id: item.id,
    product: {
      id: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
      description: "",
      price: item.product.price,
      sku: "",
      images: item.product.images.map((img: any) => ({
        id: img.url,
        url: img.url,
        alt: img.alt,
        sortOrder: 0,
        isPrimary: true,
      })),
      category: item.product.category,
      isNewArrival: false,
      isFeatured: false,
      isActive: true,
      stockQuantity: item.product.stockQuantity,
    },
  }));
}

export function useWishlist() {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlist,
  });

  const addMutation = useMutation({
    mutationFn: async (productId: string) => {
      await api.post("/wishlist", { product_id: productId });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      await api.delete(`/wishlist/${productId}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  const isInWishlist = (productId: string) => items.some((item) => item.product.id === productId);

  return {
    items,
    isLoading,
    isInWishlist,
    addToWishlist: addMutation.mutate,
    removeFromWishlist: removeMutation.mutate,
  };
}
