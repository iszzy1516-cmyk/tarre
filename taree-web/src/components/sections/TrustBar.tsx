import { Gem, ShieldCheck, Truck, Headphones } from "lucide-react";

const trustItems = [
  {
    icon: Gem,
    label: "Premium Craftsmanship",
  },
  {
    icon: ShieldCheck,
    label: "2-Year Warranty",
  },
  {
    icon: Truck,
    label: "Nationwide Delivery",
  },
  {
    icon: Headphones,
    label: "24/7 Customer Care",
  },
];

export default function TrustBar() {
  return (
    <section className="bg-surface-container-low py-16">
      <div className="max-w-container mx-auto px-margin">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {trustItems.map((item) => (
            <div key={item.label} className="flex flex-col items-center text-center space-y-3">
              <item.icon className="w-8 h-8 text-secondary" strokeWidth={1.5} />
              <h4 className="text-label-caps uppercase">{item.label}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
