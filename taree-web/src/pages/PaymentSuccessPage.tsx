import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, ShoppingBag, FileText } from "lucide-react";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  useEffect(() => {
    document.title = "Payment Successful | TAREÉ Jewelry";
  }, []);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto w-20 h-20 bg-success-container rounded-full flex items-center justify-center"
        >
          <CheckCircle className="w-10 h-10 text-success" />
        </motion.div>

        <div className="space-y-3">
          <h1 className="font-display text-headline-lg text-primary">Payment Successful</h1>
          <p className="text-on-surface-variant font-body">
            Thank you for your purchase. Your order has been confirmed and is being processed.
          </p>
          {reference && (
            <p className="text-sm text-on-surface-variant font-body">
              Reference: <span className="text-primary font-medium">{reference}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/products"
            className="flex-1 bg-luxury-navy text-champagne-gold py-4 text-label-caps uppercase tracking-widest text-center hover:bg-champagne-gold hover:text-luxury-navy transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
          <Link
            to="/orders"
            className="flex-1 border border-outline-variant text-primary py-4 text-label-caps uppercase tracking-widest text-center hover:bg-surface-container transition-all duration-300 flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            View Orders
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
