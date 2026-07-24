import { Router } from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  removeProductImage,
  addReview,
  getFeaturedProducts,
  getFlashSaleProducts,
  getTrendingProducts,
  getLatestProducts,
  getRelatedProducts,
} from "../controllers/productController";

import { protect, sellerOnly } from "../middleware/auth";
import { uploadMultiple } from "../config/multer";

const router = Router();

// Public Routes
router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/flash-sale", getFlashSaleProducts);
router.get("/trending", getTrendingProducts);
router.get("/latest", getLatestProducts);
router.get("/related/:id", getRelatedProducts);
router.get("/:id", getProductById);

// Protected Routes (Seller/Admin)
router.post("/", protect, sellerOnly, uploadMultiple, createProduct);
router.put("/:id", protect, sellerOnly, uploadMultiple, updateProduct);
router.delete("/:id", protect, sellerOnly, deleteProduct);
router.delete("/:id/image/:imageIndex", protect, sellerOnly, removeProductImage);

// Protected Routes (Any logged-in customer)
router.post("/review/:id", protect, addReview);

export default router;
