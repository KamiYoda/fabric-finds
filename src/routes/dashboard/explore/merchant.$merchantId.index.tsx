import { createFileRoute } from "@tanstack/react-router";
import { MerchantDetailPage } from "@/features/explore/pages/MerchantDetailPage";

export const Route = createFileRoute("/dashboard/explore/merchant/$merchantId/")({
  component: MerchantDetailPage,
});
