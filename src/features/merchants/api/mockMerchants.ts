import type {
  Merchant,
  Fabric,
  FabricReview,
  PendingTailorOrder,
} from "../types";

const IMG = {
  asoOke:
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=70",
  senator:
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=70",
  lace: "https://images.unsplash.com/photo-1605518293497-25b3e0c5dcdf?w=600&q=70",
  cashmere:
    "https://images.unsplash.com/photo-1601762603339-fd61e28b698a?w=600&q=70",
  wine: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=70",
  emerald:
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=70",
  chocolate:
    "https://images.unsplash.com/photo-1601762603339-fd61e28b698a?w=400&q=70",
  merchantAvatar:
    "https://images.unsplash.com/photo-1605518293497-25b3e0c5dcdf?w=200&q=70",
  user1:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=70",
  user2:
    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=70",
  user3:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=70",
  freddy:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=70",
};

export const MERCHANTS: Merchant[] = [
  {
    id: "m1",
    name: "Abete Aso Oke",
    shop: "Auggy clothings",
    avatar: IMG.merchantAvatar,
    verified: true,
    bio: "About merchant lorem ipsum summary. Trusted source for premium aso-oke, lace and senator materials across Lagos and beyond.",
    specialties: ["Aso-oke", "Senator materials", "Lace", "Cashmere"],
    rating: 4.9,
    reviewCount: 37,
    ordersCount: 37,
    completionRate: 100,
    replyTime: "Typically replies between 10-15 minutes",
    deliveryTimeline: "Average delivery timeline - 5-8 days",
    dressDelivery: "Dress delivery after completion - 1 day",
    distanceKm: 12,
  },
  {
    id: "m2",
    name: "Royal Fabrics House",
    shop: "Royal collection",
    avatar:
      "https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=200&q=70",
    verified: true,
    bio: "Importers of high quality lace, ankara, and adire materials. Wholesale and retail.",
    specialties: ["Ankara", "Adire", "Lace"],
    rating: 4.7,
    reviewCount: 22,
    ordersCount: 84,
    completionRate: 98,
    replyTime: "Typically replies within 30 minutes",
    deliveryTimeline: "Average delivery timeline - 3-6 days",
    dressDelivery: "Dress delivery after completion - 1 day",
    distanceKm: 8,
  },
  {
    id: "m3",
    name: "Mama Ngozi Textiles",
    shop: "Ngozi & sons",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=70",
    verified: false,
    bio: "Family-owned textile shop specialising in adire, cashmere and senator.",
    specialties: ["Adire", "Cashmere", "Senator"],
    rating: 4.5,
    reviewCount: 11,
    ordersCount: 32,
    completionRate: 95,
    replyTime: "Typically replies within 1 hour",
    deliveryTimeline: "Average delivery timeline - 6-10 days",
    dressDelivery: "Dress delivery after completion - 2 days",
    distanceKm: 21,
  },
];

export const FABRICS: Fabric[] = [
  {
    id: "f1",
    merchantId: "m1",
    name: "Quality aso oke",
    description:
      "Item catalog description. Premium hand-woven aso-oke ideal for traditional outfits.",
    pricePerYard: 6000,
    currency: "NGN",
    category: "Aso-oke",
    material: "Cotton",
    pattern: "Striped",
    available: true,
    unit: "Yards",
    images: [IMG.asoOke, IMG.senator],
    variants: [
      { id: "wine", label: "Wine", image: IMG.wine },
      { id: "emerald", label: "Emerald Green", image: IMG.emerald },
      { id: "chocolate", label: "Chocolate", image: IMG.chocolate },
    ],
  },
  {
    id: "f2",
    merchantId: "m1",
    name: "Senator materials",
    description:
      "Item catalog description. Smooth premium senator fabric — perfect for tailored suits.",
    pricePerYard: 7500,
    currency: "NGN",
    category: "Senator",
    material: "Cashmere blend",
    pattern: "Plain",
    available: true,
    unit: "Yards",
    images: [IMG.senator],
    variants: [
      { id: "navy", label: "Navy", image: IMG.senator },
      { id: "black", label: "Black", image: IMG.chocolate },
    ],
  },
  {
    id: "f3",
    merchantId: "m1",
    name: "Lace",
    description:
      "Item catalog description. Delicate French-style lace for elegant occasions.",
    pricePerYard: 6000,
    currency: "NGN",
    category: "Lace",
    material: "Lace",
    pattern: "Floral",
    available: true,
    unit: "Yards",
    images: [IMG.lace],
    variants: [
      { id: "lilac", label: "Lilac", image: IMG.lace },
      { id: "ivory", label: "Ivory", image: IMG.wine },
    ],
  },
  {
    id: "f4",
    merchantId: "m1",
    name: "Cashmere",
    description:
      "Item catalog description. Soft, luxurious cashmere fabric for premium suits.",
    pricePerYard: 6000,
    currency: "NGN",
    category: "Cashmere",
    material: "Cashmere",
    pattern: "Plain",
    available: false,
    unit: "Yards",
    images: [IMG.cashmere],
    variants: [
      { id: "grey", label: "Grey", image: IMG.cashmere },
      { id: "beige", label: "Beige", image: IMG.wine },
    ],
  },
  {
    id: "f5",
    merchantId: "m2",
    name: "Premium Ankara",
    description:
      "Vibrant Ankara prints from authentic Dutch wax suppliers.",
    pricePerYard: 4500,
    currency: "NGN",
    category: "Ankara",
    material: "Cotton",
    pattern: "Printed",
    available: true,
    unit: "Yards",
    images: [IMG.lace, IMG.wine],
    variants: [
      { id: "red", label: "Red Mix", image: IMG.wine },
      { id: "blue", label: "Blue Mix", image: IMG.emerald },
    ],
  },
  {
    id: "f6",
    merchantId: "m3",
    name: "Adire indigo",
    description: "Traditional hand-dyed adire fabric from Abeokuta.",
    pricePerYard: 5500,
    currency: "NGN",
    category: "Adire",
    material: "Cotton",
    pattern: "Tie-dye",
    available: true,
    unit: "Yards",
    images: [IMG.emerald],
    variants: [{ id: "indigo", label: "Indigo", image: IMG.emerald }],
  },
];

const REVIEWS: FabricReview[] = [
  {
    id: "r1",
    reviewerName: "Abija Nkem",
    reviewerAvatar: IMG.user1,
    rating: 5,
    body: "Freddy Han really blew my mind with his delivery. Never seen anythin like it, it's the real definition of WHAT I ORDERED IS EXACTLY WHAT I GOT!",
    createdAt: "3 days ago",
  },
  {
    id: "r2",
    reviewerName: "Prince Sharkiru",
    reviewerAvatar: IMG.user2,
    rating: 5,
    body: "Freddy Han really blew my mind with his delivery. Never seen anythin like it, it's the real definition of WHAT I ORDERED IS EXACTLY WHAT I GOT!",
    createdAt: "3 days ago",
  },
  {
    id: "r3",
    reviewerName: "Prince Sharkiru",
    reviewerAvatar: IMG.user2,
    rating: 5,
    body: "Freddy Han really blew my mind with his delivery. Never seen anythin like it, it's the real definition of WHAT I ORDERED IS EXACTLY WHAT I GOT!",
    createdAt: "3 days ago",
  },
  {
    id: "r4",
    reviewerName: "Prince Sharkiru",
    reviewerAvatar: IMG.user3,
    rating: 4,
    body: "Freddy Han really blew my mind with his delivery. Never seen anythin like it, it's the real definition of WHAT I ORDERED IS EXACTLY WHAT I GOT!",
    createdAt: "3 days ago",
  },
];

export const PENDING_TAILOR_ORDERS: PendingTailorOrder[] = [
  {
    id: "to1",
    title: "My siu style",
    tailorName: "Freddy Han",
    tailorAvatar: IMG.freddy,
    distanceKm: 16,
    estDeliveryDays: "2-3 days",
    estDeliveryFee: 3500,
  },
  {
    id: "to2",
    title: "Aso Ebi",
    tailorName: "Freddy Han",
    tailorAvatar: IMG.freddy,
    distanceKm: 16,
    estDeliveryDays: "1-2 days",
    estDeliveryFee: 4000,
  },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// "API" functions
export async function listMerchants(params?: {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
  per_page?: number;
}): Promise<{ items: Merchant[]; total: number }> {
  await sleep(150);
  let items = [...MERCHANTS];
  const { search, category, sort } = params || {};
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.shop.toLowerCase().includes(q) ||
        m.specialties.some((s) => s.toLowerCase().includes(q)),
    );
  }
  if (category) {
    items = items.filter((m) =>
      m.specialties.map((s) => s.toLowerCase()).includes(category.toLowerCase()),
    );
  }
  if (sort === "rating") items.sort((a, b) => b.rating - a.rating);
  if (sort === "orders") items.sort((a, b) => b.ordersCount - a.ordersCount);
  return { items, total: items.length };
}

export async function getMerchant(id: string): Promise<Merchant | undefined> {
  await sleep(100);
  return MERCHANTS.find((m) => m.id === id);
}

export async function listMerchantFabrics(
  merchantId: string,
  params?: {
    category?: string;
    material?: string;
    pattern?: string;
    color?: string;
    minPrice?: number;
    maxPrice?: number;
    available?: boolean;
    page?: number;
    per_page?: number;
  },
): Promise<{ items: Fabric[]; total: number; page: number; perPage: number }> {
  await sleep(150);
  let items = FABRICS.filter((f) => f.merchantId === merchantId);
  const {
    category,
    material,
    pattern,
    color,
    minPrice,
    maxPrice,
    available,
    page = 1,
    per_page = 12,
  } = params || {};
  if (category) items = items.filter((f) => f.category === category);
  if (material) items = items.filter((f) => f.material === material);
  if (pattern) items = items.filter((f) => f.pattern === pattern);
  if (color)
    items = items.filter((f) =>
      f.variants.some((v) => v.label.toLowerCase().includes(color.toLowerCase())),
    );
  if (typeof minPrice === "number")
    items = items.filter((f) => f.pricePerYard >= minPrice);
  if (typeof maxPrice === "number")
    items = items.filter((f) => f.pricePerYard <= maxPrice);
  if (typeof available === "boolean")
    items = items.filter((f) => f.available === available);
  const total = items.length;
  const start = (page - 1) * per_page;
  return {
    items: items.slice(start, start + per_page),
    total,
    page,
    perPage: per_page,
  };
}

export async function getFabric(id: string): Promise<Fabric | undefined> {
  await sleep(100);
  return FABRICS.find((f) => f.id === id);
}

export async function getRelatedFabrics(fabricId: string): Promise<Fabric[]> {
  await sleep(100);
  const f = FABRICS.find((x) => x.id === fabricId);
  if (!f) return [];
  return FABRICS.filter(
    (x) => x.id !== fabricId && x.category === f.category,
  ).slice(0, 4);
}

export async function listMerchantReviews(
  merchantId: string,
  page = 1,
  perPage = 10,
): Promise<{
  items: FabricReview[];
  total: number;
  ratingBreakdown: { stars: number; count: number }[];
  average: number;
}> {
  await sleep(150);
  const merchant = MERCHANTS.find((m) => m.id === merchantId);
  const start = (page - 1) * perPage;
  return {
    items: REVIEWS.slice(start, start + perPage),
    total: merchant?.reviewCount ?? REVIEWS.length,
    average: merchant?.rating ?? 4.8,
    ratingBreakdown: [
      { stars: 5, count: 29 },
      { stars: 4, count: 36 },
      { stars: 3, count: 3 },
      { stars: 2, count: 0 },
      { stars: 1, count: 0 },
    ],
  };
}

export async function listPendingTailorOrders(): Promise<PendingTailorOrder[]> {
  await sleep(120);
  return PENDING_TAILOR_ORDERS;
}

export interface FabricOrderPayload {
  merchantId: string;
  items: {
    fabricId: string;
    variantId: string;
    quantity: number;
    unit: string;
  }[];
  delivery: {
    mode: "tailor" | "self";
    tailorOrderId?: string;
    address?: string;
    phone?: string;
  };
}

export async function createFabricOrder(payload: FabricOrderPayload) {
  await sleep(300);
  // Mock id similar to design FM021-IDJS-2026-cta
  const id =
    "FM" +
    String(Math.floor(Math.random() * 900) + 100) +
    "-IDJS-2026-cta";
  return { id, status: "pending_delivery_fee", payload };
}

export async function payFabricOrder(orderId: string, amount: number) {
  await sleep(300);
  return { orderId, amount, status: "paid" };
}
