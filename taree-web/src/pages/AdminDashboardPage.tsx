import { BarChart3, Package, ShoppingBag, Users } from "lucide-react";
import { formatNaira } from "../lib/utils";

const stats = [
  { label: "Total Revenue", value: formatNaira(2450000), icon: BarChart3 },
  { label: "Orders", value: "48", icon: ShoppingBag },
  { label: "Products", value: "124", icon: Package },
  { label: "Customers", value: "356", icon: Users },
];

const recentOrders = [
  { id: "TAREE-2026-00048", customer: "Amara Okafor", total: 280000, status: "Processing" },
  { id: "TAREE-2026-00047", customer: "Chioma Adeleke", total: 450000, status: "Pending" },
];

export default function AdminDashboardPage() {
  return (
    <div className="pt-[160px] pb-section">
      <div className="max-w-container mx-auto px-margin">
        <h1 className="font-display text-headline-lg text-primary mb-12">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-surface-container-low p-6">
              <stat.icon className="w-8 h-8 text-secondary mb-4" />
              <p className="text-on-surface-variant text-sm font-body mb-1">{stat.label}</p>
              <p className="font-display text-headline-md text-primary">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-surface-container-low p-8">
          <h2 className="font-display text-headline-md text-primary mb-6">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant/10">
                  <th className="text-left text-label-caps text-on-surface-variant uppercase tracking-widest py-4 font-body">
                    Order
                  </th>
                  <th className="text-left text-label-caps text-on-surface-variant uppercase tracking-widest py-4 font-body">
                    Customer
                  </th>
                  <th className="text-left text-label-caps text-on-surface-variant uppercase tracking-widest py-4 font-body">
                    Total
                  </th>
                  <th className="text-left text-label-caps text-on-surface-variant uppercase tracking-widest py-4 font-body">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-outline-variant/10">
                    <td className="py-4 font-body text-primary">{order.id}</td>
                    <td className="py-4 font-body text-on-surface-variant">{order.customer}</td>
                    <td className="py-4 font-body text-primary">{formatNaira(order.total)}</td>
                    <td className="py-4">
                      <span className="text-label-caps text-[10px] uppercase tracking-widest bg-secondary/10 text-secondary px-3 py-1 font-body">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
