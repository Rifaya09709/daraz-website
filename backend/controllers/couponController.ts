import { Request, Response } from "express";
import Coupon from "../models/Coupon";

// ===============================
// Create Coupon (Admin)
// ===============================
export const createCoupon = async (req: Request, res: Response) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      expiresAt,
      usageLimit,
    } = req.body;

    if (!code || !discountType || !discountValue || !expiresAt) {
      return res.status(400).json({
        success: false,
        message: "code, discountType, discountValue and expiresAt are required",
      });
    }

    const existing = await Coupon.findOne({ code: code.toUpperCase() });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      expiresAt,
      usageLimit,
    });

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create coupon",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Get All Coupons (Admin)
// ===============================
export const getCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    return res.status(200).json({ success: true, coupons });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch coupons",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Get Single Coupon (Admin)
// ===============================
export const getCouponById = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    return res.status(200).json({ success: true, coupon });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch coupon",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Update Coupon (Admin)
// ===============================
export const updateCoupon = async (req: Request, res: Response) => {
  try {
    const {
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      expiresAt,
      usageLimit,
      isActive,
    } = req.body;

    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    // Note: `code` is intentionally not editable here — changing it after
    // the coupon has been shared/used could break tracking. Delete & recreate instead.
    if (discountType) coupon.discountType = discountType;
    if (discountValue !== undefined) coupon.discountValue = discountValue;
    if (minPurchase !== undefined) coupon.minPurchase = minPurchase;
    if (maxDiscount !== undefined) coupon.maxDiscount = maxDiscount;
    if (expiresAt) coupon.expiresAt = expiresAt;
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
    if (isActive !== undefined) coupon.isActive = isActive;

    await coupon.save();

    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      coupon,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update coupon",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Delete Coupon (Admin)
// ===============================
export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete coupon",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Toggle Active Status (Admin)
// ===============================
export const toggleCouponStatus = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    return res.status(200).json({
      success: true,
      message: `Coupon ${coupon.isActive ? "activated" : "deactivated"}`,
      coupon,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to toggle coupon status",
      error: error instanceof Error ? error.message : error,
    });
  }
};