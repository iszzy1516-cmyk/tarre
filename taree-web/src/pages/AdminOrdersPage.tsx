import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { OrderTable } from "../components/admin/OrderTable";
import { useToastStore } from "../stores/toastStore";
import type { Order } from "../types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/orders");
      setOrders(
        data.map((o: any) => ({
          id: o.id,
          orderNumber: o.order_number,
          status: o.status,
          paymentStatus: o.payment_status,
          total: o.total,
          createdAt: o.created_at,
        }))
      );
    } catch {
      addToast("Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
      addToast("Order status updated", "success");
      fetchOrders();
    } catch {
      addToast("Failed to update status", "error");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-surface-container rounded animate-pulse w-48" />
        <div className="h-64 bg-surface-container rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-primary">Orders</h1>
        <span className="text-sm text-on-surface-variant font-body">{orders.length} orders</span>
      </div>
      <OrderTable orders={orders} onStatusChange={handleStatusChange} />
    </div>
  );
}
