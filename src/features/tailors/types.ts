export interface Tailor {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  specialties: string[];
  avatar?: string;
  bio?: string;
  completedOrders?: number;
  completion_rate?: string;
  acceptance_rate?: string;
  responseTime?: string;
  yearsExperience?: number;
  isSaved?: boolean;
}

export interface TailorBid {
  tailorId: string;
  tailorName: string;
  amount: number;
  estimatedDays: number;
  message?: string;
}

export interface TailorReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  orderName?: string;
}
