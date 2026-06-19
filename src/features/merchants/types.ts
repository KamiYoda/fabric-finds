export interface Merchant {
  id: string;
  name: string;
  shop: string;
  avatar: string;
  verified: boolean;
  bio: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  ordersCount: number;
  completionRate: number;
  replyTime: string;
  deliveryTimeline: string;
  dressDelivery: string;
  isSaved?: boolean;
  distanceKm?: number;
}

export interface FabricVariant {
  id: string;
  label: string;
  image: string;
}

export interface Fabric {
  id: string;
  merchantId: string;
  name: string;
  description: string;
  pricePerYard: number;
  currency: "NGN";
  category: string;
  material: string;
  pattern: string;
  available: boolean;
  images: string[];
  variants: FabricVariant[];
  unit: "Yards" | "Meters";
}

export interface FabricReview {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  body: string;
  createdAt: string;
}

export interface CartItem {
  fabricId: string;
  merchantId: string;
  variantId: string;
  quantity: number;
  pricePerYard: number;
  unit: "Yards" | "Meters";
  name: string;
  image: string;
}

export interface PendingTailorOrder {
  id: string;
  title: string;
  tailorName: string;
  tailorAvatar: string;
  distanceKm: number;
  estDeliveryDays: string;
  estDeliveryFee?: number;
}
