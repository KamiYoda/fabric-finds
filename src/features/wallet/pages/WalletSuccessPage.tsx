import { useNavigate, useSearch } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/Button";

export default function WalletSuccessPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { message?: string };
  const message = search.message ?? "Thank you for using i-sew.";

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full rounded-3xl border border-border bg-card p-8 text-center shadow-elegant"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.1,
          }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full gradient-primary text-primary-foreground shadow-glow"
        >
          <Check size={36} strokeWidth={3} />
        </motion.div>

        <h2 className="mt-6 font-display text-2xl font-bold">Successful</h2>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>

        <div className="mt-8 flex flex-col gap-3">
          <Button
            onClick={() => navigate({ to: "/dashboard/wallet" })}
            size="lg"
            className="w-full"
          >
            Back to wallet
          </Button>
          <button
            onClick={() => navigate({ to: "/dashboard" })}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Go to dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
