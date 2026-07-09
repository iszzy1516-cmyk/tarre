import { useState } from "react";
import { useSEO } from "../hooks/useSEO";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { formatNaira } from "../lib/utils";
import { useCartStore } from "../stores/cartStore";
import { useWishlist } from "../stores/wishlistStore";
import { useAuthStore } from "../stores/authStore";
import { useToastStore } from "../stores/toastStore";
import { api } from "../lib/api";
import type { Product } from "../types";
import { Loader2, Heart } from "lucide-react";

async function fetchProducts(): Promise<Product[]> {
  const { data } = await api.get("/products");
  return data.map((p: any) => ({
    ...p,
    images: p.images.map((img: any) => ({
      id: img.id,
      url: img.url,
      alt: img.alt_text,
      sortOrder: img.sort_order,
      isPrimary: img.is_primary,
    })),
    category: p.category,
    isNewArrival: p.is_new_arrival,
    isFeatured: p.is_featured,
    isActive: p.is_active,
    stockQuantity: p.stock_quantity,
    compareAtPrice: p.compare_at_price,
    shortDescription: p.short_description,
  }));
}

export default function ProductsPage() {
  useSEO("Shop All Products | TAREÉ Jewelry", "Explore our collection of handcrafted luxury African jewelry.");
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const addToast = useToastStore((s) => s.addToast);
  const [filter, setFilter] = useState<"all" | "new" | "featured">("all");

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const filtered = products?.filter((p) => {
    if (filter === "new") return p.isNewArrival;
    if (filter === "featured") return p.isFeatured;
    return true;
  });

  return (
    <div className="pt-[160px] pb-section">
      <div className="max-w-container mx-auto px-margin">
        <h1 className="font-display text-headline-lg text-primary mb-4">All Jewelry</h1>
        <p className="text-on-surface-variant font-body mb-12 max-w-2xl">
          Discover our curated collection of handcrafted Nigerian jewelry, designed for the modern queen.
        </p>

        <div className="flex gap-4 mb-12">
          {(["all", "new", "featured"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 text-label-caps uppercase tracking-widest transition-colors ${
                filter === f
                  ? "bg-secondary text-on-secondary"
                  : "border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
              }`}
            >
              {f === "all" ? "All" : f === "new" ? "New Arrivals" : "Featured"}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-secondary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filtered?.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group"
              >
                <Link to={`/products/${product.slug}`} className="block relative overflow-hidden bg-surface-container-low aspect-[3/4] mb-4">
                  <img
                    src={product.images[0]?.url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {product.isNewArrival && (
                    <span className="absolute top-3 left-3 bg-secondary text-on-secondary text-[10px] uppercase tracking-widest px-3 py-1">
                      New
                    </span>
                  )}
                  {product.compareAtPrice && (
                    <span className="absolute top-3 right-3 bg-error text-white text-[10px] uppercase tracking-widest px-3 py-1">
                      Sale
                    </span>
                  )}
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (!isAuthenticated) {
                          addToast("Please sign in to add to wishlist", "info");
                          return;
                        }
                        if (isInWishlist(product.id)) {
                          removeFromWishlist(product.id);
                          addToast("Removed from wishlist", "info");
                        } else {
                          addToWishlist(product.id);
                          addToast("Added to wishlist", "success");
                        }
                      }}
                      className={`w-10 h-10 flex items-center justify-center shadow-lg ${
                        isInWishlist(product.id) ? "bg-error text-white" : "bg-white text-primary"
                      }`}
                      aria-label="Add to wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addItem(product);
                      }}
                      className="w-10 h-10 bg-white text-primary flex items-center justify-center shadow-lg"
                      aria-label="Add to cart"
                    >
                      +
                    </button>
                  </div>
                </Link>
                <h3 className="font-display text-body text-primary group-hover:text-secondary transition-colors">
                  <Link to={`/products/${product.slug}`}>{product.name}</Link>
                </h3>
                <p className="text-sm text-on-surface-variant font-body">{product.material}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-display text-body text-primary">{formatNaira(product.price)}</span>
                  {product.compareAtPrice && (
                    <span className="text-sm text-on-surface-variant line-through">
                      {formatNaira(product.compareAtPrice)}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
