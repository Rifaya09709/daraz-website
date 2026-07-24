import api from "./api";

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
}

export const getProducts = async (params?: ProductQuery) => {
  const response = await api.get("/products", { params });
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (formData: FormData) => {
  const response = await api.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateProduct = async (id: string, formData: FormData) => {
  const response = await api.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const removeProductImage = async (id: string, imageIndex: number) => {
  const response = await api.delete(`/products/${id}/image/${imageIndex}`);
  return response.data;
};