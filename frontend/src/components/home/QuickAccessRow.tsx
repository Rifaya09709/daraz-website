import { Link } from "react-router-dom";
import { IconType } from "react-icons";
import {
  FaTruck,
  FaTags,
  FaGift,
  FaMobileAlt,
  FaStore,
  FaShieldAlt,
} from "react-icons/fa";

interface QuickAccessItem {
  Icon: IconType;
  label: string;
  bg: string;   // tile background color
  fg: string;   // icon color
  to: string;
}

const items: QuickAccessItem[] = [
  { Icon: FaTruck, label: "Free Delivery", bg: "bg-emerald-100", fg: "text-emerald-600", to: "/products?perk=free-delivery" },
  { Icon: FaTags, label: "Everyday Low Price", bg: "bg-amber-100", fg: "text-amber-600", to: "/products?perk=low-price" },
  { Icon: FaGift, label: "Freebies", bg: "bg-rose-100", fg: "text-rose-600", to: "/products?perk=freebies" },
  { Icon: FaMobileAlt, label: "Official Mobile Store", bg: "bg-indigo-100", fg: "text-indigo-600", to: "/products?category=mobiles" },
  { Icon: FaStore, label: "Brand Mall", bg: "bg-violet-100", fg: "text-violet-600", to: "/products?tag=mall" },
  { Icon: FaShieldAlt, label: "Buyer Protection", bg: "bg-sky-100", fg: "text-sky-600", to: "/help" },
];

const QuickAccessRow = () => {
  return (
    <div className="flex gap-5 md:gap-8 overflow-x-auto py-3 px-1 no-scrollbar">
      {items.map(({ Icon, label, bg, fg, to }) => (
        <Link
          key={label}
          to={to}
          className="flex flex-col items-center gap-1.5 shrink-0 w-[76px] text-center"
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

export default QuickAccessRow;