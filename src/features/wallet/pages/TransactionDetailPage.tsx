import { useParams, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Clock,
  CheckCircle2,
  ShieldCheck,
  MessageSquare,
  ExternalLink,
  Lock,
  Wallet,
  User,
} from "lucide-react";
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

function statusConfig(status: string, type: string, orderStatus?: string | null) {
  if (type === "credit") {
    return { label: "Refunded", className: "bg-success/15 text-success", Icon: CheckCircle2 };
  }
  if (status === "pending") {
    return { label: "Escrow · Held", className: "bg-accent/20 text-primary", Icon: Lock };
  }
  if (status === "successful") {
    return { label: "Released", className: "bg-success/15 text-success", Icon: CheckCircle2 };
  }
  return { label: status, className: "bg-muted text-muted-foreground", Icon: Clock };
}

function orderStatusLabel(s?: string | null) {
  if (!s) return "—";
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function TransactionDetailPage() {
  const { transactionId } = useParams({ strict: false }) as {
    transactionId?: string;
  };

  const { data: tx, isLoading } = useQuery({
    queryKey: ["wallet-transaction", transactionId],
    queryFn: () => getWalletTransaction(transactionId!),
    enabled: !!transactionId,
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

  const sc = statusConfig(data.status, data.type, data.order_status);
  const StatusIcon = sc.Icon;

  return (
    <WalletShell title="Transaction" eyebrow="Wallet activity">
      {/* Amount hero */}
      <WalletCard delay={0.05} className="text-center">
        <div
          className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl ${sc.className}`}
        >
          <StatusIcon size={22} />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Amount
        </p>
        <p className="mt-1 font-display text-4xl font-bold tabular-nums sm:text-5xl">
          {formatNaira(data.amount)}
        </p>
        <span
          className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${sc.className}`}
        >
          <StatusIcon size={12} /> {sc.label}
        </span>

        {/* Amount breakdown */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          <Pill label="Spending" value={data.spending} tone="primary" Icon={ArrowUpRight} />
          <Pill label="Escrow" value={data.pending} tone="accent" Icon={Lock} />
          <Pill label="Released" value={data.released} tone="success" Icon={CheckCircle2} />
        </div>
      </WalletCard>

      {/* Order info */}
      <WalletCard delay={0.1}>
        <h2 className="font-display text-lg font-semibold">Order information</h2>
        <div className="mt-3 divide-y divide-border">
          <Row label="Order name" value={data.order_name ?? "—"} />
          {data.order_ref && <Row label="Order ref" value={data.order_ref} mono />}
          <Row label="Order status" value={orderStatusLabel(data.order_status)} />
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
        </div>

        {/* Navigation actions */}
        {data.order_id && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/dashboard/orders/$orderId"
              params={{ orderId: data.order_id }}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary/10 px-4 py-2.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
            >
              <ExternalLink size={13} /> View order
            </Link>
            <Link
              to="/dashboard/orders/$orderId"
              params={{ orderId: data.order_id }}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-muted px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              <MessageSquare size={13} /> Chat
            </Link>
          </div>
        )}
      </WalletCard>

      {/* Tailor info */}
      {data.tailor_name && (
        <WalletCard delay={0.15}>
          <h2 className="font-display text-lg font-semibold">Tailor</h2>
          <div className="mt-3 flex items-center gap-3">
            {data.tailor_avatar ? (
              <img
                src={data.tailor_avatar}
                alt={data.tailor_name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <User size={20} />
              </div>
            )}
            <div>
              <p className="font-semibold">{data.tailor_name}</p>
              {data.tailor_id && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  ID: {data.tailor_id}
                </p>
              )}
            </div>
          </div>
        </WalletCard>
      )}

      {/* Escrow notice — only for pending */}
      {data.status === "pending" && data.type !== "credit" && (
        <WalletCard delay={0.2} className="bg-muted/40">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="font-semibold">Held in escrow</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Funds are securely held and will release to the tailor once you
                confirm the job has been completed satisfactorily.
              </p>
            </div>
          </div>
        </WalletCard>
      )}
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
