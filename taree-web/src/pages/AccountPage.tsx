import { Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import { User, MapPin, CreditCard, LogOut, Loader2 } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";

export default function AccountPage() {
  useSEO("My Account | TAREÉ Jewelry", "Manage your profile, addresses, and orders.");
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();

  if (isLoading) {
    return (
      <div className="pt-[160px] pb-section flex justify-center">
        <Loader2 className="w-8 h-8 text-secondary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="pt-[160px] pb-section max-w-container mx-auto px-margin text-center">
        <h1 className="font-display text-headline-lg text-primary mb-4">My Account</h1>
        <p className="text-on-surface-variant font-body mb-8">Please sign in to view your account.</p>
        <Link to="/login" className="bg-secondary text-on-secondary px-10 py-4 text-label-caps uppercase tracking-widest hover:bg-secondary-container transition-colors inline-block">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-[160px] pb-section">
      <div className="max-w-container mx-auto px-margin">
        <div className="flex items-center justify-between mb-12">
          <h1 className="font-display text-headline-lg text-primary">My Account</h1>
          <button
            onClick={() => { console.log("[AccountPage] logout clicked"); logout(); navigate("/"); }}
            className="flex items-center gap-2 text-sm text-error hover:text-primary transition-colors font-body"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-surface-container-low p-8">
            <User className="w-8 h-8 text-secondary mb-4" />
            <h3 className="font-display text-body-lg text-primary mb-2">Profile</h3>
            <div className="space-y-1 text-sm text-on-surface-variant font-body">
              <p><span className="text-primary">Name:</span> {user.firstName} {user.lastName}</p>
              <p><span className="text-primary">Email:</span> {user.email}</p>
              {user.phone && <p><span className="text-primary">Phone:</span> {user.phone}</p>}
            </div>
          </div>

          <div className="bg-surface-container-low p-8">
            <MapPin className="w-8 h-8 text-secondary mb-4" />
            <h3 className="font-display text-body-lg text-primary mb-2">Addresses</h3>
            <p className="text-on-surface-variant text-sm font-body mb-4">Manage your shipping addresses</p>
            <button className="text-secondary text-sm hover:text-primary transition-colors font-body">
              + Add New Address
            </button>
          </div>

          <Link to="/orders" className="bg-surface-container-low p-8 group hover:bg-surface-container transition-colors">
            <CreditCard className="w-8 h-8 text-secondary mb-4" />
            <h3 className="font-display text-body-lg text-primary mb-2 group-hover:text-secondary transition-colors">Orders</h3>
            <p className="text-on-surface-variant text-sm font-body">View order history and track shipments</p>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="border-t border-outline-variant/10 pt-8">
          <h2 className="font-display text-headline-sm text-primary mb-6">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/orders" className="bg-secondary text-on-secondary px-6 py-3 text-label-caps uppercase tracking-widest hover:bg-secondary-container transition-colors text-sm">
              View Orders
            </Link>
            <Link to="/products" className="border border-primary text-primary px-6 py-3 text-label-caps uppercase tracking-widest hover:bg-primary hover:text-white transition-colors text-sm">
              Continue Shopping
            </Link>
            <Link to="/wishlist" className="border border-outline-variant text-on-surface-variant px-6 py-3 text-label-caps uppercase tracking-widest hover:border-primary hover:text-primary transition-colors text-sm">
              My Wishlist
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
