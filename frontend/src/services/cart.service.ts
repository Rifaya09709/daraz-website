import api from "./api";

export const getCart = async () => {
  const response = await api.get("/cart");
  return response.data;
};

export const addToCart = async (productId: string, quantity: number) => {
  const response = await api.post("/cart/add", { productId, quantity });
  return response.data;
};

export const updateCart = async (productId: string, quantity: number) => {
  const response = await api.put(`/cart/update/${productId}`, { quantity });
  return response.data;
};

export const removeCartItem = async (productId: string) => {
  const response = await api.delete(`/cart/remove/${productId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete("/cart/clear");
  return response.data;
};

export const applyCoupon = async (couponCode: string) => {
  const response = await api.post("/cart/coupon", { couponCode });
  return response.data;
};