import { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaSearch } from "react-icons/fa";

import { useAppSelector } from "../hooks/useAuth";
import { useChatNotifications } from "../context/ChatNotificationContext";
import {
  connectSocket,
  getMyConversations,
  getMessages,
  joinConversation,
  leaveConversation,
  sendMessage,
  onNewMessage,
  offNewMessage,
  markAsRead,
  ChatMessage,
  Conversation,
} from "../services/chat.service";

const formatDateDivider = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });
};

// Normalizes any id-like value (string, ObjectId, or an object with
// _id/id) down to a plain string so comparisons never fail on type
// mismatches (e.g. ObjectId vs string) or field-name differences.
const normalizeId = (value: any): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") return String(value._id || value.id || "");
  return String(value);
};

const Chats = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { refreshUnread } = useChatNotifications();
  const myId = normalizeId(user);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageHandlerRef = useRef<((msg: ChatMessage) => void) | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    connectSocket();
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoadingList(true);
    try {
      const res = await getMyConversations();
      setConversations(res.conversations);
    } catch {
      // ignore — list stays empty
    } finally {
      setLoadingList(false);
    }
  };

  const handleSelectConversation = async (conv: Conversation) => {
    if (activeConvId) {
      leaveConversation(activeConvId);
      if (messageHandlerRef.current) {
        offNewMessage(messageHandlerRef.current);
        messageHandlerRef.current = null;
      }
    }

    setActiveConvId(conv._id);
    setLoadingChat(true);
    setMessages([]);

    try {
      const historyRes = await getMessages(conv._id);
      setMessages(historyRes.messages);

      joinConversation(conv._id);
      markAsRead(conv._id).catch(() => {});
      refreshUnread();

      setConversations((prev) =>
        prev.map((c) =>
          c._id === conv._id ? { ...c, unreadBySeller: 0, unreadByCustomer: 0 } : c
        )
      );

      const handler = (msg: ChatMessage) => {
        if (msg.conversation === conv._id) {
          setMessages((prev) => [...prev, msg]);
          markAsRead(conv._id).catch(() => {});
          refreshUnread();
        }
        setConversations((prev) => {
          const updated = prev.map((c) =>
            c._id === msg.conversation
              ? { ...c, lastMessage: msg.text, lastMessageAt: msg.createdAt }
              : c
          );
          return [...updated].sort(
            (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
          );
        });
      };
      messageHandlerRef.current = handler;
      onNewMessage(handler);
    } catch {
      // ignore
    } finally {
      setLoadingChat(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !activeConvId) return;
    const text = input.trim();
    setInput("");
    try {
      await sendMessage(activeConvId, text);
    } catch {
      // best-effort
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
      if (activeConvId) leaveConversation(activeConvId);
      if (messageHandlerRef.current) offNewMessage(messageHandlerRef.current);
    };
  }, [activeConvId]);

  const activeConv = conversations.find((c) => c._id === activeConvId);

  const filteredConversations = conversations.filter((c) =>
    c.customer?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const renderMessages = () => {
    let lastDate = "";
    return messages.map((msg) => {
      const msgDate = new Date(msg.createdAt).toDateString();
      const showDivider = msgDate !== lastDate;
      lastDate = msgDate;

      // A message is "mine" if I sent it — but if a message is sender-role
      // "seller" and I'm viewing as staff (not the customer), treat it as
      // mine too, since admins reply on behalf of the seller regardless of
      // whose account originally sent an earlier reply.
      const senderId = normalizeId(msg.sender);
      const isMine =
        senderId === myId || (msg.senderRole === "seller" && senderId !== normalizeId(activeConv?.customer));

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
              className={`max-w-[65%] rounded-lg px-3 py-2 text-sm shadow-sm ${
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
    <div className="h-screen flex border-t">
      {/* Left — Conversation list */}
      <div className="w-full sm:w-[340px] shrink-0 border-r flex flex-col bg-white">
        <div className="bg-[#075e54] text-white px-4 py-4">
          <h2 className="font-semibold">Chats</h2>
        </div>

        <div className="p-2 border-b">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">
            <FaSearch size={12} className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations"
              className="bg-transparent text-sm outline-none flex-1"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingList ? (
            <p className="text-center text-sm text-gray-400 mt-8">Loading...</p>
          ) : filteredConversations.length === 0 ? (
            <p className="text-center text-sm text-gray-400 mt-8 px-4">
              No conversations yet.
            </p>
          ) : (
            filteredConversations.map((conv) => {
              const unread = conv.unreadBySeller || 0;
              return (
                <button
                  key={conv._id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`w-full flex items-center gap-3 px-4 py-3 border-b hover:bg-gray-50 text-left ${
                    activeConvId === conv._id ? "bg-gray-100" : ""
                  }`}
                >
                  <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold shrink-0">
                    {conv.customer?.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">
                        {conv.customer?.name || "Customer"}
                      </p>
                      {conv.lastMessageAt && (
                        <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                          {new Date(conv.lastMessageAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs text-gray-500 truncate">
                        {conv.lastMessage || "No messages yet"}
                      </p>
                      {unread > 0 && (
                        <span className="bg-primary text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center shrink-0 ml-2">
                          {unread}
                        </span>
                      )}
                    </div>
                    {conv.product?.name && (
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">
                        Re: {conv.product.name}
                      </p>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right — Active chat */}
      <div className="hidden sm:flex flex-1 flex-col">
        {!activeConvId ? (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <p className="text-gray-400 text-sm">Select a conversation to start chatting</p>
          </div>
        ) : (
          <>
            <div className="bg-[#075e54] text-white px-5 py-3 flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold">
                {activeConv?.customer?.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div>
                <p className="font-semibold text-sm">{activeConv?.customer?.name || "Customer"}</p>
                {activeConv?.product?.name && (
                  <p className="text-[11px] text-green-100">Re: {activeConv.product.name}</p>
                )}
              </div>
            </div>

            <div
              className="flex-1 overflow-y-auto p-5"
              style={{
                backgroundColor: "#e5ddd5",
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4cdc4' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              }}
            >
              {loadingChat ? (
                <p className="text-center text-sm text-gray-500 mt-8">Loading messages...</p>
              ) : (
                renderMessages()
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t bg-[#f0f0f0] p-3 flex items-end gap-2 shrink-0">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a reply..."
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
    </div>
  );
};

export default Chats;