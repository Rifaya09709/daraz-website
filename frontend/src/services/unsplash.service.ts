import api from "./api";

export interface UnsplashPhoto {
  id: string;
  url: string;
  thumbUrl: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
}

export const getRandomUnsplashPhoto = async (query: string) => {
  const response = await api.get("/api/unsplash/random", {
    params: { query, count: 1 },
  });
  return response.data;
};

export const searchUnsplashPhotos = async (query: string, page = 1) => {
  const response = await api.get("/api/unsplash/search", {
    params: { query, page, per_page: 12 },
  });
  return response.data;
};