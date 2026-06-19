import { createFileRoute } from "@tanstack/react-router";
import { OrderRatePage } from "@/features/orders";

export const Route = createFileRoute("/dashboard/orders/$orderId/rate")({
  component: RateRoute,
});

function RateRoute() {
  const { orderId } = Route.useParams();
  return <OrderRatePage orderId={orderId} />;
}
