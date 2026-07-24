


import { Request, Response } from "express";
import Order from "../models/Order";
import Cart from "../models/Cart";
import Product from "../models/Product";
import Coupon from "../models/Coupon";

// ===============================
// Place Order
// ===============================
export const placeOrder = async (req: Request, res: Response) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Shipping address and payment method are required",
      });
    }

    const cart = await Cart.findOne({ user: (req as any).user.id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    // Check stock for every item
    for (const item of cart.items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `${item.name} not found`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`,
        });
      }
    }

    // Calculate subtotal directly from items (source of truth)
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const orderNumber = "DRZ" + Date.now().toString().slice(-8);
    const invoiceNumber = "INV" + Date.now().toString().slice(-8);
    const trackingId = "TRK" + Math.floor(Math.random() * 100000000);

    const order = await Order.create({
      orderNumber,
      invoiceNumber,
      trackingId,

      user: (req as any).user.id,
      items: cart.items,
      shippingAddress,
      paymentMethod,

      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",

      subtotal,
      discount: cart.discount,
      shippingCharge: 0,
      tax: 0,

      totalAmount: subtotal - cart.discount,
    });

    // Reduce product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, sold: item.quantity },
      });
    }

    // Increment coupon usage if one was applied
    if (cart.couponCode) {
      await Coupon.findOneAndUpdate(
        { code: cart.couponCode },
        { $inc: { usedCount: 1 } }
      );
    }

    // Clear cart
    cart.items = [];
    cart.discount = 0;
    cart.couponCode = "";

    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Get My Orders
// ===============================
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({
      user: (req as any).user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Get Order Details
// ===============================
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Ensure the order belongs to the requesting user (unless admin)
    const requester = (req as any).user;
    if (
      requester.role !== "admin" &&
      order.user._id.toString() !== requester.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Cancel Order
// ===============================
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.orderStatus === "Delivered" || order.orderStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled",
      });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, sold: -item.quantity },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Track Order
// ===============================
export const trackOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      tracking: {
        trackingId: order.trackingId,
        status: order.orderStatus,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to track order",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Update Order Status (Admin)
// ===============================
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "Pending",
      "Confirmed",
      "Packed",
      "Shipped",
      "Out For Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = status;

    if (status === "Delivered") {
      order.deliveredAt = new Date();
      order.paymentStatus = "Paid";
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Get All Orders (Admin)
// ===============================
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch all orders",
      error: error instanceof Error ? error.message : error,
    });
  }
};
