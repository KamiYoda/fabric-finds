import { createFileRoute } from "@tanstack/react-router";
import { MerchantOrderReviewPage } from "@/features/merchants";

export const Route = createFileRoute("/dashboard/merchants/order/$orderRef/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { orderRef } = Route.useParams();
  // Awaiting fee state by default; user chats with merchant first
  return <MerchantOrderReviewPage orderRef={orderRef} awaitingFee />;
}
