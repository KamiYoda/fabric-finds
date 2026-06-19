import { createFileRoute } from "@tanstack/react-router";
import { MerchantPayPage } from "@/features/explore/pages/MerchantPayPage";

export const Route = createFileRoute(
  "/dashboard/explore/merchant/$merchantId/pay",
)({
  component: MerchantPayPage,
  validateSearch: (s: Record<string, unknown>) => ({
    delivery: typeof s.delivery === "number" ? s.delivery : undefined,
  }),
});
