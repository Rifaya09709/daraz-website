import { io, Socket } from "socket.io-client";
import api from "./api";

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

export interface ChatMessage {
  _id: string;
  conversation: string;
  sender: {
    _id: string;
    name: string;
    role: string;
  };
  senderRole: "customer" | "seller" | "admin";
  text: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  customer: { _id: string; name: string; email: string };
  seller: { _id: string; name: string; email: string };
  product?: { _id: string; name: string; images: { url: string }[] };
  lastMessage: string;
  lastMessageAt: string;
  unreadByCustomer: number;
  unreadBySeller: number;
}

let socket: Socket | null = null;

export const connectSocket = (): Socket => {
  if (socket?.connected) return socket;

  const token = localStorage.getItem("token");

  socket = io(SOCKET_URL, {
    auth: { token },
    withCredentials: true,
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};

// ===============================
// REST calls
// ===============================

export const startConversation = async (productId: string) => {
  const response = await api.post("/chat/start", { productId });
  return response.data;
};

export const getMessages = async (conversationId: string) => {
  const response = await api.get(`/chat/messages/${conversationId}`);
  return response.data;
};

export const getMyConversations = async () => {
  const response = await api.get("/chat/conversations");
  return response.data;
};

export const markAsRead = async (conversationId: string) => {
  const response = await api.put(`/chat/read/${conversationId}`);
  return response.data;
};

// REST fallback for sending a message — used automatically if the
// socket is disconnected, so a message is never silently lost
export const sendMessageRest = async (conversationId: string, text: string) => {
  const response = await api.post(`/chat/messages/${conversationId}`, { text });
  return response.data;
};

// ===============================
// Socket event helpers (primary path — instant delivery)
// ===============================

export const joinConversation = (conversationId: string) => {
  socket?.emit("join_conversation", conversationId);
};

export const leaveConversation = (conversationId: string) => {
  socket?.emit("leave_conversation", conversationId);
};

// Tries the socket first; if it's not connected, falls back to REST so
// the message still gets delivered (just without the instant push to
// the other side — they'll see it on next poll/refresh)
export const sendMessage = async (conversationId: string, text: string) => {
  if (socket?.connected) {
    socket.emit("send_message", { conversationId, text });
  } else {
    await sendMessageRest(conversationId, text);
  }
};

export const onNewMessage = (callback: (message: ChatMessage) => void) => {
  socket?.on("new_message", callback);
};

export const offNewMessage = (callback: (message: ChatMessage) => void) => {
  socket?.off("new_message", callback);
};