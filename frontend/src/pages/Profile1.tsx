import { Link } from "react-router-dom";
import {
  FaCog,
  FaWallet,
  FaBoxOpen,
  FaTruck,
  FaCommentAlt,
  FaUndo,
  FaMapMarkerAlt,
  FaUsers,
  FaQuestionCircle,
  FaHeadset,
  FaStar,
  FaCreditCard,
  FaCoins,
  FaGift,
} from "react-icons/fa";
import { useAppSelector } from "../hooks/useAuth"; // adjust path if needed
import { formatCurrency } from "../utils/formatCurrency";
import SafeImage from "../components/SafeImage"; // adjust path if needed

interface RecentProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
}

const orderStatusItems = [
  { Icon: FaWallet, label: "To Pay", to: "/orders?status=to-pay" },
  { Icon: FaBoxOpen, label: "To Ship", to: "/orders?status=to-ship" },
  { Icon: FaTruck, label: "To Receive", to: "/orders?status=to-receive" },
  { Icon: FaCommentAlt, label: "To Review", to: "/orders?status=to-review" },
  { Icon: FaUndo, label: "Returns & Cancellations", to: "/orders?status=returns" },
];

// Fixed to match actual routes registered in AppRoutes.tsx
const menuItems = [
  { Icon: FaMapMarkerAlt, label: "Pickup Points", to: "/pickup-points" },
  { Icon: FaUsers, label: "My Affiliates", to: "/affiliate" },
  { Icon: FaQuestionCircle, label: "Help Center", to: "/help" },
  { Icon: FaHeadset, label: "Contact Customer Care", to: "/contact" },
  { Icon: FaStar, label: "My Reviews", to: "/reviews" },
  { Icon: FaCreditCard, label: "Payment Options", to: "/payment-options" },
];

const recentlyViewed: RecentProduct[] = [
  { id: "1", name: "Phone Armband", image: "/images/armband.jpg", price: 446, originalPrice: 1066, discountPercent: 58 },
  { id: "2", name: "Smartphone", image: "/images/phone.jpg", price: 723, originalPrice: 1876, discountPercent: 61 },
  { id: "3", name: "Silica Gel Packs", image: "/images/silica.jpg", price: 81, originalPrice: 200, discountPercent: 59 },
];

const Profile1 = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="max-w-2xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold overflow-hidden">
            {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
          </span>
          <span className="text-lg font-semibold text-gray-900">
            {user?.name || "Guest"}
          </span>
        </div>
        <Link to="/settings" className="text-gray-500">
          <FaCog size={22} />
        </Link>
      </div>

      {/* Rewards / mini-programs row */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">Play & Save</h3>
          <Link to="/rewards" className="text-primary text-sm font-medium">
            Explore →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-xl p-4 text-white">
            <FaCoins size={20} className="mb-2 text-amber-200" />
            <p className="font-bold mb-1">Coins</p>
            <p className="text-xs text-white/85 mb-3">Enjoy up to 99% off with coins</p>
            <Link
              to="/rewards/coins"
              className="inline-block bg-white/20 text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              Use Now
            </Link>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl p-4 text-white">
            <FaGift size={20} className="mb-2 text-amber-100" />
            <p className="font-bold mb-1">Freebies</p>
            <p className="text-xs text-white/85 mb-3">Invite friends & win prizes</p>
            <Link
              to="/rewards/freebies"
              className="inline-block bg-white/20 text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              Play Now
            </Link>
          </div>
        </div>
      </div>

      {/* My Orders */}
      <div className="bg-white px-4 py-5 mb-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">My Orders</h3>
          <Link to="/orders" className="text-gray-400 text-sm">
            View All Orders →
          </Link>
        </div>
        <div className="grid grid-cols-5 gap-2 text-center">
          {orderStatusItems.map(({ Icon, label, to }) => (
            <Link key={label} to={to} className="flex flex-col items-center gap-1.5">
              <span className="text-primary">
                <Icon size={22} />
              </span>
              <span className="text-[11px] text-gray-600 leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recently Viewed */}
      <div className="bg-white px-4 py-5 mb-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Recently Viewed</h3>
          <Link to="/recently-viewed" className="text-gray-400 text-sm">
            View More →
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {recentlyViewed.map((p) => (
            // NOTE: route is "/product/:id" (singular) in AppRoutes,
            // but "/products/:id" is also registered as an alias so both work.
            <Link key={p.id} to={`/product/${p.id}`} className="block">
              <div className="relative rounded-lg overflow-hidden bg-gray-50">
                <SafeImage
                  src={p.image}
                  alt={p.name}
                  fallbackSeed={p.id}
                  className="w-full aspect-square object-cover"
                />
                <span className="absolute top-1.5 left-1.5 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  ↓{p.discountPercent}%
                </span>
              </div>
              <p className="text-sm font-semibold text-rose-500 mt-1.5">
                {formatCurrency(p.price)}
              </p>
              <p className="text-xs text-gray-400 line-through">
                {formatCurrency(p.originalPrice)}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Menu grid */}
      <div className="bg-white px-4 py-5">
        <div className="grid grid-cols-4 gap-y-5 text-center">
          {menuItems.map(({ Icon, label, to }) => (
            <Link key={label} to={to} className="flex flex-col items-center gap-1.5">
              <span className="w-10 h-10 rounded-lg bg-orange-50 text-primary flex items-center justify-center">
                <Icon size={18} />
              </span>
              <span className="text-[11px] text-gray-600 leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile1;