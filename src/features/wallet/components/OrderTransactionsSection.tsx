import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Lock,
  CheckCircle2,
  Wallet as WalletIcon,
  ArrowRight,
  Loader2,
  Receipt,
  ChevronRight,
} from "lucide-react";
import {
  getWalletTransactions,
  getSpendingSummary,
  formatNaira,
  type WalletTransaction,
  type SpendingSummaryItem,
} from "@/lib/api/wallet";

const MOCK_TRANSACTIONS: WalletTransaction[] = [
  {
    id: "mock-tx-1",
    amount: 25000,
    type: "debit",
    status: "pending",
    order_id: "mock-order-1",
    order_name: "Ankara Senator Suit",
    order_ref: "ORD-1024",
    tailor_name: "Amaka Okafor",
    tailor_avatar: null,
    order_status: "in_progress",
    date: new Date(Date.now() - 86_400_000 * 2).toISOString(),
  },
  {
    id: "mock-tx-2",
    amount: 15000,
    type: "debit",
    status: "successful",
    order_id: "mock-order-1",
    order_name: "Ankara Senator Suit",
    order_ref: "ORD-1024",
    tailor_name: "Amaka Okafor",
    tailor_avatar: null,
    order_status: "completed",
    date: new Date(Date.now() - 86_400_000 * 5).toISOString(),
  },
  {
    id: "mock-tx-3",
    amount: 42000,
    type: "debit",
    status: "pending",
    order_id: "mock-order-2",
    order_name: "Aso Ebi Wedding Gown",
    order_ref: "ORD-1019",
    tailor_name: "Freddy Han",
    tailor_avatar: null,
    order_status: "awaiting_fabric",
    date: new Date(Date.now() - 86_400_000 * 7).toISOString(),
  },
];

const MOCK_SUMMARY: SpendingSummaryItem[] = [
  {
    order_id: "mock-order-1",
    order_name: "Ankara Senator Suit",
    spending: 40000,
    pending: 25000,
    released: 15000,
  },
  {
    order_id: "mock-order-2",
    order_name: "Aso Ebi Wedding Gown",
    spending: 42000,
    pending: 42000,
    released: 0,
  },
];

function statusTone(tx: WalletTransaction): { label: string; className: string } {
  if (tx.type === "credit" && tx.order_id) {
    return { label: "Refunded", className: "bg-success/15 text-success" };
  }
  if (tx.status === "pending") {
    return { label: "Escrow", className: "bg-accent/30 text-primary" };
  }
  if (tx.status === "successful") {
    return { label: "Released", className: "bg-success/15 text-success" };
  }
  if (tx.status === "failed") {
    return { label: "Failed", className: "bg-destructive/10 text-destructive" };
  }
  return { label: tx.status, className: "bg-muted text-muted-foreground" };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function OrderTransactionsSection() {
  const { data: txData, isLoading: txLoading } = useQuery({
    queryKey: ["wallet-transactions", "all"],
    queryFn: () => getWalletTransactions({ per_page: 100 }),
    retry: false,
  });

  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ["wallet-spending-summary"],
    queryFn: () => getSpendingSummary(),
    retry: false,
  });

  const txs: WalletTransaction[] =
    txData && txData.length > 0
      ? txData.filter((t) => t.order_id)
      : MOCK_TRANSACTIONS;

  const summary: SpendingSummaryItem[] =
    summaryData && summaryData.length > 0 ? summaryData : MOCK_SUMMARY;

  const totals = useMemo(() => {
    const pending = summary.reduce((s, i) => s + Number(i.pending || 0), 0);
    const released = summary.reduce((s, i) => s + Number(i.released || 0), 0);
    return { pending, released, total: pending + released };
  }, [summary]);

  const grouped = useMemo(() => {
    const map = new Map<
      string,
      { order_id: string; order_name: string; items: WalletTransaction[] }
    >();
    for (const t of txs) {
      if (!t.order_id) continue;
      const key = String(t.order_id);
      const existing = map.get(key);
      if (existing) {
        existing.items.push(t);
      } else {
        map.set(key, {
          order_id: key,
          order_name: t.order_name ?? "Order",
          items: [t],
        });
      }
    }
    return Array.from(map.values());
  }, [txs]);

  // Per-order summary lookup
  const summaryMap = useMemo(() => {
    const m = new Map<string, SpendingSummaryItem>();
    for (const s of summary) {
      m.set(String(s.order_id), s);
    }
    return m;
  }, [summary]);

  const loading = txLoading || summaryLoading;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="space-y-4"
    >
      {/* Header card */}
      <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-semibold">
              Order transactions
            </h2>
            <p className="text-xs text-muted-foreground">
              Payments grouped by order
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Receipt size={16} />
          </div>
        </div>

        {/* Summary pills — NOT clickable */}
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <SummaryPill
            label="Pending escrow"
            value={totals.pending}
            tone="accent"
            Icon={Lock}
          />
          <SummaryPill
            label="Released"
            value={totals.released}
            tone="success"
            Icon={CheckCircle2}
          />
          <SummaryPill
            label="Total spent"
            value={totals.total}
            tone="primary"
            Icon={WalletIcon}
          />
        </div>
      </div>

      {/* Grouped order cards */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground rounded-3xl border border-border bg-card shadow-soft">
          <Loader2 size={14} className="animate-spin" /> Loading transactions…
        </div>
      ) : grouped.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground shadow-soft">
          No order transactions yet.
        </div>
      ) : (
        grouped.map((g) => {
          const s = summaryMap.get(g.order_id);
          const pending = s ? Number(s.pending) : 0;
          const released = s ? Number(s.released) : 0;
          const orderTotal = pending + released;

          return (
            <div
              key={g.order_id}
              className="rounded-3xl border border-border bg-card shadow-soft overflow-hidden"
            >
              {/* Order header */}
              <div className="flex flex-wrap items-start justify-between gap-3 p-4 sm:p-5 border-b border-border">
                <div className="min-w-0">
                  <p className="truncate font-display text-base font-semibold">
                    {g.order_name}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {g.items.length} transaction{g.items.length === 1 ? "" : "s"}
                  </p>
                </div>
                <Link
                  to="/dashboard/orders/$orderId"
                  params={{ orderId: g.order_id }}
                  className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                >
                  View order <ArrowRight size={12} />
                </Link>
              </div>

              {/* Spend summary — NOT clickable */}
              {s && (
                <div className="grid grid-cols-3 gap-px bg-border m-0">
                  <div className="bg-card px-4 py-3">
                    <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-accent/80">
                      <Lock size={10} /> Escrow
                    </div>
                    <p className="mt-1 font-display text-sm font-bold tabular-nums text-primary">
                      {formatNaira(pending)}
                    </p>
                  </div>
                  <div className="bg-card px-4 py-3">
                    <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-success/80">
                      <CheckCircle2 size={10} /> Released
                    </div>
                    <p className="mt-1 font-display text-sm font-bold tabular-nums text-success">
                      {formatNaira(released)}
                    </p>
                  </div>
                  <div className="bg-card px-4 py-3">
                    <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <WalletIcon size={10} /> Total
                    </div>
                    <p className="mt-1 font-display text-sm font-bold tabular-nums">
                      {formatNaira(orderTotal)}
                    </p>
                  </div>
                </div>
              )}

              {/* Transaction rows — CLICKABLE */}
              <ul className="divide-y divide-border">
                {g.items.map((t) => {
                  const tone = statusTone(t);
                  return (
                    <li key={t.id}>
                      <Link
                        to="/dashboard/wallet/transaction/$transactionId"
                        params={{ transactionId: t.id }}
                        className="flex items-center gap-3 px-4 py-3.5 sm:px-5 transition-colors hover:bg-muted/50 group"
                      >
                        {/* Status badge */}
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${tone.className}`}
                        >
                          {tone.label}
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-muted-foreground">
                            {formatDate(t.date)}
                          </p>
                          {t.tailor_name && (
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {t.tailor_name}
                            </p>
                          )}
                        </div>

                        <div
                          className={`font-display text-sm font-bold tabular-nums ${
                            t.type === "credit" ? "text-success" : "text-foreground"
                          }`}
                        >
                          {t.type === "credit" ? "+" : "-"}
                          {formatNaira(Math.abs(t.amount))}
                        </div>
                        <ChevronRight
                          size={14}
                          className="text-muted-foreground transition-transform group-hover:translate-x-0.5"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })
      )}
    </motion.section>
  );
}

function SummaryPill({
  label,
  value,
  tone,
  Icon,
}: {
  label: string;
  value: number;
  tone: "primary" | "accent" | "success";
  Icon: React.ComponentType<{ size?: number }>;
}) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/25 text-primary",
    success: "bg-success/15 text-success",
  } as const;
  return (
    <div className={`rounded-2xl px-3 py-3 ${tones[tone]}`}>
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider opacity-80">
        <Icon size={11} /> {label}
      </div>
      <p className="mt-1 font-display text-base font-bold tabular-nums sm:text-lg">
        {formatNaira(value)}
      </p>
    </div>
  );
}
