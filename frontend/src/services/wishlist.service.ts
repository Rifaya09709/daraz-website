import api from "./api";

export const getWishlist = async () => {
  const response = await api.get("/wishlist");
  return response.data;
};

export const addToWishlist = async (productId: string) => {
  const response = await api.post("/wishlist/add", { productId });
  return response.data;
};

export const removeFromWishlist = async (productId: string) => {
  const response = await api.delete(`/wishlist/remove/${productId}`);
  return response.data;
};

export const clearWishlist = async () => {
  const response = await api.delete("/wishlist/clear");
  return response.data;
};

export const wishlistCount = async () => {
  const response = await api.get("/wishlist/count");
  return response.data;
};