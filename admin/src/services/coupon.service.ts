import api from "./api";

export interface CreateCouponData {
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  expiresAt: string;
  usageLimit?: number;
}

export interface UpdateCouponData {
  discountType?: "percentage" | "flat";
  discountValue?: number;
  minPurchase?: number;
  maxDiscount?: number;
  expiresAt?: string;
  usageLimit?: number;
  isActive?: boolean;
}

export const getCoupons = async () => {
  const response = await api.get("/coupons");
  return response.data;
};

export const getCouponById = async (id: string) => {
  const response = await api.get(`/coupons/${id}`);
  return response.data;
};

export const createCoupon = async (data: CreateCouponData) => {
  const response = await api.post("/coupons", data);
  return response.data;
};

export const updateCoupon = async (id: string, data: UpdateCouponData) => {
  const response = await api.put(`/coupons/${id}`, data);
  return response.data;
};

export const toggleCouponStatus = async (id: string) => {
  const response = await api.put(`/coupons/${id}/toggle`);
  return response.data;
};

export const deleteCoupon = async (id: string) => {
  const response = await api.delete(`/coupons/${id}`);
  return response.data;
};