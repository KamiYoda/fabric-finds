import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Truck, MessageCircle, Info } from "lucide-react";
import { Button } from "@/components/Button";
import { useMerchantCart } from "../CartContext";

interface Props {
  orderRef: string;
  deliveryFee?: number;
  awaitingFee?: boolean;
}

export function MerchantOrderReviewPage({
  orderRef,
  deliveryFee,
  awaitingFee = false,
}: Props) {
  const navigate = useNavigate();
  const { totalAmount } = useMerchantCart();

  const totalLabel = awaitingFee
    ? `₦${totalAmount.toLocaleString()} + delivery`
    : `₦${(totalAmount + (deliveryFee ?? 0)).toLocaleString()}`;

  return (
    <div className="mx-auto w-full max-w-md pb-32">
      <button
        onClick={() => navigate({ to: ".." as any })}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium"
      >
        <ArrowLeft size={16} /> Order {orderRef}
      </button>

      <div className="rounded-2xl bg-primary/5 p-4 text-sm text-primary">
        <div className="flex items-start gap-2">
          <Info size={18} className="mt-0.5 shrink-0" />
          <div>
            <div className="font-semibold mb-1">Delivery Information</div>
            <p className="text-foreground/80">
              Delivery is arranged directly with the merchant. Chat to agree on
              the delivery fee and timeline. We provide a recommended price as a
              guide, but the final cost is set between you and the merchant.
            </p>
          </div>
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
          <span className="text-muted-foreground">
            Delivery fee {awaitingFee ? "(estimated)" : ""}
          </span>
          <span className="font-semibold">
            {awaitingFee ? (
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <span className="rounded border border-border px-1.5 py-0.5 text-xs">
                  i
                </span>{" "}
                Chat with merchant
              </span>
            ) : (
              `₦${deliveryFee?.toLocaleString()}`
            )}
          </span>
        </div>
        <div className="my-2 border-t border-border" />
        <div className="flex items-center justify-between">
          <span className="text-sm">Total amount</span>
          <span className="font-bold text-primary">{totalLabel}</span>
        </div>
      </div>

      <Button
        variant="primary"
        onClick={() =>
          awaitingFee
            ? navigate({
                to: "/dashboard/merchants/order/$orderRef/chat" as any,
                params: { orderRef } as any,
              })
            : navigate({
                to: "/dashboard/merchants/order/$orderRef/pay" as any,
                params: { orderRef } as any,
              })
        }
        className="mt-8 w-full"
      >
        {awaitingFee ? (
          <>
            <MessageCircle size={16} /> Chat with merchant
          </>
        ) : (
          <>
            <Truck size={16} /> Continue to payment
          </>
        )}
      </Button>
    </div>
  );
}
