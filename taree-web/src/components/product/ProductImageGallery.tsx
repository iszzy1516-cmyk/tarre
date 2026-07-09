import { useState } from "react";
import type { ProductImage } from "../../types";
import { cn } from "../../lib/utils";

interface ProductImageGalleryProps {
  images: ProductImage[];
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const mainImage = sorted[activeIndex] || sorted[0];

  if (sorted.length === 0) {
    return (
      <div className="aspect-square bg-surface-container-low flex items-center justify-center">
        <span className="text-on-surface-variant font-body">No image</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-square overflow-hidden bg-surface-container-low">
        <img
          src={mainImage?.url}
          alt={mainImage?.alt || "Product image"}
          className="w-full h-full object-cover"
        />
      </div>
      {sorted.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {sorted.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "flex-shrink-0 w-20 h-20 overflow-hidden border-2 transition-colors",
                idx === activeIndex
                  ? "border-luxury-navy"
                  : "border-transparent hover:border-outline-variant"
              )}
            >
              <img
                src={img.url}
                alt={img.alt || ""}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
