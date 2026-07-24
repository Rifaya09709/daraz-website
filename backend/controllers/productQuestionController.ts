import { Request, Response } from "express";
import ProductQuestion from "../models/ProductQuestion";

// ===============================
// Ask a Question (Authenticated users)
// ===============================
export const askQuestion = async (req: Request, res: Response) => {
  try {
    const { productId, question } = req.body;
    const userId = (req as any).user._id;

    if (!productId || !question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "productId and question are required",
      });
    }

    const newQuestion = await ProductQuestion.create({
      product: productId,
      user: userId,
      question: question.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Question submitted successfully",
      question: newQuestion,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit question",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Get Questions for a Product (Public)
// Newest first, paginated the same way most of your other list
// endpoints work.
// ===============================
export const getProductQuestions = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const questions = await ProductQuestion.find({ product: productId })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await ProductQuestion.countDocuments({ product: productId });

    return res.status(200).json({
      success: true,
      questions,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch questions",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Answer a Question (Admin / Seller)
// ===============================
export const answerQuestion = async (req: Request, res: Response) => {
  try {
    const { answer, answeredBy } = req.body;

    if (!answer || !answer.trim()) {
      return res.status(400).json({
        success: false,
        message: "answer is required",
      });
    }

    const question = await ProductQuestion.findByIdAndUpdate(
      req.params.id,
      {
        answer: answer.trim(),
        answeredBy: answeredBy || "Seller",
        answeredAt: new Date(),
      },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    return res.status(200).json({ success: true, question });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to answer question",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Delete a Question (Admin)
// ===============================
export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const question = await ProductQuestion.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete question",
      error: error instanceof Error ? error.message : error,
    });
  }
};