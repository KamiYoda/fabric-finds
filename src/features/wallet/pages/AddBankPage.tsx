import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronDown, Check } from "lucide-react";
import { addBank, getBankList, AddBankPayload } from "@/lib/api/wallet";
import WalletShell, {
  WalletCard,
  FieldLabel,
  PaystackBadge,
} from "./WalletShell";
import { Button } from "@/components/Button";

const DUMMY_BANKS = [
  { code: "057", name: "Zenith Bank" },
  { code: "011", name: "First Bank" },
  { code: "035", name: "Wema Bank" },
  { code: "058", name: "GTBank" },
  { code: "033", name: "UBA" },
];

export default function AddBankPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<AddBankPayload>({
    bank_code: "",
    account_number: "",
    password: "",
  });
  const [resolvedName, setResolvedName] = useState<string | null>(null);
  const [bankOpen, setBankOpen] = useState(false);
  const [selectedBankName, setSelectedBankName] = useState("");

  const { data: bankListData } = useQuery({
    queryKey: ["bank-list"],
    queryFn: getBankList,
  });

  const bankList = bankListData ?? DUMMY_BANKS;

  const mutation = useMutation({
    mutationFn: addBank,
    onSuccess: () =>
      navigate({
        to: "/dashboard/wallet/withdraw/add-bank/success",
        search: { message: "Bank saved for withdrawals." },
      }),
  });

  function handleAccountNumber(val: string) {
    const clean = val.replace(/\D/g, "").slice(0, 10);
    setForm((f) => ({ ...f, account_number: clean }));
    setResolvedName(
      clean.length === 10 && form.bank_code ? "Account verified" : null,
    );
  }

  const isReady =
    form.bank_code !== "" &&
    form.account_number.length === 10 &&
    form.password.trim() !== "";

  return (
    <WalletShell
      title="Add bank account"
      eyebrow="Withdrawals"
      backTo="/dashboard/wallet/withdraw"
    >
      <WalletCard delay={0.05} className="space-y-5">
        <div className="relative">
          <FieldLabel required>Bank</FieldLabel>
          <button
            type="button"
            onClick={() => setBankOpen((v) => !v)}
            className="flex h-12 w-full items-center justify-between rounded-2xl border border-border bg-background px-4 text-sm"
          >
            <span
              className={
                selectedBankName ? "text-foreground" : "text-muted-foreground"
              }
            >
              {selectedBankName || "Select bank"}
            </span>
            <ChevronDown size={16} className="text-muted-foreground" />
          </button>
          {bankOpen && (
            <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-60 overflow-y-auto rounded-2xl border border-border bg-card shadow-elegant">
              {bankList.map((b) => (
                <button
                  key={b.code}
                  type="button"
                  onClick={() => {
                    setForm((f) => ({ ...f, bank_code: b.code }));
                    setSelectedBankName(b.name);
                    setBankOpen(false);
                    if (form.account_number.length === 10)
                      setResolvedName("Account verified");
                  }}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-muted"
                >
                  <span>{b.name}</span>
                  {form.bank_code === b.code && (
                    <Check size={14} className="text-primary" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <FieldLabel required>Account number</FieldLabel>
          <input
            className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none focus:border-primary"
            placeholder="0123456789"
            value={form.account_number}
            inputMode="numeric"
            onChange={(e) => handleAccountNumber(e.target.value)}
          />
          {resolvedName && (
            <p className="mt-1.5 text-right text-xs font-medium text-success">
              {resolvedName}
            </p>
          )}
        </div>

        <div>
          <FieldLabel required>Password</FieldLabel>
          <input
            className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none focus:border-primary"
            placeholder="Enter your i-sew password"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
          />
        </div>

        <Button
          onClick={() => mutation.mutate(form)}
          disabled={!isReady || mutation.isPending}
          size="lg"
          className="w-full"
        >
          {mutation.isPending ? "Saving…" : "Save bank account"}
        </Button>
        <PaystackBadge />
      </WalletCard>
    </WalletShell>
  );
}
