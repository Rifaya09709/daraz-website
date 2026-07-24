import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User";

// Generate JWT Token
const generateToken = (userId: string) => {
 return jwt.sign(
  { id: userId },
  process.env.JWT_SECRET as string,
  { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as jwt.SignOptions
);
};

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ===============================
// Register User
// ===============================
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const existingPhone = await User.findOne({ phone });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    const user = await User.create({ name, email, phone, password });

    const token = generateToken(user._id.toString());

    const userResponse = user.toObject();
    delete (userResponse as any).password;

    return res.status(201).json({
      success: true,
      token,
      user: userResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Login User
// ===============================
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id.toString());

    const userResponse = user.toObject();
    delete (userResponse as any).password;

    return res.status(200).json({
      success: true,
      token,
      user: userResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Get Profile
// ===============================
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Update Profile
// ===============================
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, phone, profileImage } = req.body;

    const updateData: Record<string, any> = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (profileImage) updateData.profileImage = profileImage;

    const user = await User.findByIdAndUpdate(
      (req as any).user.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Profile update failed",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Change Password
// ===============================
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById((req as any).user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Password change failed",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Refresh Token
// ===============================
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const token = generateToken(user._id.toString());

    return res.status(200).json({ success: true, token });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Token refresh failed",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Logout
// ===============================
export const logout = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Delete Account
// ===============================
export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete((req as any).user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Account deletion failed",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ===============================
// Google Auth
// ===============================
export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ success: false, message: "Invalid Google token" });
    }

    let user = await User.findOne({ email: payload.email });

    if (!user) {
      user = await User.create({
        name: payload.name,
        email: payload.email,
        password: Math.random().toString(36).slice(-12),
        phone: `google_${payload.sub}`,
      });
    }

    const token = generateToken(user._id.toString());
    const userResponse = user.toObject();
    delete (userResponse as any).password;

    return res.status(200).json({ success: true, token, user: userResponse });
  } catch (error) {
    console.error("Google auth error:", error);
    return res.status(500).json({
      success: false,
      message: "Google sign-in failed",
      error: error instanceof Error ? error.message : error,
    });
  }
};