import { apiRequest } from "./core";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WalletBalance {
  available_balance: number;
  spending: number;
  pending: number;
  released: number;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: "debit" | "credit";
  status: "successful" | "pending" | "failed";
  order_id: string | null;
  order_name: string | null;
  order_ref: string | null;
  tailor_name: string | null;
  tailor_avatar: string | null;
  order_status: string | null;
  date: string; // ISO
}

export interface WalletTransactionDetail extends WalletTransaction {
  transaction_id: string;
  spending: number;
  pending: number;
  released: number;
  tailor_id: string | null;
}

export interface SpendingSummaryItem {
  order_id: string;
  order_name: string;
  spending: number;
  pending: number;
  released: number;
}

export interface SavedCard {
  id: string;
  last4: string;
  expiry: string;
  brand: string; // "mastercard" | "visa" | "verve"
  authorization_code: string;
}

export interface SavedBank {
  id: string;
  bank_name: string;
  account_number: string; // masked e.g. "123****890"
  account_name: string;
  bank_logo: string | null;
}

export interface TopUpCardPayload {
  amount: number;
  card_number: string;
  expiry: string; // "DD/MM/YYYY"
  cvv: string;
  save_card: boolean;
}

export interface TopUpBankTransferPayload {
  amount: number;
}

export interface AddBankPayload {
  bank_code: string;
  account_number: string;
  password: string;
}

export interface WithdrawPayload {
  bank_id: string;
  amount: number;
  password: string;
}

export interface WalletTransactionsParams {
  tab?: "history" | "pending";
  page?: number;
  per_page?: number;
}

// ─── API Calls ────────────────────────────────────────────────────────────────

export async function getWalletBalance(): Promise<WalletBalance> {
  const res = await apiRequest<{ data: WalletBalance }>("/wallet/balance", {
    method: "GET",
    auth: true,
  });
  return res.data;
}

export async function getWallet(): Promise<WalletBalance> {
  const res = await apiRequest<{ data: WalletBalance }>("/wallet/balance", {
    method: "GET",
    auth: true,
  });
  return res.data;
}

export async function getWalletTransactions(
  params: WalletTransactionsParams = {},
): Promise<WalletTransaction[]> {
  const query = new URLSearchParams();
  if (params.tab) query.set("tab", params.tab);
  if (params.page) query.set("page", String(params.page));
  if (params.per_page) query.set("per_page", String(params.per_page));
  const res = await apiRequest<{ data: WalletTransaction[] }>(
    `/wallet/transactions?${query.toString()}`,
    { method: "GET", auth: true },
  );
  return res.data;
}

export async function groupTransactionsByDate(
  params: WalletTransactionsParams = {},
): Promise<WalletTransaction[]> {
  const query = new URLSearchParams();
  if (params.tab) query.set("tab", params.tab);
  if (params.page) query.set("page", String(params.page));
  if (params.per_page) query.set("per_page", String(params.per_page));
  const res = await apiRequest<{ data: WalletTransaction[] }>(
    `/wallet/transactions?${query.toString()}`,
    { method: "GET", auth: true },
  );
  return res.data;
}

export async function TransactionType(
  params: WalletTransactionsParams = {},
): Promise<WalletTransaction[]> {
  const query = new URLSearchParams();
  if (params.tab) query.set("tab", params.tab);
  if (params.page) query.set("page", String(params.page));
  if (params.per_page) query.set("per_page", String(params.per_page));
  const res = await apiRequest<{ data: WalletTransaction[] }>(
    `/wallet/transactions?${query.toString()}`,
    { method: "GET", auth: true },
  );
  return res.data;
}

export async function getWalletTransaction(
  transactionId: string,
): Promise<WalletTransactionDetail> {
  const res = await apiRequest<{ data: WalletTransactionDetail }>(
    `/wallet/transactions/${transactionId}`,
    { method: "GET", auth: true },
  );
  return res.data;
}

export async function getSpendingSummary(): Promise<SpendingSummaryItem[]> {
  const res = await apiRequest<{ data: SpendingSummaryItem[] }>(
    "/wallet/spending-summary",
    { method: "GET", auth: true },
  );
  return res.data;
}

export async function getSavedCards(): Promise<SavedCard[]> {
  const res = await apiRequest<{ data: SavedCard[] }>("/wallet/cards", {
    method: "GET",
    auth: true,
  });
  return res.data;
}

export async function topUpWithCard(payload: TopUpCardPayload): Promise<void> {
  await apiRequest("/wallet/topup/card", {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export async function topUpViaBankTransfer(
  payload: TopUpBankTransferPayload,
): Promise<void> {
  await apiRequest("/wallet/topup/bank-transfer", {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export async function getSavedBanks(): Promise<SavedBank[]> {
  const res = await apiRequest<{ data: SavedBank[] }>("/wallet/banks", {
    method: "GET",
    auth: true,
  });
  return res.data;
}

export async function getBankList(): Promise<{ code: string; name: string }[]> {
  const res = await apiRequest<{ data: { code: string; name: string }[] }>(
    "/wallet/bank-list",
    { method: "GET", auth: true },
  );
  return res.data;
}

export async function addBank(payload: AddBankPayload): Promise<void> {
  await apiRequest("/wallet/banks", {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export async function withdraw(payload: WithdrawPayload): Promise<void> {
  await apiRequest("/wallet/withdraw", {
    method: "POST",
    auth: true,
    body: payload,
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
}

export function maskAccountNumber(acct: string): string {
  if (acct.length <= 6) return acct;
  return acct.slice(0, 3) + "****" + acct.slice(-3);
}
