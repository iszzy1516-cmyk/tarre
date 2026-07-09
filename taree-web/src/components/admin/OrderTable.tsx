import type { Order } from "../../types";
import { formatNaira } from "../../lib/utils";
import { Badge } from "../ui/Badge";

interface OrderTableProps {
  orders: Order[];
  onStatusChange: (id: string, status: string) => void;
}

const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"];

export function OrderTable({ orders, onStatusChange }: OrderTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-outline-variant/10">
            <th className="py-3 px-4 text-xs uppercase tracking-widest text-on-surface-variant font-body">Order #</th>
            <th className="py-3 px-4 text-xs uppercase tracking-widest text-on-surface-variant font-body">Date</th>
            <th className="py-3 px-4 text-xs uppercase tracking-widest text-on-surface-variant font-body">Total</th>
            <th className="py-3 px-4 text-xs uppercase tracking-widest text-on-surface-variant font-body">Status</th>
            <th className="py-3 px-4 text-xs uppercase tracking-widest text-on-surface-variant font-body">Payment</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-outline-variant/5 hover:bg-surface-container/50">
              <td className="py-3 px-4 font-body text-sm text-primary">{order.orderNumber}</td>
              <td className="py-3 px-4 font-body text-sm text-on-surface-variant">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-4 font-body text-sm text-primary">{formatNaira(order.total)}</td>
              <td className="py-3 px-4">
                <select
                  value={order.status}
                  onChange={(e) => onStatusChange(order.id, e.target.value)}
                  className="bg-surface-container border border-outline-variant text-sm font-body text-primary px-2 py-1"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-3 px-4">
                <Badge variant={order.paymentStatus === "paid" ? "success" : order.paymentStatus === "failed" ? "error" : "warning"}>
                  {order.paymentStatus}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
