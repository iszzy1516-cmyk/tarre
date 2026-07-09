import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import type { Product } from "../../types";
import { formatNaira } from "../../lib/utils";
import { useCartStore } from "../../stores/cartStore";
import { Badge } from "../ui/Badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    openDrawer();
  };

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const secondaryImage = product.images[1];
  const isOnSale = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-surface-container-low mb-4">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
            {product.isNewArrival && (
              <Badge variant="success">NEW</Badge>
            )}
            {isOnSale && (
              <Badge variant="warning">SALE</Badge>
            )}
          </div>

          {/* Images with hover swap */}
          <img
            src={primaryImage?.url || "/images/placeholder.jpg"}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isHovered && secondaryImage ? "opacity-0" : "opacity-100"
            }`}
          />
          {secondaryImage && (
            <img
              src={secondaryImage.url}
              alt={`${product.name} - alternate`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* Quick add */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAdd}
              className="w-full bg-luxury-navy text-champagne-gold py-3 flex items-center justify-center gap-2 text-label-caps uppercase tracking-widest hover:bg-champagne-gold hover:text-luxury-navy transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Bag
            </button>
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="font-display text-sm text-primary truncate">{product.name}</h3>
          <div className="flex items-center gap-2">
            <p className="font-body text-primary">{formatNaira(product.price)}</p>
            {isOnSale && product.compareAtPrice && (
              <p className="font-body text-xs text-on-surface-variant line-through">
                {formatNaira(product.compareAtPrice)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
