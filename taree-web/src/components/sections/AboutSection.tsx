import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section id="about" className="py-section">
      <div className="max-w-container mx-auto px-margin">
        <div className="flex flex-col md:flex-row items-center gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-1/2"
          >
            <div className="relative pr-12 pb-12">
              <img
                src="/images/gold-rings-dark.png"
                alt="TAREÉ craftsmanship"
                className="w-full aspect-square object-cover relative z-10 shadow-xl"
              />
              <div className="absolute top-12 left-12 w-full h-full border-2 border-secondary z-0" />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full md:w-1/2"
          >
            <span className="text-label-caps text-secondary uppercase tracking-[0.4em] mb-4 block">
              Our Story
            </span>
            <h2 className="font-display text-headline-lg mb-8">
              Crafting Modern Legends
            </h2>
            <div className="space-y-6 text-on-surface-variant text-body-lg">
              <p>
                TAREÉ JEWELRY celebrates the strength, grace, and beauty of the African woman. Our pieces are more than just accessories; they are artifacts of legacy, meticulously handcrafted by master artisans.
              </p>
              <p>
                Drawing inspiration from the butterfly—a symbol of transformation and delicate power—our designs weave ancient Nigerian motifs with contemporary minimalist aesthetics. Each piece tells a story of heritage, reimagined for the global stage.
              </p>
            </div>
            <Link
              to="/our-story"
              className="inline-block mt-10 border-b-2 border-primary text-label-caps uppercase tracking-widest py-2 hover:text-secondary hover:border-secondary transition-all"
            >
              Learn More About Tareé
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
