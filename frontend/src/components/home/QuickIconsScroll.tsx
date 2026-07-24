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
  gradient: string; // tailwind gradient classes
  fg: string;
  to: string;
}

// Each `to` points at a dedicated campaign page (see src/data/campaigns.data.ts)
// "Channels" routes to the standalone /channels hub page, not a campaign page.
const icons: IconItem[] = [
  { Icon: FaTruck, label: "Free Delivery", gradient: "from-emerald-400 to-teal-500", fg: "text-white", to: "/campaign/free-delivery" },
  { Icon: FaTags, label: "Everyday Low Price", gradient: "from-amber-400 to-orange-500", fg: "text-white", to: "/campaign/low-price" },
  { Icon: FaGift, label: "Daraz Freebie", gradient: "from-rose-400 to-red-500", fg: "text-white", to: "/campaign/freebies" },
  { Icon: FaMobileAlt, label: "Official Mobile", gradient: "from-indigo-400 to-blue-600", fg: "text-white", to: "/campaign/mobiles" },
  { Icon: FaStore, label: "DarazMall", gradient: "from-violet-400 to-purple-600", fg: "text-white", to: "/campaign/mall" },
  { Icon: FaGem, label: "Beauty", gradient: "from-pink-400 to-fuchsia-500", fg: "text-white", to: "/campaign/beauty" },
  { Icon: FaStar, label: "New Arrivals", gradient: "from-sky-400 to-cyan-500", fg: "text-white", to: "/campaign/new-arrivals" },
  { Icon: FaTshirt, label: "DarazLook", gradient: "from-lime-400 to-green-500", fg: "text-white", to: "/campaign/fashion" },
  { Icon: FaThLarge, label: "Channels", gradient: "from-slate-500 to-slate-700", fg: "text-white", to: "/channels" },
];

const QuickIconsScroll = () => {
  return (
    <div className="flex items-stretch gap-4 md:gap-6 overflow-x-auto no-scrollbar px-3 py-2">
      {/* Highlighted promo card, always first */}
      <Link
        to="/rewards/coins"
        className="shrink-0 w-40 bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-xl p-3 flex flex-col justify-between text-white shadow-md shadow-pink-500/30 transition-transform duration-150 active:scale-95 hover:shadow-lg hover:shadow-pink-500/40"
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
      {icons.map(({ Icon, label, gradient, fg, to }) => (
        <Link
          key={label}
          to={to}
          className="group flex flex-col items-center gap-1.5 shrink-0 w-[74px] text-center"
        >
          <span
            className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} ${fg} shadow-md shadow-black/10 transition-transform duration-150 group-active:scale-90 group-hover:scale-105 group-hover:shadow-lg`}
          >
            <Icon size={20} />
          </span>
          <span className="text-[11px] text-gray-600 leading-tight group-hover:text-gray-900">
            {label}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default QuickIconsScroll;