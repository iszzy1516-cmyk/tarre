import { Link } from "react-router-dom";
import { Minus, Plus, X, ShieldCheck, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "../stores/cartStore";
import { formatNaira } from "../lib/utils";

export default function CartPage() {
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Cart Items */}
            <div>
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

              <div className="mt-8 space-y-3">
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
            </div>

            {/* Checkout Form */}
            <div className="bg-surface-container-low p-8 lg:p-12">
              <h2 className="font-display text-headline-md text-primary mb-8">
                Secure Checkout
              </h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-on-surface-variant mb-2 font-body">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    defaultValue="queen@regal.ng"
                    className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors font-body"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-on-surface-variant mb-4 font-body">
                    Shipping Address
                  </label>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors font-body placeholder:text-on-surface-variant/50"
                    />
                    <input
                      type="text"
                      placeholder="Street Address"
                      className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors font-body placeholder:text-on-surface-variant/50"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <select className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors font-body">
                        <option>Lagos</option>
                        <option>Abuja</option>
                        <option>Port Harcourt</option>
                      </select>
                      <input
                        type="text"
                        placeholder="City"
                        className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors font-body placeholder:text-on-surface-variant/50"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-on-surface-variant mb-4 font-body">
                    Delivery Method
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 border border-secondary bg-secondary/5 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full border-2 border-secondary bg-secondary" />
                        <span className="text-sm font-body">Standard Delivery</span>
                      </div>
                      <span className="text-sm text-secondary font-body">Free</span>
                    </label>
                    <label className="flex items-center justify-between p-4 border border-outline-variant cursor-pointer hover:border-primary transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full border-2 border-outline-variant" />
                        <span className="text-sm font-body">Luxe Express (Next Day)</span>
                      </div>
                      <span className="text-sm font-body">₦15,000</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-on-surface-variant mb-4 font-body">
                    Payment Method
                  </label>
                  <div className="flex gap-4">
                    <button type="button" className="flex-1 py-3 border-2 border-secondary bg-secondary/5 text-sm font-body">
                      Paystack
                    </button>
                    <button type="button" className="flex-1 py-3 border border-outline-variant text-sm font-body hover:border-primary transition-colors">
                      Flutterwave
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-luxury-navy text-champagne-gold py-5 text-label-caps uppercase tracking-widest hover:bg-champagne-gold hover:text-luxury-navy transition-all duration-300"
                >
                  Place Order →
                </button>

                <div className="flex justify-center gap-8 pt-4">
                  <div className="flex items-center gap-2 text-[11px] text-on-surface-variant font-body">
                    <ShieldCheck className="w-4 h-4" />
                    SSL Secure Checkout
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-on-surface-variant font-body">
                    <Lock className="w-4 h-4" />
                    256-Bit Encryption
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
