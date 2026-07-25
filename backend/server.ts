import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import connectDB from "./config/database";

import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import wishlistRoutes from "./routes/wishlistRoutes";
import couponRoutes from "./routes/couponRoutes";
import statsRoutes from "./routes/statsRoutes";
import unsplashRoutes from "./routes/unsplashRoutes";
import contactRoutes from "./routes/contactRoutes";
/*import paymentRoutes from "./routes/paymentRoutes";*/
import productQuestionRoutes from "./routes/productQuestionRoutes";
import otpRoutes from "./routes/otpRoutes";
import chatRoutes from "./routes/chatRoutes";

import { errorHandler } from "./middleware/errorHandler";
import Message from "./models/Message";
import Conversation from "./models/Conversation";
import User from "./models/User";

const app = express();
const httpServer = createServer(app);

// Allow any localhost port (dev only) — Vite auto-picks the next free
// port (5173, 5174, 5175, 5176...) when one is busy, so hardcoding a
// fixed list breaks every time a new dev server grabs a different port.
const isAllowedOrigin = (origin: string | undefined) => {
  if (!origin) return true; // non-browser requests
  if (/^http:\/\/localhost:\d+$/.test(origin)) return true; // local dev
  if (origin === "https://daraz-website-1.onrender.com") return true; // frontend
  if (origin === "https://daraz-website-2.onrender.com") return true; // admin (verify exact URL)
  return false;
};

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

const io = new Server(httpServer, {
  cors: corsOptions,
});

// =====================================
// Connect MongoDB
// =====================================
connectDB();

// =====================================
// Middlewares
// =====================================
app.use(cors(corsOptions));

app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================
// Health Check
// =====================================
app.get("/", (req, res) => {
  res.json({
    success: true,
    project: "Daraz Clone API",
    version: "1.0.0",
    status: "Running",
  });
});

// =====================================
// API Routes
// =====================================
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/unsplash", unsplashRoutes);
app.use("/api/contact", contactRoutes);
/*app.use("/api/payment", paymentRoutes);*/
app.use("/api/questions", productQuestionRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/chat", chatRoutes);

// =====================================
// 404 Route
// =====================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// =====================================
// Global Error Handler
// =====================================
app.use(errorHandler);

// =====================================
// Socket.io — Real-time Chat
// =====================================

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return next(new Error("User not found"));

    (socket as any).user = user;
    next();
  } catch {
    next(new Error("Invalid or expired token"));
  }
});

io.on("connection", (socket) => {
  const user = (socket as any).user;
  console.log(`🔌 Socket connected: ${user.name} (${user.role})`);

  socket.on("join_conversation", (conversationId: string) => {
    socket.join(conversationId);
  });

  socket.on("leave_conversation", (conversationId: string) => {
    socket.leave(conversationId);
  });

  socket.on(
    "send_message",
    async (data: { conversationId: string; text: string }) => {
      try {
        const { conversationId, text } = data;
        if (!text?.trim()) return;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;

        const isParticipant =
          String(conversation.customer) === String(user._id) ||
          String(conversation.seller) === String(user._id);
        const isAdmin = user.role === "admin";

        if (!isParticipant && !isAdmin) return;

        const senderRole =
          String(conversation.customer) === String(user._id) ? "customer" : "seller";

        const message = await Message.create({
          conversation: conversationId,
          sender: user._id,
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

        io.to(conversationId).emit("new_message", populatedMessage);
      } catch (err) {
        console.error("send_message error:", err);
      }
    }
  );

  socket.on("disconnect", () => {
    console.log(`🔌 Socket disconnected: ${user.name}`);
  });
});

// =====================================
// Start Server
// =====================================
const PORT = process.env.PORT || 5001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`💬 Socket.io ready for real-time chat`);
});