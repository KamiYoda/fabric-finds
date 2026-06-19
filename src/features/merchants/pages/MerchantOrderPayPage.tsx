import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Plus, Truck } from "lucide-react";
import { Button } from "@/components/Button";
import { useMerchantCart } from "../CartContext";

interface Props {
  orderRef: string;
  deliveryFee: number;
  estimatedDays?: string;
}

export function MerchantOrderPayPage({
  orderRef,
  deliveryFee,
  estimatedDays = "2 days",
}: Props) {
  const navigate = useNavigate();
  const { totalAmount, clear } = useMerchantCart();
  const total = totalAmount + deliveryFee;

  const handlePay = () => {
    clear();
    navigate({
      to: "/dashboard/merchants/order/$orderRef/success" as any,
      params: { orderRef },
    });
  };

  return (
    <div className="mx-auto w-full max-w-md pb-32">
      <button
        onClick={() => navigate({ to: ".." as any })}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium"
      >
        <ArrowLeft size={16} /> Order {orderRef}
      </button>

      <div className="rounded-2xl bg-muted/60 p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Wallet Balance</div>
            <div className="mt-1 font-display text-2xl font-bold">₦40,000</div>
          </div>
          <button className="inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Fabric materials</span>
          <span className="font-semibold">
            ₦{totalAmount.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Delivery fee</span>
          <span className="inline-flex items-center gap-1 font-semibold">
            <span className="rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground">
              i
            </span>
            ₦{deliveryFee.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Estimated delivery timeline
          </span>
          <span className="inline-flex items-center gap-1 font-semibold">
            <Truck size={12} /> {estimatedDays}
          </span>
        </div>
        <div className="my-2 border-t border-border" />
        <div className="flex items-center justify-between">
          <span className="text-sm">Total amount</span>
          <span className="font-bold text-primary">
            ₦{total.toLocaleString()}
          </span>
        </div>
      </div>

      <Button variant="primary" onClick={handlePay} className="mt-8 w-full">
        Pay NGN {total.toLocaleString()}.00
      </Button>
    </div>
  );
}
