import { createFileRoute } from "@tanstack/react-router";
import { MerchantChatPage } from "@/features/explore/pages/MerchantChatPage";

export const Route = createFileRoute(
  "/dashboard/explore/merchant/$merchantId/chat",
)({
  component: MerchantChatPage,
  validateSearch: (s: Record<string, unknown>) => ({
    orderId: typeof s.orderId === "string" ? s.orderId : undefined,
  }),
});
