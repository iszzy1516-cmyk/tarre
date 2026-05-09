import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function HeroSlider() {
  return (
    <section className="relative h-[100dvh] min-h-[600px] w-full overflow-hidden flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-portrait.jpeg"
          alt="TAREÉ Jewelry - African Luxury"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-margin max-w-container mx-auto w-full pt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl text-white"
        >
          <span className="text-label-caps uppercase tracking-[0.4em] mb-6 block text-secondary-fixed">
            Royal Heritage
          </span>
          <h1 className="font-display text-display-lg mb-8 leading-[1.1]">
            Where Elegance Meets Legacy
          </h1>
          <p className="text-body-lg mb-12 text-surface-variant opacity-90 max-w-lg">
            Handcrafted luxury jewelry designed for the modern African queen, celebrating strength, grace, and centuries of artistic tradition.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <Link
              to="/products"
              className="bg-secondary-fixed text-on-secondary-fixed px-10 py-5 text-label-caps uppercase tracking-widest hover:bg-secondary-fixed-dim transition-all duration-300 scale-100 hover:scale-[1.02] text-center"
            >
              Shop the Collection
            </Link>
            <Link
              to="/products"
              className="border border-white/30 text-white px-10 py-5 text-label-caps uppercase tracking-widest backdrop-blur-sm hover:bg-white/10 transition-all duration-300 text-center"
            >
              Explore Bridal
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
