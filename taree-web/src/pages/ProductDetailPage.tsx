import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ChevronDown, Truck, ShieldCheck } from "lucide-react";
import { formatNaira } from "../lib/utils";
import { useCartStore } from "../stores/cartStore";
import type { Product } from "../types";

const products: Product[] = [
  {
    id: "5",
    name: "Ethereal Wings Diamond Choker",
    slug: "ethereal-wings-diamond-choker",
    description: "A masterpiece of Nigerian craftsmanship, featuring our signature butterfly monogram encrusted with brilliant-cut diamonds. Each wing is hand-finished to evoke the fluid movement of transformation.",
    price: 280000,
    sku: "TAR-EWC-005",
    images: [
      { id: "i1", url: "/images/ethereal-wings-choker.png", alt: "Ethereal Wings Main", sortOrder: 0, isPrimary: true },
      { id: "i2", url: "/images/ethereal-wings-sketch.png", alt: "Ethereal Wings Detail", sortOrder: 1, isPrimary: false },
      { id: "i3", url: "/images/butterfly-pendant-cushion.png", alt: "Ethereal Wings Alternate", sortOrder: 2, isPrimary: false },
    ],
    category: { id: "c1", name: "Necklaces", slug: "necklaces" },
    material: "18K Yellow Gold & Ethically Sourced Diamonds",
    isNewArrival: false,
    isFeatured: true,
    isActive: true,
    stockQuantity: 5,
  },
  {
    id: "1",
    name: "Butterfly Monogram Necklace",
    slug: "butterfly-monogram-necklace",
    description: "A delicate yet powerful statement piece. The butterfly monogram is rendered in solid 18k gold, symbolizing transformation and the enduring beauty of African craftsmanship.",
    price: 450000,
    sku: "TAR-BMN-001",
    images: [
      { id: "i1", url: "/images/butterfly-necklace.png", alt: "Butterfly Necklace Main", sortOrder: 0, isPrimary: true },
      { id: "i2", url: "/images/butterfly-pendant-cushion.png", alt: "Butterfly Necklace Detail", sortOrder: 1, isPrimary: false },
    ],
    category: { id: "c1", name: "Necklaces", slug: "necklaces" },
    material: "18K Gold",
    isNewArrival: true,
    isFeatured: true,
    isActive: true,
    stockQuantity: 10,
  },
];

const relatedProducts: Product[] = [
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
];

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((p) => p.slug === slug) || products[0];
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState("gold");
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const { addItem } = useCartStore();

  const materials = [
    { id: "gold", name: "18K Gold", color: "#E5C282" },
    { id: "rose", name: "Rose Gold", color: "#E8AE9D" },
    { id: "white", name: "White Gold", color: "#E2E2E2" },
  ];

  const accordions = [
    { id: "craftsmanship", label: "Craftsmanship & Materials" },
    { id: "size", label: "Size & Fit" },
    { id: "gift", label: "Gift Wrapping" },
  ];

  return (
    <div className="pt-[160px]">
      <main className="max-w-container mx-auto px-margin">
        {/* Product Section */}
        <section className="grid grid-cols-1 lg:grid-cols-10 gap-gutter items-start">
          {/* Left: Gallery */}
          <div className="lg:col-span-6 flex flex-col-reverse md:flex-row gap-6">
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto max-h-[800px] custom-scrollbar pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(idx)}
                  className={`min-w-[100px] h-[120px] bg-surface-container cursor-pointer transition-opacity ${
                    selectedImage === idx
                      ? "border border-secondary opacity-100"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            <div className="flex-1 bg-surface-container-low aspect-[4/5] relative group overflow-hidden">
              <img
                src={product.images[selectedImage]?.url}
                alt={product.images[selectedImage]?.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute top-8 right-8 bg-surface-container-lowest/90 backdrop-blur-md px-5 py-2 rounded-full border border-champagne-gold/30">
                <span className="text-[11px] text-secondary tracking-[0.25em] uppercase font-body">
                  Signature Piece
                </span>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-4 lg:sticky lg:top-[180px] pl-0 lg:pl-10">
            <div className="mb-10">
              <h2 className="text-label-caps text-secondary uppercase tracking-[0.3em] mb-4 text-[13px] font-body">
                TAREÉ JEWELRY
              </h2>
              <h3 className="font-display text-headline-lg text-primary mb-4 leading-tight">
                {product.name}
              </h3>
              <p className="font-display text-headline-md text-luxury-navy font-normal">
                {formatNaira(product.price)}
              </p>
            </div>

            <p className="text-on-surface-variant font-body-md mb-10 leading-relaxed text-lg">
              {product.description}
            </p>

            {/* Material Selection */}
            <div className="mb-10">
              <span className="block text-[11px] text-on-surface-variant mb-4 uppercase tracking-widest font-body">
                Select Material
              </span>
              <div className="flex gap-5">
                {materials.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => setSelectedMaterial(mat.id)}
                    title={mat.name}
                    className={`w-12 h-12 rounded-full border-2 transition-all ${
                      selectedMaterial === mat.id
                        ? "border-primary ring-2 ring-offset-2 ring-surface"
                        : "border-transparent hover:border-outline-variant"
                    }`}
                    style={{ backgroundColor: mat.color }}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-12">
              <button
                onClick={() => addItem(product)}
                className="flex-[3] bg-luxury-navy text-champagne-gold border border-champagne-gold py-5 px-8 text-label-caps uppercase tracking-[0.2em] text-sm font-bold shadow-xl hover:bg-champagne-gold hover:text-luxury-navy hover:border-luxury-navy transition-all duration-300"
              >
                Add to Bag
              </button>
              <button className="flex-1 border border-outline-variant flex items-center justify-center hover:bg-luxury-navy hover:text-champagne-gold transition-all duration-300">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-6 border-t border-b border-outline-variant/10 py-8 mb-10">
              <div className="flex items-center gap-4">
                <Truck className="w-6 h-6 text-champagne-gold" />
                <span className="text-[11px] text-on-surface-variant leading-tight uppercase tracking-wider font-body">
                  Free Nationwide Delivery
                </span>
              </div>
              <div className="flex items-center gap-4">
                <ShieldCheck className="w-6 h-6 text-champagne-gold" />
                <span className="text-[11px] text-on-surface-variant leading-tight uppercase tracking-wider font-body">
                  2-Year Warranty
                </span>
              </div>
            </div>

            {/* Accordions */}
            <div className="space-y-6">
              {accordions.map((acc) => (
                <div
                  key={acc.id}
                  className="group border-b border-outline-variant/10 pb-5"
                >
                  <button
                    onClick={() =>
                      setOpenAccordion(openAccordion === acc.id ? null : acc.id)
                    }
                    className="flex justify-between items-center w-full cursor-pointer hover:text-secondary transition-colors"
                  >
                    <span className="text-label-caps text-on-surface uppercase tracking-widest text-[12px] font-body">
                      {acc.label}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-outline transition-transform duration-300 ${
                        openAccordion === acc.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openAccordion === acc.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="pt-4 text-on-surface-variant text-sm leading-relaxed"
                    >
                      {acc.id === "craftsmanship" && (
                        <p>
                          Each piece is handcrafted by master artisans in Lagos using ethically sourced 18k gold and conflict-free diamonds. Our signature butterfly motif is hand-finished to ensure every detail meets our exacting standards.
                        </p>
                      )}
                      {acc.id === "size" && (
                        <p>
                          This choker measures 38cm in length with a 5cm extension chain. For bespoke sizing, please contact our concierge team.
                        </p>
                      )}
                      {acc.id === "gift" && (
                        <p>
                          Every TAREÉ piece arrives in our signature navy and gold presentation box, complete with a handwritten note card and care instructions.
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Collection Story */}
        <section className="mt-section py-section border-t border-outline-variant/10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-10 flex justify-center">
              <svg
                className="w-12 h-12 text-champagne-gold"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 3c-4.5 0-8 3.5-8 8 0 1.5.5 3 1.5 4.5L3 21l5.5-2.5c1.5 1 3 1.5 4.5 1.5 4.5 0 8-3.5 8-8s-3.5-8-8-8z" />
              </svg>
            </div>
            <h4 className="font-display text-headline-md text-primary mb-8 italic">
              The Butterfly Legacy
            </h4>
            <p className="font-display text-headline-md text-on-surface-variant leading-relaxed italic opacity-90 text-[28px]">
              "Inspired by the Benin royal ivory masks and the delicate metamorphosis of the savanna butterfly, the Butterfly Collection symbolizes the rising power of the modern African woman."
            </p>
            <p className="mt-6 text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              Each piece is an heirloom, designed to be passed down through generations, carrying the story of strength and beauty.
            </p>
          </div>
        </section>

        {/* Related Products */}
        <section className="mt-section mb-section bg-soft-cream -mx-margin-desktop px-margin-desktop py-24">
          <div className="max-w-container mx-auto">
            <h5 className="text-label-caps text-sm text-primary mb-16 uppercase tracking-[0.4em] text-center font-body">
              Complete The Look
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.id}
                  to={`/products/${rp.slug}`}
                  className="group cursor-pointer bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-500 block"
                >
                  <div className="aspect-square bg-surface-container-low mb-8 overflow-hidden">
                    <img
                      src={rp.images[0]?.url}
                      alt={rp.images[0]?.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-display text-[24px] text-primary mb-2">
                      {rp.name}
                    </p>
                    <p className="text-on-surface-variant text-lg font-body">
                      {formatNaira(rp.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
