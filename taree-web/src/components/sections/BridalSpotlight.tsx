import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function BridalSpotlight() {
  return (
    <section className="relative h-[716px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/bridal-necklace.png"
          alt="Bridal Collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/20" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative z-10 px-margin max-w-container mx-auto w-full text-center"
      >
        <h2 className="font-display text-display-lg text-white mb-6">
          Begin Your Forever
        </h2>
        <p className="text-white/90 text-body-lg mb-10 max-w-xl mx-auto">
          Discover our curated bridal collection designed to make your most special moments truly unforgettable.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link
            to="/products"
            className="bg-white text-primary px-10 py-5 text-label-caps uppercase tracking-widest hover:bg-surface-variant transition-colors"
          >
            Shop Bridal
          </Link>
          <Link
            to="#"
            className="border border-white text-white px-10 py-5 text-label-caps uppercase tracking-widest backdrop-blur-sm hover:bg-white/10 transition-colors"
          >
            Book a Consultation
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
