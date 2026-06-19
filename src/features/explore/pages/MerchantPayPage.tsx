import { memo, useMemo } from "react";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Plus, Truck, Info } from "lucide-react";
import { getWalletBalance } from "@/lib/api/wallet";
import {
  useFabricCart,
  cartTotal,
  clearCart,
} from "../cart/fabricCart";
import { formatNaira } from "../utils/formatNaira";

export const MerchantPayPage = memo(() => {
  const { merchantId } = useParams({ strict: false }) as { merchantId: string };
  const search = useSearch({ strict: false }) as { delivery?: number };
  const navigate = useNavigate();
  const cart = useFabricCart();
  const subtotal = cartTotal(cart.items);
  const delivery = search.delivery ?? 3500;
  const total = subtotal + delivery;
  const orderRef = useMemo(() => {
    const stamp = Math.floor(1000 + Math.random() * 9000);
    return `FM${stamp}-IDJS-2026-cta`;
  }, []);

  const { data: balance } = useQuery({
    queryKey: ["wallet-balance"],
    queryFn: () => getWalletBalance().catch(() => null),
    staleTime: 30_000,
  });
  const wallet = balance?.available_balance ?? 40000;

  return (
    <div className="mx-auto w-full max-w-2xl pb-24">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate({ to: ".." as any })}
          className="rounded-full p-2 hover:bg-muted"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display text-lg font-bold">Order {orderRef}</h1>
      </div>

      {/* Wallet balance — card */}
      <div className="mt-5 w-full flex items-center justify-between rounded-3xl border border-border bg-card p-4 shadow-soft">
        <div>
          <div className="text-xs font-medium text-muted-foreground">
            Wallet Balance
          </div>
          <div className="mt-1 font-display text-xl font-bold">
            {formatNaira(wallet)}
          </div>
        </div>
        <button
          onClick={() => navigate({ to: "/dashboard/wallet/topup" as any })}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
        >
          <Plus size={12} /> Add
        </button>
      </div>

      {/* Order summary — card */}
      <div className="mt-4 w-full rounded-3xl border border-border bg-card p-5 shadow-soft">
        <h2 className="font-display text-base font-semibold mb-4">Order summary</h2>
        <dl className="space-y-3 text-sm">
          <Row label="Fabric materials" value={formatNaira(subtotal)} />
          <Row label="Delivery fee" value={formatNaira(delivery)} icon={<Info size={12} />} />
          <Row
            label="Estimated delivery timeline"
            value={
              <span className="flex items-center gap-1 text-primary">
                <Truck size={12} /> 2 days
              </span>
            }
          />
          <div className="border-t border-dashed border-border" />
          <Row
            label="Total amount"
            value={
              <span className="font-display font-bold text-primary">
                {formatNaira(total)}
              </span>
            }
          />
        </dl>

        {wallet < total && (
          <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-xs font-medium text-destructive">
            Insufficient wallet balance. Please top up to continue.
          </p>
        )}
      </div>

      <button
        disabled={wallet < total}
        onClick={() => {
          clearCart();
          navigate({
            to: "/dashboard/explore/merchant/$merchantId/success" as any,
            params: { merchantId } as any,
            search: { ref: orderRef } as any,
          });
        }}
        className="mt-6 w-full rounded-2xl border-2 border-dashed border-primary-foreground/30 bg-primary py-3.5 font-semibold text-primary-foreground disabled:bg-primary/40"
      >
        Pay NGN {new Intl.NumberFormat("en-NG").format(total)}.00
      </button>
    </div>
  );
});
MerchantPayPage.displayName = "MerchantPayPage";

function Row({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="flex items-center gap-1.5 font-medium">
        {icon}
        {value}
      </dd>
    </div>
  );
}
