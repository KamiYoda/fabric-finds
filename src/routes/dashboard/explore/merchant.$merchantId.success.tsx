import { createFileRoute } from "@tanstack/react-router";
import { MerchantOrderSuccessPage } from "@/features/explore/pages/MerchantOrderSuccessPage";

export const Route = createFileRoute(
  "/dashboard/explore/merchant/$merchantId/success",
)({
  component: MerchantOrderSuccessPage,
  validateSearch: (s: Record<string, unknown>) => ({
    ref: typeof s.ref === "string" ? s.ref : undefined,
  }),
});
