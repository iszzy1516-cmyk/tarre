import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, MessageSquare, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { useAuthStore } from "../../stores/authStore";

const navItems = [
  { path: "/manage", label: "Dashboard", icon: LayoutDashboard },
  { path: "/manage/products", label: "Products", icon: Package },
  { path: "/manage/orders", label: "Orders", icon: ShoppingCart },
  { path: "/manage/reviews", label: "Reviews", icon: MessageSquare },
];

export function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const handleLogout = async () => {
    console.log("[AdminLayout] logout clicked");
    await logout();
    navigate("/manage/login");
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-16 bg-surface border-b border-outline-variant/10 z-50 flex items-center justify-between px-4">
        <span className="font-display text-lg text-primary">TAREÉ Admin</span>
        <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-primary" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen w-64 bg-surface-container border-r border-outline-variant/10 z-40 transition-transform duration-300 lg:translate-x-0 flex flex-col",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6">
          <Link to="/" className="font-display text-xl text-primary hidden lg:block">
            TAREÉ Admin
          </Link>
        </div>
        <nav className="px-4 space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || (item.path !== "/manage" && pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-body transition-colors rounded",
                  isActive
                    ? "bg-luxury-navy text-champagne-gold"
                    : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-outline-variant/10 space-y-3">
          <div className="px-4 text-xs text-on-surface-variant font-body truncate">
            {user?.firstName} {user?.lastName}
            <span className="block text-[10px] uppercase tracking-wider opacity-60">{user?.role}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-sm font-body text-error rounded hover:bg-error/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 pt-20 lg:p-6 lg:pt-6 overflow-x-auto">
        <Outlet />
      </main>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}
