import { createFileRoute } from "@tanstack/react-router";
import { OrderPaymentPage } from "@/features/orders";

export const Route = createFileRoute("/dashboard/orders/$orderId/pay")({
  component: PayRoute,
});

function PayRoute() {
  const { orderId } = Route.useParams();
  return <OrderPaymentPage orderId={orderId} />;
}
