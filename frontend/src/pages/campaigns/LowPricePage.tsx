// src/pages/campaigns/LowPricePage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  images: { url: string; alt: string }[];
  rating?: number;
  sold?: number;
}

const ProductCard = ({ p }: { p: Product }) => (
  <Link
    to={`/product/${p._id}`}
    className="relative bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col"
  >
    {p.discountPercentage ? (
      <span className="absolute top-2 left-2 z-10 bg-rose-600 text-white text-xs font-bold px-2 py-0.5 rounded">
        -{p.discountPercentage}%
      </span>
    ) : null}
    <img
      src={p.images?.[0]?.url}
      alt={p.images?.[0]?.alt || p.name}
      className="w-full aspect-square object-cover"
      onError={(e) => {
        (e.target as HTMLImageElement).src = "/placeholder-phone.png";
      }}
    />
    <div className="p-2 flex flex-col gap-0.5">
      <p className="text-xs text-gray-700 truncate">{p.name}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-rose-600 font-bold text-sm">
          ৳{(p.discountPrice ?? p.price).toLocaleString()}
        </span>
        {p.discountPrice && (
          <span className="text-gray-400 line-through text-xs">
            ৳{p.price.toLocaleString()}
          </span>
        )}
      </div>
      {p.rating && (
        <span className="text-[11px] text-gray-500">
          ★{p.rating} {p.sold ? `| ${p.sold} Sold` : ""}
        </span>
      )}
    </div>
  </Link>
);

const ProductGridSkeleton = () => (
  <div className="grid grid-cols-2 gap-2 px-4 py-3">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="animate-pulse bg-gray-100 rounded-lg aspect-square" />
    ))}
  </div>
);

const LowPricePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/api/products", {
          params: { tag: "low-price", limit: 40 },
        });
        setProducts(res.data.products);
      } catch (err) {
        console.error(err);
        setError("Failed to load low price products.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-10">
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-4 flex items-center gap-3">
        <Link to="/" className="text-2xl leading-none">‹</Link>
        <h1 className="font-bold text-lg">As Low As TK 65</h1>
      </div>

      {/* Category tabs (static placeholders) */}
      <div className="flex gap-4 px-4 py-3 overflow-x-auto no-scrollbar border-b border-gray-100 text-sm font-medium text-gray-700">
        <span className="text-rose-600 border-b-2 border-rose-600 pb-1 whitespace-nowrap">
          Tools, DIY & Outdoor
        </span>
        <span className="whitespace-nowrap">Choice Deals</span>
        <span className="whitespace-nowrap">Health & Beauty</span>
      </div>

      {loading && <ProductGridSkeleton />}

      {error && <p className="text-center text-red-500 py-8">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No low price products found yet.
        </p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-2 gap-2 px-4 py-3">
          {products.map((p) => (
            <ProductCard key={p._id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LowPricePage;