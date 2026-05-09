import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "../../stores/cartStore";
import { formatNaira } from "../../lib/utils";

export default function CartDrawer() {
  const { items, isOpen, closeDrawer, removeItem, updateQuantity, totalPrice } = useCartStore();

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
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[90vw] max-w-md bg-surface z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/10">
              <h2 className="font-display text-headline-md text-primary">Your Bag</h2>
              <button
                onClick={closeDrawer}
                className="text-on-surface-variant hover:text-primary transition-colors"
                aria-label="Close cart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag className="w-12 h-12 text-outline-variant mb-4" />
                  <p className="text-on-surface-variant text-body-lg mb-4">Your bag is empty</p>
                  <button
                    onClick={closeDrawer}
                    className="text-secondary hover:text-primary transition-colors text-label-caps uppercase tracking-widest font-body"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.product.images[0]?.url}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover bg-surface-container-low"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-display text-sm text-primary">{item.product.name}</h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-on-surface-variant hover:text-error transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {item.variant && (
                          <p className="text-xs text-on-surface-variant mb-2 font-body">{item.variant.name}</p>
                        )}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center border border-outline-variant">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 hover:bg-surface-container transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 py-1 text-sm font-body">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 hover:bg-surface-container transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-body text-primary">
                            {formatNaira(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-outline-variant/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-label-caps uppercase tracking-widest text-primary font-body">Subtotal</span>
                  <span className="font-display text-headline-md text-primary">{formatNaira(totalPrice)}</span>
                </div>
                <p className="text-xs text-on-surface-variant font-body">
                  Shipping and taxes calculated at checkout
                </p>
                <Link
                  to="/cart"
                  onClick={closeDrawer}
                  className="block w-full bg-luxury-navy text-champagne-gold py-4 text-label-caps uppercase tracking-widest text-center hover:bg-champagne-gold hover:text-luxury-navy transition-all duration-300"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={closeDrawer}
                  className="block w-full text-center text-on-surface-variant hover:text-primary transition-colors text-sm font-body"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
