import api from "./api";
import { OrderStatus } from "../types/order";

export const getAllOrders = async () => {
  const response = await api.get("/orders/admin/all");
  return response.data;
};

export const getOrderById = async (orderId: string) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
) => {
  const response = await api.put(`/orders/status/${orderId}`, { status });
  return response.data;
};