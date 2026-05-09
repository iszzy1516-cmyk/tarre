import { User, MapPin, CreditCard } from "lucide-react";

export default function AccountPage() {
  return (
    <div className="pt-[160px] pb-section">
      <div className="max-w-container mx-auto px-margin">
        <h1 className="font-display text-headline-lg text-primary mb-12">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface-container-low p-8">
            <User className="w-8 h-8 text-secondary mb-4" />
            <h3 className="font-display text-body-lg text-primary mb-2">Profile</h3>
            <p className="text-on-surface-variant text-sm font-body">Manage your personal information</p>
          </div>

          <div className="bg-surface-container-low p-8">
            <MapPin className="w-8 h-8 text-secondary mb-4" />
            <h3 className="font-display text-body-lg text-primary mb-2">Addresses</h3>
            <p className="text-on-surface-variant text-sm font-body">Manage shipping addresses</p>
          </div>

          <div className="bg-surface-container-low p-8">
            <CreditCard className="w-8 h-8 text-secondary mb-4" />
            <h3 className="font-display text-body-lg text-primary mb-2">Orders</h3>
            <p className="text-on-surface-variant text-sm font-body">View order history</p>
          </div>
        </div>
      </div>
    </div>
  );
}
