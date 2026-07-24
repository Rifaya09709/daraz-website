import { Link } from "react-router-dom";
import { IconType } from "react-icons";
import {
  FaTruck,
  FaGift,
  FaBolt,
  FaTags,
  FaCouch,
  FaPlug,
  FaGem,
} from "react-icons/fa";

export type PromoTheme =
  | "sunset"    // orange/red — flash & payday style
  | "carnival"  // gold/amber — coins & rewards style
  | "home"      // sage/cream — home & lifestyle style
  | "electric"  // indigo/blue — electronics/appliances style
  | "brand";    // violet/pink — brand-day style

const themeStyles: Record<PromoTheme, { bg: string; accent: string; chip: string }> = {
  sunset:   { bg: "from-orange-500 to-red-500",    accent: "text-orange-600",  chip: "bg-orange-50 text-orange-600" },
  carnival: { bg: "from-amber-400 to-yellow-500",   accent: "text-amber-600",   chip: "bg-amber-50 text-amber-700" },
  home:     { bg: "from-emerald-500 to-teal-600",   accent: "text-emerald-600", chip: "bg-emerald-50 text-emerald-700" },
  electric: { bg: "from-indigo-600 to-blue-600",    accent: "text-indigo-600",  chip: "bg-indigo-50 text-indigo-700" },
  brand:    { bg: "from-fuchsia-500 to-pink-500",   accent: "text-fuchsia-600", chip: "bg-fuchsia-50 text-fuchsia-700" },
};

interface PromoCardProps {
  theme: PromoTheme;
  eyebrow: string;       // small label above title, e.g. "LIMITED TIME"
  title: string;         // main headline, e.g. "Payday Sale"
  subtitle?: string;     // supporting line, e.g. "22nd – 31st July"
  discount: string;      // e.g. "UP TO 80% OFF"
  Icon?: IconType;       // decorative icon (defaults to FaTags)
  perk?: string;         // small perk chip, e.g. "Free Delivery"
  to: string;            // link target
}

const PromoCard = ({
  theme,
  eyebrow,
  title,
  subtitle,
  discount,
  Icon = FaTags,
  perk,
  to,
}: PromoCardProps) => {
  const s = themeStyles[theme];

  return (
    <Link
      to={to}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${s.bg} px-5 py-5 md:px-8 md:py-6 flex items-center justify-between shadow-md hover:shadow-lg transition-shadow`}
    >
      {/* Decorative faded icon in the background */}
      <Icon className="absolute -right-4 -bottom-4 text-white/15" size={110} />

      <div className="relative z-10 max-w-[70%]">
        <p className="text-white/80 text-[11px] md:text-xs font-bold tracking-[0.2em] mb-1">
          {eyebrow}
        </p>
        <h3 className="text-white text-xl md:text-2xl font-extrabold leading-tight mb-1">
          {title}
        </h3>
        {subtitle && (
          <p className="text-white/85 text-xs md:text-sm mb-2">{subtitle}</p>
        )}
        {perk && (
          <span className="inline-flex items-center gap-1 bg-white/20 text-white text-[11px] md:text-xs font-medium px-2.5 py-1 rounded-full">
            <FaTruck size={10} /> {perk}
          </span>
        )}
      </div>

      <div className="relative z-10 flex flex-col items-end gap-2 shrink-0">
        <span className="bg-white rounded-lg px-3 py-2 text-center leading-none shadow">
          <span className={`block text-[10px] font-semibold ${s.accent}`}>UP TO</span>
          <span className={`block text-lg md:text-xl font-black ${s.accent}`}>
            {discount}
          </span>
        </span>
        <span className="text-white text-xs md:text-sm font-semibold underline underline-offset-2">
          Shop Now →
        </span>
      </div>
    </Link>
  );
};

/**
 * Example stack — drop this on the home page to get the same
 * "many banners, one after another" density as the real app feed.
 * Swap eyebrow/title/discount/theme per card to create new variants
 * without writing new components each time.
 */
export const PromoFeed = () => {
  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto py-4">
      <PromoCard
        theme="sunset"
        eyebrow="SALE IS LIVE"
        title="Payday Sale"
        subtitle="22nd – 31st July"
        discount="80%"
        perk="Free Delivery"
        Icon={FaBolt}
        to="/products?campaign=payday"
      />
      <PromoCard
        theme="carnival"
        eyebrow="EARN & REDEEM"
        title="Coins Carnival"
        subtitle="Win free gifts every day"
        discount="70%"
        perk="Daily Prizes"
        Icon={FaGift}
        to="/products?campaign=coins"
      />
      <PromoCard
        theme="home"
        eyebrow="HOME & LIVING"
        title="Create a Home You Love"
        subtitle="Curtains • Wall Clocks • Rugs • Decor"
        discount="45%"
        perk="Voucher Max"
        Icon={FaCouch}
        to="/products?category=home"
      />
      <PromoCard
        theme="electric"
        eyebrow="TUESDAY & WEDNESDAY"
        title="Electrical Deals"
        subtitle="Fans • Speakers • Kitchen Appliances"
        discount="51%"
        Icon={FaPlug}
        to="/products?category=electronics"
      />
      <PromoCard
        theme="brand"
        eyebrow="BRAND DAY"
        title="Global Brands, One Place"
        subtitle="Official warranty on every order"
        discount="30%"
        Icon={FaGem}
        to="/products?campaign=brand-day"
      />
    </div>
  );
};

export default PromoCard;