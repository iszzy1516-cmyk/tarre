import { useState } from "react";
import { useSEO } from "../hooks/useSEO";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Heart, ChevronDown, Truck, ShieldCheck, Loader2 } from "lucide-react";
import { formatNaira } from "../lib/utils";
import { useCartStore } from "../stores/cartStore";
import { useWishlist } from "../stores/wishlistStore";
import { useAuthStore } from "../stores/authStore";
import { useToastStore } from "../stores/toastStore";
import { api } from "../lib/api";
import type { Product } from "../types";
import { ProductReviews } from "../components/product/ProductReviews";

async function fetchProduct(slug: string): Promise<Product> {
  const { data } = await api.get(`/products/${slug}`);
  return {
    ...data,
    images: data.images.map((img: any) => ({
      id: img.id,
      url: img.url,
      alt: img.alt_text,
      sortOrder: img.sort_order,
      isPrimary: img.is_primary,
    })),
    category: data.category,
    isNewArrival: data.is_new_arrival,
    isFeatured: data.is_featured,
    isActive: data.is_active,
    stockQuantity: data.stock_quantity,
    compareAtPrice: data.compare_at_price,
    shortDescription: data.short_description,
    variants: data.variants?.map((v: any) => ({
      id: v.id,
      name: v.name,
      priceAdjustment: v.price_adjustment,
      stockQuantity: v.stock_quantity,
      sku: v.sku,
    })),
  };
}

async function fetchRelated(categorySlug: string, excludeSlug: string): Promise<Product[]> {
  const { data } = await api.get(`/products?category=${categorySlug}&limit=4`);
  return data
    .filter((p: any) => p.slug !== excludeSlug)
    .slice(0, 4)
    .map((p: any) => ({
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

export default function ProductDetailPage() {
  useSEO("Product | TAREÉ Jewelry", "Discover the details of this exquisite handcrafted jewelry piece.");
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const addToast = useToastStore((s) => s.addToast);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [showDetails, setShowDetails] = useState(false);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProduct(slug!),
    enabled: !!slug,
  });

  const { data: related } = useQuery({
    queryKey: ["related", product?.category.slug, slug],
    queryFn: () => fetchRelated(product!.category.slug, slug!),
    enabled: !!product,
  });

  if (isLoading) {
    return (
      <div className="pt-[160px] pb-section flex justify-center">
        <Loader2 className="w-8 h-8 text-secondary animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-[160px] pb-section max-w-container mx-auto px-margin text-center">
        <h1 className="font-display text-headline-lg text-primary mb-4">Product Not Found</h1>
        <p className="text-on-surface-variant font-body mb-8">
          We couldn&apos;t find the product you&apos;re looking for.
        </p>
        <Link to="/products" className="bg-secondary text-on-secondary px-8 py-3 text-label-caps uppercase tracking-widest">
          Back to Shop
        </Link>
      </div>
    );
  }

  const currentVariant = product.variants?.find((v) => v.id === selectedVariant);
  const displayPrice = currentVariant?.priceAdjustment
    ? product.price + currentVariant.priceAdjustment
    : product.price;

  const handleAddToCart = () => {
    addItem(product, currentVariant, quantity);
  };

  return (
    <div className="pt-[140px] pb-section">
      <div className="max-w-container mx-auto px-margin">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-on-surface-variant font-body mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/categories/${product.category.slug}`} className="hover:text-primary transition-colors">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-primary">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Images */}
          <div>
            <div className="aspect-square bg-surface-container-low mb-4 overflow-hidden">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.images[selectedImage]?.url}
                alt={product.images[selectedImage]?.alt || product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 overflow-hidden border-2 transition-colors ${
                      idx === selectedImage ? "border-secondary" : "border-transparent"
                    }`}
                  >
                    <img src={img.url} alt={img.alt || ""} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="mb-2">
              {product.isNewArrival && (
                <span className="text-[10px] uppercase tracking-widest text-secondary font-body">New Arrival</span>
              )}
            </div>
            <h1 className="font-display text-headline-lg text-primary mb-4">{product.name}</h1>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-display text-headline-md text-primary">{formatNaira(displayPrice)}</span>
              {product.compareAtPrice && (
                <span className="text-lg text-on-surface-variant line-through">
                  {formatNaira(product.compareAtPrice)}
                </span>
              )}
            </div>
            <p className="text-on-surface-variant font-body leading-relaxed mb-8">{product.description}</p>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <label className="block text-[11px] uppercase tracking-widest text-on-surface-variant mb-3 font-body">
                  Size
                </label>
                <div className="flex gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={`px-4 py-2 border text-sm font-body transition-colors ${
                        selectedVariant === variant.id
                          ? "border-secondary bg-secondary/5 text-secondary"
                          : "border-outline-variant hover:border-primary"
                      }`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-[11px] uppercase tracking-widest text-on-surface-variant mb-3 font-body">
                Quantity
              </label>
              <div className="flex items-center border border-outline-variant w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-surface-container transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-2 text-sm font-body min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-surface-container transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-10">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-luxury-navy text-champagne-gold py-4 text-label-caps uppercase tracking-widest hover:bg-champagne-gold hover:text-luxury-navy transition-all duration-300"
              >
                Add to Bag
              </button>
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    addToast("Please sign in to add to wishlist", "info");
                    return;
                  }
                  if (product && isInWishlist(product.id)) {
                    removeFromWishlist(product.id);
                    addToast("Removed from wishlist", "info");
                  } else if (product) {
                    addToWishlist(product.id);
                    addToast("Added to wishlist", "success");
                  }
                }}
                className={`w-14 h-14 border flex items-center justify-center transition-colors ${
                  product && isInWishlist(product.id)
                    ? "border-error text-error bg-error/5"
                    : "border-outline-variant hover:border-primary"
                }`}
                aria-label="Add to wishlist"
              >
                <Heart className={`w-5 h-5 ${product && isInWishlist(product.id) ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Trust */}
            <div className="space-y-4 border-t border-outline-variant/10 pt-8">
              <div className="flex items-center gap-3 text-sm text-on-surface-variant font-body">
                <Truck className="w-5 h-5 text-secondary" />
                Free delivery in Lagos & Abuja
              </div>
              <div className="flex items-center gap-3 text-sm text-on-surface-variant font-body">
                <ShieldCheck className="w-5 h-5 text-secondary" />
                2-year craftsmanship warranty
              </div>
            </div>

            {/* Details accordion */}
            <div className="border-t border-outline-variant/10 mt-8">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center justify-between w-full py-4 text-left"
              >
                <span className="font-display text-body text-primary">Product Details</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${showDetails ? "rotate-180" : ""}`} />
              </button>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="pb-4 space-y-2 text-sm text-on-surface-variant font-body"
                >
                  <p><span className="text-primary">SKU:</span> {product.sku}</p>
                  <p><span className="text-primary">Material:</span> {product.material}</p>
                  <p><span className="text-primary">Stock:</span> {product.stockQuantity} available</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-24 max-w-3xl">
          <ProductReviews productId={product.id} />
        </div>

        {/* Related Products */}
        {related && related.length > 0 && (
          <div className="mt-24">
            <h2 className="font-display text-headline-md text-primary mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((p) => (
                <Link key={p.id} to={`/products/${p.slug}`} className="group">
                  <div className="aspect-[3/4] bg-surface-container-low overflow-hidden mb-4">
                    <img
                      src={p.images[0]?.url}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-display text-body text-primary group-hover:text-secondary transition-colors">
                    {p.name}
                  </h3>
                  <p className="font-display text-body text-primary mt-1">{formatNaira(p.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
