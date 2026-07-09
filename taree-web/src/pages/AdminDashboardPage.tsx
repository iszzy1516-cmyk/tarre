import { useState } from "react";
import { useSEO } from "../hooks/useSEO";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  Users,
  Loader2,
  CheckCircle2,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Truck,
} from "lucide-react";
import { api } from "../lib/api";
import { formatNaira } from "../lib/utils";
import { useToastStore } from "../stores/toastStore";

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total: number;
  shipping_address: Record<string, string> | null;
  items: { product_name: string; quantity: number; total_price: number }[];
  user: { first_name: string; last_name: string; email: string } | null;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
  category: { name: string };
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  user: { first_name: string; last_name: string };
  created_at: string;
}

async function fetchStats() {
  const { data } = await api.get("/admin/stats");
  return data;
}

async function fetchOrders(status?: string): Promise<Order[]> {
  const { data } = await api.get("/admin/orders", { params: { status, limit: 50 } });
  return data;
}

async function fetchProducts(): Promise<Product[]> {
  const { data } = await api.get("/admin/products");
  return data;
}

async function fetchReviews(): Promise<Review[]> {
  const { data } = await api.get("/admin/reviews", { params: { approved: false } });
  return data;
}

export default function AdminDashboardPage() {
  useSEO("Admin Dashboard | TAREÉ Jewelry", "Manage orders, products, and reviews.");
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "products" | "reviews">("overview");
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const addToast = useToastStore((s) => s.addToast);

  const { data: stats, isLoading: loadingStats } = useQuery({ queryKey: ["admin", "stats"], queryFn: fetchStats });
  const { data: orders, isLoading: loadingOrders, refetch: refetchOrders } = useQuery({
    queryKey: ["admin", "orders", orderStatusFilter],
    queryFn: () => fetchOrders(orderStatusFilter),
  });
  const { data: products, isLoading: loadingProducts } = useQuery({ queryKey: ["admin", "products"], queryFn: fetchProducts });
  const { data: reviews, isLoading: loadingReviews, refetch: refetchReviews } = useQuery({
    queryKey: ["admin", "reviews"],
    queryFn: fetchReviews,
  });

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
      addToast("Order updated", "success");
      refetchOrders();
    } catch (err: any) {
      addToast(err.response?.data?.detail || "Failed to update order", "error");
    }
  };

  const approveReview = async (id: string) => {
    try {
      await api.patch(`/admin/reviews/${id}/approve`);
      addToast("Review approved", "success");
      refetchReviews();
    } catch (err: any) {
      addToast(err.response?.data?.detail || "Failed to approve review", "error");
    }
  };

  return (
    <div className="pt-[140px] pb-section">
      <div className="max-w-container mx-auto px-margin">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-headline-lg text-primary">Admin Dashboard</h1>
          <Link to="/" className="text-sm text-on-surface-variant hover:text-primary transition-colors font-body">
            Back to Store
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-outline-variant/10 mb-8">
          {(["overview", "orders", "products", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-label-caps uppercase tracking-widest transition-colors ${
                activeTab === tab ? "text-secondary border-b-2 border-secondary" : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div>
            {loadingStats ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-secondary animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-surface-container-low p-6">
                  <DollarSign className="w-8 h-8 text-secondary mb-4" />
                  <p className="text-sm text-on-surface-variant font-body mb-1">Total Revenue</p>
                  <p className="font-display text-headline-md text-primary">{formatNaira(stats?.total_revenue || 0)}</p>
                </div>
                <div className="bg-surface-container-low p-6">
                  <TrendingUp className="w-8 h-8 text-secondary mb-4" />
                  <p className="text-sm text-on-surface-variant font-body mb-1">Revenue Today</p>
                  <p className="font-display text-headline-md text-primary">{formatNaira(stats?.revenue_today || 0)}</p>
                </div>
                <div className="bg-surface-container-low p-6">
                  <Calendar className="w-8 h-8 text-secondary mb-4" />
                  <p className="text-sm text-on-surface-variant font-body mb-1">Revenue This Month</p>
                  <p className="font-display text-headline-md text-primary">{formatNaira(stats?.revenue_month || 0)}</p>
                </div>
                <div className="bg-surface-container-low p-6">
                  <Calendar className="w-8 h-8 text-secondary mb-4" />
                  <p className="text-sm text-on-surface-variant font-body mb-1">Revenue This Year</p>
                  <p className="font-display text-headline-md text-primary">{formatNaira(stats?.revenue_year || 0)}</p>
                </div>
                <div className="bg-surface-container-low p-6">
                  <ShoppingBag className="w-8 h-8 text-secondary mb-4" />
                  <p className="text-sm text-on-surface-variant font-body mb-1">Total Orders</p>
                  <p className="font-display text-headline-md text-primary">{stats?.total_orders || 0}</p>
                </div>
                <div className="bg-surface-container-low p-6">
                  <Clock className="w-8 h-8 text-secondary mb-4" />
                  <p className="text-sm text-on-surface-variant font-body mb-1">Pending Orders</p>
                  <p className="font-display text-headline-md text-primary">{stats?.pending_orders || 0}</p>
                </div>
                <div className="bg-surface-container-low p-6">
                  <Truck className="w-8 h-8 text-secondary mb-4" />
                  <p className="text-sm text-on-surface-variant font-body mb-1">Shipped Orders</p>
                  <p className="font-display text-headline-md text-primary">{stats?.shipped_orders || 0}</p>
                </div>
                <div className="bg-surface-container-low p-6">
                  <Users className="w-8 h-8 text-secondary mb-4" />
                  <p className="text-sm text-on-surface-variant font-body mb-1">Customers</p>
                  <p className="font-display text-headline-md text-primary">{stats?.total_customers || 0}</p>
                </div>
                <div className="bg-surface-container-low p-6">
                  <AlertTriangle className="w-8 h-8 text-error mb-4" />
                  <p className="text-sm text-on-surface-variant font-body mb-1">Low Stock Items</p>
                  <p className="font-display text-headline-md text-primary">{stats?.low_stock || 0}</p>
                </div>
              </div>
            )}

            {/* Recent Orders Preview */}
            <h2 className="font-display text-headline-sm text-primary mb-6">Recent Orders</h2>
            {loadingOrders ? (
              <Loader2 className="w-6 h-6 text-secondary animate-spin" />
            ) : (
              <div className="bg-surface-container-low overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-outline-variant/10">
                      <th className="p-4 text-[11px] uppercase tracking-widest text-on-surface-variant font-body">Order</th>
                      <th className="p-4 text-[11px] uppercase tracking-widest text-on-surface-variant font-body">Customer</th>
                      <th className="p-4 text-[11px] uppercase tracking-widest text-on-surface-variant font-body">Total</th>
                      <th className="p-4 text-[11px] uppercase tracking-widest text-on-surface-variant font-body">Status</th>
                      <th className="p-4 text-[11px] uppercase tracking-widest text-on-surface-variant font-body">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders?.slice(0, 5).map((order) => (
                      <tr key={order.id} className="border-b border-outline-variant/5 hover:bg-surface-container transition-colors">
                        <td className="p-4 font-display text-sm text-primary">{order.order_number}</td>
                        <td className="p-4 text-sm text-on-surface-variant font-body">
                          {order.user ? `${order.user.first_name} ${order.user.last_name}` : (order.shipping_address?.full_name || order.shipping_address?.email || "Guest")}
                        </td>
                        <td className="p-4 font-display text-sm text-primary">{formatNaira(order.total)}</td>
                        <td className="p-4">
                          <span className={`text-[10px] uppercase tracking-widest px-2 py-1 font-body ${
                            order.status === "delivered" ? "bg-green-100 text-green-700" :
                            order.status === "pending" ? "bg-secondary/10 text-secondary" :
                            order.status === "cancelled" ? "bg-error/10 text-error" :
                            "bg-primary/10 text-primary"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-on-surface-variant font-body">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-transparent border border-outline-variant px-4 py-2 text-sm font-body outline-none focus:border-primary"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            {loadingOrders ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-secondary animate-spin" />
              </div>
            ) : (
              <div className="bg-surface-container-low overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-outline-variant/10">
                      <th className="p-4 text-[11px] uppercase tracking-widest text-on-surface-variant font-body">Order</th>
                      <th className="p-4 text-[11px] uppercase tracking-widest text-on-surface-variant font-body">Items</th>
                      <th className="p-4 text-[11px] uppercase tracking-widest text-on-surface-variant font-body">Total</th>
                      <th className="p-4 text-[11px] uppercase tracking-widest text-on-surface-variant font-body">Status</th>
                      <th className="p-4 text-[11px] uppercase tracking-widest text-on-surface-variant font-body">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders?.map((order) => (
                      <tr key={order.id} className="border-b border-outline-variant/5 hover:bg-surface-container transition-colors">
                        <td className="p-4">
                          <p className="font-display text-sm text-primary">{order.order_number}</p>
                          <p className="text-xs text-on-surface-variant font-body">{order.user?.email || order.shipping_address?.email || "Guest"}</p>
                        </td>
                        <td className="p-4 text-sm text-on-surface-variant font-body">
                          {order.items?.map((item) => `${item.quantity}x ${item.product_name}`).join(", ")}
                        </td>
                        <td className="p-4 font-display text-sm text-primary">{formatNaira(order.total)}</td>
                        <td className="p-4">
                          <span className={`text-[10px] uppercase tracking-widest px-2 py-1 font-body ${
                            order.status === "delivered" ? "bg-green-100 text-green-700" :
                            order.status === "pending" ? "bg-secondary/10 text-secondary" :
                            order.status === "cancelled" ? "bg-error/10 text-error" :
                            "bg-primary/10 text-primary"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="bg-transparent border border-outline-variant px-3 py-1 text-sm font-body outline-none focus:border-primary"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Products */}
        {activeTab === "products" && (
          <div>
            {loadingProducts ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-secondary animate-spin" />
              </div>
            ) : (
              <div className="bg-surface-container-low overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-outline-variant/10">
                      <th className="p-4 text-[11px] uppercase tracking-widest text-on-surface-variant font-body">Product</th>
                      <th className="p-4 text-[11px] uppercase tracking-widest text-on-surface-variant font-body">Category</th>
                      <th className="p-4 text-[11px] uppercase tracking-widest text-on-surface-variant font-body">Price</th>
                      <th className="p-4 text-[11px] uppercase tracking-widest text-on-surface-variant font-body">Stock</th>
                      <th className="p-4 text-[11px] uppercase tracking-widest text-on-surface-variant font-body">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products?.map((product) => (
                      <tr key={product.id} className="border-b border-outline-variant/5 hover:bg-surface-container transition-colors">
                        <td className="p-4">
                          <p className="font-display text-sm text-primary">{product.name}</p>
                          <p className="text-xs text-on-surface-variant font-body">{product.slug}</p>
                        </td>
                        <td className="p-4 text-sm text-on-surface-variant font-body">{product.category?.name}</td>
                        <td className="p-4 font-display text-sm text-primary">{formatNaira(product.price)}</td>
                        <td className="p-4 text-sm text-on-surface-variant font-body">{product.stock_quantity}</td>
                        <td className="p-4">
                          <span className={`text-[10px] uppercase tracking-widest px-2 py-1 font-body ${
                            product.is_active ? "bg-green-100 text-green-700" : "bg-error/10 text-error"
                          }`}>
                            {product.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Reviews */}
        {activeTab === "reviews" && (
          <div>
            {loadingReviews ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-secondary animate-spin" />
              </div>
            ) : reviews?.length === 0 ? (
              <p className="text-on-surface-variant font-body text-center py-20">No pending reviews</p>
            ) : (
              <div className="space-y-4">
                {reviews?.map((review) => (
                  <div key={review.id} className="bg-surface-container-low p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-display text-body text-primary">
                          {review.user?.first_name} {review.user?.last_name}
                        </p>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={`text-sm ${i < review.rating ? "text-secondary" : "text-outline-variant"}`}>★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-on-surface-variant font-body">{review.comment}</p>
                      <p className="text-xs text-on-surface-variant mt-2 font-body">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => approveReview(review.id)}
                      className="flex items-center gap-2 bg-secondary text-on-secondary px-4 py-2 text-sm hover:bg-secondary-container transition-colors font-body"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
