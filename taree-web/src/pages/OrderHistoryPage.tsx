import { useQuery } from "@tanstack/react-query";
import { useSEO } from "../hooks/useSEO";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { formatNaira } from "../lib/utils";
import { api } from "../lib/api";
import type { Order } from "../types";

async function fetchOrders(): Promise<Order[]> {
  const { data } = await api.get("/orders");
  return data.map((o: any) => ({
    id: o.id,
    orderNumber: o.order_number,
    status: o.status,
    paymentStatus: o.payment_status,
    total: o.total,
    subtotal: o.subtotal,
    shippingCost: o.shipping_cost,
    items: o.items.map((item: any) => ({
      id: item.id,
      productName: item.product_name,
      productImage: item.product_image,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      totalPrice: item.total_price,
    })),
    createdAt: o.created_at,
  }));
}

export default function OrderHistoryPage() {
  useSEO("Order History | TAREÉ Jewelry", "View your past orders and track shipments.");
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  return (
    <div className="pt-[160px] pb-section">
      <div className="max-w-container mx-auto px-margin">
        <h1 className="font-display text-headline-lg text-primary mb-12">Order History</h1>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-secondary animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-on-surface-variant font-body mb-4">Please sign in to view your orders.</p>
            <Link to="/login" className="bg-secondary text-on-secondary px-8 py-3 text-label-caps uppercase tracking-widest hover:bg-secondary-container transition-colors inline-block">
              Sign In
            </Link>
          </div>
        ) : orders?.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-on-surface-variant text-body-lg mb-8">No orders yet</p>
            <Link to="/products" className="bg-secondary text-on-secondary px-10 py-4 text-label-caps uppercase tracking-widest hover:bg-secondary-container transition-colors inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders?.map((order) => (
              <div
                key={order.id}
                className="bg-surface-container-low p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <p className="font-display text-body-lg text-primary">{order.orderNumber}</p>
                  <p className="text-on-surface-variant text-sm font-body">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-on-surface-variant font-body mt-1">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)
                  </p>
                </div>
                <div className="flex items-center gap-8">
                  <span className="font-display text-primary">{formatNaira(order.total)}</span>
                  <span className={`text-label-caps text-[10px] uppercase tracking-widest px-3 py-1 font-body ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "cancelled"
                      ? "bg-error/10 text-error"
                      : "bg-secondary/10 text-secondary"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
