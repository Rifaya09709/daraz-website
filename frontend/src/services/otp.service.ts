import api from "./api";

export const sendOtp = async (phone: string) => {
  const res = await api.post("/api/otp/send", { phone });
  return res.data;
};

export const verifyOtp = async (phone: string, code: string) => {
  const res = await api.post("/api/otp/verify", { phone, code });
  return res.data;
};