import { Router } from "express";

import {
  submitContactMessage,
  getContactMessages,
  markMessageAsRead,
  deleteContactMessage,
} from "../controllers/contactController";

import { protect, adminOnly } from "../middleware/auth";

const router = Router();

// Public — anyone can submit a contact message, no login required
router.post("/", submitContactMessage);

// Admin — view/manage submitted messages
router.get("/", protect, adminOnly, getContactMessages);
router.put("/:id/read", protect, adminOnly, markMessageAsRead);
router.delete("/:id", protect, adminOnly, deleteContactMessage);

export default router;