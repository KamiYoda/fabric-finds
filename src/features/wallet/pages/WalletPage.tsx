import { useMemo, useState } from "react";
import { motion } from "framer-motion";
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
  TrendingUp,
  Search,
  Filter,
  Shirt,
  Scissors,
  Banknote,
  RefreshCcw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/Button";

function Card({ children, className = "", delay = 0 }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`rounded-3xl border border-border bg-card p-6 shadow-soft ${className}`}
    >
      {children}
    </motion.div>
  );
}

const balanceHistory = [
  { day: "Apr 1", balance: 1_650_000 },
  { day: "Apr 5", balance: 2_120_000 },
  { day: "Apr 8", balance: 1_950_000 },
  { day: "Apr 10", balance: 2_300_000 },
  { day: "Apr 12", balance: 2_180_000 },
  { day: "Apr 15", balance: 2_650_000 },
  { day: "Apr 17", balance: 2_480_000 },
];

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

export default function WalletPage() {
  const [hidden, setHidden] = useState(false);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<"all" | "credit" | "debit" | "escrow">(
    "all",
  );
  const [query, setQuery] = useState("");

  const available = 62_500;
  const locked = 37_500;
  const total = available + locked;

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
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header / Hero balance */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl gradient-primary p-6 text-primary-foreground shadow-elegant sm:p-8"
      >
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
        <div className="absolute -left-16 -bottom-24 h-64 w-64 rounded-full bg-primary-glow/30 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <WalletIcon size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-primary-foreground/70">
                  Wallet
                </p>
                <h1 className="font-display text-2xl font-bold sm:text-3xl">
                  Manage your funds & escrow
                </h1>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-primary-foreground/70">
                Available balance
              </p>
              <div className="mt-1 flex items-center gap-3">
                <div className="font-display text-4xl font-bold sm:text-5xl">
                  {mask(fmt(available))}
                </div>
                <button
                  onClick={() => setHidden((h) => !h)}
                  className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
                  aria-label={hidden ? "Show balance" : "Hide balance"}
                >
                  {hidden ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
              <p className="mt-2 inline-flex items-center gap-1 text-xs text-primary-foreground/70">
                <TrendingUp size={12} /> +12.4% this month
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/dashboard/wallet/topup">
                <Button variant="accent" size="lg">
                  <Plus size={16} /> Fund wallet
                </Button>
              </Link>
              <Link to="/dashboard/wallet/withdraw">
                <Button variant="glass" size="lg">
                  <ArrowUpRight size={16} /> Withdraw
                </Button>
              </Link>
            </div>
          </div>

          {/* Sub-balance pills */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/dashboard/wallet/spending"
              className="rounded-2xl bg-white/10 p-4 backdrop-blur border border-white/15 transition-colors hover:bg-white/15"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs text-primary-foreground/70">Locked</p>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/30">
                  <Lock size={12} />
                </div>
              </div>
              <div className="mt-2 font-display text-2xl font-bold">
                {mask(fmt(locked))}
              </div>
              <p className="mt-1 text-[11px] text-primary-foreground/60">
                In escrow · view
              </p>
            </Link>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur border border-white/15">
              <div className="flex items-center justify-between">
                <p className="text-xs text-primary-foreground/70">Total</p>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-success/30">
                  <TrendingUp size={12} />
                </div>
              </div>
              <div className="mt-2 font-display text-2xl font-bold">
                {mask(fmt(total))}
              </div>
              <p className="mt-1 text-[11px] text-primary-foreground/60">
                Available + locked
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chart + Virtual account */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card delay={0.1} className="lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold">
                Balance history
              </h2>
              <p className="text-xs text-muted-foreground">Last 17 days</p>
            </div>
            <div className="flex gap-1 rounded-full bg-muted p-1 text-xs">
              {["7D", "30D", "90D"].map((r, i) => (
                <button
                  key={r}
                  className={`rounded-full px-3 py-1 font-medium transition-colors ${
                    i === 1
                      ? "bg-card text-foreground shadow-soft"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={balanceHistory}
                margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="var(--color-border)"
                  strokeDasharray="4 4"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₦${(v / 1_000_000).toFixed(1)}M`}
                  width={48}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [fmt(v), "Balance"]}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  fill="url(#balanceFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card delay={0.15}>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">
              Virtual account
            </h2>
            <span className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">
              Active
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Send funds here to top up instantly.
          </p>

          <div className="mt-5 space-y-3">
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs text-muted-foreground">Account name</p>
              <p className="mt-1 font-semibold">i-sew / Seyi Adebayo</p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Account number
                  </p>
                  <p className="mt-1 font-display text-xl font-bold tracking-wider">
                    8012345678
                  </p>
                </div>
                <button
                  onClick={() => copy("8012345678")}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-primary transition-colors hover:bg-secondary"
                  aria-label="Copy account number"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs text-muted-foreground">Bank</p>
              <p className="mt-1 font-semibold">Wema Bank</p>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-muted-foreground">
            Funds sent to this account are credited automatically within
            minutes.
          </p>
        </Card>
      </div>

      {/* Transactions */}
      <Card delay={0.2}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold">Transactions</h2>
            <p className="text-xs text-muted-foreground">All wallet activity</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="h-9 w-44 rounded-full border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>
            <button className="flex h-9 items-center gap-2 rounded-full border border-border bg-background px-3 text-xs font-medium text-muted-foreground hover:text-foreground">
              <Filter size={14} /> Export
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(
            [
              { k: "all", l: "All" },
              { k: "credit", l: "Inflow" },
              { k: "debit", l: "Outflow" },
              { k: "escrow", l: "Escrow" },
            ] as const
          ).map((t) => (
            <button
              key={t.k}
              onClick={() => setFilter(t.k)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                filter === t.k
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-secondary"
              }`}
            >
              {t.l}
            </button>
          ))}
        </div>

        <ul className="mt-4 divide-y divide-border">
          {filtered.length === 0 && (
            <li className="py-10 text-center text-sm text-muted-foreground">
              No transactions match your filter.
            </li>
          )}
          {filtered.map((t) => {
            const Icon = t.icon;
            const isCredit = t.amount > 0;
            const isEscrow = t.type === "escrow";
            const tone = isEscrow
              ? "bg-accent/15 text-accent-foreground"
              : isCredit
                ? "bg-success/15 text-success"
                : "gradient-cream text-primary";
            return (
              <li key={t.id}>
                <Link
                  to="/dashboard/wallet/transaction/$transactionId"
                  params={{ transactionId: t.id }}
                  className="flex items-center gap-4 rounded-2xl py-3.5 transition-colors hover:bg-muted/60"
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tone}`}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{t.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {t.meta}
                    </p>
                  </div>
                  <div className="hidden text-xs text-muted-foreground sm:block">
                    {t.date}
                  </div>
                  <div
                    className={`flex items-center gap-1 font-display text-sm font-bold tabular-nums ${
                      isEscrow
                        ? "text-foreground"
                        : isCredit
                          ? "text-success"
                          : "text-foreground"
                    }`}
                  >
                    {isCredit ? (
                      <ArrowDownLeft size={14} />
                    ) : (
                      <ArrowUpRight size={14} />
                    )}
                    {fmt(t.amount)}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
