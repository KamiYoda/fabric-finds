import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Wallet as WalletIcon, ArrowUpRight, Plus } from "lucide-react";
import { getSavedBanks, withdraw, SavedBank } from "@/lib/api/wallet";
import { Button } from "@/components/Button";
import WalletShell, {
  WalletCard,
  FieldLabel,
  PaystackBadge,
} from "./WalletShell";

const DUMMY_BANKS: SavedBank[] = [
  {
    id: "bank_demo",
    bank_name: "Wema Bank",
    account_number: "123****890",
    account_name: "Seyi Adebayo",
    bank_logo: null,
  },
];

export default function WithdrawPage() {
  const navigate = useNavigate();
  const { data: banks, isLoading } = useQuery({
    queryKey: ["wallet-banks"],
    queryFn: getSavedBanks,
  });

  const resolvedBanks: SavedBank[] = banks ?? (!isLoading ? DUMMY_BANKS : []);

  const [selectedBank, setSelectedBank] = useState<SavedBank | null>(null);
  const [amountStr, setAmountStr] = useState("");
  const [password, setPassword] = useState("");

  const bank = selectedBank ?? resolvedBanks[0] ?? null;

  const mutation = useMutation({
    mutationFn: withdraw,
    onSuccess: () =>
      navigate({
        to: "/dashboard/wallet/withdraw/success",
        search: { message: "Your withdrawal is on the way." },
      }),
  });

  const isReady = !!bank && amountStr.trim() !== "" && password.trim() !== "";

  if (isLoading) {
    return (
      <WalletShell title="Withdraw" eyebrow="To bank">
        <WalletCard>
          <div className="h-24 animate-pulse rounded-2xl bg-muted" />
        </WalletCard>
      </WalletShell>
    );
  }

  if (resolvedBanks.length === 0) {
    return (
      <WalletShell title="Withdraw" eyebrow="To bank">
        <WalletCard className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <WalletIcon size={24} />
          </div>
          <h2 className="mt-4 font-display text-lg font-semibold">
            No bank account yet
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a bank account to start withdrawing your funds.
          </p>
          <Button
            onClick={() =>
              navigate({ to: "/dashboard/wallet/withdraw/add-bank" })
            }
            size="lg"
            className="mt-6 w-full sm:w-auto"
          >
            <Plus size={16} /> Add bank account
          </Button>
        </WalletCard>
      </WalletShell>
    );
  }

  return (
    <WalletShell title="Withdraw" eyebrow="To bank">
      <WalletCard delay={0.05}>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Destination
        </p>
        {bank && (
          <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-accent text-primary font-bold">
                {bank.bank_name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">{bank.account_name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {bank.bank_name}
                </p>
              </div>
            </div>
            <span className="font-mono text-sm tabular-nums">
              {bank.account_number}
            </span>
          </div>
        )}

        <button
          onClick={() =>
            navigate({ to: "/dashboard/wallet/withdraw/add-bank" })
          }
          className="mt-3 text-sm font-medium text-primary hover:underline"
        >
          Change withdrawal bank
        </button>

        <div className="mt-6 space-y-4">
          <div>
            <FieldLabel required>Amount</FieldLabel>
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 focus-within:border-primary">
              <span className="text-sm font-semibold text-muted-foreground">
                NGN
              </span>
              <input
                className="flex-1 bg-transparent text-sm outline-none"
                placeholder="Enter amount"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                inputMode="numeric"
              />
            </div>
          </div>
          <div>
            <FieldLabel required>Password</FieldLabel>
            <input
              className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none focus:border-primary"
              placeholder="Enter your i-sew password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <Button
          onClick={() =>
            bank &&
            mutation.mutate({
              bank_id: bank.id,
              amount: Number(amountStr.replace(/,/g, "")),
              password,
            })
          }
          disabled={!isReady || mutation.isPending}
          size="lg"
          className="mt-6 w-full"
        >
          <ArrowUpRight size={16} />
          {mutation.isPending ? "Processing…" : "Withdraw"}
        </Button>

        <PaystackBadge />
      </WalletCard>
    </WalletShell>
  );
}
