import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import WhatsAppFloat from "./components/layout/WhatsAppFloat";
import CartDrawer from "./components/cart/CartDrawer";
import AppRoutes from "./routes";
import { useAuthStore } from "./stores/authStore";
import ToastContainer from "./components/ui/ToastContainer";
import ErrorBoundary from "./components/ui/ErrorBoundary";

export default function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith("/manage");

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        {!isAdminRoute && <Navbar />}
        <main className="flex-1">
          <AppRoutes />
        </main>
        {!isAdminRoute && <Footer />}
        {!isAdminRoute && <CartDrawer />}
        {!isAdminRoute && <WhatsAppFloat />}
        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
}
