import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCog,
  FaCamera,
  FaWallet,
  FaBoxOpen,
  FaTruck,
  FaCommentDots,
  FaUndoAlt,
  FaChevronRight,
  FaGem,
  FaGift,
  FaQuestionCircle,
  FaHeadset,
  FaStar,
  FaCreditCard,
  FaMapMarkerAlt,
  FaUsers,
  FaTags,
} from "react-icons/fa";

import { useAppSelector } from "../hooks/useAuth";
import { formatCurrency } from "../utils/formatCurrency";
import { getLatestProducts } from "../services/product.service";
import { getPrimaryImage, getFinalPrice } from "../utils/helpers";
import { Product } from "../types/product";

/** Small helper: circular icon tile used in the "My Orders" row and the quick-link grids */
const IconTile = ({
  icon,
  label,
  to,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
  badge?: number;
}) => (
  <Link to={to} className="flex flex-col items-center gap-2 text-center w-16 shrink-0">
    <span className="relative w-11 h-11 flex items-center justify-center text-orange-500 text-2xl">
      {icon}
      {!!badge && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
    </span>
    <span className="text-xs text-gray-700 leading-tight">{label}</span>
  </Link>
);

const PromoCard = ({
  icon,
  title,
  bodyTitle,
  bodySubtitle,
  ctaLabel,
  gradient,
  ctaGradient,
  to,
}: {
  icon: React.ReactNode;
  title: string;
  bodyTitle: string;
  bodySubtitle: string;
  ctaLabel: string;
  gradient: string;
  ctaGradient: string;
  to: string;
}) => (
  <Link
    to={to}
    className={`rounded-2xl p-4 flex flex-col justify-between min-h-[120px] ${gradient}`}
  >
    <div className="flex items-center gap-1.5 mb-3">
      <span className="text-lg">{icon}</span>
      <span className="font-bold text-gray-900 text-sm">{title}</span>
    </div>
    <div className="flex items-end justify-between">
      <div>
        <p className="text-sm font-bold text-gray-800 leading-tight">{bodyTitle}</p>
        <p className="text-xs text-gray-600 leading-tight">{bodySubtitle}</p>
      </div>
    </div>
    <span
      className={`self-start mt-3 text-white text-xs font-semibold px-4 py-1.5 rounded-full ${ctaGradient}`}
    >
      {ctaLabel}
    </span>
  </Link>
);

const Account = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Swap this out for a real "recently viewed" endpoint/localStorage list
    // once one exists — using latest products as a stand-in for now.
    getLatestProducts()
      .then((data) => setRecentlyViewed((data.products || []).slice(0, 6)))
      .catch(() => setRecentlyViewed([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ---- Profile header ---- */}
      <div className="bg-gradient-to-br from-orange-50 via-pink-50 to-white px-4 pt-6 pb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-white border flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">🙂</span>
                )}
              </div>
              <span className="absolute bottom-0 right-0 bg-gray-700 text-white w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                <FaCamera size={10} />
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{user?.name ?? "Guest"}</h1>
              <p className="text-sm text-gray-500 mt-1">
                <Link to="/wishlist" className="hover:underline">0 Wishlist</Link>
                {" · "}
                <Link to="/followed-stores" className="hover:underline">0 Followed Stores</Link>
                {" · "}
                <Link to="/vouchers" className="hover:underline">1 Vouchers</Link>
              </p>
            </div>
          </div>
          <Link to="/settings" className="text-gray-700 mt-1">
            <FaCog size={20} />
          </Link>
        </div>
      </div>

      {/* ---- Promo cards ---- */}
      <div className="px-4 -mt-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-900">Plant. Grow. Win!</h2>
          <Link to="/rewards" className="text-orange-500 text-sm font-medium flex items-center gap-1">
            Grow Here <FaChevronRight size={10} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <PromoCard
            icon={<FaGem className="text-yellow-500" />}
            title="Coins"
            bodyTitle="Enjoy 99% Off"
            bodySubtitle="With Coins"
            ctaLabel="Use Now"
            gradient="bg-gradient-to-br from-pink-100 to-rose-50"
            ctaGradient="bg-gradient-to-r from-pink-500 to-rose-400"
            to="/coins"
          />
          <PromoCard
            icon={<FaGift className="text-purple-500" />}
            title="Freebie"
            bodyTitle="Invite & Win"
            bodySubtitle="Rewards & Prizes"
            ctaLabel="Play Now"
            gradient="bg-gradient-to-br from-orange-100 to-red-50"
            ctaGradient="bg-gradient-to-r from-orange-500 to-red-400"
            to="/freebie"
          />
        </div>

        {/* quick game/voucher icon row */}
        <div className="flex justify-between mt-5 px-1">
          <IconTile icon={<span>🌱</span>} label="Land" to="/land" />
          <IconTile icon={<span>🍬</span>} label="Candy" to="/candy" />
          <IconTile icon={<FaTags />} label="Buy More Save" to="/buy-more-save" />
          <IconTile icon={<FaTags />} label="Vouchers" to="/vouchers" />
        </div>
      </div>

      {/* ---- My Orders ---- */}
      <div className="bg-white mt-4 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">My Orders</h2>
          <Link to="/orders" className="text-gray-400 text-sm flex items-center gap-1">
            View All Orders <FaChevronRight size={10} />
          </Link>
        </div>
        <div className="flex justify-between">
          <IconTile icon={<FaWallet />} label="To Pay" to="/orders?status=to-pay" />
          <IconTile icon={<FaBoxOpen />} label="To Ship" to="/orders?status=to-ship" />
          <IconTile icon={<FaTruck />} label="To Receive" to="/orders?status=to-receive" />
          <IconTile icon={<FaCommentDots />} label="To Review" to="/orders?status=to-review" />
          <IconTile icon={<FaUndoAlt />} label="Returns & Cancellations" to="/orders/returns" />
        </div>
      </div>

      {/* ---- Recently Viewed ---- */}
      <div className="bg-white mt-3 px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-900">Recently Viewed</h2>
          <Link to="/recently-viewed" className="text-gray-400 text-sm flex items-center gap-1">
            View More <FaChevronRight size={10} />
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="w-32 h-44 shrink-0 rounded-lg bg-gray-200 animate-pulse" />
              ))
            : recentlyViewed.map((p) => {
                const hasDiscount = !!p.discountPrice;
                const pct = hasDiscount
                  ? Math.round(((p.price - (p.discountPrice as number)) / p.price) * 100)
                  : 0;
                return (
                  <Link
                    key={p._id}
                    to={`/product/${p._id}`}
                    className="w-32 shrink-0 rounded-lg overflow-hidden border relative"
                  >
                    {hasDiscount && (
                      <span className="absolute top-1.5 left-1.5 z-10 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        ↓ {pct}%
                      </span>
                    )}
                    <img
                      src={getPrimaryImage(p.images)}
                      alt={p.name}
                      loading="lazy"
                      className="w-32 h-32 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/300x300?text=No+Image";
                      }}
                    />
                    <div className="p-2">
                      <p className="text-sm font-bold text-gray-900">
                        {formatCurrency(getFinalPrice(p))}
                      </p>
                      {hasDiscount && (
                        <p className="text-xs text-gray-400 line-through">
                          {formatCurrency(p.price)}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
        </div>
      </div>

      {/* ---- More services grid ---- */}
      <div className="bg-white mt-3 px-4 py-5">
        <div className="grid grid-cols-4 gap-y-5">
          <IconTile icon={<span>🍬</span>} label="Daraz Candy" to="/candy" />
          <IconTile icon={<FaTags />} label="Buy Any 3" to="/buy-any-3" />
          <IconTile icon={<FaMapMarkerAlt />} label="Pickup Points" to="/pickup-points" />
          <IconTile icon={<FaUsers />} label="My Affiliates" to="/affiliates" />
          <IconTile icon={<FaQuestionCircle />} label="Help Center" to="/help" />
          <IconTile icon={<FaHeadset />} label="Contact Customer Care" to="/support" />
          <IconTile icon={<FaStar />} label="My Reviews" to="/reviews" />
          <IconTile icon={<FaCreditCard />} label="Payment Options" to="/payment-options" />
        </div>
      </div>
    </div>
  );
};

export default Account;