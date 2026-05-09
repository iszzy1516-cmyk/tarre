import { formatNaira } from "../lib/utils";

const orders = [
  {
    id: "TAREE-2026-00001",
    date: "2026-05-01",
    status: "Delivered",
    total: 280000,
    items: 1,
  },
];

export default function OrderHistoryPage() {
  return (
    <div className="pt-[160px] pb-section">
      <div className="max-w-container mx-auto px-margin">
        <h1 className="font-display text-headline-lg text-primary mb-12">Order History</h1>

        {orders.length === 0 ? (
          <p className="text-on-surface-variant text-body-lg">No orders yet</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-surface-container-low p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <p className="font-display text-body-lg text-primary">{order.id}</p>
                  <p className="text-on-surface-variant text-sm font-body">{order.date}</p>
                </div>
                <div className="flex items-center gap-8">
                  <span className="text-secondary font-body">{order.items} item(s)</span>
                  <span className="font-display text-primary">{formatNaira(order.total)}</span>
                  <span className="text-label-caps text-[10px] uppercase tracking-widest bg-secondary/10 text-secondary px-3 py-1 font-body">
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
