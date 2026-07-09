import { TrendingUp, Package, Clock, Users } from "lucide-react";
import { formatNaira, formatNumber } from "../../lib/utils";

interface DashboardStatsProps {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    pendingOrders: number;
    totalCustomers: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const cards = [
    {
      label: "Total Revenue",
      value: formatNaira(stats.totalRevenue),
      icon: TrendingUp,
      accent: "text-success",
    },
    {
      label: "Total Orders",
      value: formatNumber(stats.totalOrders),
      icon: Package,
      accent: "text-primary",
    },
    {
      label: "Pending Orders",
      value: formatNumber(stats.pendingOrders),
      icon: Clock,
      accent: "text-warning",
    },
    {
      label: "Customers",
      value: formatNumber(stats.totalCustomers),
      icon: Users,
      accent: "text-secondary",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-surface-container p-6 border border-outline-variant/10"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-on-surface-variant font-body">
                {card.label}
              </span>
              <Icon className={`w-5 h-5 ${card.accent}`} />
            </div>
            <p className="font-display text-headline-md text-primary">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
}
