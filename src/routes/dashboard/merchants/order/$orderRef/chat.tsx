import { createFileRoute } from "@tanstack/react-router";
import { MerchantChatPage } from "@/features/merchants";

export const Route = createFileRoute(
  "/dashboard/merchants/order/$orderRef/chat",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { orderRef } = Route.useParams();
  return <MerchantChatPage orderRef={orderRef} confirmedFee={3500} />;
}
