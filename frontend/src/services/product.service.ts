import api from "./api";

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  subCategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  warranty?: string;
  sort?: string;
}
// Image-based product search — sends the uploaded image to the backend
// and returns visually similar products
export const searchProductsByImage = async (imageFile: File) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await api.post("/products/search-by-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};


export const getProductsByCategory = async (
  category: string,
  subCategory?: string,
  limit = 20
) => {
  const res = await api.get("/products", {
    params: { category, subCategory, limit },
  });
  return res.data; // { success, products, page, totalPages, totalProducts }
};

export const getProducts = async (params?: ProductQuery) => {
  const response = await api.get("/products", { params });
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getFeaturedProducts = async () => {
  const response = await api.get("/products/featured");
  return response.data;
};

export const getFlashSaleProducts = async () => {
  const response = await api.get("/products/flash-sale");
  return response.data;
};

export const getTrendingProducts = async () => {
  const response = await api.get("/products/trending");
  return response.data;
};

export const getLatestProducts = async () => {
  const response = await api.get("/products/latest");
  return response.data;
};

export const getRelatedProducts = async (id: string) => {
  const response = await api.get(`/products/related/${id}`);
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

export const addReview = async (
  id: string,
  rating: number,
  comment: string
) => {
  const response = await api.post(`/products/review/${id}`, {
    rating,
    comment,
  });
  return response.data;
};