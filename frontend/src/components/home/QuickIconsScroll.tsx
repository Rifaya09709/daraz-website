import { Link } from "react-router-dom";
import { IconType } from "react-icons";
import {
  FaCoins,
  FaTruck,
  FaTags,
  FaGift,
  FaMobileAlt,
  FaStore,
  FaGem,
  FaStar,
  FaTshirt,
  FaThLarge,
} from "react-icons/fa";

interface IconItem {
  Icon: IconType;
  label: string;
  bg: string;
  fg: string;
  to: string;
}

// Each `to` points at a dedicated campaign page (see src/data/campaigns.data.ts)
const icons: IconItem[] = [
  { Icon: FaTruck, label: "Free Delivery", bg: "bg-emerald-100", fg: "text-emerald-600", to: "/campaign/free-delivery" },
  { Icon: FaTags, label: "Everyday Low Price", bg: "bg-amber-100", fg: "text-amber-600", to: "/campaign/low-price" },
  { Icon: FaGift, label: "Daraz Freebie", bg: "bg-rose-100", fg: "text-rose-600", to: "/campaign/freebies" },
  { Icon: FaMobileAlt, label: "Official Mobile", bg: "bg-indigo-100", fg: "text-indigo-600", to: "/campaign/mobiles" },
  { Icon: FaStore, label: "DarazMall", bg: "bg-violet-100", fg: "text-violet-600", to: "/campaign/mall" },
  { Icon: FaGem, label: "Beauty", bg: "bg-pink-100", fg: "text-pink-600", to: "/campaign/beauty" },
  { Icon: FaStar, label: "New Arrivals", bg: "bg-sky-100", fg: "text-sky-600", to: "/campaign/new-arrivals" },
  { Icon: FaTshirt, label: "DarazLook", bg: "bg-lime-100", fg: "text-lime-600", to: "/campaign/fashion" },
  { Icon: FaThLarge, label: "Channels", bg: "bg-slate-100", fg: "text-slate-600", to: "/campaign/channels" },
];

const QuickIconsScroll = () => {
  return (
    <div className="flex items-stretch gap-4 md:gap-6 overflow-x-auto no-scrollbar px-3 py-2">
      {/* Highlighted promo card, always first */}
      <Link
        to="/rewards/coins"
        className="shrink-0 w-40 bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-xl p-3 flex flex-col justify-between text-white"
      >
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <FaCoins size={14} />
          </span>
          <div className="leading-tight">
            <p className="text-[11px] font-bold uppercase">Coins Carnival</p>
            <p className="text-sm font-extrabold">Coins 99% OFF</p>
          </div>
        </div>
        <span className="text-xs font-semibold underline underline-offset-2 mt-2">
          Shop Here →
        </span>
      </Link>

      {/* Regular icon tiles — each links to its own campaign page */}
      {icons.map(({ Icon, label, bg, fg, to }) => (
        <Link
          key={label}
          to={to}
          className="flex flex-col items-center gap-1.5 shrink-0 w-[74px] text-center"
        >
          <span className={`flex items-center justify-center w-12 h-12 rounded-xl ${bg} ${fg}`}>
            <Icon size={20} />
          </span>
          <span className="text-[11px] text-gray-600 leading-tight">{label}</span>
        </Link>
      ))}
    </div>
  );
};

export default QuickIconsScroll;