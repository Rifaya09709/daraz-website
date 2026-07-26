import api from "./api";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const submitContactMessage = async (data: ContactFormData) => {
  const response = await api.post("/api/contact", data);
  return response.data;
};