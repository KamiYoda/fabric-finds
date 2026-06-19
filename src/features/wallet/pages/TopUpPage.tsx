import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CreditCard,
  Building2,
  Wallet as WalletIcon,
  Plus,
} from "lucide-react";
import {
  getSavedCards,
  topUpWithCard,
  topUpViaBankTransfer,
  TopUpCardPayload,
  SavedCard,
} from "@/lib/api/wallet";
import WalletShell, {
  WalletCard,
  FieldLabel,
  PaystackBadge,
} from "./WalletShell";
import { Button } from "@/components/Button";

type Tab = "card" | "bank";

const DUMMY_CARDS: SavedCard[] = [];

export default function TopUpPage() {
  const [tab, setTab] = useState<Tab>("card");
  return (
    <WalletShell title="Top up wallet" eyebrow="Add funds">
      <WalletCard delay={0.05}>
        <div className="grid grid-cols-2 gap-2 rounded-full bg-muted p-1">
          {(
            [
              { k: "card", l: "Card", Icon: CreditCard },
              { k: "bank", l: "Bank transfer", Icon: Building2 },
            ] as const
          ).map(({ k, l, Icon }) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                tab === k
                  ? "bg-card text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={14} />
              {l}
            </button>
          ))}
        </div>
        <div className="mt-6">
          {tab === "card" ? <CardTopUp /> : <BankTransferTopUp />}
        </div>
      </WalletCard>
    </WalletShell>
  );
}

function CardTopUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState<TopUpCardPayload>({
    amount: 0,
    card_number: "",
    expiry: "",
    cvv: "",
    save_card: false,
  });
  const [amountStr, setAmountStr] = useState("");

  const { data: cards } = useQuery({
    queryKey: ["wallet-cards"],
    queryFn: getSavedCards,
  });

  const resolvedCards: SavedCard[] = cards ?? DUMMY_CARDS;

  const mutation = useMutation({
    mutationFn: topUpWithCard,
    onSuccess: () =>
      navigate({
        to: "/dashboard/wallet/topup/success",
        search: { message: "Your wallet has been topped up." },
      }),
  });

  const isReady =
    amountStr.trim() !== "" &&
    form.card_number.length >= 16 &&
    form.expiry.length >= 4 &&
    form.cvv.length >= 3;

  return (
    <div className="space-y-5">
      {resolvedCards.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Saved cards
          </p>
          {resolvedCards.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CreditCard size={16} />
                </div>
                <span className="font-medium tabular-nums">•••• {c.last4}</span>
              </div>
              <span className="text-xs uppercase text-muted-foreground">
                {c.brand}
              </span>
            </div>
          ))}
        </div>
      )}

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
        <FieldLabel required>Card number</FieldLabel>
        <input
          className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none focus:border-primary"
          placeholder="0000 0000 0000 0000"
          value={form.card_number}
          inputMode="numeric"
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              card_number: e.target.value.replace(/\D/g, "").slice(0, 16),
            }))
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel required>Expiry</FieldLabel>
          <input
            className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none focus:border-primary"
            placeholder="MM/YY"
            value={form.expiry}
            onChange={(e) => setForm((f) => ({ ...f, expiry: e.target.value }))}
          />
        </div>
        <div>
          <FieldLabel required>CVV</FieldLabel>
          <input
            className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none focus:border-primary"
            placeholder="•••"
            type="password"
            maxLength={4}
            value={form.cvv}
            onChange={(e) =>
              setForm((f) => ({ ...f, cvv: e.target.value.replace(/\D/g, "") }))
            }
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.save_card}
          onChange={(e) =>
            setForm((f) => ({ ...f, save_card: e.target.checked }))
          }
          className="h-4 w-4 rounded border-border accent-primary"
        />
        <span className="text-foreground">Save this card for next time</span>
      </label>

      <Button
        onClick={() =>
          mutation.mutate({
            ...form,
            amount: Number(amountStr.replace(/,/g, "")),
          })
        }
        disabled={!isReady || mutation.isPending}
        size="lg"
        className="w-full"
      >
        <Plus size={16} />
        {mutation.isPending
          ? "Processing…"
          : `Top up ${amountStr ? `₦${amountStr}` : ""}`}
      </Button>

      <PaystackBadge />
    </div>
  );
}

function BankTransferTopUp() {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: topUpViaBankTransfer,
    onSuccess: () =>
      navigate({
        to: "/dashboard/wallet/topup/success",
        search: { message: "Transfer initiated. Funds arrive within minutes." },
      }),
  });

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-dashed border-border bg-background p-5 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <WalletIcon size={22} />
        </div>
        <p className="mt-3 font-semibold">Transfer to your virtual account</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Use your Wema Bank virtual account on the wallet page to credit funds
          instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-[11px] uppercase text-muted-foreground">Bank</p>
          <p className="mt-1 font-semibold">Wema Bank</p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-[11px] uppercase text-muted-foreground">
            Account no.
          </p>
          <p className="mt-1 font-display text-lg font-bold tracking-wider">
            8012345678
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-[11px] uppercase text-muted-foreground">Name</p>
          <p className="mt-1 font-semibold truncate">i-sew / Seyi Adebayo</p>
        </div>
      </div>

      <Button
        onClick={() => mutation.mutate({ amount: 0 })}
        disabled={mutation.isPending}
        size="lg"
        className="w-full"
      >
        I've made the transfer
      </Button>
      <PaystackBadge />
    </div>
  );
}
