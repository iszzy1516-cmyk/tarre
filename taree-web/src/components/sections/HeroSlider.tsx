import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import type { Banner } from "../../types";
import { Skeleton } from "../ui/Skeleton";

export default function HeroSlider() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/banners/hero")
      .then((res) => setBanners(res.data))
      .catch(() => setBanners([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (loading) {
    return (
      <section className="relative h-[100dvh] min-h-[600px] w-full overflow-hidden flex items-center">
        <Skeleton className="absolute inset-0" />
      </section>
    );
  }

  if (banners.length === 0) {
    return (
      <section className="relative h-[100dvh] min-h-[600px] w-full overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-portrait.jpeg"
            alt="TAREÉ Jewelry"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 hero-gradient" />
        </div>
        <div className="relative z-10 px-margin max-w-container mx-auto w-full pt-20">
          <div className="max-w-2xl text-white">
            <span className="text-label-caps uppercase tracking-[0.4em] mb-6 block text-secondary-fixed">
              Royal Heritage
            </span>
            <h1 className="font-display text-display-lg mb-8 leading-[1.1]">
              Where Elegance Meets Legacy
            </h1>
            <Link
              to="/products"
              className="bg-secondary-fixed text-on-secondary-fixed px-10 py-5 text-label-caps uppercase tracking-widest hover:bg-secondary-fixed-dim transition-all duration-300 inline-block"
            >
              Shop the Collection
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const slide = banners[current];

  return (
    <section className="relative h-[100dvh] min-h-[600px] w-full overflow-hidden flex items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 hero-gradient" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 px-margin max-w-container mx-auto w-full pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl text-white"
          >
            {slide.subtitle && (
              <span className="text-label-caps uppercase tracking-[0.4em] mb-6 block text-secondary-fixed">
                {slide.subtitle}
              </span>
            )}
            <h1 className="font-display text-display-lg mb-8 leading-[1.1]">
              {slide.title}
            </h1>
            {slide.ctaLink && slide.ctaText && (
              <Link
                to={slide.ctaLink}
                className="bg-secondary-fixed text-on-secondary-fixed px-10 py-5 text-label-caps uppercase tracking-widest hover:bg-secondary-fixed-dim transition-all duration-300 inline-block"
              >
                {slide.ctaText}
              </Link>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === current ? "bg-white w-6" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
