import { memo } from "react";
import { ChevronDown, Plus, X } from "lucide-react";
import type { Fabric, CartItem } from "../types";

interface Props {
  fabric: Fabric;
  cartItem?: CartItem;
  onAdd: (fabric: Fabric) => void;
  onRemove?: (fabricId: string) => void;
  onEdit?: (fabric: Fabric) => void;
  onClick?: (fabric: Fabric) => void;
}

export const FabricRow = memo(
  ({ fabric, cartItem, onAdd, onRemove, onEdit, onClick }: Props) => {
    const inCart = !!cartItem;
    const totalPrice = cartItem
      ? cartItem.pricePerYard * cartItem.quantity
      : fabric.pricePerYard;

    return (
      <div className="flex items-start gap-3 py-3 border-b border-border last:border-b-0">
        <button
          onClick={() => onClick?.(fabric)}
          className="shrink-0"
        >
          <img
            src={fabric.images[0]}
            alt={fabric.name}
            className="h-20 w-20 rounded-xl object-cover"
          />
        </button>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-sm">{fabric.name}</h4>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {fabric.description}
          </p>
          <div className="mt-2 flex items-center justify-between">
            {inCart ? (
              <span className="text-xs text-muted-foreground line-through">
                ₦{fabric.pricePerYard.toLocaleString()}/yard
              </span>
            ) : (
              <span className="text-sm font-semibold">
                ₦{fabric.pricePerYard.toLocaleString()}/yard
              </span>
            )}
            <div className="flex items-center gap-2">
              {inCart ? (
                <>
                  <button
                    onClick={() => onEdit?.(fabric)}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground"
                  >
                    ₦{totalPrice.toLocaleString()}{" "}
                    <ChevronDown size={14} />
                  </button>
                  <button
                    onClick={() => onRemove?.(fabric.id)}
                    className="rounded-md p-1 text-muted-foreground hover:text-destructive"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onAdd(fabric)}
                  disabled={!fabric.available}
                  className="inline-flex items-center gap-1 rounded-lg border border-primary px-3 py-1.5 text-sm font-semibold text-primary disabled:opacity-50"
                >
                  <Plus size={14} /> Add <ChevronDown size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

FabricRow.displayName = "FabricRow";
