import { SlidersHorizontal, X } from "lucide-react";
import type { Category } from "../../types";
import { cn } from "../../lib/utils";

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory?: string;
  priceRange: [number, number];
  sortBy?: string;
  onCategoryChange: (slug?: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onSortChange: (sort: string) => void;
  className?: string;
}

export function ProductFilters({
  categories,
  selectedCategory,
  priceRange,
  sortBy = "featured",
  onCategoryChange,
  onPriceChange,
  onSortChange,
  className,
}: ProductFiltersProps) {
  const hasFilters = selectedCategory || priceRange[0] > 0 || priceRange[1] < 500000;

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <span className="font-display text-sm text-primary">Filters</span>
        </div>
        {hasFilters && (
          <button
            onClick={() => {
              onCategoryChange(undefined);
              onPriceChange([0, 500000]);
            }}
            className="text-xs text-secondary hover:text-primary flex items-center gap-1 font-body"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="font-body text-xs uppercase tracking-widest text-on-surface-variant">
          Categories
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => onCategoryChange(undefined)}
            className={cn(
              "block w-full text-left px-3 py-2 text-sm font-body transition-colors",
              !selectedCategory
                ? "bg-surface-container text-primary"
                : "text-on-surface-variant hover:text-primary"
            )}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.slug)}
              className={cn(
                "block w-full text-left px-3 py-2 text-sm font-body transition-colors",
                selectedCategory === cat.slug
                  ? "bg-surface-container text-primary"
                  : "text-on-surface-variant hover:text-primary"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="font-body text-xs uppercase tracking-widest text-on-surface-variant">
          Price Range
        </h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => onPriceChange([Number(e.target.value), priceRange[1]])}
            className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm font-body"
            placeholder="Min"
          />
          <span className="text-on-surface-variant">-</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
            className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm font-body"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-3">
        <h4 className="font-body text-xs uppercase tracking-widest text-on-surface-variant">
          Sort By
        </h4>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm font-body text-primary"
        >
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}
