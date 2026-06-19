import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Wallet as WalletIcon,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  CheckCircle2,
  TrendingUp,
  Search,
  Filter,
  Shirt,
  Scissors,
  Banknote,
  RefreshCcw,
  Receipt,
  List,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/Button";
import { OrderTransactionsSection } from "../components/OrderTransactionsSection";
import { getSpendingSummary, type SpendingSummaryItem } from "@/lib/api/wallet";

const MOCK_SUMMARY: SpendingSummaryItem[] = [
  { order_id: "mock-order-1", order_name: "Ankara Senator Suit", spending: 40000, pending: 25000, released: 15000 },
  { order_id: "mock-order-2", order_name: "Aso Ebi Wedding Gown", spending: 42000, pending: 42000, released: 0 },
];

function Card({ children, className = "", delay = 0 }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-soft ${className}`}
    >
      {children}
    </motion.div>
  );
}

const transactions = [
  {
    id: "tx_01",
    type: "credit",
    title: "Wallet funded",
    meta: "Wema Bank · ****5678",
    amount: 50_000,
    date: "Today, 09:42",
    icon: Banknote,
  },
  {
    id: "tx_02",
    type: "escrow",
    title: "Escrow · Aso Ebi order",
    meta: "Freddy Han · #A2841",
    amount: -25_000,
    date: "Yesterday, 18:10",
    icon: Lock,
  },
  {
    id: "tx_03",
    type: "debit",
    title: "Fabric purchase",
    meta: "Royal Aso Oke",
    amount: -12_500,
    date: "Apr 14, 14:22",
    icon: Shirt,
  },
  {
    id: "tx_04",
    type: "credit",
    title: "Refund · cancelled order",
    meta: "Marco Bianchi",
    amount: 18_000,
    date: "Apr 12, 11:05",
    icon: RefreshCcw,
  },
  {
    id: "tx_05",
    type: "debit",
    title: "Tailor payout released",
    meta: "Amaka Okafor",
    amount: -32_000,
    date: "Apr 10, 09:30",
    icon: Scissors,
  },
];

const fmt = (n: number) =>
  `${n < 0 ? "-" : ""}₦${Math.abs(n).toLocaleString("en-NG")}`;

type WalletTab = "all" | "orders";

export default function WalletPage() {
  const [hidden, setHidden] = useState(false);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<"all" | "credit" | "debit" | "escrow">(
    "all",
  );
  const [query, setQuery] = useState("");
  const [walletTab, setWalletTab] = useState<WalletTab>("all");

  const { data: summaryData } = useQuery({
    queryKey: ["wallet-spending-summary"],
    queryFn: () => getSpendingSummary(),
    retry: false,
  });
  const summary: SpendingSummaryItem[] =
    summaryData && summaryData.length > 0 ? summaryData : MOCK_SUMMARY;

  const { pendingEscrow, released, totalSpent } = useMemo(() => {
    const p = summary.reduce((s, i) => s + Number(i.pending || 0), 0);
    const r = summary.reduce((s, i) => s + Number(i.released || 0), 0);
    return { pendingEscrow: p, released: r, totalSpent: p + r };
  }, [summary]);

  const available = 62_500;

  const mask = (v: string) => (hidden ? "₦••••••" : v);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (filter !== "all" && t.type !== filter) return false;
      if (query && !t.title.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
  }, [filter, query]);

  const copy = (value: string) => {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
      {/* Hero balance card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl gradient-primary p-4 sm:p-6 md:p-8 text-primary-foreground shadow-elegant"
      >
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
        <div className="absolute -left-16 -bottom-24 h-64 w-64 rounded-full bg-primary-glow/30 blur-3xl" />

        <div className="relative space-y-4 lg:space-y-0 lg:grid lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-6">
          <div>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <WalletIcon size={18} className="sm:hidden" />
                <WalletIcon size={20} className="hidden sm:block" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-primary-foreground/70">
                  Wallet
                </p>
              </div>
            </div>

            <div className="mt-4 sm:mt-6">
              <p className="text-xs sm:text-sm text-primary-foreground/70">
                Available balance
              </p>
              <div className="mt-1 flex items-center gap-2 sm:gap-3">
                <div className="font-display text-3xl font-bold sm:text-4xl md:text-5xl tabular-nums">
                  {mask(fmt(available))}
                </div>
                <button
                  onClick={() => setHidden((h) => !h)}
                  className="rounded-full bg-white/10 p-1.5 sm:p-2 transition-colors hover:bg-white/20"
                  aria-label={hidden ? "Show balance" : "Hide balance"}
                >
                  {hidden ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </div>
              <p className="mt-1.5 inline-flex items-center gap-1 text-xs text-primary-foreground/70">
                <TrendingUp size={11} /> +12.4% this month
              </p>
            </div>

            <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3">
              <Link to="/dashboard/wallet/topup/">
                <Button variant="accent" size="sm" className="sm:!py-2.5 sm:!px-5">
                  <Plus size={14} /> Top-Up
                </Button>
              </Link>
              <Link to="/dashboard/wallet/withdraw/">
                <Button variant="glass" size="sm" className="sm:!py-2.5 sm:!px-5">
                  <ArrowUpRight size={14} /> Withdraw
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-1 lg:gap-2.5">
            <div className="rounded-2xl bg-white/10 p-3 sm:p-4 backdrop-blur border border-white/15">
              <div className="flex items-center justify-between">
                <p className="text-[10px] sm:text-xs text-primary-foreground/70">
                  Pending escrow
                </p>
                <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-accent/30">
                  <Lock size={11} />
                </div>
              </div>
              <div className="mt-1.5 sm:mt-2 font-display text-base sm:text-xl font-bold tabular-nums">
                {mask(fmt(pendingEscrow))}
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-3 sm:p-4 backdrop-blur border border-white/15">
              <div className="flex items-center justify-between">
                <p className="text-[10px] sm:text-xs text-primary-foreground/70">
                  Released
                </p>
                <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-success/30">
                  <CheckCircle2 size={11} />
                </div>
              </div>
              <div className="mt-1.5 sm:mt-2 font-display text-base sm:text-xl font-bold tabular-nums">
                {mask(fmt(released))}
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-3 sm:p-4 backdrop-blur border border-white/15">
              <div className="flex items-center justify-between">
                <p className="text-[10px] sm:text-xs text-primary-foreground/70">
                  Total spent
                </p>
                <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-white/20">
                  <WalletIcon size={11} />
                </div>
              </div>
              <div className="mt-1.5 sm:mt-2 font-display text-base sm:text-xl font-bold tabular-nums">
                {mask(fmt(totalSpent))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab switcher */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex gap-1 rounded-full bg-muted p-1"
      >
        <button
          onClick={() => setWalletTab("all")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
            walletTab === "all"
              ? "bg-card text-foreground shadow-soft"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <List size={14} /> All Transactions
        </button>
        <button
          onClick={() => setWalletTab("orders")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
            walletTab === "orders"
              ? "bg-card text-foreground shadow-soft"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Receipt size={14} /> Order Transactions
        </button>
      </motion.div>

      {/* Tab content */}
      {walletTab === "all" ? (
        <Card delay={0.2}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-semibold">
                Transactions
              </h2>
              <p className="text-xs text-muted-foreground">All wallet activity</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="h-8 w-36 sm:h-9 sm:w-44 rounded-full border border-border bg-background pl-8 pr-3 text-xs sm:text-sm outline-none focus:border-primary"
                />
              </div>
              <button className="flex h-8 sm:h-9 items-center gap-1.5 rounded-full border border-border bg-background px-2.5 sm:px-3 text-xs font-medium text-muted-foreground hover:text-foreground">
                <Filter size={13} /> Export
              </button>
            </div>
          </div>

          <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
            {(
              [
                { k: "all", l: "All" },
                { k: "credit", l: "Credit" },
                { k: "debit", l: "Debit" },
                { k: "escrow", l: "Pending" },
              ] as const
            ).map((t) => (
              <button
                key={t.k}
                onClick={() => setFilter(t.k)}
                className={`rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-medium transition-colors ${
                  filter === t.k
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-secondary"
                }`}
              >
                {t.l}
              </button>
            ))}
          </div>

          <ul className="mt-3 sm:mt-4 divide-y divide-border">
            {filtered.length === 0 && (
              <li className="py-8 text-center text-sm text-muted-foreground">
                No transactions match your filter.
              </li>
            )}
            {filtered.map((t) => {
              const Icon = t.icon;
              const isCredit = t.amount > 0;
              const isEscrow = t.type === "escrow";
              const tone = isEscrow
                ? "bg-accent/15 text-accent"
                : isCredit
                  ? "bg-success/15 text-success"
                  : "gradient-cream text-destructive";
              return (
                <li key={t.id}>
                  <Link
                    to="/dashboard/wallet/transaction/$transactionId"
                    params={{ transactionId: t.id }}
                    className="flex items-center gap-3 sm:gap-4 rounded-2xl py-3 sm:py-3.5 transition-colors hover:bg-muted/60"
                  >
                    <div
                      className={`flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl ${tone}`}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{t.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {t.meta}
                      </p>
                    </div>
                    <div className="hidden text-xs text-muted-foreground sm:block">
                      {t.date}
                    </div>
                    <div
                      className={`flex items-center gap-0.5 font-display text-xs sm:text-sm font-bold tabular-nums ${
                        isEscrow
                          ? "text-accent"
                          : isCredit
                            ? "text-success"
                            : "text-destructive"
                      }`}
                    >
                      {isCredit ? (
                        <ArrowDownLeft size={13} />
                      ) : (
                        <ArrowUpRight size={13} />
                      )}
                      {fmt(t.amount)}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
      ) : (
        <OrderTransactionsSection />
      )}
    </div>
  );
}
