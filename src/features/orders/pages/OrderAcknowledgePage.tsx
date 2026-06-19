// OrderFabricPage.tsx
import { memo, useState, useCallback } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { sendFabric } from "@/lib/api/orders";
import { toast } from "sonner";

interface OrderFabricPageProps {
  orderId: string;
}

export const OrderFabricPage = memo(({ orderId }: OrderFabricPageProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = useCallback(async () => {
    setLoading(true);
    try {
      await sendFabric(orderId, ""); // tracking_number required by API; extend with input field if needed
      await queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      setDone(true);
    } catch {
      toast.error("Failed to confirm fabric dispatch. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [orderId, queryClient]);

  const handleClose = useCallback(() => {
    navigate({ to: "/dashboard/orders/$orderId", params: { orderId } });
  }, [navigate, orderId]);

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
        <h1 className="font-display text-lg font-semibold">
          Fabric confirmation
        </h1>
      </div>

      <div className="mt-10 px-2">
        <p className="text-sm font-medium">Please note the following:</p>
        <ul className="mt-3 space-y-2 text-sm text-destructive">
          <li className="flex gap-2">
            <span>•</span>
            <span>Do not confirm you've sent fabrics if you haven't</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>
              Once you confirm dispatch, the tailor needs to acknowledge
              delivery
            </span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>Once delivery is acknowledged, work will start</span>
          </li>
        </ul>

        <button
          onClick={handleConfirm}
          disabled={loading}
          className="mt-10 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary bg-primary py-3.5 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            "I've sent the fabrics"
          )}
        </button>
      </div>

      <AnimatePresence>
        {done && (
          <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
              onClick={handleClose}
            />
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="relative z-10 w-full max-w-sm rounded-3xl bg-card p-6 shadow-elegant"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="text-primary" size={20} />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">
                Fabric sent
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Awaiting tailor's acknowledgement
              </p>
              <button
                onClick={handleClose}
                className="mt-5 w-full rounded-2xl border-2 border-dashed border-primary bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Ok
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
});

OrderFabricPage.displayName = "OrderFabricPage";

// ─── OrderAcknowledgePage ─────────────────────────────────────────────────────

import {
  memo as memo2,
  useState as useState2,
  useCallback as useCallback2,
} from "react";
import {
  Link as Link2,
  useNavigate as useNavigate2,
} from "@tanstack/react-router";
import {
  motion as motion2,
  AnimatePresence as AnimatePresence2,
} from "framer-motion";
import {
  ArrowLeft as ArrowLeft2,
  CheckCircle2 as CheckCircle2_,
  Loader2 as Loader2_,
} from "lucide-react";
import { useQueryClient as useQueryClient2 } from "@tanstack/react-query";
import { acknowledgeCompletion } from "@/lib/api/orders";
import { setRated } from "@/lib/orderStage";
import isewMark from "@/assets/isew-mark.png";
import { toast as toast2 } from "sonner";

interface OrderAcknowledgePageProps {
  orderId: string;
}

export const OrderAcknowledgePage = memo2(
  ({ orderId }: OrderAcknowledgePageProps) => {
    const navigate = useNavigate2();
    const queryClient = useQueryClient2();
    const [done, setDone] = useState2(false);
    const [loading, setLoading] = useState2(false);

    const handleConfirm = useCallback2(async () => {
      setLoading(true);
      try {
        await acknowledgeCompletion(orderId);
        await queryClient.invalidateQueries({ queryKey: ["order", orderId] });
        await queryClient.invalidateQueries({ queryKey: ["orders"] });
        setDone(true);
      } catch {
        toast2.error("Failed to acknowledge. Please try again.");
      } finally {
        setLoading(false);
      }
    }, [orderId, queryClient]);

    return (
      <div className="mx-auto max-w-xl">
        <div className="flex items-center gap-3">
          <Link2
            to="/dashboard/orders/$orderId"
            params={{ orderId }}
            className="rounded-full p-1.5 hover:bg-muted"
          >
            <ArrowLeft2 size={18} />
          </Link2>
          <h1 className="font-display text-lg font-semibold">
            Order {orderId}
          </h1>
        </div>

        <div className="mt-10 px-2">
          <p className="text-sm font-medium">Please note the following:</p>
          <ul className="mt-3 space-y-2 text-sm text-destructive">
            <li className="flex gap-2">
              <span>•</span>
              <span>Do not acknowledge dress if you haven't received it</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                Once you acknowledge, full payment will be released into the
                tailor's account
              </span>
            </li>
          </ul>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="mt-10 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary bg-primary py-3.5 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? (
              <Loader2_ size={16} className="animate-spin" />
            ) : (
              "Acknowledge"
            )}
          </button>
        </div>

        <AnimatePresence2>
          {done && (
            <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-4">
              <motion2.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
              />
              <motion2.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                className="relative z-10 w-full max-w-md overflow-hidden rounded-t-3xl bg-card px-6 pb-8 text-center shadow-elegant sm:rounded-3xl"
              >
                <div className="-mx-6 flex items-center justify-center bg-accent/20 py-10">
                  <img src={isewMark} alt="i-sew" className="h-12 w-12" />
                </div>
                <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-border sm:hidden" />
                <motion2.div
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
                  <CheckCircle2_ className="text-primary" size={24} />
                </motion2.div>
                <h3 className="mt-4 font-display text-2xl font-bold">
                  Successful!
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Order fulfilled, tailor has been fully paid. Thank you for
                  using i-sew.
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() =>
                      navigate({
                        to: "/dashboard/orders/$orderId/rate",
                        params: { orderId },
                      })
                    }
                    className="flex-1 rounded-2xl border-2 border-dashed border-primary bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    Rate tailor
                  </button>
                </div>
                <button
                  onClick={() => navigate({ to: "/dashboard" })}
                  className="mt-3 w-full text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Back to dashboard
                </button>
              </motion2.div>
            </div>
          )}
        </AnimatePresence2>
      </div>
    );
  },
);

OrderAcknowledgePage.displayName = "OrderAcknowledgePage";
