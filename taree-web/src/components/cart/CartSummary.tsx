import { Link } from "react-router-dom";
import type { CartItem } from "../../types";
import { formatNaira } from "../../lib/utils";

interface CartSummaryProps {
  items: CartItem[];
  onCheckout?: () => void;
}

export function CartSummary({ items, onCheckout }: CartSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 50000 ? 0 : 2500;
  const total = subtotal + shipping;

  return (
    <div className="bg-surface-container p-6 space-y-4">
      <h3 className="font-display text-headline-sm text-primary">Order Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-body">
          <span className="text-on-surface-variant">Subtotal</span>
          <span className="text-primary">{formatNaira(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm font-body">
          <span className="text-on-surface-variant">Shipping</span>
          <span className="text-primary">
            {shipping === 0 ? "Free" : formatNaira(shipping)}
          </span>
        </div>
        <div className="border-t border-outline-variant/10 pt-2 flex justify-between">
          <span className="text-label-caps uppercase tracking-widest text-primary font-body">Total</span>
          <span className="font-display text-headline-md text-primary">{formatNaira(total)}</span>
        </div>
      </div>
      {onCheckout ? (
        <button
          onClick={onCheckout}
          className="block w-full bg-luxury-navy text-champagne-gold py-4 text-label-caps uppercase tracking-widest text-center hover:bg-champagne-gold hover:text-luxury-navy transition-all duration-300"
        >
          Proceed to Checkout
        </button>
      ) : (
        <Link
          to="/checkout"
          className="block w-full bg-luxury-navy text-champagne-gold py-4 text-label-caps uppercase tracking-widest text-center hover:bg-champagne-gold hover:text-luxury-navy transition-all duration-300"
        >
          Proceed to Checkout
        </Link>
      )}
      <p className="text-xs text-on-surface-variant font-body text-center">
        Shipping and taxes calculated at checkout
      </p>
    </div>
  );
}
