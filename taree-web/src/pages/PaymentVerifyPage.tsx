import { useEffect, useState } from "react";
import { useSEO } from "../hooks/useSEO";
import { useSearchParams, Link } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../lib/api";

export default function PaymentVerifyPage() {
  useSEO("Verifying Payment | TAREÉ Jewelry", "Please wait while we verify your payment.");
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [message, setMessage] = useState("Verifying your payment...");

  const reference = searchParams.get("reference") || searchParams.get("trxref");

  useEffect(() => {
    if (!reference) {
      setStatus("failed");
      setMessage("No payment reference found.");
      return;
    }

    const verify = async () => {
      try {
        const { data } = await api.post("/payments/verify", { reference });
        if (data.status === "success") {
          setStatus("success");
          setMessage("Your payment was successful! Thank you for your order.");
        } else {
          setStatus("failed");
          setMessage("Payment verification failed. Please contact support if you were charged.");
        }
      } catch (err: any) {
        setStatus("failed");
        setMessage(err.response?.data?.detail || "Could not verify payment. Please try again.");
      }
    };

    verify();
  }, [reference]);

  return (
    <div className="pt-[160px] pb-section min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md mx-auto px-margin text-center">
        {status === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <Loader2 className="w-12 h-12 text-secondary animate-spin" />
            <h1 className="font-display text-headline-md text-primary">{message}</h1>
            <p className="text-on-surface-variant font-body text-sm">
              Please do not close this window.
            </p>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <CheckCircle2 className="w-16 h-16 text-green-600" />
            <h1 className="font-display text-headline-md text-primary">Payment Successful</h1>
            <p className="text-on-surface-variant font-body">{message}</p>
            <div className="flex gap-4 mt-4">
              <Link
                to="/products"
                className="bg-secondary text-on-secondary px-8 py-3 text-label-caps uppercase tracking-widest hover:bg-secondary-container transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                to="/orders"
                className="border border-primary text-primary px-8 py-3 text-label-caps uppercase tracking-widest hover:bg-primary hover:text-white transition-colors"
              >
                View Orders
              </Link>
            </div>
          </motion.div>
        )}

        {status === "failed" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <XCircle className="w-16 h-16 text-error" />
            <h1 className="font-display text-headline-md text-primary">Payment Failed</h1>
            <p className="text-on-surface-variant font-body">{message}</p>
            <div className="flex gap-4 mt-4">
              <Link
                to="/cart"
                className="bg-secondary text-on-secondary px-8 py-3 text-label-caps uppercase tracking-widest hover:bg-secondary-container transition-colors"
              >
                Back to Cart
              </Link>
              <Link
                to="/contact"
                className="border border-primary text-primary px-8 py-3 text-label-caps uppercase tracking-widest hover:bg-primary hover:text-white transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
