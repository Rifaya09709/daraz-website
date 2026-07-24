import { Link } from "react-router-dom";
import {
  FaMobileAlt,
  FaTshirt,
  FaLaptop,
  FaHome,
  FaShoppingBasket,
  FaGem,
  FaFutbol,
  FaBaby,
} from "react-icons/fa";

/**
 * Category "flow" banner.
 * Signature idea: a shelf of category chips drifts continuously
 * right-to-left. Each chip grows as it nears the centre of the
 * shelf and shrinks again as it drifts past — a slow, living
 * "wave" through the catalog rather than a static grid of icons.
 */
const categories = [
  { Icon: FaMobileAlt, label: "Mobiles", to: "/products?category=mobiles" },
  { Icon: FaTshirt, label: "Fashion", to: "/products?category=fashion" },
  { Icon: FaLaptop, label: "Electronics", to: "/products?category=electronics" },
  { Icon: FaHome, label: "Home & Living", to: "/products?category=home" },
  { Icon: FaShoppingBasket, label: "Grocery", to: "/products?category=grocery" },
  { Icon: FaGem, label: "Beauty", to: "/products?category=beauty" },
  { Icon: FaFutbol, label: "Sports", to: "/products?category=sports" },
  { Icon: FaBaby, label: "Baby & Kids", to: "/products?category=kids" },
];

// Total time for the shelf to complete one full lap (seconds)
const FLOW_DURATION = 24;
// Time between consecutive chips reaching the centre — keeps the
// scale-wave in sync with the horizontal drift speed
const ITEM_PERIOD = FLOW_DURATION / categories.length;

const PromoBanner = () => {
  // Render the list twice back-to-back for a seamless loop
  const track = [...categories, ...categories];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#151935]">
      <style>{`
        @keyframes flow-track {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes flow-wave {
          0%, 100% { transform: scale(0.72); opacity: 0.55; }
          50%      { transform: scale(1.18); opacity: 1; }
        }
        .flow-track {
          animation: flow-track ${FLOW_DURATION}s linear infinite;
        }
        .flow-track:hover {
          animation-play-state: paused;
        }
        .flow-wave {
          animation: flow-wave ${ITEM_PERIOD}s ease-in-out infinite;
        }
      `}</style>

      {/* Fade masks on left/right edges so chips appear to emerge/dissolve */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-28 z-10 bg-gradient-to-r from-[#151935] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-28 z-10 bg-gradient-to-l from-[#151935] to-transparent" />

      <div className="px-6 md:px-10 pt-9 pb-7">
        <p className="text-amber-400 text-xs md:text-sm font-semibold tracking-[0.3em] mb-2">
          MEGA CATEGORY SALE
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <h2 className="text-white text-3xl md:text-5xl font-extrabold leading-tight">
            Everything you shop for,
            <br className="hidden md:block" /> up to <span className="text-amber-400">70% off</span>
          </h2>
          <Link
            to="/products"
            className="shrink-0 bg-primary hover:bg-orange-600 transition-colors text-white font-semibold px-6 py-3 rounded-full"
          >
            Explore All
          </Link>
        </div>

        {/* Flowing category shelf */}
        <div className="relative py-4">
          <div className="flow-track flex w-max gap-6 md:gap-10">
            {track.map(({ Icon, label, to }, i) => (
              <Link
                key={i}
                to={to}
                className="flow-wave flex flex-col items-center gap-2 shrink-0"
                style={{ animationDelay: `${(i % categories.length) * ITEM_PERIOD}s` }}
              >
                <span className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 backdrop-blur border border-white/10 text-amber-300">
                  <Icon size={26} />
                </span>
                <span className="text-white/80 text-xs md:text-sm font-medium whitespace-nowrap">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;