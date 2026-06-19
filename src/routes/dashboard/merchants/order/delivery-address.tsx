import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/Button";
import { useMerchantCart } from "@/features/merchants";
import { createFabricOrder } from "@/features/merchants/api/mockMerchants";

export const Route = createFileRoute(
  "/dashboard/merchants/order/delivery-address",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const cart = useMerchantCart();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");

  const valid = address && phone && region;

  const handleContinue = async () => {
    if (!cart.merchant || !valid) return;
    const res = await createFabricOrder({
      merchantId: cart.merchant.id,
      items: cart.items.map((i) => ({
        fabricId: i.fabricId,
        variantId: i.variantId,
        quantity: i.quantity,
        unit: i.unit,
      })),
      delivery: { mode: "self", address, phone },
    });
    navigate({
      to: "/dashboard/merchants/order/$orderRef" as any,
      params: { orderRef: res.id } as any,
    });
  };

  return (
    <div className="mx-auto w-full max-w-md pb-32">
      <button
        onClick={() => navigate({ to: ".." as any })}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium"
      >
        <ArrowLeft size={16} /> Delivery address
      </button>

      <div className="flex items-center gap-2">
        <MapPin size={18} />
        <h2 className="font-display text-xl font-bold">Where should we ship?</h2>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Street address
          </label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="h-12 w-full rounded-xl border-2 border-primary/40 bg-card px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Region / City</label>
          <input
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="h-12 w-full rounded-xl border-2 border-primary/40 bg-card px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Phone number
          </label>
          <input
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value.replace(/[^\d+\s]/g, ""))
            }
            className="h-12 w-full rounded-xl border-2 border-primary/40 bg-card px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>
      </div>

      <Button
        variant="primary"
        onClick={handleContinue}
        disabled={!valid}
        className={"mt-8 w-full" + (valid ? "" : " cursor-not-allowed opacity-50")}
      >
        Continue
      </Button>
    </div>
  );
}
