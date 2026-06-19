import { createFileRoute } from "@tanstack/react-router";
import { MerchantOrderReviewPage } from "@/features/explore/pages/MerchantOrderReviewPage";

export const Route = createFileRoute(
  "/dashboard/explore/merchant/$merchantId/review",
)({
  component: MerchantOrderReviewPage,
});
