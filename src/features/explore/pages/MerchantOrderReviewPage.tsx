import { memo, useState } from "react";
import { useNavigate, useParams, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Send, MapPin } from "lucide-react";
import { getMerchant } from "../utils/mockFabricMerchants";
import {
  useFabricCart,
  cartTotal,
  cartItemCount,
} from "../cart/fabricCart";
import { formatNaira } from "../utils/formatNaira";

type DeliveryChoice = "tailor" | "self";

export const MerchantOrderReviewPage = memo(() => {
  const { merchantId } = useParams({ strict: false }) as { merchantId: string };
  const merchant = getMerchant(merchantId);
  const cart = useFabricCart();
  const navigate = useNavigate();
  const [choice, setChoice] = useState<DeliveryChoice | null>(null);
  const total = cartTotal(cart.items);
  const itemsCount = cartItemCount(cart.items);

  if (!merchant) return <NotFound />;
  if (itemsCount === 0) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        Your cart is empty.{" "}
        <Link to="/dashboard/explore" search={{ tab: "browse" }}>
          Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl pb-32">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate({ to: ".." as any })}
          className="rounded-full p-2 hover:bg-muted"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display text-2xl font-bold">Explore</h1>
      </div>

      {/* Cart summary card */}
      <div className="mt-5 w-full overflow-hidden rounded-3xl bg-card shadow-soft border border-border">
        <div className="grid grid-cols-3 gap-1 p-2">
          {cart.items.slice(0, 3).map((i) => (
            <div
              key={i.productId + i.colorId}
              className="aspect-[5/4] overflow-hidden rounded-2xl bg-muted"
            >
              <img
                src={i.productImage}
                alt={i.productName}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
        <div className="bg-foreground/70 px-4 py-3 text-primary-foreground">
          <div className="text-sm font-semibold">
            {itemsCount} item{itemsCount > 1 ? "s" : ""}
          </div>
          <div className="truncate text-xs text-primary-foreground/80">
            {cart.items.map((i) => i.productName).join(", ")}
          </div>
        </div>
      </div>

      {/* Delivery section — in card */}
      <div className="mt-5 w-full rounded-3xl border border-border bg-card p-5 shadow-soft">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Send size={18} />
        </div>
        <h2 className="mt-2 font-display text-xl font-bold">Order fabric</h2>

        <h3 className="mt-5 flex items-center gap-2 text-sm font-semibold">
          <MapPin size={16} className="text-primary" /> Delivery information
        </h3>

        <div className="mt-3 space-y-3">
          {(
            [
              {
                k: "tailor" as const,
                title: "Send to tailor",
                subtitle: "Choose a tailor from your pending orders",
              },
              {
                k: "self" as const,
                title: "Shop for self",
                subtitle: "Enter your delivery address",
              },
            ]
          ).map(({ k, title, subtitle }) => {
            const active = choice === k;
            return (
              <button
                key={k}
                onClick={() => setChoice(k)}
                className={`block w-full rounded-2xl border-2 p-4 text-left transition ${
                  active
                    ? "border-primary bg-primary/5"
                    : "border-transparent bg-muted/60"
                }`}
              >
                <div className="font-display text-sm font-semibold">{title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sticky CTA */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-2xl bg-gradient-to-t from-background to-transparent p-4"
      >
        <button
          disabled={!choice}
          onClick={() => {
            if (choice === "tailor") {
              navigate({
                to: "/dashboard/explore/merchant/$merchantId/tailors" as any,
                params: { merchantId } as any,
              });
            } else {
              navigate({
                to: "/dashboard/explore/merchant/$merchantId/chat" as any,
                params: { merchantId } as any,
              });
            }
          }}
          className="w-full rounded-2xl border-2 border-dashed border-primary-foreground/30 bg-primary py-3.5 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:bg-primary/40"
        >
          Continue · Order {formatNaira(total)}
        </button>
      </motion.div>
    </div>
  );
});
MerchantOrderReviewPage.displayName = "MerchantOrderReviewPage";

function NotFound() {
  return (
    <div className="py-16 text-center text-sm text-muted-foreground">
      Merchant not found.
    </div>
  );
}
