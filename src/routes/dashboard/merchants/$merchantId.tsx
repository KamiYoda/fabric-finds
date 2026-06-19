import { createFileRoute } from "@tanstack/react-router";
import { MerchantProfilePage } from "@/features/merchants";

export const Route = createFileRoute("/dashboard/merchants/$merchantId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { merchantId } = Route.useParams();
  return <MerchantProfilePage merchantId={merchantId} />;
}
