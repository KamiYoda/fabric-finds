import { memo, useState, useCallback } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { setStage } from "@/lib/orderStage";

interface OrderFabricPageProps {
  orderId: string;
}

export const OrderFabricPage = memo(({ orderId }: OrderFabricPageProps) => {
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  const handleConfirm = useCallback(() => {
    setStage(orderId, "fabric_sent");
    setDone(true);
  }, [orderId]);

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
              Once you have confirmed fabric dispatch, the tailor will need to
              acknowledge the delivery
            </span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>Once delivery is acknowledged, work will start</span>
          </li>
        </ul>

        <button
          onClick={handleConfirm}
          className="mt-10 w-full rounded-2xl border-2 border-dashed border-primary bg-primary py-3.5 font-semibold text-primary-foreground hover:bg-primary/90"
        >
          I've sent the fabrics
        </button>
      </div>

      {/* Fabric sent modal */}
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
