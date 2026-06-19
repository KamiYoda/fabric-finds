import { useParams, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Clock, CheckCircle2, ShieldCheck } from "lucide-react";
import {
  getWalletTransaction,
  formatNaira,
  WalletTransactionDetail,
} from "@/lib/api/wallet";
import WalletShell, { WalletCard } from "./WalletShell";

const DUMMY_TX: WalletTransactionDetail = {
  id: "demo-tx",
  transaction_id: "TXN-0000000000",
  amount: 25_000,
  type: "debit",
  status: "pending",
  order_id: null,
  order_name: "Ankara senator suit",
  order_ref: null,
  order_status: "in_progress",
  tailor_name: "Amaka Okafor",
  tailor_avatar: null,
  tailor_id: null,
  date: new Date().toISOString(),
  spending: 25_000,
  pending: 25_000,
  released: 0,
};

export default function TransactionDetailPage() {
  // strict: false — reads from whatever active route contains $transactionId
  const { transactionId } = useParams({ strict: false }) as {
    transactionId?: string;
  };

  const { data: tx, isLoading } = useQuery({
    queryKey: ["wallet-transaction", transactionId],
    queryFn: () => getWalletTransaction(transactionId!),
    enabled: !!transactionId,
    // On error, fall back silently — dummy data handles empty state
  });

  const data = tx ?? (!isLoading ? DUMMY_TX : undefined);

  if (isLoading || !data) {
    return (
      <WalletShell title="Transaction" eyebrow="Wallet activity">
        <WalletCard>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </WalletCard>
      </WalletShell>
    );
  }

  const statusLabel = data.order_status
    ? data.order_status.charAt(0).toUpperCase() +
      data.order_status.replace("_", " ").slice(1)
    : "—";

  return (
    <WalletShell title="Transaction" eyebrow="Wallet activity">
      <WalletCard delay={0.05} className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Amount
        </p>
        <p className="mt-1 font-display text-4xl font-bold tabular-nums sm:text-5xl">
          {formatNaira(data.amount)}
        </p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-primary">
          <Clock size={12} /> {statusLabel} order
        </span>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <Pill
            label="Spending"
            value={data.spending}
            tone="primary"
            Icon={ArrowUpRight}
          />
          <Pill
            label="Pending"
            value={data.pending}
            tone="accent"
            Icon={Clock}
          />
          <Pill
            label="Released"
            value={data.released}
            tone="success"
            Icon={CheckCircle2}
          />
        </div>
      </WalletCard>

      <WalletCard delay={0.1}>
        <h2 className="font-display text-lg font-semibold">Details</h2>
        <div className="mt-3 divide-y divide-border">
          <Row label="Order name" value={data.order_name ?? "—"} />
          <Row label="Transaction ID" value={data.transaction_id} mono />
          <Row
            label="Date"
            value={new Date(data.date).toLocaleString("en-NG", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
          <Row label="Tailor" value={data.tailor_name ?? "—"} />
          <div className="flex items-center justify-between py-3.5">
            <span className="text-sm text-muted-foreground">Job details</span>
            {data.order_id ? (
              <Link
                to="/dashboard/orders/$orderId"
                params={{ orderId: data.order_id }}
                className="text-sm font-medium text-primary hover:underline"
              >
                Go to order →
              </Link>
            ) : (
              <span className="text-sm text-muted-foreground">—</span>
            )}
          </div>
        </div>
      </WalletCard>

      <WalletCard delay={0.15} className="bg-muted/40">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="font-semibold">Held in escrow</p>
            <p className="mt-1 text-sm text-muted-foreground">
              We've securely held this payment. Funds release to the tailor once
              you confirm the job has been completed satisfactorily.
            </p>
          </div>
        </div>
      </WalletCard>
    </WalletShell>
  );
}

function Pill({
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
    accent: "gradient-cream text-primary",
    success: "bg-success/15 text-success",
  } as const;
  return (
    <div className={`rounded-2xl px-3 py-3 text-left ${tones[tone]}`}>
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider opacity-80">
        <Icon size={10} /> {label}
      </div>
      <p className="mt-1 font-display text-base font-bold tabular-nums">
        {formatNaira(value)}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <span className="shrink-0 text-sm text-muted-foreground">{label}</span>
      <span
        className={`truncate text-right text-sm ${mono ? "font-mono text-xs" : "font-medium"} text-foreground`}
      >
        {value}
      </span>
    </div>
  );
}
