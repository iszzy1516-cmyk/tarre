import { cn } from "../../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-body text-primary">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full bg-surface-container border border-outline-variant text-primary px-4 py-3 text-sm font-body placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary transition-colors",
          error && "border-error",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-error font-body">{error}</p>
      )}
    </div>
  );
}
