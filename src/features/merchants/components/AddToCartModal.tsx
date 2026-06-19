import { useState, useEffect } from "react";
import { Modal } from "@/components/modals/Modal";
import { Button } from "@/components/Button";
import { ChevronDown, Minus, Plus, ShoppingCart } from "lucide-react";
import type { Fabric, CartItem } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  fabric?: Fabric;
  existingItem?: CartItem;
  onConfirm: (variantId: string, quantity: number) => void;
}

export function AddToCartModal({
  open,
  onClose,
  fabric,
  existingItem,
  onConfirm,
}: Props) {
  const [variantId, setVariantId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [unitOpen, setUnitOpen] = useState(false);

  useEffect(() => {
    if (fabric) {
      setVariantId(existingItem?.variantId ?? fabric.variants[0]?.id ?? "");
      setQuantity(existingItem?.quantity ?? 1);
    }
  }, [fabric, existingItem]);

  if (!fabric) return null;

  const total = fabric.pricePerYard * quantity;

  return (
    <Modal open={open} onClose={onClose} size="md">
      <div className="flex items-center justify-center">
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          <ShoppingCart size={20} />
        </div>
      </div>
      <h2 className="mt-3 font-display text-xl font-bold">Add to cart</h2>

      {/* Variant selection */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {fabric.variants.map((v) => {
          const active = v.id === variantId;
          return (
            <button
              key={v.id}
              onClick={() => setVariantId(v.id)}
              className={`overflow-hidden rounded-2xl border-2 text-left transition-all ${
                active ? "border-primary" : "border-transparent bg-muted"
              }`}
            >
              <div className="aspect-square">
                <img
                  src={v.image}
                  alt={v.label}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="bg-card px-2 py-1.5 text-center text-xs font-medium">
                {v.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Quantity */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <button
          onClick={() => setUnitOpen((o) => !o)}
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground"
        >
          {fabric.unit} <ChevronDown size={14} />
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-10 w-10 rounded-lg border border-border text-muted-foreground"
          >
            <Minus size={16} className="mx-auto" />
          </button>
          <span className="min-w-8 text-center text-xl font-bold">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="h-10 w-10 rounded-lg border border-border text-muted-foreground"
          >
            <Plus size={16} className="mx-auto" />
          </button>
        </div>
      </div>

      <Button
        variant="primary"
        onClick={() => onConfirm(variantId, quantity)}
        disabled={!variantId}
        className="mt-8 w-full"
      >
        {existingItem ? "Update" : "Add"} ₦{total.toLocaleString()}
      </Button>
    </Modal>
  );
}
