import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Clock, MessageSquare } from "lucide-react";
import { Modal } from "@/components/modals/Modal";
import { getOrder } from "@/lib/api/orders";
import {
  type ApiOrder,
  tailorDisplayName,
  tailorAvatar,
  formatAmount,
} from "../types";

interface OrderSummaryProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
}

export const OrderSummary = memo(
  ({ open, onClose, orderId }: OrderSummaryProps) => {
    const { data, isLoading, isError } = useQuery({
      queryKey: ["order", orderId],
      queryFn: async () => {
        const res = await getOrder(orderId);
        const order: ApiOrder = res?.data ?? res;
        return order;
      },
      enabled: open && Boolean(orderId),
      staleTime: 1000 * 30,
    });

    const tailorName = tailorDisplayName(data?.tailor ?? null);
    const avatar = tailorAvatar(data?.tailor ?? null);
    const total = formatAmount(data?.total_amount ?? data?.proposed_amount);
    const eta =
      data?.estimated_timeline_days != null
        ? `${data.estimated_timeline_days} days`
        : "— —";

    return (
      <Modal open={open} onClose={onClose} title="Order summary" size="md">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
            <Loader2 size={16} className="animate-spin" /> Loading…
          </div>
        ) : isError || !data ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Failed to load order details.
          </div>
        ) : (
          <div className="space-y-4">
            {/* Reference photos */}
            {data.style_reference_photos.length > 0 ? (
              <div className="flex gap-2">
                {data.style_reference_photos.slice(0, 2).map((url, i) => (
                  <div
                    key={i}
                    className="h-24 w-20 shrink-0 rounded-xl bg-cover bg-center"
                    style={{ backgroundImage: `url('${url}')` }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="h-24 w-20 shrink-0 rounded-xl bg-gradient-to-br from-accent/30 to-primary/20" />
                <div className="h-24 w-20 shrink-0 rounded-xl bg-gradient-to-br from-muted to-secondary" />
              </div>
            )}

            {/* Title + order number */}
            <div>
              <h3 className="font-display text-lg font-semibold">
                {data.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Order: {data.order_number}
              </p>
              {data.outfit_category && (
                <p className="text-xs text-muted-foreground">
                  {data.outfit_category.name}
                  {data.outfit_style ? ` — ${data.outfit_style.name}` : ""}
                </p>
              )}
            </div>

            {/* Tailor info */}
            <div className="flex items-center gap-3 rounded-2xl bg-muted/60 p-3">
              {avatar ? (
                <img
                  src={avatar}
                  alt={tailorName}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent/40 to-primary/30 text-sm font-bold text-primary-foreground">
                  {tailorName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div className="font-semibold">{tailorName}</div>
                <div className="text-sm text-muted-foreground">
                  {data.tailor?.shop_name ?? data.region ?? "—"}
                </div>
              </div>
            </div>

            {/* Style details */}
            {data.style_details && data.style_details.length > 0 && (
              <div className="rounded-2xl bg-muted/40 px-4 py-3 text-sm">
                <div className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                  Style details
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.style_details.map((d) => (
                    <span
                      key={d.id}
                      className="rounded-full bg-card px-3 py-1 text-xs border border-border"
                    >
                      {d.attribute}: {d.value}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>
                  {formatAmount(data.subtotal ?? data.proposed_amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fabric</span>
                <span>
                  {data.fabric_provider === "customer"
                    ? "I'll provide"
                    : "Tailor provides"}
                </span>
              </div>
              <div className="border-t border-border pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{total}</span>
                </div>
              </div>
            </div>

            {/* Meta */}
            <div className="flex items-center justify-between rounded-2xl bg-muted/60 px-4 py-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock size={14} />
                <span>ETA: {eta}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageSquare size={14} />
                <span>{data.status}</span>
              </div>
            </div>

            {/* Delivery */}
            {data.delivery_address && (
              <div className="text-xs text-muted-foreground">
                Delivery: {data.delivery_address}, {data.region}
              </div>
            )}

            {/* Notes */}
            {data.notes_for_tailor && (
              <div className="rounded-2xl bg-muted/40 px-4 py-3 text-sm">
                <div className="text-xs font-semibold text-muted-foreground">
                  Notes for tailor
                </div>
                <p className="mt-1 text-sm">{data.notes_for_tailor}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    );
  },
);

OrderSummary.displayName = "OrderSummary";
