import { Router } from "express";

import {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  trackOrder,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/orderController";

import { protect, adminOnly } from "../middleware/auth";

const router = Router();

// Customer Routes
router.post("/place", protect, placeOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/track/:id", protect, trackOrder);
router.put("/cancel/:id", protect, cancelOrder);

// Admin Routes
router.get("/admin/all", protect, adminOnly, getAllOrders);
router.put("/status/:id", protect, adminOnly, updateOrderStatus);

// Order Details (keep after specific routes to avoid conflicts)
router.get("/:id", protect, getOrderById);

export default router;
