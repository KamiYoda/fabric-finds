import { createFileRoute } from "@tanstack/react-router";
import { OrderAcknowledgePage } from "@/features/orders";

export const Route = createFileRoute("/dashboard/orders/$orderId/acknowledge")({
  component: AcknowledgeRoute,
});

function AcknowledgeRoute() {
  const { orderId } = Route.useParams();
  return <OrderAcknowledgePage orderId={orderId} />;
}
