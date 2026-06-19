import { memo } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/Logo";

export const MerchantOrderSuccessPage = memo(() => {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { ref?: string };
  const ref = search.ref ?? "FM021-IDJS-2026-cta";

  return (
    <div className="-m-4 sm:-m-6 lg:-m-10">
      <div className="flex h-64 items-center justify-center bg-accent/30">
        <Logo />
      </div>
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative -mt-8 rounded-t-3xl bg-card p-6"
      >
        <div className="mx-auto h-1.5 w-12 rounded-full bg-muted" />
        <div className="mt-6 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 size={24} />
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold">Successful!</h1>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Payment has been made for order{" "}
            <span className="font-semibold text-primary underline">{ref}</span>.
            Tailor has been notified and work will start immediately.
          </p>
          <button
            onClick={() => navigate({ to: "/dashboard/orders" as any })}
            className="mt-6 w-full max-w-md rounded-2xl border-2 border-dashed border-primary-foreground/30 bg-primary py-3.5 font-semibold text-primary-foreground"
          >
            View order
          </button>
          <button
            onClick={() => navigate({ to: "/dashboard" as any })}
            className="mt-3 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Go to dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
});
MerchantOrderSuccessPage.displayName = "MerchantOrderSuccessPage";
