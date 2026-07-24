import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaGem, FaUserFriends, FaMobileAlt, FaSeedling } from "react-icons/fa";
import { MdLocalShipping, MdOutlinePayment } from "react-icons/md";
import { BsGem } from "react-icons/bs";
import { GiClothes } from "react-icons/gi";
import SlideInPage from "../components/shared/SlideInPage";

interface FavouriteTile {
  label: string;
  to: string;
  bg: string;
  icon: React.ReactNode;
}

const favourites: FavouriteTile[] = [
  { label: "Coins 99% OFF", to: "/channel/coins", bg: "bg-pink-100", icon: <span className="text-2xl">🪙</span> },
  { label: "Free Delivery", to: "/campaign/free-delivery", bg: "bg-emerald-100", icon: <MdLocalShipping className="text-emerald-600" size={26} /> },
  { label: "Everyday Low Price", to: "/campaign/low-price", bg: "bg-yellow-100", icon: <span className="text-2xl">💰</span> },
  { label: "Daraz Freebie", to: "/channel/freebie", bg: "bg-violet-100", icon: <span className="text-2xl">🎁</span> },
  { label: "Official Mobile", to: "/campaign/mobiles", bg: "bg-purple-100", icon: <FaMobileAlt className="text-purple-600" size={22} /> },
  { label: "DarazMall", to: "/campaign/mall", bg: "bg-indigo-100", icon: <span className="text-xl font-bold text-indigo-600">dM</span> },
  { label: "Beauty", to: "/campaign/beauty", bg: "bg-pink-50", icon: <BsGem className="text-pink-500" size={22} /> },
  { label: "New Arrivals", to: "/campaign/new-arrivals", bg: "bg-violet-100", icon: <span className="text-2xl">✨</span> },
  { label: "DarazLook", to: "/campaign/fashion", bg: "bg-rose-50", icon: <GiClothes className="text-rose-500" size={24} /> },
  { label: "Buy More Save More", to: "/channel/buy-more-save", bg: "bg-orange-100", icon: <FaGem className="text-orange-500" size={22} /> },
];

interface ExploreItem {
  label: string;
  subtitle: string;
  to: string;
  bg: string;
  icon: React.ReactNode;
}

const exploreItems: ExploreItem[] = [
  {
    label: "Affiliate Program",
    subtitle: "Affiliate Program",
    to: "/channel/affiliates",
    bg: "bg-orange-500",
    icon: <FaUserFriends className="text-white" size={22} />,
  },
  {
    label: "Quick Recharge",
    subtitle: "Payment & Recharge",
    to: "/channel/recharge",
    bg: "bg-emerald-600",
    icon: <MdOutlinePayment className="text-white" size={22} />,
  },
  {
    label: "Daraz Land",
    subtitle: "Daraz Land",
    to: "/channel/land",
    bg: "bg-lime-500",
    icon: <FaSeedling className="text-white" size={22} />,
  },
];

const Channels = () => {
  const navigate = useNavigate();

  return (
    <SlideInPage>
      <div className="min-h-screen bg-white pb-10">
        <div className="flex items-center gap-3 px-4 py-3 border-b sticky top-0 bg-white z-10">
          <button onClick={() => navigate(-1)} className="text-gray-700">
            <FaArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Channels</h1>
        </div>

        <div className="px-4 pt-5">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Favourites</h2>
          <div className="grid grid-cols-5 gap-x-2 gap-y-5">
            {favourites.map((f) => (
              <Link key={f.label} to={f.to} className="flex flex-col items-center gap-1.5 text-center">
                <span className={`w-14 h-14 rounded-2xl flex items-center justify-center ${f.bg}`}>
                  {f.icon}
                </span>
                <span className="text-[11px] leading-tight text-gray-700">{f.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="px-4 pt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Explore</h2>
          <div className="divide-y">
            {exploreItems.map((item) => (
              <Link key={item.label} to={item.to} className="flex items-center gap-4 py-4">
                <span className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.bg}`}>
                  {item.icon}
                </span>
                <div>
                  <p className="font-semibold text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-400">{item.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </SlideInPage>
  );
};

export default Channels;