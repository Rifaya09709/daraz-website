// src/pages/campaigns/BuyMoreSaveMorePage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaEllipsisH } from "react-icons/fa";
import api from "@/lib/api";

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  images: { url: string; alt: string }[];
  rating?: number;
  totalReviews?: number;
  sold?: number;
}

const CATEGORY_ICONS = [
  { label: "Fashion", category: "Women's Fashion" },
  { label: "Motor", category: "Automotive & Motorbike" },
  { label: "Jewelry", category: "Watches, Bags & Jewellery" },
  { label: "Outdoor Sports", category: "Sports & Outdoor" },
  { label: "Electronics", category: "Electronic Devices" },
];

const PICK_YOU_LIKE = [
  { label: "Fashion", category: "Women's Fashion" },
  { label: "Electronics", category: "Electronic Devices" },
  { label: "Lifestyle", category: "Home & Lifestyle" },
];

const TABS = [
  { label: "New Arrival", emoji: "🔔" },
  { label: "Fashion", emoji: "👗" },
  { label: "Electronics", emoji: "⌚" },
  { label: "Beauty", emoji: "💄" },
];

const ProductCard = ({
  p,
  inCart,
  onAdd,
}: {
  p: Product;
  inCart: boolean;
  onAdd: (p: Product) => void;
}) => (
  <div className="bg-white rounded-lg border border-gray-100 overflow-hidden flex flex-col">
    <Link to={`/product/${p._id}`}>
      <img
        src={p.images?.[0]?.url}
        alt={p.images?.[0]?.alt || p.name}
        className="w-full aspect-square object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/placeholder-product.png";
        }}
      />
    </Link>
    <div className="p-2.5 flex flex-col gap-1">
      <Link to={`/product/${p._id}`}>
        <p className="text-sm text-gray-800 line-clamp-2 leading-tight">{p.name}</p>
      </Link>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-rose-600 font-bold text-lg">
          ৳{(p.discountPrice ?? p.price).toLocaleString()}
        </span>
        {p.discountPercentage ? (
          <span className="text-rose-500 bg-rose-50 text-xs font-semibold px-1.5 py-0.5 rounded">
            -{p.discountPercentage}%
          </span>
        ) : null}
      </div>
      {p.discountPrice && (
        <span className="text-gray-400 line-through text-xs">
          ৳{p.price.toLocaleString()}
        </span>
      )}
      <span className="inline-block bg-orange-50 text-orange-600 text-[11px] font-medium px-2 py-1 rounded w-fit mt-1">
        FreeShipping over 2 pieces
      </span>
      {p.rating ? (
        <span className="text-[11px] text-gray-500">
          ★{p.rating} {p.totalReviews ? `(${p.totalReviews})` : ""}{" "}
          {p.sold ? `| ${p.sold} Sold` : ""}
        </span>
      ) : p.sold ? (
        <span className="text-[11px] text-gray-500">{p.sold} Sold</span>
      ) : null}
    </div>
    <button
      onClick={() => onAdd(p)}
      className="absolute" // placeholder removed below, replaced inline
      style={{ display: "none" }}
    />
    <button
      onClick={() => onAdd(p)}
      className={`m-2.5 mt-0 flex items-center justify-center gap-1 rounded-md py-2 text-sm font-semibold ${
        inCart ? "bg-gray-200 text-gray-500" : "bg-orange-500 text-white"
      }`}
    >
      <FaShoppingCart size={12} />
      {inCart ? "Added" : "Add"}
    </button>
  </div>
);

const GridSkeleton = () => (
  <div className="grid grid-cols-2 gap-3 px-4 py-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="animate-pulse bg-gray-100 rounded-lg aspect-square" />
    ))}
  </div>
);

const BuyMoreSaveMorePage = () => {
  const [activeTab, setActiveTab] = useState("New Arrival");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        let params: Record<string, string | number> = { limit: 20 };
        if (activeTab === "New Arrival") {
          const res = await api.get("/api/products/latest");
          setProducts(res.data.products || []);
          setLoading(false);
          return;
        } else if (activeTab === "Fashion") {
          params = { category: "Women's Fashion", limit: 20 };
        } else if (activeTab === "Electronics") {
          params = { category: "Electronic Devices", limit: 20 };
        } else if (activeTab === "Beauty") {
          params = { category: "Health & Beauty", limit: 20 };
        }

        const res = await api.get("/api/products", { params });
        setProducts(res.data.products || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeTab]);

  const handleAddToCart = (p: Product) => {
    setCart((prev) => {
      if (prev.some((item) => item._id === p._id)) return prev;
      return [...prev, p];
    });
  };

  const cartTotal = cart.reduce(
    (sum, p) => sum + (p.discountPrice ?? p.price),
    0
  );

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-24 relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-100 to-yellow-50 px-4 py-4">
        <div className="flex items-center gap-2 mb-2">
          <Link to="/" className="text-2xl leading-none">‹</Link>
          <p className="font-black text-lg text-gray-800">BuyMoreSaveMore</p>
          <span className="text-xs text-purple-600 font-semibold">449k+ users bought</span>
        </div>
        <p className="text-2xl font-black text-gray-900">
          Buy 2 save <span className="text-orange-500">5%</span> + Free Shipping
        </p>
        <p className="text-xs text-gray-500 mt-1">
          14-Day Free Return &nbsp;|&nbsp; On-time Guarantee
        </p>
      </div>

      {/* Search bar */}
      <div className="sticky top-0 z-20 bg-white px-4 py-2 flex items-center gap-2 border-b border-gray-100">
        <div className="flex-1 flex items-center bg-gray-50 rounded-full overflow-hidden border border-gray-200">
          <input
            placeholder="search here"
            className="flex-1 px-4 py-2 text-sm bg-transparent outline-none"
          />
          <button className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold">
            <FaSearch size={12} />
          </button>
        </div>
        <FaEllipsisH className="text-gray-500" size={18} />
      </div>

      {/* Category icons */}
      <div className="flex gap-6 px-4 py-4 overflow-x-auto no-scrollbar">
        {CATEGORY_ICONS.map((c) => (
          <Link
            key={c.label}
            to={`/search?category=${encodeURIComponent(c.category)}`}
            className="flex flex-col items-center gap-1.5 shrink-0"
          >
            <span className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-bold text-center px-1">
              {c.label.split(" ")[0]}
            </span>
            <span className="text-xs text-gray-700 w-16 text-center leading-tight">
              {c.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Pick You Like */}
      <div className="px-4">
        <h2 className="font-bold text-lg underline decoration-orange-300 decoration-2 underline-offset-4 mb-3">
          Pick You Like
        </h2>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {PICK_YOU_LIKE.map((item) => (
            <Link
              key={item.label}
              to={`/search?category=${encodeURIComponent(item.category)}`}
              className="w-32 h-44 shrink-0 rounded-lg overflow-hidden relative bg-gray-100 flex items-end"
            >
              <span className="absolute bottom-2 left-2 right-2 bg-white/90 text-center text-xs font-semibold py-1 rounded">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 px-4 mt-4 border-b border-gray-100 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`pb-2 pt-1 text-sm font-medium whitespace-nowrap flex items-center gap-1 ${
              activeTab === tab.label
                ? "text-orange-600 border-b-2 border-orange-500"
                : "text-gray-500"
            }`}
          >
            <span>{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {error && <p className="text-center text-sm text-red-500 py-3">{error}</p>}

      {/* Product grid */}
      {loading ? (
        <GridSkeleton />
      ) : products.length === 0 ? (
        <p className="text-center text-gray-400 py-10">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4 py-3">
          {products.map((p) => (
            <ProductCard
              key={p._id}
              p={p}
              inCart={cart.some((item) => item._id === p._id)}
              onAdd={handleAddToCart}
            />
          ))}
        </div>
      )}

      {/* Sticky bottom cart bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto">
        <div className="bg-yellow-50 text-center text-sm font-semibold py-2 border-t border-yellow-200">
          Any 2 for <span className="font-bold">5% Off</span> + Free Shipping
        </div>
        <div className="bg-white border-2 border-orange-500 rounded-full mx-3 mb-3 px-4 py-2 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <div className="relative">
              <FaShoppingCart className="text-orange-500" size={22} />
              <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {cart.length}
              </span>
            </div>
            <span className="text-orange-600 font-bold">
              ৳{cartTotal.toLocaleString()}
            </span>
          </div>
          <Link
            to="/cart"
            className="bg-orange-500 text-white font-bold text-sm px-6 py-2 rounded-full"
          >
            Check Out({cart.length})
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyMoreSaveMorePage;