
import api from "./api";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

export interface PlaceOrderData {
  shippingAddress: ShippingAddress;
  paymentMethod: "COD" | "CARD" | "UPI";
}

export const placeOrder = async (data: PlaceOrderData) => {
  const response = await api.post("/orders/place", data);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get("/orders/my-orders");
  return response.data;
};

export const getOrderById = async (orderId: string) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

export const cancelOrder = async (orderId: string) => {
  const response = await api.put(`/orders/cancel/${orderId}`);
  return response.data;
};

export const trackOrder = async (orderId: string) => {
  const response = await api.get(`/orders/track/${orderId}`);
  return response.data;
};
