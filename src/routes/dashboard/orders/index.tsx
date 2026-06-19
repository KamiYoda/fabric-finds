import { createFileRoute } from "@tanstack/react-router";
import { OrdersListPage } from "@/features/orders";

export const Route = createFileRoute("/dashboard/orders/")({
  component: OrdersListPage,
});
