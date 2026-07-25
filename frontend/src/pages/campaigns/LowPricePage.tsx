import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaChevronLeft,
  FaSearch,
  FaEllipsisH,
  FaFire,
  FaStar,
  FaShoppingCart,
  FaTruck,
} from "react-icons/fa";

import { formatCurrency } from "../../utils/formatCurrency";
// import axios from "axios"; // uncomment once wired to the real API

/* -------------------------------------------------------------------------
 * Top category strip (Tools DIY & Outdoor / Choice Deals / Health & Beauty /
 * Laundry / Kitchen & Dining ...) — same names as the "low-price campaign"
 * block in src/config/categories.ts (categoryLabelToDbCategory).
 * ---------------------------------------------------------------------- */
const TOP_TABS = [
  "Tools, DIY & Outdoor",
  "Choice Deals",
  "Health & Beauty",
  "Laundry & Household",
  "Kitchen & Dining",
];

/* Secondary filter pills row */
const FILTER_PILLS = [
  { label: "টং দোকান", emoji: "🥤" },
  { label: "Hot Deals", icon: FaFire },
  { label: "Groceries" },
  { label: "Health & Beauty" },
];

/* -------------------------------------------------------------------------
 * "Choice Deals" hero category cards (horizontal scroll)
 * ---------------------------------------------------------------------- */
interface HeroCard {
  label: string;
  image?: string;
  isMainDeal?: boolean;
}

const HERO_CARDS: HeroCard[] = [
  { label: "Choice Deals", isMainDeal: true },
  { label: "Health & Beauty", image: "" },
  { label: "Laundry & House...", image: "" },
  { label: "Kitchen", image: "" },
];

/* -------------------------------------------------------------------------
 * Vouchers — replace with GET /api/vouchers?campaign=low-price
 * ---------------------------------------------------------------------- */
interface Voucher {
  id: string;
  percentOff: number;
  title: string;
  dateRange: string;
  minSpend: number;
}

const VOUCHERS: Voucher[] = [
  { id: "v1", percentOff: 10, title: "CHOICE Voucher", dateRange: "22/07/2026-31/07/2026", minSpend: 399 },
  { id: "v2", percentOff: 4, title: "CHOICE Payday...", dateRange: "24/07/2026-30/07/2026", minSpend: 499 },
];

/* -------------------------------------------------------------------------
 * Product grid — replace with GET /api/products?tag=low-price
 * ---------------------------------------------------------------------- */
interface ChoiceProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  discountPercentage?: number;
  rating: number;
  totalReviews: number;
  sold: number;
  freeDelivery?: boolean;
  priceDropLimited?: boolean; // shows "🔥 Price Drops,Limited"
}

const PRODUCTS: ChoiceProduct[] = [];

const ChoiceProductCard = ({ product }: { product: ChoiceProduct }) => (
  <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
    <Link to={`/product/${product.id}`} className="block relative aspect-square bg-gray-50">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover"
      />
      {product.freeDelivery && (
        <span className="absolute bottom-0 left-0 flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1">
          <FaTruck size={10} />
          FREE DELIVERY
        </span>
      )}
    </Link>

    <div className="p-2.5">
      <div className="flex items-center gap-1 mb-1">
        <span className="bg-lime-300 text-emerald-900 text-[9px] font-extrabold uppercase px-1 py-0.5 -skew-x-6 shrink-0">
          Payday
          <br />
          Sale
        </span>
        <span className="bg-amber-400 text-black text-[10px] font-extrabold italic px-1.5 py-0.5 rounded shrink-0">
          CHOICE
        </span>
      </div>

      <Link to={`/product/${product.id}`}>
        <h3 className="text-[13px] text-gray-700 line-clamp-2 leading-snug h-9">
          {product.name}
        </h3>
      </Link>

      <div className="mt-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-900 font-bold text-[17px]">
            {formatCurrency(product.price)}
          </span>
          {product.discountPercentage ? (
            <span className="bg-rose-50 text-rose-500 text-[10px] font-semibold px-1 py-0.5 rounded">
              -{product.discountPercentage}%
            </span>
          ) : null}
        </div>
        <button className="w-7 h-7 rounded-md bg-orange-500 text-white flex items-center justify-center shrink-0">
          <FaShoppingCart size={12} />
        </button>
      </div>

      {product.priceDropLimited && (
        <p className="mt-1 flex items-center gap-1 text-orange-600 text-[11px] font-semibold">
          <FaFire size={10} />
          Price Drops,Limited
        </p>
      )}

      <div className="mt-1 flex items-center gap-1 text-[11px] text-gray-400">
        <FaStar size={9} className="text-yellow-400" />
        <span>
          {product.rating.toFixed(1)} ({product.totalReviews >= 1000 ? `${(product.totalReviews / 1000).toFixed(1)}k` : product.totalReviews})
        </span>
        {product.sold > 0 && (
          <>
            <span>|</span>
            <span>{product.sold >= 1000 ? `${(product.sold / 1000).toFixed(1)}k` : product.sold} sold</span>
          </>
        )}
      </div>
    </div>
  </div>
);

const LowPricePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ChoiceProduct[]>(PRODUCTS);
  const [cartCount] = useState(0);
  const [cartTotal] = useState(0);

  useEffect(() => {
    // Replace with the real call, e.g.:
    // axios.get("/api/products", { params: { tag: "low-price" } })
    //   .then((res) => setProducts(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gradient-to-r from-amber-300 to-yellow-400 px-3 pt-3 pb-2">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-900">
            <FaChevronLeft size={18} />
          </button>
          <h1 className="text-lg font-extrabold text-gray-900 flex-1">
            As Low As TK 65
          </h1>
          <div className="flex-1 max-w-[9rem] bg-white rounded-full flex items-center px-3 py-1.5">
            <span className="text-gray-400 text-xs truncate flex-1">Search in Daraz</span>
            <FaSearch size={14} className="text-gray-500" />
          </div>
          <FaEllipsisH size={16} className="text-gray-900" />
        </div>

        {/* Top category tabs */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar mt-2 text-sm font-medium text-gray-800">
          {TOP_TABS.map((tab) => (
            <span key={tab} className="whitespace-nowrap py-1">
              {tab}
            </span>
          ))}
        </div>
      </div>

      {/* Buy 3 / Buy 5 bar */}
      <div className="bg-amber-50 text-center text-sm font-medium text-gray-800 px-3 py-2">
        Buy 3 for <b>Free Shipping</b>, Buy 5 get <b>1 Free Gift</b> (till stock lasts)!
      </div>

      {/* Everyday Low Price hero */}
      <div className="bg-gradient-to-b from-yellow-300 to-amber-300 px-3 pt-4 pb-3">
        <p className="text-center text-orange-600 font-extrabold text-xl mb-3">
          Everyday Low Price
        </p>
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {HERO_CARDS.map((card) =>
            card.isMainDeal ? (
              <div
                key={card.label}
                className="shrink-0 w-32 h-36 rounded-xl border-2 border-orange-500 bg-yellow-100 flex flex-col items-center justify-center text-center px-2"
              >
                <p className="text-orange-600 font-extrabold text-sm leading-tight">
                  CHOICE
                  <br />
                  DEALS
                </p>
                <p className="text-[10px] text-gray-700 mt-2 font-medium">
                  Upto 80% Off
                  <br />
                  Choice Deals
                </p>
              </div>
            ) : (
              <Link
                key={card.label}
                to="#"
                className="shrink-0 w-32 h-36 rounded-xl bg-white overflow-hidden flex flex-col"
              >
                <div className="flex-1 bg-gray-50" />
                <p className="text-[11px] font-medium text-gray-800 text-center py-2 px-1">
                  {card.label}
                </p>
              </Link>
            )
          )}
        </div>
      </div>

      {/* Vouchers */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-3 py-4 bg-amber-100">
        {VOUCHERS.map((v) => (
          <div key={v.id} className="shrink-0 w-64 bg-white rounded-lg flex overflow-hidden">
            <div className="w-20 flex flex-col items-center justify-center border-r border-dashed border-gray-200 px-2 py-3">
              <span className="text-rose-600 font-extrabold text-lg leading-none">
                {v.percentOff}%
              </span>
              <span className="text-rose-600 font-extrabold text-xs">OFF</span>
            </div>
            <div className="flex-1 px-3 py-3">
              <p className="font-semibold text-gray-800 text-sm">{v.title}</p>
              <p className="text-[11px] text-gray-500">{v.dateRange}</p>
              <p className="text-[11px] text-gray-500 mt-1">
                Min. Spend <span className="line-through">{formatCurrency(v.minSpend)}</span>
              </p>
              <div className="flex items-center justify-between mt-2">
                <button className="text-[11px] text-gray-400 underline">T&C</button>
                <button className="bg-rose-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                  Collect
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-3 py-3">
        {FILTER_PILLS.map(({ label, icon: Icon, emoji }) => (
          <button
            key={label}
            className="shrink-0 flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5 text-sm text-gray-700"
          >
            {emoji && <span>{emoji}</span>}
            {Icon && <Icon size={12} className="text-orange-500" />}
            {label}
          </button>
        ))}
      </div>
      <div className="px-3 pb-2">
        <span className="inline-flex items-center gap-1 bg-amber-100 rounded-full px-3 py-1.5 text-sm text-gray-700">
          <span>৳</span> Tk. 99
        </span>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-2 px-2 py-3 bg-gray-50">
        {products.length === 0 ? (
          <p className="col-span-2 text-center text-sm text-gray-400 py-10">
            No products loaded yet — wire this up to GET /api/products?tag=low-price
          </p>
        ) : (
          products.map((p) => <ChoiceProductCard key={p.id} product={p} />)
        )}
      </div>

      {/* Sticky cart / checkout footer */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 flex items-center justify-between px-4 py-2.5 z-20">
        <div className="relative flex items-center gap-2">
          <span className="relative">
            <span className="w-9 h-9 rounded-md bg-amber-400 flex items-center justify-center text-black font-extrabold text-[10px]">
              CHOICE
            </span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </span>
          <span className="text-orange-600 font-bold text-lg">
            {formatCurrency(cartTotal)}
          </span>
        </div>
        <button
          disabled={cartCount === 0}
          className="bg-gray-200 text-gray-400 disabled:cursor-not-allowed enabled:bg-rose-600 enabled:text-white font-semibold px-8 py-2.5 rounded-full"
        >
          Check Out
        </button>
      </div>
    </div>
  );
};

export default LowPricePage;