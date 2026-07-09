import { useState } from "react";
import type { Product } from "../../types";
import { formatNaira } from "../../lib/utils";
import { ProductImageGallery } from "./ProductImageGallery";
import { AddToCartButton } from "./AddToCartButton";
import { Minus, Plus } from "lucide-react";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0]
  );

  const displayPrice = selectedVariant?.priceAdjustment
    ? product.price + selectedVariant.priceAdjustment
    : product.price;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <ProductImageGallery images={product.images} />

      <div className="space-y-6">
        <div>
          <h1 className="font-display text-headline-lg text-primary mb-2">
            {product.name}
          </h1>
          <p className="font-body text-body-lg text-primary">
            {formatNaira(displayPrice)}
          </p>
          {product.compareAtPrice && product.compareAtPrice > displayPrice && (
            <p className="text-sm text-on-surface-variant line-through font-body">
              {formatNaira(product.compareAtPrice)}
            </p>
          )}
        </div>

        <p className="text-on-surface-variant font-body leading-relaxed">
          {product.description}
        </p>

        {/* Variants */}
        {product.variants && product.variants.length > 0 && (
          <div className="space-y-3">
            <span className="font-body text-xs uppercase tracking-widest text-on-surface-variant">
              Variant
            </span>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-4 py-2 border text-sm font-body transition-colors ${
                    selectedVariant?.id === variant.id
                      ? "border-luxury-navy bg-luxury-navy text-champagne-gold"
                      : "border-outline-variant text-primary hover:bg-surface-container"
                  }`}
                >
                  {variant.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="space-y-3">
          <span className="font-body text-xs uppercase tracking-widest text-on-surface-variant">
            Quantity
          </span>
          <div className="flex items-center border border-outline-variant w-fit">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-4 py-3 hover:bg-surface-container transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-3 text-sm font-body min-w-[3rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-4 py-3 hover:bg-surface-container transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <AddToCartButton
          product={product}
          variant={selectedVariant}
          quantity={quantity}
        />

        {/* Meta */}
        <div className="pt-6 border-t border-outline-variant/10 space-y-2">
          <div className="flex justify-between text-sm font-body">
            <span className="text-on-surface-variant">SKU</span>
            <span className="text-primary">{product.sku}</span>
          </div>
          {product.material && (
            <div className="flex justify-between text-sm font-body">
              <span className="text-on-surface-variant">Material</span>
              <span className="text-primary">{product.material}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-body">
            <span className="text-on-surface-variant">Stock</span>
            <span className="text-primary">
              {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
