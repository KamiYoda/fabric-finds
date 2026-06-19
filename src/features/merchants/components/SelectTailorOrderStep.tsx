import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Truck, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/Button";
import { listPendingTailorOrders } from "../api/mockMerchants";
import { useMerchantCart } from "../CartContext";
import type { PendingTailorOrder } from "../types";

interface Props {
  onBack: () => void;
  onContinue: (orderId: string, totalFee: number) => void;
}

export function SelectTailorOrderStep({ onBack, onContinue }: Props) {
  const { items, totalAmount } = useMerchantCart();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFees, setShowFees] = useState(false);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["pending-tailor-orders"],
    queryFn: listPendingTailorOrders,
  });

  const selected = orders.find((o) => o.id === selectedId);

  return (
    <div className="mx-auto w-full max-w-md">
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium"
      >
        <ArrowLeft size={16} /> Explore
      </button>

      <div className="overflow-hidden rounded-2xl bg-foreground/40 text-card">
        <div className="flex gap-2 p-3">
          {items.slice(0, 3).map((i) => (
            <img
              key={i.fabricId}
              src={i.image}
              alt={i.name}
              className="h-14 w-14 rounded-lg object-cover"
            />
          ))}
          <div className="ml-auto flex items-center gap-1 self-center text-sm font-medium">
            {items.length} item{items.length === 1 ? "" : "s"}
            <button className="ml-3 underline">View selections</button>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            <Loader2 size={16} className="mr-2 animate-spin" /> Loading…
          </div>
        ) : (
          orders.map((o: PendingTailorOrder) => {
            const active = o.id === selectedId;
            return (
              <button
                key={o.id}
                onClick={() => {
                  setSelectedId(o.id);
                  setShowFees(true);
                }}
                className={`w-full rounded-2xl border-2 bg-card p-4 text-left transition-all ${
                  active ? "border-primary" : "border-transparent bg-muted/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{o.title}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={o.tailorAvatar}
                        alt={o.tailorName}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <span className="text-sm text-muted-foreground">
                        {o.tailorName}
                      </span>
                      <span className="flex-1 border-b border-dashed border-border" />
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <Truck size={12} /> Est delivery
                      <span className="ml-auto font-semibold text-primary">
                        {showFees && active && o.estDeliveryFee
                          ? `₦${o.estDeliveryFee.toLocaleString()}`
                          : o.estDeliveryDays}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <div className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <MapPin size={10} /> {o.distanceKm}km apart
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      <Button
        variant="primary"
        disabled={!selected}
        onClick={() =>
          selected &&
          onContinue(
            selected.id,
            totalAmount + (selected.estDeliveryFee ?? 0),
          )
        }
        className={
          "mt-10 w-full" + (selected ? "" : " cursor-not-allowed opacity-50")
        }
      >
        Continue
      </Button>
    </div>
  );
}
