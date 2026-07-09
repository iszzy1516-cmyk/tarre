import { Link, useNavigate } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import { Minus, Plus, X, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "../stores/cartStore";
import { formatNaira } from "../lib/utils";

export default function CartPage() {
  useSEO("Shopping Bag | TAREÉ Jewelry", "Review your selected items and proceed to checkout.");
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore();
  const shippingCost = 0;

  return (
    <div className="pt-[160px] pb-section">
      <div className="max-w-container mx-auto px-margin">
        <h1 className="font-display text-headline-lg text-primary mb-12">
          Your Shopping Bag
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-on-surface-variant text-body-lg mb-8">Your bag is empty</p>
            <Link
              to="/products"
              className="bg-secondary text-on-secondary px-10 py-4 text-label-caps uppercase tracking-widest hover:bg-secondary-container transition-colors inline-block"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-6 pb-8 border-b border-outline-variant/10"
                  >
                    <Link to={`/products/${item.product.slug}`}>
                      <img
                        src={item.product.images[0]?.url}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover bg-surface-container-low"
                      />
                    </Link>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <Link to={`/products/${item.product.slug}`}>
                          <h3 className="font-display text-body-lg text-primary hover:text-secondary transition-colors">
                            {item.product.name}
                          </h3>
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-on-surface-variant hover:text-error transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-sm text-on-surface-variant mb-4 font-body">
                        {item.product.material}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center border border-outline-variant">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-surface-container transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 py-1 text-sm font-body">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-surface-container transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="font-display text-headline-md text-primary">
                          {formatNaira(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-surface-container-low p-8 lg:p-10 h-fit">
              <h2 className="font-display text-headline-sm text-primary mb-8">
                Order Summary
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-on-surface-variant">Subtotal ({totalItems} items)</span>
                  <span>{formatNaira(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-on-surface-variant">Shipping</span>
                  <span className="text-secondary">Free</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-outline-variant/10">
                  <span className="text-label-caps uppercase tracking-widest text-primary font-body">Total</span>
                  <span className="font-display text-headline-md text-primary">
                    {formatNaira(totalPrice + shippingCost)}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant font-body flex items-center gap-2 pt-2">
                  <span className="inline-block">🚚</span>
                  Complimentary white-glove delivery in Lagos & Abuja within 48 hours.
                </p>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-luxury-navy text-champagne-gold py-5 text-label-caps uppercase tracking-widest hover:bg-champagne-gold hover:text-luxury-navy transition-all duration-300 flex items-center justify-center gap-3"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/products"
                className="block text-center mt-4 text-sm text-on-surface-variant hover:text-primary transition-colors font-body"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
