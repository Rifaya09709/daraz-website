import api from "./api";

export const getCart = async () => {
  const response = await api.get("/api/cart");
  return response.data;
};

export const addToCart = async (productId: string, quantity: number) => {
  const response = await api.post("/api/cart/add", { productId, quantity });
  return response.data;
};

export const updateCart = async (productId: string, quantity: number) => {
  const response = await api.put(`/api/cart/update/${productId}`, { quantity });
  return response.data;
};

export const removeCartItem = async (productId: string) => {
  const response = await api.delete(`/api/cart/remove/${productId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete("/api/cart/clear");
  return response.data;
};

export const applyCoupon = async (couponCode: string) => {
  const response = await api.post("/api/cart/coupon", { couponCode });
  return response.data;
};