import { useState, useEffect } from "react";
import { useSEO } from "../hooks/useSEO";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "../stores/cartStore";
import { useAuthStore } from "../stores/authStore";
import { formatNaira } from "../lib/utils";
import { api } from "../lib/api";
import { useToastStore } from "../stores/toastStore";

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
}

interface CheckoutForm {
  email: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  phone: string;
  deliveryMethod: "standard" | "express";
  paymentMethod: "paystack" | "flutterwave";
}

export default function CheckoutPage() {
  useSEO("Checkout | TAREÉ Jewelry", "Complete your purchase securely.");
  const navigate = useNavigate();
  const { items, totalPrice, totalItems, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const addToast = useToastStore((s) => s.addToast);

  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  const [form, setForm] = useState<CheckoutForm>({
    email: user?.email || "",
    fullName: user ? `${user.firstName} ${user.lastName}` : "",
    street: "",
    city: "",
    state: "Lagos",
    phone: user?.phone || "",
    deliveryMethod: "standard",
    paymentMethod: "paystack",
  });

  useEffect(() => {
    if (user) {
      api.get("/users/addresses")
        .then(({ data }) => {
          const addresses: Address[] = data.map((a: any) => ({
            id: a.id,
            label: a.label,
            street: a.street,
            city: a.city,
            state: a.state,
            country: a.country,
            isDefault: a.is_default,
          }));
          setSavedAddresses(addresses);
          const defaultAddr = addresses.find((a) => a.isDefault);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
            setForm((prev) => ({
              ...prev,
              street: defaultAddr.street,
              city: defaultAddr.city,
              state: defaultAddr.state,
            }));
          }
        })
        .catch(() => {
          // Silently fail — user can still enter address manually
        });
    }
  }, [user]);

  const shippingCost = form.deliveryMethod === "express" ? 15000 : 0;
  const total = totalPrice + shippingCost;

  const updateField = <K extends keyof CheckoutForm>(field: K, value: CheckoutForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // 1. Create order
      const orderPayload = {
        items: items.map((item) => ({
          product_id: item.product.id,
          variant_id: item.variant?.id || null,
          quantity: item.quantity,
        })),
        shipping_address: {
          email: form.email,
          full_name: form.fullName,
          street: form.street,
          city: form.city,
          state: form.state,
          phone: form.phone,
          delivery_method: form.deliveryMethod,
        },
        payment_method: form.paymentMethod,
      };

      const { data: order } = await api.post("/orders", orderPayload);

      // 2. Initialize payment
      const { data: payment } = await api.post("/payments/initialize", {
        order_id: order.id,
        email: form.email,
        phone: form.phone,
      });

      // 3. Clear cart and redirect to payment gateway
      clearCart();
      addToast("Redirecting to secure payment...", "success");
      window.location.href = payment.authorization_url;
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Something went wrong. Please try again.";
      setError(msg);
      addToast(msg, "error");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-[160px] pb-section max-w-container mx-auto px-margin text-center">
        <h1 className="font-display text-headline-lg text-primary mb-8">Checkout</h1>
        <p className="text-on-surface-variant text-body-lg mb-8">Your bag is empty.</p>
        <button
          onClick={() => navigate("/products")}
          className="bg-secondary text-on-secondary px-10 py-4 text-label-caps uppercase tracking-widest hover:bg-secondary-container transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="pt-[160px] pb-section">
      <div className="max-w-container mx-auto px-margin">
        <h1 className="font-display text-headline-lg text-primary mb-12">Checkout</h1>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-error/10 text-error px-6 py-4 mb-8 font-body text-sm"
          >
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Order Summary */}
          <div className="order-2 lg:order-1">
            <h2 className="font-display text-headline-sm text-primary mb-8">Order Summary</h2>
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-6 border-b border-outline-variant/10">
                  <img
                    src={item.product.images[0]?.url}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover bg-surface-container-low"
                  />
                  <div className="flex-1">
                    <h3 className="font-display text-body text-primary">{item.product.name}</h3>
                    <p className="text-sm text-on-surface-variant font-body">
                      Qty: {item.quantity}
                    </p>
                    <p className="font-display text-body text-primary mt-1">
                      {formatNaira(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex justify-between text-sm font-body">
                <span className="text-on-surface-variant">Subtotal ({totalItems} items)</span>
                <span>{formatNaira(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm font-body">
                <span className="text-on-surface-variant">Shipping</span>
                <span className={shippingCost === 0 ? "text-secondary" : ""}>
                  {shippingCost === 0 ? "Free" : formatNaira(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between pt-4 border-t border-outline-variant/10">
                <span className="text-label-caps uppercase tracking-widest text-primary font-body">
                  Total
                </span>
                <span className="font-display text-headline-md text-primary">
                  {formatNaira(total)}
                </span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="order-1 lg:order-2 bg-surface-container-low p-8 lg:p-12">
            <h2 className="font-display text-headline-md text-primary mb-8">Secure Checkout</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {user && savedAddresses.length > 0 && (
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-on-surface-variant mb-2 font-body">
                    Saved Address
                  </label>
                  <div className="space-y-2">
                    {savedAddresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                          selectedAddressId === addr.id
                            ? "border-secondary bg-secondary/5"
                            : "border-outline-variant hover:border-primary"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 mt-0.5 ${
                            selectedAddressId === addr.id
                              ? "border-secondary bg-secondary"
                              : "border-outline-variant"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-body text-primary">{addr.label}</p>
                          <p className="text-xs text-on-surface-variant font-body">{addr.street}, {addr.city}, {addr.state}</p>
                        </div>
                        <input
                          type="radio"
                          name="savedAddress"
                          className="sr-only"
                          checked={selectedAddressId === addr.id}
                          onChange={() => {
                            setSelectedAddressId(addr.id);
                            setForm((prev) => ({
                              ...prev,
                              street: addr.street,
                              city: addr.city,
                              state: addr.state,
                            }));
                          }}
                        />
                      </label>
                    ))}
                    <label
                      className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
                        selectedAddressId === ""
                          ? "border-secondary bg-secondary/5"
                          : "border-outline-variant hover:border-primary"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          selectedAddressId === "" ? "border-secondary bg-secondary" : "border-outline-variant"
                        }`}
                      />
                      <span className="text-sm font-body text-primary">Enter a new address</span>
                      <input
                        type="radio"
                        name="savedAddress"
                        className="sr-only"
                        checked={selectedAddressId === ""}
                        onChange={() => setSelectedAddressId("")}
                      />
                    </label>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-on-surface-variant mb-2 font-body">
                  Contact Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors font-body"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-on-surface-variant mb-2 font-body">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors font-body"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-on-surface-variant mb-2 font-body">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors font-body placeholder:text-on-surface-variant/50"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-on-surface-variant mb-4 font-body">
                  Shipping Address
                </label>
                <div className="space-y-4">
                  <input
                    type="text"
                    required
                    value={form.street}
                    onChange={(e) => updateField("street", e.target.value)}
                    placeholder="Street Address"
                    className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors font-body placeholder:text-on-surface-variant/50"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={form.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors font-body"
                    >
                      <option>Lagos</option>
                      <option>Abuja</option>
                      <option>Port Harcourt</option>
                      <option>Ibadan</option>
                      <option>Kano</option>
                      <option>Enugu</option>
                    </select>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
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
                  <label
                    className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                      form.deliveryMethod === "standard"
                        ? "border-secondary bg-secondary/5"
                        : "border-outline-variant hover:border-primary"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          form.deliveryMethod === "standard"
                            ? "border-secondary bg-secondary"
                            : "border-outline-variant"
                        }`}
                      />
                      <span className="text-sm font-body">Standard Delivery</span>
                    </div>
                    <span className="text-sm text-secondary font-body">Free</span>
                    <input
                      type="radio"
                      name="delivery"
                      className="sr-only"
                      checked={form.deliveryMethod === "standard"}
                      onChange={() => updateField("deliveryMethod", "standard")}
                    />
                  </label>
                  <label
                    className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                      form.deliveryMethod === "express"
                        ? "border-secondary bg-secondary/5"
                        : "border-outline-variant hover:border-primary"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          form.deliveryMethod === "express"
                            ? "border-secondary bg-secondary"
                            : "border-outline-variant"
                        }`}
                      />
                      <span className="text-sm font-body">Luxe Express (Next Day)</span>
                    </div>
                    <span className="text-sm font-body">₦15,000</span>
                    <input
                      type="radio"
                      name="delivery"
                      className="sr-only"
                      checked={form.deliveryMethod === "express"}
                      onChange={() => updateField("deliveryMethod", "express")}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-on-surface-variant mb-4 font-body">
                  Payment Method
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => updateField("paymentMethod", "paystack")}
                    className={`flex-1 py-3 text-sm font-body transition-colors ${
                      form.paymentMethod === "paystack"
                        ? "border-2 border-secondary bg-secondary/5"
                        : "border border-outline-variant hover:border-primary"
                    }`}
                  >
                    Paystack
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField("paymentMethod", "flutterwave")}
                    className={`flex-1 py-3 text-sm font-body transition-colors ${
                      form.paymentMethod === "flutterwave"
                        ? "border-2 border-secondary bg-secondary/5"
                        : "border border-outline-variant hover:border-primary"
                    }`}
                  >
                    Flutterwave
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-luxury-navy text-champagne-gold py-5 text-label-caps uppercase tracking-widest hover:bg-champagne-gold hover:text-luxury-navy transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Place Order →</>
                )}
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
      </div>
    </div>
  );
}
