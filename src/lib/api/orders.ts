// lib/api/orders.ts  — updated OrderPayload only; all other functions unchanged
import { apiRequest } from "./core";

export interface StyleDetail {
  attribute: string;
  value: string;
}

export interface OrderPayload {
  title: string;
  gender: string;
  outfit_category_id: number;
  outfit_style_id: number;
  style_details: StyleDetail[];
  measurement_id: string;
  fabric_provider: string;
  style_reference_photos: string[];
  phone_number: string;
  delivery_address: string;
  region: string;
  notes_for_tailor: string;
  tailor_id: number | null;
}

export function getOrders(params?: {
  status?: string;
  page?: number;
  per_page?: number;
}) {
  const query = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params)
          .filter(([, value]) => value != null)
          .map(([key, value]) => [key, String(value)]),
      ).toString()
    : "";
  return apiRequest<any>(`/orders${query}`, { method: "GET", auth: true }).then(
    (res) => (res && res.data != null ? res.data : res),
  );
}

export function getOrder(orderId: string) {
  return apiRequest<any>(`/orders/${orderId}`, { method: "GET", auth: true });
}

export function createOrder(payload: OrderPayload) {
  return apiRequest<any>("/orders", {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export function sendOrder(orderId: string) {
  return apiRequest<any>(`/orders/${orderId}/send`, {
    method: "POST",
    auth: true,
  });
}

export function confirmOrder(
  orderId: string,
  proposed_amount: number,
  estimated_timeline_days: number,
  total_amount: number,
) {
  return apiRequest<any>(`/orders/${orderId}/confirm`, {
    method: "POST",
    auth: true,
    body: { proposed_amount, estimated_timeline_days, total_amount },
  });
}

export function makePayment(
  orderId: string,
  amount: number,
  wallet_id?: string,
) {
  return apiRequest<any>(`/orders/${orderId}/make-payment`, {
    method: "POST",
    auth: true,
    body: { amount, wallet_id },
  });
}

export function postOrderMilestone(
  orderId: string,
  title: string,
  percentage: number,
  photos?: File[],
) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("percentage", String(percentage));
  photos?.forEach((photo, index) => formData.append(`photos[${index}]`, photo));
  return apiRequest<any>(`/orders/${orderId}/milestones`, {
    method: "POST",
    auth: true,
    formData: true,
    body: formData,
  });
}

export function acknowledgeCompletion(orderId: string) {
  return apiRequest<any>(`/orders/${orderId}/acknowledge-completion`, {
    method: "POST",
    auth: true,
  });
}

export function sendFabric(
  orderId: string,
  tracking_number: string,
  courier?: string,
) {
  return apiRequest<any>(`/orders/${orderId}/fabric/send`, {
    method: "POST",
    auth: true,
    body: { tracking_number, courier },
  });
}

export function acknowledgeFabric(orderId: string) {
  return apiRequest<any>(`/orders/${orderId}/fabric/acknowledge`, {
    method: "POST",
    auth: true,
  });
}

export function updateOrder(orderId: string, payload: Partial<OrderPayload>) {
  return apiRequest<any>(`/orders/${orderId}`, {
    method: "PUT",
    auth: true,
    body: payload,
  });
}

export function deleteOrder(orderId: string) {
  return apiRequest<any>(`/orders/${orderId}`, {
    method: "DELETE",
    auth: true,
  });
}

export function sendOrderToTailor(orderId: string, tailor_id: string | number) {
  return apiRequest<any>(`/orders/${orderId}/send`, {
    method: "POST",
    auth: true,
    body: { tailor_id },
  });
}
