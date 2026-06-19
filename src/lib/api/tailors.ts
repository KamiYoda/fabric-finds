import { apiRequest } from "./core";
import type { Tailor } from "@/features/tailors/types";

export interface TailorFilterParams {
  region?: string;
  outfit_category_id?: string;
  rating?: number;
  page?: number;
  per_page?: number;
}

function normalizeTailor(data: any): Tailor {
  return {
    id: data.id,
    name:
      data.business_name ||
      `${data.user?.first_name} ${data.user?.last_name}`.trim() ||
      "Unknown",
    location: data.user?.region || data.address || "Lagos",
    rating: parseFloat(data.avg_rating || "0"),
    reviewCount: data.total_reviews || 0,
    verified: data.is_verified || false,
    specialties: Array.isArray(data.specialties) ? data.specialties : [],
    avatar: data.user?.profile_photo || undefined,
    bio: data.bio,
    completedOrders: data.total_orders,
    completion_rate: data.completion_rate,
    acceptance_rate: data.acceptance_rate,
    responseTime: data.years_experience
      ? `${data.years_experience}y exp`
      : undefined,
    yearsExperience: data.years_experience,
    isSaved: false,
  };
}

export function getTailors(params: TailorFilterParams = {}) {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, value]) => value != null)
      .map(([key, value]) => [key, String(value)]),
  ).toString();
  return apiRequest<any>(`/tailors${query ? `?${query}` : ""}`, {
    method: "GET",
    auth: true,
  }).then((res) => {
    if (!res) return [];

    // Handle paginated response structure
    const dataArray = res.data?.data || res.data || [];

    // Normalize each tailor
    return Array.isArray(dataArray) ? dataArray.map(normalizeTailor) : [];
  });
}

export function saveTailor(tailorId: string, saved: boolean = true) {
  return apiRequest<any>(`/tailors/${tailorId}/save`, {
    method: "POST",
    auth: true,
    body: { saved },
  });
}

export function getTailorPortfolio(tailorId: string, page: number = 1) {
  return apiRequest<any>(`/tailors/${tailorId}/portfolio?page=${page}`, {
    method: "GET",
    auth: true,
  }).then((res) => {
    if (!res) return { items: [], pagination: null };
    const items = res.data?.data ?? [];
    const pagination = res.data?.data ?? null;
    return {
      items: Array.isArray(items) ? items : [],
      pagination: {
        current_page: res?.data?.current_page,
        last_page: res?.data?.last_page,
        total: res?.data?.total,
        next_page_url: res?.data?.next_page_url,
        prev_page_url: res?.data?.prev_page_url,
      },
    };
  });
}

export function getTailorReviews(tailorId: string, page: number = 1) {
  return apiRequest<any>(`/tailors/${tailorId}/reviews?page=${page}`, {
    method: "GET",
    auth: true,
  }).then((res) => {
    if (!res) return { items: [], pagination: null };
    const items = res.data?.data ?? [];
    const pagination = res.data?.data ?? null;
    return {
      items: Array.isArray(items) ? items : [],
      pagination: {
        current_page: res?.data?.current_page,
        last_page: res?.data?.last_page,
        total: res?.data?.total,
        next_page_url: res?.data?.next_page_url,
        prev_page_url: res?.data?.prev_page_url,
      },
    };
  });
}
