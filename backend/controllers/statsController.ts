import { Request, Response } from "express";
import Order from "../models/Order";
import Product from "../models/Product";
import User from "../models/User";

// ===============================
// Dashboard Summary Cards
// ===============================
export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: "customer" });

    const pendingOrders = await Order.countDocuments({
      orderStatus: { $nin: ["Delivered", "Cancelled"] },
    });

    const revenueAgg = await Order.aggregate([
      {
        $match: {
          orderStatus: { $ne: "Cancelled" },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    const lowStockProducts = await Product.countDocuments({ stock: { $lte: 5 } });

    return res.status(200).json({
      success: true,
      summary: {
        totalOrders,
        totalProducts,
        totalCustomers,
        pendingOrders,
        totalRevenue,
        lowStockProducts,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard summary",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Revenue Chart (last 7 days)
// ===============================
export const getRevenueChart = async (req: Request, res: Response) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const revenue = await Order.aggregate([
      {
        $match: {
          orderStatus: { $ne: "Cancelled" },
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json({ success: true, revenue });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch revenue chart",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Recent Orders (last 5)
// ===============================
export const getRecentOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent orders",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Top Selling Products
// ===============================
export const getTopProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find()
      .sort({ sold: -1 })
      .limit(5)
      .select("name sold price images stock");

    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch top products",
      error: error instanceof Error ? error.message : error,
    });
  }
};