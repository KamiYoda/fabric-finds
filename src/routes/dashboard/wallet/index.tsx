import { WalletPage } from "@/features/wallet";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/dashboard/wallet/")({
  component: WalletPage,
});
