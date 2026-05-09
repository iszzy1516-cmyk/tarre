import { Link } from "react-router-dom";
import { formatNaira } from "../lib/utils";
import type { Product } from "../types";

const products: Product[] = [
  {
    id: "1",
    name: "Butterfly Monogram Necklace",
    slug: "butterfly-monogram-necklace",
    description: "",
    price: 450000,
    sku: "TAR-BMN-001",
    images: [{ id: "i1", url: "/images/butterfly-necklace.png", alt: "Butterfly Monogram Necklace", sortOrder: 0, isPrimary: true }],
    category: { id: "c1", name: "Necklaces", slug: "necklaces" },
    isNewArrival: true,
    isFeatured: true,
    isActive: true,
    stockQuantity: 10,
  },
  {
    id: "2",
    name: "Royal Heritage Hoops",
    slug: "royal-heritage-hoops",
    description: "",
    price: 320000,
    sku: "TAR-RHH-002",
    images: [{ id: "i2", url: "/images/gold-hoops.png", alt: "Royal Heritage Hoops", sortOrder: 0, isPrimary: true }],
    category: { id: "c2", name: "Earrings", slug: "earrings" },
    isNewArrival: true,
    isFeatured: true,
    isActive: true,
    stockQuantity: 15,
  },
  {
    id: "3",
    name: "Legacy Wave Cuff",
    slug: "legacy-wave-cuff",
    description: "",
    price: 680000,
    sku: "TAR-LWC-003",
    images: [{ id: "i3", url: "/images/wave-cuff.png", alt: "Legacy Wave Cuff", sortOrder: 0, isPrimary: true }],
    category: { id: "c3", name: "Bracelets", slug: "bracelets" },
    isNewArrival: false,
    isFeatured: true,
    isActive: true,
    stockQuantity: 8,
  },
  {
    id: "4",
    name: "Crown Signet Ring",
    slug: "crown-signet-ring",
    description: "",
    price: 280000,
    sku: "TAR-CSR-004",
    images: [{ id: "i4", url: "/images/crown-ring.png", alt: "Crown Signet Ring", sortOrder: 0, isPrimary: true }],
    category: { id: "c4", name: "Rings", slug: "rings" },
    isNewArrival: true,
    isFeatured: true,
    isActive: true,
    stockQuantity: 20,
  },
  {
    id: "5",
    name: "Ethereal Wings Diamond Choker",
    slug: "ethereal-wings-diamond-choker",
    description: "",
    price: 280000,
    sku: "TAR-EWC-005",
    images: [{ id: "i5", url: "/images/ethereal-wings-choker.png", alt: "Ethereal Wings Choker", sortOrder: 0, isPrimary: true }],
    category: { id: "c1", name: "Necklaces", slug: "necklaces" },
    isNewArrival: false,
    isFeatured: true,
    isActive: true,
    stockQuantity: 5,
  },
  {
    id: "6",
    name: "Zambian Emerald Medallion",
    slug: "zambian-emerald-medallion",
    description: "",
    price: 325000,
    sku: "TAR-ZEM-006",
    images: [{ id: "i6", url: "/images/emerald-pendant.png", alt: "Zambian Emerald Medallion", sortOrder: 0, isPrimary: true }],
    category: { id: "c1", name: "Necklaces", slug: "necklaces" },
    isNewArrival: false,
    isFeatured: true,
    isActive: true,
    stockQuantity: 7,
  },
  {
    id: "7",
    name: "Metamorphosis Bangle",
    slug: "metamorphosis-bangle",
    description: "",
    price: 185000,
    sku: "TAR-MTB-007",
    images: [{ id: "i7", url: "/images/gold-bracelets.png", alt: "Metamorphosis Bangle", sortOrder: 0, isPrimary: true }],
    category: { id: "c3", name: "Bracelets", slug: "bracelets" },
    isNewArrival: false,
    isFeatured: true,
    isActive: true,
    stockQuantity: 12,
  },
  {
    id: "8",
    name: "Butterfly Wing Studs",
    slug: "butterfly-wing-studs",
    description: "",
    price: 120000,
    sku: "TAR-BWS-008",
    images: [{ id: "i8", url: "/images/ethereal-wings-sketch.png", alt: "Butterfly Wing Studs", sortOrder: 0, isPrimary: true }],
    category: { id: "c2", name: "Earrings", slug: "earrings" },
    isNewArrival: false,
    isFeatured: true,
    isActive: true,
    stockQuantity: 18,
  },
];

export default function ProductsPage() {
  return (
    <div className="pt-[160px] pb-section">
      <div className="max-w-container mx-auto px-margin">
        <h1 className="font-display text-headline-lg text-primary mb-12">All Collections</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.slug}`}
              className="group cursor-pointer block"
            >
              <div className="relative aspect-[3/4] bg-surface-container-low overflow-hidden mb-6">
                <img
                  src={product.images[0]?.url}
                  alt={product.images[0]?.alt || product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.isNewArrival && (
                  <span className="absolute top-4 left-4 bg-primary text-white text-[10px] tracking-widest uppercase px-3 py-1 font-body">
                    New
                  </span>
                )}
              </div>
              <h3 className="font-display text-body-lg mb-1">{product.name}</h3>
              <p className="text-secondary font-bold font-body">{formatNaira(product.price)}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
