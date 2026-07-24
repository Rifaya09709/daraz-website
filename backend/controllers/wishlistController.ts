import { Request, Response } from "express";
import Wishlist from "../models/Wishlist";
import Product from "../models/Product";

// ===============================
// Get Wishlist
// ===============================
export const getWishlist = async (req: Request, res: Response) => {
  try {
    let wishlist = await Wishlist.findOne({
      user: (req as any).user.id,
    }).populate("products.product");

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: (req as any).user.id,
        products: [],
      });
    }

    return res.status(200).json({ success: true, wishlist });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Add Product To Wishlist
// ===============================
export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId is required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let wishlist = await Wishlist.findOne({
  user: (req as any).user.id,
}).populate("products.product");

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: (req as any).user.id,
        products: [],
      });
    }

    const exists = wishlist.products.find(
      (item) => item.product.toString() === productId
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Product already exists in wishlist",
      });
    }

    wishlist.products.push({
      product: product._id,
      addedAt: new Date(),
    });

    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add wishlist",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Remove Product From Wishlist
// ===============================
export const removeWishlistItem = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: (req as any).user.id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    wishlist.products = wishlist.products.filter(
      (item) => item.product.toString() !== productId
    ) as any;

    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Wishlist item removed",
      wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to remove wishlist item",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Clear Wishlist
// ===============================
export const clearWishlist = async (req: Request, res: Response) => {
  try {
    const wishlist = await Wishlist.findOne({ user: (req as any).user.id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    wishlist.products = [];

    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to clear wishlist",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Wishlist Count
// ===============================
export const wishlistCount = async (req: Request, res: Response) => {
  try {
    const wishlist = await Wishlist.findOne({ user: (req as any).user.id });

    return res.status(200).json({
      success: true,
      count: wishlist ? wishlist.products.length : 0,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist count",
      error: error instanceof Error ? error.message : error,
    });
  }
};