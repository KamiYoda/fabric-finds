// lib/api/orderTypes.ts
// Derived from GET /orders and GET /orders/:id response shapes

export type OrderStatus =
  | "draft"
  | "sent"
  | "confirmed"
  | "awaiting_fabric"
  | "fabric_sent"
  | "in_progress"
  | "completed"
  | "acknowledged"
  | "closed";

export interface OrderTailor {
  id: string;
  name?: string;
  business_name?: string;
  shop_name?: string;
  profile_photo?: string;
  avatar?: string;
  region?: string;
  rating?: number | string;
}

export interface OrderCategory {
  id: number;
  name: string;
  gender: string;
  image_url?: string;
}

export interface OrderStyle {
  id: number;
  name: string;
  outfit_category_id: number;
  image_url?: string;
}

export interface OrderStyleDetail {
  id: number;
  order_id: string;
  attribute: string;
  value: string;
}

export interface OrderMeasurement {
  id: string;
  label: string;
  unit: string;
  neck?: string | null;
  chest?: string | null;
  burst?: string | null;
  waist_upper?: string | null;
  waist_lower?: string | null;
  shoulder?: string | null;
  sleeve?: string | null;
  arm_length?: string | null;
  hips?: string | null;
  inseam?: string | null;
  thigh?: string | null;
  knee?: string | null;
  ankle?: string | null;
  trouser_length?: string | null;
}

export interface OrderMilestone {
  id: string;
  title: string;
  percentage: number;
  photos?: string[];
  created_at: string;
}

export interface ApiOrder {
  id: string;
  order_number: string;
  customer_id: string;
  tailor_id: string | null;
  outfit_category_id: number;
  outfit_style_id: number;
  title: string;
  gender: string;
  description: string | null;
  measurement_id: string;
  fabric_provider: "tailor" | "customer";
  style_reference_photos: string[];
  phone_number: string;
  delivery_address: string;
  region: string;
  status: OrderStatus;
  estimated_timeline_days: number | null;
  proposed_amount: string | number | null;
  fabric_cost: string | number | null;
  subtotal: string | number | null;
  total_amount: string | number | null;
  paid_amount: string | number | null;
  notes_for_tailor: string | null;
  order_sent_at: string | null;
  payment_made_at: string | null;
  fabric_sent_at: string | null;
  fabric_acknowledged_at: string | null;
  work_started_at: string | null;
  completed_at: string | null;
  acknowledged_at: string | null;
  created_at: string;
  updated_at: string;
  tailor: OrderTailor | null;
  outfit_category: OrderCategory | null;
  outfit_style?: OrderStyle | null;
  style_details?: OrderStyleDetail[];
  measurement?: OrderMeasurement | null;
  milestones: OrderMilestone[];
  fabric_dispatch: unknown | null;
  chat: unknown | null;
}

// Map API status → UI display stage
export type UIStage =
  | "review"
  | "confirmed"
  | "awaiting_fabric"
  | "fabric_sent"
  | "work_started"
  | "cutting_done"
  | "ready_for_ack"
  | "closed";

export function statusToStage(status: OrderStatus): UIStage {
  switch (status) {
    case "draft":
    case "sent":
      return "review";
    case "confirmed":
      return "confirmed";
    case "awaiting_fabric":
      return "awaiting_fabric";
    case "fabric_sent":
      return "fabric_sent";
    case "in_progress":
      return "work_started";
    case "completed":
      return "ready_for_ack";
    case "acknowledged":
    case "closed":
      return "closed";
    default:
      return "review";
  }
}

// Map API status → orders list tab
export type OrderTab = "Pending" | "Ongoing" | "Completed";

export function statusToTab(status: OrderStatus): OrderTab {
  switch (status) {
    case "draft":
    case "sent":
    case "confirmed":
      return "Pending";
    case "awaiting_fabric":
    case "fabric_sent":
    case "in_progress":
    case "completed":
      return "Ongoing";
    case "acknowledged":
    case "closed":
      return "Completed";
    default:
      return "Pending";
  }
}

export function orderProgress(status: OrderStatus): number {
  switch (status) {
    case "awaiting_fabric":
      return 10;
    case "fabric_sent":
      return 20;
    case "in_progress":
      return 55;
    case "completed":
      return 100;
    default:
      return 0;
  }
}

export function orderProgressLabel(status: OrderStatus): string {
  switch (status) {
    case "awaiting_fabric":
      return "Not started";
    case "fabric_sent":
      return "Not started";
    case "in_progress":
      return "Started work";
    case "completed":
      return "Awaiting";
    default:
      return "";
  }
}

export function tailorDisplayName(tailor: OrderTailor | null): string {
  if (!tailor) return "No tailor assigned";
  return tailor.name ?? tailor.business_name ?? tailor.shop_name ?? "Tailor";
}

export function tailorAvatar(tailor: OrderTailor | null): string | null {
  if (!tailor) return null;
  return tailor.avatar ?? tailor.profile_photo ?? null;
}

export function formatAmount(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return "—";
  const n = Number(val);
  return Number.isFinite(n) ? `₦${n.toLocaleString()}` : "—";
}