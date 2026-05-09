import HeroSlider from "../components/sections/HeroSlider";
import TrustBar from "../components/sections/TrustBar";
import CategoryGrid from "../components/sections/CategoryGrid";
import FeaturedProducts from "../components/sections/FeaturedProducts";
import BridalSpotlight from "../components/sections/BridalSpotlight";
import AboutSection from "../components/sections/AboutSection";
import Testimonials from "../components/sections/Testimonials";
import Newsletter from "../components/sections/Newsletter";

export default function HomePage() {
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
