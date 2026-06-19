import { Modal } from "@/components/modals/Modal";
import { Button } from "@/components/Button";
import { Send } from "lucide-react";
import { useMerchantCart } from "../CartContext";

interface Props {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export function CartSummaryModal({ open, onClose, onContinue }: Props) {
  const { items, merchant, totalAmount } = useMerchantCart();
  if (!merchant) return null;

  const names = items.map((i) => i.name).join(", ");

  return (
    <Modal open={open} onClose={onClose} size="md">
      <div className="flex items-center">
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          <Send size={20} />
        </div>
      </div>
      <h2 className="mt-3 font-display text-xl font-bold">Order fabric</h2>

      <div className="mt-5 overflow-hidden rounded-2xl bg-muted/60">
        <div className="flex gap-2 p-3">
          {items.slice(0, 4).map((i) => (
            <img
              key={i.fabricId}
              src={i.image}
              className="h-20 w-20 rounded-xl object-cover"
              alt={i.name}
            />
          ))}
        </div>
        <div className="bg-foreground/40 px-4 py-2.5 text-sm text-card">
          <div className="font-semibold">
            {items.length} item{items.length === 1 ? "" : "s"}
          </div>
          <div className="line-clamp-1 text-xs opacity-90">{names}</div>
        </div>
      </div>

      <Button
        variant="primary"
        onClick={onContinue}
        className="mt-8 w-full"
      >
        Order ₦{totalAmount.toLocaleString()}
      </Button>
    </Modal>
  );
}
