import { Link, useNavigate } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "../stores/authStore";

export default function LoginPage() {
  useSEO("Login | TAREÉ Jewelry", "Sign in to your TAREÉ Jewelry account.");
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/account");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed. Please try again.");
    }
  };

  return (
    <div className="pt-[160px] pb-section min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-margin">
        <div className="text-center mb-12">
          <h1 className="font-display text-headline-lg text-primary mb-4">Welcome Back</h1>
          <p className="text-on-surface-variant font-body">Sign in to your TAREÉ account</p>
        </div>

        {error && (
          <div className="bg-error/10 text-error px-4 py-3 mb-6 text-sm font-body">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-label-caps text-on-surface-variant mb-2 uppercase tracking-widest font-body">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors font-body"
              required
            />
          </div>

          <div>
            <label className="block text-label-caps text-on-surface-variant mb-2 uppercase tracking-widest font-body">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors font-body"
              required
            />
          </div>

          <div className="flex justify-between items-center text-sm font-body">
            <label className="flex items-center gap-2 text-on-surface-variant">
              <input type="checkbox" className="accent-secondary" />
              Remember me
            </label>
            <Link to="#" className="text-secondary hover:text-primary transition-colors">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-luxury-navy text-champagne-gold py-4 text-label-caps uppercase tracking-widest hover:bg-champagne-gold hover:text-luxury-navy transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-on-surface-variant font-body">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-secondary hover:text-primary transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
