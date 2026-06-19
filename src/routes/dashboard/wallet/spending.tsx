import { SpendingPage } from "@/features/wallet";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/wallet/spending")({
  component: SpendingPage,
});

