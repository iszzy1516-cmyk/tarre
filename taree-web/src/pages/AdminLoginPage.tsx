import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useToastStore } from "../stores/toastStore";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const addToast = useToastStore((s) => s.addToast);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      const user = useAuthStore.getState().user;
      if (user?.role === "admin" || user?.role === "superadmin") {
        navigate("/manage", { replace: true });
      } else {
        // Not an admin — log them out immediately
        await useAuthStore.getState().logout();
        addToast("Access denied", "error");
      }
    } catch {
      // Login error already toasted by authStore
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-luxury-navy text-champagne-gold">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="font-display text-2xl text-primary">Staff Access</h1>
          <p className="text-sm text-on-surface-variant font-body">
            Authorized personnel only
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-xs text-on-surface-variant font-body">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="underline hover:text-primary"
          >
            Return to store
          </button>
        </p>
      </div>
    </div>
  );
}
