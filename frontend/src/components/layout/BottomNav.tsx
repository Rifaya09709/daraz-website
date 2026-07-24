import { Link, useLocation } from "react-router-dom";
import { FaHome, FaCommentDots, FaShoppingCart, FaUser } from "react-icons/fa";
import { useAppSelector } from "../../hooks/useAuth"; // adjust path if needed
import SafeImage from "../SafeImage"; // adjust path if needed

export interface TrendingItem {
  id: string; // product _id — used to build the /product/:id link
  image: string; // product image url
}

interface BottomNavProps {
  // Real products from your catalog — these scroll continuously inside the
  // middle "trending" slot instead of a static icon, and each frame links
  // to that exact product.
  trendingItems: TrendingItem[];
  messageCount?: number;
}

const THUMB_SIZE = 44; // px — must match the w-11/h-11 slot below
const SECONDS_PER_IMAGE = 2; // how long each image is "parked" before scrolling to the next

const BottomNav = ({ trendingItems = [], messageCount = 0 }: BottomNavProps) => {
  const location = useLocation();
  const { totalItems } = useAppSelector((state) => state.cart);

  // Duplicate the first item at the end so the vertical scroll can loop seamlessly
  const track =
    trendingItems.length > 0 ? [...trendingItems, trendingItems[0]] : [];
  const totalDuration = SECONDS_PER_IMAGE * trendingItems.length;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t flex items-center justify-around py-2 px-2">
      <style>{`
        @keyframes trend-scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-${(track.length - 1) * THUMB_SIZE}px); }
        }
        .trend-track {
          animation: trend-scroll ${totalDuration}s steps(${track.length - 1}) infinite;
        }
        /* Pause the scroll on hover/touch so a fast-moving frame is easier to tap */
        .trend-slot:active .trend-track,
        .trend-slot:hover .trend-track {
          animation-play-state: paused;
        }
      `}</style>

      <Link
        to="/"
        className={`flex flex-col items-center gap-1 text-xs ${
          isActive("/") ? "text-primary" : "text-gray-500"
        }`}
      >
        <FaHome size={20} />
        Home
      </Link>

      <Link
        to="/messages"
        className={`relative flex flex-col items-center gap-1 text-xs ${
          isActive("/messages") ? "text-primary" : "text-gray-500"
        }`}
      >
        <FaCommentDots size={20} />
        {messageCount > 0 && (
          <span className="absolute -top-1 right-1 bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {messageCount}
          </span>
        )}
        Messages
      </Link>

      {/* Middle "trending" slot — a vertical filmstrip of product images
          scrolls upward, one product parking in view at a time. Each
          frame is its own link to that product's page. */}
      <div className="flex flex-col items-center -mt-4">
        <span
          className="trend-slot rounded-full overflow-hidden border-2 border-primary shadow-md bg-gray-100 block"
          style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
        >
          {track.length > 0 ? (
            <div className="trend-track">
              {track.map((item, i) => (
                <Link
                  key={`${item.id}-${i}`}
                  to={`/product/${item.id}`}
                  style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
                  className="block"
                >
                  <SafeImage
                    src={item.image}
                    alt=""
                    fallbackSeed={`trending-${item.id}`}
                    style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
                    className="object-cover"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ width: THUMB_SIZE, height: THUMB_SIZE }} className="bg-gray-200" />
          )}
        </span>
      </div>

      <Link
        to="/cart"
        className={`relative flex flex-col items-center gap-1 text-xs ${
          isActive("/cart") ? "text-primary" : "text-gray-500"
        }`}
      >
        <FaShoppingCart size={20} />
        {totalItems > 0 && (
          <span className="absolute -top-1 right-1 bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {totalItems}
          </span>
        )}
        Cart
      </Link>

      <Link
        to="/account"
        className={`flex flex-col items-center gap-1 text-xs ${
          isActive("/account") ? "text-primary" : "text-gray-500"
        }`}
      >
        <FaUser size={20} />
        Account
      </Link>
    </nav>
  );
};

export default BottomNav;