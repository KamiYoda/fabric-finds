import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export default function WalletShell({
  title,
  eyebrow,
  backTo = "/dashboard/wallet",
  children,
  actions,
}: {
  title: string;
  eyebrow?: string;
  backTo?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl gradient-primary p-6 text-primary-foreground shadow-elegant sm:p-7"
      >
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent/25 blur-3xl" />
        <div className="absolute -left-12 -bottom-20 h-48 w-48 rounded-full bg-primary-glow/30 blur-3xl" />
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to={backTo}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur transition-colors hover:bg-white/25"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="min-w-0">
              {eyebrow && (
                <p className="text-xs uppercase tracking-wider text-primary-foreground/70">
                  {eyebrow}
                </p>
              )}
              <h1 className="truncate font-display text-2xl font-bold sm:text-3xl">
                {title}
              </h1>
            </div>
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      </motion.div>
      {children}
    </div>
  );
}

export function WalletCard({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={`rounded-3xl border border-border bg-card p-6 shadow-soft ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function FieldLabel({
  children,
  required,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-1.5 block text-xs font-semibold text-foreground">
      {children}
      {required && <span className="ml-0.5 text-destructive">*</span>}
    </label>
  );
}

export function PaystackBadge() {
  return (
    <div className="flex flex-col items-center gap-2 pt-2">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
        Secured by Paystack
      </p>
      <div className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold">
        <span className="text-primary">VISA</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-foreground">Mastercard</span>
        <span className="text-muted-foreground">·</span>
        <span className="italic text-destructive">Verve</span>
      </div>
    </div>
  );
}
