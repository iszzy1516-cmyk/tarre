import HeroSlider from "../components/sections/HeroSlider";
import { useSEO } from "../hooks/useSEO";
import TrustBar from "../components/sections/TrustBar";
import CategoryGrid from "../components/sections/CategoryGrid";
import FeaturedProducts from "../components/sections/FeaturedProducts";
import BridalSpotlight from "../components/sections/BridalSpotlight";
import AboutSection from "../components/sections/AboutSection";
import Testimonials from "../components/sections/Testimonials";
import Newsletter from "../components/sections/Newsletter";

export default function HomePage() {
  useSEO("TAREÉ Jewelry | Luxury African Jewelry", "Handcrafted luxury jewelry designed for the modern African queen. Shop necklaces, earrings, bracelets, and bridal collections.");
  return (
    <div className="pt-[140px]">
      <HeroSlider />
      <TrustBar />
      <CategoryGrid />
      <FeaturedProducts />
      <BridalSpotlight />
      <AboutSection />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
