import { Router } from "express";

import {
  getDashboardSummary,
  getRevenueChart,
  getRecentOrders,
  getTopProducts,
} from "../controllers/statsController";

import { protect, adminOnly } from "../middleware/auth";

const router = Router();

// All dashboard stats routes are admin-only
router.get("/summary", protect, adminOnly, getDashboardSummary);
router.get("/revenue-chart", protect, adminOnly, getRevenueChart);
router.get("/recent-orders", protect, adminOnly, getRecentOrders);
router.get("/top-products", protect, adminOnly, getTopProducts);

export default router;