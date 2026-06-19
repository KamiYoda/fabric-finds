import { memo, useState } from "react";
import { useNavigate, useParams, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Truck, Loader2 } from "lucide-react";
import { getOrders } from "@/lib/api/orders";
import { useFabricCart, cartItemCount } from "../cart/fabricCart";
import { formatNaira } from "../utils/formatNaira";

interface Pending {
  id: string;
  title: string;
  tailor_name?: string;
  tailor_avatar?: string;
  distance_km?: number;
  est_delivery_days?: [number, number];
  delivery_fee_estimate?: number;
}

const FALLBACK: Pending[] = [
  {
    id: "ord-1",
    title: "My siu style",
    tailor_name: "Freddy Han",
    tailor_avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=70",
    distance_km: 16,
    est_delivery_days: [2, 3],
    delivery_fee_estimate: 3500,
  },
  {
    id: "ord-2",
    title: "Aso Ebi",
    tailor_name: "Freddy Han",
    tailor_avatar:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=120&q=70",
    distance_km: 16,
    est_delivery_days: [1, 2],
    delivery_fee_estimate: 4000,
  },
];

export const MerchantSelectTailorPage = memo(() => {
  const { merchantId } = useParams({ strict: false }) as { merchantId: string };
  const navigate = useNavigate();
  const cart = useFabricCart();
  const itemsCount = cartItemCount(cart.items);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFees, setShowFees] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["pending-orders-for-merchant"],
    queryFn: () => getOrders({ status: "pending" }).catch(() => null),
    staleTime: 60_000,
  });

  const orders: Pending[] = Array.isArray(data) && data.length > 0
    ? data.map((o: any) => ({
        id: String(o.id ?? o.order_id),
        title: o.title ?? o.order_name ?? "Order",
        tailor_name: o.tailor_name ?? o.tailor?.name,
        tailor_avatar: o.tailor_avatar ?? o.tailor?.avatar,
        distance_km: o.distance_km ?? 16,
        est_delivery_days: o.est_delivery_days ?? [2, 3],
        delivery_fee_estimate: o.delivery_fee_estimate ?? 3500,
      }))
    : FALLBACK;

  return (
    <div className="mx-auto w-full max-w-2xl pb-32">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate({ to: ".." as any })}
          className="rounded-full p-2 hover:bg-muted"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display text-2xl font-bold">Explore</h1>
      </div>

      {/* Cart strip */}
      <Link
        to="/dashboard/explore/merchant/$merchantId/review"
        params={{ merchantId } as any}
        className="mt-5 flex w-full items-center gap-3 rounded-2xl bg-foreground/70 p-2 text-primary-foreground"
      >
        <div className="flex -space-x-2">
          {cart.items.slice(0, 2).map((i) => (
            <img
              key={i.productId + i.colorId}
              src={i.productImage}
              alt=""
              className="h-10 w-10 rounded-lg border-2 border-card object-cover"
            />
          ))}
        </div>
        <div className="flex-1 text-sm font-semibold">
          {itemsCount} item{itemsCount > 1 ? "s" : ""}
        </div>
        <span className="text-sm font-semibold underline-offset-2 hover:underline">
          View selections
        </span>
      </Link>

      {/* Order cards — in card container */}
      <div className="mt-5 w-full rounded-3xl border border-border bg-card p-4 shadow-soft">
        <h2 className="font-display text-base font-semibold mb-3">Select an order</h2>
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
              <Loader2 size={14} className="animate-spin" /> Loading orders…
            </div>
          ) : (
            orders.map((o) => {
              const active = selectedId === o.id;
              return (
                <button
                  key={o.id}
                  onClick={() => setSelectedId(o.id)}
                  className={`block w-full rounded-2xl border-2 p-4 text-left transition ${
                    active
                      ? "border-primary bg-primary/5"
                      : "border-transparent bg-muted/60"
                  }`}
                >
                  <div className="text-sm font-semibold">{o.title}</div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      {o.tailor_avatar && (
                        <img
                          src={o.tailor_avatar}
                          alt=""
                          className="h-7 w-7 rounded-full object-cover"
                        />
                      )}
                      <span className="truncate text-xs font-medium text-muted-foreground">
                        {o.tailor_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                      <MapPin size={11} /> {o.distance_km}km apart
                    </div>
                  </div>
                  <div className="mt-2 border-t border-dashed border-border pt-2 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Truck size={12} /> Est delivery
                    </span>
                    <span className="font-semibold text-primary">
                      {showFees
                        ? formatNaira(o.delivery_fee_estimate ?? 0)
                        : `${o.est_delivery_days?.[0]}-${o.est_delivery_days?.[1]} days`}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-2xl bg-gradient-to-t from-background to-transparent p-4">
        <button
          disabled={!selectedId}
          onClick={() => {
            if (!showFees) {
              setShowFees(true);
              return;
            }
            navigate({
              to: "/dashboard/explore/merchant/$merchantId/chat" as any,
              params: { merchantId } as any,
              search: { orderId: selectedId } as any,
            });
          }}
          className="w-full rounded-2xl border-2 border-dashed border-primary-foreground/30 bg-primary py-3.5 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:bg-primary/40"
        >
          Continue
        </button>
      </div>
    </div>
  );
});
MerchantSelectTailorPage.displayName = "MerchantSelectTailorPage";
