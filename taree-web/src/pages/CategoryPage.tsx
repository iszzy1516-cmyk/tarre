import { useParams, Link } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { formatNaira } from "../lib/utils";
import type { Product } from "../types";

const products: Product[] = [
  {
    id: "1",
    name: "Crown Filigree Pendant",
    slug: "crown-filigree-pendant",
    description: "",
    price: 145000,
    sku: "TAR-CFP-001",
    images: [{ id: "i1", url: "/images/beaded-necklace.png", alt: "Crown Filigree Pendant", sortOrder: 0, isPrimary: true }],
    category: { id: "c1", name: "Necklaces & Pendants", slug: "necklaces-pendants" },
    isNewArrival: true,
    isFeatured: true,
    isActive: true,
    stockQuantity: 10,
  },
  {
    id: "5",
    name: "Ethereal Wings Diamond Choker",
    slug: "ethereal-wings-diamond-choker",
    description: "",
    price: 280000,
    sku: "TAR-EWC-005",
    images: [{ id: "i5", url: "/images/ethereal-wings-choker.png", alt: "Ethereal Wings Choker", sortOrder: 0, isPrimary: true }],
    category: { id: "c1", name: "Necklaces & Pendants", slug: "necklaces-pendants" },
    isNewArrival: false,
    isFeatured: true,
    isActive: true,
    stockQuantity: 5,
  },
  {
    id: "9",
    name: "Triple Layer Heritage Chain",
    slug: "triple-layer-heritage-chain",
    description: "",
    price: 110000,
    sku: "TAR-TLH-009",
    images: [{ id: "i9", url: "/images/woven-necklace.png", alt: "Triple Layer Heritage Chain", sortOrder: 0, isPrimary: true }],
    category: { id: "c1", name: "Necklaces & Pendants", slug: "necklaces-pendants" },
    isNewArrival: false,
    isFeatured: true,
    isActive: true,
    stockQuantity: 15,
  },
  {
    id: "6",
    name: "Zambian Emerald Medallion",
    slug: "zambian-emerald-medallion",
    description: "",
    price: 325000,
    sku: "TAR-ZEM-006",
    images: [{ id: "i6", url: "/images/emerald-pendant.png", alt: "Zambian Emerald Medallion", sortOrder: 0, isPrimary: true }],
    category: { id: "c1", name: "Necklaces & Pendants", slug: "necklaces-pendants" },
    isNewArrival: false,
    isFeatured: true,
    isActive: true,
    stockQuantity: 7,
  },
];

const categories = [
  "Necklaces & Pendants",
  "Earrings",
  "Bracelets & Bangles",
  "Rings",
  "Watches",
  "Bridal",
  "Men's",
  "Gift Sets",
];

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const categoryName = slug
    ? slug.replace(/-/g, " & ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "All Products";

  return (
    <div className="pt-[160px] pb-section">
      <div className="max-w-container mx-auto px-margin">
        {/* Breadcrumb & Title */}
        <div className="mb-8">
          <nav className="text-sm text-on-surface-variant mb-4 font-body">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="hover:text-primary transition-colors">Collections</Link>
            <span className="mx-2">/</span>
            <span className="text-primary">{categoryName}</span>
          </nav>
          <h1 className="font-display text-headline-lg text-primary uppercase tracking-wide">
            {categoryName}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="hidden lg:block">
              <h3 className="text-label-caps text-primary mb-8 tracking-widest uppercase">
                Collections
              </h3>
              <ul className="space-y-4">
                {categories.map((cat) => (
                  <li key={cat}>
                    <Link
                      to={`/categories/${cat.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                      className={`text-sm font-body transition-colors ${
                        cat === categoryName
                          ? "text-secondary font-bold"
                          : "text-on-surface-variant hover:text-primary"
                      }`}
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile Filter Toggle */}
            <button className="lg:hidden flex items-center gap-2 border border-outline-variant px-4 py-2 text-sm font-body text-primary">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-outline-variant/10">
              <div className="flex gap-6">
                <button className="text-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors font-body">
                  Material
                </button>
                <button className="text-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors font-body">
                  Collection
                </button>
                <button className="text-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors font-body">
                  Price Range
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-on-surface-variant font-body">
                <span>Sort by:</span>
                <select className="bg-transparent border-none outline-none text-primary font-medium cursor-pointer">
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="group cursor-pointer block"
                >
                  <div className="relative aspect-square bg-surface-container-low overflow-hidden mb-4">
                    <img
                      src={product.images[0]?.url}
                      alt={product.images[0]?.alt || product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1 font-body">
                      {product.category.name}
                    </p>
                    <h3 className="font-display text-body-lg text-primary mb-1">
                      {product.name}
                    </h3>
                    <p className="text-secondary font-bold font-body">
                      {formatNaira(product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-12 text-center">
              <button className="border border-outline-variant px-8 py-3 text-label-caps uppercase tracking-widest text-on-surface-variant hover:border-primary hover:text-primary transition-colors font-body">
                Load More
              </button>
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center gap-2 text-sm font-body">
              <span className="w-8 h-8 flex items-center justify-center bg-primary text-white">1</span>
              <span className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary cursor-pointer">2</span>
              <span className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary cursor-pointer">3</span>
              <span className="w-8 h-8 flex items-center justify-center text-on-surface-variant">...</span>
              <span className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary cursor-pointer">12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
