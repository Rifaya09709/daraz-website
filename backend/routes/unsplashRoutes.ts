import { Router } from "express";

import { searchPhotos, getRandomPhotos } from "../controllers/unsplashController";

const router = Router();

// Public routes — no auth needed, just proxying Unsplash's public search API
router.get("/search", searchPhotos);
router.get("/random", getRandomPhotos);

export default router;