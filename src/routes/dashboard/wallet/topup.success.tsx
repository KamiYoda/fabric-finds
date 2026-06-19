import { WalletSuccessPage } from "@/features/wallet";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/wallet/topup/success")({
  component: () => <WalletSuccessPage />,
  validateSearch: (s) => ({ message: s.message as string | undefined }),
});
