import { createFileRoute } from "@tanstack/react-router";
import { MerchantOrderSuccessPage } from "@/features/merchants";

export const Route = createFileRoute(
  "/dashboard/merchants/order/$orderRef/success",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { orderRef } = Route.useParams();
  return <MerchantOrderSuccessPage orderRef={orderRef} />;
}
