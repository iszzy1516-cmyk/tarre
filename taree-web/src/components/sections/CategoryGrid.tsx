import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { api } from "../../lib/api";
import { Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

const CATEGORY_IMAGES: Record<string, string> = {
  necklaces: "/images/real/necklaces-category.jpg",
  earrings: "/images/real/earrings-category.jpg",
  bracelets: "/images/real/bracelets-category.jpg",
  rings: "/images/real/rings-category.jpg",
  "bridal-sets": "/images/real/bridal-category.jpg",
};

async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get("/categories");
  return data;
}

export default function CategoryGrid() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  if (isLoading) {
    return (
      <section className="py-section butterfly-bg">
        <div className="max-w-container mx-auto px-margin flex justify-center">
          <Loader2 className="w-8 h-8 text-secondary animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-section butterfly-bg">
      <div className="max-w-container mx-auto px-margin">
        <div className="text-center mb-16">
          <h2 className="font-display text-headline-lg text-primary uppercase tracking-widest">
            Discover Your Style
          </h2>
          <div className="w-24 h-[2px] bg-secondary mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {categories?.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={`/categories/${category.slug}`}
                className="group relative aspect-[4/5] overflow-hidden block"
              >
                <img
                  src={CATEGORY_IMAGES[category.slug] || "/images/hero.jpg"}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <div className="absolute bottom-8 left-0 w-full text-center">
                  <h3 className="text-white font-display text-headline-md italic mb-2">
                    {category.name}
                  </h3>
                  <span className="text-white/80 text-[10px] tracking-widest uppercase border-b border-white/30 pb-1 font-body">
                    Shop Now
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
