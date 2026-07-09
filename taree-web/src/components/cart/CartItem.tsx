import { X, Minus, Plus } from "lucide-react";
import type { CartItem as CartItemType } from "../../types";
import { formatNaira } from "../../lib/utils";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex gap-4">
      <img
        src={item.product.images[0]?.url || "/images/placeholder.jpg"}
        alt={item.product.name}
        className="w-20 h-20 object-cover bg-surface-container-low"
      />
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-display text-sm text-primary">{item.product.name}</h3>
          <button
            onClick={() => onRemove(item.id)}
            className="text-on-surface-variant hover:text-error transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {item.variant && (
          <p className="text-xs text-on-surface-variant mb-2 font-body">{item.variant.name}</p>
        )}
        <div className="flex justify-between items-center">
          <div className="flex items-center border border-outline-variant">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="px-2 py-1 hover:bg-surface-container transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2 py-1 text-sm font-body">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="px-2 py-1 hover:bg-surface-container transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <span className="font-body text-primary">
            {formatNaira(item.product.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
