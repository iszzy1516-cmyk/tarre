import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import WishlistPage from "./pages/WishlistPage";
import OurStoryPage from "./pages/OurStoryPage";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";
import PaymentVerifyPage from "./pages/PaymentVerifyPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentFailedPage from "./pages/PaymentFailedPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminRoute } from "./components/admin/AdminRoute";
import { Skeleton } from "./components/ui/Skeleton";

// Lazy-load admin pages for code splitting
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const AdminProductsPage = lazy(() => import("./pages/AdminProductsPage"));
const AdminOrdersPage = lazy(() => import("./pages/AdminOrdersPage"));
const AdminReviewsPage = lazy(() => import("./pages/AdminReviewsPage"));

function AdminFallback() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton height="40px" />
      <Skeleton height="400px" />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:slug" element={<ProductDetailPage />} />
      <Route path="/categories/:slug" element={<CategoryPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/payment/verify" element={<PaymentVerifyPage />} />
      <Route path="/payment/success" element={<PaymentSuccessPage />} />
      <Route path="/payment/failed" element={<PaymentFailedPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/orders" element={<OrderHistoryPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/our-story" element={<OurStoryPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/blog" element={<BlogPage />} />

      {/* Hidden admin entrypoint — not linked anywhere on the customer site */}
      <Route path="/manage/login" element={<AdminLoginPage />} />
      <Route path="/manage" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<Suspense fallback={<AdminFallback />}><AdminDashboardPage /></Suspense>} />
        <Route path="products" element={<Suspense fallback={<AdminFallback />}><AdminProductsPage /></Suspense>} />
        <Route path="orders" element={<Suspense fallback={<AdminFallback />}><AdminOrdersPage /></Suspense>} />
        <Route path="reviews" element={<Suspense fallback={<AdminFallback />}><AdminReviewsPage /></Suspense>} />
      </Route>
    </Routes>
  );
}
