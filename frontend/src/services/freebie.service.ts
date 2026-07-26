import api from "./api";

export const getFreebies = async () => {
  const res = await api.get("/api/freebies");
  return res.data;
};

export const getFreebieDetail = async (id: string) => {
  const res = await api.get(`/api/freebies/${id}`);
  return res.data;
};

export const cutFreebiePrice = async (id: string) => {
  const res = await api.post(`/api/freebies/${id}/cut`);
  return res.data;
};

export const claimFreebie = async (id: string) => {
  const res = await api.post(`/api/freebies/${id}/claim`);
  return res.data;
};