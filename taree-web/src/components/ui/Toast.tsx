import { motion } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export function Toast({ message, type = "info", onClose }: ToastProps) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-success" />,
    error: <AlertCircle className="w-5 h-5 text-error" />,
    info: <Info className="w-5 h-5 text-secondary" />,
  };

  const bgColors = {
    success: "bg-success-container border-success",
    error: "bg-error-container border-error",
    info: "bg-surface-container border-secondary",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`flex items-center gap-3 px-4 py-3 rounded shadow-lg border ${bgColors[type]} min-w-[300px] max-w-md`}
    >
      {icons[type]}
      <span className="flex-1 text-sm font-body text-primary">{message}</span>
      <button onClick={onClose} className="text-on-surface-variant hover:text-primary">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
