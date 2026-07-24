import { Router } from "express";

import {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
} from "../controllers/couponController";

import { protect, adminOnly } from "../middleware/auth";

const router = Router();

// All coupon management routes are admin-only
router.get("/", protect, adminOnly, getCoupons);
router.get("/:id", protect, adminOnly, getCouponById);
router.post("/", protect, adminOnly, createCoupon);
router.put("/:id", protect, adminOnly, updateCoupon);
router.put("/:id/toggle", protect, adminOnly, toggleCouponStatus);
router.delete("/:id", protect, adminOnly, deleteCoupon);

export default router;