import { Request, Response } from "express";
import ContactMessage from "../models/ContactMessage";

// ===============================
// Submit Contact Message (Public)
// ===============================
export const submitContactMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const contactMessage = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully",
      contactMessage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Get All Contact Messages (Admin)
// ===============================
export const getContactMessages = async (req: Request, res: Response) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Mark Message As Read (Admin)
// ===============================
export const markMessageAsRead = async (req: Request, res: Response) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    return res.status(200).json({ success: true, message });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update message",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Delete Message (Admin)
// ===============================
export const deleteContactMessage = async (req: Request, res: Response) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete message",
      error: error instanceof Error ? error.message : error,
    });
  }
};