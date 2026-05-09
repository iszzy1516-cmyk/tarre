import { Link } from "react-router-dom";
import { X, Search, User, Heart, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
}

export default function MobileMenu({ isOpen, onClose, links }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-[85vw] max-w-sm bg-surface z-[70] shadow-2xl overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-10">
                <img
                  src="/images/logo.png"
                  alt="TAREÉ"
                  className="h-10 w-auto object-contain"
                />
                <button
                  onClick={onClose}
                  className="text-primary hover:text-secondary transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-6 mb-10">
                <Link to="/products" className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors">
                  <Search className="w-4 h-4" />
                  Search
                </Link>
                <Link to="/login" className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors">
                  <User className="w-4 h-4" />
                  Account
                </Link>
                <Link to="/wishlist" className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors">
                  <Heart className="w-4 h-4" />
                  Wishlist
                </Link>
                <Link to="/cart" className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors">
                  <ShoppingBag className="w-4 h-4" />
                  Cart
                </Link>
              </div>

              {/* Nav Links */}
              <div className="space-y-1">
                {links.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="block py-4 text-lg font-display text-primary border-b border-outline-variant/10 hover:text-secondary transition-colors"
                    onClick={onClose}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Categories */}
              <div className="mt-10">
                <h3 className="text-label-caps text-on-surface-variant mb-4">Collections</h3>
                <div className="space-y-3">
                  {["Necklaces & Pendants", "Earrings", "Bracelets & Bangles", "Rings", "Bridal"].map((cat) => (
                    <Link
                      key={cat}
                      to={`/categories/${cat.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                      className="block text-sm text-on-surface-variant hover:text-primary transition-colors"
                      onClick={onClose}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
