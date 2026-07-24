import { Router } from "express";

import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  refreshToken,
  logout,
  deleteAccount,
  googleAuth,
} from "../controllers/authController";

import { protect } from "../middleware/auth";

const router = Router();

// Public Routes
router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);

// Protected Routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.get("/refresh-token", protect, refreshToken);
router.post("/logout", protect, logout);
router.delete("/delete-account", protect, deleteAccount);

export default router;