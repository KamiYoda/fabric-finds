import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  SelectTailorOrderStep,
  useMerchantCart,
} from "@/features/merchants";
import { createFabricOrder } from "@/features/merchants/api/mockMerchants";

export const Route = createFileRoute(
  "/dashboard/merchants/order/select-tailor",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const cart = useMerchantCart();

  return (
    <SelectTailorOrderStep
      onBack={() => navigate({ to: ".." as any })}
      onContinue={async (tailorOrderId) => {
        if (!cart.merchant) return;
        const res = await createFabricOrder({
          merchantId: cart.merchant.id,
          items: cart.items.map((i) => ({
            fabricId: i.fabricId,
            variantId: i.variantId,
            quantity: i.quantity,
            unit: i.unit,
          })),
          delivery: { mode: "tailor", tailorOrderId },
        });
        navigate({
          to: "/dashboard/merchants/order/$orderRef" as any,
          params: { orderRef: res.id },
        });
      }}
    />
  );
}
