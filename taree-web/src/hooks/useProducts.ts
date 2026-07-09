import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Product } from "@/types";

interface ProductsFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  featured?: boolean;
  newArrivals?: boolean;
}

export function useProducts(filters?: ProductsFilters) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.category) params.append("category", filters.category);
      if (filters?.minPrice) params.append("min_price", String(filters.minPrice));
      if (filters?.maxPrice) params.append("max_price", String(filters.maxPrice));
      if (filters?.search) params.append("search", filters.search);
      if (filters?.featured) params.append("featured", "true");
      if (filters?.newArrivals) params.append("new_arrivals", "true");

      const { data } = await api.get(`/products?${params.toString()}`);
      return data as Product[];
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data } = await api.get(`/products/${slug}`);
      return data as Product;
    },
    enabled: !!slug,
  });
}
