import { Router } from "express";

import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeCartItem,
  clearCart,
  applyCoupon,
} from "../controllers/cartController";

import { protect } from "../middleware/auth";

const router = Router();

// All cart routes require login
router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.put("/update/:productId", protect, updateCartQuantity);
router.delete("/remove/:productId", protect, removeCartItem);
router.delete("/clear", protect, clearCart);
router.post("/coupon", protect, applyCoupon);

export default router;

