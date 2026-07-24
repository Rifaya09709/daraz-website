
import { Request, Response } from "express";
import Cart from "../models/Cart";
import Product from "../models/Product";
import Coupon from "../models/Coupon";

// ===============================
// Get User Cart
// ===============================
export const getCart = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.findOne({
      user: (req as any).user.id,
    })

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: { items: [], totalAmount: 0, discount: 0 },
      });
    }

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Add To Cart
// ===============================
export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Valid productId and quantity are required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock available",
      });
    }

    let cart = await Cart.findOne({ user: (req as any).user.id });

    if (!cart) {
      cart = await Cart.create({
        user: (req as any).user.id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url || "",
        price: product.discountPrice || product.price,
        quantity,
      });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Update Cart Quantity
// ===============================
export const updateCartQuantity = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({ user: (req as any).user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    item.quantity = quantity;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update cart",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Remove Cart Item
// ===============================
export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: (req as any).user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    ) as any;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item removed successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to remove item",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Clear Cart
// ===============================
export const clearCart = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: (req as any).user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    cart.discount = 0;
    cart.couponCode = "";

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Apply Coupon (Fixed — real DB check)
// ===============================
export const applyCoupon = async (req: Request, res: Response) => {
  try {
    const { couponCode } = req.body;

    if (!couponCode) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    const cart = await Cart.findOne({ user: (req as any).user.id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    if (coupon.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Coupon has expired",
      });
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: "Coupon usage limit reached",
      });
    }

    // Subtotal before discount
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (subtotal < coupon.minPurchase) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase of ₹${coupon.minPurchase} required for this coupon`,
      });
    }

    let discount =
      coupon.discountType === "percentage"
        ? (subtotal * coupon.discountValue) / 100
        : coupon.discountValue;

    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }

    cart.couponCode = coupon.code;
    cart.discount = discount;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to apply coupon",
      error: error instanceof Error ? error.message : error,
    });
  }
};
