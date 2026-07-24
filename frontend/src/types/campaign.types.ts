export interface CampaignCategory {
  label: string;
  emoji: string; // kept as a tiny fallback badge, not the main visual anymore
  imageKeyword: string; // e.g. "clothing", "smartphone" — used to fetch a relevant real photo
}

export interface CampaignVoucher {
  discountLabel: string; // e.g. "10% OFF"
  title: string;
  minSpend: string; // e.g. "Min. Spend ৳399"
  validity: string; // e.g. "22/07/2026 - 31/07/2026"
}

export interface CampaignStep {
  title: string;
  description: string;
}

export interface CampaignProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  tag?: string; // e.g. "FREE DELIVERY", "PAYDAY SALE"
}

export type CampaignLayout = "shipping" | "deals";

export interface CampaignConfig {
  slug: string;
  layout: CampaignLayout;
  pageTitle: string;
  themeColor: string; // tailwind color name, e.g. "emerald", "amber"
  heroHeadline: string;
  heroSubtext: string;
  categories: CampaignCategory[];
  voucher?: CampaignVoucher;
  steps?: CampaignStep[]; // used by "shipping" layout
  tabs?: string[]; // used by "deals" layout
  products: CampaignProduct[];
}