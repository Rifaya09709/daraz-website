// src/pages/campaigns/DarazLookPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaSearch, FaEllipsisH } from "react-icons/fa";
import api from "@/lib/api";

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  images: { url: string; alt: string }[];
  sold?: number;
  subCategory?: string;
}

const CATEGORY_ICONS = [
  { label: "Sarees", subCategory: "Unstitched Fabric" },
  { label: "Shalwar Kameez", subCategory: "Kurtas & Shalwar Kameez" },
  { label: "Innerwear", subCategory: "Inner Wear" },
  { label: "Bags", subCategory: "Mens Bags" },
  { label: "Watches", subCategory: "Men's Watches" },
  { label: "Jewellery", subCategory: "Womens Jewellery" },
];

const TABS = ["For You", "Salwar Kameez", "Saree Love", "Hair Accessories"];

const ProductCard = ({ p }: { p: Product }) => (
  <Link
    to={`/product/${p._id}`}
    className="relative bg-white rounded-lg overflow-hidden flex flex-col"
  >
    <button
      onClick={(e) => e.preventDefault()}
      className="absolute top-2 right-2 z-10 bg-white/90 rounded-full p-1.5 shadow"
    >
      <FaHeart size={12} className="text-gray-300" />
    </button>
    <img
      src={p.images?.[0]?.url}
      alt={p.images?.[0]?.alt || p.name}
      className="w-full aspect-square object-cover"
      onError={(e) => {
        (e.target as HTMLImageElement).src = "/placeholder-product.png";
      }}
    />
    <div className="p-2 flex flex-col gap-0.5">
      <p className="text-xs text-gray-700 line-clamp-2 leading-tight">{p.name}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="font-bold text-sm text-gray-900">
          ৳{(p.discountPrice ?? p.price).toLocaleString()}
        </span>
        {p.discountPercentage ? (
          <span className="text-purple-600 text-xs font-semibold">
            {p.discountPercentage}% OFF
          </span>
        ) : null}
      </div>
      {p.discountPrice && (
        <span className="text-gray-400 line-through text-xs">
          ৳{p.price.toLocaleString()}
        </span>
      )}
      {p.sold ? (
        <span className="text-[11px] text-gray-500">{p.sold} sold</span>
      ) : null}
    </div>
  </Link>
);

const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between px-4 pt-5 pb-2">
    <h2 className="font-bold text-lg underline decoration-purple-300 decoration-2 underline-offset-4">
      {title}
    </h2>
    <span className="text-sm text-gray-500">View More ›</span>
  </div>
);

const RowSkeleton = ({ cols = 3 }: { cols?: number }) => (
  <div className={`grid gap-3 px-4 py-2`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
    {Array.from({ length: cols }).map((_, i) => (
      <div key={i} className="animate-pulse bg-gray-100 rounded-lg aspect-square" />
    ))}
  </div>
);

const DarazLookPage = () => {
  const [activeTab, setActiveTab] = useState("For You");
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [dailyNew, setDailyNew] = useState<Product[]>([]);
  const [tabProducts, setTabProducts] = useState<Product[]>([]);
  const [loadingTop, setLoadingTop] = useState(true);
  const [loadingTab, setLoadingTab] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopSections = async () => {
      try {
        setLoadingTop(true);
        setError(null);
        const [saleRes, newRes] = await Promise.all([
          api.get("/api/products", {
            params: { category: "Women's Fashion", limit: 6 },
          }),
          api.get("/api/products/latest"),
        ]);
        setSaleProducts(saleRes.data.products || []);
        setDailyNew((newRes.data.products || []).slice(0, 6));
      } catch (err) {
        console.error(err);
        setError("Failed to load fashion products.");
      } finally {
        setLoadingTop(false);
      }
    };
    fetchTopSections();
  }, []);

  useEffect(() => {
    const fetchTab = async () => {
      try {
        setLoadingTab(true);
        const params: Record<string, string | number> =
          activeTab === "For You"
            ? { category: "Women's Fashion", limit: 20 }
            : { category: "Women's Fashion", subCategory: activeTab, limit: 20 };
        const res = await api.get("/api/products", { params });
        setTabProducts(res.data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTab(false);
      }
    };
    fetchTab();
  }, [activeTab]);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-300 via-pink-200 to-purple-200 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-2xl leading-none">‹</Link>
          <h1 className="font-black text-xl tracking-tight">DarazLOOK</h1>
        </div>
        <div className="flex items-center gap-4 text-gray-700">
          <FaHeart size={18} />
          <FaSearch size={18} />
          <FaEllipsisH size={18} />
        </div>
      </div>

      {/* Category icon row */}
      <div className="flex gap-5 px-4 py-4 overflow-x-auto no-scrollbar">
        {CATEGORY_ICONS.map((c) => (
          <Link
            key={c.label}
            to={`/search?category=Women's Fashion&subCategory=${encodeURIComponent(c.subCategory)}`}
            className="flex flex-col items-center gap-1.5 shrink-0"
          >
            <span className="w-16 h-16 rounded-lg bg-pink-50 flex items-center justify-center text-[10px] font-bold text-purple-600 text-center px-1">
              {c.label.split(" ")[0]}
            </span>
            <span className="text-xs text-gray-700 w-16 text-center leading-tight">{c.label}</span>
          </Link>
        ))}
      </div>

      {error && <p className="text-center text-sm text-red-500 py-2">{error}</p>}

      {/* Style On Sale */}
      <SectionHeader title="Style On Sale" />
      {loadingTop ? (
        <RowSkeleton cols={3} />
      ) : saleProducts.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-4">No products found.</p>
      ) : (
        <div className="grid grid-cols-3 gap-3 px-4">
          {saleProducts.slice(0, 3).map((p) => (
            <ProductCard key={p._id} p={p} />
          ))}
        </div>
      )}

      {/* Daily New */}
      <SectionHeader title="Daily New" />
      {loadingTop ? (
        <RowSkeleton cols={2} />
      ) : dailyNew.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-4">No products found.</p>
      ) : (
        <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar pb-2">
          {dailyNew.map((p) => (
            <div key={p._id} className="w-36 shrink-0">
              <ProductCard p={p} />
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-6 px-4 mt-5 border-b border-gray-100 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-medium whitespace-nowrap ${
              activeTab === tab
                ? "text-rose-600 border-b-2 border-rose-600"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content grid */}
      {loadingTab ? (
        <RowSkeleton cols={2} />
      ) : tabProducts.length === 0 ? (
        <p className="text-center text-gray-400 py-8">No products found for this tab.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4 py-3">
          {tabProducts.map((p) => (
            <ProductCard key={p._id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DarazLookPage;