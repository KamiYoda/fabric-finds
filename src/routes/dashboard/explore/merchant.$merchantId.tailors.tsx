import { createFileRoute } from "@tanstack/react-router";
import { MerchantSelectTailorPage } from "@/features/explore/pages/MerchantSelectTailorPage";

export const Route = createFileRoute(
  "/dashboard/explore/merchant/$merchantId/tailors",
)({
  component: MerchantSelectTailorPage,
});
