
import api from "./api";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export const login = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const register = async (data: RegisterData) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const updateProfile = async (data: {
  name?: string;
  phone?: string;
  profileImage?: string;
}) => {
  const response = await api.put("/auth/profile", data);
  return response.data;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await api.put("/auth/change-password", data);
  return response.data;
};

export const logoutApi = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};
