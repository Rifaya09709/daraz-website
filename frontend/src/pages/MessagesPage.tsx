import { Link, useLocation } from "react-router-dom";
import { IconType } from "react-icons";
import { FaComments, FaBoxOpen, FaBell, FaBullhorn } from "react-icons/fa";


type Tab = "chats" | "orders" | "alerts" | "promos";

interface TabItem {
  id: Tab;
  label: string;
  Icon: IconType;
  bg: string;
  badge?: number;
  to: string; // real route this tab navigates to
}

const tabs: TabItem[] = [
  { id: "chats", label: "Chats", Icon: FaComments, bg: "bg-emerald-500", to: "/messages/chats" },
  { id: "orders", label: "Orders", Icon: FaBoxOpen, bg: "bg-blue-500", to: "/orders" },
  { id: "alerts", label: "Alerts", Icon: FaBell, bg: "bg-amber-500", badge: 1, to: "/messages/alerts" },
  
  { id: "promos", label: "Promos", Icon: FaBullhorn, bg: "bg-rose-500", to: "/messages/promos" },
];

interface NotificationItem {
  id: string;
  icon: "alert" | "promo";
  title: string;
  timestamp: string;
  caption: string;
  bannerImage: string; // real banner artwork url
  unread?: boolean;
}

// Real banner artwork can be swapped for your own CDN/asset URLs later —
// each item just needs a bannerImage that matches its campaign.
const notifications: NotificationItem[] = [
  {
    id: "1",
    icon: "alert",
    title: "🚀 Hurry! Carnival Ends Today! ⏰",
    timestamp: "08:40 AM",
    caption: "SHOP NOW with 70% off on the coins channel.",
    bannerImage:
      "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=900&q=80",
    unread: true,
  },
  {
    id: "2",
    icon: "promo",
    title: "FLAT 50% OFF🔥",
    timestamp: "Yesterday",
    caption: "Bata💰এ Exclusive Collection👞👠👡 নিন এই সুযোগে🛒",
    bannerImage:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80",
  },
  {
    id: "3",
    icon: "promo",
    title: "✅HARPIC ✅LIZOL ✅TRIX",
    timestamp: "Yesterday",
    caption: "কিনলেই মগ ফ্রি🎁🎁🎁",
    bannerImage:
      "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=900&q=80",
  },
  {
    id: "4",
    icon: "alert",
    title: "UP TO 70% OFF & FREE GIFTS 😱🎊",
    timestamp: "Yesterday",
    caption: "SHOP NOW with 70% off on the coins channel.",
    bannerImage:
      "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=900&q=80",
  },
  {
    id: "5",
    icon: "promo",
    title: "Just Dropped🔥",
    timestamp: "22/07/2026",
    caption: "🎧Oraimo Brand Deals LIVE🔴UP TO 51% OFF🔥Shop Now🛒",
    bannerImage:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&q=80",
  },
  {
    id: "6",
    icon: "promo",
    title: "FLAT 20% OFF🔥",
    timestamp: "22/07/2026",
    caption: "✨RFL BEST BUY✨এর সবকিছু এখন বাজেটেই💸💸",
    bannerImage:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=900&q=80",
  },
  {
    id: "7",
    icon: "alert",
    title: "Candy Coins Expiring Soon ❗",
    timestamp: "21/07/2026",
    caption: "1 minute of candy = coins. Don't miss out today.",
    bannerImage:
      "https://images.unsplash.com/photo-1548907040-4baa419234a4?w=900&q=80",
  },
  {
    id: "8",
    icon: "promo",
    title: "RANGS eMart Exclusive🔥",
    timestamp: "21/07/2026",
    caption: "UP TO 30% ছাড়✨ Branded📺TV, Fridge সহ সব ➕💯Official Warranty নিশ্চিত",
    bannerImage:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=900&q=80",
  },
  {
    id: "9",
    icon: "promo",
    title: "Tech Tuesday Special🔥",
    timestamp: "21/07/2026",
    caption: "🚨Branded🚨 Headphone, Smart watch, Power Bank ⚡UP TO 51% ছাড় 🔥",
    bannerImage:
      "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=900&q=80",
  },
  {
    id: "10",
    icon: "promo",
    title: "Home & Lifestyle Monday",
    timestamp: "20/07/2026",
    caption: "🏠ঘরের জন্য নিন Curtain, Wall Clock, Rugs, Decor ✨",
    bannerImage:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80",
  },
  {
    id: "11",
    icon: "alert",
    title: "⚽ Champions Shop Here!🏆",
    timestamp: "19/07/2026",
    caption: "SHOP NOW with 60% off and win free gifts on the coins channel.",
    bannerImage:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=900&q=80",
  },
];

const MessagesPage = () => {
  const location = useLocation();

  // Highlight the tab that matches the current route.
  // "/messages" itself = Promos tab active.
  const activeTabId: Tab = tabs.find((t) => t.to === location.pathname)?.id ?? "promos";

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <button className="flex items-center gap-1.5 text-sm text-gray-500">
          ✋ Mark all as read
        </button>
      </div>

      {/* Tabs — real navigation, not just local state */}
      <div className="grid grid-cols-4 gap-3 px-4 pb-4">
        {tabs.map(({ id, label, Icon, bg, badge, to }) => (
          <Link key={id} to={to} className="flex flex-col items-center gap-1.5">
            <span
              className={`relative w-14 h-14 rounded-full ${bg} flex items-center justify-center text-white ${
                activeTabId === id ? "ring-2 ring-offset-2 ring-gray-800" : ""
              }`}
            >
              <Icon size={22} />
              {badge && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                  {badge}
                </span>
              )}
            </span>
            <span className="text-sm text-gray-800">{label}</span>
          </Link>
        ))}
      </div>

      <div className="border-t border-gray-100" />

      {/* Feed — a dense stack of real-looking promo/alert banners, matching
          the density of the actual Daraz Messages tab. Chats/Orders/Alerts
          tabs navigate away to their own routes/pages; this feed is the
          Promos tab's own content. */}
      <div className="px-4 py-4">
        <p className="text-sm text-gray-400 mb-3">Last 7 days</p>

        <div className="space-y-4">
          {notifications.map((n) => (
            <div key={n.id} className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 ${
                    n.icon === "alert" ? "bg-amber-500" : "bg-rose-500"
                  }`}
                >
                  {n.icon === "alert" ? <FaBell size={16} /> : <FaBullhorn size={16} />}
                  {n.unread && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                  )}
                </span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{n.title}</p>
                  <p className="text-xs text-gray-400">{n.timestamp}</p>
                </div>
              </div>

              <img
                src={n.bannerImage}
                alt={n.title}
                className="w-full aspect-[2.2/1] object-cover rounded-lg mb-3"
                loading="lazy"
              />

              <p className="text-sm text-gray-600">{n.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;