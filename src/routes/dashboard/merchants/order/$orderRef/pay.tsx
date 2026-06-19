import { createFileRoute } from "@tanstack/react-router";
import { MerchantOrderPayPage } from "@/features/merchants";

export const Route = createFileRoute(
  "/dashboard/merchants/order/$orderRef/pay",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { orderRef } = Route.useParams();
  return (
    <MerchantOrderPayPage
      orderRef={orderRef}
      deliveryFee={3500}
      estimatedDays="2 days"
    />
  );
}
