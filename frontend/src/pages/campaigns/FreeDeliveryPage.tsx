import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaChevronLeft,
  FaSearch,
  FaShareAlt,
  FaEllipsisH,
  FaTruck,
  FaTshirt,
  FaTv,
  FaShoppingBasket,
  FaCouch,
  FaStar,
  FaSearchPlus,
} from "react-icons/fa";

import { formatCurrency } from "../../utils/formatCurrency";
// import axios from "axios"; // uncomment once wired to the real API

/* -------------------------------------------------------------------------
 * Category quick-links row (Delivery / Fashion / Electronics / FMCG / Lifestyle)
 * These map to the same categoryLabelToDbCategory entries used elsewhere
 * (see src/config/categories.ts -> "free-delivery campaign" block):
 *   FMCG -> "Groceries & Pets", Lifestyle -> "Home & Lifestyle"
 * ---------------------------------------------------------------------- */
const CATEGORY_LINKS = [
  { label: "Delivery", Icon: FaTruck, filter: undefined },
  { label: "Fashion", Icon: FaTshirt, filter: "Fashion" },
  { label: "Electronics", Icon: FaTv, filter: "Electronics" },
  { label: "FMCG", Icon: FaShoppingBasket, filter: "FMCG" },
  { label: "Lifestyle", Icon: FaCouch, filter: "Lifestyle" },
];

/* -------------------------------------------------------------------------
 * Vouchers — replace with a real fetch (e.g. GET /api/vouchers?campaign=free-delivery)
 * ---------------------------------------------------------------------- */
interface Voucher {
  id: string;
  amount: number;
  title: string;
  dateRange: string;
  minSpend: number;
  copies: number; // "x2" badge
}

const VOUCHERS: Voucher[] = [
  { id: "v1", amount: 40, title: "Save on Delivery", dateRange: "01/07/2026-31/07/2026", minSpend: 99, copies: 2 },
  { id: "v2", amount: 110, title: "Selected Sellers", dateRange: "01/07/2026-31/07/2026", minSpend: 699, copies: 2 },
];

/* -------------------------------------------------------------------------
 * "Free Shipping Deals for You" grid — this card layout is intentionally
 * different from the home-feed ProductCard: PAYDAY SALE ribbon instead of
 * Free Delivery/Coins badges, a magnifier icon top-right, and a sold count
 * next to the rating. Replace DealProduct/DEALS with real product data,
 * e.g. GET /api/products?tag=free-delivery
 * ---------------------------------------------------------------------- */
interface DealProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating: number;
  totalReviews: number;
  sold: number;
  onSale?: boolean; // shows the "PAYDAY SALE" ribbon
}

const DEALS: DealProduct[] = [];

const DealCard = ({ product }: { product: DealProduct }) => (
  <Link
    to={`/product/${product.id}`}
    className="group bg-white rounded-lg border border-gray-100 hover:shadow-lg transition-shadow duration-200 overflow-hidden block"
  >
    <div className="relative aspect-square bg-gray-50">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
      />
      <span className="absolute top-2 right-2 w-6 h-6 rounded bg-white/90 flex items-center justify-center text-gray-500 shadow">
        <FaSearchPlus size={11} />
      </span>
      {product.onSale && (
        <span className="absolute bottom-2 left-2 bg-lime-300 text-emerald-900 text-[9px] font-extrabold uppercase leading-tight px-1.5 py-1 -skew-x-6">
          Payday
          <br />
          Sale
        </span>
      )}
    </div>

    <div className="p-2.5">
      <h3 className="text-[13px] text-gray-700 line-clamp-2 leading-snug h-9">
        {product.name}
      </h3>

      <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
        <span className="text-rose-600 font-bold text-[15px]">
          {formatCurrency(product.price)}
        </span>
        {product.discountPercentage ? (
          <span className="bg-rose-50 text-rose-500 text-[10px] font-semibold px-1 py-0.5 rounded">
            -{product.discountPercentage}%
          </span>
        ) : null}
      </div>

      {product.originalPrice && (
        <span className="text-gray-400 text-xs line-through">
          {formatCurrency(product.originalPrice)}
        </span>
      )}

      <div className="mt-1 flex items-center gap-1 text-[11px] text-gray-400">
        <FaStar size={9} className="text-yellow-400" />
        <span>
          {product.rating.toFixed(1)}
          {product.totalReviews > 0 ? `(${product.totalReviews})` : ""}
        </span>
        {product.sold > 0 && (
          <>
            <span>|</span>
            <span>{product.sold >= 1000 ? `${(product.sold / 1000).toFixed(1)}K` : product.sold} Sold</span>
          </>
        )}
      </div>
    </div>
  </Link>
);

const FreeDeliveryPage = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState<DealProduct[]>(DEALS);

  useEffect(() => {
    // Replace with the real call, e.g.:
    // axios.get("/api/products", { params: { tag: "free-delivery" } })
    //   .then((res) => setDeals(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-3 py-3 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-1 text-gray-700">
          <FaChevronLeft size={18} />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Free Shipping</h1>
        <div className="flex items-center gap-4 text-gray-700">
          <FaSearch size={16} />
          <FaShareAlt size={16} />
          <FaEllipsisH size={16} />
        </div>
      </div>

      {/* Category quick links */}
      <div className="flex items-start justify-between px-3 py-4 bg-white">
        {CATEGORY_LINKS.map(({ label, Icon, filter }) => (
          <Link
            key={label}
            to={filter ? `/campaign/free-delivery?category=${encodeURIComponent(filter)}` : "#"}
            className="flex flex-col items-center gap-1.5 w-16 text-center"
          >
            <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 text-white">
              <Icon size={22} />
            </span>
            <span className="text-xs text-gray-700">{label}</span>
          </Link>
        ))}
      </div>

      {/* Voucher collection banner */}
      <div className="bg-emerald-600 text-white flex items-center justify-between px-4 py-4 mt-2">
        <h2 className="font-bold text-base">Collect & Get 110 tk off on Delivery</h2>
        <button className="flex items-center gap-1 bg-white/15 hover:bg-white/25 transition-colors rounded-full px-3 py-1.5 text-sm font-semibold">
          More
          <FaChevronLeft size={10} className="rotate-180" />
        </button>
      </div>

      {/* Voucher cards */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-3 py-4 bg-white">
        {VOUCHERS.map((v) => (
          <div
            key={v.id}
            className="relative shrink-0 w-64 border border-emerald-100 rounded-lg flex"
          >
            <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl">
              x{v.copies}
            </span>

            <div className="w-24 flex flex-col items-center justify-center border-r border-dashed border-emerald-200 px-2 py-3">
              <span className="text-emerald-600 font-extrabold text-xl">
                {formatCurrency(v.amount)}
              </span>
            </div>

            <div className="flex-1 px-3 py-3 flex flex-col justify-between">
              <div>
                <p className="font-semibold text-gray-800 text-sm">{v.title}</p>
                <p className="text-[11px] text-gray-500">{v.dateRange}</p>
                <p className="text-[11px] text-gray-500 mt-1">
                  Min. Spend <span className="line-through">{formatCurrency(v.minSpend)}</span>
                </p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <button className="text-[11px] text-emerald-600 underline">T&C</button>
                <button className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  Collect x{v.copies}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3-step how-to */}
      <div className="grid grid-cols-3 gap-2 px-3 py-4 bg-white mt-2">
        {[
          { step: 1, caption: "Collect Free Delivery Vouchers" },
          { step: 2, caption: "Look for items with the Free Delivery label" },
          { step: 3, caption: "Check out automatically with Free Delivery!" },
        ].map(({ step, caption }) => (
          <div key={step} className="flex flex-col items-center text-center gap-2">
            <div className="w-full aspect-[3/4] bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-300 text-4xl font-bold">
              {step}
            </div>
            <p className="text-xs font-semibold text-gray-800">Step {step}</p>
            <p className="text-[11px] text-gray-500 leading-snug">{caption}</p>
          </div>
        ))}
      </div>

      {/* Deals section header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg px-4 py-3 mt-2">
        Free Shipping Deals for You
      </div>

      {/* Deals grid */}
      <div className="grid grid-cols-2 gap-2 px-2 py-3 bg-gray-50">
        {deals.length === 0 ? (
          <p className="col-span-2 text-center text-sm text-gray-400 py-10">
            No deals loaded yet — wire this up to GET /api/products?tag=free-delivery
          </p>
        ) : (
          deals.map((d) => <DealCard key={d.id} product={d} />)
        )}
      </div>
    </div>
  );
};

export default FreeDeliveryPage;
 