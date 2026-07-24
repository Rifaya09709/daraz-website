import { Request, Response } from "express";
import Conversation from "../models/Conversation";
import Message from "../models/Message";
import Product from "../models/Product";

// ===============================
// Start or Get Existing Conversation
// ===============================
export const startConversation = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "productId is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const sellerId = product.seller;

    // A customer can't chat with themselves if they're also the seller
    if (String(sellerId) === String(customerId)) {
      return res.status(400).json({ success: false, message: "You cannot chat with yourself" });
    }

    let conversation = await Conversation.findOne({
      customer: customerId,
      seller: sellerId,
      product: productId,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        customer: customerId,
        seller: sellerId,
        product: productId,
      });
    }

    return res.status(200).json({ success: true, conversation });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to start conversation",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Get Message History for a Conversation
// ===============================
export const getMessages = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const userId = (req as any).user.id;
    const role = (req as any).user.role;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    // Admins can view any conversation; customer/seller only their own
    const isParticipant =
      String(conversation.customer) === String(userId) ||
      String(conversation.seller) === String(userId);

    if (!isParticipant && role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "_id name role")
      .sort({ createdAt: 1 });

    return res.status(200).json({ success: true, messages, conversation });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Get My Conversations (Seller/Admin inbox list)
// ===============================
export const getMyConversations = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const role = (req as any).user.role;

    // Admin sees every conversation across all sellers; a plain "seller"
    // only sees conversations where they are the seller; a "customer"
    // only sees their own conversations
    const filter =
      role === "admin"
        ? {}
        : role === "customer"
        ? { customer: userId }
        : { seller: userId };

    const conversations = await Conversation.find(filter)
      .populate("customer", "_id name email")
      .populate("seller", "_id name email")
      .populate("product", "name images")
      .sort({ lastMessageAt: -1 });

    return res.status(200).json({ success: true, conversations });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Send Message (REST fallback — same effect as the socket "send_message"
// event, but over plain HTTP. Useful if the socket connection drops, or
// as the primary path for clients that don't use sockets at all)
// ===============================
export const sendMessageRest = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const role = (req as any).user.role;
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ success: false, message: "Message text is required" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    const isCustomer = String(conversation.customer) === String(userId);
    const isSeller = String(conversation.seller) === String(userId);
    const isAdmin = role === "admin";

    if (!isCustomer && !isSeller && !isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Admin replying on behalf of the seller is still logged as "seller"
    // so it renders on the correct side of the chat for the customer
    const senderRole = isCustomer ? "customer" : "seller";

    const message = await Message.create({
      conversation: conversationId,
      sender: userId,
      senderRole,
      text: text.trim(),
    });

    conversation.lastMessage = text.trim();
    conversation.lastMessageAt = new Date();
    if (senderRole === "customer") {
      conversation.unreadBySeller += 1;
    } else {
      conversation.unreadByCustomer += 1;
    }
    await conversation.save();

    const populatedMessage = await message.populate("sender", "_id name role");

    return res.status(201).json({ success: true, message: populatedMessage });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Mark Conversation as Read
// ===============================
export const markConversationRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const role = (req as any).user.role;
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    const isCustomer = String(conversation.customer) === String(userId);
    const isSeller = String(conversation.seller) === String(userId);
    const isAdmin = role === "admin";

    if (!isCustomer && !isSeller && !isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (isCustomer) {
      conversation.unreadByCustomer = 0;
    } else {
      // Seller or admin reading it clears the seller-side unread count
      conversation.unreadBySeller = 0;
    }
    await conversation.save();

    await Message.updateMany(
      { conversation: conversationId, sender: { $ne: userId } },
      { isRead: true }
    );

    return res.status(200).json({ success: true, message: "Marked as read" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to mark as read",
      error: error instanceof Error ? error.message : error,
    });
  }
};