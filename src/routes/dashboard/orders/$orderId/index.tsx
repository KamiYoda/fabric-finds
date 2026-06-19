import { createFileRoute } from "@tanstack/react-router";
import { OrderDetailsPage } from "@/features/orders";

export const Route = createFileRoute("/dashboard/orders/$orderId/")({
  component: OrderDetailsRoute,
});

function OrderDetailsRoute() {
  const { orderId } = Route.useParams();
  return <OrderDetailsPage orderId={orderId} />;
}
