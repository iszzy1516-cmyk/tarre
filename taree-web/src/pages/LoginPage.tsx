import { Link } from "react-router-dom";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="pt-[160px] pb-section min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-margin">
        <div className="text-center mb-12">
          <h1 className="font-display text-headline-lg text-primary mb-4">Welcome Back</h1>
          <p className="text-on-surface-variant font-body">Sign in to your TAREÉ account</p>
        </div>

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
            className="w-full bg-luxury-navy text-champagne-gold py-4 text-label-caps uppercase tracking-widest hover:bg-champagne-gold hover:text-luxury-navy transition-all duration-300"
          >
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-on-surface-variant font-body">
          Don't have an account?{" "}
          <Link to="/register" className="text-secondary hover:text-primary transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
