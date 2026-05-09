import { Link } from "react-router-dom";

export default function CheckoutPage() {
  return (
    <div className="pt-[160px] pb-section">
      <div className="max-w-container mx-auto px-margin">
        <h1 className="font-display text-headline-lg text-primary mb-12">Checkout</h1>
        <div className="text-center py-20">
          <p className="text-on-surface-variant text-body-lg mb-8">
            Checkout functionality coming soon
          </p>
          <Link
            to="/cart"
            className="bg-secondary text-on-secondary px-10 py-4 text-label-caps uppercase tracking-widest hover:bg-secondary-container transition-colors inline-block"
          >
            Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
