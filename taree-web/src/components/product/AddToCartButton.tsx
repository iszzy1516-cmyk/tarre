import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import type { Product, ProductVariant } from "../../types";
import { useCartStore } from "../../stores/cartStore";

interface AddToCartButtonProps {
  product: Product;
  variant?: ProductVariant;
  quantity?: number;
  className?: string;
}

export function AddToCartButton({
  product,
  variant,
  quantity = 1,
  className,
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const handleClick = () => {
    addItem(product, variant, quantity);
    openDrawer();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleClick}
      disabled={product.stockQuantity <= 0}
      className={`w-full bg-luxury-navy text-champagne-gold py-4 flex items-center justify-center gap-3 text-label-caps uppercase tracking-widest hover:bg-champagne-gold hover:text-luxury-navy transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {added ? (
        <>
          <Check className="w-4 h-4" />
          Added to Bag
        </>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4" />
          {product.stockQuantity <= 0 ? "Out of Stock" : "Add to Bag"}
        </>
      )}
    </button>
  );
}
