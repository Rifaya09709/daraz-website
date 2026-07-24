
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import mongoose from "mongoose";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  // =====================================
  // Multer Error
  // =====================================
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      type: "UPLOAD_ERROR",
      message: err.message,
    });
  }

  // =====================================
  // Invalid File Type
  // =====================================
  if (err.message && err.message.includes("Only JPG")) {
    return res.status(400).json({
      success: false,
      type: "FILE_TYPE_ERROR",
      message: err.message,
    });
  }

  // =====================================
  // Mongoose Validation Error
  // =====================================
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e: any) => e.message);

    return res.status(400).json({
      success: false,
      type: "VALIDATION_ERROR",
      errors,
    });
  }

  // =====================================
  // Duplicate Key Error
  // =====================================
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      type: "DUPLICATE_KEY",
      message:
        "Duplicate value found. Email, Phone or SKU already exists.",
    });
  }

  // =====================================
  // Invalid MongoDB ObjectId
  // =====================================
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      type: "INVALID_ID",
      message: "Invalid resource ID.",
    });
  }

  // =====================================
  // JWT Errors
  // =====================================
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      type: "JWT_ERROR",
      message: "Invalid token.",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      type: "TOKEN_EXPIRED",
      message: "Token expired.",
    });
  }

  // =====================================
  // Default Error
  // =====================================
  return res.status(err.statusCode || 500).json({
    success: false,
    type: "SERVER_ERROR",
    message: err.message || "Internal Server Error",
  });
};
