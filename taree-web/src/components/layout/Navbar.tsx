import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Search, User, Heart, ShoppingBag } from "lucide-react";
import MobileMenu from "./MobileMenu";
import { useCartStore } from "../../stores/cartStore";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItems, openDrawer } = useCartStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { label: "New Arrivals", href: "/products?new=true" },
    { label: "Collections", href: "/products" },
    { label: "About Us", href: "/our-story" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-surface/90 backdrop-blur-md border-b border-outline-variant/10 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-container mx-auto px-margin py-4">
          {/* Top Row */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-6">
              <button
                className="md:hidden text-primary hover:text-secondary transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <Link
                to="/products"
                className="hidden md:flex text-label-caps text-on-surface-variant hover:text-primary transition-colors"
              >
                <Search className="w-5 h-5" />
              </Link>
            </div>

            {/* Logo */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2">
              <img
                src="/images/logo.png"
                alt="TAREÉ"
                className="h-12 w-auto object-contain"
              />
            </Link>

            {/* Right Icons */}
            <div className="flex items-center gap-5">
              <Link
                to="/login"
                className="text-primary hover:text-secondary transition-colors"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </Link>
              <Link
                to="/wishlist"
                className="text-primary hover:text-secondary transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </Link>
              <button
                onClick={openDrawer}
                className="relative text-primary hover:text-secondary transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-on-secondary text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Bottom Row - Desktop Nav */}
          <div className="hidden md:flex items-center justify-center gap-12 w-full border-t border-outline-variant/10 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-label-caps text-on-surface-variant hover:text-primary transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={navLinks}
      />
    </>
  );
}
