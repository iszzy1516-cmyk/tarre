import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, User, Heart, ShoppingBag, LogOut, X, Loader2 } from "lucide-react";
import MobileMenu from "./MobileMenu";
import { useCartStore } from "../../stores/cartStore";
import { useAuthStore } from "../../stores/authStore";
import { api } from "../../lib/api";
import type { Product } from "../../types";
import { formatNaira } from "../../lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems, openDrawer } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowSearch(false);
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const { data } = await api.get(`/products?q=${encodeURIComponent(searchQuery)}&limit=5`);
          setSearchResults(
            data.map((p: any) => ({
              ...p,
              images: p.images.map((img: any) => ({
                id: img.id,
                url: img.url,
                alt: img.alt_text,
                sortOrder: img.sort_order,
                isPrimary: img.is_primary,
              })),
              category: p.category,
              isNewArrival: p.is_new_arrival,
              isFeatured: p.is_featured,
              isActive: p.is_active,
              stockQuantity: p.stock_quantity,
              compareAtPrice: p.compare_at_price,
              shortDescription: p.short_description,
            }))
          );
        } catch {
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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
          isScrolled || showSearch
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
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="hidden md:flex text-label-caps text-on-surface-variant hover:text-primary transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Logo */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2">
              <img src="/images/logo.png" alt="TAREÉ" className="h-20 w-auto object-contain" />
            </Link>

            {/* Right Icons */}
            <div className="flex items-center gap-5">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link to="/account" className="text-primary hover:text-secondary transition-colors flex items-center gap-2" aria-label="Account">
                    <User className="w-5 h-5" />
                    <span className="hidden md:inline text-sm font-body">{user?.firstName}</span>
                  </Link>
                  <button onClick={() => { console.log("[Navbar] logout clicked"); logout(); }} className="text-primary hover:text-secondary transition-colors" aria-label="Logout" title="Logout">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-primary hover:text-secondary transition-colors" aria-label="Account">
                  <User className="w-5 h-5" />
                </Link>
              )}
              <Link to="/wishlist" className="text-primary hover:text-secondary transition-colors" aria-label="Wishlist">
                <Heart className="w-5 h-5" />
              </Link>
              <button onClick={openDrawer} className="relative text-primary hover:text-secondary transition-colors" aria-label="Cart">
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-on-secondary text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className="relative pb-4">
              <div className="flex items-center border-b border-outline-variant">
                <Search className="w-5 h-5 text-on-surface-variant" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search jewelry..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent py-3 px-4 outline-none font-body text-primary placeholder:text-on-surface-variant/50"
                />
                <button onClick={() => { setShowSearch(false); setSearchQuery(""); }} className="text-on-surface-variant hover:text-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isSearching ? (
                <div className="absolute top-full left-0 w-full bg-surface shadow-lg border border-outline-variant/10 p-4 flex justify-center">
                  <Loader2 className="w-5 h-5 text-secondary animate-spin" />
                </div>
              ) : searchResults.length > 0 ? (
                <div className="absolute top-full left-0 w-full bg-surface shadow-lg border border-outline-variant/10 max-h-[400px] overflow-y-auto">
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => { navigate(`/products/${product.slug}`); setShowSearch(false); setSearchQuery(""); }}
                      className="flex items-center gap-4 w-full p-4 hover:bg-surface-container-low transition-colors text-left"
                    >
                      <img src={product.images[0]?.url} alt={product.name} className="w-12 h-12 object-cover bg-surface-container-low" />
                      <div className="flex-1">
                        <p className="font-body text-sm text-primary">{product.name}</p>
                        <p className="text-xs text-on-surface-variant">{product.category.name}</p>
                      </div>
                      <span className="font-display text-sm text-primary">{formatNaira(product.price)}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => { navigate(`/products?q=${encodeURIComponent(searchQuery)}`); setShowSearch(false); setSearchQuery(""); }}
                    className="w-full p-3 text-center text-sm text-secondary hover:bg-surface-container-low transition-colors font-body"
                  >
                    View all results
                  </button>
                </div>
              ) : searchQuery.trim().length >= 2 ? (
                <div className="absolute top-full left-0 w-full bg-surface shadow-lg border border-outline-variant/10 p-4 text-center text-sm text-on-surface-variant font-body">
                  No products found
                </div>
              ) : null}
            </div>
          )}

          {/* Bottom Row - Desktop Nav */}
          <div className="hidden md:flex items-center justify-center gap-12 w-full border-t border-outline-variant/10 pt-4">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.href} className="text-label-caps text-on-surface-variant hover:text-primary transition-colors duration-300">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} links={navLinks} />
    </>
  );
}
