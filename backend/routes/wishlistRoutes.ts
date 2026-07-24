import { Router } from "express";

import {
  getWishlist,
  addToWishlist,
  removeWishlistItem,
  clearWishlist,
  wishlistCount,
} from "../controllers/wishlistController";

import { protect } from "../middleware/auth";

const router = Router();

// All wishlist routes require login
router.get("/", protect, getWishlist);
router.get("/count", protect, wishlistCount);
router.post("/add", protect, addToWishlist);
router.delete("/remove/:productId", protect, removeWishlistItem);
router.delete("/clear", protect, clearWishlist);

export default router;
