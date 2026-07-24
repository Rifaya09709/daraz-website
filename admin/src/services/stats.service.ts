import api from "./api";

export const getDashboardSummary = async () => {
  const response = await api.get("/stats/summary");
  return response.data;
};

export const getRevenueChart = async () => {
  const response = await api.get("/stats/revenue-chart");
  return response.data;
};

export const getRecentOrders = async () => {
  const response = await api.get("/stats/recent-orders");
  return response.data;
};

export const getTopProducts = async () => {
  const response = await api.get("/stats/top-products");
  return response.data;
};