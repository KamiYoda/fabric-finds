import { memo, useState, useCallback } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Info, Loader2, CheckCircle2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/modals/Modal";
import { getOrder, makePayment } from "@/lib/api/orders";
import { type ApiOrder, formatAmount } from "../types";
import isewMark from "@/assets/isew-mark.png";
import { toast } from "sonner";

interface OrderPaymentPageProps {
  orderId: string;
}

const Row = memo(
  ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  ),
);
Row.displayName = "Row";

export const OrderPaymentPage = memo(({ orderId }: OrderPaymentPageProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [balance, setBalance] = useState(30000); // wallet balance — extend with wallet API when available
  const [topupOpen, setTopupOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    data: orderData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const res = await getOrder(orderId);
      const order: ApiOrder = res?.data ?? res;
      return order;
    },
    staleTime: 1000 * 30,
  });

  const total = Number(
    orderData?.total_amount ?? orderData?.proposed_amount ?? 0,
  );
  const sufficient = balance >= total && total > 0;

  const handlePay = useCallback(async () => {
    if (!sufficient || processing || total === 0) return;
    setProcessing(true);
    try {
      await makePayment(orderId, total);
      await queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      setBalance((b) => b - total);
      setProcessing(false);
      setSuccess(true);
    } catch {
      toast.error("Payment failed. Please try again.");
      setProcessing(false);
    }
  }, [sufficient, processing, total, orderId, queryClient]);

  const handleTopup = useCallback(() => {
    const n = Number(topupAmount.replace(/[^\d]/g, "")) || 0;
    if (!n) return;
    setBalance((b) => b + n);
    setTopupAmount("");
    setTopupOpen(false);
  }, [topupAmount]);

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-xl items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !orderData) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center text-sm text-muted-foreground">
        Failed to load order.{" "}
        <Link to="/dashboard/orders" className="text-primary hover:underline">
          Go back
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard/orders/$orderId"
          params={{ orderId }}
          className="rounded-full p-1.5 hover:bg-muted"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="font-display text-lg font-semibold truncate">
          {orderData.order_number}
        </h1>
      </div>

      {/* Balance card */}
      <div className="mt-6 rounded-2xl bg-muted/60 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Balance</div>
            <div className="mt-1 font-display text-3xl font-bold text-primary">
              ₦{balance.toLocaleString()}
            </div>
            <AnimatePresence>
              {!sufficient && total > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-1 text-sm font-medium text-destructive"
                >
                  Insufficient balance
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => setTopupOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {/* Breakdown */}
      <div className="mt-6 space-y-3 text-sm">
        <Row
          label="Subtotal"
          value={formatAmount(orderData.subtotal ?? orderData.proposed_amount)}
        />
        <Row
          label="Fabric"
          value={
            <span className="inline-flex items-center gap-1">
              {orderData.fabric_provider === "customer"
                ? "I'll provide"
                : "Tailor provides"}{" "}
              <Info size={12} className="text-muted-foreground" />
            </span>
          }
        />
        {orderData.fabric_cost && Number(orderData.fabric_cost) > 0 && (
          <Row
            label="Fabric cost"
            value={formatAmount(orderData.fabric_cost)}
          />
        )}
        <div className="border-t border-border pt-3">
          <Row
            label="Total amount"
            value={
              <span className="font-display text-lg font-bold text-primary">
                {formatAmount(
                  orderData.total_amount ?? orderData.proposed_amount,
                )}
              </span>
            }
          />
        </div>
      </div>

      {total === 0 && (
        <p className="mt-4 rounded-2xl bg-amber-500/10 px-4 py-3 text-sm text-amber-600">
          Payment amount not yet set by tailor.
        </p>
      )}

      <button
        onClick={handlePay}
        disabled={!sufficient || processing || total === 0}
        className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-3.5 font-semibold transition ${
          sufficient && total > 0
            ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
            : "cursor-not-allowed border-primary/40 bg-primary/40 text-primary-foreground/80"
        }`}
      >
        {processing ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          `Pay ${formatAmount(orderData.total_amount ?? orderData.proposed_amount)}`
        )}
      </button>

      {/* Top-up modal */}
      <Modal
        open={topupOpen}
        onClose={() => setTopupOpen(false)}
        title="Add to balance"
        size="sm"
      >
        <p className="text-sm text-muted-foreground">
          Top up your wallet to complete this order.
        </p>
        <div className="mt-4 flex h-12 items-center rounded-xl border-2 border-primary/40 bg-card px-4">
          <span className="text-sm font-semibold text-primary">NGN</span>
          <input
            value={topupAmount}
            onChange={(e) =>
              setTopupAmount(e.target.value.replace(/[^\d]/g, ""))
            }
            placeholder="0"
            inputMode="numeric"
            className="ml-2 w-full bg-transparent text-sm focus:outline-none"
          />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[5000, 10000, 20000].map((n) => (
            <button
              key={n}
              onClick={() => setTopupAmount(String(n))}
              className="rounded-xl border border-border bg-card py-2 text-xs font-medium hover:bg-muted"
            >
              +₦{n.toLocaleString()}
            </button>
          ))}
        </div>
        <button
          onClick={handleTopup}
          className="mt-5 w-full rounded-2xl bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Add funds
        </button>
      </Modal>

      {/* Processing modal */}
      <Modal open={processing} onClose={() => {}} size="sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Loader2 className="animate-spin text-primary" size={20} />
        </div>
        <h3 className="mt-4 font-display text-xl font-bold">Processing</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Please wait… this will take less than a minute.
        </p>
      </Modal>

      {/* Success overlay */}
      <AnimatePresence>
        {success && (
          <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-accent/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-t-3xl bg-card px-6 pb-8 pt-6 text-center shadow-elegant sm:rounded-3xl"
            >
              <div className="-mx-6 -mt-6 mb-2 flex items-center justify-center bg-accent/20 py-10">
                <img src={isewMark} alt="i-sew" className="h-12 w-12" />
              </div>
              <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-border sm:hidden" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.15,
                  type: "spring",
                  stiffness: 280,
                  damping: 18,
                }}
                className="mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"
              >
                <CheckCircle2 className="text-primary" size={24} />
              </motion.div>
              <h3 className="mt-4 font-display text-2xl font-bold">
                Successful!
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Payment made for{" "}
                <span className="font-medium text-primary">
                  {orderData.order_number}
                </span>
                . Tailor has been notified.
              </p>
              <button
                onClick={() =>
                  navigate({
                    to: "/dashboard/orders/$orderId",
                    params: { orderId },
                  })
                }
                className="mt-6 w-full rounded-2xl border-2 border-dashed border-primary bg-primary py-3.5 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                View order
              </button>
              <button
                onClick={() => navigate({ to: "/dashboard" })}
                className="mt-3 w-full text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Back to dashboard
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
});

OrderPaymentPage.displayName = "OrderPaymentPage";
