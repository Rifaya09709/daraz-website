import api from "./api";

export const getFreebies = async () => {
  const res = await api.get("/freebies");
  return res.data;
};

export const getFreebieDetail = async (id: string) => {
  const res = await api.get(`/freebies/${id}`);
  return res.data;
};

export const cutFreebiePrice = async (id: string) => {
  const res = await api.post(`/freebies/${id}/cut`);
  return res.data;
};

export const claimFreebie = async (id: string) => {
  const res = await api.post(`/freebies/${id}/claim`);
  return res.data;
};