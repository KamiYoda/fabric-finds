import { createFileRoute } from "@tanstack/react-router";
import { OrderFabricPage } from "@/features/orders";

export const Route = createFileRoute("/dashboard/orders/$orderId/fabric")({
  component: FabricRoute,
});

function FabricRoute() {
  const { orderId } = Route.useParams();
  return <OrderFabricPage orderId={orderId} />;
}
