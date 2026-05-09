import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const categories = [
  {
    name: "Necklaces",
    image: "/images/diamond-choker.png",
    href: "/categories/necklaces-pendants",
  },
  {
    name: "Earrings",
    image: "/images/drop-earrings.png",
    href: "/categories/earrings",
  },
  {
    name: "Bracelets",
    image: "/images/gold-bracelets.png",
    href: "/categories/bracelets-bangles",
  },
  {
    name: "Rings",
    image: "/images/crown-ring.png",
    href: "/categories/rings",
  },
];

export default function CategoryGrid() {
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
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={category.href}
                className="group relative aspect-[4/5] overflow-hidden block"
              >
                <img
                  src={category.image}
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
