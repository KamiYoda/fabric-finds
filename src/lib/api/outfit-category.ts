// lib/api/outfits.ts
import { apiRequest } from "./core";

export interface OutfitCategory {
  id: number;
  name: string;
  gender?: string;
  image_url?: string;
  [key: string]: unknown;
}

export interface OutfitStyle {
  id: number;
  name: string;
  image_url?: string;
  outfit_category_id: number;
  [key: string]: unknown;
}

function extractArray(res: any): any[] {
  if (Array.isArray(res)) return res;
  if (res && typeof res === "object") {
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray(res.data.data)) return res.data.data;
  }
  return [];
}

export function getOutfitCategories(): Promise<OutfitCategory[]> {
  return apiRequest<any>("/outfit-categories", {
    method: "GET",
    auth: false,
  }).then(extractArray);
}

export function getOutfitStyles(categoryId: number): Promise<OutfitStyle[]> {
  return apiRequest<any>(`/outfit-categories/${categoryId}/styles`, {
    method: "GET",
    auth: false,
  }).then(extractArray);
}