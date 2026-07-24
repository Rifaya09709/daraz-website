import api from "./api";

export interface UnsplashPhoto {
  id: string;
  url: string;
  thumbUrl: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
}

export const searchUnsplashPhotos = async (query: string, page = 1) => {
  const response = await api.get("/unsplash/search", {
    params: { query, page, per_page: 12 },
  });
  return response.data;
};