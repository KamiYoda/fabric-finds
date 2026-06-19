import { memo, useState, useCallback, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getOrders, deleteOrder } from "@/lib/api/orders";
import { Modal } from "@/components/modals/Modal";
import { Button } from "@/components/ui/button";
import {
  type ApiOrder,
  type OrderTab,
  statusToTab,
  orderProgress,
  orderProgressLabel,
  tailorDisplayName,
  tailorAvatar,
} from "../types";
import { DraftOrderCard } from "../components/DraftOrderCard";

const TABS: OrderTab[] = ["Pending", "Ongoing", "Completed", "Drafts"];

// ─── OrderCard ─────────────────────────────────────────────────────────────
const OrderCard = memo(
  ({
    order,
    onCancelled,
  }: {
    order: ApiOrder;
    onCancelled?: (id: string) => void;
  }) => {
    const tab = statusToTab(order.status);
    const isOngoing = tab === "Ongoing";
    const isCompleted = tab === "Completed";
    const progress = orderProgress(order.status);
    const progressLabel = orderProgressLabel(order.status);
    const name = tailorDisplayName(order.tailor);
    const avatar = tailorAvatar(order.tailor);

    const eta =
      order.estimated_timeline_days != null
        ? `${order.estimated_timeline_days} days`
        : "— —";

    // Cancellable iff: no accepted tailor AND status is draft/sent (not
    // completed/cancelled/closed)
    const cancellable =
      !order.tailor &&
      order.tailor_id == null &&
      (order.status === "draft" || order.status === "sent");

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const cancelledRef = useRef(false);

    const handleCancel = async () => {
      if (cancelledRef.current) return;
      cancelledRef.current = true;
      setIsCancelling(true);
      try {
        await deleteOrder(String(order.id));
        toast.success("Order cancelled");
        onCancelled?.(String(order.id));
      } catch {
        toast.error("Failed to cancel order. Please try again.");
        cancelledRef.current = false;
      } finally {
        setIsCancelling(false);
        setConfirmOpen(false);
      }
    };

    return (
      <>
        <div className="group relative rounded-2xl border border-border bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elegant">
          <Link
            to="/dashboard/orders/$orderId"
            params={{ orderId: order.id }}
            className="block"
          >
            <div className="flex items-center justify-between">
              <div className="font-display text-base font-semibold">
                {order.title}
              </div>
              <ChevronRight
                size={16}
                className="text-muted-foreground transition-transform group-hover:translate-x-0.5"
              />
            </div>

            <div className="mt-2 flex items-center gap-2.5">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent/40 to-primary/30 text-[10px] font-bold text-primary-foreground">
                  {name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-sm text-muted-foreground">{name}</div>
                <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground/80">
                  <Clock size={11} /> ETA — {eta}
                </div>
              </div>

              {isOngoing && progressLabel && (
                <span
                  className={`text-xs font-medium ${
                    progress >= 95
                      ? "text-success"
                      : progressLabel === "Started work"
                        ? "text-success"
                        : "text-amber-500"
                  }`}
                >
                  {progress >= 95 ? `${progress}%` : progressLabel}
                </span>
              )}
              {tab === "Pending" && (
                <span className="rounded-full bg-accent/30 px-2.5 py-1 text-[11px] font-medium text-primary">
                  Pending
                </span>
              )}
              {isCompleted && (
                <span className="rounded-full bg-success/15 px-2.5 py-1 text-[11px] font-medium text-success">
                  Completed
                </span>
              )}
            </div>

            {isOngoing && (
              <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    progress >= 95
                      ? "bg-success"
                      : progress >= 25
                        ? "bg-success"
                        : "bg-amber-500"
                  }`}
                />
                {[25, 50, 75].map((p) => (
                  <span
                    key={p}
                    className="absolute top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-card"
                    style={{ left: `${p}%` }}
                  />
                ))}
              </div>
            )}
          </Link>

          {cancellable && (
            <div className="mt-3 flex justify-end border-t border-border pt-3">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setConfirmOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                <XCircle size={12} /> Cancel order
              </button>
            </div>
          )}
        </div>

        <Modal
          open={confirmOpen}
          onClose={() => !isCancelling && setConfirmOpen(false)}
        >
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Cancel this order?</h3>
            <p className="text-sm text-muted-foreground">
              "{order.title}" hasn't been picked up by a tailor yet. Cancelling
              will remove it permanently.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setConfirmOpen(false)}
                disabled={isCancelling}
              >
                Keep order
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    Cancelling…
                  </>
                ) : (
                  "Cancel order"
                )}
              </Button>
            </div>
          </div>
        </Modal>
      </>
    );
  },
);

OrderCard.displayName = "OrderCard";

// ─── OrdersListPage ────────────────────────────────────────────────────────
export const OrdersListPage = memo(() => {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<OrderTab>("Pending");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await getOrders({ per_page: 50 });
      const list: ApiOrder[] = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
          ? res.data
          : [];
      return list;
    },
    staleTime: 1000 * 30,
  });

  const orders: ApiOrder[] = data ?? [];

  // Drafts are status === "draft"; all others go through statusToTab
  const draftOrders = orders.filter((o) => o.status === "draft");
  const filtered =
    tab === "Drafts"
      ? draftOrders
      : orders.filter(
          (o) => o.status !== "draft" && statusToTab(o.status) === tab,
        );

  const handleTabChange = useCallback((t: OrderTab) => setTab(t), []);

  // Optimistic remove after delete — pulls the item out of cache immediately
  const handleDraftDeleted = useCallback(
    (deletedId: string) => {
      queryClient.setQueryData<ApiOrder[]>(["orders"], (prev) =>
        prev ? prev.filter((o) => String(o.id) !== deletedId) : [],
      );
    },
    [queryClient],
  );

  return (
    <div className="mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Orders</h1>
      </div>

      {/* Tabs */}
      <div className="relative mt-6 flex rounded-full bg-muted p-1">
        {TABS.map((t) => {
          const active = tab === t;
          const count =
            t === "Drafts"
              ? draftOrders.length
              : orders.filter(
                  (o) => o.status !== "draft" && statusToTab(o.status) === t,
                ).length;
          return (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className={`relative flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="orders-tab"
                  className="absolute inset-0 rounded-full bg-card shadow-soft"
                  transition={{ type: "spring", stiffness: 360, damping: 32 }}
                />
              )}
              <span className="relative z-10">
                {t}
                {count > 0 && (
                  <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary/15 px-1 text-[10px] font-semibold text-primary">
                    {count}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="mt-6 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 size={16} className="animate-spin" /> Loading orders…
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center text-sm text-muted-foreground">
            Failed to load orders.{" "}
            <button
              onClick={() => refetch()}
              className="text-primary underline-offset-2 hover:underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center text-sm text-muted-foreground"
              >
                {tab === "Drafts"
                  ? "No draft orders. Start creating one and save without a tailor."
                  : `No ${tab.toLowerCase()} orders yet.`}
              </motion.div>
            ) : tab === "Drafts" ? (
              filtered.map((o, i) => (
                <motion.div
                  key={o.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <DraftOrderCard order={o} />
                </motion.div>
              ))
            ) : (
              filtered.map((o, i) => (
                <motion.div
                  key={o.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <OrderCard order={o} onCancelled={handleDraftDeleted} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
});

OrdersListPage.displayName = "OrdersListPage";
