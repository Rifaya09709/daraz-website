import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSearch, FaHeadset } from "react-icons/fa";

interface ChatThread {
  id: string;
  name: string;
  avatarColor: string; // tailwind bg color for the avatar circle
  initial: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
  online?: boolean;
  pinned?: boolean;
  isOfficial?: boolean; // shows a verified/support badge
}

const threads: ChatThread[] = [
  {
    id: "support",
    name: "Daraz Customer Care",
    avatarColor: "bg-rose-500",
    initial: "D",
    lastMessage: "Your refund of ৳589 has been processed ✅",
    timestamp: "2m",
    unread: 2,
    online: true,
    pinned: true,
    isOfficial: true,
  },
  {
    id: "seller1",
    name: "TechZone Official Store",
    avatarColor: "bg-indigo-500",
    initial: "T",
    lastMessage: "Yes, it's available in black and blue!",
    timestamp: "18m",
    unread: 1,
    online: true,
  },
  {
    id: "seller2",
    name: "Fashion Hub BD",
    avatarColor: "bg-fuchsia-500",
    initial: "F",
    lastMessage: "You: Is this true to size?",
    timestamp: "1h",
    online: false,
  },
  {
    id: "seller3",
    name: "Home Essentials Co.",
    avatarColor: "bg-emerald-500",
    initial: "H",
    lastMessage: "Thank you for your order! 🎉",
    timestamp: "Yesterday",
  },
  {
    id: "seller4",
    name: "Beauty Corner",
    avatarColor: "bg-amber-500",
    initial: "B",
    lastMessage: "We've restocked your favorite serum",
    timestamp: "2d",
  },
];

const ChatsPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filtered = threads.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase())
  );
  const pinned = filtered.filter((t) => t.pinned);
  const rest = filtered.filter((t) => !t.pinned);

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-700">
          <FaArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold text-gray-900 flex-1">Chats</h1>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5">
          <FaSearch className="text-gray-400" size={14} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats"
            className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Support quick-access banner */}
      <Link
        to="/contact"
        className="mx-4 mb-2 flex items-center gap-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-xl px-4 py-3"
      >
        <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <FaHeadset size={16} />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold">Need help with an order?</p>
          <p className="text-xs text-white/85">Chat with Customer Care — usually replies in minutes</p>
        </div>
      </Link>

      {/* Pinned */}
      {pinned.length > 0 && (
        <div className="px-4 pt-3 pb-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Pinned</p>
        </div>
      )}
      {pinned.map((t) => (
        <ChatRow key={t.id} thread={t} />
      ))}

      {/* Rest */}
      {rest.length > 0 && (
        <div className="px-4 pt-3 pb-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Recent</p>
        </div>
      )}
      {rest.map((t) => (
        <ChatRow key={t.id} thread={t} />
      ))}

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-10">No chats found</p>
      )}
    </div>
  );
};

const ChatRow = ({ thread }: { thread: ChatThread }) => (
  <Link
    to={`/messages/chats/${thread.id}`}
    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
  >
    <span className="relative shrink-0">
      <span
        className={`w-12 h-12 rounded-full ${thread.avatarColor} text-white flex items-center justify-center font-bold text-lg`}
      >
        {thread.initial}
      </span>
      {thread.online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
      )}
    </span>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5">
        <p className="font-semibold text-gray-900 text-sm truncate">{thread.name}</p>
        {thread.isOfficial && (
          <span className="text-[10px] bg-blue-100 text-blue-600 font-semibold px-1.5 py-0.5 rounded shrink-0">
            Official
          </span>
        )}
      </div>
      <p
        className={`text-xs truncate ${
          thread.unread ? "text-gray-800 font-medium" : "text-gray-400"
        }`}
      >
        {thread.lastMessage}
      </p>
    </div>

    <div className="flex flex-col items-end gap-1.5 shrink-0">
      <span className="text-[11px] text-gray-400">{thread.timestamp}</span>
      {thread.unread ? (
        <span className="bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {thread.unread}
        </span>
      ) : (
        <span className="w-5 h-5" />
      )}
    </div>
  </Link>
);

export default ChatsPage;