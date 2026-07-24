
import { useState, useEffect, useRef } from "react";
import { FaComments, FaTimes, FaPaperPlane } from "react-icons/fa";

import { useAppSelector } from "../../hooks/useAuth";
import {
  connectSocket,
  startConversation,
  getMessages,
  joinConversation,
  leaveConversation,
  sendMessage,
  onNewMessage,
  offNewMessage,
  markAsRead,
  ChatMessage,
} from "../../services/chat.service";

interface ChatWidgetProps {
  productId: string;
  sellerName?: string;
}

// Groups messages by calendar day so we can show "Today" / date dividers
const formatDateDivider = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });
};

const ChatWidget = ({ productId, sellerName }: ChatWidgetProps) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageHandlerRef = useRef<((msg: ChatMessage) => void) | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleOpen = async () => {
    if (!isAuthenticated) {
      setError("Please log in to chat with the seller");
      setIsOpen(true);
      return;
    }

    setIsOpen(true);
    setLoading(true);
    setError("");

    try {
      connectSocket();

      const startRes = await startConversation(productId);
      const convId = startRes.conversation._id;
      setConversationId(convId);

      const historyRes = await getMessages(convId);
      setMessages(historyRes.messages);

      joinConversation(convId);
      markAsRead(convId).catch(() => {});

      const handler = (msg: ChatMessage) => {
        if (msg.conversation === convId) {
          setMessages((prev) => [...prev, msg]);
        }
      };
      messageHandlerRef.current = handler;
      onNewMessage(handler);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to start chat");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (conversationId) {
      leaveConversation(conversationId);
    }
    if (messageHandlerRef.current) {
      offNewMessage(messageHandlerRef.current);
      messageHandlerRef.current = null;
    }
    setIsOpen(false);
    setMessages([]);
    setConversationId(null);
  };

  const handleSend = async () => {
    if (!input.trim() || !conversationId) return;

    const text = input.trim();
    setInput("");

    try {
      await sendMessage(conversationId, text);
    } catch {
      setError("Failed to send message");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    return () => {
      if (messageHandlerRef.current) {
        offNewMessage(messageHandlerRef.current);
      }
    };
  }, []);

  // Insert date dividers between messages from different days
  const renderMessages = () => {
    let lastDate = "";
    return messages.map((msg) => {
      const msgDate = new Date(msg.createdAt).toDateString();
      const showDivider = msgDate !== lastDate;
      lastDate = msgDate;

      // This widget is only ever used by the customer, so any message
      // with senderRole "customer" is always mine — sidesteps ID
      // matching entirely, avoiding ObjectId/string mismatches.
      // TEMP DEBUG — remove after confirming senderRole values in console
      console.log("msg debug:", msg.text, "| senderRole:", msg.senderRole, "| sender:", msg.sender);
      const isMine = msg.senderRole === "customer";

      return (
        <div key={msg._id}>
          {showDivider && (
            <div className="flex justify-center my-3">
              <span className="bg-white/90 text-gray-500 text-[11px] px-3 py-1 rounded-full shadow-sm">
                {formatDateDivider(msg.createdAt)}
              </span>
            </div>
          )}
          <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-1.5`}>
            <div
              className={`max-w-[75%] rounded-lg px-3 py-2 text-sm shadow-sm relative ${
                isMine
                  ? "bg-[#d9fdd3] text-gray-800 rounded-tr-none"
                  : "bg-white text-gray-800 rounded-tl-none"
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{msg.text}</p>
              <p className="text-[10px] mt-1 text-right text-gray-400">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 border border-primary text-primary hover:bg-secondary px-4 py-2 rounded-lg text-sm font-medium"
      >
        <FaComments size={14} />
        Chat Now
      </button>

      {/* Chat popup */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[350px] max-w-[calc(100vw-2.5rem)] bg-white rounded-xl shadow-2xl border flex flex-col h-[500px] overflow-hidden">
          {/* Header — WhatsApp-style dark green */}
          <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold">
                {sellerName?.charAt(0)?.toUpperCase() || "S"}
              </div>
              <div>
                <p className="font-semibold text-sm leading-tight">{sellerName || "Seller"}</p>
                <p className="text-[11px] text-green-100">Usually replies within an hour</p>
              </div>
            </div>
            <button onClick={handleClose} className="text-white/80 hover:text-white">
              <FaTimes size={18} />
            </button>
          </div>

          {/* Body */}
          {!isAuthenticated ? (
            <div className="flex-1 flex items-center justify-center p-6 text-center">
              <p className="text-sm text-gray-500">{error || "Please log in to chat"}</p>
            </div>
          ) : loading ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-gray-400">Loading chat...</p>
            </div>
          ) : (
            <>
              {/* WhatsApp-style chat wallpaper background */}
              <div
                className="flex-1 overflow-y-auto p-4"
                style={{
                  backgroundColor: "#e5ddd5",
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4cdc4' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                }}
              >
                {messages.length === 0 ? (
                  <p className="text-center text-xs text-gray-500 mt-8 bg-white/80 rounded-lg py-2 px-3 inline-block">
                    Start the conversation — ask about size, availability, or anything else.
                  </p>
                ) : (
                  renderMessages()
                )}
                <div ref={messagesEndRef} />
              </div>

              {error && (
                <p className="text-xs text-red-500 px-4 py-1 bg-white">{error}</p>
              )}

              {/* Input */}
              <div className="border-t bg-[#f0f0f0] p-2.5 flex items-end gap-2 shrink-0">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  rows={1}
                  className="flex-1 border-0 rounded-full px-4 py-2.5 text-sm outline-none resize-none bg-white shadow-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="bg-[#075e54] hover:bg-[#054c44] text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0 disabled:bg-gray-300"
                >
                  <FaPaperPlane size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;