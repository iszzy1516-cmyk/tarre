import { Link } from "react-router-dom";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="pt-[160px] pb-section min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-margin">
        <div className="text-center mb-12">
          <h1 className="font-display text-headline-lg text-primary mb-4">Join the Circle</h1>
          <p className="text-on-surface-variant font-body">Create your TAREÉ account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label-caps text-on-surface-variant mb-2 uppercase tracking-widest font-body">
                First Name
              </label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors font-body"
                required
              />
            </div>
            <div>
              <label className="block text-label-caps text-on-surface-variant mb-2 uppercase tracking-widest font-body">
                Last Name
              </label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors font-body"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-label-caps text-on-surface-variant mb-2 uppercase tracking-widest font-body">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
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
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors font-body"
              required
            />
          </div>

          <div>
            <label className="block text-label-caps text-on-surface-variant mb-2 uppercase tracking-widest font-body">
              Confirm Password
            </label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors font-body"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-luxury-navy text-champagne-gold py-4 text-label-caps uppercase tracking-widest hover:bg-champagne-gold hover:text-luxury-navy transition-all duration-300"
          >
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-on-surface-variant font-body">
          Already have an account?{" "}
          <Link to="/login" className="text-secondary hover:text-primary transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
