import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAppSelector } from "../hooks/useAuth";
import {
  connectSocket,
  getMyConversations,
  onNewMessage,
  offNewMessage,
  ChatMessage,
} from "../services/chat.service";

interface ChatNotificationContextValue {
  unreadTotal: number;
  refreshUnread: () => void;
}

const ChatNotificationContext = createContext<ChatNotificationContextValue>({
  unreadTotal: 0,
  refreshUnread: () => {},
});

export const useChatNotifications = () => useContext(ChatNotificationContext);

export const ChatNotificationProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [unreadTotal, setUnreadTotal] = useState(0);

  // Pulls the current total unread count from all conversations
  const refreshUnread = async () => {
    try {
      const res = await getMyConversations();
      const total = res.conversations.reduce(
        (sum: number, c: any) => sum + (c.unreadBySeller || 0),
        0
      );
      setUnreadTotal(total);
    } catch {
      // ignore — badge just won't update this cycle
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    connectSocket();
    refreshUnread();

    // Ask for desktop notification permission once, on first login
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Global listener — fires for ANY new message on ANY conversation,
    // regardless of which page the admin is currently on
    const handler = (msg: ChatMessage) => {
      // Only bump the badge / notify for messages the admin didn't send
      if (msg.sender._id === user?._id) return;

      setUnreadTotal((prev) => prev + 1);

      // Desktop notification — only pops if the tab isn't focused,
      // so it doesn't nag while the admin is actively looking at the chat
      if (
        "Notification" in window &&
        Notification.permission === "granted" &&
        document.visibilityState !== "visible"
      ) {
        const notif = new Notification(`New message from ${msg.sender.name}`, {
          body: msg.text,
          icon: "/favicon.ico",
        });
        notif.onclick = () => {
          window.focus();
          window.location.href = "/chats";
        };
      }
    };

    onNewMessage(handler);

    return () => {
      offNewMessage(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <ChatNotificationContext.Provider value={{ unreadTotal, refreshUnread }}>
      {children}
    </ChatNotificationContext.Provider>
  );
};