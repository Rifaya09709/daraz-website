import { Request, Response } from "express";
import axios from "axios";

const UNSPLASH_BASE_URL = "https://api.unsplash.com";

// ===============================
// Search Photos (e.g. "shopping", "electronics")
// ===============================
export const searchPhotos = async (req: Request, res: Response) => {
  try {
    const { query, page = 1, per_page = 12 } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "query parameter is required",
      });
    }

    const response = await axios.get(`${UNSPLASH_BASE_URL}/search/photos`, {
      params: { query, page, per_page },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });

    const photos = response.data.results.map((photo: any) => ({
      id: photo.id,
      url: photo.urls.regular,
      thumbUrl: photo.urls.thumb,
      alt: photo.alt_description || query,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
    }));

    return res.status(200).json({
      success: true,
      photos,
      total: response.data.total,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch photos from Unsplash",
      error: error.response?.data || error.message,
    });
  }
};

// ===============================
// Random Photo(s)
// ===============================
export const getRandomPhotos = async (req: Request, res: Response) => {
  try {
    const { query, count = 1 } = req.query;

    const response = await axios.get(`${UNSPLASH_BASE_URL}/photos/random`, {
      params: { query, count },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });

    const rawPhotos = Array.isArray(response.data)
      ? response.data
      : [response.data];

    const photos = rawPhotos.map((photo: any) => ({
      id: photo.id,
      url: photo.urls.regular,
      thumbUrl: photo.urls.thumb,
      alt: photo.alt_description || query || "photo",
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
    }));

    return res.status(200).json({ success: true, photos });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch random photo from Unsplash",
      error: error.response?.data || error.message,
    });
  }
};