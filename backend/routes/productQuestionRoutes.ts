import { Router } from "express";

import {
  askQuestion,
  getProductQuestions,
  answerQuestion,
  deleteQuestion,
} from "../controllers/productQuestionController";

import { protect, adminOnly } from "../middleware/auth";

const router = Router();

// Public — anyone can read questions for a product
router.get("/product/:productId", getProductQuestions);

// Logged-in users can ask a question
router.post("/", protect, askQuestion);

// Admin/Seller — answer or remove a question
router.put("/:id/answer", protect, adminOnly, answerQuestion);
router.delete("/:id", protect, adminOnly, deleteQuestion);

export default router;