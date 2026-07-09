import { Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import { X, Heart, Loader2 } from "lucide-react";
import { useWishlist } from "../stores/wishlistStore";
import { useAuthStore } from "../stores/authStore";
import { formatNaira } from "../lib/utils";
import { useCartStore } from "../stores/cartStore";
import { useToastStore } from "../stores/toastStore";

export default function WishlistPage() {
  useSEO("My Wishlist | TAREÉ Jewelry", "Save your favorite jewelry pieces for later.");
  const { isAuthenticated } = useAuthStore();
  const { items, isLoading, removeFromWishlist } = useWishlist();
  const { addItem } = useCartStore();
  const addToast = useToastStore((s) => s.addToast);

  if (!isAuthenticated) {
    return (
      <div className="pt-[160px] pb-section max-w-container mx-auto px-margin text-center">
        <h1 className="font-display text-headline-lg text-primary mb-4">My Wishlist</h1>
        <p className="text-on-surface-variant font-body mb-8">Please sign in to view your wishlist.</p>
        <Link to="/login" className="bg-secondary text-on-secondary px-10 py-4 text-label-caps uppercase tracking-widest hover:bg-secondary-container transition-colors inline-block">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-[160px] pb-section">
      <div className="max-w-container mx-auto px-margin">
        <h1 className="font-display text-headline-lg text-primary mb-12">My Wishlist</h1>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-secondary animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-12 h-12 text-outline-variant mx-auto mb-4" />
            <p className="text-on-surface-variant text-body-lg mb-8">Your wishlist is empty</p>
            <Link to="/products" className="bg-secondary text-on-secondary px-10 py-4 text-label-caps uppercase tracking-widest hover:bg-secondary-container transition-colors inline-block">
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((item) => (
              <div key={item.id} className="group relative">
                <Link to={`/products/${item.product.slug}`} className="block relative overflow-hidden bg-surface-container-low aspect-[3/4] mb-4">
                  <img
                    src={item.product.images[0]?.url}
                    alt={item.product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
                <button
                  onClick={() => {
                    removeFromWishlist(item.product.id);
                    addToast("Removed from wishlist", "info");
                  }}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 text-error flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove from wishlist"
                >
                  <X className="w-4 h-4" />
                </button>
                <h3 className="font-display text-body text-primary">
                  <Link to={`/products/${item.product.slug}`} className="hover:text-secondary transition-colors">
                    {item.product.name}
                  </Link>
                </h3>
                <p className="font-display text-body text-primary mt-1">{formatNaira(item.product.price)}</p>
                <button
                  onClick={() => {
                    addItem(item.product);
                    addToast("Added to bag", "success");
                  }}
                  className="mt-3 w-full bg-luxury-navy text-champagne-gold py-2 text-label-caps uppercase tracking-widest text-xs hover:bg-champagne-gold hover:text-luxury-navy transition-all duration-300"
                >
                  Add to Bag
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
