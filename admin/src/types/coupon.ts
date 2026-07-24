export interface Coupon {
  _id: string;
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minPurchase: number;
  maxDiscount?: number;
  expiresAt: string;
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
  createdAt: string;
  updatedAt: string;
}