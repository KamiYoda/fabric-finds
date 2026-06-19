export interface FabricProductColor {
  id: string;
  name: string;
  swatch: string; // image url
}

export interface FabricProduct {
  id: string;
  name: string;
  description: string;
  pricePerYard: number;
  images: string[];
  colors: FabricProductColor[];
  unit?: "Yards" | "Pieces";
}

export interface FabricMerchantReview {
  id: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  date: string;
  body: string;
}

export interface FabricMerchant {
  id: string;
  name: string;
  shopName?: string;
  image: string;
  rating: number;
  verified: boolean;
  bio?: string;
  about?: string;
  tags?: string[];
  isSaved?: boolean;
  // detail page
  orders?: number;
  completionRate?: number;
  replyTime?: string;
  avgDelivery?: string;
  dressDelivery?: string;
  reviewsAverage?: number;
  reviewsCount?: number;
  reviewsDistribution?: Record<1 | 2 | 3 | 4 | 5, number>;
  reviews?: FabricMerchantReview[];
  products?: FabricProduct[];
}

const SAMPLE_REVIEW =
  "Freddy Han really blew my mind with his delivery. Never seen anythin like it, it's the real definition of WHAT I ORDERED IS EXACTLY WHAT I GOT!";

const REVIEWERS: FabricMerchantReview[] = [
  {
    id: "r1",
    authorName: "Abija Nkem",
    authorAvatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=70",
    rating: 5,
    date: "3 days ago",
    body: SAMPLE_REVIEW,
  },
  {
    id: "r2",
    authorName: "Prince Sharkiru",
    authorAvatar:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=120&q=70",
    rating: 5,
    date: "3 days ago",
    body: SAMPLE_REVIEW,
  },
  {
    id: "r3",
    authorName: "Prince Sharkiru",
    authorAvatar:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=120&q=70",
    rating: 5,
    date: "3 days ago",
    body: SAMPLE_REVIEW,
  },
];

const ASO_OKE_COLORS: FabricProductColor[] = [
  {
    id: "wine",
    name: "Wine",
    swatch:
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=400&q=70",
  },
  {
    id: "emerald",
    name: "Emerald Green",
    swatch:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=70",
  },
  {
    id: "chocolate",
    name: "Chocolate",
    swatch:
      "https://images.unsplash.com/photo-1606293926249-ed22416bd329?w=400&q=70",
  },
];

const DEFAULT_PRODUCTS: FabricProduct[] = [
  {
    id: "p-aso-oke",
    name: "Quality aso oke",
    description:
      "Hand-woven Aso Oke from master weavers. Soft finish, deep dye, perfect for traditional outfits.",
    pricePerYard: 6000,
    images: [
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=900&q=70",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=900&q=70",
    ],
    colors: ASO_OKE_COLORS,
  },
  {
    id: "p-senator",
    name: "Senator materials",
    description:
      "Premium imported senator materials with a smooth, tailored drape.",
    pricePerYard: 6000,
    images: [
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=70",
    ],
    colors: ASO_OKE_COLORS,
  },
  {
    id: "p-lace",
    name: "Lace",
    description:
      "Delicate African lace with embroidered detail. Pairs beautifully with linings.",
    pricePerYard: 6000,
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=70",
    ],
    colors: ASO_OKE_COLORS,
  },
  {
    id: "p-cashmere",
    name: "Cashmere",
    description:
      "Soft cashmere blend in modern tones. Great for jackets and senators.",
    pricePerYard: 6000,
    images: [
      "https://images.unsplash.com/photo-1606293926249-ed22416bd329?w=900&q=70",
    ],
    colors: ASO_OKE_COLORS,
  },
];

const DEFAULT_ABOUT =
  "About tailor lorem ipsum summary About tailor lorem ipsum summary About tailor lorem ipsum summary About tailor lorem ipsum summary About tailor lorem ipsum summary About tailor lorem ipsum summary";

export const MOCK_FABRIC_MERCHANTS: FabricMerchant[] = [
  {
    id: "fm-1",
    name: "Abete Aso Oke",
    shopName: "Auggy clothings",
    image:
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=600&q=70",
    rating: 4.95,
    verified: true,
    bio: "Premium Aso Oke materials sourced from master weavers in Iseyin.",
    about: DEFAULT_ABOUT,
    tags: ["Aso oke", "Senator materials", "Lace", "Cashmere"],
    orders: 37,
    completionRate: 100,
    replyTime: "Typically replies between 10-15 minutes",
    avgDelivery: "Average delivery timeline - 5-8 days",
    dressDelivery: "Dress delivery after completion - 1 day",
    reviewsAverage: 4.8,
    reviewsCount: 37,
    reviewsDistribution: { 5: 29, 4: 36, 3: 3, 2: 0, 1: 0 },
    reviews: REVIEWERS.concat(REVIEWERS[0]),
    products: DEFAULT_PRODUCTS,
  },
  {
    id: "fm-2",
    name: "E-mmaculate Ent.",
    shopName: "E-mmaculate clothings",
    image:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=70",
    rating: 4.95,
    verified: true,
    bio: "Suiting fabrics, cashmere and senator wear specialists.",
    about: DEFAULT_ABOUT,
    tags: ["Suiting", "Cashmere", "Senator"],
    orders: 21,
    completionRate: 100,
    replyTime: "Typically replies between 10-15 minutes",
    avgDelivery: "Average delivery timeline - 4-6 days",
    dressDelivery: "Dress delivery after completion - 1 day",
    reviewsAverage: 4.7,
    reviewsCount: 21,
    reviewsDistribution: { 5: 18, 4: 2, 3: 1, 2: 0, 1: 0 },
    reviews: REVIEWERS,
    products: DEFAULT_PRODUCTS,
  },
  {
    id: "fm-3",
    name: "Iya Kofo Laces",
    shopName: "Iya Kofo store",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=70",
    rating: 4.95,
    verified: true,
    bio: "African lace and Ankara prints in every colour.",
    about: DEFAULT_ABOUT,
    tags: ["Lace", "Ankara", "Prints"],
    products: DEFAULT_PRODUCTS,
  },
  {
    id: "fm-4",
    name: "Haduru Fabric Materials",
    shopName: "Haduru store",
    image:
      "https://images.unsplash.com/photo-1606293926249-ed22416bd329?w=600&q=70",
    rating: 4.95,
    verified: true,
    bio: "Wholesale fabric materials across all categories.",
    about: DEFAULT_ABOUT,
    tags: ["Wholesale", "Variety"],
    products: DEFAULT_PRODUCTS,
  },
  {
    id: "fm-5",
    name: "GG Ent.",
    shopName: "GG store",
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=70",
    rating: 4.75,
    verified: true,
    bio: "Damask, brocade and bridal materials.",
    about: DEFAULT_ABOUT,
    tags: ["Damask", "Brocade", "Bridal"],
    products: DEFAULT_PRODUCTS,
  },
  {
    id: "fm-6",
    name: "Tiwa's Fabric Hub",
    shopName: "Tiwa store",
    image:
      "https://images.unsplash.com/photo-1612215047504-32f9c25e8b0a?w=600&q=70",
    rating: 4.75,
    verified: true,
    bio: "Modern fabrics for contemporary tailoring.",
    about: DEFAULT_ABOUT,
    tags: ["Modern", "Plain", "Coloured"],
    products: DEFAULT_PRODUCTS,
  },
  {
    id: "fm-7",
    name: "King Pahru",
    shopName: "King Pahru store",
    image:
      "https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=600&q=70",
    rating: 4.95,
    verified: true,
    bio: "Premium wax prints and Ankara fabrics.",
    about: DEFAULT_ABOUT,
    tags: ["Wax", "Ankara"],
    products: DEFAULT_PRODUCTS,
  },
  {
    id: "fm-8",
    name: "Tiwani Stores",
    shopName: "Tiwani store",
    image:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=70",
    rating: 4.95,
    verified: true,
    bio: "Eyelet lace and embroidered materials.",
    about: DEFAULT_ABOUT,
    tags: ["Eyelet", "Embroidered"],
    products: DEFAULT_PRODUCTS,
  },
  {
    id: "fm-9",
    name: "Aunt Grace Store",
    shopName: "Aunt Grace store",
    image:
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=600&q=70",
    rating: 4.95,
    verified: true,
    bio: "Ankara wax prints and traditional fabrics.",
    about: DEFAULT_ABOUT,
    tags: ["Ankara", "Traditional"],
    products: DEFAULT_PRODUCTS,
  },
  {
    id: "fm-10",
    name: "Roheemah Int.",
    shopName: "Roheemah store",
    image:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=70",
    rating: 4.95,
    verified: true,
    bio: "Imported senator and suiting fabrics.",
    about: DEFAULT_ABOUT,
    tags: ["Imported", "Senator"],
    products: DEFAULT_PRODUCTS,
  },
];

export function getMerchant(id: string): FabricMerchant | undefined {
  return MOCK_FABRIC_MERCHANTS.find((m) => m.id === id);
}
