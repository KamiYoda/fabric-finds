import { AddBankPage } from "@/features/wallet";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/wallet/withdraw/add-bank")({
  component: AddBankPage,
});
