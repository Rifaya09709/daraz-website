export interface CampaignCategory {
  label: string;
  emoji: string;
  imageKeyword: string;
}

export interface CampaignStep {
  title: string;
  description: string;
}

export interface CampaignVoucher {
  discountLabel: string;
  title: string;
  minSpend: string;
  validity: string;
}

export interface CampaignProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  tag?: string;
}

export interface CampaignConfig {
  slug: string;
  layout: "shipping" | "deals";
  pageTitle: string;
  themeColor: string;
  heroHeadline: string;
  heroSubtext: string;
  heroImage?: string;
  categories: CampaignCategory[];
  steps?: CampaignStep[];
  voucher?: CampaignVoucher;
  tabs?: string[];
  products: CampaignProduct[];
}