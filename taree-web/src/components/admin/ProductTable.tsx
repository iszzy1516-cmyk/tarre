import { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import type { Product } from "../../types";
import { formatNaira } from "../../lib/utils";
import { Badge } from "../ui/Badge";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onUpdateStock?: (id: string, stock: number) => void;
}

export function ProductTable({ products, onEdit, onDelete, onUpdateStock }: ProductTableProps) {
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [stockValue, setStockValue] = useState<string>("");

  const startEditStock = (product: Product) => {
    setEditingStockId(product.id);
    setStockValue(String(product.stockQuantity));
  };

  const cancelEditStock = () => {
    setEditingStockId(null);
    setStockValue("");
  };

  const saveStock = (id: string) => {
    const val = parseInt(stockValue, 10);
    if (!isNaN(val) && val >= 0 && onUpdateStock) {
      onUpdateStock(id, val);
    }
    setEditingStockId(null);
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-outline-variant/10">
            <th className="py-3 px-4 text-xs uppercase tracking-widest text-on-surface-variant font-body">Image</th>
            <th className="py-3 px-4 text-xs uppercase tracking-widest text-on-surface-variant font-body">Name</th>
            <th className="py-3 px-4 text-xs uppercase tracking-widest text-on-surface-variant font-body">SKU</th>
            <th className="py-3 px-4 text-xs uppercase tracking-widest text-on-surface-variant font-body">Price</th>
            <th className="py-3 px-4 text-xs uppercase tracking-widest text-on-surface-variant font-body">Stock</th>
            <th className="py-3 px-4 text-xs uppercase tracking-widest text-on-surface-variant font-body">Status</th>
            <th className="py-3 px-4 text-xs uppercase tracking-widest text-on-surface-variant font-body">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-outline-variant/5 hover:bg-surface-container/50">
              <td className="py-3 px-4">
                <img
                  src={product.images[0]?.url || "/images/placeholder.jpg"}
                  alt={product.name}
                  className="w-12 h-12 object-cover bg-surface-container-low"
                />
              </td>
              <td className="py-3 px-4 font-body text-sm text-primary">{product.name}</td>
              <td className="py-3 px-4 font-body text-sm text-on-surface-variant">{product.sku}</td>
              <td className="py-3 px-4 font-body text-sm text-primary">{formatNaira(product.price)}</td>
              <td className="py-3 px-4 font-body text-sm text-primary">
                {editingStockId === product.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={stockValue}
                      onChange={(e) => setStockValue(e.target.value)}
                      className="w-20 bg-transparent border border-outline-variant px-2 py-1 text-sm font-body outline-none focus:border-primary"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveStock(product.id);
                        if (e.key === "Escape") cancelEditStock();
                      }}
                    />
                    <button
                      onClick={() => saveStock(product.id)}
                      className="p-1 text-green-600 hover:text-green-700"
                      aria-label="Save stock"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      onClick={cancelEditStock}
                      className="p-1 text-error hover:text-error/80"
                      aria-label="Cancel"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEditStock(product)}
                    className="hover:text-secondary transition-colors"
                    title="Click to edit stock"
                  >
                    {product.stockQuantity}
                  </button>
                )}
              </td>
              <td className="py-3 px-4">
                <Badge variant={product.isActive ? "success" : "error"}>
                  {product.isActive ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="p-2 text-on-surface-variant hover:text-error transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
